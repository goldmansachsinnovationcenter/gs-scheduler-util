import React from 'react';
import { render } from '@testing-library/react';
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

jest.mock('cmdk', () => ({
  Command: ({ children, className, ...props }: any) => (
    <div data-testid="command" className={className} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
}));

jest.mock('../dialog', () => ({
  Dialog: ({ children, ...props }: any) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),
  DialogContent: ({ children, className }: any) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
}));

describe('Command Components', () => {
  it('should render Command correctly', () => {
    const { getByTestId } = render(<Command className="test-class" />);
    
    const command = getByTestId('command');
    expect(command).toBeInTheDocument();
    expect(command).toHaveClass('test-class');
    expect(command).toHaveClass('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground');
  });

  it('should render CommandDialog correctly', () => {
    const { getByTestId } = render(
      <CommandDialog>
        <div>Test Content</div>
      </CommandDialog>
    );
    
    const dialog = getByTestId('dialog');
    const dialogContent = getByTestId('dialog-content');
    const command = getByTestId('command');
    
    expect(dialog).toBeInTheDocument();
    expect(dialogContent).toBeInTheDocument();
    expect(command).toBeInTheDocument();
    
    expect(dialogContent).toHaveClass('overflow-hidden p-0 shadow-lg');
    expect(command).toHaveTextContent('Test Content');
  });

  it('should render CommandInput correctly', () => {
    const { getByTestId, getByRole } = render(
      <CommandInput placeholder="Search..." />
    );
    
    const searchIcon = getByTestId('search-icon');
    const input = getByRole('textbox');
    
    expect(searchIcon).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search...');
  });

  it('should render CommandList correctly', () => {
    const { container } = render(
      <CommandList className="test-class">
        <div>List Item</div>
      </CommandList>
    );
    
    const list = container.firstChild;
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('test-class');
    expect(list).toHaveClass('max-h-[300px] overflow-y-auto overflow-x-hidden');
    expect(list).toHaveTextContent('List Item');
  });

  it('should render CommandEmpty correctly', () => {
    const { container } = render(
      <CommandEmpty>No results found</CommandEmpty>
    );
    
    const empty = container.firstChild;
    expect(empty).toBeInTheDocument();
    expect(empty).toHaveClass('py-6 text-center text-sm');
    expect(empty).toHaveTextContent('No results found');
  });

  it('should render CommandGroup correctly', () => {
    const { container } = render(
      <CommandGroup heading="Test Group">
        <div>Group Item</div>
      </CommandGroup>
    );
    
    const group = container.firstChild;
    expect(group).toBeInTheDocument();
    expect(group).toHaveClass('overflow-hidden p-1 text-foreground');
    expect(group).toHaveTextContent('Group Item');
  });

  it('should render CommandSeparator correctly', () => {
    const { container } = render(
      <CommandSeparator className="test-class" />
    );
    
    const separator = container.firstChild;
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('test-class');
    expect(separator).toHaveClass('-mx-1 h-px bg-border');
  });

  it('should render CommandItem correctly', () => {
    const { container } = render(
      <CommandItem className="test-class">
        Test Item
      </CommandItem>
    );
    
    const item = container.firstChild;
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('test-class');
    expect(item).toHaveClass('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50');
    expect(item).toHaveTextContent('Test Item');
  });

  it('should render CommandShortcut correctly', () => {
    const { container } = render(
      <CommandShortcut className="test-class">
        ⌘K
      </CommandShortcut>
    );
    
    const shortcut = container.firstChild;
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveClass('test-class');
    expect(shortcut).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
    expect(shortcut).toHaveTextContent('⌘K');
  });

  it('should render a complete command interface', () => {
    const { getByTestId, container } = render(
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
    
    const command = getByTestId('command');
    const searchIcon = getByTestId('search-icon');
    
    expect(command).toBeInTheDocument();
    expect(searchIcon).toBeInTheDocument();
    expect(command).toHaveTextContent('No results found');
    expect(command).toHaveTextContent('Calendar');
    expect(command).toHaveTextContent('Search');
    expect(command).toHaveTextContent('Settings');
    expect(command).toHaveTextContent('Profile');
    expect(command).toHaveTextContent('Keyboard Shortcuts');
    expect(command).toHaveTextContent('⌘K');
  });
});
