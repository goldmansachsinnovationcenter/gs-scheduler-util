import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';

describe('Avatar Components', () => {
  it('should render Avatar correctly', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const avatar = container.querySelector('[data-slot="avatar"]');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full');
  });

  it('should render Avatar with custom className', () => {
    const { container } = render(
      <Avatar className="custom-avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const avatar = container.querySelector('[data-slot="avatar"]');
    expect(avatar).toHaveClass('custom-avatar');
  });

  it('should render AvatarImage correctly', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/test.jpg" alt="Test User" />
      </Avatar>
    );
    
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test.jpg');
    expect(image).toHaveAttribute('alt', 'Test User');
  });

  it('should render AvatarFallback correctly', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const fallback = container.querySelector('[data-slot="avatar-fallback"]');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent('JD');
  });

  it('should render AvatarFallback with custom className', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback className="custom-fallback">JD</AvatarFallback>
      </Avatar>
    );
    
    const fallback = container.querySelector('[data-slot="avatar-fallback"]');
    expect(fallback).toHaveClass('custom-fallback');
  });

  it('should render a complete avatar with image and fallback', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/test.jpg" alt="Test User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const avatar = container.querySelector('[data-slot="avatar"]');
    const image = container.querySelector('img');
    const fallback = container.querySelector('[data-slot="avatar-fallback"]');
    
    expect(avatar).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(fallback).toBeInTheDocument();
    
    expect(image).toHaveAttribute('src', '/test.jpg');
    expect(image).toHaveAttribute('alt', 'Test User');
    expect(fallback).toHaveTextContent('JD');
  });
});
