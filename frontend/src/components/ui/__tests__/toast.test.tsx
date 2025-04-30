import React from 'react';
import { render } from '@testing-library/react';
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

describe('Toast Components', () => {
  it('should render Toast correctly', () => {
    const { getByTestId, getByText } = render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>This is a toast notification</ToastDescription>
          <ToastAction altText="Try again">Try again</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    const provider = getByTestId('toast-provider');
    const root = getByTestId('toast-root');
    const title = getByTestId('toast-title');
    const description = getByTestId('toast-description');
    const action = getByTestId('toast-action');
    const close = getByTestId('toast-close');
    const viewport = getByTestId('toast-viewport');
    
    expect(provider).toBeInTheDocument();
    expect(root).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(action).toBeInTheDocument();
    expect(close).toBeInTheDocument();
    expect(viewport).toBeInTheDocument();
    
    expect(title).toHaveTextContent('Notification');
    expect(description).toHaveTextContent('This is a toast notification');
    expect(action).toHaveTextContent('Try again');
  });

  it('should apply custom className to Toast', () => {
    const { getByTestId } = render(
      <Toast className="custom-toast">
        <ToastTitle>Notification</ToastTitle>
      </Toast>
    );
    
    const root = getByTestId('toast-root');
    expect(root).toHaveClass('custom-toast');
  });

  it('should apply custom className to ToastAction', () => {
    const { getByTestId } = render(
      <ToastAction className="custom-action" altText="Try again">
        Try again
      </ToastAction>
    );
    
    const action = getByTestId('toast-action');
    expect(action).toHaveClass('custom-action');
  });

  it('should apply custom className to ToastClose', () => {
    const { getByTestId } = render(
      <ToastClose className="custom-close" />
    );
    
    const close = getByTestId('toast-close');
    expect(close).toHaveClass('custom-close');
  });

  it('should apply custom className to ToastTitle', () => {
    const { getByTestId } = render(
      <ToastTitle className="custom-title">Notification</ToastTitle>
    );
    
    const title = getByTestId('toast-title');
    expect(title).toHaveClass('custom-title');
  });

  it('should apply custom className to ToastDescription', () => {
    const { getByTestId } = render(
      <ToastDescription className="custom-description">
        This is a toast notification
      </ToastDescription>
    );
    
    const description = getByTestId('toast-description');
    expect(description).toHaveClass('custom-description');
  });

  it('should apply custom className to ToastViewport', () => {
    const { getByTestId } = render(
      <ToastViewport className="custom-viewport" />
    );
    
    const viewport = getByTestId('toast-viewport');
    expect(viewport).toHaveClass('custom-viewport');
  });

  it('should handle ToastProvider props', () => {
    const { getByTestId } = render(
      <ToastProvider swipeDirection="right" duration={5000}>
        <Toast>
          <ToastTitle>Notification</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    const provider = getByTestId('toast-provider');
    expect(provider).toHaveAttribute('swipeDirection', 'right');
    expect(provider).toHaveAttribute('duration', '5000');
  });

  it('should handle Toast variant prop', () => {
    const { getByTestId } = render(
      <Toast variant="destructive">
        <ToastTitle>Error</ToastTitle>
      </Toast>
    );
    
    const root = getByTestId('toast-root');
    expect(root).toHaveAttribute('variant', 'destructive');
  });
});
