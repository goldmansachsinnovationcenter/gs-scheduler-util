import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionRedirect from '../page';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '123' })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  })),
}));

describe('ExecutionRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to executions page with id parameter', () => {
    const mockPush = jest.fn();
    (require('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (require('next/navigation').useParams as jest.Mock).mockReturnValue({ id: '123' });

    render(<ExecutionRedirect />);
    
    expect(mockPush).toHaveBeenCalledWith('/executions?id=123');
  });

  it('should redirect to executions page without id parameter when id is not provided', () => {
    const mockPush = jest.fn();
    (require('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (require('next/navigation').useParams as jest.Mock).mockReturnValue({});

    render(<ExecutionRedirect />);
    
    expect(mockPush).toHaveBeenCalledWith('/executions');
  });

  it('should return null', () => {
    const { container } = render(<ExecutionRedirect />);
    expect(container.firstChild).toBeNull();
  });
});
