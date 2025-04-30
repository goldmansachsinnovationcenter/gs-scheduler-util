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

jest.mock('@radix-ui/react-select', () => {
  return {
    Root: (props: any) => <div data-testid="select-root" {...props} />,
    Trigger: (props: any) => <button data-testid="select-trigger" {...props} />,
    Value: (props: any) => <span data-testid="select-value" {...props} />,
    Portal: (props: any) => <div data-testid="select-portal" {...props} />,
    Content: (props: any) => <div data-testid="select-content" {...props} />,
    Viewport: (props: any) => <div data-testid="select-viewport" {...props} />,
    Item: (props: any) => <div data-testid="select-item" {...props} />,
    ItemText: (props: any) => <span data-testid="select-item-text" {...props} />,
    ItemIndicator: (props: any) => <span data-testid="select-item-indicator" {...props} />,
    Label: (props: any) => <span data-testid="select-label" {...props} />,
    Separator: (props: any) => <div data-testid="select-separator" {...props} />,
    Group: (props: any) => <div data-testid="select-group" {...props} />,
    ScrollUpButton: (props: any) => <div data-testid="select-scroll-up-button" {...props} />,
    ScrollDownButton: (props: any) => <div data-testid="select-scroll-down-button" {...props} />,
    Icon: (props: any) => <span data-testid="select-icon" {...props} />,
  };
});

jest.mock('lucide-react', () => ({
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
  ChevronUpIcon: () => <div data-testid="chevron-up-icon" />,
  CheckIcon: () => <div data-testid="check-icon" />,
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
    
    it('should render with size prop', () => {
      const { getByTestId } = render(
        <SelectTrigger size="sm">
          <div>Trigger Content</div>
        </SelectTrigger>
      );
      
      const trigger = getByTestId('select-trigger');
      expect(trigger).toHaveAttribute('data-size', 'sm');
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

    it('should render with position prop', () => {
      const { getByTestId } = render(
        <SelectContent position="item-aligned">
          <div>Content</div>
        </SelectContent>
      );
      
      const content = getByTestId('select-content');
      expect(content).toHaveAttribute('position', 'item-aligned');
    });
  });

  describe('SelectItem', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <SelectItem value="option">Option Text</SelectItem>
      );
      
      const item = getByTestId('select-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('data-slot', 'select-item');
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
