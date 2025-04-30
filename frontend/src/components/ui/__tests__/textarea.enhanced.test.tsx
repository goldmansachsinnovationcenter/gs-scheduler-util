import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Textarea } from '../textarea';

describe('Textarea Component', () => {
  it('should render textarea correctly', () => {
    const { container } = render(<Textarea />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
  });

  it('should render textarea with custom className', () => {
    const { container } = render(<Textarea className="custom-textarea" />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('custom-textarea');
  });

  it('should handle disabled state', () => {
    const { container } = render(<Textarea disabled />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeDisabled();
  });

  it('should handle placeholder text', () => {
    const { container } = render(<Textarea placeholder="Enter text here" />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('should handle required attribute', () => {
    const { container } = render(<Textarea required />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('required');
  });

  it('should handle readOnly attribute', () => {
    const { container } = render(<Textarea readOnly />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('should handle value attribute', () => {
    const { container } = render(<Textarea value="Test value" />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveValue('Test value');
  });

  it('should handle defaultValue attribute', () => {
    const { container } = render(<Textarea defaultValue="Default value" />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveValue('Default value');
  });

  it('should handle rows attribute', () => {
    const { container } = render(<Textarea rows={10} />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('rows', '10');
  });

  it('should handle cols attribute', () => {
    const { container } = render(<Textarea cols={50} />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('cols', '50');
  });

  it('should handle maxLength attribute', () => {
    const { container } = render(<Textarea maxLength={100} />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  it('should handle minLength attribute', () => {
    const { container } = render(<Textarea minLength={10} />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('minLength', '10');
  });

  it('should handle name attribute', () => {
    const { container } = render(<Textarea name="comment" />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('name', 'comment');
  });

  it('should handle id attribute', () => {
    const { container } = render(<Textarea id="comment-field" />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('id', 'comment-field');
  });

  it('should handle autoFocus attribute', () => {
    const { container } = render(<Textarea autoFocus />);
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('autoFocus');
  });
});
