import React, { useState } from 'react';
import styled from 'styled-components';

export const PipBoySimple: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stat');
  
  return (
    <Wrapper>
      <div className="chassis">
        <div className="screen">
          <div className="content">
            <div className="header">
              <div className="title">
                {activeTab === 'stat' && 'SYS_STATUS'}
                {activeTab === 'inv' && 'INVENTORY'}
                {activeTab === 'data' && 'DATA_LINK'}
              </div>
              <div>HP 348/450</div>
            </div>
            
            <div className="main">
              {activeTab === 'stat' && (
                <div className="tab-stat">
                  <div className="clock">08:40</div>
                  <div>02.23.2026</div>
                </div>
              )}
              
              {activeTab === 'inv' && (
                <div className="tab-inv">
                  <div>Stimpak (12)</div>
                  <div>10mm Pistol</div>
                  <div>Nuka-Cola</div>
                </div>
              )}
              
              {activeTab === 'data' && (
                <div className="tab-data">
                  <div>RADAR DATA</div>
                </div>
              )}
            </div>
            
            <div className="footer">
              <button onClick={() => setActiveTab('stat')} className={activeTab === 'stat' ? 'active' : ''}>
                STAT
              </button>
              <button onClick={() => setActiveTab('inv')} className={activeTab === 'inv' ? 'active' : ''}>
                INV
              </button>
              <button onClick={() => setActiveTab('data')} className={activeTab === 'data' ? 'active' : ''}>
                DATA
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --green: #1aff40;
  --dark: #020a02;
  
  .chassis {
    background: #222;
    padding: 2rem;
    border-radius: 1rem;
    border: 2px solid #444;
  }
  
  .screen {
    background: var(--dark);
    border: 8px solid #0a0a0a;
    border-radius: 1rem;
    min-height: 400px;
  }
  
  .content {
    padding: 1.5rem;
    color: var(--green);
    display: flex;
    flex-direction: column;
    min-height: 400px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    font-weight: bold;
  }
  
  .title {
    font-size: 1.2rem;
  }
  
  .main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 250px;
  }
  
  .tab-stat, .tab-inv, .tab-data {
    text-align: center;
  }
  
  .clock {
    font-size: 4rem;
    font-weight: bold;
    background: var(--green);
    color: var(--dark);
    padding: 10px 20px;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  
  .tab-inv div, .tab-data div {
    margin: 10px 0;
    font-size: 1.2rem;
  }
  
  .footer {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }
  
  button {
    background: none;
    border: 1px solid var(--green);
    color: var(--green);
    padding: 8px 16px;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    text-transform: uppercase;
  }
  
  button.active {
    background: var(--green);
    color: var(--dark);
  }
  
  button:hover {
    opacity: 0.8;
  }
`;
