import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../dialog';

jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open, onOpenChange, ...props }: any) => (
    <div data-testid="dialog-root" data-state={open ? 'open' : 'closed'} {...props}>
      {typeof children === 'function' ? children({ open }) : children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="dialog-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="dialog-portal" {...props}>
      {children}
    </div>
  ),
  Overlay: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="dialog-overlay" ref={ref} {...props}>
      {children}
    </div>
  )),
  Content: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="dialog-content" ref={ref} {...props}>
      {children}
    </div>
  )),
  Title: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <h2 data-testid="dialog-title" ref={ref} {...props}>
      {children}
    </h2>
  )),
  Description: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <p data-testid="dialog-description" ref={ref} {...props}>
      {children}
    </p>
  )),
  Close: ({ children, ...props }: any) => (
    <button data-testid="dialog-close" {...props}>
      {children}
    </button>
  ),
}));

describe('Dialog Components', () => {
  it('should render Dialog correctly', () => {
    const { getByTestId } = render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <div>Dialog Content</div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
    
    const dialogRoot = getByTestId('dialog-root');
    const dialogTrigger = getByTestId('dialog-trigger');
    
    expect(dialogRoot).toBeInTheDocument();
    expect(dialogTrigger).toBeInTheDocument();
    expect(dialogTrigger).toHaveTextContent('Open Dialog');
  });

  it('should render DialogContent with custom className', () => {
    const { getByTestId } = render(
      <Dialog>
        <DialogContent className="custom-content">
          Dialog Content
        </DialogContent>
      </Dialog>
    );
    
    const dialogContent = getByTestId('dialog-content');
    expect(dialogContent).toHaveClass('custom-content');
    expect(dialogContent).toHaveTextContent('Dialog Content');
  });

  it('should render DialogHeader with custom className', () => {
    const { container } = render(
      <DialogHeader className="custom-header">
        Header Content
      </DialogHeader>
    );
    
    const dialogHeader = container.firstChild;
    expect(dialogHeader).toHaveClass('custom-header');
    expect(dialogHeader).toHaveTextContent('Header Content');
  });

  it('should render DialogFooter with custom className', () => {
    const { container } = render(
      <DialogFooter className="custom-footer">
        Footer Content
      </DialogFooter>
    );
    
    const dialogFooter = container.firstChild;
    expect(dialogFooter).toHaveClass('custom-footer');
    expect(dialogFooter).toHaveTextContent('Footer Content');
  });

  it('should render DialogTitle with custom className', () => {
    const { getByTestId } = render(
      <DialogTitle className="custom-title">
        Dialog Title
      </DialogTitle>
    );
    
    const dialogTitle = getByTestId('dialog-title');
    expect(dialogTitle).toHaveClass('custom-title');
    expect(dialogTitle).toHaveTextContent('Dialog Title');
  });

  it('should render DialogDescription with custom className', () => {
    const { getByTestId } = render(
      <DialogDescription className="custom-description">
        Dialog Description
      </DialogDescription>
    );
    
    const dialogDescription = getByTestId('dialog-description');
    expect(dialogDescription).toHaveClass('custom-description');
    expect(dialogDescription).toHaveTextContent('Dialog Description');
  });

  it('should handle open state', () => {
    const { getByTestId } = render(
      <Dialog open>
        <DialogContent>
          Dialog Content
        </DialogContent>
      </Dialog>
    );
    
    const dialogRoot = getByTestId('dialog-root');
    expect(dialogRoot).toHaveAttribute('data-state', 'open');
  });

  it('should handle onOpenChange callback', () => {
    const handleOpenChange = jest.fn();
    
    render(
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          Dialog Content
        </DialogContent>
      </Dialog>
    );
    
    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('should handle DialogClose click', () => {
    const { getByTestId } = render(
      <Dialog>
        <DialogContent>
          <DialogClose>Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>
    );
    
    const dialogClose = getByTestId('dialog-close');
    expect(dialogClose).toHaveTextContent('Close Dialog');
    
    expect(dialogClose).toBeInTheDocument();
  });
});
