import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewSchedulePage from '../page';

const mockCreate = jest.fn().mockResolvedValue({});
jest.mock('../../../../lib/api', () => ({
  scheduleApi: {
    create: mockCreate
  }
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Server: () => <div data-testid="server-icon" />,
  Users: () => <div data-testid="users-icon" />,
}));

jest.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  RadioGroupItem: ({ children, ...props }) => <input type="radio" {...props} />,
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children, ...props }) => <form {...props}>{children}</form>,
  FormField: ({ children, ...props }) => <div {...props}>{children}</div>,
  FormItem: ({ children, ...props }) => <div {...props}>{children}</div>,
  FormLabel: ({ children, ...props }) => <label {...props}>{children}</label>,
  FormControl: ({ children, ...props }) => <div {...props}>{children}</div>,
  FormDescription: ({ children, ...props }) => <div {...props}>{children}</div>,
  FormMessage: ({ children, ...props }) => <div {...props}>{children}</div>,
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {} },
    control: {},
    watch: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
  }),
}));

describe('NewSchedulePage Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NewSchedulePage />);
    expect(screen.getByText('Create New Schedule')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<NewSchedulePage />);
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
