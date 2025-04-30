import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../select';

jest.mock('@radix-ui/react-select', () => ({
  Root: jest.fn(({ children, ...props }) => (
    <div data-testid="select-root" {...props}>
      {children}
    </div>
  )),
  Trigger: jest.fn(({ children, ...props }) => (
    <button data-testid="select-trigger" {...props}>
      {children}
    </button>
  )),
  Value: jest.fn(({ children, ...props }) => (
    <span data-testid="select-value" {...props}>
      {children}
    </span>
  )),
  Portal: jest.fn(({ children, ...props }) => (
    <div data-testid="select-portal" {...props}>
      {children}
    </div>
  )),
  Content: jest.fn(({ children, ...props }) => (
    <div data-testid="select-content" {...props}>
      {children}
    </div>
  )),
  Viewport: jest.fn(({ children, ...props }) => (
    <div data-testid="select-viewport" {...props}>
      {children}
    </div>
  )),
  Item: jest.fn(({ children, ...props }) => (
    <div data-testid="select-item" {...props}>
      {children}
    </div>
  )),
  ItemText: jest.fn(({ children, ...props }) => (
    <span data-testid="select-item-text" {...props}>
      {children}
    </span>
  )),
  ItemIndicator: jest.fn(({ children, ...props }) => (
    <span data-testid="select-item-indicator" {...props}>
      {children}
    </span>
  )),
  Label: jest.fn(({ children, ...props }) => (
    <span data-testid="select-label" {...props}>
      {children}
    </span>
  )),
  Separator: jest.fn(({ ...props }) => (
    <div data-testid="select-separator" {...props} />
  )),
  Group: jest.fn(({ children, ...props }) => (
    <div data-testid="select-group" {...props}>
      {children}
    </div>
  )),
  ScrollUpButton: jest.fn(({ children, ...props }) => (
    <div data-testid="select-scroll-up-button" {...props}>
      {children}
    </div>
  )),
  ScrollDownButton: jest.fn(({ children, ...props }) => (
    <div data-testid="select-scroll-down-button" {...props}>
      {children}
    </div>
  )),
}));

jest.mock('lucide-react', () => ({
  ChevronDown: jest.fn(() => <div data-testid="chevron-down-icon" />),
  Check: jest.fn(() => <div data-testid="check-icon" />),
}));

describe('Select Components', () => {
  describe('Select', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <Select>
          <div>Select Content</div>
        </Select>
      );
      
      const select = getByTestId('select-root');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('data-slot', 'select');
    });
  });

  describe('SelectTrigger', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <SelectTrigger>
          <div>Trigger Content</div>
        </SelectTrigger>
      );
      
      const trigger = getByTestId('select-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
      expect(trigger).toHaveClass('flex h-9 w-full items-center justify-between');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <SelectTrigger className="custom-class">
          <div>Trigger Content</div>
        </SelectTrigger>
      );
      
      const trigger = getByTestId('select-trigger');
      expect(trigger).toHaveClass('custom-class');
    });
  });

  describe('SelectValue', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <SelectValue>Value Text</SelectValue>
      );
      
      const value = getByTestId('select-value');
      expect(value).toBeInTheDocument();
      expect(value).toHaveAttribute('data-slot', 'select-value');
      expect(value).toHaveTextContent('Value Text');
    });

    it('should apply placeholder', () => {
      const { getByTestId } = render(
        <SelectValue placeholder="Select an option" />
      );
      
      const value = getByTestId('select-value');
      expect(value).toHaveAttribute('placeholder', 'Select an option');
    });
  });

  describe('SelectContent', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <SelectContent>
          <div>Content</div>
        </SelectContent>
      );
      
      const portal = getByTestId('select-portal');
      const content = getByTestId('select-content');
      
      expect(portal).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'select-content');
      expect(content).toHaveClass('bg-popover');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <SelectContent className="custom-class">
          <div>Content</div>
        </SelectContent>
      );
      
      const content = getByTestId('select-content');
      expect(content).toHaveClass('custom-class');
    });

    it('should render scroll buttons', () => {
      const { getByTestId } = render(
        <SelectContent>
          <div>Content</div>
        </SelectContent>
      );
      
      const scrollUpButton = getByTestId('select-scroll-up-button');
      const scrollDownButton = getByTestId('select-scroll-down-button');
      
      expect(scrollUpButton).toBeInTheDocument();
      expect(scrollDownButton).toBeInTheDocument();
    });
  });

  describe('SelectItem', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <SelectItem value="option">Option Text</SelectItem>
      );
      
      const item = getByTestId('select-item');
      const itemText = getByTestId('select-item-text');
      
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('data-slot', 'select-item');
      expect(item).toHaveClass('flex cursor-default select-none items-center');
      expect(itemText).toBeInTheDocument();
      expect(itemText).toHaveTextContent('Option Text');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <SelectItem value="option" className="custom-class">
          Option Text
        </SelectItem>
      );
      
      const item = getByTestId('select-item');
      expect(item).toHaveClass('custom-class');
    });
  });

  describe('SelectGroup', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <SelectGroup>
          <div>Group Content</div>
        </SelectGroup>
      );
      
      const group = getByTestId('select-group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('data-slot', 'select-group');
    });
  });

  describe('SelectLabel', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <SelectLabel>Label Text</SelectLabel>
      );
      
      const label = getByTestId('select-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('data-slot', 'select-label');
      expect(label).toHaveClass('px-2 py-1.5 text-sm font-semibold');
      expect(label).toHaveTextContent('Label Text');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <SelectLabel className="custom-class">Label Text</SelectLabel>
      );
      
      const label = getByTestId('select-label');
      expect(label).toHaveClass('custom-class');
    });
  });

  describe('SelectSeparator', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(<SelectSeparator />);
      
      const separator = getByTestId('select-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('data-slot', 'select-separator');
      expect(separator).toHaveClass('-mx-1 my-1 h-px bg-muted');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <SelectSeparator className="custom-class" />
      );
      
      const separator = getByTestId('select-separator');
      expect(separator).toHaveClass('custom-class');
    });
  });
});
