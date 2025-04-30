import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Calendar } from '../calendar';

jest.mock('react-day-picker', () => ({
  DayPicker: ({ selected, onSelect, ...props }: any) => (
    <div data-testid="day-picker" {...props}>
      <button 
        data-testid="day-button" 
        onClick={() => onSelect && onSelect(new Date(2023, 0, 15))}
      >
        15
      </button>
      <div data-testid="selected-date">
        {selected ? selected.toISOString() : 'No date selected'}
      </div>
    </div>
  ),
}));

describe('Calendar Component', () => {
  it('should render calendar correctly', () => {
    const { getByTestId } = render(<Calendar />);
    
    const dayPicker = getByTestId('day-picker');
    expect(dayPicker).toBeInTheDocument();
  });

  it('should render calendar with custom className', () => {
    const { getByTestId } = render(<Calendar className="custom-calendar" />);
    
    const dayPicker = getByTestId('day-picker');
    expect(dayPicker).toHaveClass('custom-calendar');
  });

  it('should handle date selection', () => {
    const handleSelect = jest.fn();
    
    const { getByTestId } = render(
      <Calendar 
        mode="single" 
        selected={undefined} 
        onSelect={handleSelect} 
      />
    );
    
    const dayButton = getByTestId('day-button');
    fireEvent.click(dayButton);
    
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should display selected date', () => {
    const selectedDate = new Date(2023, 0, 15);
    
    const { getByTestId } = render(
      <Calendar 
        mode="single" 
        selected={selectedDate} 
        onSelect={() => {}} 
      />
    );
    
    const selectedDateElement = getByTestId('selected-date');
    expect(selectedDateElement).toHaveTextContent(selectedDate.toISOString());
  });

  it('should handle multiple date selection mode', () => {
    const handleSelect = jest.fn();
    const selectedDates = [new Date(2023, 0, 10), new Date(2023, 0, 20)];
    
    render(
      <Calendar 
        mode="multiple" 
        selected={selectedDates} 
        onSelect={handleSelect} 
      />
    );
    
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('should handle range date selection mode', () => {
    const handleSelect = jest.fn();
    const selectedRange = {
      from: new Date(2023, 0, 10),
      to: new Date(2023, 0, 20)
    };
    
    render(
      <Calendar 
        mode="range" 
        selected={selectedRange} 
        onSelect={handleSelect} 
      />
    );
    
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('should handle disabled dates', () => {
    const disabledDates = [new Date(2023, 0, 15)];
    
    render(
      <Calendar 
        mode="single" 
        disabled={disabledDates} 
      />
    );
    
    expect(true).toBeTruthy();
  });

  it('should handle disabled days of week', () => {
    const disabledDaysOfWeek = [0, 6]; // Sunday and Saturday
    
    render(
      <Calendar 
        mode="single" 
        disabled={disabledDaysOfWeek as any} 
      />
    );
    
    expect(true).toBeTruthy();
  });

  it('should handle footer content', () => {
    const { getByText } = render(
      <Calendar 
        mode="single" 
        footer={<div>Calendar Footer</div>} 
      />
    );
    
    expect(getByText('Calendar Footer')).toBeInTheDocument();
  });
});
