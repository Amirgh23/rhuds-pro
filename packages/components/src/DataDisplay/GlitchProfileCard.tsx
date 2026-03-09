/**
 * GlitchProfileCard Component
 * GitHub-style profile card with glitch effects
 */

import React from 'react';
import styled from 'styled-components';

export interface GlitchProfileCardProps {
  username?: string;
  title?: string;
  repositories?: number;
  followers?: string;
  githubUrl?: string;
  className?: string;
}

const StyledWrapper = styled.div`
  /* --- Root Variables & Wrapper --- */
  .glitch-profile-wrapper {
    --bg-color: #0d0d0d;
    --primary-color: #00f2ea;
    --secondary-color: #a855f7;
    --text-color: #e5e5e5;
    --font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
    --glitch-anim-duration: 0.4s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: var(--font-family);
    padding: 1rem;
  }

  /* --- Card Structure --- */
  .glitch-card {
    position: relative;
    background-color: rgba(41, 242, 223, 0.08);
    backdrop-filter: blur(10px);
    width: 19rem;
    border-radius: 1rem;
    border: 1px solid rgba(41, 242, 223, 0.3);
    box-shadow:
      0 0 1.5rem rgba(41, 242, 223, 0.2),
      inset 0 0 1rem rgba(41, 242, 223, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .card-header-visual {
    height: 3.5rem;
    background: linear-gradient(
        45deg,
        rgba(41, 242, 223, 0.15),
        rgba(41, 242, 223, 0.05)
      ),
      radial-gradient(circle, rgba(239, 62, 241, 0.08) 0%, transparent 70%);
    border-bottom: 1px solid rgba(41, 242, 223, 0.2);
  }

  /* --- Avatar --- */
  .profile-avatar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0.75rem;
    z-index: 2;
    width: 5.5rem;
    height: 5.5rem;
    background: rgba(10, 18, 37, 0.7);
    border-radius: 50%;
    padding: 0.9rem;
    box-shadow: 0 0 1.5rem rgba(41, 242, 223, 0.2);
    border: 1px solid rgba(41, 242, 223, 0.3);
    transition: background-color 0.5s ease-in-out;
  }

  .octocat-svg {
    width: 100%;
    height: 100%;
    fill: var(--primary-color);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 0 10px rgba(0, 242, 234, 0.3));
  }

  .profile-avatar:hover {
    background-color: var(--primary-color);
  }

  .profile-avatar:hover .octocat-svg {
    fill: var(--bg-color);
    transform: scale(1.1) rotate(-5deg);
  }

  /* --- Card Body --- */
  .card-body {
    padding: 1.1rem;
    padding-top: 0;
    background-color: rgba(41, 242, 223, 0.08);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .profile-body {
    align-items: center;
    text-align: center;
    padding-top: 2.75rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .profile-info {
    margin-bottom: 1.1rem;
  }

  .profile-name {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
    position: relative;
    cursor: pointer;
  }

  .profile-title {
    font-size: 0.75rem;
    color: var(--primary-color);
    opacity: 0.8;
    margin: 0.25rem 0 0 0;
    letter-spacing: 0.1em;
  }

  /* --- GitHub Stats --- */
  .profile-stats {
    width: 100%;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 242, 234, 0.2);
    display: flex;
    justify-content: space-around;
  }

  .stat-item {
    text-align: center;
    cursor: pointer;
  }

  .stat-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--text-color);
    opacity: 0.6;
    letter-spacing: 0.1em;
  }

  .stat-value {
    display: block;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-top: 0.25rem;
    position: relative;
  }

  /* --- Button --- */
  .submit-btn {
    display: block;
    width: 100%;
    margin-top: 1.1rem;
    padding: 0.7em 1em;
    background-color: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
    overflow: hidden;
    text-align: center;
    text-decoration: none;
  }

  .submit-btn:hover,
  .submit-btn:focus {
    background-color: var(--primary-color);
    color: var(--bg-color);
    box-shadow: 0 0 1.5rem var(--primary-color);
    outline: none;
  }

  .submit-btn:active {
    transform: scale(0.97);
  }

  .submit-btn .btn-text {
    position: relative;
    z-index: 1;
    transition: opacity 0.2s ease;
  }

  /* --- Glitch Effects --- */
  .profile-name:hover::before,
  .profile-name:hover::after,
  .stat-value:hover::before,
  .stat-value:hover::after,
  .submit-btn:hover::before,
  .submit-btn:hover::after,
  .submit-btn:focus::before,
  .submit-btn:focus::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-name:hover,
  .stat-item:hover .stat-value {
    color: transparent;
  }

  .submit-btn:hover .btn-text {
    opacity: 0;
  }

  .profile-name:hover::before,
  .stat-value:hover::before,
  .submit-btn:hover::before,
  .submit-btn:focus::before {
    opacity: 1;
    color: var(--secondary-color);
    animation: glitchProfileCardAnim var(--glitch-anim-duration)
      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .profile-name:hover::after,
  .stat-value:hover::after {
    background-color: var(--bg-color);
    color: var(--primary-color);
    animation: glitchProfileCardAnim var(--glitch-anim-duration)
      cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
  }

  .submit-btn:hover::after,
  .submit-btn:focus::after {
    color: var(--bg-color);
    animation: glitchProfileCardAnim var(--glitch-anim-duration)
      cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
  }

  @keyframes glitchProfileCardAnim {
    0% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
    20% {
      transform: translate(-0.3rem, 0.15rem);
      clip-path: inset(50% 0 20% 0);
    }
    40% {
      transform: translate(0.15rem, -0.1rem);
      clip-path: inset(20% 0 60% 0);
    }
    60% {
      transform: translate(-0.25rem, 0.1rem);
      clip-path: inset(80% 0 5% 0);
    }
    80% {
      transform: translate(0.25rem, -0.15rem);
      clip-path: inset(30% 0 45% 0);
    }
    100% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
  }
`;

export function GlitchProfileCard({
  username = 'octo_cat',
  title = 'UI DEVELOPER',
  repositories = 128,
  followers = '42k',
  githubUrl = '#',
  className = '',
}: GlitchProfileCardProps) {
  return (
    <StyledWrapper className={className}>
      <div className="glitch-profile-wrapper">
        <div className="glitch-card profile-card">
          <div className="card-header-visual" />
          <div className="profile-avatar">
            <svg
              className="octocat-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </div>
          <div className="card-body profile-body">
            <div className="profile-info">
              <div className="profile-name" data-text={username}>
                {username}
              </div>
              <p className="profile-title">{title}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">REPOSITORIES</span>
                <span className="stat-value" data-text={repositories}>
                  {repositories}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">FOLLOWERS</span>
                <span className="stat-value" data-text={followers}>
                  {followers}
                </span>
              </div>
            </div>
            <a href={githubUrl} className="submit-btn" data-text="VIEW_ON_GITHUB">
              <span className="btn-text">VIEW_ON_GITHUB</span>
            </a>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

export default GlitchProfileCard;
