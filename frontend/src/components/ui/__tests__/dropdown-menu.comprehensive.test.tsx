import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../dropdown-menu';

jest.mock('@radix-ui/react-dropdown-menu', () => {
  const actual = jest.requireActual('@radix-ui/react-dropdown-menu');
  return {
    ...actual,
    Portal: ({ children }: React.PropsWithChildren<{}>) => (
      <div data-testid="dropdown-menu-portal">{children}</div>
    ),
  };
});

describe('DropdownMenu Components', () => {
  describe('DropdownMenuTrigger', () => {
    it('renders with children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">
            Click Me
          </DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuContent', () => {
    it('renders with portal and children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent data-testid="content">
            Menu Content
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('dropdown-menu-portal')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Menu Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent className="custom-content" data-testid="content">
            Content
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('content')).toHaveClass('custom-content');
    });

    it('applies sideOffset prop', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent sideOffset={10} data-testid="content">
            Content
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('content')).toHaveAttribute('sideOffset', '10');
    });
  });

  describe('DropdownMenuItem', () => {
    it('renders with children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuItem data-testid="item">Menu Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('item')).toBeInTheDocument();
      expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });

    it('applies inset prop correctly', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuItem inset data-testid="inset-item">
              Inset Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('inset-item')).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item" data-testid="custom-item">
              Custom Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-item')).toHaveClass('custom-item');
    });
  });

  describe('DropdownMenuCheckboxItem', () => {
    it('renders with children and checked state', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked data-testid="checkbox-item">
              Checkbox Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('checkbox-item')).toBeInTheDocument();
      expect(screen.getByText('Checkbox Item')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem className="custom-checkbox" data-testid="custom-checkbox">
              Custom Checkbox
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-checkbox')).toHaveClass('custom-checkbox');
    });
  });

  describe('DropdownMenuRadioItem', () => {
    it('renders with children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="option1" data-testid="radio-item">
                Radio Item
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('radio-item')).toBeInTheDocument();
      expect(screen.getByText('Radio Item')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem className="custom-radio" value="option1" data-testid="custom-radio">
                Custom Radio
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-radio')).toHaveClass('custom-radio');
    });
  });

  describe('DropdownMenuLabel', () => {
    it('renders with children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuLabel data-testid="label">Menu Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('label')).toBeInTheDocument();
      expect(screen.getByText('Menu Label')).toBeInTheDocument();
    });

    it('applies inset prop correctly', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuLabel inset data-testid="inset-label">
              Inset Label
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('inset-label')).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuLabel className="custom-label" data-testid="custom-label">
              Custom Label
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-label')).toHaveClass('custom-label');
    });
  });

  describe('DropdownMenuSeparator', () => {
    it('renders separator', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSeparator data-testid="separator" />
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('separator')).toBeInTheDocument();
      expect(screen.getByTestId('separator')).toHaveClass('-mx-1 my-1 h-px bg-muted');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSeparator className="custom-separator" data-testid="custom-separator" />
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-separator')).toHaveClass('custom-separator');
    });
  });

  describe('DropdownMenuShortcut', () => {
    it('renders with children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Item
              <DropdownMenuShortcut data-testid="shortcut">⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('shortcut')).toBeInTheDocument();
      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Item
              <DropdownMenuShortcut className="custom-shortcut" data-testid="custom-shortcut">
                ⌘K
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-shortcut')).toHaveClass('custom-shortcut');
    });
  });

  describe('DropdownMenuSubTrigger', () => {
    it('renders with children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="sub-trigger">
                Sub Menu
              </DropdownMenuSubTrigger>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('sub-trigger')).toBeInTheDocument();
      expect(screen.getByText('Sub Menu')).toBeInTheDocument();
    });

    it('applies inset prop correctly', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset data-testid="inset-sub-trigger">
                Inset Sub Menu
              </DropdownMenuSubTrigger>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('inset-sub-trigger')).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="custom-sub-trigger" data-testid="custom-sub-trigger">
                Custom Sub Menu
              </DropdownMenuSubTrigger>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-sub-trigger')).toHaveClass('custom-sub-trigger');
    });
  });

  describe('DropdownMenuSubContent', () => {
    it('renders with children', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubContent data-testid="sub-content">
                Sub Content
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('sub-content')).toBeInTheDocument();
      expect(screen.getByText('Sub Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubContent className="custom-sub-content" data-testid="custom-sub-content">
                Custom Sub Content
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('custom-sub-content')).toHaveClass('custom-sub-content');
    });
  });

  describe('DropdownMenu Integration', () => {
    it('renders a complete dropdown menu', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="content">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Copy
                <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Paste
                <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Show Toolbar</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Open Menu')).toBeInTheDocument();
      
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
