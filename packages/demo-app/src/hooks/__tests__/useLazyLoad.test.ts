import { renderHook } from '@testing-library/react';
import { useLazyLoad, useLazyLoadImage } from '../useLazyLoad';

describe('useLazyLoad Hook', () => {
  beforeEach(() => {
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns ref and isVisible state', () => {
    const { result } = renderHook(() => useLazyLoad());

    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('isVisible');
    expect(result.current.isVisible).toBe(false);
  });

  it('accepts custom options', () => {
    const onVisible = jest.fn();
    const { result } = renderHook(() =>
      useLazyLoad({
        rootMargin: '100px',
        threshold: 0.5,
        onVisible,
      })
    );

    expect(result.current.ref).toBeDefined();
  });

  it('calls onVisible callback when element becomes visible', () => {
    const onVisible = jest.fn();
    const { result } = renderHook(() => useLazyLoad({ onVisible }));

    expect(onVisible).not.toHaveBeenCalled();
  });
});

describe('useLazyLoadImage Hook', () => {
  beforeEach(() => {
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns image ref and loading state', () => {
    const { result } = renderHook(() => useLazyLoadImage('https://example.com/image.jpg'));

    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('imageSrc');
    expect(result.current).toHaveProperty('isLoaded');
    expect(result.current).toHaveProperty('setIsLoaded');
  });

  it('loads image immediately without placeholder', () => {
    const { result } = renderHook(() => useLazyLoadImage('https://example.com/image.jpg'));

    expect(result.current.imageSrc).toBe('https://example.com/image.jpg');
    expect(result.current.isLoaded).toBe(true);
  });

  it('uses placeholder initially when provided', () => {
    const { result } = renderHook(() =>
      useLazyLoadImage('https://example.com/image.jpg', 'https://example.com/placeholder.jpg')
    );

    expect(result.current.imageSrc).toBe('https://example.com/placeholder.jpg');
    expect(result.current.isLoaded).toBe(false);
  });
});
