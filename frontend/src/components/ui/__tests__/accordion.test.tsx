import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';

jest.mock('@radix-ui/react-accordion', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="accordion-root" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, value, ...props }: any) => (
    <div data-testid="accordion-item" data-value={value} {...props}>
      {children}
    </div>
  ),
  Header: ({ children, ...props }: any) => (
    <div data-testid="accordion-header" {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="accordion-trigger" {...props}>
      {children}
    </button>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="accordion-content" {...props}>
      {children}
    </div>
  ),
}));

describe('Accordion Components', () => {
  it('should render Accordion correctly', () => {
    const { getByTestId } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    const root = getByTestId('accordion-root');
    const item = getByTestId('accordion-item');
    const trigger = getByTestId('accordion-trigger');
    const content = getByTestId('accordion-content');
    
    expect(root).toBeInTheDocument();
    expect(item).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    
    expect(item).toHaveAttribute('data-value', 'item-1');
    expect(trigger).toHaveTextContent('Section 1');
    expect(content).toHaveTextContent('Content 1');
  });

  it('should render multiple AccordionItems', () => {
    const { getAllByTestId } = render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    const items = getAllByTestId('accordion-item');
    const triggers = getAllByTestId('accordion-trigger');
    const contents = getAllByTestId('accordion-content');
    
    expect(items.length).toBe(2);
    expect(triggers.length).toBe(2);
    expect(contents.length).toBe(2);
    
    expect(items[0]).toHaveAttribute('data-value', 'item-1');
    expect(items[1]).toHaveAttribute('data-value', 'item-2');
    expect(triggers[0]).toHaveTextContent('Section 1');
    expect(triggers[1]).toHaveTextContent('Section 2');
    expect(contents[0]).toHaveTextContent('Content 1');
    expect(contents[1]).toHaveTextContent('Content 2');
  });

  it('should apply custom className to AccordionTrigger', () => {
    const { getByTestId } = render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger className="custom-trigger">Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    const trigger = getByTestId('accordion-trigger');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('should apply custom className to AccordionContent', () => {
    const { getByTestId } = render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent className="custom-content">Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    const content = getByTestId('accordion-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should handle click on AccordionTrigger', () => {
    const { getByTestId } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    const trigger = getByTestId('accordion-trigger');
    fireEvent.click(trigger);
    
    expect(trigger).toBeInTheDocument();
  });

  it('should render nested content in AccordionContent', () => {
    const { getByTestId, getByText } = render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>
            <p>Paragraph 1</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    
    const content = getByTestId('accordion-content');
    expect(content).toContainElement(getByText('Paragraph 1'));
    expect(content).toContainElement(getByText('Item 1'));
    expect(content).toContainElement(getByText('Item 2'));
  });
});
