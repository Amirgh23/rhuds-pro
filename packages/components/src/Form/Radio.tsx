import React from 'react';
import styled from 'styled-components';

export interface RadioOption {
  id: string;
  label: string;
}

export interface RadioProps {
  options: RadioOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  color?: string;
  colorOpacity?: string;
  name?: string;
}

const Radio: React.FC<RadioProps> = ({
  options,
  defaultValue,
  onChange,
  color = '#f7e479',
  colorOpacity = '#f7e4791c',
  name = 'radio',
}) => {
  const [selected, setSelected] = React.useState(defaultValue || options[0]?.id);

  const handleChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <StyledWrapper $mainColor={color} $mainColorOpacity={colorOpacity} $totalRadio={options.length}>
      <div className="radio-container">
        {options.map((option, index) => (
          <React.Fragment key={option.id}>
            <input
              id={option.id}
              name={name}
              type="radio"
              checked={selected === option.id}
              onChange={() => handleChange(option.id)}
            />
            <label htmlFor={option.id}>{option.label}</label>
          </React.Fragment>
        ))}
        <div className="glider-container">
          <div className="glider" />
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $mainColor: string;
  $mainColorOpacity: string;
  $totalRadio: number;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .radio-container {
    --main-color: ${(props) => props.$mainColor};
    --main-color-opacity: ${(props) => props.$mainColorOpacity};
    --total-radio: ${(props) => props.$totalRadio};
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 0.5rem;
  }

  .radio-container input {
    cursor: pointer;
    appearance: none;
  }

  .radio-container .glider-container {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(27, 27, 27, 1) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    width: 1px;
  }

  .radio-container .glider-container .glider {
    position: relative;
    height: calc(100% / var(--total-radio));
    width: 100%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      var(--main-color) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    transition: transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56);
  }

  .radio-container .glider-container .glider::before {
    content: '';
    position: absolute;
    height: 60%;
    width: 300%;
    top: 50%;
    transform: translateY(-50%);
    background: var(--main-color);
    filter: blur(10px);
  }

  .radio-container .glider-container .glider::after {
    content: '';
    position: absolute;
    left: 0;
    height: 100%;
    width: 150px;
    background: linear-gradient(90deg, var(--main-color-opacity) 0%, rgba(0, 0, 0, 0) 100%);
  }

  .radio-container label {
    cursor: pointer;
    padding: 1rem;
    position: relative;
    color: grey;
    transition: all 0.3s ease-in-out;
  }

  .radio-container input:checked + label {
    color: var(--main-color);
  }

  ${Array.from(
    { length: 10 },
    (_, i) => `
    .radio-container input:nth-of-type(${i + 1}):checked ~ .glider-container .glider {
      transform: translateY(${i * 100}%);
    }
  `
  ).join('')}
`;

export default Radio;
