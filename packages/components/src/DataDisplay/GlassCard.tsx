import React from 'react';
import styled from 'styled-components';

export interface GlassCardProps {
  /** Card title */
  title?: string;
  /** Card body content */
  body?: string | string[];
  /** Primary action button text */
  primaryButtonText?: string;
  /** Secondary action button text */
  secondaryButtonText?: string;
  /** Primary button click handler */
  onPrimaryClick?: () => void;
  /** Secondary button click handler */
  onSecondaryClick?: () => void;
  /** Primary color (default: blueviolet) */
  primaryColor?: string;
  /** Secondary color (default: rgb(238, 103, 238)) */
  secondaryColor?: string;
  /** Custom className */
  className?: string;
  /** Card width (default: 190px) */
  width?: string;
  /** Card height (default: 254px) */
  height?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title = 'Title',
  body = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  primaryButtonText = 'Yes',
  secondaryButtonText = 'No',
  onPrimaryClick,
  onSecondaryClick,
  primaryColor = 'blueviolet',
  secondaryColor = 'rgb(238, 103, 238)',
  className,
  width = '190px',
  height = '254px',
}) => {
  const bodyContent = Array.isArray(body) ? body : [body];

  return (
    <StyledWrapper
      $primaryColor={primaryColor}
      $secondaryColor={secondaryColor}
      $width={width}
      $height={height}
    >
      <div className={`card ${className || ''}`}>
        <div className="card__content">
          <div className="card__content-heading">
            <h2>{title}</h2>
          </div>
          <div className="card__content-body">
            {bodyContent.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="card__content-footer">
            <button onClick={onPrimaryClick}>{primaryButtonText}</button>
            <button onClick={onSecondaryClick}>{secondaryButtonText}</button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $primaryColor: string;
  $secondaryColor: string;
  $width: string;
  $height: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .card {
    width: ${(props) => props.$width};
    height: ${(props) => props.$height};
    padding: 2%;
    background: rgb(255, 255, 255);
    border-bottom: 2px solid ${(props) => props.$primaryColor};
    border-right: 2px solid ${(props) => props.$primaryColor};
    border-top: 2px solid white;
    border-left: 2px solid white;
    transition-duration: 1s;
    transition-property: border-top, border-left, border-bottom, border-right, box-shadow;
  }

  .card:hover {
    border-top: 2px solid ${(props) => props.$primaryColor};
    border-left: 2px solid ${(props) => props.$primaryColor};
    border-bottom: 2px solid ${(props) => props.$secondaryColor};
    border-right: 2px solid ${(props) => props.$secondaryColor};
    box-shadow:
      rgba(240, 46, 170, 0.4) 5px 5px,
      rgba(240, 46, 170, 0.3) 10px 10px,
      rgba(240, 46, 170, 0.2) 15px 15px,
      rgba(240, 46, 170, 0.1) 20px 20px,
      rgba(240, 46, 170, 0.05) 25px 25px;
  }

  .card__content {
    font-size: small;
    text-align: center;
  }

  .card__content-heading {
    color: ${(props) => props.$primaryColor};
  }

  .card__content-heading h2 {
    margin: 0;
    padding: 0;
  }

  .card__content-body p {
    color: rgb(118, 104, 128);
    padding-bottom: 1rem;
    margin: 0;
  }

  .card__content-footer button {
    background-color: rgb(255, 255, 255);
    color: grey;
    font-weight: 700;
    border-radius: 0.2rem;
    border: 1px solid grey;
    padding: 0.5rem;
    margin: 1rem;
    transition-duration: 1s;
    transition-property: background-color, color, border;
    cursor: pointer;
  }

  .card__content-footer button:hover {
    color: white;
    background-color: ${(props) => props.$secondaryColor};
    border: 1px solid white;
    box-shadow:
      rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
      rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
  }
`;

export default GlassCard;
