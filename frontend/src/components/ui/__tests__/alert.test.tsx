import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert Components', () => {
  describe('Alert', () => {
    it('should render correctly with default variant', () => {
      const { container } = render(<Alert>Test Alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('role', 'alert');
      expect(alert).toHaveAttribute('data-slot', 'alert');
      expect(alert).toHaveClass('bg-card');
      expect(alert).toHaveClass('text-card-foreground');
      expect(alert).toHaveTextContent('Test Alert');
    });

    it('should render correctly with destructive variant', () => {
      const { container } = render(<Alert variant="destructive">Destructive Alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('text-destructive');
      expect(alert).toHaveClass('bg-card');
    });

    it('should apply custom className', () => {
      const { container } = render(<Alert className="custom-class">Custom Alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      
      expect(alert).toHaveClass('custom-class');
    });

    it('should pass additional props to the div element', () => {
      const { container } = render(
        <Alert data-testid="test-alert" id="alert-id">
          Test Alert
        </Alert>
      );
      const alert = container.firstChild as HTMLElement;
      
      expect(alert).toHaveAttribute('id', 'alert-id');
      expect(alert).toHaveAttribute('data-testid', 'test-alert');
    });
  });

  describe('AlertTitle', () => {
    it('should render correctly', () => {
      const { container } = render(<AlertTitle>Alert Title</AlertTitle>);
      const title = container.firstChild as HTMLElement;
      
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'alert-title');
      expect(title).toHaveClass('col-start-2');
      expect(title).toHaveClass('line-clamp-1');
      expect(title).toHaveClass('min-h-4');
      expect(title).toHaveClass('font-medium');
      expect(title).toHaveClass('tracking-tight');
      expect(title).toHaveTextContent('Alert Title');
    });

    it('should apply custom className', () => {
      const { container } = render(<AlertTitle className="custom-class">Alert Title</AlertTitle>);
      const title = container.firstChild as HTMLElement;
      
      expect(title).toHaveClass('custom-class');
    });

    it('should pass additional props to the div element', () => {
      const { container } = render(
        <AlertTitle data-testid="test-title" id="title-id">
          Alert Title
        </AlertTitle>
      );
      const title = container.firstChild as HTMLElement;
      
      expect(title).toHaveAttribute('id', 'title-id');
      expect(title).toHaveAttribute('data-testid', 'test-title');
    });
  });

  describe('AlertDescription', () => {
    it('should render correctly', () => {
      const { container } = render(<AlertDescription>Alert Description</AlertDescription>);
      const description = container.firstChild as HTMLElement;
      
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'alert-description');
      expect(description).toHaveClass('text-muted-foreground');
      expect(description).toHaveClass('col-start-2');
      expect(description).toHaveClass('grid');
      expect(description).toHaveClass('justify-items-start');
      expect(description).toHaveClass('gap-1');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveTextContent('Alert Description');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <AlertDescription className="custom-class">Alert Description</AlertDescription>
      );
      const description = container.firstChild as HTMLElement;
      
      expect(description).toHaveClass('custom-class');
    });

    it('should pass additional props to the div element', () => {
      const { container } = render(
        <AlertDescription data-testid="test-description" id="description-id">
          Alert Description
        </AlertDescription>
      );
      const description = container.firstChild as HTMLElement;
      
      expect(description).toHaveAttribute('id', 'description-id');
      expect(description).toHaveAttribute('data-testid', 'test-description');
    });
  });

  describe('Alert with Title and Description', () => {
    it('should render correctly with title and description', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert Description</AlertDescription>
        </Alert>
      );
      
      const alert = container.firstChild as HTMLElement;
      const title = alert.querySelector('[data-slot="alert-title"]');
      const description = alert.querySelector('[data-slot="alert-description"]');
      
      expect(alert).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(title).toHaveTextContent('Alert Title');
      expect(description).toHaveTextContent('Alert Description');
    });
  });
});
