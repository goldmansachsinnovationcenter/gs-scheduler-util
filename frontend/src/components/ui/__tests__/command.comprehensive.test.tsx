import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../command';

jest.mock('../dialog', () => ({
  Dialog: ({ children, ...props }: React.PropsWithChildren<any>) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),
  DialogContent: ({ children, ...props }: React.PropsWithChildren<any>) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
}));

describe('Command Components', () => {
  describe('Command', () => {
    it('renders with default props', () => {
      render(<Command />);
      const command = document.querySelector('[cmdk-root]');
      expect(command).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Command className="custom-class" />);
      const command = document.querySelector('[cmdk-root]');
      expect(command).toHaveClass('custom-class');
    });

    it('passes additional props to the underlying component', () => {
      render(<Command data-testid="test-command" />);
      expect(screen.getByTestId('test-command')).toBeInTheDocument();
    });
  });

  describe('CommandDialog', () => {
    it('renders dialog with command component', () => {
      render(
        <CommandDialog>
          <div data-testid="dialog-content">Test Content</div>
        </CommandDialog>
      );
      
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-content')).toHaveTextContent('Test Content');
    });

    it('passes props to Dialog component', () => {
      render(
        <CommandDialog data-test="test-prop">
          <div>Test Content</div>
        </CommandDialog>
      );
      
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-test', 'test-prop');
    });
  });

  describe('CommandInput', () => {
    it('renders input with search icon', () => {
      render(<CommandInput placeholder="Search..." />);
      
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('applies custom className to input', () => {
      render(<CommandInput className="custom-input" />);
      
      const input = document.querySelector('[cmdk-input]');
      expect(input).toHaveClass('custom-input');
    });

    it('passes additional props to input', () => {
      render(<CommandInput data-testid="test-input" />);
      
      const input = screen.getByTestId('test-input');
      expect(input).toBeInTheDocument();
    });
  });

  describe('CommandList', () => {
    it('renders list component', () => {
      render(
        <CommandList>
          <div>List Item</div>
        </CommandList>
      );
      
      const list = document.querySelector('[cmdk-list]');
      expect(list).toBeInTheDocument();
      expect(list).toHaveTextContent('List Item');
    });

    it('applies custom className', () => {
      render(<CommandList className="custom-list" />);
      
      const list = document.querySelector('[cmdk-list]');
      expect(list).toHaveClass('custom-list');
    });
  });

  describe('CommandEmpty', () => {
    it('renders empty component with default styling', () => {
      render(<CommandEmpty>No results found</CommandEmpty>);
      
      const empty = document.querySelector('[cmdk-empty]');
      expect(empty).toBeInTheDocument();
      expect(empty).toHaveTextContent('No results found');
      expect(empty).toHaveClass('py-6 text-center text-sm');
    });

    it('passes additional props', () => {
      render(<CommandEmpty data-testid="test-empty">No results</CommandEmpty>);
      
      expect(screen.getByTestId('test-empty')).toBeInTheDocument();
    });
  });

  describe('CommandGroup', () => {
    it('renders group component with children', () => {
      render(
        <CommandGroup heading="Category">
          <div>Group Item</div>
        </CommandGroup>
      );
      
      const group = document.querySelector('[cmdk-group]');
      expect(group).toBeInTheDocument();
      expect(group).toHaveTextContent('Group Item');
      
      const heading = document.querySelector('[cmdk-group-heading]');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Category');
    });

    it('applies custom className', () => {
      render(<CommandGroup className="custom-group" />);
      
      const group = document.querySelector('[cmdk-group]');
      expect(group).toHaveClass('custom-group');
    });
  });

  describe('CommandSeparator', () => {
    it('renders separator with default styling', () => {
      render(<CommandSeparator />);
      
      const separator = document.querySelector('[cmdk-separator]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('-mx-1 h-px bg-border');
    });

    it('applies custom className', () => {
      render(<CommandSeparator className="custom-separator" />);
      
      const separator = document.querySelector('[cmdk-separator]');
      expect(separator).toHaveClass('custom-separator');
    });
  });

  describe('CommandItem', () => {
    it('renders item with children', () => {
      render(<CommandItem>Command Item</CommandItem>);
      
      const item = document.querySelector('[cmdk-item]');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Command Item');
    });

    it('applies custom className', () => {
      render(<CommandItem className="custom-item">Item</CommandItem>);
      
      const item = document.querySelector('[cmdk-item]');
      expect(item).toHaveClass('custom-item');
    });

    it('passes additional props', () => {
      render(<CommandItem data-testid="test-item">Item</CommandItem>);
      
      expect(screen.getByTestId('test-item')).toBeInTheDocument();
    });
  });

  describe('CommandShortcut', () => {
    it('renders shortcut with default styling', () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);
      
      const shortcut = screen.getByText('⌘K');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
    });

    it('applies custom className', () => {
      render(<CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>);
      
      const shortcut = screen.getByText('⌘K');
      expect(shortcut).toHaveClass('custom-shortcut');
    });
  });

  describe('Command Integration', () => {
    it('renders a complete command interface', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>
                Keyboard Shortcuts
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      
      expect(document.querySelector('[cmdk-root]')).toBeInTheDocument();
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      
      expect(document.querySelector('[cmdk-list]')).toBeInTheDocument();
      
      expect(document.querySelector('[cmdk-empty]')).toBeInTheDocument();
      expect(screen.getByText('No results found')).toBeInTheDocument();
      
      const headings = document.querySelectorAll('[cmdk-group-heading]');
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('Suggestions');
      expect(headings[1]).toHaveTextContent('Settings');
      
      const items = document.querySelectorAll('[cmdk-item]');
      expect(items).toHaveLength(5);
      expect(items[0]).toHaveTextContent('Calendar');
      expect(items[4]).toHaveTextContent('Keyboard Shortcuts');
      
      expect(document.querySelector('[cmdk-separator]')).toBeInTheDocument();
      
      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });
  });
});
