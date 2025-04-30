import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AspectRatio } from '../aspect-ratio';

jest.mock('@radix-ui/react-aspect-ratio', () => ({
  Root: ({ children, ratio, ...props }: { children: React.ReactNode; ratio?: number }) => (
    <div data-testid="aspect-ratio" data-ratio={ratio} {...props}>
      {children}
    </div>
  ),
}));

describe('AspectRatio Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(
      <AspectRatio ratio={16 / 9}>
        <div>Content</div>
      </AspectRatio>
    );
    
    const aspectRatio = getByTestId('aspect-ratio');
    expect(aspectRatio).toBeInTheDocument();
    expect(aspectRatio).toHaveAttribute('data-ratio', '1.7777777777777777');
    expect(aspectRatio).toHaveTextContent('Content');
  });

  it('should render with different ratio', () => {
    const { getByTestId } = render(
      <AspectRatio ratio={4 / 3}>
        <div>Content</div>
      </AspectRatio>
    );
    
    const aspectRatio = getByTestId('aspect-ratio');
    expect(aspectRatio).toHaveAttribute('data-ratio', '1.3333333333333333');
  });

  it('should render with square ratio', () => {
    const { getByTestId } = render(
      <AspectRatio ratio={1}>
        <div>Content</div>
      </AspectRatio>
    );
    
    const aspectRatio = getByTestId('aspect-ratio');
    expect(aspectRatio).toHaveAttribute('data-ratio', '1');
  });

  it('should render with custom className', () => {
    const { getByTestId } = render(
      <AspectRatio ratio={16 / 9} className="custom-class">
        <div>Content</div>
      </AspectRatio>
    );
    
    const aspectRatio = getByTestId('aspect-ratio');
    expect(aspectRatio).toHaveClass('custom-class');
  });

  it('should render with image content', () => {
    const { getByTestId, getByAltText } = render(
      <AspectRatio ratio={16 / 9}>
        <img src="/test-image.jpg" alt="Test Image" />
      </AspectRatio>
    );
    
    const aspectRatio = getByTestId('aspect-ratio');
    const image = getByAltText('Test Image');
    
    expect(aspectRatio).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should render with video content', () => {
    const { getByTestId, getByTestId: getByTestIdAgain } = render(
      <AspectRatio ratio={16 / 9}>
        <video data-testid="test-video" src="/test-video.mp4" />
      </AspectRatio>
    );
    
    const aspectRatio = getByTestId('aspect-ratio');
    const video = getByTestIdAgain('test-video');
    
    expect(aspectRatio).toBeInTheDocument();
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/test-video.mp4');
  });
});
