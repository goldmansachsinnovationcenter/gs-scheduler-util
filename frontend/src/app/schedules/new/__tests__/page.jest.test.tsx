import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../../lib/api', () => {
  return {
    scheduleApi: {
      create: jest.fn().mockResolvedValue({}),
    },
  };
});

jest.mock('@/components/ui/radio-group', () => {
  return {
    RadioGroup: ({ children, ...props }) => <div data-testid="radio-group" {...props}>{children}</div>,
    RadioGroupItem: ({ children, ...props }) => <input type="radio" data-testid="radio-item" {...props} />,
  };
});

jest.mock('@/components/ui/form', () => {
  return {
    Form: ({ children, ...props }) => <form data-testid="form" {...props}>{children}</form>,
    FormField: ({ children, ...props }) => <div data-testid="form-field" {...props}>{children}</div>,
    FormItem: ({ children, ...props }) => <div data-testid="form-item" {...props}>{children}</div>,
    FormLabel: ({ children, ...props }) => <label data-testid="form-label" {...props}>{children}</label>,
    FormControl: ({ children, ...props }) => <div data-testid="form-control" {...props}>{children}</div>,
    FormDescription: ({ children, ...props }) => <div data-testid="form-description" {...props}>{children}</div>,
    FormMessage: ({ children, ...props }) => <div data-testid="form-message" {...props}>{children}</div>,
    useForm: () => ({
      register: jest.fn(),
      handleSubmit: (cb) => (data) => cb(data),
      formState: { errors: {} },
      control: {},
      watch: jest.fn().mockReturnValue({}),
      setValue: jest.fn(),
      getValues: jest.fn().mockReturnValue({}),
    }),
  };
});

jest.mock('@/components/ui/tabs', () => {
  return {
    Tabs: ({ children, ...props }) => <div data-testid="tabs" {...props}>{children}</div>,
    TabsList: ({ children, ...props }) => <div data-testid="tabs-list" {...props}>{children}</div>,
    TabsTrigger: ({ children, ...props }) => <button data-testid="tabs-trigger" {...props}>{children}</button>,
    TabsContent: ({ children, ...props }) => <div data-testid="tabs-content" {...props}>{children}</div>,
  };
});

jest.mock('@/components/ui/button', () => {
  return {
    Button: ({ children, ...props }) => <button data-testid="button" {...props}>{children}</button>,
  };
});

jest.mock('@/components/ui/input', () => {
  return {
    Input: (props) => <input data-testid="input" {...props} />,
  };
});

jest.mock('@/components/ui/textarea', () => {
  return {
    Textarea: (props) => <textarea data-testid="textarea" {...props} />,
  };
});

jest.mock('@/components/ui/select', () => {
  return {
    Select: ({ children, ...props }) => <div data-testid="select" {...props}>{children}</div>,
    SelectTrigger: ({ children, ...props }) => <button data-testid="select-trigger" {...props}>{children}</button>,
    SelectValue: ({ children, ...props }) => <span data-testid="select-value" {...props}>{children}</span>,
    SelectContent: ({ children, ...props }) => <div data-testid="select-content" {...props}>{children}</div>,
    SelectItem: ({ children, ...props }) => <div data-testid="select-item" {...props}>{children}</div>,
  };
});

jest.mock('@/components/ui/checkbox', () => {
  return {
    Checkbox: (props) => <input type="checkbox" data-testid="checkbox" {...props} />,
  };
});

jest.mock('@/components/ui/backdrop', () => {
  return {
    LoadingBackdrop: ({ children, ...props }) => <div data-testid="loading-backdrop" {...props}>{children}</div>,
  };
});

jest.mock('lucide-react', () => {
  return {
    ArrowLeft: () => <div data-testid="arrow-left-icon" />,
    Clock: () => <div data-testid="clock-icon" />,
    Server: () => <div data-testid="server-icon" />,
    Users: () => <div data-testid="users-icon" />,
  };
});

import NewSchedulePage from '../page';

describe('NewSchedulePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NewSchedulePage />);
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const { scheduleApi } = require('../../../../lib/api');
    render(<NewSchedulePage />);
    
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalled();
    });
  });
});
