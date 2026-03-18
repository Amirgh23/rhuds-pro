import React from 'react';
import GlitchLoginFormAnimated from './GlitchLoginFormAnimated';

export const GlitchLoginFormAnimatedDemo = () => {
  const handleSubmit = (data: { username: string; password: string }) => {
    console.log('Form submitted:', data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
      {/* Dark Mode - Default */}
      <div>
        <h3>Dark Mode (Default)</h3>
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px' }}>
          <GlitchLoginFormAnimated
            onSubmit={handleSubmit}
            usernamePlaceholder="User"
            passwordPlaceholder="Password"
            buttonText="Log in"
            primaryColor="#4090b5"
            secondaryColor="#9e30a9"
            accentColor="#7afbff"
            backgroundColor="#212121"
            textColor="#fff"
            borderColor="#4090b5"
          />
        </div>
      </div>

      {/* Neon Green */}
      <div>
        <h3>Neon Green Theme</h3>
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px' }}>
          <GlitchLoginFormAnimated
            onSubmit={handleSubmit}
            usernamePlaceholder="User"
            passwordPlaceholder="Password"
            buttonText="Log in"
            primaryColor="#29F2DF"
            secondaryColor="#1C7FA6"
            accentColor="#29F2DF"
            backgroundColor="#0A1225"
            textColor="#e0e0e0"
            borderColor="#29F2DF"
          />
        </div>
      </div>

      {/* Neon Blue */}
      <div>
        <h3>Neon Blue Theme</h3>
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px' }}>
          <GlitchLoginFormAnimated
            onSubmit={handleSubmit}
            usernamePlaceholder="User"
            passwordPlaceholder="Password"
            buttonText="Log in"
            primaryColor="#1C7FA6"
            secondaryColor="#28125A"
            accentColor="#29F2DF"
            backgroundColor="#0A1225"
            textColor="#e0e0e0"
            borderColor="#1C7FA6"
          />
        </div>
      </div>

      {/* Neon Red/Purple */}
      <div>
        <h3>Neon Red/Purple Theme</h3>
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px' }}>
          <GlitchLoginFormAnimated
            onSubmit={handleSubmit}
            usernamePlaceholder="User"
            passwordPlaceholder="Password"
            buttonText="Log in"
            primaryColor="#EF3EF1"
            secondaryColor="#29F2DF"
            accentColor="#EF3EF1"
            backgroundColor="#0A1225"
            textColor="#e0e0e0"
            borderColor="#EF3EF1"
          />
        </div>
      </div>
    </div>
  );
};

export default GlitchLoginFormAnimatedDemo;
