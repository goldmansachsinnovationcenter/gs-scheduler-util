import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from '../label';

describe('Label Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Label>Test Label</Label>);
    const label = container.querySelector('label');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label).toHaveClass('text-sm font-medium leading-none');
    expect(label).toHaveTextContent('Test Label');
  });

  it('should apply custom className', () => {
    const { container } = render(<Label className="custom-class">Test Label</Label>);
    const label = container.querySelector('label');
    
    expect(label).toHaveClass('custom-class');
  });

  it('should pass additional props to the label element', () => {
    const { container } = render(
      <Label 
        data-testid="test-label" 
        id="label-id" 
        htmlFor="input-id"
      >
        Test Label
      </Label>
    );
    const label = container.querySelector('label');
    
    expect(label).toHaveAttribute('id', 'label-id');
    expect(label).toHaveAttribute('data-testid', 'test-label');
    expect(label).toHaveAttribute('for', 'input-id');
  });

  it('should handle disabled state', () => {
    const { container } = render(<Label className="disabled:cursor-not-allowed disabled:opacity-70">Test Label</Label>);
    const label = container.querySelector('label');
    
    expect(label).toHaveClass('disabled:cursor-not-allowed');
    expect(label).toHaveClass('disabled:opacity-70');
  });

  it('should render with children', () => {
    const { container } = render(
      <Label>
        <span>Child Element</span>
      </Label>
    );
    const label = container.querySelector('label');
    const span = container.querySelector('span');
    
    expect(label).toBeInTheDocument();
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('Child Element');
  });
});
