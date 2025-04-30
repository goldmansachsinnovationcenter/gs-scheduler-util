import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from '../checkbox';

describe('Checkbox Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  });

  it('should apply custom className', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const checkbox = container.querySelector('button');
    
    expect(checkbox).toHaveClass('custom-class');
  });

  it('should handle checked state', () => {
    const { container } = render(<Checkbox checked />);
    const checkbox = container.querySelector('button');
    
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('should handle disabled state', () => {
    const { container } = render(<Checkbox disabled />);
    const checkbox = container.querySelector('button');
    
    expect(checkbox).toHaveAttribute('disabled', '');
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed');
    expect(checkbox).toHaveClass('disabled:opacity-50');
  });

  it('should handle onChange callback', () => {
    const handleChange = jest.fn();
    const { container } = render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = container.querySelector('button');
    
    fireEvent.click(checkbox!);
    expect(handleChange).toHaveBeenCalledWith(true);
    
    fireEvent.click(checkbox!);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('should handle defaultChecked prop', () => {
    const { container } = render(<Checkbox defaultChecked />);
    const checkbox = container.querySelector('button');
    
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('should handle id and name props', () => {
    const { container } = render(<Checkbox id="test-id" name="test-name" />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    
    expect(checkbox).toHaveAttribute('id', 'test-id');
    expect(checkbox).toHaveAttribute('name', 'test-name');
  });

  it('should handle required prop', () => {
    const { container } = render(<Checkbox required />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    
    expect(checkbox).toHaveAttribute('required', '');
  });
});
