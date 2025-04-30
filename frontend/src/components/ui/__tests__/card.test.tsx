import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  it('should render Card correctly', () => {
    const { container } = render(<Card>Card Content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-card text-card-foreground rounded-xl border shadow-sm');
    expect(card).toHaveTextContent('Card Content');
  });

  it('should apply custom className to Card', () => {
    const { container } = render(<Card className="custom-class">Card Content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    
    expect(card).toHaveClass('custom-class');
  });

  it('should render CardHeader correctly', () => {
    const { container } = render(<CardHeader>Header Content</CardHeader>);
    const header = container.querySelector('[data-slot="card-header"]');
    
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6');
    expect(header).toHaveTextContent('Header Content');
  });

  it('should apply custom className to CardHeader', () => {
    const { container } = render(<CardHeader className="custom-header">Header Content</CardHeader>);
    const header = container.querySelector('[data-slot="card-header"]');
    
    expect(header).toHaveClass('custom-header');
  });

  it('should render CardTitle correctly', () => {
    const { container } = render(<CardTitle>Card Title</CardTitle>);
    const title = container.querySelector('[data-slot="card-title"]');
    
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('leading-none font-semibold');
    expect(title).toHaveTextContent('Card Title');
  });

  it('should apply custom className to CardTitle', () => {
    const { container } = render(<CardTitle className="custom-title">Card Title</CardTitle>);
    const title = container.querySelector('[data-slot="card-title"]');
    
    expect(title).toHaveClass('custom-title');
  });

  it('should render CardDescription correctly', () => {
    const { container } = render(<CardDescription>Card Description</CardDescription>);
    const description = container.querySelector('[data-slot="card-description"]');
    
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-muted-foreground text-sm');
    expect(description).toHaveTextContent('Card Description');
  });

  it('should apply custom className to CardDescription', () => {
    const { container } = render(<CardDescription className="custom-desc">Card Description</CardDescription>);
    const description = container.querySelector('[data-slot="card-description"]');
    
    expect(description).toHaveClass('custom-desc');
  });

  it('should render CardContent correctly', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.querySelector('[data-slot="card-content"]');
    
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('px-6');
    expect(content).toHaveTextContent('Content');
  });

  it('should apply custom className to CardContent', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>);
    const content = container.querySelector('[data-slot="card-content"]');
    
    expect(content).toHaveClass('custom-content');
  });

  it('should render CardFooter correctly', () => {
    const { container } = render(<CardFooter>Footer Content</CardFooter>);
    const footer = container.querySelector('[data-slot="card-footer"]');
    
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex items-center px-6 pt-0');
    expect(footer).toHaveTextContent('Footer Content');
  });

  it('should apply custom className to CardFooter', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer Content</CardFooter>);
    const footer = container.querySelector('[data-slot="card-footer"]');
    
    expect(footer).toHaveClass('custom-footer');
  });

  it('should render a complete card with all components', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card with all components</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    );
    
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
    
    expect(container).toHaveTextContent('Complete Card');
    expect(container).toHaveTextContent('This is a complete card with all components');
    expect(container).toHaveTextContent('Card content goes here');
    expect(container).toHaveTextContent('Action Button');
  });
});
