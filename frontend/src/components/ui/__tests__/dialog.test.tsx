import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../dialog';

jest.mock('@radix-ui/react-dialog', () => ({
  Root: jest.fn(({ children, ...props }) => (
    <div data-testid="dialog-root" {...props}>
      {children}
    </div>
  )),
  Trigger: jest.fn(({ children, ...props }) => (
    <button data-testid="dialog-trigger" {...props}>
      {children}
    </button>
  )),
  Portal: jest.fn(({ children, ...props }) => (
    <div data-testid="dialog-portal" {...props}>
      {children}
    </div>
  )),
  Close: jest.fn(({ children, ...props }) => (
    <button data-testid="dialog-close" {...props}>
      {children}
    </button>
  )),
  Overlay: jest.fn(({ className, ...props }) => (
    <div data-testid="dialog-overlay" className={className} {...props} />
  )),
  Content: jest.fn(({ className, children, ...props }) => (
    <div data-testid="dialog-content" className={className} {...props}>
      {children}
    </div>
  )),
  Title: jest.fn(({ className, ...props }) => (
    <h2 data-testid="dialog-title" className={className} {...props} />
  )),
  Description: jest.fn(({ className, ...props }) => (
    <p data-testid="dialog-description" className={className} {...props} />
  )),
}));

jest.mock('lucide-react', () => ({
  XIcon: jest.fn(() => <svg data-testid="x-icon" />),
}));

describe('Dialog Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dialog', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(<Dialog>Test Dialog</Dialog>);
      const dialog = getByTestId('dialog-root');
      
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('data-slot', 'dialog');
    });
  });

  describe('DialogTrigger', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(<DialogTrigger>Open Dialog</DialogTrigger>);
      const trigger = getByTestId('dialog-trigger');
      
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger');
      expect(trigger).toHaveTextContent('Open Dialog');
    });
  });

  describe('DialogPortal', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(<DialogPortal>Portal Content</DialogPortal>);
      const portal = getByTestId('dialog-portal');
      
      expect(portal).toBeInTheDocument();
      expect(portal).toHaveAttribute('data-slot', 'dialog-portal');
      expect(portal).toHaveTextContent('Portal Content');
    });
  });

  describe('DialogClose', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(<DialogClose>Close Dialog</DialogClose>);
      const close = getByTestId('dialog-close');
      
      expect(close).toBeInTheDocument();
      expect(close).toHaveAttribute('data-slot', 'dialog-close');
      expect(close).toHaveTextContent('Close Dialog');
    });
  });

  describe('DialogOverlay', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(<DialogOverlay />);
      const overlay = getByTestId('dialog-overlay');
      
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveAttribute('data-slot', 'dialog-overlay');
      expect(overlay).toHaveClass('fixed inset-0 z-50 bg-black/50');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(<DialogOverlay className="custom-class" />);
      const overlay = getByTestId('dialog-overlay');
      
      expect(overlay).toHaveClass('custom-class');
    });
  });

  describe('DialogContent', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <DialogContent>Dialog Content</DialogContent>
      );
      
      const content = getByTestId('dialog-content');
      const portal = getByTestId('dialog-portal');
      const overlay = getByTestId('dialog-overlay');
      const closeButton = getByTestId('dialog-close');
      const xIcon = getByTestId('x-icon');
      
      expect(content).toBeInTheDocument();
      expect(portal).toBeInTheDocument();
      expect(overlay).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(xIcon).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'dialog-content');
      expect(content).toHaveClass('bg-background');
      expect(content).toHaveTextContent('Dialog Content');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <DialogContent className="custom-class">Dialog Content</DialogContent>
      );
      const content = getByTestId('dialog-content');
      
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('DialogHeader', () => {
    it('should render correctly', () => {
      const { container } = render(<DialogHeader>Header Content</DialogHeader>);
      const header = container.firstChild as HTMLElement;
      
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'dialog-header');
      expect(header).toHaveClass('flex flex-col gap-2 text-center sm:text-left');
      expect(header).toHaveTextContent('Header Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <DialogHeader className="custom-class">Header Content</DialogHeader>
      );
      const header = container.firstChild as HTMLElement;
      
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('DialogFooter', () => {
    it('should render correctly', () => {
      const { container } = render(<DialogFooter>Footer Content</DialogFooter>);
      const footer = container.firstChild as HTMLElement;
      
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'dialog-footer');
      expect(footer).toHaveClass('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end');
      expect(footer).toHaveTextContent('Footer Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <DialogFooter className="custom-class">Footer Content</DialogFooter>
      );
      const footer = container.firstChild as HTMLElement;
      
      expect(footer).toHaveClass('custom-class');
    });
  });

  describe('DialogTitle', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(<DialogTitle>Dialog Title</DialogTitle>);
      const title = getByTestId('dialog-title');
      
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'dialog-title');
      expect(title).toHaveClass('text-lg leading-none font-semibold');
      expect(title).toHaveTextContent('Dialog Title');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <DialogTitle className="custom-class">Dialog Title</DialogTitle>
      );
      const title = getByTestId('dialog-title');
      
      expect(title).toHaveClass('custom-class');
    });
  });

  describe('DialogDescription', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <DialogDescription>Dialog Description</DialogDescription>
      );
      const description = getByTestId('dialog-description');
      
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'dialog-description');
      expect(description).toHaveClass('text-muted-foreground text-sm');
      expect(description).toHaveTextContent('Dialog Description');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <DialogDescription className="custom-class">Dialog Description</DialogDescription>
      );
      const description = getByTestId('dialog-description');
      
      expect(description).toHaveClass('custom-class');
    });
  });
});
