/**
 * Advanced Components Types
 */

// ============================================================================
// Carousel Component Types
// ============================================================================

export interface CarouselItem {
  /** Item key/identifier */
  key: string;
  /** Item content */
  content: React.ReactNode;
  /** Item title */
  title?: string;
}

export interface CarouselProps {
  /** Carousel items */
  items: CarouselItem[];
  /** Current item index */
  currentIndex?: number;
  /** On index change */
  onIndexChange?: (index: number) => void;
  /** Auto-play interval (ms) */
  autoPlayInterval?: number;
  /** Show navigation dots */
  showDots?: boolean;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Accordion Component Types
// ============================================================================

export interface AccordionItem {
  /** Item key/identifier */
  key: string;
  /** Item title */
  title: string;
  /** Item content */
  content: React.ReactNode;
  /** Is item disabled */
  disabled?: boolean;
  /** Item icon */
  icon?: string | React.ReactNode;
}

export interface AccordionProps {
  /** Accordion items */
  items: AccordionItem[];
  /** Expanded items */
  expandedItems?: string[];
  /** On item expand */
  onExpand?: (key: string) => void;
  /** On item collapse */
  onCollapse?: (key: string) => void;
  /** Allow multiple items open */
  allowMultiple?: boolean;
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Stepper Component Types
// ============================================================================

export interface StepperStep {
  /** Step key/identifier */
  key: string;
  /** Step label */
  label: string;
  /** Step description */
  description?: string;
  /** Is step completed */
  completed?: boolean;
  /** Is step active */
  active?: boolean;
  /** Is step disabled */
  disabled?: boolean;
  /** Step icon */
  icon?: string | React.ReactNode;
}

export interface StepperProps {
  /** Stepper steps */
  steps: StepperStep[];
  /** Current step index */
  currentStep?: number;
  /** On step change */
  onStepChange?: (index: number) => void;
  /** Stepper orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Show step content */
  showContent?: boolean;
  /** Step content */
  stepContent?: React.ReactNode[];
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';
  theme?: 'light' | 'dark';
  showLineNumbers?: boolean;
  readOnly?: boolean;
  height?: number;
  className?: string;
}

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  className?: string;
}
