import React, { useState } from 'react';
import styled from 'styled-components';

export interface TooltipLink {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

export interface CyberSupportTooltipProps {
  title?: string;
  links?: TooltipLink[];
  color?: string;
  className?: string;
}

const CyberSupportTooltip: React.FC<CyberSupportTooltipProps> = ({
  title = 'Support',
  links = [
    {
      icon: '📞',
      label: '000-000-1111',
      href: 'tel:000-000-1111',
    },
    {
      icon: '🕐',
      label: '8:30AM - 5PM PST',
      href: '#',
    },
    {
      icon: '✉️',
      label: 'uiverse.io',
      href: 'mailto:support@uiverse.io',
    },
  ],
  color = '#00c1d5',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledWrapper className={className} $color={color}>
      <div className="tooltip-wrapper">
        <ul className="tooltip-container">
          <li className="nav-link">
            <div
              className="tooltip-tab"
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ fill: 'none' }}
                fill="none"
                viewBox="0 0 16 16"
                height={16}
                width={16}
              >
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="#ffffff"
                  d="M1 10V8C1 2.5 6 1 8 1C10 1 15 2.5 15 8V10M1 10C1 10.5552 1 11.1543 1.0984 11.6204C1.24447 12.3122 2 13 3 13C4 13 4.75553 12.3122 4.9016 11.6204C5 11.1543 5 10.5552 5 10C5 9.44485 5 8.84565 4.9016 8.37961C4.75553 7.68776 4 7 3 7C2 7 1.24447 7.68776 1.0984 8.37961C1 8.84565 1 9.44485 1 10ZM15 10C15 10.5552 15 11.1543 14.9016 11.6204C14.7555 12.3122 14 13 13 13C12 13 11.2445 12.3122 11.0984 11.6204C11 11.1543 11 10.5552 11 10C11 9.44485 11 8.84565 11.0984 8.37961C11.2445 7.68776 12 7 13 7C14 7 14.7555 7.68776 14.9016 8.37961C15 8.84565 15 9.44485 15 10ZM15 10C15 15.5 12.5 15 8 15"
                />
              </svg>
              {title}
            </div>
            <div
              className="tooltip"
              style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
            >
              <ul className="tooltip-menu-with-icon">
                {links.map((link, index) => (
                  <li key={index} className="tooltip-link">
                    <a className="tooltip-links" href={link.href || '#'}>
                      <span style={{ fontSize: '16px' }}>{link.icon}</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $color: string }>`
  .tooltip-wrapper {
    --clr-btn: rgb(2 22 36);
    --clr-dropdown: rgb(2 22 36);
    --clr-nav-hover: rgb(2 22 36);
    --clr-dropdown-hov: rgb(2 22 36);
    --clr-dropdown-link-hov: rgb(2 22 36);
    --clr-light: #ffffff;
    --tooltip-color: ${(props) => props.$color};
  }

  .nav-link {
    position: relative;
  }

  .tooltip-wrapper > .tooltip-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .tooltip-container,
  .tooltip-menu-with-icon {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-link > .tooltip-tab {
    color: var(--clr-light);
    background: var(--clr-btn);
    padding: 0.8rem 1rem;
    letter-spacing: 1px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    column-gap: 12px;
    justify-content: space-between;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid var(--tooltip-color);
    transition: 0.3s ease-in-out;
  }

  .nav-link > .tooltip-tab:hover svg {
    transform: rotate(360deg);
    transition: 0.3s ease-in-out;
  }

  .tooltip-links {
    text-decoration: none;
  }

  .nav-link svg {
    fill: #fff;
    width: 16px;
    height: 16px;
  }

  .tooltip {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 12rem;
    max-width: 15rem;
    transform: translateY(10px);
    opacity: 0;
    pointer-events: none;
    transition: 0.5s;
    padding: 15px 0px 0px 0px;
  }

  .tooltip::after {
    content: '';
    width: 15px;
    height: 15px;
    background: var(--tooltip-color);
    top: 0px;
    left: 6%;
    position: absolute;
    display: inline-block;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    transform: rotate(360deg);
    z-index: -1;
    box-shadow: 0px 6px 30px rgb(2 22 36);
  }

  .tooltip .tooltip-menu-with-icon {
    padding: 10px 0px;
    background-color: var(--clr-dropdown);
    border: 1px solid var(--tooltip-color);
    position: relative;
  }

  .tooltip-link {
    position: relative;
  }

  .tooltip-link:not(:nth-last-child(1)) {
    border-bottom: 1px solid var(--tooltip-color);
  }

  .tooltip-link > a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 10px;
    background-color: var(--clr-dropdown);
    color: var(--clr-light);
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    transition: 0.3s;
  }

  .tooltip-link > a:hover {
    background-color: var(--clr-dropdown-link-hov);
    color: var(--tooltip-color);
  }

  .tooltip-menu-with-icon svg {
    height: 20px;
    margin-left: 0px;
  }

  .nav-link:hover > .tooltip-tab {
    transform: scale(1.1);
  }

  .nav-link:hover > .tooltip,
  .tooltip-link:hover > .tooltip {
    transform: translate(0, 0);
    opacity: 1;
    pointer-events: auto;
    -webkit-transform: translate(0, 0);
    -moz-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
  }

  .nav-link:hover > .tooltip-tab {
    transform: scale(1);
    background-color: var(--clr-nav-hover);
  }
`;

export default CyberSupportTooltip;
