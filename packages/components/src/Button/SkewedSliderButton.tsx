import React from 'react';
import styled from 'styled-components';

export interface SkewedSliderButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  sliderColor?: string;
}

const SkewedSliderButton: React.FC<SkewedSliderButtonProps> = ({
  children = 'Download Now',
  onClick,
  className,
  disabled = false,
  sliderColor = '#ff4655',
}) => {
  return (
    <StyledWrapper $sliderColor={sliderColor} className={className}>
      <button className="button" onClick={onClick} disabled={disabled}>
        <span className="button_lg">
          <span className="button_sl" />
          <span className="button_text">{children}</span>
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $sliderColor: string }>`
  .button {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    border: none;
    background: none;
    color: #0f1923;
    cursor: pointer;
    position: relative;
    padding: 8px;
    margin-bottom: 20px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.15s ease;
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button::before,
  .button::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    left: 0;
    height: calc(50% - 5px);
    border: 1px solid #7d8082;
    transition: all 0.15s ease;
  }

  .button::before {
    top: 0;
    border-bottom-width: 0;
  }

  .button::after {
    bottom: 0;
    border-top-width: 0;
  }

  .button:active,
  .button:focus {
    outline: none;
  }

  .button:active::before,
  .button:active::after {
    right: 3px;
    left: 3px;
  }

  .button:active::before {
    top: 3px;
  }

  .button:active::after {
    bottom: 3px;
  }

  .button_lg {
    position: relative;
    display: block;
    padding: 10px 20px;
    color: #fff;
    background-color: #0f1923;
    overflow: hidden;
    box-shadow: inset 0px 0px 0px 1px transparent;
  }

  .button_lg::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    background-color: #0f1923;
  }

  .button_lg::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 4px;
    height: 4px;
    background-color: #0f1923;
    transition: all 0.2s ease;
  }

  .button_sl {
    display: block;
    position: absolute;
    top: 0;
    bottom: -1px;
    left: -8px;
    width: 0;
    background-color: ${(props) => props.$sliderColor};
    transform: skew(-15deg);
    transition: all 0.2s ease;
  }

  .button_text {
    position: relative;
  }

  .button:hover {
    color: #0f1923;
  }

  .button:hover .button_sl {
    width: calc(100% + 15px);
  }

  .button:hover .button_lg::after {
    background-color: #fff;
  }

  .button:disabled:hover {
    color: #fff;
  }

  .button:disabled:hover .button_sl {
    width: 0;
  }

  .button:disabled:hover .button_lg::after {
    background-color: #0f1923;
  }
`;

export default SkewedSliderButton;
