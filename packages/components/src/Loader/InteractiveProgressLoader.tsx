import React, { useState } from 'react';
import styled from 'styled-components';

export interface InteractiveProgressLoaderProps {
  /** Primary color (default: seagreen) */
  primaryColor?: string;
  /** Neutral color (default: white) */
  neutralColor?: string;
  /** Custom className */
  className?: string;
  /** On reload button click */
  onReload?: () => void;
}

export const InteractiveProgressLoader: React.FC<InteractiveProgressLoaderProps> = ({
  primaryColor = 'seagreen',
  neutralColor = '#fff',
  className,
  onReload,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleReload = () => {
    setIsLoading(true);
    onReload?.();
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <StyledWrapper $primaryColor={primaryColor} $neutralColor={neutralColor}>
      <div className={`loader-container ${className || ''}`}>
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="area" />
        ))}
        <button className="btn" onClick={handleReload}>
          Reload
        </button>
        <div className="loader">
          <p className="text">LOADING...</p>
          <span style={{ '--i': 100, '--d': 0 } as React.CSSProperties} />
          <div className="groove">
            <span style={{ '--i': 50, '--d': 100 } as React.CSSProperties} />
            <span style={{ '--i': 30, '--d': 150 } as React.CSSProperties} />
            <span style={{ '--i': 50, '--d': 180 } as React.CSSProperties} />
          </div>
          <span style={{ '--i': 10, '--d': 230 } as React.CSSProperties} />
          <div className="groove">
            <span style={{ '--i': 100, '--d': 240 } as React.CSSProperties} />
            <span style={{ '--i': 15, '--d': 340 } as React.CSSProperties} />
            <span style={{ '--i': 140, '--d': 355 } as React.CSSProperties} />
          </div>
          <span style={{ '--i': 60, '--d': 495 } as React.CSSProperties} />
          <div className="groove">
            <span style={{ '--i': 60, '--d': 555 } as React.CSSProperties} />
            <span style={{ '--i': 50, '--d': 615 } as React.CSSProperties} />
            <span style={{ '--i': 20, '--d': 665 } as React.CSSProperties} />
          </div>
          <span style={{ '--i': 40, '--d': 685 } as React.CSSProperties} />
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $primaryColor: string;
  $neutralColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  --color-primary: ${(props) => props.$primaryColor};
  --color-neutral: ${(props) => props.$neutralColor};

  .loader-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    position: relative;
    width: 100%;
    height: 100%;
  }

  .area {
    &:nth-of-type(1):hover ~ .loader {
      transform: rotateX(-20deg) rotateY(20deg);
    }
    &:nth-of-type(2):hover ~ .loader {
      transform: rotateX(-20deg) rotateY(10deg);
    }
    &:nth-of-type(3):hover ~ .loader {
      transform: rotateX(-20deg) rotateY(5deg);
    }
    &:nth-of-type(4):hover ~ .loader {
      transform: rotateX(-20deg) rotateY(-5deg);
    }
    &:nth-of-type(5):hover ~ .loader {
      transform: rotateX(-20deg) rotateY(-10deg);
    }
    &:nth-of-type(6):hover ~ .loader {
      transform: rotateX(-20deg) rotateY(-20deg);
    }
    &:nth-of-type(7):hover ~ .loader {
      transform: rotateX(-10deg) rotateY(20deg);
    }
    &:nth-of-type(8):hover ~ .loader {
      transform: rotateX(-10deg) rotateY(10deg);
    }
    &:nth-of-type(9):hover ~ .loader {
      transform: rotateX(-10deg) rotateY(5deg);
    }
    &:nth-of-type(10):hover ~ .loader {
      transform: rotateX(-10deg) rotateY(-5deg);
    }
    &:nth-of-type(11):hover ~ .loader {
      transform: rotateX(-10deg) rotateY(-10deg);
    }
    &:nth-of-type(12):hover ~ .loader {
      transform: rotateX(-10deg) rotateY(-20deg);
    }
    &:nth-of-type(13):hover ~ .loader {
      transform: rotateX(-5deg) rotateY(20deg);
    }
    &:nth-of-type(14):hover ~ .loader {
      transform: rotateX(-5deg) rotateY(10deg);
    }
    &:nth-of-type(15):hover ~ .loader {
      transform: rotateX(-5deg) rotateY(5deg);
    }
    &:nth-of-type(16):hover ~ .loader {
      transform: rotateX(-5deg) rotateY(-5deg);
    }
    &:nth-of-type(17):hover ~ .loader {
      transform: rotateX(-5deg) rotateY(-10deg);
    }
    &:nth-of-type(18):hover ~ .loader {
      transform: rotateX(-5deg) rotateY(-20deg);
    }
    &:nth-of-type(19):hover ~ .loader {
      transform: rotateX(5deg) rotateY(20deg);
    }
    &:nth-of-type(20):hover ~ .loader {
      transform: rotateX(5deg) rotateY(10deg);
    }
    &:nth-of-type(21):hover ~ .loader {
      transform: rotateX(5deg) rotateY(5deg);
    }
    &:nth-of-type(22):hover ~ .loader {
      transform: rotateX(5deg) rotateY(-5deg);
    }
    &:nth-of-type(23):hover ~ .loader {
      transform: rotateX(5deg) rotateY(-10deg);
    }
    &:nth-of-type(24):hover ~ .loader {
      transform: rotateX(5deg) rotateY(-20deg);
    }
    &:nth-of-type(25):hover ~ .loader {
      transform: rotateX(10deg) rotateY(20deg);
    }
    &:nth-of-type(26):hover ~ .loader {
      transform: rotateX(10deg) rotateY(10deg);
    }
    &:nth-of-type(27):hover ~ .loader {
      transform: rotateX(10deg) rotateY(5deg);
    }
    &:nth-of-type(28):hover ~ .loader {
      transform: rotateX(10deg) rotateY(-5deg);
    }
    &:nth-of-type(29):hover ~ .loader {
      transform: rotateX(10deg) rotateY(-10deg);
    }
    &:nth-of-type(30):hover ~ .loader {
      transform: rotateX(10deg) rotateY(-20deg);
    }
    &:nth-of-type(31):hover ~ .loader {
      transform: rotateX(20deg) rotateY(20deg);
    }
    &:nth-of-type(32):hover ~ .loader {
      transform: rotateX(20deg) rotateY(10deg);
    }
    &:nth-of-type(33):hover ~ .loader {
      transform: rotateX(20deg) rotateY(5deg);
    }
    &:nth-of-type(34):hover ~ .loader {
      transform: rotateX(20deg) rotateY(-5deg);
    }
    &:nth-of-type(35):hover ~ .loader {
      transform: rotateX(20deg) rotateY(-10deg);
    }
    &:nth-of-type(36):hover ~ .loader {
      transform: rotateX(20deg) rotateY(-20deg);
    }
  }

  .loader {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    transition: all 0.15s linear;
    translate: -50% -50%;

    & span {
      position: relative;
      height: 30px;
      background-color: var(--color-neutral);
      border-top: 0.2rem solid var(--color-primary);
      border-bottom: 0.2rem solid var(--color-primary);

      &::before {
        content: '';
        position: absolute;
        top: 0.2rem;
        width: 100%;
        height: calc(100% - 0.4rem);
        background-color: var(--color-primary);
        clip-path: inset(0 100% 0 0);
        animation: progress calc(var(--i) * 10ms) linear calc(var(--d) * 10ms) forwards;
      }
    }

    & > span {
      &:nth-of-type(1) {
        width: 100px;
        border-left: 0.2rem solid var(--color-primary);
        border-radius: 10px 0 0 10px;

        &::before {
          left: 0.2rem;
          width: calc(100% - 0.2rem + 1px);
          border-radius: 5px 0 0 5px;
        }
      }

      &:nth-of-type(2) {
        width: 10px;

        &::before {
          left: -1px;
          width: calc(100% + 2px);
        }
      }

      &:nth-of-type(3) {
        width: 50px;
        transform: translateZ(40px);

        &::before {
          left: -1px;
          width: calc(100% + 2px);
        }
      }

      &:nth-of-type(4) {
        width: 40px;
        border-right: 0.2rem solid var(--color-primary);
        border-radius: 0 10px 10px 0;

        &::before {
          right: 0.2rem;
          width: calc(100% - 0.2rem + 1px);
          border-radius: 0 5px 5px 0;
        }
      }
    }
  }

  .text {
    position: absolute;
    top: -60%;
    left: 10px;
    color: var(--color-primary);
    font-weight: 900;
    transform: translateZ(-20px);
    margin: 0;
  }

  .groove {
    position: relative;
    transform-style: preserve-3d;

    & > span {
      display: inline-block;
    }

    & > :first-child,
    & > :last-child {
      position: absolute;
    }

    &:nth-of-type(1) {
      & > :nth-child(1) {
        width: 50px;
        transform: rotateY(90deg);
        transform-origin: left;
      }

      & > :nth-child(2) {
        width: 30px;
        transform: translateZ(-50px);
      }

      & > :nth-child(3) {
        width: 50px;
        transform: rotateY(-90deg) translateX(-50px);
        transform-origin: left;
      }
    }

    &:nth-of-type(2) {
      & > :nth-child(1) {
        width: 100px;
        transform: rotateY(90deg);
        transform-origin: left;
      }

      & > :nth-child(2) {
        width: 15px;
        transform: translateZ(-100px);
      }

      & > :nth-child(3) {
        width: 140px;
        transform: rotateY(-90deg) translateX(-100px);
        transform-origin: left;
      }
    }

    &:nth-of-type(3) {
      & > :nth-child(1) {
        width: 60px;
        transform: rotateY(90deg) translateX(-40px);
        transform-origin: left;
      }

      & > :nth-child(2) {
        width: 30px;
        transform: translateZ(-20px);
      }

      & > :nth-child(3) {
        width: 20px;
        transform: rotateY(-90deg) translateX(-20px);
        transform-origin: left;
      }
    }
  }

  .btn {
    position: absolute;
    top: calc(50% + 5rem);
    left: 50%;
    padding: 0.5rem;
    border: 5px solid var(--color-primary);
    border-radius: 10px;
    background: linear-gradient(var(--color-primary), var(--color-primary)) 0 0 / 100% 0 no-repeat;
    color: var(--color-primary);
    font-weight: 900;
    transition: all 0.1s ease-in-out;
    transform: translate(-50%, -50%);
    cursor: pointer;

    &:hover {
      background-size: 100% 100%;
      color: var(--color-neutral);
    }

    &:active {
      font-size: 0.7em;

      & ~ .loader span::before {
        display: none;
      }
    }
  }

  @keyframes progress {
    to {
      clip-path: inset(0 0 0 0);
    }
  }
`;

export default InteractiveProgressLoader;
