import React, { useEffect, useRef, useState } from 'react';
import { FeatureCard, FeatureCardProps } from './FeatureCard';
import '../styles/FeatureCardsGrid.css';

export interface FeatureCardsGridProps {
  cards: FeatureCardProps[];
  onCardClick?: (index: number) => void;
  startDelay?: number;
  staggerInterval?: number;
}

export const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({
  cards,
  onCardClick,
  startDelay = 1700,
  staggerInterval = 150,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(cards.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setVisibleCards((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const cardElements = containerRef.current?.querySelectorAll('[data-index]');
    cardElements?.forEach((el) => observer.observe(el));

    return () => {
      cardElements?.forEach((el) => observer.unobserve(el));
    };
  }, [cards.length]);

  return (
    <div className="feature-cards-grid" ref={containerRef}>
      {cards.map((card, index) => (
        <div
          key={`${card.title}-${index}`}
          className="feature-cards-grid__item"
          data-index={index}
          style={{
            animationDelay: `${startDelay + index * staggerInterval}ms`,
            opacity: visibleCards[index] ? 1 : 0,
          }}
        >
          <FeatureCard
            {...card}
            animationDelay={index * staggerInterval}
            onClick={() => onCardClick?.(index)}
          />
        </div>
      ))}
    </div>
  );
};

FeatureCardsGrid.displayName = 'FeatureCardsGrid';
