import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ScrollArea,
  ScrollBar,
} from '../scroll-area';

jest.mock('@radix-ui/react-scroll-area', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="scroll-area-root" {...props}>
      {children}
    </div>
  ),
  Viewport: ({ children, ...props }: any) => (
    <div data-testid="scroll-area-viewport" {...props}>
      {children}
    </div>
  ),
  Scrollbar: ({ children, ...props }: any) => (
    <div data-testid="scroll-area-scrollbar" {...props}>
      {children}
    </div>
  ),
  Thumb: ({ ...props }: any) => (
    <div data-testid="scroll-area-thumb" {...props} />
  ),
  Corner: ({ ...props }: any) => (
    <div data-testid="scroll-area-corner" {...props} />
  ),
}));

describe('ScrollArea Components', () => {
  it('should render ScrollArea correctly', () => {
    const { getByTestId } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    
    const root = getByTestId('scroll-area-root');
    const viewport = getByTestId('scroll-area-viewport');
    
    expect(root).toBeInTheDocument();
    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveTextContent('Content');
  });

  it('should apply custom className to ScrollArea', () => {
    const { getByTestId } = render(
      <ScrollArea className="custom-scroll-area">
        <div>Content</div>
      </ScrollArea>
    );
    
    const root = getByTestId('scroll-area-root');
    expect(root).toHaveClass('custom-scroll-area');
  });

  it('should render ScrollBar correctly', () => {
    const { getByTestId } = render(
      <ScrollBar orientation="horizontal" />
    );
    
    const scrollbar = getByTestId('scroll-area-scrollbar');
    expect(scrollbar).toBeInTheDocument();
    expect(scrollbar).toHaveAttribute('orientation', 'horizontal');
  });

  it('should apply custom className to ScrollBar', () => {
    const { getByTestId } = render(
      <ScrollBar className="custom-scrollbar" orientation="vertical" />
    );
    
    const scrollbar = getByTestId('scroll-area-scrollbar');
    expect(scrollbar).toHaveClass('custom-scrollbar');
  });

  it('should render ScrollArea with type prop', () => {
    const { getByTestId } = render(
      <ScrollArea type="always">
        <div>Content</div>
      </ScrollArea>
    );
    
    const root = getByTestId('scroll-area-root');
    expect(root).toHaveAttribute('type', 'always');
  });

  it('should render ScrollArea with scrollHideDelay prop', () => {
    const { getByTestId } = render(
      <ScrollArea scrollHideDelay={1000}>
        <div>Content</div>
      </ScrollArea>
    );
    
    const root = getByTestId('scroll-area-root');
    expect(root).toHaveAttribute('scrollHideDelay', '1000');
  });

  it('should render ScrollBar with different orientation', () => {
    const { getByTestId } = render(
      <ScrollBar orientation="vertical" />
    );
    
    const scrollbar = getByTestId('scroll-area-scrollbar');
    expect(scrollbar).toHaveAttribute('orientation', 'vertical');
  });
});
