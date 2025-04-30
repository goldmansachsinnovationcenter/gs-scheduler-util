import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../tabs';

jest.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, defaultValue, value, onValueChange, ...props }: any) => (
    <div 
      data-testid="tabs-root" 
      data-value={value || defaultValue}
      {...props}
    >
      {children}
    </div>
  ),
  List: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="tabs-list" {...props}>
      {children}
    </div>
  )),
  Trigger: React.forwardRef(({ children, value, ...props }: any, ref: any) => (
    <button 
      ref={ref}
      data-testid="tabs-trigger" 
      data-value={value}
      data-state={props['data-state'] || 'inactive'}
      {...props}
    >
      {children}
    </button>
  )),
  Content: React.forwardRef(({ children, value, ...props }: any, ref: any) => (
    <div 
      ref={ref}
      data-testid="tabs-content" 
      data-value={value}
      data-state={props['data-state'] || 'inactive'}
      {...props}
    >
      {children}
    </div>
  )),
}));

describe('Tabs Components', () => {
  it('should render Tabs correctly', () => {
    const { getByTestId } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    const tabsRoot = getByTestId('tabs-root');
    expect(tabsRoot).toBeInTheDocument();
    expect(tabsRoot).toHaveAttribute('data-value', 'tab1');
  });

  it('should render Tabs with custom className', () => {
    const { getByTestId } = render(
      <Tabs className="custom-tabs" defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    
    const tabsRoot = getByTestId('tabs-root');
    expect(tabsRoot).toHaveClass('custom-tabs');
  });

  it('should render TabsList with custom className', () => {
    const { getByTestId } = render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    
    const tabsList = getByTestId('tabs-list');
    expect(tabsList).toHaveClass('custom-tabs-list');
  });

  it('should render TabsTrigger with custom className', () => {
    const { getAllByTestId } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-tabs-trigger">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    
    const tabsTrigger = getAllByTestId('tabs-trigger')[0];
    expect(tabsTrigger).toHaveClass('custom-tabs-trigger');
    expect(tabsTrigger).toHaveTextContent('Tab 1');
  });

  it('should render TabsContent with custom className', () => {
    const { getAllByTestId } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-tabs-content">Content 1</TabsContent>
      </Tabs>
    );
    
    const tabsContent = getAllByTestId('tabs-content')[0];
    expect(tabsContent).toHaveClass('custom-tabs-content');
    expect(tabsContent).toHaveTextContent('Content 1');
  });

  it('should handle value prop', () => {
    const { getByTestId } = render(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    const tabsRoot = getByTestId('tabs-root');
    expect(tabsRoot).toHaveAttribute('data-value', 'tab2');
  });

  it('should handle defaultValue prop', () => {
    const { getByTestId } = render(
      <Tabs defaultValue="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    const tabsRoot = getByTestId('tabs-root');
    expect(tabsRoot).toHaveAttribute('data-value', 'tab2');
  });

  it('should handle orientation prop', () => {
    const { getByTestId } = render(
      <Tabs orientation="vertical" defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    
    const tabsRoot = getByTestId('tabs-root');
    expect(tabsRoot).toHaveAttribute('orientation', 'vertical');
  });

  it('should handle dir prop', () => {
    const { getByTestId } = render(
      <Tabs dir="rtl" defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    
    const tabsRoot = getByTestId('tabs-root');
    expect(tabsRoot).toHaveAttribute('dir', 'rtl');
  });

  it('should handle activationMode prop', () => {
    const { getByTestId } = render(
      <Tabs activationMode="manual" defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    
    const tabsRoot = getByTestId('tabs-root');
    expect(tabsRoot).toHaveAttribute('activationMode', 'manual');
  });
});
