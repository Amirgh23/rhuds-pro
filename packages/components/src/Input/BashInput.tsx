import React from 'react';
import styled from 'styled-components';

export interface BashInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  userColor?: string;
  vmColor?: string;
  charColor?: string;
  textColor?: string;
  backgroundColor?: string;
  className?: string;
}

const BashInput: React.FC<BashInputProps> = ({
  placeholder = 'sudo uiverse or wot',
  value = '',
  onChange,
  userColor = '#e879f9',
  vmColor = '#2dd4bf',
  charColor = '#a78bfa',
  textColor = '#ffffff',
  backgroundColor = '#0f172a',
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <StyledWrapper
      $userColor={userColor}
      $vmColor={vmColor}
      $charColor={charColor}
      $textColor={textColor}
      $backgroundColor={backgroundColor}
      className={className}
    >
      <div className="input-container">
        <p className="bash-text">
          <span className="user">root</span>
          <span className="vm">@uiverse</span>
          <span className="char">:</span>
          <span className="char">~</span>
          <span className="char">#</span>
        </p>
        <input
          type="text"
          placeholder={placeholder}
          className="input"
          value={value}
          onChange={handleChange}
        />
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $userColor: string;
  $vmColor: string;
  $charColor: string;
  $textColor: string;
  $backgroundColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .input-container {
    display: flex;
    align-items: center;
    background-color: ${(props) => props.$backgroundColor};
    padding: 10px 15px;
    gap: 5px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .input-container:focus-within {
    border-color: ${(props) => props.$userColor};
    box-shadow: 0 0 10px rgba(232, 121, 249, 0.2);
  }

  .input-container .bash-text {
    font-size: 0.8rem;
    color: ${(props) => props.$textColor};
    margin: 0;
    white-space: nowrap;
    font-family: 'Courier New', monospace;
    font-weight: 500;
  }

  .input-container .bash-text .user {
    color: ${(props) => props.$userColor};
  }

  .input-container .bash-text .vm {
    color: ${(props) => props.$vmColor};
  }

  .input-container .bash-text .char {
    color: ${(props) => props.$charColor};
  }

  .input-container input[type='text'].input {
    background-color: transparent;
    border: none;
    outline: none;
    color: ${(props) => props.$textColor};
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    flex: 1;
    min-width: 200px;
  }

  .input-container input[type='text'].input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  .input-container input[type='text'].input:focus {
    color: ${(props) => props.$userColor};
  }
`;

export default BashInput;
