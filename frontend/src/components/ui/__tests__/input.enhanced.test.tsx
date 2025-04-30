import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../input';

describe('Input Component', () => {
  it('should render input correctly', () => {
    const { container } = render(<Input />);
    
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should render input with custom className', () => {
    const { container } = render(<Input className="custom-input" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-input');
  });

  it('should handle disabled state', () => {
    const { container } = render(<Input disabled />);
    
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });

  it('should handle placeholder text', () => {
    const { container } = render(<Input placeholder="Enter text here" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('should handle required attribute', () => {
    const { container } = render(<Input required />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('required');
  });

  it('should handle readOnly attribute', () => {
    const { container } = render(<Input readOnly />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('readOnly');
  });

  it('should handle value attribute', () => {
    const { container } = render(<Input value="Test value" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveValue('Test value');
  });

  it('should handle defaultValue attribute', () => {
    const { container } = render(<Input defaultValue="Default value" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveValue('Default value');
  });

  it('should handle type attribute', () => {
    const { container } = render(<Input type="password" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should handle maxLength attribute', () => {
    const { container } = render(<Input maxLength={100} />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('maxLength', '100');
  });

  it('should handle minLength attribute', () => {
    const { container } = render(<Input minLength={10} />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('minLength', '10');
  });

  it('should handle name attribute', () => {
    const { container } = render(<Input name="username" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('should handle id attribute', () => {
    const { container } = render(<Input id="username-field" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('id', 'username-field');
  });

  it('should handle autoFocus attribute', () => {
    const { container } = render(<Input autoFocus />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('autoFocus');
  });

  it('should handle pattern attribute', () => {
    const { container } = render(<Input pattern="[A-Za-z]+" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
  });

  it('should handle min attribute', () => {
    const { container } = render(<Input type="number" min={0} />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('min', '0');
  });

  it('should handle max attribute', () => {
    const { container } = render(<Input type="number" max={100} />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should handle step attribute', () => {
    const { container } = render(<Input type="number" step={5} />);
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('step', '5');
  });
});
