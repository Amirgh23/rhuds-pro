import React from 'react';
import { AddFriendInput } from './AddFriendInput';

export const AddFriendInputDemo = () => {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h2>Default AddFriendInput</h2>
        <AddFriendInput />
      </div>

      <div>
        <h2>Custom Colors - Cyan Theme</h2>
        <AddFriendInput
          primaryColor="rgb(0, 255, 255)"
          backgroundColor="rgb(10, 20, 30)"
          title="Add Teammate"
        />
      </div>

      <div>
        <h2>Custom Colors - Green Theme</h2>
        <AddFriendInput
          primaryColor="rgb(0, 255, 100)"
          backgroundColor="rgb(20, 30, 20)"
          title="Add Member"
          buttonLabel="Verify"
        />
      </div>

      <div>
        <h2>Custom Colors - Red Theme</h2>
        <AddFriendInput
          primaryColor="rgb(255, 50, 50)"
          backgroundColor="rgb(40, 20, 20)"
          title="Add Contact"
          buttonLabel="Confirm"
        />
      </div>

      <div>
        <h2>With Handlers</h2>
        <AddFriendInput
          title="Enter Code"
          placeholder="123456"
          minLength={6}
          maxLength={6}
          onChange={(value) => console.log('Input changed:', value)}
          onCheck={(value) => console.log('Checked:', value)}
        />
      </div>

      <div>
        <h2>Custom Sizes & Labels</h2>
        <AddFriendInput
          title="Friend Code"
          placeholder="ABCDEF"
          buttonLabel="Add Friend"
          primaryColor="rgb(255, 200, 0)"
          backgroundColor="rgb(30, 25, 35)"
        />
      </div>
    </div>
  );
};

export default AddFriendInputDemo;
