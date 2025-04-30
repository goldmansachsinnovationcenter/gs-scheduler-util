import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert Components Additional Tests', () => {
  it('should render Alert with custom className', () => {
    const { container } = render(<Alert className="custom-alert">Alert content</Alert>);
    const alert = container.querySelector('[data-slot="alert"]');
    
    expect(alert).toHaveClass('custom-alert');
    expect(alert).toHaveTextContent('Alert content');
  });

  it('should render Alert with variant', () => {
    const { container } = render(<Alert variant="destructive">Alert content</Alert>);
    const alert = container.querySelector('[data-slot="alert"]');
    
    expect(alert).toHaveClass('border-destructive/50 text-destructive dark:border-destructive');
    expect(alert).toHaveTextContent('Alert content');
  });

  it('should render AlertTitle with custom className', () => {
    const { container } = render(<AlertTitle className="custom-title">Alert Title</AlertTitle>);
    const alertTitle = container.querySelector('[data-slot="alert-title"]');
    
    expect(alertTitle).toHaveClass('custom-title');
    expect(alertTitle).toHaveTextContent('Alert Title');
  });

  it('should render AlertDescription with custom className', () => {
    const { container } = render(<AlertDescription className="custom-desc">Alert Description</AlertDescription>);
    const alertDesc = container.querySelector('[data-slot="alert-description"]');
    
    expect(alertDesc).toHaveClass('custom-desc');
    expect(alertDesc).toHaveTextContent('Alert Description');
  });

  it('should render complete Alert with title and description', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>This is an important message for users.</AlertDescription>
      </Alert>
    );
    
    const alert = container.querySelector('[data-slot="alert"]');
    const alertTitle = container.querySelector('[data-slot="alert-title"]');
    const alertDesc = container.querySelector('[data-slot="alert-description"]');
    
    expect(alert).toBeInTheDocument();
    expect(alertTitle).toBeInTheDocument();
    expect(alertDesc).toBeInTheDocument();
    
    expect(alertTitle).toHaveTextContent('Important Notice');
    expect(alertDesc).toHaveTextContent('This is an important message for users.');
  });

  it('should render Alert with different variants', () => {
    const { container: container1 } = render(<Alert variant="default">Default Alert</Alert>);
    const alert1 = container1.querySelector('[data-slot="alert"]');
    expect(alert1).not.toHaveClass('border-destructive/50');
    
    const { container: container2 } = render(<Alert variant="destructive">Destructive Alert</Alert>);
    const alert2 = container2.querySelector('[data-slot="alert"]');
    expect(alert2).toHaveClass('border-destructive/50');
  });

  it('should pass additional props to Alert component', () => {
    const { container } = render(
      <Alert data-testid="test-alert" id="alert-id" role="status">
        Alert content
      </Alert>
    );
    const alert = container.querySelector('[data-slot="alert"]');
    
    expect(alert).toHaveAttribute('data-testid', 'test-alert');
    expect(alert).toHaveAttribute('id', 'alert-id');
    expect(alert).toHaveAttribute('role', 'status');
  });

  it('should pass additional props to AlertTitle component', () => {
    const { container } = render(
      <AlertTitle data-testid="test-title" id="title-id">
        Alert Title
      </AlertTitle>
    );
    const alertTitle = container.querySelector('[data-slot="alert-title"]');
    
    expect(alertTitle).toHaveAttribute('data-testid', 'test-title');
    expect(alertTitle).toHaveAttribute('id', 'title-id');
  });

  it('should pass additional props to AlertDescription component', () => {
    const { container } = render(
      <AlertDescription data-testid="test-desc" id="desc-id">
        Alert Description
      </AlertDescription>
    );
    const alertDesc = container.querySelector('[data-slot="alert-description"]');
    
    expect(alertDesc).toHaveAttribute('data-testid', 'test-desc');
    expect(alertDesc).toHaveAttribute('id', 'desc-id');
  });
});
