import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../sheet';

jest.mock('@radix-ui/react-dialog', () => {
  const actual = jest.requireActual('@radix-ui/react-dialog');
  return {
    ...actual,
    Portal: ({ children }: React.PropsWithChildren<{}>) => (
      <div data-testid="sheet-portal">{children}</div>
    ),
  };
});

describe('Sheet Components', () => {
  describe('SheetTrigger', () => {
    it('renders with children', () => {
      render(
        <Sheet>
          <SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>
        </Sheet>
      );
      
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Open Sheet')).toBeInTheDocument();
    });
  });

  describe('SheetOverlay', () => {
    it('renders with default styling', () => {
      render(
        <Sheet>
          <SheetPortal>
            <SheetOverlay data-testid="overlay" />
          </SheetPortal>
        </Sheet>
      );
      
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('overlay')).toHaveClass('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm');
    });

    it('applies custom className', () => {
      render(
        <Sheet>
          <SheetPortal>
            <SheetOverlay className="custom-overlay" data-testid="custom-overlay" />
          </SheetPortal>
        </Sheet>
      );
      
      expect(screen.getByTestId('custom-overlay')).toHaveClass('custom-overlay');
    });
  });

  describe('SheetContent', () => {
    it('renders with children and default side (right)', () => {
      render(
        <Sheet>
          <SheetContent data-testid="content">
            Sheet Content
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('sheet-portal')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Sheet Content')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument(); // Close button
    });

    it('applies custom className', () => {
      render(
        <Sheet>
          <SheetContent className="custom-content" data-testid="custom-content">
            Content
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('custom-content')).toHaveClass('custom-content');
    });

    it('renders with side="top"', () => {
      render(
        <Sheet>
          <SheetContent side="top" data-testid="top-content">
            Top Content
          </SheetContent>
        </Sheet>
      );
      
      const content = screen.getByTestId('top-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('inset-x-0 top-0 border-b');
    });

    it('renders with side="bottom"', () => {
      render(
        <Sheet>
          <SheetContent side="bottom" data-testid="bottom-content">
            Bottom Content
          </SheetContent>
        </Sheet>
      );
      
      const content = screen.getByTestId('bottom-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('inset-x-0 bottom-0 border-t');
    });

    it('renders with side="left"', () => {
      render(
        <Sheet>
          <SheetContent side="left" data-testid="left-content">
            Left Content
          </SheetContent>
        </Sheet>
      );
      
      const content = screen.getByTestId('left-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('inset-y-0 left-0 h-full w-3/4 border-r');
    });

    it('renders with side="right"', () => {
      render(
        <Sheet>
          <SheetContent side="right" data-testid="right-content">
            Right Content
          </SheetContent>
        </Sheet>
      );
      
      const content = screen.getByTestId('right-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('inset-y-0 right-0 h-full w-3/4 border-l');
    });
  });

  describe('SheetHeader', () => {
    it('renders with children', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetHeader data-testid="header">
              Header Content
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetHeader className="custom-header" data-testid="custom-header">
              Custom Header
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('custom-header')).toHaveClass('custom-header');
    });
  });

  describe('SheetFooter', () => {
    it('renders with children', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetFooter data-testid="footer">
              Footer Content
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetFooter className="custom-footer" data-testid="custom-footer">
              Custom Footer
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('custom-footer')).toHaveClass('custom-footer');
    });
  });

  describe('SheetTitle', () => {
    it('renders with children', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetTitle data-testid="title">Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetTitle className="custom-title" data-testid="custom-title">
              Custom Title
            </SheetTitle>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('custom-title')).toHaveClass('custom-title');
    });
  });

  describe('SheetDescription', () => {
    it('renders with children', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetDescription data-testid="description">
              Sheet Description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('description')).toBeInTheDocument();
      expect(screen.getByText('Sheet Description')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetDescription className="custom-description" data-testid="custom-description">
              Custom Description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('custom-description')).toHaveClass('custom-description');
    });
  });

  describe('Sheet Integration', () => {
    it('renders a complete sheet', () => {
      render(
        <Sheet>
          <SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>
          <SheetContent data-testid="content">
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet Description</SheetDescription>
            </SheetHeader>
            <div>Main Content</div>
            <SheetFooter>
              <SheetClose asChild>
                <button data-testid="close-button">Close Sheet</button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
      
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Open Sheet')).toBeInTheDocument();
      
      expect(screen.getByTestId('content')).toBeInTheDocument();
      
      expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      expect(screen.getByText('Sheet Description')).toBeInTheDocument();
      
      expect(screen.getByText('Main Content')).toBeInTheDocument();
      
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
      expect(screen.getByText('Close Sheet')).toBeInTheDocument();
    });
  });
});
