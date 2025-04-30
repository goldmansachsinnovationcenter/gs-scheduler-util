import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '../menubar';

jest.mock('@radix-ui/react-menubar', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="menubar-root" {...props}>
      {children}
    </div>
  ),
  Menu: ({ children, ...props }: any) => (
    <div data-testid="menubar-menu" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="menubar-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="menubar-portal" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="menubar-content" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, ...props }: any) => (
    <div data-testid="menubar-item" {...props}>
      {children}
    </div>
  ),
  Separator: ({ ...props }: any) => (
    <div data-testid="menubar-separator" {...props} />
  ),
}));

describe('Menubar Components', () => {
  it('should render Menubar correctly', () => {
    const { getByTestId, getAllByTestId } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Share
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    
    const root = getByTestId('menubar-root');
    const menu = getByTestId('menubar-menu');
    const trigger = getByTestId('menubar-trigger');
    const content = getByTestId('menubar-content');
    const items = getAllByTestId('menubar-item');
    const separator = getByTestId('menubar-separator');
    
    expect(root).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(items.length).toBe(3);
    expect(separator).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('File');
    expect(items[0]).toHaveTextContent('New Tab');
    expect(items[1]).toHaveTextContent('New Window');
    expect(items[2]).toHaveTextContent('Share');
  });

  it('should apply custom className to MenubarTrigger', () => {
    const { getByTestId } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="custom-trigger">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    
    const trigger = getByTestId('menubar-trigger');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('should apply custom className to MenubarContent', () => {
    const { getByTestId } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent className="custom-content">
            <MenubarItem>New Tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    
    const content = getByTestId('menubar-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should apply custom className to MenubarItem', () => {
    const { getAllByTestId } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem className="custom-item">New Tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    
    const items = getAllByTestId('menubar-item');
    expect(items[0]).toHaveClass('custom-item');
  });

  it('should handle click on MenubarTrigger', () => {
    const { getByTestId } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    
    const trigger = getByTestId('menubar-trigger');
    fireEvent.click(trigger);
    
    expect(trigger).toBeInTheDocument();
  });

  it('should render MenubarShortcut correctly', () => {
    const { getByText } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    
    const shortcut = getByText('⌘S');
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
  });

  it('should render multiple MenubarMenu items', () => {
    const { getAllByTestId } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Cut</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    
    const menus = getAllByTestId('menubar-menu');
    const triggers = getAllByTestId('menubar-trigger');
    
    expect(menus.length).toBe(3);
    expect(triggers.length).toBe(3);
    expect(triggers[0]).toHaveTextContent('File');
    expect(triggers[1]).toHaveTextContent('Edit');
    expect(triggers[2]).toHaveTextContent('View');
  });
});
