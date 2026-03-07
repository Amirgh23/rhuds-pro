/**
 * Feedback Components Demo
 * Demonstrates Modal, Dialog, and Notification components
 */

import React, { useState } from 'react';
import { Modal, Dialog, Notification, NotificationProvider, useNotification } from '../index';
import { Text, Button } from '../index';

const FeedbackDemoContent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const { success, error, warning, info } = useNotification();

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0A1225', minHeight: '100vh', color: '#fff' }}>
      <Text variant="h1" style={{ marginBottom: '2rem' }}>
        Feedback Components Demo
      </Text>

      {/* Modal Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Modal Component
        </Text>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Welcome to Modal"
          closeText="Close"
          showClose={true}
          animationDuration={300}
        >
          <Text>
            This is a modal dialog. It displays content in a centered overlay with animations.
            Click the close button or the overlay to dismiss it.
          </Text>
        </Modal>
      </section>

      {/* Dialog Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Dialog Component
        </Text>
        <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
        <Dialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Confirm Action"
          showClose={true}
          animationDuration={300}
          actions={[
            {
              label: 'Cancel',
              onClick: () => setDialogOpen(false),
              variant: 'secondary',
            },
            {
              label: 'Confirm',
              onClick: () => {
                success('Action confirmed!');
                setDialogOpen(false);
              },
              variant: 'primary',
            },
            {
              label: 'Delete',
              onClick: () => {
                error('Item deleted!');
                setDialogOpen(false);
              },
              variant: 'danger',
            },
          ]}
        >
          <Text>
            Are you sure you want to perform this action? This action cannot be undone.
          </Text>
        </Dialog>
      </section>

      {/* Notification Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Notification Component
        </Text>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            onClick={() => {
              setNotificationType('success');
              setNotificationVisible(true);
            }}
          >
            Success
          </Button>
          <Button
            onClick={() => {
              setNotificationType('error');
              setNotificationVisible(true);
            }}
          >
            Error
          </Button>
          <Button
            onClick={() => {
              setNotificationType('warning');
              setNotificationVisible(true);
            }}
          >
            Warning
          </Button>
          <Button
            onClick={() => {
              setNotificationType('info');
              setNotificationVisible(true);
            }}
          >
            Info
          </Button>
        </div>
        {notificationVisible && (
          <Notification
            message={`This is a ${notificationType} notification!`}
            type={notificationType}
            duration={3000}
            onClose={() => setNotificationVisible(false)}
            showClose={true}
            animationDuration={300}
          />
        )}
      </section>

      {/* Notification Hook Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Notification Hook
        </Text>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => success('Success message!')}>
            Show Success
          </Button>
          <Button onClick={() => error('Error message!')}>
            Show Error
          </Button>
          <Button onClick={() => warning('Warning message!')}>
            Show Warning
          </Button>
          <Button onClick={() => info('Info message!')}>
            Show Info
          </Button>
        </div>
      </section>

      {/* Features */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Features
        </Text>
        <div style={{ backgroundColor: '#0A1225', borderRadius: '4px', padding: '1rem' }}>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Modal with smooth animations</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Dialog with action buttons</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Notification with auto-dismiss</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Multiple notification types</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ useNotification hook for easy access</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Theme integration</Text>
          <Text>✓ Customizable animations and durations</Text>
        </div>
      </section>
    </div>
  );
};

export const FeedbackDemo: React.FC = () => {
  return (
    <NotificationProvider>
      <FeedbackDemoContent />
    </NotificationProvider>
  );
};

FeedbackDemo.displayName = 'FeedbackDemo';
