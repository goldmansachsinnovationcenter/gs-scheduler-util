import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Switch } from '../switch';

describe('Switch Component Additional Tests', () => {
  it('should handle onChange event', () => {
    const handleChange = jest.fn();
    
    const { getByRole } = render(
      <Switch onChange={handleChange} />
    );
    
    const switchElement = getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle checked state', () => {
    const { getByRole } = render(
      <Switch checked={true} />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('should handle unchecked state', () => {
    const { getByRole } = render(
      <Switch checked={false} />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  it('should handle disabled state', () => {
    const { getByRole } = render(
      <Switch disabled />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  it('should handle required attribute', () => {
    const { getByRole } = render(
      <Switch required />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveAttribute('required');
  });

  it('should handle name attribute', () => {
    const { getByRole } = render(
      <Switch name="test-switch" />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveAttribute('name', 'test-switch');
  });

  it('should handle value attribute', () => {
    const { getByRole } = render(
      <Switch value="test-value" />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveAttribute('value', 'test-value');
  });

  it('should handle defaultChecked attribute', () => {
    const { getByRole } = render(
      <Switch defaultChecked />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('should toggle state when clicked', () => {
    const { getByRole } = render(
      <Switch defaultChecked={false} />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    
    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute('data-state', 'checked');
    
    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });
});
