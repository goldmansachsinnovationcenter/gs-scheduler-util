import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Progress } from '../progress';

describe('Progress Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Progress value={50} />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toBeInTheDocument();
    expect(progressContainer).toHaveAttribute('aria-valuenow', '50');
  });

  it('should apply custom className', () => {
    const { container } = render(<Progress value={50} className="custom-class" />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toHaveClass('custom-class');
  });

  it('should render with 0 value', () => {
    const { container } = render(<Progress value={0} />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toHaveAttribute('aria-valuenow', '0');
    
    const progressIndicator = container.querySelector('[data-state="progress-indicator"]');
    expect(progressIndicator).toHaveStyle('transform: translateX(-100%)');
  });

  it('should render with 100 value', () => {
    const { container } = render(<Progress value={100} />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toHaveAttribute('aria-valuenow', '100');
    
    const progressIndicator = container.querySelector('[data-state="progress-indicator"]');
    expect(progressIndicator).toHaveStyle('transform: translateX(0%)');
  });

  it('should render with intermediate value', () => {
    const { container } = render(<Progress value={37} />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toHaveAttribute('aria-valuenow', '37');
    
    const progressIndicator = container.querySelector('[data-state="progress-indicator"]');
    expect(progressIndicator).toHaveStyle('transform: translateX(-63%)');
  });

  it('should handle undefined value', () => {
    const { container } = render(<Progress />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toHaveAttribute('aria-valuenow', '0');
  });

  it('should handle negative value', () => {
    const { container } = render(<Progress value={-10} />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toHaveAttribute('aria-valuenow', '0');
  });

  it('should handle value greater than 100', () => {
    const { container } = render(<Progress value={120} />);
    
    const progressContainer = container.querySelector('[role="progressbar"]');
    expect(progressContainer).toHaveAttribute('aria-valuenow', '100');
  });
});
