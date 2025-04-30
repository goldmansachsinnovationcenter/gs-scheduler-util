import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
    expect(screen.queryByText('Tab 2 Content')).not.toBeVisible();
  });

  it('switches tabs when clicked', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );
    
    const tab2 = screen.getByRole('tab', { name: /tab 2/i });
    fireEvent.click(tab2);
    
    expect(screen.queryByText('Tab 1 Content')).not.toBeVisible();
    expect(screen.getByText('Tab 2 Content')).toBeVisible();
  });

  it('applies custom className to Tabs component', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs-class">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsElement = screen.getByRole('tablist').parentElement;
    expect(tabsElement).toHaveClass('custom-tabs-class');
  });

  it('applies custom className to TabsList component', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-tabslist-class">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const tabsListElement = screen.getByRole('tablist');
    expect(tabsListElement).toHaveClass('custom-tabslist-class');
  });

  it('applies custom className to TabsTrigger component', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger-class">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const triggerElement = screen.getByRole('tab', { name: /tab 1/i });
    expect(triggerElement).toHaveClass('custom-trigger-class');
  });

  it('applies custom className to TabsContent component', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content-class">Tab 1 Content</TabsContent>
      </Tabs>
    );
    
    const contentElement = screen.getByText('Tab 1 Content').parentElement;
    expect(contentElement).toHaveClass('custom-content-class');
  });

  it('disables a tab when disabled prop is true', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );
    
    const disabledTab = screen.getByRole('tab', { name: /tab 2/i });
    expect(disabledTab).toBeDisabled();
  });
});
