import React from 'react';
import { render } from '@testing-library/react';
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
  DropdownMenuGroup,
  DropdownMenuRadioGroup
} from '../dropdown-menu';

jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-root">{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-trigger">{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-portal">{children}</div>,
  Content: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content" {...props}>{children}</div>
  ),
  Item: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-item" {...props}>{children}</div>
  ),
  CheckboxItem: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-checkbox-item" {...props}>{children}</div>
  ),
  RadioItem: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-radio-item" {...props}>{children}</div>
  ),
  Label: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-label" {...props}>{children}</div>
  ),
  Separator: (props: any) => <div data-testid="dropdown-separator" {...props} />,
  Group: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-group" {...props}>{children}</div>
  ),
  RadioGroup: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-radio-group" {...props}>{children}</div>
  ),
  Sub: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-sub">{children}</div>,
  SubTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-sub-trigger">{children}</div>,
  SubContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-sub-content">{children}</div>,
}));

describe('DropdownMenu Components', () => {
  it('should render DropdownMenu correctly', () => {
    const { getByTestId } = render(
      <DropdownMenu>
        <div>Test Content</div>
      </DropdownMenu>
    );
    
    const root = getByTestId('dropdown-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveTextContent('Test Content');
  });

  it('should render DropdownMenuTrigger correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuTrigger>
        <button>Open Menu</button>
      </DropdownMenuTrigger>
    );
    
    const trigger = getByTestId('dropdown-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Open Menu');
  });

  it('should render DropdownMenuContent correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuContent>
        <p>Menu Content</p>
      </DropdownMenuContent>
    );
    
    const content = getByTestId('dropdown-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Menu Content');
  });

  it('should render DropdownMenuContent with custom className', () => {
    const { getByTestId } = render(
      <DropdownMenuContent className="custom-dropdown">
        <p>Menu Content</p>
      </DropdownMenuContent>
    );
    
    const content = getByTestId('dropdown-content');
    expect(content).toHaveClass('custom-dropdown');
  });

  it('should render DropdownMenuItem correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuItem>
        Menu Item
      </DropdownMenuItem>
    );
    
    const item = getByTestId('dropdown-item');
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent('Menu Item');
  });

  it('should render DropdownMenuCheckboxItem correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuCheckboxItem checked={true}>
        Checkbox Item
      </DropdownMenuCheckboxItem>
    );
    
    const checkboxItem = getByTestId('dropdown-checkbox-item');
    expect(checkboxItem).toBeInTheDocument();
    expect(checkboxItem).toHaveTextContent('Checkbox Item');
    expect(checkboxItem).toHaveAttribute('checked', 'true');
  });

  it('should render DropdownMenuRadioItem correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuRadioItem value="option1">
        Radio Item
      </DropdownMenuRadioItem>
    );
    
    const radioItem = getByTestId('dropdown-radio-item');
    expect(radioItem).toBeInTheDocument();
    expect(radioItem).toHaveTextContent('Radio Item');
    expect(radioItem).toHaveAttribute('value', 'option1');
  });

  it('should render DropdownMenuLabel correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuLabel>
        Menu Label
      </DropdownMenuLabel>
    );
    
    const label = getByTestId('dropdown-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Menu Label');
  });

  it('should render DropdownMenuSeparator correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuSeparator />
    );
    
    const separator = getByTestId('dropdown-separator');
    expect(separator).toBeInTheDocument();
  });

  it('should render DropdownMenuGroup correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuGroup>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenuGroup>
    );
    
    const group = getByTestId('dropdown-group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveTextContent('Item 1');
    expect(group).toHaveTextContent('Item 2');
  });

  it('should render DropdownMenuRadioGroup correctly', () => {
    const { getByTestId } = render(
      <DropdownMenuRadioGroup value="option1">
        <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    );
    
    const radioGroup = getByTestId('dropdown-radio-group');
    expect(radioGroup).toBeInTheDocument();
    expect(radioGroup).toHaveTextContent('Option 1');
    expect(radioGroup).toHaveTextContent('Option 2');
    expect(radioGroup).toHaveAttribute('value', 'option1');
  });

  it('should render a complete dropdown menu', () => {
    const { getByTestId } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button>Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={true}>
            Show Status
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    
    const root = getByTestId('dropdown-root');
    const trigger = getByTestId('dropdown-trigger');
    const content = getByTestId('dropdown-content');
    
    expect(root).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    
    expect(trigger).toHaveTextContent('Open Menu');
    expect(content).toHaveTextContent('My Account');
    expect(content).toHaveTextContent('Profile');
    expect(content).toHaveTextContent('Settings');
    expect(content).toHaveTextContent('Option 1');
    expect(content).toHaveTextContent('Option 2');
    expect(content).toHaveTextContent('Show Status');
  });
});
