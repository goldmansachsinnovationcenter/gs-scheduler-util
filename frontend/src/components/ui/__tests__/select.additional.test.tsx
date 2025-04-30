import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from '../select';

jest.mock('@radix-ui/react-select', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="select-root" {...props}>
      {children}
    </div>
  ),
  Group: ({ children, ...props }: any) => (
    <div data-testid="select-group" {...props}>
      {children}
    </div>
  ),
  Value: ({ children, ...props }: any) => (
    <div data-testid="select-value" {...props}>
      {children}
    </div>
  ),
  Trigger: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <button data-testid="select-trigger" ref={ref} {...props}>
      {children}
    </button>
  )),
  Portal: ({ children, ...props }: any) => (
    <div data-testid="select-portal" {...props}>
      {children}
    </div>
  ),
  Content: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="select-content" ref={ref} {...props}>
      {children}
    </div>
  )),
  Viewport: ({ children, ...props }: any) => (
    <div data-testid="select-viewport" {...props}>
      {children}
    </div>
  ),
  Item: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="select-item" ref={ref} {...props}>
      {children}
    </div>
  )),
  ItemText: ({ children, ...props }: any) => (
    <span data-testid="select-item-text" {...props}>
      {children}
    </span>
  ),
  ItemIndicator: ({ children, ...props }: any) => (
    <span data-testid="select-item-indicator" {...props}>
      {children}
    </span>
  ),
  Label: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="select-label" ref={ref} {...props}>
      {children}
    </div>
  )),
  Separator: React.forwardRef(({ ...props }: any, ref: any) => (
    <div data-testid="select-separator" ref={ref} {...props} />
  )),
  ScrollUpButton: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="select-scroll-up-button" ref={ref} {...props}>
      {children}
    </div>
  )),
  ScrollDownButton: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="select-scroll-down-button" ref={ref} {...props}>
      {children}
    </div>
  )),
}));

jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />,
}));

describe('Select Components', () => {
  it('should render SelectTrigger with custom className', () => {
    const { getByTestId } = render(
      <SelectTrigger className="custom-trigger">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
    );
    
    const trigger = getByTestId('select-trigger');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('should render SelectContent with custom className', () => {
    const { getByTestId } = render(
      <SelectContent className="custom-content">
        <SelectItem value="option">Option</SelectItem>
      </SelectContent>
    );
    
    const content = getByTestId('select-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should render SelectContent with position prop', () => {
    const { getByTestId } = render(
      <SelectContent position="item-aligned">
        <SelectItem value="option">Option</SelectItem>
      </SelectContent>
    );
    
    const content = getByTestId('select-content');
    expect(content).toHaveAttribute('position', 'item-aligned');
  });

  it('should render SelectLabel with custom className', () => {
    const { getByTestId } = render(
      <SelectLabel className="custom-label">Category</SelectLabel>
    );
    
    const label = getByTestId('select-label');
    expect(label).toHaveClass('custom-label');
    expect(label).toHaveTextContent('Category');
  });

  it('should render SelectItem with custom className', () => {
    const { getByTestId } = render(
      <SelectItem className="custom-item" value="option">Option</SelectItem>
    );
    
    const item = getByTestId('select-item');
    expect(item).toHaveClass('custom-item');
    expect(item).toHaveAttribute('value', 'option');
  });

  it('should render SelectSeparator with custom className', () => {
    const { getByTestId } = render(
      <SelectSeparator className="custom-separator" />
    );
    
    const separator = getByTestId('select-separator');
    expect(separator).toHaveClass('custom-separator');
  });

  it('should render SelectScrollUpButton with custom className', () => {
    const { getByTestId } = render(
      <SelectScrollUpButton className="custom-scroll-up" />
    );
    
    const scrollUpButton = getByTestId('select-scroll-up-button');
    expect(scrollUpButton).toHaveClass('custom-scroll-up');
  });

  it('should render SelectScrollDownButton with custom className', () => {
    const { getByTestId } = render(
      <SelectScrollDownButton className="custom-scroll-down" />
    );
    
    const scrollDownButton = getByTestId('select-scroll-down-button');
    expect(scrollDownButton).toHaveClass('custom-scroll-down');
  });

  it('should render complete Select with all components', () => {
    const { getByTestId, getAllByTestId } = render(
      <Select defaultValue="option1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton />
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="option1">Apple</SelectItem>
            <SelectItem value="option2">Banana</SelectItem>
            <SelectItem value="option3">Orange</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="option4">Carrot</SelectItem>
            <SelectItem value="option5">Broccoli</SelectItem>
          </SelectGroup>
          <SelectScrollDownButton />
        </SelectContent>
      </Select>
    );
    
    expect(getByTestId('select-root')).toBeInTheDocument();
    expect(getByTestId('select-trigger')).toBeInTheDocument();
    expect(getByTestId('select-value')).toBeInTheDocument();
    expect(getByTestId('select-content')).toBeInTheDocument();
    expect(getByTestId('select-scroll-up-button')).toBeInTheDocument();
    expect(getAllByTestId('select-group').length).toBe(2);
    expect(getAllByTestId('select-label').length).toBe(2);
    expect(getAllByTestId('select-item').length).toBe(5);
    expect(getByTestId('select-separator')).toBeInTheDocument();
    expect(getByTestId('select-scroll-down-button')).toBeInTheDocument();
  });
});
