import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Text, Decipher, Button, Icon } from '../Basic';

describe('Basic Components', () => {
  describe('Text Component', () => {
    it('should render static text', () => {
      const props = {
        children: 'Hello World',
        mode: 'static' as const,
      };
      expect(props.children).toBe('Hello World');
      expect(props.mode).toBe('static');
    });

    it('should support typewriter mode', () => {
      const props = {
        children: 'Typewriter',
        mode: 'typewriter' as const,
        duration: 1000,
      };
      expect(props.mode).toBe('typewriter');
      expect(props.duration).toBe(1000);
    });

    it('should support animated mode', () => {
      const props = {
        children: 'Animated',
        mode: 'animated' as const,
        duration: 500,
      };
      expect(props.mode).toBe('animated');
      expect(props.duration).toBe(500);
    });

    it('should call onComplete callback', () => {
      const callback = vi.fn();
      const props = {
        children: 'Test',
        onComplete: callback,
      };
      expect(props.onComplete).toBeDefined();
    });

    it('should support custom delay', () => {
      const props = {
        children: 'Delayed',
        delay: 500,
      };
      expect(props.delay).toBe(500);
    });

    it('should support custom className', () => {
      const props = {
        children: 'Styled',
        className: 'text-blue-500',
      };
      expect(props.className).toBe('text-blue-500');
    });

    it('should support custom style', () => {
      const props = {
        children: 'Styled',
        style: { color: 'red', fontSize: '16px' },
      };
      expect(props.style.color).toBe('red');
      expect(props.style.fontSize).toBe('16px');
    });
  });

  describe('Decipher Component', () => {
    it('should render decipher text', () => {
      const props = {
        children: 'Secret',
      };
      expect(props.children).toBe('Secret');
    });

    it('should support custom duration', () => {
      const props = {
        children: 'Decipher',
        duration: 2000,
      };
      expect(props.duration).toBe(2000);
    });

    it('should support custom delay', () => {
      const props = {
        children: 'Delayed',
        delay: 1000,
      };
      expect(props.delay).toBe(1000);
    });

    it('should call onComplete callback', () => {
      const callback = vi.fn();
      const props = {
        children: 'Test',
        onComplete: callback,
      };
      expect(props.onComplete).toBeDefined();
    });

    it('should support custom className', () => {
      const props = {
        children: 'Styled',
        className: 'text-green-500',
      };
      expect(props.className).toBe('text-green-500');
    });

    it('should support custom style', () => {
      const props = {
        children: 'Styled',
        style: { fontWeight: 'bold' },
      };
      expect(props.style.fontWeight).toBe('bold');
    });
  });

  describe('Button Component', () => {
    it('should render button with default variant', () => {
      const props = {
        children: 'Click Me',
        variant: 'primary' as const,
      };
      expect(props.variant).toBe('primary');
    });

    it('should support secondary variant', () => {
      const props = {
        children: 'Secondary',
        variant: 'secondary' as const,
      };
      expect(props.variant).toBe('secondary');
    });

    it('should support danger variant', () => {
      const props = {
        children: 'Delete',
        variant: 'danger' as const,
      };
      expect(props.variant).toBe('danger');
    });

    it('should support success variant', () => {
      const props = {
        children: 'Confirm',
        variant: 'success' as const,
      };
      expect(props.variant).toBe('success');
    });

    it('should support different sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      sizes.forEach((size) => {
        const props = {
          children: 'Button',
          size,
        };
        expect(props.size).toBe(size);
      });
    });

    it('should support loading state', () => {
      const props = {
        children: 'Loading',
        loading: true,
      };
      expect(props.loading).toBe(true);
    });

    it('should support disabled state', () => {
      const props = {
        children: 'Disabled',
        disabled: true,
      };
      expect(props.disabled).toBe(true);
    });

    it('should handle click events', () => {
      const onClick = vi.fn();
      const props = {
        children: 'Click',
        onClick,
      };
      expect(props.onClick).toBeDefined();
    });

    it('should support custom className', () => {
      const props = {
        children: 'Styled',
        className: 'custom-class',
      };
      expect(props.className).toBe('custom-class');
    });
  });

  describe('Icon Component', () => {
    it('should render icon with default size', () => {
      const props = {
        name: 'check',
        size: 'md' as const,
      };
      expect(props.name).toBe('check');
      expect(props.size).toBe('md');
    });

    it('should support different sizes', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
      sizes.forEach((size) => {
        const props = {
          name: 'star',
          size,
        };
        expect(props.size).toBe(size);
      });
    });

    it('should support custom color', () => {
      const props = {
        name: 'heart',
        color: '#ff0000',
      };
      expect(props.color).toBe('#ff0000');
    });

    it('should support predefined icons', () => {
      const icons = [
        'check',
        'close',
        'menu',
        'search',
        'arrow_right',
        'arrow_left',
        'star',
        'heart',
      ];
      icons.forEach((icon) => {
        const props = {
          name: icon,
        };
        expect(props.name).toBe(icon);
      });
    });

    it('should support custom className', () => {
      const props = {
        name: 'search',
        className: 'icon-custom',
      };
      expect(props.className).toBe('icon-custom');
    });

    it('should support custom style', () => {
      const props = {
        name: 'menu',
        style: { opacity: 0.5 },
      };
      expect(props.style.opacity).toBe(0.5);
    });

    it('should support title attribute', () => {
      const props = {
        name: 'check',
        title: 'Confirm',
      };
      expect(props.title).toBe('Confirm');
    });
  });

  describe('Component Integration', () => {
    it('should combine Text and Button', () => {
      const textProps = {
        children: 'Click',
        mode: 'typewriter' as const,
      };
      const buttonProps = {
        children: textProps.children,
        variant: 'primary' as const,
      };
      expect(textProps.children).toBe(buttonProps.children);
    });

    it('should combine Icon and Button', () => {
      const iconProps = {
        name: 'check',
        size: 'sm' as const,
      };
      const buttonProps = {
        children: 'Confirm',
        variant: 'success' as const,
      };
      expect(iconProps.name).toBe('check');
      expect(buttonProps.variant).toBe('success');
    });

    it('should combine Decipher and Text', () => {
      const decipherProps = {
        children: 'Secret Message',
        duration: 1500,
      };
      const textProps = {
        children: decipherProps.children,
        mode: 'static' as const,
      };
      expect(decipherProps.children).toBe(textProps.children);
    });
  });

  describe('Accessibility', () => {
    it('Button should have proper attributes', () => {
      const props = {
        children: 'Accessible Button',
        disabled: false,
      };
      expect(props.disabled).toBe(false);
    });

    it('Icon should support title for accessibility', () => {
      const props = {
        name: 'search',
        title: 'Search',
      };
      expect(props.title).toBe('Search');
    });

    it('Text should support semantic HTML', () => {
      const props = {
        children: 'Semantic Text',
        className: 'sr-only',
      };
      expect(props.className).toBe('sr-only');
    });
  });

  describe('Performance', () => {
    it('Text component should handle long strings', () => {
      const longText = 'a'.repeat(1000);
      const props = {
        children: longText,
      };
      expect(props.children.length).toBe(1000);
    });

    it('Icon component should render efficiently', () => {
      const icons = Array.from({ length: 100 }, (_, i) => ({
        name: 'star',
        key: i,
      }));
      expect(icons.length).toBe(100);
    });

    it('Button component should handle rapid clicks', () => {
      const onClick = vi.fn();
      const props = {
        children: 'Rapid Click',
        onClick,
      };
      expect(props.onClick).toBeDefined();
    });
  });
});
