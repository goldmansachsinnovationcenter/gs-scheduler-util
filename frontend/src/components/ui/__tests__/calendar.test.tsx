import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Calendar } from '../calendar';
import { DayPicker } from 'react-day-picker';

jest.mock('react-day-picker', () => ({
  DayPicker: jest.fn(({ className, classNames, showOutsideDays, components, ...props }) => (
    <div data-testid="day-picker" className={className}>
      <div data-testid="months" className={classNames?.months}></div>
      <div data-testid="month" className={classNames?.month}></div>
      <div data-testid="caption" className={classNames?.caption}></div>
      <div data-testid="nav" className={classNames?.nav}></div>
      <div data-testid="table" className={classNames?.table}></div>
      <div data-testid="head_row" className={classNames?.head_row}></div>
      <div data-testid="row" className={classNames?.row}></div>
      <div data-testid="cell" className={classNames?.cell}></div>
      <div data-testid="day" className={classNames?.day}></div>
      {components?.IconLeft && <components.IconLeft data-testid="icon-left" />}
      {components?.IconRight && <components.IconRight data-testid="icon-right" />}
    </div>
  )),
}));

jest.mock('lucide-react', () => ({
  ChevronLeft: jest.fn(({ className, ...props }) => (
    <svg data-testid="chevron-left" className={className} {...props} />
  )),
  ChevronRight: jest.fn(({ className, ...props }) => (
    <svg data-testid="chevron-right" className={className} {...props} />
  )),
}));

describe('Calendar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByTestId } = render(<Calendar />);
    const dayPicker = getByTestId('day-picker');
    
    expect(dayPicker).toBeInTheDocument();
    expect(dayPicker).toHaveClass('p-3');
  });

  it('should pass showOutsideDays prop to DayPicker', () => {
    render(<Calendar showOutsideDays={false} />);
    
    expect(DayPicker).toHaveBeenCalledWith(
      expect.objectContaining({
        showOutsideDays: false,
      }),
      expect.anything()
    );
  });

  it('should merge custom className with default className', () => {
    const { getByTestId } = render(<Calendar className="custom-class" />);
    const dayPicker = getByTestId('day-picker');
    
    expect(dayPicker).toHaveClass('p-3');
    expect(dayPicker).toHaveClass('custom-class');
  });

  it('should provide correct classNames to DayPicker', () => {
    const { getByTestId } = render(<Calendar />);
    
    expect(getByTestId('months')).toHaveClass('flex flex-col sm:flex-row gap-2');
    expect(getByTestId('month')).toHaveClass('flex flex-col gap-4');
    expect(getByTestId('caption')).toHaveClass('flex justify-center pt-1 relative items-center w-full');
    expect(getByTestId('nav')).toHaveClass('flex items-center gap-1');
    expect(getByTestId('table')).toHaveClass('w-full border-collapse space-x-1');
    expect(getByTestId('head_row')).toHaveClass('flex');
    expect(getByTestId('row')).toHaveClass('flex w-full mt-2');
  });

  it('should merge custom classNames with default classNames', () => {
    const customClassNames = {
      months: 'custom-months',
      month: 'custom-month',
    };
    
    render(<Calendar classNames={customClassNames} />);
    
    expect(DayPicker).toHaveBeenCalledWith(
      expect.objectContaining({
        classNames: expect.objectContaining({
          months: 'custom-months',
          month: 'custom-month',
          caption: 'flex justify-center pt-1 relative items-center w-full',
        }),
      }),
      expect.anything()
    );
  });

  it('should provide IconLeft and IconRight components', () => {
    const { getByTestId } = render(<Calendar />);
    
    expect(getByTestId('icon-left')).toBeInTheDocument();
    expect(getByTestId('icon-right')).toBeInTheDocument();
  });

  it('should apply different cell classes based on mode prop', () => {
    render(<Calendar mode="range" />);
    
    expect(DayPicker).toHaveBeenCalledWith(
      expect.objectContaining({
        classNames: expect.objectContaining({
          cell: expect.stringContaining('[&:has(>.day-range-end)]:rounded-r-md'),
        }),
      }),
      expect.anything()
    );
  });

  it('should pass additional props to DayPicker', () => {
    const selected = new Date();
    render(<Calendar selected={selected} />);
    
    expect(DayPicker).toHaveBeenCalledWith(
      expect.objectContaining({
        selected,
      }),
      expect.anything()
    );
  });
});
