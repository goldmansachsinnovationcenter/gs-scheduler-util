import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, buttonVariants } from '../button';

describe('Button Component', () => {
  it('should render correctly with default variant and size', () => {
    const { getByText } = render(<Button>Test Button</Button>);
    const button = getByText('Test Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  it('should apply secondary variant classes', () => {
    const { getByText } = render(<Button variant="secondary">Secondary Button</Button>);
    const button = getByText('Secondary Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  it('should apply destructive variant classes', () => {
    const { getByText } = render(<Button variant="destructive">Destructive Button</Button>);
    const button = getByText('Destructive Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  it('should apply outline variant classes', () => {
    const { getByText } = render(<Button variant="outline">Outline Button</Button>);
    const button = getByText('Outline Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-background');
    expect(button).toHaveClass('border');
  });

  it('should apply ghost variant classes', () => {
    const { getByText } = render(<Button variant="ghost">Ghost Button</Button>);
    const button = getByText('Ghost Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('should apply link variant classes', () => {
    const { getByText } = render(<Button variant="link">Link Button</Button>);
    const button = getByText('Link Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('hover:underline');
  });

  it('should apply small size classes', () => {
    const { getByText } = render(<Button size="sm">Small Button</Button>);
    const button = getByText('Small Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('rounded-md');
  });

  it('should apply large size classes', () => {
    const { getByText } = render(<Button size="lg">Large Button</Button>);
    const button = getByText('Large Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-6');
  });

  it('should apply icon size classes', () => {
    const { getByText } = render(<Button size="icon">Icon</Button>);
    const button = getByText('Icon');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('size-9');
  });

  it('should apply custom className', () => {
    const { getByText } = render(<Button className="custom-class">Custom Button</Button>);
    const button = getByText('Custom Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('custom-class');
  });

  it('should pass additional props to the button element', () => {
    const { getByTestId } = render(
      <Button data-testid="test-button" id="button-id">
        Test Button
      </Button>
    );
    
    const button = getByTestId('test-button');
    expect(button).toHaveAttribute('id', 'button-id');
  });

  it('should render as a different element when asChild is true', () => {
    const { container } = render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    );
    
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link).toHaveClass('bg-primary');
  });
});
