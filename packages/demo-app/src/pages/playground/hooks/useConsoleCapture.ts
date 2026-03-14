import { useEffect, useRef, useCallback } from 'react';

export interface ConsoleMessage {
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
  args: any[];
}

// Safe stringify function that handles circular references and large objects
function safeStringify(obj: any, depth = 0, maxDepth = 3): string {
  if (depth > maxDepth) {
    return '[Object]';
  }

  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (obj instanceof Error) return `${obj.name}: ${obj.message}`;
  if (obj instanceof Date) return obj.toISOString();
  if (obj instanceof RegExp) return obj.toString();

  if (Array.isArray(obj)) {
    if (obj.length > 10) {
      return `[Array(${obj.length})]`;
    }
    return `[${obj.map((item) => safeStringify(item, depth + 1, maxDepth)).join(', ')}]`;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj).slice(0, 5);
    const items = keys.map((key) => `${key}: ${safeStringify(obj[key], depth + 1, maxDepth)}`);
    if (Object.keys(obj).length > 5) {
      items.push(`... +${Object.keys(obj).length - 5} more`);
    }
    return `{${items.join(', ')}}`;
  }

  return String(obj);
}

export function useConsoleCapture(onMessage?: (msg: ConsoleMessage) => void) {
  const messagesRef = useRef<ConsoleMessage[]>([]);
  const originalConsoleRef = useRef({
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  });

  const captureConsole = useCallback(() => {
    const originalLog = originalConsoleRef.current.log;
    const originalWarn = originalConsoleRef.current.warn;
    const originalError = originalConsoleRef.current.error;
    const originalInfo = originalConsoleRef.current.info;

    console.log = (...args: any[]) => {
      originalLog(...args);
      try {
        const message: ConsoleMessage = {
          type: 'log',
          message: args.map((arg) => safeStringify(arg)).join(' '),
          timestamp: Date.now(),
          args,
        };
        messagesRef.current.push(message);
        onMessage?.(message);
      } catch (err) {
        originalLog('Error capturing console.log:', err);
      }
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      try {
        const message: ConsoleMessage = {
          type: 'warn',
          message: args.map((arg) => safeStringify(arg)).join(' '),
          timestamp: Date.now(),
          args,
        };
        messagesRef.current.push(message);
        onMessage?.(message);
      } catch (err) {
        originalWarn('Error capturing console.warn:', err);
      }
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      try {
        const message: ConsoleMessage = {
          type: 'error',
          message: args.map((arg) => safeStringify(arg)).join(' '),
          timestamp: Date.now(),
          args,
        };
        messagesRef.current.push(message);
        onMessage?.(message);
      } catch (err) {
        originalError('Error capturing console.error:', err);
      }
    };

    console.info = (...args: any[]) => {
      originalInfo(...args);
      try {
        const message: ConsoleMessage = {
          type: 'info',
          message: args.map((arg) => safeStringify(arg)).join(' '),
          timestamp: Date.now(),
          args,
        };
        messagesRef.current.push(message);
        onMessage?.(message);
      } catch (err) {
        originalInfo('Error capturing console.info:', err);
      }
    };
  }, [onMessage]);

  const restoreConsole = useCallback(() => {
    console.log = originalConsoleRef.current.log;
    console.warn = originalConsoleRef.current.warn;
    console.error = originalConsoleRef.current.error;
    console.info = originalConsoleRef.current.info;
  }, []);

  const clearMessages = useCallback(() => {
    messagesRef.current = [];
  }, []);

  const getMessages = useCallback(() => {
    return [...messagesRef.current];
  }, []);

  useEffect(() => {
    captureConsole();
    return () => {
      restoreConsole();
    };
  }, [captureConsole, restoreConsole]);

  return {
    messages: messagesRef.current,
    clearMessages,
    getMessages,
  };
}
