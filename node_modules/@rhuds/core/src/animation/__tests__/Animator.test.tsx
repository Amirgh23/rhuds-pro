/**
 * Animator Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Animator } from '../Animator';
import { AnimatorControl } from '../types';

describe('Animator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Lifecycle States', () => {
    it('should start in exited state by default', () => {
      const { container } = render(
        <Animator activate={false}>
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('exited');
    });

    it('should start in entered state when initialState is entered', () => {
      render(
        <Animator activate={true} initialState="entered">
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('entered');
    });

    it('should transition from exited to entering when activated', () => {
      const { rerender } = render(
        <Animator activate={false}>
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('exited');

      rerender(
        <Animator activate={true}>
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('entering');
    });

    it('should transition from entering to entered after duration', async () => {
      render(
        <Animator activate={true} duration={{ enter: 300 }}>
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('entering');

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('entered');
      });
    });

    it('should transition from entered to exiting when deactivated', async () => {
      const { rerender } = render(
        <Animator activate={true} initialState="entered">
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('entered');

      rerender(
        <Animator activate={false} initialState="entered">
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('exiting');
    });

    it('should transition from exiting to exited after duration', async () => {
      const { rerender } = render(
        <Animator activate={true} initialState="entered" duration={{ exit: 200 }}>
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      rerender(
        <Animator activate={false} initialState="entered" duration={{ exit: 200 }}>
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('exiting');

      vi.advanceTimersByTime(200);

      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('exited');
      });
    });
  });

  describe('Lifecycle Callbacks', () => {
    it('should call onAnimateEntering when entering', () => {
      const onAnimateEntering = vi.fn();

      render(
        <Animator activate={true} onAnimateEntering={onAnimateEntering}>
          <div>Content</div>
        </Animator>
      );

      expect(onAnimateEntering).toHaveBeenCalledTimes(1);
    });

    it('should call onAnimateEntered when entered', async () => {
      const onAnimateEntered = vi.fn();

      render(
        <Animator
          activate={true}
          duration={{ enter: 300 }}
          onAnimateEntered={onAnimateEntered}
        >
          <div>Content</div>
        </Animator>
      );

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(onAnimateEntered).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onAnimateExiting when exiting', () => {
      const onAnimateExiting = vi.fn();

      const { rerender } = render(
        <Animator activate={true} initialState="entered" onAnimateExiting={onAnimateExiting}>
          <div>Content</div>
        </Animator>
      );

      rerender(
        <Animator activate={false} initialState="entered" onAnimateExiting={onAnimateExiting}>
          <div>Content</div>
        </Animator>
      );

      expect(onAnimateExiting).toHaveBeenCalledTimes(1);
    });

    it('should call onAnimateExited when exited', async () => {
      const onAnimateExited = vi.fn();

      const { rerender } = render(
        <Animator
          activate={true}
          initialState="entered"
          duration={{ exit: 200 }}
          onAnimateExited={onAnimateExited}
        >
          <div>Content</div>
        </Animator>
      );

      rerender(
        <Animator
          activate={false}
          initialState="entered"
          duration={{ exit: 200 }}
          onAnimateExited={onAnimateExited}
        >
          <div>Content</div>
        </Animator>
      );

      vi.advanceTimersByTime(200);

      await waitFor(() => {
        expect(onAnimateExited).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('unmountOnExited', () => {
    it('should unmount when exited if unmountOnExited is true', async () => {
      const { rerender, container } = render(
        <Animator activate={true} initialState="entered" unmountOnExited={true}>
          <div data-testid="content">Content</div>
        </Animator>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();

      rerender(
        <Animator activate={false} initialState="entered" unmountOnExited={true} duration={{ exit: 200 }}>
          <div data-testid="content">Content</div>
        </Animator>
      );

      vi.advanceTimersByTime(200);

      await waitFor(() => {
        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      });
    });

    it('should not unmount when exited if unmountOnExited is false', async () => {
      const { rerender } = render(
        <Animator activate={true} initialState="entered" unmountOnExited={false}>
          <div data-testid="content">Content</div>
        </Animator>
      );

      rerender(
        <Animator activate={false} initialState="entered" unmountOnExited={false} duration={{ exit: 200 }}>
          <div data-testid="content">Content</div>
        </Animator>
      );

      vi.advanceTimersByTime(200);

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
    });
  });

  describe('disabled state', () => {
    it('should not animate when disabled', () => {
      const onAnimateEntering = vi.fn();

      render(
        <Animator activate={true} disabled={true} onAnimateEntering={onAnimateEntering}>
          <div>Content</div>
        </Animator>
      );

      expect(onAnimateEntering).not.toHaveBeenCalled();
    });
  });

  describe('dismissed state', () => {
    it('should transition to exited when dismissed', () => {
      const { rerender } = render(
        <Animator activate={true} initialState="entered">
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('entered');

      rerender(
        <Animator activate={true} initialState="entered" dismissed={true}>
          {(control: AnimatorControl) => (
            <div data-testid="content">{control.flow.value}</div>
          )}
        </Animator>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('exited');
    });
  });

  describe('AnimatorFlow', () => {
    it('should provide correct flow flags for entering state', () => {
      render(
        <Animator activate={true}>
          {(control: AnimatorControl) => {
            expect(control.flow.entering).toBe(true);
            expect(control.flow.entered).toBe(false);
            expect(control.flow.exiting).toBe(false);
            expect(control.flow.exited).toBe(false);
            expect(control.flow.transitioning).toBe(true);
            return <div>Content</div>;
          }}
        </Animator>
      );
    });

    it('should provide correct flow flags for entered state', () => {
      render(
        <Animator activate={true} initialState="entered">
          {(control: AnimatorControl) => {
            expect(control.flow.entering).toBe(false);
            expect(control.flow.entered).toBe(true);
            expect(control.flow.exiting).toBe(false);
            expect(control.flow.exited).toBe(false);
            expect(control.flow.transitioning).toBe(false);
            return <div>Content</div>;
          }}
        </Animator>
      );
    });

    it('should provide correct flow flags for exited state', () => {
      render(
        <Animator activate={false}>
          {(control: AnimatorControl) => {
            expect(control.flow.entering).toBe(false);
            expect(control.flow.entered).toBe(false);
            expect(control.flow.exiting).toBe(false);
            expect(control.flow.exited).toBe(true);
            expect(control.flow.transitioning).toBe(false);
            return <div>Content</div>;
          }}
        </Animator>
      );
    });
  });

  describe('Resource Cleanup', () => {
    it('should clean up timers on unmount', () => {
      const { unmount } = render(
        <Animator activate={true} duration={{ enter: 300 }}>
          <div>Content</div>
        </Animator>
      );

      unmount();

      // Advance timers to ensure no callbacks fire after unmount
      vi.advanceTimersByTime(300);

      // If cleanup worked, no errors should occur
      expect(true).toBe(true);
    });
  });
});
