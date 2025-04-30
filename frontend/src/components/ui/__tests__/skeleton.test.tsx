import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Skeleton } from '../skeleton';

describe('Skeleton Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild;
    
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse rounded-md bg-muted');
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.firstChild;
    
    expect(skeleton).toHaveClass('custom-class');
    expect(skeleton).toHaveClass('animate-pulse rounded-md bg-muted');
  });

  it('should render with custom dimensions', () => {
    const { container } = render(
      <Skeleton className="h-12 w-12" />
    );
    const skeleton = container.firstChild;
    
    expect(skeleton).toHaveClass('h-12');
    expect(skeleton).toHaveClass('w-12');
  });

  it('should render multiple skeletons in a group', () => {
    const { container } = render(
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
    
    const skeletons = container.querySelectorAll('div[class*="animate-pulse"]');
    expect(skeletons.length).toBe(3);
    
    expect(skeletons[0]).toHaveClass('h-4 w-full');
    expect(skeletons[1]).toHaveClass('h-4 w-3/4');
    expect(skeletons[2]).toHaveClass('h-4 w-1/2');
  });

  it('should render skeleton with different shapes', () => {
    const { container: circleContainer } = render(
      <Skeleton className="h-12 w-12 rounded-full" />
    );
    
    const { container: rectangleContainer } = render(
      <Skeleton className="h-8 w-32 rounded-sm" />
    );
    
    const circle = circleContainer.firstChild;
    const rectangle = rectangleContainer.firstChild;
    
    expect(circle).toHaveClass('rounded-full');
    expect(rectangle).toHaveClass('rounded-sm');
  });
});
