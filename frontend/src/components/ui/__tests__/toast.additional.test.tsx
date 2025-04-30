import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../toast';

jest.mock('@radix-ui/react-toast', () => ({
  Provider: ({ children, ...props }: any) => (
    <div data-testid="toast-provider" {...props}>
      {children}
    </div>
  ),
  Root: ({ children, ...props }: any) => (
    <div data-testid="toast-root" {...props}>
      {children}
    </div>
  ),
  Action: ({ children, ...props }: any) => (
    <button data-testid="toast-action" {...props}>
      {children}
    </button>
  ),
  Close: ({ children, ...props }: any) => (
    <button data-testid="toast-close" {...props}>
      {children || 'X'}
    </button>
  ),
  Title: ({ children, ...props }: any) => (
    <div data-testid="toast-title" {...props}>
      {children}
    </div>
  ),
  Description: ({ children, ...props }: any) => (
    <div data-testid="toast-description" {...props}>
      {children}
    </div>
  ),
  Viewport: ({ ...props }: any) => (
    <div data-testid="toast-viewport" {...props} />
  ),
}));

describe('Toast Components Additional Tests', () => {
  it('should render Toast with destructive variant', () => {
    const { getByTestId } = render(
      <Toast variant="destructive">
        <ToastTitle>Error</ToastTitle>
        <ToastDescription>Something went wrong</ToastDescription>
      </Toast>
    );
    
    const root = getByTestId('toast-root');
    expect(root).toHaveAttribute('variant', 'destructive');
  });

  it('should render ToastProvider with custom swipeDirection', () => {
    const { getByTestId } = render(
      <ToastProvider swipeDirection="right">
        <Toast>
          <ToastTitle>Notification</ToastTitle>
        </Toast>
      </ToastProvider>
    );
    
    const provider = getByTestId('toast-provider');
    expect(provider).toHaveAttribute('swipeDirection', 'right');
  });

  it('should render ToastViewport with custom position', () => {
    const { getByTestId } = render(
      <ToastViewport className="top-0 right-0" />
    );
    
    const viewport = getByTestId('toast-viewport');
    expect(viewport).toHaveClass('top-0 right-0');
  });

  it('should render ToastAction with altText', () => {
    const { getByTestId } = render(
      <ToastAction altText="Retry">Retry</ToastAction>
    );
    
    const action = getByTestId('toast-action');
    expect(action).toHaveAttribute('altText', 'Retry');
  });

  it('should render ToastClose with aria-label', () => {
    const { getByTestId } = render(
      <ToastClose aria-label="Close notification" />
    );
    
    const close = getByTestId('toast-close');
    expect(close).toHaveAttribute('aria-label', 'Close notification');
  });

  it('should render complete Toast with all components', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>Operation completed successfully</ToastDescription>
          <ToastAction altText="View">View</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
    expect(screen.getByTestId('toast-root')).toBeInTheDocument();
    expect(screen.getByTestId('toast-title')).toBeInTheDocument();
    expect(screen.getByTestId('toast-description')).toBeInTheDocument();
    expect(screen.getByTestId('toast-action')).toBeInTheDocument();
    expect(screen.getByTestId('toast-close')).toBeInTheDocument();
    expect(screen.getByTestId('toast-viewport')).toBeInTheDocument();
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });
});
