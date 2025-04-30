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

type MockComponentProps = {
  children?: React.ReactNode;
  [key: string]: any;
};

jest.mock('@radix-ui/react-select', () => {
  const createMockComponent = <T extends HTMLElement>(name: string, element: keyof JSX.IntrinsicElements) => {
    return React.forwardRef<T, MockComponentProps>(
      ({ children, ...props }, ref) => {
        return React.createElement(
          element,
          { 
            ref, 
            'data-testid': `select-${name.toLowerCase()}`, 
            ...props 
          },
          children
        );
      }
    );
  };

  return {
    Root: createMockComponent<HTMLDivElement>('root', 'div'),
    Trigger: createMockComponent<HTMLButtonElement>('trigger', 'button'),
    Value: createMockComponent<HTMLSpanElement>('value', 'span'),
    Portal: createMockComponent<HTMLDivElement>('portal', 'div'),
    Content: createMockComponent<HTMLDivElement>('content', 'div'),
    Viewport: createMockComponent<HTMLDivElement>('viewport', 'div'),
    Item: createMockComponent<HTMLDivElement>('item', 'div'),
    ItemText: createMockComponent<HTMLSpanElement>('item-text', 'span'),
    ItemIndicator: createMockComponent<HTMLSpanElement>('item-indicator', 'span'),
    Label: createMockComponent<HTMLSpanElement>('label', 'span'),
    Separator: createMockComponent<HTMLDivElement>('separator', 'div'),
    Group: createMockComponent<HTMLDivElement>('group', 'div'),
    ScrollUpButton: createMockComponent<HTMLDivElement>('scroll-up-button', 'div'),
    ScrollDownButton: createMockComponent<HTMLDivElement>('scroll-down-button', 'div'),
    Icon: React.forwardRef<HTMLSpanElement, MockComponentProps & { asChild?: boolean }>(
      ({ children, asChild, ...props }, ref) => (
        <span ref={ref} data-testid="select-icon" {...props}>
          {asChild ? children : <div data-testid="default-icon" />}
        </span>
      )
    ),
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
