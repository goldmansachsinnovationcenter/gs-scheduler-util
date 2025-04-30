import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

jest.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-root">{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-trigger">{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-portal">{children}</div>,
  Content: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="popover-content" {...props}>
      {children}
    </div>
  ),
}));

describe('Popover Components', () => {
  it('should render Popover correctly', () => {
    const { getByTestId } = render(
      <Popover>
        <div>Test Content</div>
      </Popover>
    );
    
    const root = getByTestId('popover-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveTextContent('Test Content');
  });

  it('should render PopoverTrigger correctly', () => {
    const { getByTestId } = render(
      <PopoverTrigger>
        <button>Click Me</button>
      </PopoverTrigger>
    );
    
    const trigger = getByTestId('popover-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Click Me');
  });

  it('should render PopoverContent correctly', () => {
    const { getByTestId } = render(
      <PopoverContent>
        <p>Popover Text</p>
      </PopoverContent>
    );
    
    const content = getByTestId('popover-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Popover Text');
  });

  it('should render PopoverContent with custom className', () => {
    const { getByTestId } = render(
      <PopoverContent className="custom-popover">
        <p>Popover Text</p>
      </PopoverContent>
    );
    
    const content = getByTestId('popover-content');
    expect(content).toHaveClass('custom-popover');
  });

  it('should render PopoverContent with custom side', () => {
    const { getByTestId } = render(
      <PopoverContent side="left">
        <p>Popover Text</p>
      </PopoverContent>
    );
    
    const content = getByTestId('popover-content');
    expect(content).toHaveAttribute('side', 'left');
  });

  it('should render PopoverContent with custom align', () => {
    const { getByTestId } = render(
      <PopoverContent align="start">
        <p>Popover Text</p>
      </PopoverContent>
    );
    
    const content = getByTestId('popover-content');
    expect(content).toHaveAttribute('align', 'start');
  });

  it('should render a complete popover', () => {
    const { getByTestId } = render(
      <Popover>
        <PopoverTrigger>
          <button>Click Me</button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Popover Text</p>
        </PopoverContent>
      </Popover>
    );
    
    const root = getByTestId('popover-root');
    const trigger = getByTestId('popover-trigger');
    const content = getByTestId('popover-content');
    
    expect(root).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Click Me');
    expect(content).toHaveTextContent('Popover Text');
  });
});
