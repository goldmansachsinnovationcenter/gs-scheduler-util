import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from '../checkbox';

jest.mock('@radix-ui/react-checkbox', () => ({
  Root: React.forwardRef(({ children, checked, onCheckedChange, ...props }: any, ref: any) => (
    <button 
      ref={ref}
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      data-testid="checkbox-root"
      {...props}
    >
      {children}
    </button>
  )),
  Indicator: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <span ref={ref} data-testid="checkbox-indicator" {...props}>
      {children}
    </span>
  )),
}));

jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
}));

describe('Checkbox Component', () => {
  it('should render checkbox correctly', () => {
    const { getByTestId } = render(<Checkbox />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('should render checkbox with custom className', () => {
    const { getByTestId } = render(<Checkbox className="custom-checkbox" />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toHaveClass('custom-checkbox');
  });

  it('should handle checked state', () => {
    const { getByTestId } = render(<Checkbox checked />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('should handle unchecked state', () => {
    const { getByTestId } = render(<Checkbox checked={false} />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('should handle disabled state', () => {
    const { getByTestId } = render(<Checkbox disabled />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toBeDisabled();
  });

  it('should handle onChange event', () => {
    const handleChange = jest.fn();
    
    const { getByTestId } = render(<Checkbox onCheckedChange={handleChange} />);
    
    const checkbox = getByTestId('checkbox-root');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should handle defaultChecked prop', () => {
    const { getByTestId } = render(<Checkbox defaultChecked />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('defaultChecked', 'true');
  });

  it('should handle required prop', () => {
    const { getByTestId } = render(<Checkbox required />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('required', 'true');
  });

  it('should handle name prop', () => {
    const { getByTestId } = render(<Checkbox name="test-checkbox" />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('name', 'test-checkbox');
  });

  it('should handle value prop', () => {
    const { getByTestId } = render(<Checkbox value="test-value" />);
    
    const checkbox = getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('value', 'test-value');
  });

  it('should toggle state when clicked', () => {
    const handleChange = jest.fn();
    
    const { getByTestId } = render(
      <Checkbox onCheckedChange={handleChange} />
    );
    
    const checkbox = getByTestId('checkbox-root');
    
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
    
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
  });
});
