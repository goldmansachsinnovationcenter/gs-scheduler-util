import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Slider } from '../slider';

jest.mock('@radix-ui/react-slider', () => ({
  Root: ({ children, ...props }: any) => (
    <div data-testid="slider-root" {...props}>
      {children}
    </div>
  ),
  Track: ({ children, ...props }: any) => (
    <div data-testid="slider-track" {...props}>
      {children}
    </div>
  ),
  Range: ({ ...props }: any) => (
    <div data-testid="slider-range" {...props} />
  ),
  Thumb: ({ ...props }: any) => (
    <div data-testid="slider-thumb" {...props} />
  ),
}));

describe('Slider Component', () => {
  it('should render slider correctly', () => {
    const { getByTestId } = render(<Slider />);
    
    const root = getByTestId('slider-root');
    const track = getByTestId('slider-track');
    const range = getByTestId('slider-range');
    const thumb = getByTestId('slider-thumb');
    
    expect(root).toBeInTheDocument();
    expect(track).toBeInTheDocument();
    expect(range).toBeInTheDocument();
    expect(thumb).toBeInTheDocument();
  });

  it('should apply custom className to slider root', () => {
    const { getByTestId } = render(<Slider className="custom-slider" />);
    
    const root = getByTestId('slider-root');
    expect(root).toHaveClass('custom-slider');
  });

  it('should pass props to slider root', () => {
    const { getByTestId } = render(
      <Slider defaultValue={[50]} min={0} max={100} step={1} />
    );
    
    const root = getByTestId('slider-root');
    expect(root).toHaveAttribute('defaultValue', '[50]');
    expect(root).toHaveAttribute('min', '0');
    expect(root).toHaveAttribute('max', '100');
    expect(root).toHaveAttribute('step', '1');
  });

  it('should render multiple thumbs when multiple values are provided', () => {
    const { getAllByTestId } = render(
      <Slider defaultValue={[25, 75]} />
    );
    
    const thumbs = getAllByTestId('slider-thumb');
    expect(thumbs.length).toBe(2);
  });

  it('should render disabled slider', () => {
    const { getByTestId } = render(<Slider disabled />);
    
    const root = getByTestId('slider-root');
    expect(root).toHaveAttribute('disabled', 'true');
  });

  it('should render with orientation', () => {
    const { getByTestId } = render(<Slider orientation="vertical" />);
    
    const root = getByTestId('slider-root');
    expect(root).toHaveAttribute('orientation', 'vertical');
  });

  it('should render with aria-label', () => {
    const { getByTestId } = render(<Slider aria-label="Volume" />);
    
    const root = getByTestId('slider-root');
    expect(root).toHaveAttribute('aria-label', 'Volume');
  });
});
