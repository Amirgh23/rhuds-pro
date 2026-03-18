import React, { useState } from 'react';
import styled from 'styled-components';

export interface AddFriendInputProps {
  /** Title text (default: "Add a friend") */
  title?: string;
  /** Placeholder text (default: "000000") */
  placeholder?: string;
  /** Button label (default: "Check Code") */
  buttonLabel?: string;
  /** Primary color (default: rgb(169, 116, 255)) */
  primaryColor?: string;
  /** Background color (default: rgb(36, 34, 39)) */
  backgroundColor?: string;
  /** Input min length (default: 6) */
  minLength?: number;
  /** Input max length (default: 6) */
  maxLength?: number;
  /** On input change handler */
  onChange?: (value: string) => void;
  /** On button click handler */
  onCheck?: (value: string) => void;
  /** Custom className */
  className?: string;
}

export const AddFriendInput: React.FC<AddFriendInputProps> = ({
  title = 'Add a friend',
  placeholder = '000000',
  buttonLabel = 'Check Code',
  primaryColor = 'rgb(169, 116, 255)',
  backgroundColor = 'rgb(36, 34, 39)',
  minLength = 6,
  maxLength = 6,
  onChange,
  onCheck,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange?.(value);
  };

  const handleCheckClick = () => {
    setIsChecked(!isChecked);
    onCheck?.(inputValue);
  };

  return (
    <StyledWrapper
      $primaryColor={primaryColor}
      $backgroundColor={backgroundColor}
      className={className}
    >
      <div className="input-add-friend">
        <div className="input-add-friend-title">
          <p>{title}</p>
        </div>
        <div className="input-add-friend-input">
          <input
            name="text"
            placeholder={placeholder}
            className="input"
            minLength={minLength}
            maxLength={maxLength}
            value={inputValue}
            onChange={handleInputChange}
            required
          />
          <p className="input-add-friend-text">{inputValue.split('').join('-')}</p>
          <div className="input-add-friend-input-behind" />
          <input
            type="checkbox"
            id="input-add-friend-checkbox"
            className="input-add-friend-checkbox"
            hidden
            checked={isChecked}
            onChange={handleCheckClick}
          />
          <label className="button" htmlFor="input-add-friend-checkbox">
            <p>{buttonLabel}</p>
          </label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={35}
            height={35}
            viewBox="0 0 24 24"
            fill="none"
            stroke={primaryColor}
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy={7} r={4} />
            <line x1={20} y1={8} x2={20} y2={14} />
            <line x1={23} y1={11} x2={17} y2={11} />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $primaryColor: string;
  $backgroundColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .input-add-friend {
    width: 17em;
    height: 11em;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    --color: ${(props) => props.$primaryColor};
    --background-color: ${(props) => props.$backgroundColor};
  }

  .input-add-friend .input-add-friend-title {
    display: flex;
    align-self: flex-start;
    margin-left: 0.5em;
  }

  .input-add-friend-title {
    width: 8em;
    height: 2em;
    background-color: var(--background-color);
    color: white;
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-family: monospace, sans-serif;
    box-shadow:
      -0.05em 0em var(--color),
      -0.05em -0.05em var(--color),
      0.05em -0.05em var(--color);
    position: relative;
    z-index: 1;
    align-items: center;
  }

  .input-add-friend-input {
    width: 16em;
    height: 8em;
    background-color: var(--background-color);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1em;
    font-weight: bold;
    box-shadow:
      -0.05em 0em var(--color),
      -0.05em 0.05em var(--color),
      0.05em 0.05em var(--color),
      0.05em -0.05em var(--color),
      0em 0em 2.5em 0em rgba(169, 116, 255, 0.15);
    position: relative;
    z-index: 0;
    animation: change-box-shadow 5s linear infinite;
  }

  @keyframes change-box-shadow {
    0% {
      box-shadow:
        -0.05em 0em var(--color),
        -0.05em 0.05em var(--color),
        0.05em 0.05em var(--color),
        0.05em -0.05em var(--color),
        0em 0em 2.5em 0em rgba(169, 116, 255, 0);
    }
    50% {
      box-shadow:
        -0.05em 0em var(--color),
        -0.05em 0.05em var(--color),
        0.05em 0.05em var(--color),
        0.05em -0.05em var(--color),
        0em 0em 2.5em 0em rgba(169, 116, 255, 0.25);
    }
    100% {
      box-shadow:
        -0.05em 0em var(--color),
        -0.05em 0.05em var(--color),
        0.05em 0.05em var(--color),
        0.05em -0.05em var(--color),
        0em 0em 2.5em 0em rgba(169, 116, 255, 0);
    }
  }

  .input-add-friend-input input {
    width: 16em;
    height: 2.5em;
    border: solid 0.5em transparent;
    font-family: monospace, sans-serif;
    color: var(--background-color);
    font-weight: bold;
    outline: none;
    padding-left: 3.5em;
    letter-spacing: 1em;
    background-color: transparent;
    position: relative;
    z-index: 4;
  }

  .input::placeholder {
    color: var(--background-color);
    font-weight: bold;
    font-family: monospace, sans-serif;
  }

  .input-add-friend-checkbox:hover + label {
    opacity: 75%;
  }

  .input-add-friend-checkbox:hover + label p {
    font-size: 14px;
    transition: all 0.25s ease-in-out;
  }

  .input-add-friend-checkbox + label {
    width: 13.25em;
    height: 2.25em;
    border: solid 0.5em var(--color);
    background-color: var(--color);
    font-family: monospace, sans-serif;
    color: var(--background-color);
    font-weight: bold;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.25s ease-in-out;
    cursor: pointer;
  }

  .input-add-friend svg {
    position: absolute;
    top: -2.25em;
    right: 0em;
  }

  .input-add-friend-checkbox:active + label {
    background-color: white;
    border: white;
  }

  .input-add-friend:has(.input-add-friend-checkbox:checked) {
    filter: hue-rotate(-120deg);
    transition: all 0.25s ease-in-out;
  }

  .input-add-friend-checkbox:checked ~ svg {
    animation: jumpicon 0.75s infinite linear;
    animation-iteration-count: 1;
  }

  @keyframes jumpicon {
    0% {
      top: -2.25em;
      transform: rotate(0deg) scale(1);
    }
    25% {
      top: -2.5em;
      transform: rotate(0deg) scale(1.15);
    }
    50% {
      top: -2.5em;
      transform: rotate(10deg) scale(1.15);
    }
    75% {
      top: -2.5em;
      transform: rotate(-10deg) scale(1.15);
    }
    95% {
      transform: rotate(0deg) scale(1);
    }
    100% {
      top: -2.25em;
      transform: rotate(0deg) scale(1);
    }
  }

  .input-add-friend-text {
    color: var(--background-color);
    position: absolute;
    letter-spacing: 0.85em;
    top: 1.65em;
    left: 5.25em;
    z-index: 3;
  }

  .input-add-friend-input-behind {
    width: 13.25em;
    height: 2.25em;
    top: 1.35em;
    font-family: monospace, sans-serif;
    color: var(--background-color);
    font-weight: bold;
    background-color: rgb(255, 255, 255);
    position: absolute;
    z-index: 2;
  }
`;

export default AddFriendInput;
