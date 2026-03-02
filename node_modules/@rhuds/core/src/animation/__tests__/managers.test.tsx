/**
 * Animation Managers Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Animator } from '../Animator';
import { Stagger } from '../managers/Stagger';
import { Sequence } from '../managers/Sequence';
import { Switch } from '../managers/Switch';
import { AnimatorControl } from '../types';

describe('Animation Managers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Stagger', () => {
    it('should stagger child animations with numeric delay', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];

      render(
        <Stagger stagger={50}>
          {items.map((item, index) => (
            <Animator key={index} activate={true}>
              {(control: AnimatorControl) => (
                <div data-testid={`item-${index}`}>
                  {item} - {control.duration.delay}ms
                </div>
              )}
            </Animator>
          ))}
        </Stagger>
      );

      expect(screen.getByTestId('item-0')).toHaveTextContent('0ms');
      expect(screen.getByTestId('item-1')).toHaveTextContent('50ms');
      expect(screen.getByTestId('item-2')).toHaveTextContent('100ms');
    });

    it('should stagger in reverse direction', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];

      render(
        <Stagger stagger={50} direction="reverse">
          {items.map((item, index) => (
            <Animator key={index} activate={true}>
              {(control: AnimatorControl) => (
                <div data-testid={`item-${index}`}>
                  {item} - {control.duration.delay}ms
                </div>
              )}
            </Animator>
          ))}
        </Stagger>
      );

      expect(screen.getByTestId('item-0')).toHaveTextContent('100ms');
      expect(screen.getByTestId('item-1')).toHaveTextContent('50ms');
      expect(screen.getByTestId('item-2')).toHaveTextContent('0ms');
    });

    it('should auto-calculate stagger delay', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];

      render(
        <Stagger stagger="auto">
          {items.map((item, index) => (
            <Animator key={index} activate={true}>
              {(control: AnimatorControl) => (
                <div data-testid={`item-${index}`}>
                  {item} - {control.duration.delay}ms
                </div>
              )}
            </Animator>
          ))}
        </Stagger>
      );

      // Auto stagger distributes 300ms across 3 items = 100ms each
      expect(screen.getByTestId('item-0')).toHaveTextContent('0ms');
      expect(screen.getByTestId('item-1')).toHaveTextContent('100ms');
      expect(screen.getByTestId('item-2')).toHaveTextContent('200ms');
    });

    it('should preserve existing delay and add stagger', () => {
      const items = ['Item 1', 'Item 2'];

      render(
        <Stagger stagger={50}>
          {items.map((item, index) => (
            <Animator key={index} activate={true} duration={{ delay: 100 }}>
              {(control: AnimatorControl) => (
                <div data-testid={`item-${index}`}>
                  {item} - {control.duration.delay}ms
                </div>
              )}
            </Animator>
          ))}
        </Stagger>
      );

      expect(screen.getByTestId('item-0')).toHaveTextContent('100ms');
      expect(screen.getByTestId('item-1')).toHaveTextContent('150ms');
    });
  });

  describe('Sequence', () => {
    it('should activate animations sequentially', async () => {
      const onComplete = vi.fn();

      render(
        <Sequence onComplete={onComplete}>
          <Animator duration={{ enter: 100 }}>
            {(control: AnimatorControl) => (
              <div data-testid="item-0">{control.flow.value}</div>
            )}
          </Animator>
          <Animator duration={{ enter: 100 }}>
            {(control: AnimatorControl) => (
              <div data-testid="item-1">{control.flow.value}</div>
            )}
          </Animator>
          <Animator duration={{ enter: 100 }}>
            {(control: AnimatorControl) => (
              <div data-testid="item-2">{control.flow.value}</div>
            )}
          </Animator>
        </Sequence>
      );

      // First animation should be entering
      expect(screen.getByTestId('item-0')).toHaveTextContent('entering');
      expect(screen.getByTestId('item-1')).toHaveTextContent('exited');
      expect(screen.getByTestId('item-2')).toHaveTextContent('exited');

      // After first animation completes
      vi.advanceTimersByTime(100);
      await waitFor(() => {
        expect(screen.getByTestId('item-0')).toHaveTextContent('entered');
      });

      // Second animation should start
      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toHaveTextContent('entering');
      });

      // After second animation completes
      vi.advanceTimersByTime(100);
      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toHaveTextContent('entered');
      });

      // Third animation should start
      await waitFor(() => {
        expect(screen.getByTestId('item-2')).toHaveTextContent('entering');
      });

      // After third animation completes
      vi.advanceTimersByTime(100);
      await waitFor(() => {
        expect(screen.getByTestId('item-2')).toHaveTextContent('entered');
      });

      // onComplete should be called
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Switch', () => {
    it('should show first child when condition is true', () => {
      render(
        <Switch condition={true}>
          <Animator activate={true}>
            {(control: AnimatorControl) => (
              <div data-testid="true-child">True Child - {control.flow.value}</div>
            )}
          </Animator>
          <Animator activate={true}>
            {(control: AnimatorControl) => (
              <div data-testid="false-child">False Child - {control.flow.value}</div>
            )}
          </Animator>
        </Switch>
      );

      expect(screen.getByTestId('true-child')).toHaveTextContent('entering');
      expect(screen.getByTestId('false-child')).toHaveTextContent('exited');
    });

    it('should show second child when condition is false', () => {
      render(
        <Switch condition={false}>
          <Animator activate={true}>
            {(control: AnimatorControl) => (
              <div data-testid="true-child">True Child - {control.flow.value}</div>
            )}
          </Animator>
          <Animator activate={true}>
            {(control: AnimatorControl) => (
              <div data-testid="false-child">False Child - {control.flow.value}</div>
            )}
          </Animator>
        </Switch>
      );

      expect(screen.getByTestId('true-child')).toHaveTextContent('exited');
      expect(screen.getByTestId('false-child')).toHaveTextContent('entering');
    });

    it('should switch between children when condition changes', async () => {
      const { rerender } = render(
        <Switch condition={true}>
          <Animator activate={true} duration={{ enter: 100, exit: 100 }}>
            {(control: AnimatorControl) => (
              <div data-testid="true-child">True Child - {control.flow.value}</div>
            )}
          </Animator>
          <Animator activate={true} duration={{ enter: 100, exit: 100 }}>
            {(control: AnimatorControl) => (
              <div data-testid="false-child">False Child - {control.flow.value}</div>
            )}
          </Animator>
        </Switch>
      );

      expect(screen.getByTestId('true-child')).toHaveTextContent('entering');

      // Change condition
      rerender(
        <Switch condition={false}>
          <Animator activate={true} duration={{ enter: 100, exit: 100 }}>
            {(control: AnimatorControl) => (
              <div data-testid="true-child">True Child - {control.flow.value}</div>
            )}
          </Animator>
          <Animator activate={true} duration={{ enter: 100, exit: 100 }}>
            {(control: AnimatorControl) => (
              <div data-testid="false-child">False Child - {control.flow.value}</div>
            )}
          </Animator>
        </Switch>
      );

      // True child should be exiting
      await waitFor(() => {
        expect(screen.getByTestId('true-child')).toHaveTextContent('exiting');
      });

      // False child should be entering
      expect(screen.getByTestId('false-child')).toHaveTextContent('entering');
    });

    it('should unmount inactive child when unmountOnExited is true', async () => {
      render(
        <Switch condition={true}>
          <Animator activate={true} duration={{ exit: 100 }}>
            <div data-testid="true-child">True Child</div>
          </Animator>
          <Animator activate={true} duration={{ exit: 100 }}>
            <div data-testid="false-child">False Child</div>
          </Animator>
        </Switch>
      );

      // Wait for false child to exit and unmount
      vi.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.queryByTestId('false-child')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('true-child')).toBeInTheDocument();
    });
  });
});
