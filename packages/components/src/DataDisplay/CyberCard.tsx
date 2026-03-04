/**
 * CyberCard Component
 * Cyberpunk-style card with glitch effects and animated borders
 */

import React from 'react';
import styled from 'styled-components';

export interface CyberCardProps {
  title?: string;
  footer?: string;
  children?: React.ReactNode;
  className?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

const StyledWrapper = styled.div`
  .container {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-style: italic;
    font-weight: bold;
    display: flex;
    margin: auto;
    aspect-ratio: 16/9;
    align-items: center;
    justify-items: center;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1em;
  }

  .card-container {
    filter: drop-shadow(46px 36px 24px rgba(0, 246, 255, 0.4)) drop-shadow(-55px -40px 25px rgba(0, 246, 255, 0.3));
    animation: cyberCardBlinkShadows 8s ease-in infinite;
  }

  .card-content {
    display: grid;
    align-content: center;
    justify-items: center;
    align-items: center;
    text-align: center;
    padding: 1em;
    grid-template-rows: 0.1fr 0.7fr 0.25fr;
    background-color: rgba(0, 20, 40, 0.95);
    width: 10em;
    aspect-ratio: 9/16;
    -webkit-clip-path: polygon(0 0, 85% 0, 100% 14%, 100% 60%, 92% 65%, 93% 77%, 99% 80%, 99% 90%, 89% 100%, 0 100%);
    clip-path: polygon(0 0, 85% 0, 100% 14%, 100% 60%, 92% 65%, 93% 77%, 99% 80%, 99% 90%, 89% 100%, 0 100%);
  }

  .card-content::before {
    content: "";
    position: absolute;
    width: 250%;
    aspect-ratio: 1/1;
    transform-origin: center;
    background: linear-gradient(to bottom, transparent, transparent, #00f6ff, #00f6ff, #00ccff, #00ccff, transparent, transparent),
      linear-gradient(to left, transparent, transparent, #00f6ff, #00f6ff, #00ccff, #00ccff, transparent, transparent);
    animation: cyberCardRotate 5s infinite linear;
  }

  .card-content::after {
    content: "";
    position: absolute;
    top: 1%;
    left: 1%;
    width: 98%;
    height: 98%;
    background: repeating-linear-gradient(to bottom, transparent 0%, rgba(0, 246, 255, 0.3) 1px, rgb(0, 10, 20) 3px, rgba(0, 246, 255, 0.2) 5px, #001a2e 4px, transparent 0.5%),
      repeating-linear-gradient(to left, rgba(0, 20, 40, 0.95) 100%, rgba(0, 20, 40, 0.99) 100%);
    box-shadow: inset 0px 0px 30px 40px rgba(0, 20, 40, 0.95);
    -webkit-clip-path: polygon(0 0, 85% 0, 100% 14%, 100% 60%, 92% 65%, 93% 77%, 99% 80%, 99% 90%, 89% 100%, 0 100%);
    clip-path: polygon(0 0, 85% 0, 100% 14%, 100% 60%, 92% 65%, 93% 77%, 99% 80%, 99% 90%, 89% 100%, 0 100%);
    animation: cyberCardBackglitch 94ms linear infinite;
  }

  .card-title {
    z-index: 80;
    -webkit-clip-path: polygon(90% 0, 100% 100%, 0% 100%, 0% 0%);
    clip-path: polygon(90% 0, 100% 100%, 0% 100%, 0% 0%);
    background: linear-gradient(90deg, rgba(0, 246, 255, 0) 0%, rgba(0, 246, 255, 0.3) 27%, rgba(0, 246, 255, 0.3) 63%, rgba(0, 246, 255, 0) 100%),
      linear-gradient(0deg, rgba(0, 246, 255, 0.3) 0%, rgba(0, 246, 255, 0) 10%, rgba(0, 246, 255, 0) 96%, rgba(0, 246, 255, 0.3) 100%);
    width: 98%;
    font-size: 1.2em;
  }

  .title {
    width: 100%;
    height: 100%;
    text-align: right;
    position: relative;
    z-index: 2;
    color: #00f6ff;
    font-size: 1em;
    transition: all ease-in-out 2s linear;
    text-shadow: 0 0 10px rgba(0, 246, 255, 0.8);
  }

  .card-body {
    padding-block: 1.5em;
    padding-inline: 1em;
    z-index: 80;
    display: flex;
    gap: 1.5em;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    align-content: center;
  }

  .svg-card {
    text-decoration: none;
    color: #00f6ff;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 246, 255, 0.2) 27%, rgba(0, 246, 255, 0.2) 63%, transparent 100%);
    fill: currentColor;
    width: 2em;
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    cursor: pointer;
    border: 1px solid rgba(0, 246, 255, 0.3);
  }

  .svg-card .face {
    width: 0.7em;
  }

  .svg-card .twit {
    width: 1em;
  }

  .svg-card .insta {
    width: 1em;
  }

  .svg-card .whats {
    width: 1.1em;
  }

  .svg-card:hover {
    cursor: pointer;
    color: #ffffff;
    background: rgba(0, 246, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 246, 255, 0.6);
  }

  .card-footer {
    padding-inline: 1em;
  }

  @keyframes cyberCardBackglitch {
    0% {
      box-shadow: inset 0px 20px 30px 40px rgba(0, 20, 40, 0.95);
    }
    50% {
      box-shadow: inset 0px -20px 30px 40px rgba(0, 30, 50, 0.95);
    }
    to {
      box-shadow: inset 0px 20px 30px 40px rgba(0, 20, 40, 0.95);
    }
  }

  @keyframes cyberCardRotate {
    0% {
      transform: rotate(0deg) translate(-50%, 20%);
    }
    50% {
      transform: rotate(180deg) translate(40%, 10%);
    }
    to {
      transform: rotate(360deg) translate(-50%, 20%);
    }
  }

  @keyframes cyberCardBlinkShadows {
    0% {
      filter: drop-shadow(46px 36px 28px rgba(0, 246, 255, 0.4)) drop-shadow(-55px -40px 28px rgba(0, 246, 255, 0.3));
    }
    25% {
      filter: drop-shadow(46px -36px 24px rgba(0, 246, 255, 0.6)) drop-shadow(-55px 40px 24px rgba(0, 204, 255, 0.4));
    }
    50% {
      filter: drop-shadow(46px 36px 30px rgba(0, 246, 255, 0.5)) drop-shadow(-55px 40px 30px rgba(0, 204, 255, 0.3));
    }
    75% {
      filter: drop-shadow(20px -18px 25px rgba(0, 246, 255, 0.6)) drop-shadow(-20px 20px 25px rgba(0, 204, 255, 0.4));
    }
    to {
      filter: drop-shadow(46px 36px 28px rgba(0, 246, 255, 0.4)) drop-shadow(-55px -40px 28px rgba(0, 246, 255, 0.3));
    }
  }
`;

export function CyberCard({
  title = 'TITLE',
  footer = 'Some extra Information',
  children,
  className = '',
  socialLinks = {},
}: CyberCardProps) {
  const handleSocialClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <StyledWrapper className={className}>
      <section className="container">
        <div className="card-container">
          <div className="card-content">
            <div className="card-title">
              <span className="title">{title}</span>
            </div>
            <div className="card-body">
              {children || (
                <>
                  <div className="svg-card" onClick={() => handleSocialClick(socialLinks.facebook)}>
                    <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" className="face">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </div>
                  <div className="svg-card" onClick={() => handleSocialClick(socialLinks.twitter)}>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="twit">
                      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                    </svg>
                  </div>
                  <div className="svg-card" onClick={() => handleSocialClick(socialLinks.instagram)}>
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="insta">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </div>
                  <div className="svg-card" onClick={() => handleSocialClick(socialLinks.whatsapp)}>
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="whats">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                  </div>
                </>
              )}
            </div>
            <div className="card-footer">
              <span className="title">{footer}</span>
            </div>
          </div>
        </div>
      </section>
    </StyledWrapper>
  );
}
