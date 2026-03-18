import React, { useState } from 'react';
import CyberLoginForm from './CyberLoginForm';

export default function CyberLoginFormDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [colorScheme, setColorScheme] = useState<'default' | 'blue' | 'purple' | 'green'>(
    'default'
  );

  const colorSchemes = {
    default: {
      primaryColor: '#4090b5',
      secondaryColor: '#9e30a9',
      accentColor: '#7afbff',
      backgroundColor: '#212121',
      textColor: '#fff',
      borderColor: '#4090b5',
    },
    blue: {
      primaryColor: '#1C7FA6',
      secondaryColor: '#28125A',
      accentColor: '#29F2DF',
      backgroundColor: '#0A1225',
      textColor: '#e0e0e0',
      borderColor: '#1C7FA6',
    },
    purple: {
      primaryColor: '#EF3EF1',
      secondaryColor: '#29F2DF',
      accentColor: '#1C7FA6',
      backgroundColor: '#0A1225',
      textColor: '#e0e0e0',
      borderColor: '#EF3EF1',
    },
    green: {
      primaryColor: '#29F2DF',
      secondaryColor: '#1C7FA6',
      accentColor: '#EF3EF1',
      backgroundColor: '#0A1225',
      textColor: '#e0e0e0',
      borderColor: '#29F2DF',
    },
  };

  const handleSubmit = (data: { username: string; password: string }) => {
    setFormData(data);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>CyberLoginForm Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#fff', marginRight: '10px' }}>Color Scheme:</label>
        <select
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value as any)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            border: '1px solid #4090b5',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <option value="default">Default (Blue/Purple)</option>
          <option value="blue">Blue Theme</option>
          <option value="purple">Purple Theme</option>
          <option value="green">Green Theme</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px', maxWidth: '600px' }}>
        <CyberLoginForm
          onSubmit={handleSubmit}
          usernamePlaceholder="Enter username"
          passwordPlaceholder="Enter password"
          buttonText="Sign In"
          {...colorSchemes[colorScheme]}
        />
      </div>

      {submitted && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#1a3a1a',
            border: '1px solid #29F2DF',
            borderRadius: '4px',
            color: '#29F2DF',
            marginTop: '20px',
          }}
        >
          <p>✓ Form submitted successfully!</p>
          <p>Username: {formData.username}</p>
          <p>Password: {'*'.repeat(formData.password.length)}</p>
        </div>
      )}

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #4090b5',
          borderRadius: '4px',
          color: '#fff',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Props Available:</h2>
        <ul>
          <li>
            <strong>onSubmit</strong>: (data: {'{username, password}'}) =&gt; void
          </li>
          <li>
            <strong>usernamePlaceholder</strong>: string (default: 'User')
          </li>
          <li>
            <strong>passwordPlaceholder</strong>: string (default: 'Password')
          </li>
          <li>
            <strong>buttonText</strong>: string (default: 'Log in')
          </li>
          <li>
            <strong>primaryColor</strong>: string (default: '#4090b5')
          </li>
          <li>
            <strong>secondaryColor</strong>: string (default: '#9e30a9')
          </li>
          <li>
            <strong>accentColor</strong>: string (default: '#7afbff')
          </li>
          <li>
            <strong>backgroundColor</strong>: string (default: '#212121')
          </li>
          <li>
            <strong>textColor</strong>: string (default: '#fff')
          </li>
          <li>
            <strong>borderColor</strong>: string (default: '#4090b5')
          </li>
          <li>
            <strong>className</strong>: string (optional)
          </li>
        </ul>
      </div>
    </div>
  );
}
