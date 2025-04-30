import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from '../context-menu';

jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Circle: () => <div data-testid="circle-icon" />,
}));

jest.mock('@radix-ui/react-context-menu', () => {
  const actual = jest.requireActual('@radix-ui/react-context-menu');
  return {
    ...actual,
    Portal: ({ children }: React.PropsWithChildren<{}>) => (
      <div data-testid="context-menu-portal">{children}</div>
    ),
  };
});

describe('ContextMenu Components', () => {
  describe('ContextMenuTrigger', () => {
    it('renders with children', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger data-testid="trigger">
            Right Click Me
          </ContextMenuTrigger>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Right Click Me')).toBeInTheDocument();
    });
  });

  describe('ContextMenuContent', () => {
    it('renders with portal and children', () => {
      render(
        <ContextMenu>
          <ContextMenuContent data-testid="content">
            Menu Content
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('context-menu-portal')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Menu Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent className="custom-content" data-testid="content">
            Content
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('content')).toHaveClass('custom-content');
    });
  });

  describe('ContextMenuItem', () => {
    it('renders with children', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuItem data-testid="item">Menu Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('item')).toBeInTheDocument();
      expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });

    it('applies inset prop correctly', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuItem inset data-testid="inset-item">
              Inset Item
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('inset-item')).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuItem className="custom-item" data-testid="custom-item">
              Custom Item
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-item')).toHaveClass('custom-item');
    });
  });

  describe('ContextMenuCheckboxItem', () => {
    it('renders with children and checked state', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuCheckboxItem checked data-testid="checkbox-item">
              Checkbox Item
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('checkbox-item')).toBeInTheDocument();
      expect(screen.getByText('Checkbox Item')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuCheckboxItem className="custom-checkbox" data-testid="custom-checkbox">
              Custom Checkbox
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-checkbox')).toHaveClass('custom-checkbox');
    });
  });

  describe('ContextMenuRadioItem', () => {
    it('renders with children', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuRadioGroup>
              <ContextMenuRadioItem value="option1" data-testid="radio-item">
                Radio Item
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('radio-item')).toBeInTheDocument();
      expect(screen.getByText('Radio Item')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuRadioGroup>
              <ContextMenuRadioItem className="custom-radio" value="option1" data-testid="custom-radio">
                Custom Radio
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-radio')).toHaveClass('custom-radio');
    });
  });

  describe('ContextMenuLabel', () => {
    it('renders with children', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuLabel data-testid="label">Menu Label</ContextMenuLabel>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('label')).toBeInTheDocument();
      expect(screen.getByText('Menu Label')).toBeInTheDocument();
    });

    it('applies inset prop correctly', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuLabel inset data-testid="inset-label">
              Inset Label
            </ContextMenuLabel>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('inset-label')).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuLabel className="custom-label" data-testid="custom-label">
              Custom Label
            </ContextMenuLabel>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-label')).toHaveClass('custom-label');
    });
  });

  describe('ContextMenuSeparator', () => {
    it('renders separator', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuSeparator data-testid="separator" />
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('separator')).toBeInTheDocument();
      expect(screen.getByTestId('separator')).toHaveClass('-mx-1 my-1 h-px bg-border');
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuSeparator className="custom-separator" data-testid="custom-separator" />
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-separator')).toHaveClass('custom-separator');
    });
  });

  describe('ContextMenuShortcut', () => {
    it('renders with children', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuItem>
              Item
              <ContextMenuShortcut data-testid="shortcut">⌘K</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('shortcut')).toBeInTheDocument();
      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuItem>
              Item
              <ContextMenuShortcut className="custom-shortcut" data-testid="custom-shortcut">
                ⌘K
              </ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-shortcut')).toHaveClass('custom-shortcut');
    });
  });

  describe('ContextMenuSubTrigger', () => {
    it('renders with children and chevron icon', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubTrigger data-testid="sub-trigger">
                Sub Menu
              </ContextMenuSubTrigger>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('sub-trigger')).toBeInTheDocument();
      expect(screen.getByText('Sub Menu')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
    });

    it('applies inset prop correctly', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubTrigger inset data-testid="inset-sub-trigger">
                Inset Sub Menu
              </ContextMenuSubTrigger>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('inset-sub-trigger')).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubTrigger className="custom-sub-trigger" data-testid="custom-sub-trigger">
                Custom Sub Menu
              </ContextMenuSubTrigger>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-sub-trigger')).toHaveClass('custom-sub-trigger');
    });
  });

  describe('ContextMenuSubContent', () => {
    it('renders with children', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubContent data-testid="sub-content">
                Sub Content
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('sub-content')).toBeInTheDocument();
      expect(screen.getByText('Sub Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubContent className="custom-sub-content" data-testid="custom-sub-content">
                Custom Sub Content
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('custom-sub-content')).toHaveClass('custom-sub-content');
    });
  });

  describe('ContextMenu Integration', () => {
    it('renders a complete context menu', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger data-testid="trigger">Right Click Me</ContextMenuTrigger>
          <ContextMenuContent data-testid="content">
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuGroup>
              <ContextMenuItem>
                Copy
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Paste
                <ContextMenuShortcut>⌘V</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>Show Toolbar</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuRadioGroup>
                  <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="medium">Medium</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Right Click Me')).toBeInTheDocument();
      
      expect(screen.getByTestId('content')).toBeInTheDocument();
      
      expect(screen.getByText('Actions')).toBeInTheDocument();
      
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Paste')).toBeInTheDocument();
      
      expect(screen.getByText('⌘C')).toBeInTheDocument();
      expect(screen.getByText('⌘V')).toBeInTheDocument();
      
      expect(screen.getByText('Show Toolbar')).toBeInTheDocument();
      
      expect(screen.getByText('More Options')).toBeInTheDocument();
      
      expect(screen.getByText('Small')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Large')).toBeInTheDocument();
    });
  });
});
