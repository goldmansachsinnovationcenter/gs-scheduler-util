import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip';

jest.mock('@radix-ui/react-tooltip', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-root">{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-trigger">{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-portal">{children}</div>,
  Content: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content" {...props}>
      {children}
    </div>
  ),
  Provider: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-provider">{children}</div>,
}));

describe('Tooltip Components', () => {
  it('should render TooltipProvider correctly', () => {
    const { getByTestId } = render(
      <TooltipProvider>
        <div>Test Content</div>
      </TooltipProvider>
    );
    
    const provider = getByTestId('tooltip-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveTextContent('Test Content');
  });

  it('should render Tooltip correctly', () => {
    const { getByTestId } = render(
      <Tooltip>
        <div>Test Content</div>
      </Tooltip>
    );
    
    const root = getByTestId('tooltip-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveTextContent('Test Content');
  });

  it('should render TooltipTrigger correctly', () => {
    const { getByTestId } = render(
      <TooltipTrigger>
        <button>Hover Me</button>
      </TooltipTrigger>
    );
    
    const trigger = getByTestId('tooltip-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Hover Me');
  });

  it('should render TooltipContent correctly', () => {
    const { getByTestId } = render(
      <TooltipContent>
        <p>Tooltip Text</p>
      </TooltipContent>
    );
    
    const content = getByTestId('tooltip-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Tooltip Text');
  });

  it('should render TooltipContent with custom className', () => {
    const { getByTestId } = render(
      <TooltipContent className="custom-tooltip">
        <p>Tooltip Text</p>
      </TooltipContent>
    );
    
    const content = getByTestId('tooltip-content');
    expect(content).toHaveClass('custom-tooltip');
  });

  it('should render TooltipContent with custom side', () => {
    const { getByTestId } = render(
      <TooltipContent side="left">
        <p>Tooltip Text</p>
      </TooltipContent>
    );
    
    const content = getByTestId('tooltip-content');
    expect(content).toHaveAttribute('side', 'left');
  });

  it('should render TooltipContent with custom align', () => {
    const { getByTestId } = render(
      <TooltipContent align="start">
        <p>Tooltip Text</p>
      </TooltipContent>
    );
    
    const content = getByTestId('tooltip-content');
    expect(content).toHaveAttribute('align', 'start');
  });

  it('should render a complete tooltip', () => {
    const { getByTestId } = render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <button>Hover Me</button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip Text</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    
    const provider = getByTestId('tooltip-provider');
    const root = getByTestId('tooltip-root');
    const trigger = getByTestId('tooltip-trigger');
    const content = getByTestId('tooltip-content');
    
    expect(provider).toBeInTheDocument();
    expect(root).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Hover Me');
    expect(content).toHaveTextContent('Tooltip Text');
  });
});
