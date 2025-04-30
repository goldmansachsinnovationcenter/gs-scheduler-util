import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '../context-menu';

jest.mock('@radix-ui/react-context-menu', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="context-menu-root" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <div data-testid="context-menu-trigger" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="context-menu-content" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, ...props }: any) => (
    <div data-testid="context-menu-item" {...props}>
      {children}
    </div>
  ),
  Separator: ({ ...props }: any) => (
    <div data-testid="context-menu-separator" {...props} />
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="context-menu-portal" {...props}>
      {children}
    </div>
  ),
}));

describe('ContextMenu Components', () => {
  it('should render ContextMenu correctly', () => {
    const { getByTestId, getByText } = render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Item 2
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    
    const root = getByTestId('context-menu-root');
    const trigger = getByTestId('context-menu-trigger');
    const content = getByTestId('context-menu-content');
    const items = getByTestId('context-menu-item');
    const separator = getByTestId('context-menu-separator');
    
    expect(root).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(items).toBeInTheDocument();
    expect(separator).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Right click me');
    expect(items).toHaveTextContent('Item 1');
  });

  it('should apply custom className to ContextMenuTrigger', () => {
    const { getByTestId } = render(
      <ContextMenu>
        <ContextMenuTrigger className="custom-trigger">Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    
    const trigger = getByTestId('context-menu-trigger');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('should apply custom className to ContextMenuContent', () => {
    const { getByTestId } = render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent className="custom-content">
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    
    const content = getByTestId('context-menu-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should apply custom className to ContextMenuItem', () => {
    const { getByTestId } = render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="custom-item">Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    
    const item = getByTestId('context-menu-item');
    expect(item).toHaveClass('custom-item');
  });

  it('should render ContextMenuShortcut correctly', () => {
    const { getByText } = render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Item 1
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    
    const shortcut = getByText('⌘S');
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
  });

  it('should render multiple ContextMenuItems', () => {
    const { getAllByTestId } = render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuItem>Item 2</ContextMenuItem>
          <ContextMenuItem>Item 3</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    
    const items = getAllByTestId('context-menu-item');
    expect(items.length).toBe(3);
  });
});
