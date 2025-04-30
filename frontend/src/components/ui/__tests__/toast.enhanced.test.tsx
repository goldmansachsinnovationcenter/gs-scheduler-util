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
  Root: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="toast-root" {...props}>
      {children}
    </div>
  )),
  Title: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="toast-title" {...props}>
      {children}
    </div>
  )),
  Description: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="toast-description" {...props}>
      {children}
    </div>
  )),
  Action: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <button ref={ref} data-testid="toast-action" {...props}>
      {children}
    </button>
  )),
  Close: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <button ref={ref} data-testid="toast-close" {...props}>
      {children}
    </button>
  )),
  Viewport: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="toast-viewport" {...props}>
      {children}
    </div>
  )),
}));

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
}));

describe('Toast Components', () => {
  it('should render Toast correctly', () => {
    const { getByTestId } = render(
      <Toast>
        <ToastTitle>Toast Title</ToastTitle>
        <ToastDescription>Toast Description</ToastDescription>
      </Toast>
    );
    
    const toast = getByTestId('toast-root');
    expect(toast).toBeInTheDocument();
  });

  it('should render Toast with custom className', () => {
    const { getByTestId } = render(
      <Toast className="custom-toast">
        Toast Content
      </Toast>
    );
    
    const toast = getByTestId('toast-root');
    expect(toast).toHaveClass('custom-toast');
    expect(toast).toHaveTextContent('Toast Content');
  });

  it('should render ToastProvider correctly', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <div>Provider Content</div>
      </ToastProvider>
    );
    
    const provider = getByTestId('toast-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveTextContent('Provider Content');
  });

  it('should render ToastTitle with custom className', () => {
    const { getByTestId } = render(
      <ToastTitle className="custom-title">
        Toast Title
      </ToastTitle>
    );
    
    const title = getByTestId('toast-title');
    expect(title).toHaveClass('custom-title');
    expect(title).toHaveTextContent('Toast Title');
  });

  it('should render ToastDescription with custom className', () => {
    const { getByTestId } = render(
      <ToastDescription className="custom-description">
        Toast Description
      </ToastDescription>
    );
    
    const description = getByTestId('toast-description');
    expect(description).toHaveClass('custom-description');
    expect(description).toHaveTextContent('Toast Description');
  });

  it('should render ToastAction with custom className', () => {
    const { getByTestId } = render(
      <ToastAction className="custom-action" altText="Action">
        Action Button
      </ToastAction>
    );
    
    const action = getByTestId('toast-action');
    expect(action).toHaveClass('custom-action');
    expect(action).toHaveTextContent('Action Button');
    expect(action).toHaveAttribute('aria-label', 'Action');
  });

  it('should render ToastClose with custom className', () => {
    const { getByTestId } = render(
      <ToastClose className="custom-close" />
    );
    
    const close = getByTestId('toast-close');
    expect(close).toHaveClass('custom-close');
  });

  it('should render ToastViewport with custom className', () => {
    const { getByTestId } = render(
      <ToastViewport className="custom-viewport" />
    );
    
    const viewport = getByTestId('toast-viewport');
    expect(viewport).toHaveClass('custom-viewport');
  });

  it('should handle variant prop', () => {
    const { getByTestId } = render(
      <Toast variant="destructive">
        Destructive Toast
      </Toast>
    );
    
    const toast = getByTestId('toast-root');
    expect(toast).toHaveAttribute('data-variant', 'destructive');
  });

  it('should handle complete toast with all components', () => {
    const { getByTestId, getByText } = render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>Your task has been completed.</ToastDescription>
          <ToastAction altText="Undo">Undo</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    expect(getByTestId('toast-provider')).toBeInTheDocument();
    expect(getByTestId('toast-root')).toBeInTheDocument();
    expect(getByTestId('toast-title')).toBeInTheDocument();
    expect(getByTestId('toast-description')).toBeInTheDocument();
    expect(getByTestId('toast-action')).toBeInTheDocument();
    expect(getByTestId('toast-close')).toBeInTheDocument();
    expect(getByTestId('toast-viewport')).toBeInTheDocument();
    
    expect(getByText('Notification')).toBeInTheDocument();
    expect(getByText('Your task has been completed.')).toBeInTheDocument();
    expect(getByText('Undo')).toBeInTheDocument();
  });
});
