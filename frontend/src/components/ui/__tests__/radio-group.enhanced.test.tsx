import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RadioGroup, RadioGroupItem } from '../radio-group';

jest.mock('@radix-ui/react-radio-group', () => ({
  Root: React.forwardRef(({ children, value, onValueChange, ...props }: any, ref: any) => (
    <div 
      ref={ref}
      data-testid="radio-group-root" 
      data-value={value}
      {...props}
    >
      {children}
    </div>
  )),
  Item: React.forwardRef(({ children, value, ...props }: any, ref: any) => (
    <button 
      ref={ref}
      role="radio"
      data-testid="radio-group-item"
      data-value={value}
      data-state={props['data-state'] || 'unchecked'}
      onClick={() => props.onValueChange && props.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )),
  Indicator: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <span ref={ref} data-testid="radio-group-indicator" {...props}>
      {children}
    </span>
  )),
}));

jest.mock('lucide-react', () => ({
  Circle: () => <div data-testid="circle-icon" />,
}));

describe('RadioGroup Component', () => {
  it('should render RadioGroup correctly', () => {
    const { getByTestId } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toBeInTheDocument();
  });

  it('should render RadioGroup with custom className', () => {
    const { getByTestId } = render(
      <RadioGroup className="custom-radio-group">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveClass('custom-radio-group');
  });

  it('should render RadioGroupItem with custom className', () => {
    const { getAllByTestId } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" className="custom-radio-item" />
      </RadioGroup>
    );
    
    const radioItem = getAllByTestId('radio-group-item')[0];
    expect(radioItem).toHaveClass('custom-radio-item');
  });

  it('should handle defaultValue prop', () => {
    const { getByTestId } = render(
      <RadioGroup defaultValue="option1">
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveAttribute('data-value', 'option1');
  });

  it('should handle value prop', () => {
    const { getByTestId } = render(
      <RadioGroup value="option2">
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveAttribute('data-value', 'option2');
  });

  it('should handle disabled state', () => {
    const { getAllByTestId } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" disabled />
      </RadioGroup>
    );
    
    const radioItem = getAllByTestId('radio-group-item')[0];
    expect(radioItem).toBeDisabled();
  });

  it('should handle required prop', () => {
    const { getByTestId } = render(
      <RadioGroup required>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveAttribute('required', 'true');
  });

  it('should handle name prop', () => {
    const { getByTestId } = render(
      <RadioGroup name="test-radio">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveAttribute('name', 'test-radio');
  });

  it('should handle orientation prop', () => {
    const { getByTestId } = render(
      <RadioGroup orientation="horizontal">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveAttribute('orientation', 'horizontal');
  });

  it('should handle loop prop', () => {
    const { getByTestId } = render(
      <RadioGroup loop={false}>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveAttribute('loop', 'false');
  });

  it('should handle id prop', () => {
    const { getByTestId } = render(
      <RadioGroup id="test-id">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );
    
    const radioGroup = getByTestId('radio-group-root');
    expect(radioGroup).toHaveAttribute('id', 'test-id');
  });
});
