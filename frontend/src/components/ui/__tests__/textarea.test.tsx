import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Textarea } from '../textarea';

describe('Textarea Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('textarea');
    
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
    expect(textarea).toHaveClass('flex min-h-20 w-full rounded-md border border-input');
  });

  it('should apply custom className', () => {
    const { container } = render(<Textarea className="custom-class" />);
    const textarea = container.querySelector('textarea');
    
    expect(textarea).toHaveClass('custom-class');
  });

  it('should pass additional props to the textarea element', () => {
    const { container } = render(
      <Textarea 
        data-testid="test-textarea" 
        id="textarea-id" 
        placeholder="Enter text here"
        maxLength={100}
        required
      />
    );
    const textarea = container.querySelector('textarea');
    
    expect(textarea).toHaveAttribute('id', 'textarea-id');
    expect(textarea).toHaveAttribute('data-testid', 'test-textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
    expect(textarea).toHaveAttribute('maxLength', '100');
    expect(textarea).toHaveAttribute('required', '');
  });

  it('should handle disabled state', () => {
    const { container } = render(<Textarea disabled />);
    const textarea = container.querySelector('textarea');
    
    expect(textarea).toHaveAttribute('disabled', '');
    expect(textarea).toHaveClass('disabled:cursor-not-allowed');
    expect(textarea).toHaveClass('disabled:opacity-50');
  });

  it('should handle readonly state', () => {
    const { container } = render(<Textarea readOnly />);
    const textarea = container.querySelector('textarea');
    
    expect(textarea).toHaveAttribute('readOnly', '');
  });

  it('should handle value and defaultValue props', () => {
    const { container: container1 } = render(<Textarea value="Test value" onChange={() => {}} />);
    const textarea1 = container1.querySelector('textarea');
    
    expect(textarea1).toHaveValue('Test value');
    
    const { container: container2 } = render(<Textarea defaultValue="Default value" />);
    const textarea2 = container2.querySelector('textarea');
    
    expect(textarea2).toHaveValue('Default value');
  });
});
