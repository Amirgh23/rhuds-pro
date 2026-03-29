import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColdWarContextMenu } from './ColdWarContextMenu';

describe('ColdWarContextMenu', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders context menu at specified position', () => {
    const { container } = render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    const menu = container.querySelector('.coldwar-context-menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveStyle('left: 100px');
    expect(menu).toHaveStyle('top: 200px');
  });

  it('renders all menu items', () => {
    render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    expect(screen.getByText('COLDWAR INTRO')).toBeInTheDocument();
    expect(screen.getByText('SHOWCASE')).toBeInTheDocument();
    expect(screen.getByText('PLAYGROUND')).toBeInTheDocument();
    expect(screen.getByText('DOCUMENTATION')).toBeInTheDocument();
    expect(screen.getByText('TACTICAL VIEW')).toBeInTheDocument();
    expect(screen.getByText('COMPONENT LIBRARY')).toBeInTheDocument();
  });

  it('renders header with title', () => {
    render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    expect(screen.getByText('TACTICAL MENU')).toBeInTheDocument();
  });

  it('renders footer with signal indicator', () => {
    render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    expect(screen.getByText('SIGNAL ACTIVE')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    expect(container.querySelector('.coldwar-context-menu')).toBeInTheDocument();
    expect(container.querySelector('.coldwar-context-menu-container')).toBeInTheDocument();
    expect(container.querySelector('.coldwar-context-menu-header')).toBeInTheDocument();
    expect(container.querySelector('.coldwar-context-menu-content')).toBeInTheDocument();
    expect(container.querySelector('.coldwar-context-menu-footer')).toBeInTheDocument();
    expect(container.querySelector('.coldwar-context-menu-glitch')).toBeInTheDocument();
  });

  it('renders menu items with correct categories', () => {
    const { container } = render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    const navigationItems = container.querySelectorAll('.coldwar-context-menu-item.navigation');
    const actionItems = container.querySelectorAll('.coldwar-context-menu-item.action');

    expect(navigationItems.length).toBeGreaterThan(0);
    expect(actionItems.length).toBeGreaterThan(0);
  });

  it('renders divider element', () => {
    const { container } = render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    expect(container.querySelector('.coldwar-context-menu-divider')).toBeInTheDocument();
  });

  it('has fixed positioning', () => {
    const { container } = render(<ColdWarContextMenu x={100} y={200} onClose={mockOnClose} />);

    const menu = container.querySelector('.coldwar-context-menu');
    expect(menu).toHaveStyle('position: fixed');
    expect(menu).toHaveStyle('zIndex: 10000');
  });
});
