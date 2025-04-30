import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge, badgeVariants } from '../badge';

describe('Badge Component', () => {
  it('should render correctly with default variant', () => {
    const { getByText } = render(<Badge>Test Badge</Badge>);
    const badge = getByText('Test Badge');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-primary-foreground');
  });

  it('should apply secondary variant classes', () => {
    const { getByText } = render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = getByText('Secondary Badge');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-secondary');
    expect(badge).toHaveClass('text-secondary-foreground');
  });

  it('should apply destructive variant classes', () => {
    const { getByText } = render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badge = getByText('Destructive Badge');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-destructive');
    expect(badge).toHaveClass('text-destructive-foreground');
  });

  it('should apply outline variant classes', () => {
    const { getByText } = render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = getByText('Outline Badge');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-foreground');
  });

  it('should apply custom className', () => {
    const { getByText } = render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = getByText('Custom Badge');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('custom-class');
  });

  it('should pass additional props to the div element', () => {
    const { getByTestId } = render(
      <Badge data-testid="test-badge" id="badge-id">
        Test Badge
      </Badge>
    );
    
    const badge = getByTestId('test-badge');
    expect(badge).toHaveAttribute('id', 'badge-id');
  });
});
