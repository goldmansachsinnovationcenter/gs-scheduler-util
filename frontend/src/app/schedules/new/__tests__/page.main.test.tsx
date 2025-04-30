import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewSchedulePage from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockCreate = jest.fn().mockResolvedValue({});
jest.mock('../../../../lib/api', () => ({
  scheduleApi: {
    create: mockCreate,
  },
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children, onSubmit }) => <form data-testid="schedule-form" onSubmit={onSubmit}>{children}</form>,
  FormField: ({ children }) => <div data-testid="form-field">{children}</div>,
  FormItem: ({ children }) => <div data-testid="form-item">{children}</div>,
  FormLabel: ({ children }) => <label data-testid="form-label">{children}</label>,
  FormControl: ({ children }) => <div data-testid="form-control">{children}</div>,
  FormDescription: ({ children }) => <div data-testid="form-description">{children}</div>,
  FormMessage: ({ children }) => <div data-testid="form-message">{children}</div>,
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: (cb) => (e) => {
      e?.preventDefault?.();
      return cb({});
    },
    formState: { errors: {} },
    control: {},
    watch: jest.fn().mockReturnValue({}),
    setValue: jest.fn(),
    getValues: jest.fn().mockReturnValue({}),
  }),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children }) => <button data-testid="tabs-trigger">{children}</button>,
  TabsContent: ({ children }) => <div data-testid="tabs-content">{children}</div>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input data-testid="input" {...props} />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea data-testid="textarea" {...props} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children }) => <button data-testid="select-trigger">{children}</button>,
  SelectValue: ({ children }) => <span data-testid="select-value">{children}</span>,
  SelectContent: ({ children }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children }) => <div data-testid="select-item">{children}</div>,
}));

jest.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({ children }) => <div data-testid="radio-group">{children}</div>,
  RadioGroupItem: (props) => <input type="radio" data-testid="radio-item" {...props} />,
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props) => <input type="checkbox" data-testid="checkbox" {...props} />,
}));

jest.mock('@/components/ui/backdrop', () => ({
  LoadingBackdrop: ({ isOpen }) => (
    isOpen ? <div data-testid="loading-backdrop">Loading...</div> : null
  ),
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Server: () => <div data-testid="server-icon" />,
  Users: () => <div data-testid="users-icon" />,
}));

describe('NewSchedulePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title', () => {
    render(<NewSchedulePage />);
    expect(screen.getByText(/Create New Schedule/i)).toBeInTheDocument();
  });

  it('renders the form with three tabs', () => {
    render(<NewSchedulePage />);
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getAllByTestId('tabs-trigger').length).toBeGreaterThanOrEqual(3);
  });

  it('submits the form and calls the API', async () => {
    render(<NewSchedulePage />);
    
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  it('shows loading backdrop during form submission', async () => {
    render(<NewSchedulePage />);
    
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);
    
    expect(screen.getByTestId('loading-backdrop')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  it('renders the back button', () => {
    render(<NewSchedulePage />);
    expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
  });

  it('renders the cron job section', () => {
    render(<NewSchedulePage />);
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('renders the API call details section', () => {
    render(<NewSchedulePage />);
    expect(screen.getByTestId('server-icon')).toBeInTheDocument();
  });

  it('renders the schedule owner details section', () => {
    render(<NewSchedulePage />);
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
  });
});
