import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../collapsible';

jest.mock('@radix-ui/react-collapsible', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="collapsible-root" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="collapsible-trigger" {...props}>
      {children}
    </button>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="collapsible-content" {...props}>
      {children}
    </div>
  ),
}));

describe('Collapsible Components', () => {
  it('should render collapsible correctly', () => {
    const { getByTestId, getByText } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    const root = getByTestId('collapsible-root');
    const trigger = getByTestId('collapsible-trigger');
    const content = getByTestId('collapsible-content');
    
    expect(root).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Toggle');
    expect(content).toHaveTextContent('Content');
  });

  it('should apply custom className to collapsible root', () => {
    const { getByTestId } = render(
      <Collapsible className="custom-collapsible">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    const root = getByTestId('collapsible-root');
    expect(root).toHaveClass('custom-collapsible');
  });

  it('should apply custom className to collapsible trigger', () => {
    const { getByTestId } = render(
      <Collapsible>
        <CollapsibleTrigger className="custom-trigger">Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    const trigger = getByTestId('collapsible-trigger');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('should apply custom className to collapsible content', () => {
    const { getByTestId } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent className="custom-content">Content</CollapsibleContent>
      </Collapsible>
    );
    
    const content = getByTestId('collapsible-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should handle open state', () => {
    const { getByTestId } = render(
      <Collapsible open={true}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    const root = getByTestId('collapsible-root');
    expect(root).toHaveAttribute('open', 'true');
  });

  it('should handle defaultOpen prop', () => {
    const { getByTestId } = render(
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    const root = getByTestId('collapsible-root');
    expect(root).toHaveAttribute('defaultOpen', 'true');
  });

  it('should handle onOpenChange callback', () => {
    const handleOpenChange = jest.fn();
    
    const { getByTestId } = render(
      <Collapsible onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    const root = getByTestId('collapsible-root');
    expect(root).toHaveAttribute('onOpenChange');
  });

  it('should handle disabled state', () => {
    const { getByTestId } = render(
      <Collapsible disabled>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    const root = getByTestId('collapsible-root');
    expect(root).toHaveAttribute('disabled', 'true');
  });
});
