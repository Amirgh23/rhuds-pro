/**
 * useAdvancedServiceWorker Hook
 * Manages advanced service worker features in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  advancedServiceWorkerManager,
  registerAdvancedServiceWorker,
  requestBackgroundSync,
  requestPushNotificationPermission,
  sendPushNotification,
  unregisterServiceWorker,
} from '../utils/advanced-service-worker';

export interface UseAdvancedServiceWorkerOptions {
  enabled?: boolean;
  autoRegister?: boolean;
  enableBackgroundSync?: boolean;
  enablePushNotifications?: boolean;
}

export interface ServiceWorkerStatus {
  registered: boolean;
  active: boolean;
  backgroundSyncSupported: boolean;
  pushNotificationsSupported: boolean;
  pushSubscribed: boolean;
}

/**
 * Hook for managing advanced service worker features
 */
export function useAdvancedServiceWorker(options: UseAdvancedServiceWorkerOptions = {}) {
  const {
    enabled = true,
    autoRegister = true,
    enableBackgroundSync = true,
    enablePushNotifications = true,
  } = options;

  const [status, setStatus] = useState<ServiceWorkerStatus>({
    registered: false,
    active: false,
    backgroundSyncSupported: 'SyncManager' in window,
    pushNotificationsSupported: 'PushManager' in window,
    pushSubscribed: false,
  });

  const [cacheStats, setCacheStats] = useState({
    caches: 0,
    entries: 0,
    strategies: 0,
    backgroundSyncTasks: 0,
    pushNotifications: 0,
  });

  // Register service worker on mount
  useEffect(() => {
    if (!enabled || !autoRegister) return;

    registerAdvancedServiceWorker()
      .then((registration) => {
        if (registration) {
          setStatus((prev) => ({
            ...prev,
            registered: true,
            active: registration.active !== undefined,
          }));
        }
      })
      .catch((error) => {
        console.error('Failed to register service worker:', error);
      });
  }, [enabled, autoRegister]);

  // Update cache stats
  const updateCacheStats = useCallback(async () => {
    if (!enabled) return;

    try {
      const stats = await advancedServiceWorkerManager.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Failed to get cache stats:', error);
    }
  }, [enabled]);

  // Update cache stats periodically
  useEffect(() => {
    if (!enabled) return;

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 10000);
    return () => clearInterval(interval);
  }, [enabled, updateCacheStats]);

  // Request background sync
  const registerBackgroundSync = useCallback(
    async (tag: string) => {
      if (!enabled || !enableBackgroundSync) return;

      try {
        await requestBackgroundSync(tag);
        advancedServiceWorkerManager.registerBackgroundSync({
          tag,
          minInterval: 60000,
          maxRetries: 3,
        });
      } catch (error) {
        console.error('Failed to register background sync:', error);
      }
    },
    [enabled, enableBackgroundSync]
  );

  // Request push notification permission
  const subscribeToPushNotifications = useCallback(async () => {
    if (!enabled || !enablePushNotifications) return;

    try {
      const subscription = await requestPushNotificationPermission();
      if (subscription) {
        setStatus((prev) => ({
          ...prev,
          pushSubscribed: true,
        }));
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }, [enabled, enablePushNotifications]);

  // Send push notification
  const sendNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (!enabled || !status.pushSubscribed) return;

      try {
        await sendPushNotification(title, options);
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    },
    [enabled, status.pushSubscribed]
  );

  // Clear all caches
  const clearAllCaches = useCallback(async () => {
    if (!enabled) return;

    try {
      await advancedServiceWorkerManager.clearAllCaches();
      await updateCacheStats();
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }, [enabled, updateCacheStats]);

  // Clear specific cache
  const clearCache = useCallback(
    async (cacheName: string) => {
      if (!enabled) return;

      try {
        await advancedServiceWorkerManager.clearCache(cacheName);
        await updateCacheStats();
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    },
    [enabled, updateCacheStats]
  );

  // Get cache size
  const getCacheSize = useCallback(async () => {
    if (!enabled) return 0;

    try {
      return await advancedServiceWorkerManager.getCacheSize();
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }, [enabled]);

  // Unregister service worker
  const unregister = useCallback(async () => {
    if (!enabled) return;

    try {
      await unregisterServiceWorker();
      setStatus((prev) => ({
        ...prev,
        registered: false,
        active: false,
      }));
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
    }
  }, [enabled]);

  return {
    // Status
    status,
    cacheStats,

    // Operations
    registerBackgroundSync,
    subscribeToPushNotifications,
    sendNotification,
    clearAllCaches,
    clearCache,
    getCacheSize,
    unregister,
    updateCacheStats,

    // Config
    enabled,
  };
}

/**
 * Hook for background sync
 */
export function useBackgroundSync(tag: string) {
  const { registerBackgroundSync } = useAdvancedServiceWorker({
    enabled: true,
    enableBackgroundSync: true,
  });

  const register = useCallback(() => {
    registerBackgroundSync(tag);
  }, [tag, registerBackgroundSync]);

  return { register };
}

/**
 * Hook for push notifications
 */
export function usePushNotifications() {
  const { status, subscribeToPushNotifications, sendNotification } = useAdvancedServiceWorker({
    enabled: true,
    enablePushNotifications: true,
  });

  return {
    subscribed: status.pushSubscribed,
    supported: status.pushNotificationsSupported,
    subscribe: subscribeToPushNotifications,
    send: sendNotification,
  };
}

/**
 * Hook for cache management
 */
export function useCacheManagement() {
  const { cacheStats, clearAllCaches, clearCache, getCacheSize, updateCacheStats } =
    useAdvancedServiceWorker({
      enabled: true,
    });

  return {
    stats: cacheStats,
    clearAll: clearAllCaches,
    clear: clearCache,
    getSize: getCacheSize,
    updateStats: updateCacheStats,
  };
}

export default useAdvancedServiceWorker;
