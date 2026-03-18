import React from 'react';
import styled from 'styled-components';

export interface NotificationCardProps {
  title?: string;
  message?: string;
  timestamp?: string;
  onClick?: () => void;
  className?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title = 'Clans of Clash',
  message = 'Xhattmahs is not attacking your base!',
  timestamp = '12 min ago',
  onClick,
  className,
}) => {
  return (
    <StyledWrapper className={className}>
      <div className="card">
        <div className="img" />
        <div className="textBox">
          <div className="textContent">
            <p className="h1">{title}</p>
            <span className="span">{timestamp}</span>
          </div>
          <p className="p">{message}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    max-width: 290px;
    height: 70px;
    background: #353535;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: left;
    backdrop-filter: blur(10px);
    transition: 0.5s ease-in-out;
    cursor: pointer;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .img {
    width: 50px;
    height: 50px;
    margin-left: 10px;
    border-radius: 10px;
    background: linear-gradient(#d7cfcf, #9198e5);
  }

  .card:hover > .img {
    transition: 0.5s ease-in-out;
    background: linear-gradient(#9198e5, #712020);
  }

  .textBox {
    width: calc(100% - 90px);
    margin-left: 10px;
    color: white;
    font-family: 'Poppins', sans-serif;
  }

  .textContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .span {
    font-size: 10px;
  }

  .h1 {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
  }

  .p {
    font-size: 12px;
    font-weight: lighter;
    margin: 0;
  }
`;

export default NotificationCard;
