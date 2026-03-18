import React, { useState } from 'react';
import styled from 'styled-components';

export interface GlitchLoginFormAnimatedProps {
  onSubmit?: (data: { username: string; password: string }) => void;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
  buttonText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
}

const GlitchLoginFormAnimated: React.FC<GlitchLoginFormAnimatedProps> = ({
  onSubmit,
  usernamePlaceholder = 'User',
  passwordPlaceholder = 'Password',
  buttonText = 'Log in',
  primaryColor = '#4090b5',
  secondaryColor = '#9e30a9',
  accentColor = '#7afbff',
  backgroundColor = '#212121',
  textColor = '#fff',
  borderColor = '#4090b5',
  className,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ username, password });
    }
  };

  return (
    <StyledWrapper
      $primaryColor={primaryColor}
      $secondaryColor={secondaryColor}
      $accentColor={accentColor}
      $backgroundColor={backgroundColor}
      $textColor={textColor}
      $borderColor={borderColor}
      className={className}
    >
      <form className="container" onSubmit={handleSubmit}>
        <div className="input-container">
          <div className="input-content">
            <div className="input-dist">
              <div className="input-type">
                <input
                  className="input-is"
                  type="text"
                  required
                  placeholder={usernamePlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className="input-is"
                  type="password"
                  required
                  placeholder={passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="submit-button" type="submit">
          {buttonText}
        </button>
      </form>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $primaryColor: string;
  $secondaryColor: string;
  $accentColor: string;
  $backgroundColor: string;
  $textColor: string;
  $borderColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-style: italic;
    font-weight: bold;
    display: flex;
    margin: auto;
    aspect-ratio: 16/9;
    align-items: center;
    justify-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    flex-direction: column;
    gap: 1em;
  }

  .input-container {
    filter: drop-shadow(46px 36px 24px ${(props) => props.$primaryColor})
      drop-shadow(-55px -40px 25px ${(props) => props.$secondaryColor});
    animation: blinkShadowsFilter 8s ease-in infinite;
  }

  .input-content {
    display: grid;
    align-content: center;
    justify-items: center;
    align-items: center;
    text-align: center;
    padding-inline: 1em;
    position: relative;
  }

  .input-content::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(40px);
    -webkit-clip-path: polygon(
      26% 0,
      66% 0,
      92% 0,
      100% 8%,
      100% 89%,
      91% 100%,
      7% 100%,
      0 92%,
      0 0
    );
    clip-path: polygon(26% 0, 66% 0, 92% 0, 100% 8%, 100% 89%, 91% 100%, 7% 100%, 0 92%, 0 0);
    background: rgba(
      ${(props) => {
        const hex = props.$accentColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }},
      0.5568627451
    );
    transition: all 1s ease-in-out;
    z-index: 1;
  }

  .input-content::after {
    content: '';
    position: absolute;
    width: 98%;
    height: 98%;
    box-shadow: inset 0px 0px 20px 20px ${(props) => props.$backgroundColor};
    background:
      repeating-linear-gradient(
        to bottom,
        transparent 0%,
        rgba(
            ${(props) => {
              const hex = props.$primaryColor.replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              return `${r}, ${g}, ${b}`;
            }},
            0.6
          )
          1px,
        rgb(0, 0, 0) 3px,
        hsl(295, 60%, 12%) 5px,
        #153544 4px,
        transparent 0.5%
      ),
      repeating-linear-gradient(to left, hsl(295, 60%, 12%) 100%, hsla(295, 60%, 12%, 0.99) 100%);
    -webkit-clip-path: polygon(
      26% 0,
      31% 5%,
      61% 5%,
      66% 0,
      92% 0,
      100% 8%,
      100% 89%,
      91% 100%,
      7% 100%,
      0 92%,
      0 0
    );
    clip-path: polygon(
      26% 0,
      31% 5%,
      61% 5%,
      66% 0,
      92% 0,
      100% 8%,
      100% 89%,
      91% 100%,
      7% 100%,
      0 92%,
      0 0
    );
    animation: backglitch 50ms linear infinite;
    z-index: 2;
  }

  .input-dist {
    z-index: 80;
    display: grid;
    align-items: center;
    text-align: center;
    width: 100%;
    padding-inline: 1em;
    padding-block: 1.2em;
    grid-template-columns: 1fr;
    position: relative;
  }

  .input-type {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1em;
    font-size: 1.1rem;
    background-color: transparent;
    width: 100%;
    border: none;
  }

  .input-is {
    color: ${(props) => props.$textColor};
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
    transition: all 1s ease-in-out;
    border-bottom: 1px solid ${(props) => props.$borderColor};
    font-family: inherit;

    &:hover {
      transition: all 1s ease-in-out;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(
            ${(props) => {
              const hex = props.$accentColor.replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              return `${r}, ${g}, ${b}`;
            }},
            0.2
          )
          27%,
        rgba(
            ${(props) => {
              const hex = props.$accentColor.replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              return `${r}, ${g}, ${b}`;
            }},
            0.2
          )
          63%,
        transparent 100%
      );
    }

    &:focus {
      outline: none;
      border-bottom: 1px solid ${(props) => props.$accentColor};
      color: ${(props) => props.$accentColor};
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(
            ${(props) => {
              const hex = props.$accentColor.replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              return `${r}, ${g}, ${b}`;
            }},
            0.2
          )
          27%,
        rgba(
            ${(props) => {
              const hex = props.$accentColor.replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              return `${r}, ${g}, ${b}`;
            }},
            0.2
          )
          63%,
        transparent 100%
      );
    }

    &::placeholder {
      color: rgba(
        ${(props) => {
          const hex = props.$textColor.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `${r}, ${g}, ${b}`;
        }},
        0.806
      );
    }
  }

  .input-content:focus-within::before {
    transition: all 1s ease-in-out;
    background: hsla(0, 0%, 100%, 0.814);
  }

  .submit-button {
    width: 50%;
    border: none;
    color: rgba(
      ${(props) => {
        const hex = props.$textColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }},
      0.806
    );
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(
          ${(props) => {
            const hex = props.$accentColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
          }},
          0.2
        )
        27%,
      rgba(
          ${(props) => {
            const hex = props.$accentColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
          }},
          0.2
        )
        63%,
      transparent 100%
    );
    clip-path: polygon(0 0, 85% 0%, 100% 0, 100% 15%, 100% 90%, 91% 100%, 0 100%);
    padding: 0.5em;
    animation: blinkShadowsFilter 0.5s ease-in infinite;
    transition: all 500ms;
    cursor: pointer;
    font-family: inherit;
    font-weight: bold;

    &:hover {
      color: hsl(0, 0%, 100%);
      font-size: medium;
      font-weight: bold;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  @keyframes backglitch {
    0% {
      box-shadow: inset 0px 20px 20px 30px #212121;
    }
    50% {
      box-shadow: inset 0px -20px 20px 30px hsl(297, 42%, 10%);
    }
    to {
      box-shadow: inset 0px 20px 20px 30px #212121;
    }
  }

  @keyframes blinkShadowsFilter {
    0% {
      filter: drop-shadow(
          46px 36px 28px
            rgba(
              ${(props) => {
                const hex = props.$primaryColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
              }},
              0.3411764706
            )
        )
        drop-shadow(-55px -40px 28px ${(props) => props.$secondaryColor});
    }
    25% {
      filter: drop-shadow(
          46px -36px 24px
            rgba(
              ${(props) => {
                const hex = props.$primaryColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
              }},
              0.8980392157
            )
        )
        drop-shadow(-55px 40px 24px ${(props) => props.$secondaryColor});
    }
    50% {
      filter: drop-shadow(
          46px 36px 30px
            rgba(
              ${(props) => {
                const hex = props.$primaryColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
              }},
              0.8980392157
            )
        )
        drop-shadow(
          -55px 40px 30px
            rgba(
              ${(props) => {
                const hex = props.$secondaryColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
              }},
              0.2941176471
            )
        );
    }
    75% {
      filter: drop-shadow(
          20px -18px 25px
            rgba(
              ${(props) => {
                const hex = props.$primaryColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
              }},
              0.8980392157
            )
        )
        drop-shadow(
          -20px 20px 25px
            rgba(
              ${(props) => {
                const hex = props.$secondaryColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
              }},
              0.2941176471
            )
        );
    }
    to {
      filter: drop-shadow(
          46px 36px 28px
            rgba(
              ${(props) => {
                const hex = props.$primaryColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
              }},
              0.3411764706
            )
        )
        drop-shadow(-55px -40px 28px ${(props) => props.$secondaryColor});
    }
  }
`;

export default GlitchLoginFormAnimated;
