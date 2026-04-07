/**
 * Advanced Service Worker Utilities
 * Implements advanced caching strategies and offline support
 */

export interface CacheStrategy {
  name: string;
  cacheName: string;
  networkFirst?: boolean;
  cacheFirst?: boolean;
  staleWhileRevalidate?: boolean;
  networkOnly?: boolean;
}

export interface BackgroundSyncConfig {
  tag: string;
  minInterval?: number;
  maxRetries?: number;
}

export interface PushNotificationConfig {
  title: string;
  options?: NotificationOptions;
}

/**
 * Cache strategies
 */
export const CACHE_STRATEGIES: Record<string, CacheStrategy> = {
  // Network first - try network, fallback to cache
  networkFirst: {
    name: 'Network First',
    cacheName: 'network-first-v1',
    networkFirst: true,
  },

  // Cache first - try cache, fallback to network
  cacheFirst: {
    name: 'Cache First',
    cacheName: 'cache-first-v1',
    cacheFirst: true,
  },

  // Stale while revalidate - return cache, update in background
  staleWhileRevalidate: {
    name: 'Stale While Revalidate',
    cacheName: 'stale-while-revalidate-v1',
    staleWhileRevalidate: true,
  },

  // Network only - always use network
  networkOnly: {
    name: 'Network Only',
    cacheName: 'network-only-v1',
    networkOnly: true,
  },
};

/**
 * Advanced Service Worker Manager
 */
export class AdvancedServiceWorkerManager {
  private strategies: Map<string, CacheStrategy> = new Map();
  private backgroundSyncTasks: Map<string, BackgroundSyncConfig> = new Map();
  private pushNotifications: Map<string, PushNotificationConfig> = new Map();

  constructor() {
    this.initializeStrategies();
  }

  /**
   * Initialize cache strategies
   */
  private initializeStrategies(): void {
    Object.entries(CACHE_STRATEGIES).forEach(([key, strategy]) => {
      this.strategies.set(key, strategy);
    });
  }

  /**
   * Register cache strategy
   */
  registerStrategy(key: string, strategy: CacheStrategy): void {
    this.strategies.set(key, strategy);
  }

  /**
   * Get cache strategy
   */
  getStrategy(key: string): CacheStrategy | undefined {
    return this.strategies.get(key);
  }

  /**
   * Register background sync task
   */
  registerBackgroundSync(config: BackgroundSyncConfig): void {
    this.backgroundSyncTasks.set(config.tag, config);
  }

  /**
   * Get background sync config
   */
  getBackgroundSyncConfig(tag: string): BackgroundSyncConfig | undefined {
    return this.backgroundSyncTasks.get(tag);
  }

  /**
   * Register push notification
   */
  registerPushNotification(key: string, config: PushNotificationConfig): void {
    this.pushNotifications.set(key, config);
  }

  /**
   * Get push notification config
   */
  getPushNotificationConfig(key: string): PushNotificationConfig | undefined {
    return this.pushNotifications.get(key);
  }

  /**
   * Network first strategy
   */
  async networkFirst(request: Request): Promise<Response> {
    try {
      const response = await fetch(request);
      const cache = await caches.open('network-first-v1');
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      throw error;
    }
  }

  /**
   * Cache first strategy
   */
  async cacheFirst(request: Request): Promise<Response> {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      const cache = await caches.open('cache-first-v1');
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Stale while revalidate strategy
   */
  async staleWhileRevalidate(request: Request): Promise<Response> {
    const cached = await caches.match(request);

    const fetchPromise = fetch(request).then((response) => {
      const cache = caches.open('stale-while-revalidate-v1');
      cache.then((c) => c.put(request, response.clone()));
      return response;
    });

    return cached || fetchPromise;
  }

  /**
   * Network only strategy
   */
  async networkOnly(request: Request): Promise<Response> {
    return fetch(request);
  }

  /**
   * Apply strategy to request
   */
  async applyStrategy(request: Request, strategyKey: string): Promise<Response> {
    const strategy = this.getStrategy(strategyKey);
    if (!strategy) {
      return fetch(request);
    }

    if (strategy.networkFirst) {
      return this.networkFirst(request);
    }
    if (strategy.cacheFirst) {
      return this.cacheFirst(request);
    }
    if (strategy.staleWhileRevalidate) {
      return this.staleWhileRevalidate(request);
    }
    if (strategy.networkOnly) {
      return this.networkOnly(request);
    }

    return fetch(request);
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  }

  /**
   * Clear specific cache
   */
  async clearCache(cacheName: string): Promise<void> {
    await caches.delete(cacheName);
  }

  /**
   * Get cache size
   */
  async getCacheSize(): Promise<number> {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      totalSize += keys.length;
    }

    return totalSize;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    caches: number;
    entries: number;
    strategies: number;
    backgroundSyncTasks: number;
    pushNotifications: number;
  }> {
    const cacheNames = await caches.keys();
    let totalEntries = 0;

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      totalEntries += keys.length;
    }

    return {
      caches: cacheNames.length,
      entries: totalEntries,
      strategies: this.strategies.size,
      backgroundSyncTasks: this.backgroundSyncTasks.size,
      pushNotifications: this.pushNotifications.size,
    };
  }
}

/**
 * Global advanced service worker manager instance
 */
export const advancedServiceWorkerManager = new AdvancedServiceWorkerManager();

/**
 * Register service worker with advanced strategies
 */
export async function registerAdvancedServiceWorker(): Promise<
  ServiceWorkerRegistration | undefined
> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('Advanced Service Worker registered:', registration);

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from Service Worker:', event.data);
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

/**
 * Request background sync
 */
export async function requestBackgroundSync(tag: string): Promise<void> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log('Background sync registered:', tag);
  } catch (error) {
    console.error('Background sync registration failed:', error);
  }
}

/**
 * Request push notification permission
 */
export async function requestPushNotificationPermission(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push Notifications not supported');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Push notification permission denied');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
    });

    console.log('Push subscription created:', subscription);
    return subscription;
  } catch (error) {
    console.error('Push notification setup failed:', error);
    return null;
  }
}

/**
 * Send push notification
 */
export async function sendPushNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, options);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('Service Worker unregistered');
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
  }
}

export default advancedServiceWorkerManager;
