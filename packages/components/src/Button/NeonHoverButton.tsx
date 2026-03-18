import React from 'react';
import styled from 'styled-components';

export interface NeonHoverButtonProps {
  /** Button text content */
  text?: string;
  /** Custom className */
  className?: string;
  /** Animation color (default: #37FF8B) */
  animationColor?: string;
  /** Text stroke color (default: rgba(255,255,255,0.6)) */
  textStrokeColor?: string;
  /** Font size (default: 2em) */
  fontSize?: string;
  /** Border right width (default: 6px) */
  borderRight?: string;
  /** Click handler */
  onClick?: () => void;
}

export const NeonHoverButton: React.FC<NeonHoverButtonProps> = ({
  text = 'uiverse',
  className,
  animationColor = '#37FF8B',
  textStrokeColor = 'rgba(255,255,255,0.6)',
  fontSize = '2em',
  borderRight = '6px',
  onClick,
}) => {
  return (
    <StyledWrapper
      $animationColor={animationColor}
      $textStrokeColor={textStrokeColor}
      $fontSize={fontSize}
      $borderRight={borderRight}
    >
      <button className={`button ${className || ''}`} onClick={onClick} data-text={text}>
        <span className="actual-text">&nbsp;{text}&nbsp;</span>
        <span aria-hidden="true" className="hover-text">
          &nbsp;{text}&nbsp;
        </span>
      </button>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $animationColor: string;
  $textStrokeColor: string;
  $fontSize: string;
  $borderRight: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  /* === removing default button style === */
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
  }

  /* button styling */
  .button {
    --border-right: ${(props) => props.$borderRight};
    --text-stroke-color: ${(props) => props.$textStrokeColor};
    --animation-color: ${(props) => props.$animationColor};
    --fs-size: ${(props) => props.$fontSize};
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: 'Arial';
    position: relative;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }

  /* this is the text, when you hover on button */
  .hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }

  /* hover */
  .button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }
`;

export default NeonHoverButton;
