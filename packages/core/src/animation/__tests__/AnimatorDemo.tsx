/**
 * Animator Demo Component
 * Demonstrates the Animator system functionality
 */

import React, { useState } from 'react';
import { Animator } from '../Animator';
import { Stagger } from '../managers/Stagger';
import { Sequence } from '../managers/Sequence';
import { Switch } from '../managers/Switch';
import { AnimatorControl } from '../types';

/**
 * Basic Animator Demo
 */
export const BasicAnimatorDemo: React.FC = () => {
  const [activate, setActivate] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Basic Animator Demo</h2>
      <button onClick={() => setActivate(!activate)}>
        {activate ? 'Deactivate' : 'Activate'}
      </button>

      <Animator
        activate={activate}
        duration={{ enter: 500, exit: 300 }}
        onAnimateEntering={() => console.log('Entering...')}
        onAnimateEntered={() => console.log('Entered!')}
        onAnimateExiting={() => console.log('Exiting...')}
        onAnimateExited={() => console.log('Exited!')}
      >
        {(control: AnimatorControl) => (
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              background: '#00f6ff',
              color: '#000',
              opacity: control.flow.entered ? 1 : 0,
              transform: control.flow.entered
                ? 'translateY(0)'
                : 'translateY(-20px)',
              transition: `all ${control.duration.enter}ms ease-out`,
            }}
          >
            <p>State: {control.flow.value}</p>
            <p>Transitioning: {control.flow.transitioning ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Animator>
    </div>
  );
};

/**
 * Stagger Demo
 */
export const StaggerDemo: React.FC = () => {
  const [activate, setActivate] = useState(false);
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Stagger Demo</h2>
      <button onClick={() => setActivate(!activate)}>
        {activate ? 'Deactivate' : 'Activate'}
      </button>

      <Stagger stagger={100} direction="forward">
        {items.map((item, index) => (
          <Animator key={index} activate={activate} duration={{ enter: 400 }}>
            {(control: AnimatorControl) => (
              <div
                style={{
                  marginTop: '10px',
                  padding: '15px',
                  background: '#00f6ff',
                  color: '#000',
                  opacity: control.flow.entered ? 1 : 0,
                  transform: control.flow.entered
                    ? 'translateX(0)'
                    : 'translateX(-50px)',
                  transition: `all ${control.duration.enter}ms ease-out`,
                }}
              >
                {item} (Delay: {control.duration.delay}ms)
              </div>
            )}
          </Animator>
        ))}
      </Stagger>
    </div>
  );
};

/**
 * Sequence Demo
 */
export const SequenceDemo: React.FC = () => {
  const [start, setStart] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sequence Demo</h2>
      <button onClick={() => setStart(!start)}>
        {start ? 'Reset' : 'Start Sequence'}
      </button>

      {start && (
        <Sequence onComplete={() => console.log('Sequence complete!')}>
          <Animator duration={{ enter: 300 }}>
            {(control: AnimatorControl) => (
              <div
                style={{
                  marginTop: '10px',
                  padding: '15px',
                  background: '#ff6b6b',
                  color: '#fff',
                  opacity: control.flow.entered ? 1 : 0,
                }}
              >
                Step 1: {control.flow.value}
              </div>
            )}
          </Animator>
          <Animator duration={{ enter: 300 }}>
            {(control: AnimatorControl) => (
              <div
                style={{
                  marginTop: '10px',
                  padding: '15px',
                  background: '#4ecdc4',
                  color: '#fff',
                  opacity: control.flow.entered ? 1 : 0,
                }}
              >
                Step 2: {control.flow.value}
              </div>
            )}
          </Animator>
          <Animator duration={{ enter: 300 }}>
            {(control: AnimatorControl) => (
              <div
                style={{
                  marginTop: '10px',
                  padding: '15px',
                  background: '#95e1d3',
                  color: '#000',
                  opacity: control.flow.entered ? 1 : 0,
                }}
              >
                Step 3: {control.flow.value}
              </div>
            )}
          </Animator>
        </Sequence>
      )}
    </div>
  );
};

/**
 * Switch Demo
 */
export const SwitchDemo: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Switch Demo</h2>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>

      <Switch condition={isLoggedIn}>
        <Animator duration={{ enter: 400, exit: 300 }}>
          {(control: AnimatorControl) => (
            <div
              style={{
                marginTop: '20px',
                padding: '20px',
                background: '#ff6b6b',
                color: '#fff',
                opacity: control.flow.entered ? 1 : 0,
                transform: control.flow.entered
                  ? 'scale(1)'
                  : 'scale(0.8)',
                transition: `all ${control.duration.enter}ms ease-out`,
              }}
            >
              <h3>Login Form</h3>
              <p>State: {control.flow.value}</p>
            </div>
          )}
        </Animator>
        <Animator duration={{ enter: 400, exit: 300 }}>
          {(control: AnimatorControl) => (
            <div
              style={{
                marginTop: '20px',
                padding: '20px',
                background: '#4ecdc4',
                color: '#fff',
                opacity: control.flow.entered ? 1 : 0,
                transform: control.flow.entered
                  ? 'scale(1)'
                  : 'scale(0.8)',
                transition: `all ${control.duration.enter}ms ease-out`,
              }}
            >
              <h3>Dashboard</h3>
              <p>State: {control.flow.value}</p>
            </div>
          )}
        </Animator>
      </Switch>
    </div>
  );
};

/**
 * Nested Animator Demo
 */
export const NestedAnimatorDemo: React.FC = () => {
  const [activate, setActivate] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Nested Animator Demo</h2>
      <button onClick={() => setActivate(!activate)}>
        {activate ? 'Deactivate' : 'Activate'}
      </button>

      <Animator activate={activate} duration={{ enter: 500, exit: 300 }}>
        {(parentControl: AnimatorControl) => (
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              background: '#00f6ff',
              color: '#000',
              opacity: parentControl.flow.entered ? 1 : 0,
              transition: `all ${parentControl.duration.enter}ms ease-out`,
            }}
          >
            <p>Parent State: {parentControl.flow.value}</p>

            {/* Child animator - will only activate when parent is entered */}
            <Animator activate={true} duration={{ enter: 400 }}>
              {(childControl: AnimatorControl) => (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '15px',
                    background: '#fff',
                    color: '#000',
                    opacity: childControl.flow.entered ? 1 : 0,
                    transform: childControl.flow.entered
                      ? 'translateX(0)'
                      : 'translateX(-20px)',
                    transition: `all ${childControl.duration.enter}ms ease-out`,
                  }}
                >
                  <p>Child State: {childControl.flow.value}</p>
                  <p>
                    Child only animates when parent is entered or entering
                  </p>
                </div>
              )}
            </Animator>
          </div>
        )}
      </Animator>
    </div>
  );
};

/**
 * All Demos
 */
export const AnimatorDemos: React.FC = () => {
  return (
    <div>
      <h1>Animator System Demos</h1>
      <BasicAnimatorDemo />
      <hr />
      <StaggerDemo />
      <hr />
      <SequenceDemo />
      <hr />
      <SwitchDemo />
      <hr />
      <NestedAnimatorDemo />
    </div>
  );
};
