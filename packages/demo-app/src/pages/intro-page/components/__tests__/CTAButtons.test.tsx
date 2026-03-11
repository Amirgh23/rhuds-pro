import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CTAButtons } from '../CTAButtons';

describe('CTAButtons Component', () => {
  const mockPlaySound = jest.fn();

  const renderCTAButtons = (props = {}) => {
    return render(
      <BrowserRouter>
        <CTAButtons onPlaySound={mockPlaySound} {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mockPlaySound.mockClear();
  });

  test('renders both CTA buttons', () => {
    renderCTAButtons();
    expect(screen.getByText('GET STARTED')).toBeInTheDocument();
    expect(screen.getByText('VIEW DOCS')).toBeInTheDocument();
  });

  test('primary button has correct styling', () => {
    renderCTAButtons();
    const primaryButton = screen.getByText('GET STARTED').closest('button');
    expect(primaryButton).toHaveStyle({
      background: expect.stringContaining('linear-gradient'),
      color: '#000',
      fontWeight: '800',
    });
  });

  test('secondary button has correct styling', () => {
    renderCTAButtons();
    const secondaryButton = screen.getByText('VIEW DOCS').closest('button');
    expect(secondaryButton).toHaveStyle({
      color: '#29F2DF',
      fontWeight: '800',
      border: '3px solid #29F2DF',
    });
  });

  test('primary button is clickable', () => {
    renderCTAButtons();
    const primaryButton = screen.getByText('GET STARTED').closest('button');
    expect(primaryButton).toBeEnabled();
    fireEvent.click(primaryButton!);
  });

  test('secondary button is clickable', () => {
    renderCTAButtons();
    const secondaryButton = screen.getByText('VIEW DOCS').closest('button');
    expect(secondaryButton).toBeEnabled();
    fireEvent.click(secondaryButton!);
  });

  test('primary button plays sound on click', () => {
    renderCTAButtons();
    const primaryButton = screen.getByText('GET STARTED').closest('button');
    fireEvent.click(primaryButton!);
    expect(mockPlaySound).toHaveBeenCalledWith(659.25, 0.2);
  });

  test('secondary button plays sound on click', () => {
    renderCTAButtons();
    const secondaryButton = screen.getByText('VIEW DOCS').closest('button');
    fireEvent.click(secondaryButton!);
    expect(mockPlaySound).toHaveBeenCalledWith(523.25, 0.2);
  });

  test('primary button plays hover sound', () => {
    renderCTAButtons();
    const primaryButton = screen.getByText('GET STARTED').closest('button');
    fireEvent.mouseEnter(primaryButton!);
    expect(mockPlaySound).toHaveBeenCalledWith(587.33, 0.15);
  });

  test('secondary button plays hover sound', () => {
    renderCTAButtons();
    const secondaryButton = screen.getByText('VIEW DOCS').closest('button');
    fireEvent.mouseEnter(secondaryButton!);
    expect(mockPlaySound).toHaveBeenCalledWith(493.88, 0.15);
  });

  test('buttons have hover effects', () => {
    renderCTAButtons();
    const primaryButton = screen.getByText('GET STARTED').closest('button');
    fireEvent.mouseEnter(primaryButton!);
    expect(primaryButton).toHaveStyle({
      transform: expect.stringContaining('translateY'),
    });
  });

  test('buttons have glow effects', () => {
    renderCTAButtons();
    const primaryButton = screen.getByText('GET STARTED').closest('button');
    expect(primaryButton).toHaveStyle({
      boxShadow: expect.stringContaining('rgba(41, 242, 223'),
    });
  });

  test('buttons have minimum touch target size', () => {
    renderCTAButtons();
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveStyle({
        padding: '22px 64px',
      });
    });
  });

  test('buttons have proper z-index layering', () => {
    renderCTAButtons();
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      const span = button.querySelector('span');
      expect(span).toHaveStyle({
        position: 'relative',
        zIndex: '1',
      });
    });
  });

  test('secondary button has corner accents', () => {
    renderCTAButtons();
    const secondaryButton = screen.getByText('VIEW DOCS').closest('button');
    const corners = secondaryButton?.querySelectorAll('div');
    expect(corners?.length).toBeGreaterThan(0);
  });

  test('buttons accept mouse position prop', () => {
    const mousePosition = { x: 0.5, y: 0.5 };
    renderCTAButtons({ mousePosition });
    const primaryButton = screen.getByText('GET STARTED').closest('button');
    fireEvent.mouseEnter(primaryButton!);
    expect(primaryButton).toHaveStyle({
      transform: expect.stringContaining('rotateX'),
    });
  });

  test('buttons have preserve-3d transform style', () => {
    renderCTAButtons();
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveStyle({
        transformStyle: 'preserve-3d',
      });
    });
  });
});
