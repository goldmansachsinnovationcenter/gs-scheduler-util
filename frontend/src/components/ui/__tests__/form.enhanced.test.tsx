import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
  FormProvider: ({ children }: any) => <div data-testid="form-provider">{children}</div>,
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

describe('Form Components Enhanced Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useForm as jest.Mock).mockReturnValue({
      control: {
        register: jest.fn(),
        unregister: jest.fn(),
        getFieldState: jest.fn(),
        _formValues: {},
        _defaultValues: {},
      },
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
      getValues: jest.fn(),
      setValue: jest.fn(),
      watch: jest.fn(),
      reset: jest.fn(),
    });
  });

  it('should render Form with form props', () => {
    const mockForm = {
      control: {
        register: jest.fn(),
        unregister: jest.fn(),
        getFieldState: jest.fn(),
        _formValues: {},
        _defaultValues: {},
      },
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
      getValues: jest.fn(),
      setValue: jest.fn(),
      watch: jest.fn(),
      reset: jest.fn(),
    };
    
    const { getByTestId } = render(
      <Form {...mockForm}>
        <div>Form content</div>
      </Form>
    );
    
    expect(getByTestId('form-provider')).toBeInTheDocument();
    expect(getByTestId('form-provider')).toHaveTextContent('Form content');
  });

  it('should render FormField with name and render prop', () => {
    const mockForm = {
      control: {
        register: jest.fn(),
        unregister: jest.fn(),
        getFieldState: jest.fn(),
        _formValues: {},
        _defaultValues: {},
      },
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
      getValues: jest.fn(),
      setValue: jest.fn(),
      watch: jest.fn(),
      reset: jest.fn(),
    };
    
    const { getByTestId } = render(
      <Form {...mockForm}>
        <FormField
          control={mockForm.control as any}
          name="test"
          render={({ field }) => (
            <div data-testid="field-render">Field content</div>
          )}
        />
      </Form>
    );
    
    expect(getByTestId('form-provider')).toBeInTheDocument();
    expect(getByTestId('field-render')).toBeInTheDocument();
    expect(getByTestId('field-render')).toHaveTextContent('Field content');
  });

  it('should render FormItem with custom className', () => {
    const { container } = render(
      <FormItem className="custom-item">
        <div>Item content</div>
      </FormItem>
    );
    
    const formItem = container.firstChild;
    expect(formItem).toHaveClass('custom-item');
    expect(formItem).toHaveTextContent('Item content');
  });

  it('should render FormLabel with custom className', () => {
    const { container } = render(
      <FormLabel className="custom-label">Test Label</FormLabel>
    );
    
    const formLabel = container.firstChild;
    expect(formLabel).toHaveClass('custom-label');
    expect(formLabel).toHaveTextContent('Test Label');
  });

  it('should render FormControl with custom className', () => {
    const { container } = render(
      <FormControl className="custom-control">
        <input type="text" />
      </FormControl>
    );
    
    const formControl = container.firstChild;
    expect(formControl).toHaveClass('custom-control');
  });

  it('should render FormDescription with custom className', () => {
    const { container } = render(
      <FormDescription className="custom-description">
        This is a description
      </FormDescription>
    );
    
    const formDescription = container.firstChild;
    expect(formDescription).toHaveClass('custom-description');
    expect(formDescription).toHaveTextContent('This is a description');
  });

  it('should render FormMessage with custom className', () => {
    const { container } = render(
      <FormMessage className="custom-message">
        This is an error message
      </FormMessage>
    );
    
    const formMessage = container.firstChild;
    expect(formMessage).toHaveClass('custom-message');
    expect(formMessage).toHaveTextContent('This is an error message');
  });

  it('should render complete form with all components', () => {
    const formSchema = z.object({
      username: z.string().min(2).max(50),
    });
    
    (zodResolver as jest.Mock).mockReturnValue({});
    
    const TestForm = () => {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
      });
      
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit">Submit</button>
          </form>
        </Form>
      );
    };
    
    const { getByText, getByRole } = render(<TestForm />);
    
    expect(getByText('Username')).toBeInTheDocument();
    expect(getByText('This is your public display name.')).toBeInTheDocument();
    expect(getByRole('button')).toHaveTextContent('Submit');
  });
});
