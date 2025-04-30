import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../hover-card';

jest.mock('@radix-ui/react-hover-card', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="hover-card-root" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <div data-testid="hover-card-trigger" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="hover-card-content" {...props}>
      {children}
    </div>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="hover-card-portal" {...props}>
      {children}
    </div>
  ),
}));

describe('HoverCard Components', () => {
  it('should render HoverCard correctly', () => {
    const { getByTestId, getByText } = render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    );
    
    const root = getByTestId('hover-card-root');
    const trigger = getByTestId('hover-card-trigger');
    const content = getByTestId('hover-card-content');
    
    expect(root).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Hover me');
    expect(content).toHaveTextContent('Hover content');
  });

  it('should apply custom className to HoverCardContent', () => {
    const { getByTestId } = render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent className="custom-content">Hover content</HoverCardContent>
      </HoverCard>
    );
    
    const content = getByTestId('hover-card-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should render with custom side offset', () => {
    const { getByTestId } = render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent sideOffset={10}>Hover content</HoverCardContent>
      </HoverCard>
    );
    
    const content = getByTestId('hover-card-content');
    expect(content).toHaveAttribute('sideOffset', '10');
  });

  it('should render with custom align', () => {
    const { getByTestId } = render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent align="end">Hover content</HoverCardContent>
      </HoverCard>
    );
    
    const content = getByTestId('hover-card-content');
    expect(content).toHaveAttribute('align', 'end');
  });

  it('should render with custom alignOffset', () => {
    const { getByTestId } = render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent alignOffset={10}>Hover content</HoverCardContent>
      </HoverCard>
    );
    
    const content = getByTestId('hover-card-content');
    expect(content).toHaveAttribute('alignOffset', '10');
  });

  it('should render with complex content', () => {
    const { getByTestId, getByText } = render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>
          <h3>Title</h3>
          <p>Description text</p>
          <button>Action</button>
        </HoverCardContent>
      </HoverCard>
    );
    
    const content = getByTestId('hover-card-content');
    expect(content).toContainElement(getByText('Title'));
    expect(content).toContainElement(getByText('Description text'));
    expect(content).toContainElement(getByText('Action'));
  });
});
