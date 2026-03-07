/**
 * Advanced Components Demo
 * Demonstrates Carousel, Accordion, and Stepper components
 */

import React, { useState } from 'react';
import { Carousel, Accordion, Stepper } from '../index';
import { Text, Button } from '../index';

export const AdvancedDemo: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expandedItems, setExpandedItems] = useState<string[]>(['item1']);
  const [currentStep, setCurrentStep] = useState(0);

  const carouselItems = [
    {
      key: 'slide1',
      title: 'Slide 1',
      content: (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#EF3EF1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: '2rem' }}>Slide 1</Text>
        </div>
      ),
    },
    {
      key: 'slide2',
      title: 'Slide 2',
      content: (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#1C7FA6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: '2rem' }}>Slide 2</Text>
        </div>
      ),
    },
    {
      key: 'slide3',
      title: 'Slide 3',
      content: (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#29F2DF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: '2rem' }}>Slide 3</Text>
        </div>
      ),
    },
  ];

  const accordionItems = [
    {
      key: 'item1',
      title: 'What is RHUDS?',
      icon: '❓',
      content: 'RHUDS Pro is a comprehensive design system with 100+ components, advanced animations, and theme support.',
    },
    {
      key: 'item2',
      title: 'How to use components?',
      icon: '📚',
      content: 'Import components from @rhuds/components and use them in your React application with full TypeScript support.',
    },
    {
      key: 'item3',
      title: 'Can I customize themes?',
      icon: '🎨',
      content: 'Yes! RHUDS provides a comprehensive theme system with runtime switching and persistence support.',
    },
  ];

  const steps = [
    { key: 'step1', label: 'Setup', description: 'Install and configure' },
    { key: 'step2', label: 'Design', description: 'Create your design' },
    { key: 'step3', label: 'Develop', description: 'Build components' },
    { key: 'step4', label: 'Deploy', description: 'Launch to production' },
  ];

  const stepContent = [
    'Install RHUDS Pro and configure your project.',
    'Design your application using RHUDS components.',
    'Develop your features with full TypeScript support.',
    'Deploy your application to production.',
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0A1225', minHeight: '100vh', color: '#fff' }}>
      <Text variant="h1" style={{ marginBottom: '2rem' }}>
        Advanced Components Demo
      </Text>

      {/* Carousel Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Carousel Component
        </Text>
        <Carousel
          items={carouselItems}
          currentIndex={carouselIndex}
          onIndexChange={setCarouselIndex}
          autoPlayInterval={5000}
          showDots={true}
          showArrows={true}
          animationDuration={500}
          style={{ maxWidth: '600px' }}
        />
        <div style={{ marginTop: '1rem' }}>
          <Text>Current Slide: {carouselIndex + 1} / {carouselItems.length}</Text>
        </div>
      </section>

      {/* Accordion Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Accordion Component
        </Text>
        <Accordion
          items={accordionItems}
          expandedItems={expandedItems}
          onExpand={(key) => setExpandedItems([...expandedItems, key])}
          onCollapse={(key) => setExpandedItems(expandedItems.filter((k) => k !== key))}
          allowMultiple={true}
          animationDuration={300}
          style={{ maxWidth: '600px' }}
        />
      </section>

      {/* Stepper Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Stepper Component
        </Text>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          orientation="horizontal"
          showContent={true}
          stepContent={stepContent}
          animationDuration={300}
          style={{ maxWidth: '800px' }}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <Button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </section>

      {/* Vertical Stepper Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Stepper Component (Vertical)
        </Text>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          orientation="vertical"
          showContent={false}
          animationDuration={300}
          style={{ maxWidth: '400px' }}
        />
      </section>

      {/* Features */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Features
        </Text>
        <div style={{ backgroundColor: '#0A1225', borderRadius: '4px', padding: '1rem' }}>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Carousel with auto-play</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Accordion with multiple items</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Stepper with horizontal/vertical</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Smooth animations</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Theme integration</Text>
          <Text>✓ Full TypeScript support</Text>
        </div>
      </section>
    </div>
  );
};

AdvancedDemo.displayName = 'AdvancedDemo';
