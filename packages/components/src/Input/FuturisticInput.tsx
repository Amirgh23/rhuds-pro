import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface FuturisticInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  enterLabel?: string;
  nameLabel?: string;
  className?: string;
}

export const FuturisticInput: React.FC<FuturisticInputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  name = 'text',
  enterLabel = 'ENTER',
  nameLabel = 'NAME',
  className,
}) => {
  return (
    <StyledWrapper className={className}>
      <div className="futuristic-input">
        <div className="futuristic-input-space">
          <div className="futuristic-input-space-2" />
          <div className="triangle-input-up" />
          <div className="triangle-input-bar2" />
          <div className="triangle-input-left" />
          <div className="futuristic-input-space-2" />
          <div className="triangle-input-right2" />
          <div className="triangle-input-bar3" />
        </div>
        <div className="futuristic-input-space">
          <div className="triangle-input-up" />
          <div className="triangle-input-bar" />
        </div>
        <div className="futuristic-input-space">
          <div className="triangle-input-bar" />
          <input
            type={type}
            name={name}
            className="input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
          <p className="futuristic-input-enter">{enterLabel}</p>
          <p className="futuristic-input-name">{nameLabel}</p>
        </div>
        <div className="futuristic-input-space">
          <div className="triangle-input-bar" />
        </div>
        <div className="futuristic-input-space">
          <div className="triangle-input-bar" />
          <div className="triangle-input-down" />
        </div>
        <div className="futuristic-input-space2">
          <div className="triangle-input-bar3" />
          <div className="triangle-input-left2" />
          <div className="futuristic-input-space-2" />
          <div className="triangle-input-right" />
          <div className="triangle-input-bar2" />
          <div className="triangle-input-down" />
          <div className="futuristic-input-space-2" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const changeborder = keyframes`
  0% {
    border: 0.1em solid rgba(41, 242, 223, 0.3);
    border-left: 0.1em solid #29F2DF;
  }
  25% {
    border: 0.1em solid rgba(41, 242, 223, 0.3);
    border-top: 0.1em solid #29F2DF;
  }
  50% {
    border: 0.1em solid rgba(41, 242, 223, 0.3);
    border-right: 0.1em solid #29F2DF;
  }
  70% {
    border: 0.1em solid rgba(41, 242, 223, 0.3);
    border-bottom: 0.1em solid #29F2DF;
  }
  100% {
    border: 0.1em solid rgba(41, 242, 223, 0.3);
    border-left: 0.1em solid #29F2DF;
  }
`;

const spawnLight = keyframes`
  0% {
    background-color: rgba(41, 242, 223, 0.3);
    box-shadow: 0em 0em 5em rgba(41, 242, 223, 0.8);
  }
  50% {
    box-shadow: 0em 0em 0em rgba(41, 242, 223, 0);
  }
  100% {
    background-color: rgba(41, 242, 223, 0);
  }
`;

const colorChange = keyframes`
  0% {
    color: #29F2DF;
  }
  25% {
    color: #29F2DF;
  }
  30% {
    color: transparent;
  }
  35% {
    color: #29F2DF;
  }
  40% {
    color: transparent;
  }
  45% {
    color: #29F2DF;
  }
  100% {
    color: #29F2DF;
  }
`;

const StyledWrapper = styled.div`
  .futuristic-input {
    width: 15em;
    height: 6em;
    position: relative;
    overflow: hidden;
    --firstcolor: #0a0e27;
    --secondcolor: #0a0e27;
    transition: all 0.25s ease-in-out;
    padding: 0em;
    margin: 0em;
    animation: ${changeborder} 2.5s infinite linear;
  }

  .futuristic-input:hover {
    transform: scale(1.1);
    animation: ${spawnLight} 1s;
    animation-iteration-count: 1;
  }

  .input {
    width: 80%;
    height: 1.75em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-left: none;
    border-top: none;
    border-right: none;
    border-bottom: 0.15em solid #29F2DF;
    background-color: var(--firstcolor);
    font-weight: bold;
    padding-left: 0.25em;
    color: #29F2DF;
    outline: none;
    font-weight: 100;
  }

  .input::placeholder {
    color: rgba(41, 242, 223, 0.5);
  }

  .triangle-input-up {
    width: 0em;
    height: 0em;
    border-left: 1em solid transparent;
    border-bottom: 1em solid var(--secondcolor);
  }

  .triangle-input-left {
    width: 0em;
    height: 0em;
    border-right: 1em solid transparent;
    border-bottom: 1em solid var(--firstcolor);
  }

  .triangle-input-left2 {
    width: 0em;
    height: 0em;
    border-right: 1em solid transparent;
    border-bottom: 1em solid #29F2DF;
  }

  .triangle-input-down {
    width: 0em;
    height: 0em;
    border-bottom: 1em solid transparent;
    border-left: 1em solid var(--firstcolor);
  }

  .triangle-input-right {
    width: 0em;
    height: 0em;
    border-left: 1em solid transparent;
    border-top: 1em solid var(--secondcolor);
  }

  .triangle-input-right2 {
    width: 0em;
    height: 0em;
    border-left: 1em solid transparent;
    border-top: 1em solid #29F2DF;
  }

  .futuristic-input-space {
    width: 100%;
    height: 1em;
    display: flex;
  }

  .futuristic-input-space2 {
    width: 100%;
    height: 1em;
    display: flex;
    justify-content: flex-end;
  }

  .triangle-input-bar {
    width: 100%;
    height: 100%;
    background-color: var(--firstcolor);
  }

  .triangle-input-bar2 {
    width: 5em;
    height: 100%;
    background-color: var(--firstcolor);
  }

  .triangle-input-bar3 {
    width: 3em;
    height: 100%;
    background-color: #29F2DF;
  }

  .futuristic-input-space-2 {
    width: 2em;
    height: 1em;
    display: flex;
  }

  .futuristic-input-enter {
    color: #29F2DF;
    top: 0.5em;
    position: absolute;
    left: 3.2em;
    font-weight: bold;
    animation: ${colorChange} 2.5s infinite linear;
    -webkit-text-stroke: 0.01em #29F2DF;
    font-size: 1.25em;
    text-shadow: 1em 0em 1em rgba(41, 242, 223, 0.5);
  }

  .futuristic-input-name {
    color: #29F2DF;
    bottom: 0.5em;
    position: absolute;
    right: 3.25em;
    font-weight: bold;
    animation: ${colorChange} 2.5s infinite linear 0.5s;
    -webkit-text-stroke: 0.01em #29F2DF;
    font-size: 1.25em;
    text-shadow: -2em 0em 1em rgba(41, 242, 223, 0.5);
  }
`;

export default FuturisticInput;
