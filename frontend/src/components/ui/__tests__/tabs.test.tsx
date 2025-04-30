import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs Components', () => {
  it('should render Tabs correctly', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );
    
    const tabs = container.querySelector('[data-slot="tabs"]');
    expect(tabs).toBeInTheDocument();
    expect(tabs).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('should apply custom className to Tabs', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabs = container.querySelector('[data-slot="tabs"]');
    expect(tabs).toHaveClass('custom-tabs');
  });

  it('should render TabsList correctly', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsList = container.querySelector('[data-slot="tabs-list"]');
    expect(tabsList).toBeInTheDocument();
    expect(tabsList).toHaveAttribute('role', 'tablist');
    expect(tabsList).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('should apply custom className to TabsList', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsList = container.querySelector('[data-slot="tabs-list"]');
    expect(tabsList).toHaveClass('custom-tabs-list');
  });

  it('should render TabsTrigger correctly', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsTrigger = container.querySelector('[data-slot="tabs-trigger"]');
    expect(tabsTrigger).toBeInTheDocument();
    expect(tabsTrigger).toHaveAttribute('role', 'tab');
    expect(tabsTrigger).toHaveAttribute('aria-selected', 'true');
    expect(tabsTrigger).toHaveTextContent('Tab 1');
  });

  it('should apply custom className to TabsTrigger', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsTrigger = container.querySelector('[data-slot="tabs-trigger"]');
    expect(tabsTrigger).toHaveClass('custom-trigger');
  });

  it('should render TabsContent correctly', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsContent = container.querySelector('[data-slot="tabs-content"]');
    expect(tabsContent).toBeInTheDocument();
    expect(tabsContent).toHaveAttribute('role', 'tabpanel');
    expect(tabsContent).toHaveTextContent('Tab 1 Content');
  });

  it('should apply custom className to TabsContent', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsContent = container.querySelector('[data-slot="tabs-content"]');
    expect(tabsContent).toHaveClass('custom-content');
  });

  it('should switch tabs when clicking on a different tab', () => {
    const { container, getByText } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );
    
    const tab1Content = getByText('Tab 1 Content');
    expect(tab1Content).toBeVisible();
    
    const tab2Content = getByText('Tab 2 Content');
    expect(tab2Content).not.toBeVisible();
    
    const tab2Trigger = getByText('Tab 2');
    fireEvent.click(tab2Trigger);
    
    expect(tab2Content).toBeVisible();
    
    expect(tab1Content).not.toBeVisible();
  });

  it('should handle disabled tabs', () => {
    const { getByText } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );
    
    const tab2Trigger = getByText('Tab 2');
    expect(tab2Trigger).toHaveAttribute('disabled', '');
    
    const tab1Content = getByText('Tab 1 Content');
    expect(tab1Content).toBeVisible();
    
    const tab2Content = getByText('Tab 2 Content');
    expect(tab2Content).not.toBeVisible();
    
    fireEvent.click(tab2Trigger);
    
    expect(tab1Content).toBeVisible();
    
    expect(tab2Content).not.toBeVisible();
  });
});
