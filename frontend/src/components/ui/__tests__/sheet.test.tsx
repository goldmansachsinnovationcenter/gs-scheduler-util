import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '../sheet';

jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-root">{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-trigger">{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-portal">{children}</div>,
  Content: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content" {...props}>{children}</div>
  ),
  Title: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="sheet-title" {...props}>{children}</div>
  ),
  Description: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="sheet-description" {...props}>{children}</div>
  ),
  Close: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="sheet-close" {...props}>{children}</div>
  ),
}));

describe('Sheet Components', () => {
  it('should render Sheet correctly', () => {
    const { getByTestId } = render(
      <Sheet>
        <div>Test Content</div>
      </Sheet>
    );
    
    const root = getByTestId('sheet-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveTextContent('Test Content');
  });

  it('should render SheetTrigger correctly', () => {
    const { getByTestId } = render(
      <SheetTrigger>
        <button>Open Sheet</button>
      </SheetTrigger>
    );
    
    const trigger = getByTestId('sheet-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Open Sheet');
  });

  it('should render SheetContent correctly', () => {
    const { getByTestId } = render(
      <SheetContent>
        <p>Sheet Content</p>
      </SheetContent>
    );
    
    const content = getByTestId('sheet-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Sheet Content');
  });

  it('should render SheetContent with custom className', () => {
    const { getByTestId } = render(
      <SheetContent className="custom-sheet">
        <p>Sheet Content</p>
      </SheetContent>
    );
    
    const content = getByTestId('sheet-content');
    expect(content).toHaveClass('custom-sheet');
  });

  it('should render SheetContent with custom side', () => {
    const { getByTestId } = render(
      <SheetContent side="left">
        <p>Sheet Content</p>
      </SheetContent>
    );
    
    const content = getByTestId('sheet-content');
    expect(content).toHaveAttribute('side', 'left');
  });

  it('should render SheetHeader correctly', () => {
    const { container } = render(
      <SheetHeader>
        <p>Sheet Header</p>
      </SheetHeader>
    );
    
    const header = container.firstChild;
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Sheet Header');
  });

  it('should render SheetTitle correctly', () => {
    const { getByTestId } = render(
      <SheetTitle>
        Sheet Title
      </SheetTitle>
    );
    
    const title = getByTestId('sheet-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Sheet Title');
  });

  it('should render SheetDescription correctly', () => {
    const { getByTestId } = render(
      <SheetDescription>
        Sheet Description
      </SheetDescription>
    );
    
    const description = getByTestId('sheet-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Sheet Description');
  });

  it('should render SheetFooter correctly', () => {
    const { container } = render(
      <SheetFooter>
        <p>Sheet Footer</p>
      </SheetFooter>
    );
    
    const footer = container.firstChild;
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('Sheet Footer');
  });

  it('should render SheetClose correctly', () => {
    const { getByTestId } = render(
      <SheetClose>
        <button>Close Sheet</button>
      </SheetClose>
    );
    
    const close = getByTestId('sheet-close');
    expect(close).toBeInTheDocument();
    expect(close).toHaveTextContent('Close Sheet');
  });

  it('should render a complete sheet', () => {
    const { getByTestId, container } = render(
      <Sheet>
        <SheetTrigger>
          <button>Open Sheet</button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <div>Main Content</div>
          <SheetFooter>
            <SheetClose>
              <button>Close Sheet</button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
    
    const root = getByTestId('sheet-root');
    const trigger = getByTestId('sheet-trigger');
    const content = getByTestId('sheet-content');
    const title = getByTestId('sheet-title');
    const description = getByTestId('sheet-description');
    const close = getByTestId('sheet-close');
    
    expect(root).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(close).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Open Sheet');
    expect(title).toHaveTextContent('Sheet Title');
    expect(description).toHaveTextContent('Sheet Description');
    expect(content).toHaveTextContent('Main Content');
    expect(close).toHaveTextContent('Close Sheet');
  });
});
