import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Switch } from '../switch';

jest.mock('@radix-ui/react-switch', () => ({
  Root: React.forwardRef(({ children, checked, onCheckedChange, ...props }: any, ref: any) => (
    <button 
      ref={ref}
      role="switch"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      data-testid="switch-root"
      {...props}
    >
      {children}
    </button>
  )),
  Thumb: React.forwardRef(({ ...props }: any, ref: any) => (
    <span ref={ref} data-testid="switch-thumb" {...props} />
  )),
}));

describe('Switch Component', () => {
  it('should render switch correctly', () => {
    const { getByTestId } = render(<Switch />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toBeInTheDocument();
    expect(switchRoot).toHaveAttribute('data-state', 'unchecked');
  });

  it('should render switch with custom className', () => {
    const { getByTestId } = render(<Switch className="custom-switch" />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toHaveClass('custom-switch');
  });

  it('should handle checked state', () => {
    const { getByTestId } = render(<Switch checked />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('data-state', 'checked');
    expect(switchRoot).toHaveAttribute('aria-checked', 'true');
  });

  it('should handle unchecked state', () => {
    const { getByTestId } = render(<Switch checked={false} />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('data-state', 'unchecked');
    expect(switchRoot).toHaveAttribute('aria-checked', 'false');
  });

  it('should handle disabled state', () => {
    const { getByTestId } = render(<Switch disabled />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toBeDisabled();
  });

  it('should handle onChange event', () => {
    const handleChange = jest.fn();
    
    const { getByTestId } = render(<Switch onCheckedChange={handleChange} />);
    
    const switchRoot = getByTestId('switch-root');
    fireEvent.click(switchRoot);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should handle defaultChecked prop', () => {
    const { getByTestId } = render(<Switch defaultChecked />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('defaultChecked', 'true');
  });

  it('should handle required prop', () => {
    const { getByTestId } = render(<Switch required />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('required', 'true');
  });

  it('should handle name prop', () => {
    const { getByTestId } = render(<Switch name="test-switch" />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('name', 'test-switch');
  });

  it('should handle value prop', () => {
    const { getByTestId } = render(<Switch value="test-value" />);
    
    const switchRoot = getByTestId('switch-root');
    expect(switchRoot).toHaveAttribute('value', 'test-value');
  });

  it('should toggle state when clicked', () => {
    const handleChange = jest.fn();
    
    const { getByTestId } = render(
      <Switch onCheckedChange={handleChange} />
    );
    
    const switchRoot = getByTestId('switch-root');
    
    expect(switchRoot).toHaveAttribute('data-state', 'unchecked');
    
    fireEvent.click(switchRoot);
    expect(handleChange).toHaveBeenCalledWith(true);
    
    fireEvent.click(switchRoot);
    expect(handleChange).toHaveBeenCalledWith(false);
  });
});
