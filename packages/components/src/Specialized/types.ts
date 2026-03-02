export interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  marks?: { value: number; label: string }[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  className?: string;
}

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
  presets?: string[];
  showAlpha?: boolean;
  className?: string;
}

export interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  showProgress?: boolean;
  className?: string;
}
