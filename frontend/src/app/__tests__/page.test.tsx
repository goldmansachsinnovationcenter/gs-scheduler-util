import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('lucide-react', () => ({
  CalendarClock: () => <div data-testid="calendar-clock-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  ListChecks: () => <div data-testid="list-checks-icon" />,
}));

describe('Home Page', () => {
  it('should render the page title', () => {
    render(<Home />);
    expect(screen.getByText('API Scheduler')).toBeInTheDocument();
  });

  it('should render the tabs with correct labels', () => {
    render(<Home />);
    expect(screen.getByText('Schedule API Calls')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Execution History')).toBeInTheDocument();
  });

  it('should render the schedule tab content', () => {
    render(<Home />);
    expect(screen.getByText('Create New Schedule')).toBeInTheDocument();
    expect(screen.getByText('Configure and schedule API calls with customizable parameters')).toBeInTheDocument();
    
    const createButton = screen.getByText('Create New Schedule', { selector: 'button' });
    expect(createButton).toBeInTheDocument();
    
    const link = createButton.closest('a');
    expect(link).toHaveAttribute('href', '/schedules/new');
  });

  it('should render the analytics tab content', () => {
    render(<Home />);
    expect(screen.getByText('Schedule Analytics')).toBeInTheDocument();
    expect(screen.getByText('View and analyze schedule performance metrics')).toBeInTheDocument();
    
    const viewButton = screen.getByText('View Analytics');
    expect(viewButton).toBeInTheDocument();
    
    const link = viewButton.closest('a');
    expect(link).toHaveAttribute('href', '/analytics');
  });

  it('should render the executions tab content', () => {
    render(<Home />);
    expect(screen.getByText('Execution History', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByText('View detailed execution history for all schedules')).toBeInTheDocument();
    
    const viewButton = screen.getByText('View Execution History');
    expect(viewButton).toBeInTheDocument();
    
    const link = viewButton.closest('a');
    expect(link).toHaveAttribute('href', '/executions');
  });

  it('should render the icons in the tabs', () => {
    render(<Home />);
    expect(screen.getByTestId('calendar-clock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('list-checks-icon')).toBeInTheDocument();
  });
});
