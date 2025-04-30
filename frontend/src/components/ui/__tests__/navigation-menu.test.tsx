import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '../navigation-menu';

jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="navigation-menu-root" {...props}>
      {children}
    </div>
  ),
  List: ({ children, ...props }: any) => (
    <div data-testid="navigation-menu-list" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, ...props }: any) => (
    <div data-testid="navigation-menu-item" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="navigation-menu-trigger" {...props}>
      {children}
    </button>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="navigation-menu-content" {...props}>
      {children}
    </div>
  ),
  Link: ({ children, ...props }: any) => (
    <a data-testid="navigation-menu-link" {...props}>
      {children}
    </a>
  ),
  Viewport: ({ children, ...props }: any) => (
    <div data-testid="navigation-menu-viewport" {...props}>
      {children}
    </div>
  ),
  Indicator: ({ children, ...props }: any) => (
    <div data-testid="navigation-menu-indicator" {...props}>
      {children}
    </div>
  ),
}));

describe('NavigationMenu Components', () => {
  it('should render NavigationMenu correctly', () => {
    const { getByTestId } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#">Link 1</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    );
    
    const root = getByTestId('navigation-menu-root');
    const list = getByTestId('navigation-menu-list');
    const item = getByTestId('navigation-menu-item');
    const trigger = getByTestId('navigation-menu-trigger');
    const content = getByTestId('navigation-menu-content');
    const link = getByTestId('navigation-menu-link');
    const viewport = getByTestId('navigation-menu-viewport');
    
    expect(root).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(item).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(viewport).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Item 1');
    expect(link).toHaveTextContent('Link 1');
    expect(link).toHaveAttribute('href', '#');
  });

  it('should apply custom className to NavigationMenuList', () => {
    const { getByTestId } = render(
      <NavigationMenu>
        <NavigationMenuList className="custom-list">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    const list = getByTestId('navigation-menu-list');
    expect(list).toHaveClass('custom-list');
  });

  it('should apply custom className to NavigationMenuContent', () => {
    const { getByTestId } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
            <NavigationMenuContent className="custom-content">
              <NavigationMenuLink href="#">Link 1</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    const content = getByTestId('navigation-menu-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should apply navigationMenuTriggerStyle to NavigationMenuLink', () => {
    const { getByTestId } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
              Link with Trigger Style
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    const link = getByTestId('navigation-menu-link');
    expect(link).toHaveClass('group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50');
  });

  it('should render multiple NavigationMenuItems', () => {
    const { getAllByTestId } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 2</NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 3</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    const items = getAllByTestId('navigation-menu-item');
    const triggers = getAllByTestId('navigation-menu-trigger');
    
    expect(items.length).toBe(3);
    expect(triggers.length).toBe(3);
    expect(triggers[0]).toHaveTextContent('Item 1');
    expect(triggers[1]).toHaveTextContent('Item 2');
    expect(triggers[2]).toHaveTextContent('Item 3');
  });
});
