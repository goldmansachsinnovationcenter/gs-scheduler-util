import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  RadioGroup,
  RadioGroupItem,
} from '../radio-group';

jest.mock('@radix-ui/react-radio-group', () => ({
  Root: jest.fn(({ children, ...props }) => (
    <div data-testid="radio-group-root" {...props}>
      {children}
    </div>
  )),
  Item: jest.fn(({ children, ...props }) => (
    <button data-testid="radio-group-item" {...props}>
      {children}
    </button>
  )),
  Indicator: jest.fn(({ children, ...props }) => (
    <span data-testid="radio-group-indicator" {...props}>
      {children}
    </span>
  )),
}));

jest.mock('lucide-react', () => ({
  Circle: jest.fn(() => <div data-testid="circle-icon" />),
}));

describe('RadioGroup Components', () => {
  describe('RadioGroup', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <RadioGroup>
          <div>Radio Group Content</div>
        </RadioGroup>
      );
      
      const radioGroup = getByTestId('radio-group-root');
      expect(radioGroup).toBeInTheDocument();
      expect(radioGroup).toHaveAttribute('data-slot', 'radio-group');
      expect(radioGroup).toHaveClass('grid gap-2');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <RadioGroup className="custom-class">
          <div>Radio Group Content</div>
        </RadioGroup>
      );
      
      const radioGroup = getByTestId('radio-group-root');
      expect(radioGroup).toHaveClass('custom-class');
    });

    it('should pass additional props to the root element', () => {
      const { getByTestId } = render(
        <RadioGroup data-testid="test-radio-group" id="radio-group-id">
          <div>Radio Group Content</div>
        </RadioGroup>
      );
      
      const radioGroup = getByTestId('radio-group-root');
      expect(radioGroup).toHaveAttribute('id', 'radio-group-id');
      expect(radioGroup).toHaveAttribute('data-testid', 'test-radio-group');
    });
  });

  describe('RadioGroupItem', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        <RadioGroupItem value="option">
          <div>Radio Item Content</div>
        </RadioGroupItem>
      );
      
      const radioItem = getByTestId('radio-group-item');
      expect(radioItem).toBeInTheDocument();
      expect(radioItem).toHaveAttribute('data-slot', 'radio-item');
      expect(radioItem).toHaveClass('aspect-square h-4 w-4 rounded-full');
      expect(radioItem).toHaveAttribute('value', 'option');
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <RadioGroupItem value="option" className="custom-class">
          <div>Radio Item Content</div>
        </RadioGroupItem>
      );
      
      const radioItem = getByTestId('radio-group-item');
      expect(radioItem).toHaveClass('custom-class');
    });

    it('should pass additional props to the item element', () => {
      const { getByTestId } = render(
        <RadioGroupItem value="option" data-testid="test-radio-item" id="radio-item-id">
          <div>Radio Item Content</div>
        </RadioGroupItem>
      );
      
      const radioItem = getByTestId('radio-group-item');
      expect(radioItem).toHaveAttribute('id', 'radio-item-id');
      expect(radioItem).toHaveAttribute('data-testid', 'test-radio-item');
    });

    it('should render the indicator', () => {
      const { getByTestId } = render(
        <RadioGroupItem value="option">
          <div>Radio Item Content</div>
        </RadioGroupItem>
      );
      
      const indicator = getByTestId('radio-group-indicator');
      expect(indicator).toBeInTheDocument();
      
      const circleIcon = getByTestId('circle-icon');
      expect(circleIcon).toBeInTheDocument();
    });
  });

  describe('RadioGroup with RadioGroupItems', () => {
    it('should render a complete radio group with items', () => {
      const { getByTestId, getAllByTestId } = render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
          <RadioGroupItem value="option3" />
        </RadioGroup>
      );
      
      const radioGroup = getByTestId('radio-group-root');
      expect(radioGroup).toBeInTheDocument();
      
      const radioItems = getAllByTestId('radio-group-item');
      expect(radioItems).toHaveLength(3);
      expect(radioItems[0]).toHaveAttribute('value', 'option1');
      expect(radioItems[1]).toHaveAttribute('value', 'option2');
      expect(radioItems[2]).toHaveAttribute('value', 'option3');
    });
  });
});
