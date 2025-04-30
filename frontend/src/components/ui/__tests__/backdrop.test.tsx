import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Backdrop, LoadingBackdrop } from '../backdrop';

describe('Backdrop Component', () => {
  it('should not render when isOpen is false', () => {
    const { queryByText } = render(<Backdrop isOpen={false}>Test Content</Backdrop>);
    expect(queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    const { getByText } = render(<Backdrop isOpen={true}>Test Content</Backdrop>);
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className when provided', () => {
    const { container } = render(
      <Backdrop isOpen={true} className="custom-class">
        Test Content
      </Backdrop>
    );
    const backdrop = container.firstChild as HTMLElement;
    expect(backdrop).toHaveClass('custom-class');
  });

  it('should have the correct default classes', () => {
    const { container } = render(<Backdrop isOpen={true}>Test Content</Backdrop>);
    const backdrop = container.firstChild as HTMLElement;
    expect(backdrop).toHaveClass('fixed');
    expect(backdrop).toHaveClass('inset-0');
    expect(backdrop).toHaveClass('bg-background/80');
    expect(backdrop).toHaveClass('backdrop-blur-sm');
    expect(backdrop).toHaveClass('z-50');
    expect(backdrop).toHaveClass('flex');
    expect(backdrop).toHaveClass('items-center');
    expect(backdrop).toHaveClass('justify-center');
  });
});

describe('LoadingBackdrop Component', () => {
  it('should not render when isOpen is false', () => {
    const { queryByText } = render(<LoadingBackdrop isOpen={false} />);
    expect(queryByText('Processing...')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    const { getByText } = render(<LoadingBackdrop isOpen={true} />);
    expect(getByText('Processing...')).toBeInTheDocument();
  });

  it('should render a spinner and text', () => {
    const { getByText, container } = render(<LoadingBackdrop isOpen={true} />);
    expect(getByText('Processing...')).toBeInTheDocument();
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
