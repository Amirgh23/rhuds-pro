import React from 'react';
import styled from 'styled-components';

export interface AnimatedLoadingTextProps {
  text?: string;
  primaryColor?: string;
  backgroundColor?: string;
  fontSize?: string;
}

export const AnimatedLoadingText: React.FC<AnimatedLoadingTextProps> = ({
  text = 'LOADING',
  primaryColor = 'white',
  backgroundColor = '#171030',
  fontSize = '1.5em',
}) => {
  const letters = text.split('');

  return (
    <StyledWrapper primaryColor={primaryColor} backgroundColor={backgroundColor}>
      <div className="loader">
        {letters.map((letter, index) => (
          <p key={index} style={{ fontSize, animationDelay: `${index * 0.1}s` }}>
            {letter}
          </p>
        ))}
        <div className="arrows">
          <div className="arrowsup">
            <div className="arrow1" />
            <div className="arrow2" />
          </div>
          <div className="arrowsbottom">
            <div className="arrow3" />
            <div className="arrow4" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  primaryColor: string;
  backgroundColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .loader {
    width: 12em;
    height: 3em;
    color: ${(props) => props.primaryColor};
    font-weight: 300;
    font-style: oblique;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .loader p {
    font-size: 1.5em;
    margin: 0;
  }

  .arrows {
    width: 1.75em;
    height: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5em;
  }

  .arrow1,
  .arrow2,
  .arrow3,
  .arrow4 {
    width: 0.75em;
    height: 0.75em;
    border: solid 0.05em transparent;
  }

  .arrowsup {
    width: 100%;
    height: 25%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrowsbottom {
    width: 100%;
    height: 25%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrow1 {
    clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 0% 100%);
    animation: whitechange 2s linear infinite;
  }

  .arrow2 {
    clip-path: polygon(0% 0%, 0% 0%, 100% 100%, 0% 100%);
    animation: whitechange 2s linear infinite 0.5s;
  }

  .arrow3 {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%);
    animation: whitechange 2s linear infinite 1.5s;
  }

  .arrow4 {
    clip-path: polygon(0% 0%, 100% 0%, 0% 100%, 0% 100%);
    animation: whitechange 2s linear infinite 1s;
  }

  .loader p:nth-child(1) {
    animation: changefont 2s linear infinite;
  }

  .loader p:nth-child(2) {
    animation: changefont 2s linear infinite 0.1s;
  }

  .loader p:nth-child(3) {
    animation: changefont 2s linear infinite 0.2s;
  }

  .loader p:nth-child(4) {
    animation: changefont 2s linear infinite 0.3s;
  }

  .loader p:nth-child(5) {
    animation: changefont 2s linear infinite 0.4s;
  }

  .loader p:nth-child(6) {
    animation: changefont 2s linear infinite 0.5s;
  }

  .loader p:nth-child(7) {
    animation: changefont 2s linear infinite 0.6s;
  }

  .loader p:nth-child(8) {
    animation: changefont 2s linear infinite 0.7s;
  }

  .loader p:nth-child(9) {
    animation: changefont 2s linear infinite 0.8s;
  }

  .loader p:nth-child(10) {
    animation: changefont 2s linear infinite 0.9s;
  }

  @keyframes whitechange {
    0% {
      background-color: transparent;
      box-shadow: none;
    }
    25% {
      background-color: ${(props) => props.primaryColor};
    }
    50% {
      background-color: transparent;
      box-shadow: none;
    }
    100% {
      background-color: transparent;
      box-shadow: none;
    }
  }

  @keyframes changefont {
    0% {
      padding-bottom: 0em;
    }
    50% {
      padding-bottom: 0em;
    }
    75% {
      padding-bottom: 1em;
    }
    100% {
      color: ${(props) => props.backgroundColor};
      padding-bottom: 0em;
    }
  }
`;
