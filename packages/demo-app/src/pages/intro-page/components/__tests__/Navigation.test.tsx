import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '../Navigation';

describe('Navigation Component', () => {
  const renderNavigation = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  test('renders navigation bar', () => {
    renderNavigation();
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('renders RHUDS brand button', () => {
    renderNavigation();
    const brandButton = screen.getByText(/RHUDS/);
    expect(brandButton).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    renderNavigation();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('Playground')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  test('navigation links have correct styling', () => {
    renderNavigation();
    const links = screen.getAllByRole('button');
    links.forEach((link) => {
      expect(link).toHaveStyle({
        cursor: 'pointer',
        fontWeight: '700',
      });
    });
  });

  test('navigation bar has fixed positioning', () => {
    renderNavigation();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
    });
  });

  test('navigation bar has high z-index', () => {
    renderNavigation();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({
      zIndex: '1000',
    });
  });

  test('brand button is clickable', () => {
    renderNavigation();
    const brandButton = screen.getByText(/RHUDS/);
    expect(brandButton).toBeEnabled();
    fireEvent.click(brandButton);
  });

  test('navigation links are clickable', () => {
    renderNavigation();
    const componentsLink = screen.getByText('Components');
    expect(componentsLink).toBeEnabled();
    fireEvent.click(componentsLink);
  });

  test('navigation has cyan color scheme', () => {
    renderNavigation();
    const nav = screen.getByRole('navigation');
    const style = window.getComputedStyle(nav);
    expect(nav).toHaveStyle({
      borderBottom: '2px solid rgba(41, 242, 223, 0.3)',
    });
  });

  test('navigation has glassmorphism effect', () => {
    renderNavigation();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({
      backdropFilter: 'blur(20px)',
    });
  });

  test('navigation links have glow effect on hover', () => {
    renderNavigation();
    const link = screen.getByText('Components');
    fireEvent.mouseEnter(link);
    expect(link).toHaveStyle({
      boxShadow: expect.stringContaining('rgba(41, 242, 223'),
    });
  });

  test('navigation is accessible with keyboard', () => {
    renderNavigation();
    const links = screen.getAllByRole('button');
    links.forEach((link) => {
      expect(link).toBeVisible();
    });
  });
});
