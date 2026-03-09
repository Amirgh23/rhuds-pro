import React, { useState } from 'react';
import styled from 'styled-components';

export interface InventoryItem {
  name: string;
  weight: number;
  quantity?: number;
}

export interface PipBoyData {
  // STAT Tab
  hp: { current: number; max: number };
  ap: { current: number; max: number };
  time: string;
  date: string;
  rads: number;
  
  // INV Tab
  inventory: InventoryItem[];
  
  // DATA Tab
  radarStatus: string;
  targets?: number;
}

export interface PipBoyProps {
  className?: string;
  color?: string;
  data?: PipBoyData;
}

const defaultData: PipBoyData = {
  hp: { current: 348, max: 450 },
  ap: { current: 67, max: 67 },
  time: '08:40',
  date: '02.23.2026',
  rads: 0,
  inventory: [
    { name: 'Stimpak', weight: 0.5, quantity: 12 },
    { name: '10mm Pistol', weight: 4.0 },
    { name: 'Nuka-Cola Quantum', weight: 1.0 },
    { name: 'RadAway', weight: 0.5, quantity: 5 },
    { name: 'Power Armor Core', weight: 3.0 },
  ],
  radarStatus: 'SEARCHING SATELLITE...',
  targets: 1,
};

export const PipBoy: React.FC<PipBoyProps> = ({ 
  className,
  color = '#29F2DF',
  data = defaultData,
}) => {
  const [activeTab, setActiveTab] = useState<'stat' | 'inv' | 'data'>('stat');
  const pipData = { ...defaultData, ...data };
  
  return (
    <StyledWrapper $color={color} className={className}>
      <div className="pipboy-chassis">
        <div className="screw tl" />
        <div className="screw tr" />
        <div className="screw bl" />
        <div className="screw br" />
        
        <div className="crt-screen">
          <div className="screen-glass" />
          <div className="scanlines" />
          
          <div className="boot-sequence">
            <header className="top-bar">
              <div className="dynamic-title">
                {activeTab === 'stat' && 'SYS_STATUS'}
                {activeTab === 'inv' && 'INVENTORY'}
                {activeTab === 'data' && 'DATA_LINK'}
              </div>
              <div className="line" />
              <div className="stats-info">
                <span>HP <span className="bold">{pipData.hp.current}/{pipData.hp.max}</span></span>
                <span>AP <span className="bold">{pipData.ap.current}/{pipData.ap.max}</span></span>
                <span className="pulse-icon">⚡</span>
              </div>
            </header>
            
            <main className="middle-section">
              {activeTab === 'stat' && (
                <div className="content-stat">
                  <aside className="side-menu">
                    <div>CND</div>
                    <div>RAD</div>
                    <div>EFF</div>
                    <div className="active-box">CLK</div>
                  </aside>
                  
                  <section className="clock-display">
                    <div className="terminal-block">
                      <div className="time">{pipData.time}</div>
                    </div>
                    <div className="date">{pipData.date}</div>
                  </section>
                  
                  <aside className="right-menu">
                    <div className="hazard-symbol">
                      <div className="hazard-core" />
                    </div>
                    <div className="rad-text">RADS</div>
                  </aside>
                </div>
              )}

              {activeTab === 'inv' && (
                <div className="content-inv">
                  <ul className="inventory-list">
                    {pipData.inventory.map((item, index) => (
                      <li key={index} className={index === 1 ? 'active-line' : ''}>
                        <span className="item-name">
                          {item.name}{item.quantity ? ` (${item.quantity})` : ''}
                        </span>
                        <span className="item-wgt">WGT {item.weight.toFixed(1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'data' && (
                <div className="content-data">
                  <div className="radar-container">
                    <span className="radar-sweep" />
                    {pipData.targets && pipData.targets > 0 && <div className="blip" />}
                  </div>
                  <div className="radar-text">{pipData.radarStatus}</div>
                </div>
              )}
            </main>
            
            <footer className="bottom-bar">
              <button 
                type="button"
                onClick={() => setActiveTab('stat')} 
                className={`nav-item ${activeTab === 'stat' ? 'active' : ''}`}
              >
                STAT
              </button>
              <div className="line" />
              <button 
                type="button"
                onClick={() => setActiveTab('inv')} 
                className={`nav-item ${activeTab === 'inv' ? 'active' : ''}`}
              >
                INV
              </button>
              <div className="line" />
              <button 
                type="button"
                onClick={() => setActiveTab('data')} 
                className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
              >
                DATA
              </button>
              <div className="line" />
              <div className="radio-visualizer">
                <div className="bar bar-1" />
                <div className="bar bar-2" />
                <div className="bar bar-3" />
                <div className="bar bar-4" />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $color: string }>`
  --pip-green: ${props => props.$color};
  --pip-glow: ${props => props.$color}99;
  --bg-dark: rgba(41, 242, 223, 0.05);
  
  width: 100%;
  max-width: 650px;
  font-family: "Courier New", Courier, monospace;
  text-transform: uppercase;
  
  .pipboy-chassis {
    position: relative;
    width: 100%;
    background: linear-gradient(135deg, rgba(41, 242, 223, 0.08), rgba(10, 18, 37, 0.1), rgba(41, 242, 223, 0.08));
    padding: 2.5rem;
    border-radius: 2rem;
    box-shadow: inset 0 0 20px rgba(41, 242, 223, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(41, 242, 223, 0.3);
    backdrop-filter: blur(10px);
  }
  
  .screw {
    position: absolute;
    width: 14px;
    height: 14px;
    background: linear-gradient(45deg, rgba(41, 242, 223, 0.2), rgba(10, 18, 37, 0.2));
    border-radius: 50%;
    border: 1px solid rgba(41, 242, 223, 0.2);
  }
  
  .screw::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 2px;
    background: rgba(41, 242, 223, 0.3);
    transform: translate(-50%, -50%) rotate(45deg);
  }
  
  .tl { top: 15px; left: 15px; }
  .tr { top: 15px; right: 15px; }
  .bl { bottom: 15px; left: 15px; }
  .br { bottom: 15px; right: 15px; }
  
  .crt-screen {
    background-color: rgba(41, 242, 223, 0.05);
    border-radius: 1.5rem;
    position: relative;
    overflow: hidden;
    border: 8px solid rgba(41, 242, 223, 0.15);
    min-height: 450px;
    backdrop-filter: blur(5px);
  }
  
  .screen-glass {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
    background: radial-gradient(circle at 50% 50%, rgba(41, 242, 223, 0.05) 0%, rgba(0, 0, 0, 0.2) 80%);
  }
  
  .scanlines {
    position: absolute;
    inset: 0;
    z-index: 9;
    pointer-events: none;
    background: linear-gradient(rgba(41, 242, 223, 0.02) 50%, rgba(0, 0, 0, 0.1) 50%);
    background-size: 100% 4px;
  }

  .boot-sequence {
    min-height: 450px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    color: var(--pip-green);
    text-shadow: 0 0 4px var(--pip-glow);
  }
  
  .bold { font-weight: 900; }
  
  .line {
    height: 2px;
    background-color: var(--pip-green);
    box-shadow: 0 0 8px var(--pip-glow);
    opacity: 0.8;
    flex-grow: 1;
    margin: 0 10px;
  }
  
  .top-bar, .bottom-bar {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .top-bar { margin-bottom: 1.5rem; }
  .dynamic-title { letter-spacing: 1px; min-width: 120px; }
  .stats-info { display: flex; gap: 12px; }
  .bottom-bar { margin-top: auto; }
  
  .nav-item {
    padding: 4px 10px;
    cursor: pointer;
    border: 1px solid transparent;
    background: none;
    color: var(--pip-green);
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    text-transform: inherit;
  }
  
  .nav-item:hover {
    background-color: rgba(41, 242, 223, 0.15);
  }
  
  .nav-item.active {
    background-color: var(--pip-green);
    color: #0A1225;
    text-shadow: none;
    box-shadow: 0 0 10px var(--pip-glow);
  }
  
  .middle-section {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }
  
  .content-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .side-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 1rem;
  }
  
  .active-box {
    border: 2px solid var(--pip-green);
    padding: 2px 8px;
    box-shadow: inset 0 0 10px var(--pip-glow);
  }
  
  .clock-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .terminal-block {
    background-color: var(--pip-green);
    border-radius: 6px;
    padding: 10px 20px;
    margin-bottom: 5px;
    box-shadow: 0 0 25px var(--pip-glow);
  }
  
  .terminal-block .time {
    color: #0A1225;
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 0 0 2px rgba(41, 242, 223, 0.5);
  }
  
  .date {
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 2px;
  }
  
  .right-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .rad-text {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 2px;
  }
  
  .hazard-symbol {
    width: 50px;
    height: 50px;
    position: relative;
    background: conic-gradient(
      var(--pip-green) 0deg 60deg,
      transparent 60deg 120deg,
      var(--pip-green) 120deg 180deg,
      transparent 180deg 240deg,
      var(--pip-green) 240deg 300deg,
      transparent 300deg 360deg
    );
    border-radius: 50%;
    animation: pipboyRadarSpin 8s linear infinite;
    box-shadow: 0 0 15px var(--pip-glow);
  }
  
  .hazard-core {
    position: absolute;
    inset: 10px;
    background: var(--bg-dark);
    border-radius: 50%;
  }
  
  .hazard-core::after {
    content: "";
    position: absolute;
    inset: 6px;
    background: var(--pip-green);
    border-radius: 50%;
  }
  
  .content-inv {
    width: 100%;
  }
  
  .inventory-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  
  .inventory-list li {
    display: flex;
    justify-content: space-between;
    padding: 6px;
    border-bottom: 1px dashed rgba(41, 242, 223, 0.3);
    cursor: pointer;
  }
  
  .inventory-list li:hover,
  .active-line {
    background-color: var(--pip-green);
    color: #0A1225;
    font-weight: bold;
    text-shadow: none;
    box-shadow: 0 0 10px var(--pip-glow);
    padding: 6px 11px;
  }
  
  .content-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .radar-container {
    position: relative;
    width: 160px;
    height: 160px;
    background: rgba(41, 242, 223, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: inset 0 0 20px var(--pip-glow);
    border: 2px solid var(--pip-green);
  }
  
  .radar-container::before {
    content: "";
    position: absolute;
    inset: 20px;
    background: rgba(41, 242, 223, 0.15);
    border-radius: 50%;
    border: 1px dashed rgba(41, 242, 223, 0.3);
  }
  
  .radar-sweep {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: transparent;
    transform-origin: top left;
    animation: pipboyAngularRotation 2s linear infinite;
    box-shadow: 6px -100px 40px -30px var(--pip-green);
    border-top: 2px solid var(--pip-green);
    z-index: 2;
  }
  
  .blip {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    top: 35px;
    left: 100px;
    box-shadow: 0 0 10px #fff, 0 0 20px var(--pip-green);
    animation: pipboyBlipFade 2s infinite;
    z-index: 3;
  }
  
  .radio-visualizer {
    display: flex;
    gap: 3px;
    align-items: flex-end;
    height: 15px;
    margin-left: 10px;
  }
  
  .bar {
    width: 4px;
    background-color: var(--pip-green);
    animation: pipboyEqBounce 1s infinite alternate;
  }
  
  .bar-1 { animation-delay: 0.1s; }
  .bar-2 { animation-delay: 0.3s; }
  .bar-3 { animation-delay: 0s; }
  .bar-4 { animation-delay: 0.4s; }
  
  @keyframes pipboyAngularRotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pipboyRadarSpin {
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pipboyBlipFade {
    0%, 85% { opacity: 0; }
    90% { opacity: 1; transform: scale(1.5); }
    100% { opacity: 0; }
  }
  
  @keyframes pipboyEqBounce {
    0% { height: 3px; }
    100% { height: 15px; }
  }
`;
