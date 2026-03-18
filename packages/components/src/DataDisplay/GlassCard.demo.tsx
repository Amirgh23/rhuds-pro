import React from 'react';
import { GlassCard } from './GlassCard';

export const GlassCardDemo: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem' }}>
      <div>
        <h3>Default Glass Card</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
          }}
        >
          <GlassCard
            title="Title"
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            primaryButtonText="Yes"
            secondaryButtonText="No"
          />
        </div>
      </div>

      <div>
        <h3>Glass Card with Multiple Paragraphs</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
          }}
        >
          <GlassCard
            title="Information"
            body={[
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
              'It has survived not only five centuries, but also the leap into electronic typesetting.',
            ]}
            primaryButtonText="Accept"
            secondaryButtonText="Decline"
          />
        </div>
      </div>

      <div>
        <h3>Glass Card with Custom Colors</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
          }}
        >
          <GlassCard
            title="Confirm"
            body="Are you sure you want to proceed?"
            primaryButtonText="Confirm"
            secondaryButtonText="Cancel"
            primaryColor="#00D9FF"
            secondaryColor="#FF00FF"
            onPrimaryClick={() => alert('Confirmed!')}
            onSecondaryClick={() => alert('Cancelled!')}
          />
        </div>
      </div>

      <div>
        <h3>Multiple Cards</h3>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
            flexWrap: 'wrap',
          }}
        >
          <GlassCard
            title="Card 1"
            body="First card content"
            primaryButtonText="OK"
            secondaryButtonText="Cancel"
          />
          <GlassCard
            title="Card 2"
            body="Second card content"
            primaryButtonText="Yes"
            secondaryButtonText="No"
            primaryColor="#00D9FF"
            secondaryColor="#00FF88"
          />
          <GlassCard
            title="Card 3"
            body="Third card content"
            primaryButtonText="Accept"
            secondaryButtonText="Reject"
            primaryColor="#FF006E"
            secondaryColor="#FF00FF"
          />
        </div>
      </div>

      <div>
        <h3>Large Glass Card</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
          }}
        >
          <GlassCard
            title="Large Card"
            body={[
              'This is a larger card with more content.',
              'It demonstrates the flexibility of the component.',
              'You can customize colors, size, and button text.',
            ]}
            primaryButtonText="Proceed"
            secondaryButtonText="Go Back"
            width="300px"
            height="350px"
          />
        </div>
      </div>
    </div>
  );
};

export default GlassCardDemo;
