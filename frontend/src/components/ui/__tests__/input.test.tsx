import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../input';

describe('Input Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input).toHaveClass('flex h-9 w-full rounded-md border border-input');
  });

  it('should apply custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('input');
    
    expect(input).toHaveClass('custom-class');
  });

  it('should pass additional props to the input element', () => {
    const { container } = render(
      <Input 
        data-testid="test-input" 
        id="input-id" 
        placeholder="Enter text here"
        maxLength={100}
        required
      />
    );
    const input = container.querySelector('input');
    
    expect(input).toHaveAttribute('id', 'input-id');
    expect(input).toHaveAttribute('data-testid', 'test-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
    expect(input).toHaveAttribute('maxLength', '100');
    expect(input).toHaveAttribute('required', '');
  });

  it('should handle disabled state', () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector('input');
    
    expect(input).toHaveAttribute('disabled', '');
    expect(input).toHaveClass('disabled:cursor-not-allowed');
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('should handle readonly state', () => {
    const { container } = render(<Input readOnly />);
    const input = container.querySelector('input');
    
    expect(input).toHaveAttribute('readOnly', '');
  });

  it('should handle value and defaultValue props', () => {
    const { container: container1 } = render(<Input value="Test value" onChange={() => {}} />);
    const input1 = container1.querySelector('input');
    
    expect(input1).toHaveValue('Test value');
    
    const { container: container2 } = render(<Input defaultValue="Default value" />);
    const input2 = container2.querySelector('input');
    
    expect(input2).toHaveValue('Default value');
  });

  it('should handle different input types', () => {
    const { container: container1 } = render(<Input type="password" />);
    const input1 = container1.querySelector('input');
    expect(input1).toHaveAttribute('type', 'password');
    
    const { container: container2 } = render(<Input type="email" />);
    const input2 = container2.querySelector('input');
    expect(input2).toHaveAttribute('type', 'email');
    
    const { container: container3 } = render(<Input type="number" />);
    const input3 = container3.querySelector('input');
    expect(input3).toHaveAttribute('type', 'number');
  });
});
