import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    control: {},
    handleSubmit: jest.fn(),
    formState: { errors: {} },
    getFieldState: jest.fn(() => ({ error: null })),
  })),
  useFormContext: jest.fn(() => ({
    control: {},
    formState: { errors: {} },
    getFieldState: jest.fn(() => ({ error: null })),
  })),
  useFormState: jest.fn(() => ({})),
  Controller: ({ render }: { render: any }) => render({
    field: {
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
      name: 'test',
    },
    fieldState: { error: null },
    formState: { errors: {} },
  }),
  FormProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="form-provider">{children}</div>,
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

jest.mock('@radix-ui/react-label', () => ({
  Root: ({ children, ...props }: { children: React.ReactNode }) => (
    <label data-testid="radix-label" {...props}>{children}</label>
  ),
}));

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="radix-slot" {...props}>{children}</div>
  ),
}));

jest.mock('../label', () => ({
  Label: ({ children, ...props }: { children: React.ReactNode }) => (
    <label data-slot="form-label" {...props}>{children}</label>
  ),
}));

describe('Form Components', () => {
  const testSchema = z.object({
    testField: z.string().min(1, "Field is required"),
  });

  type TestFormValues = z.infer<typeof testSchema>;

  const TestForm = () => {
    const form = useForm<TestFormValues>({
      resolver: zodResolver(testSchema),
      defaultValues: {
        testField: '',
      },
    });

    return (
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="testField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <input {...field} data-testid="test-input" />
                </FormControl>
                <FormDescription>Test description</FormDescription>
                <FormMessage>Test error message</FormMessage>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  describe('Form', () => {
    it('should render correctly', () => {
      render(<Form {...useForm()}>
        <div data-testid="form-content">Form Content</div>
      </Form>);
      
      expect(screen.getByTestId('form-provider')).toBeInTheDocument();
      expect(screen.getByTestId('form-content')).toHaveTextContent('Form Content');
    });
  });

  describe('FormField', () => {
    it('should render correctly', () => {
      const mockControl = {
        _subjects: { value: {} },
        _removeUnmounted: jest.fn(),
        _names: { mount: new Set(), unMount: new Set(), array: new Set(), watch: new Set() },
        _state: { isDirty: false, isLoading: false, isSubmitted: false, isSubmitting: false },
        _defaultValues: {},
        _formState: { errors: {} },
        _getWatch: jest.fn(),
        register: jest.fn(),
        unregister: jest.fn(),
        getFieldState: jest.fn(),
        handleSubmit: jest.fn(),
        watch: jest.fn(),
        setValue: jest.fn(),
        getValues: jest.fn(),
        reset: jest.fn(),
        trigger: jest.fn(),
        clearErrors: jest.fn(),
        setError: jest.fn(),
        formState: { errors: {} }
      };
      
      render(
        <FormField
          control={mockControl as any}
          name="testField"
          render={({ field }) => (
            <div data-testid="form-field-content">Field Content</div>
          )}
        />
      );
      
      expect(screen.getByTestId('form-field-content')).toHaveTextContent('Field Content');
    });
  });

  describe('FormItem', () => {
    it('should render correctly', () => {
      render(
        <FormItem>
          <div>Item Content</div>
        </FormItem>
      );
      
      const formItem = document.querySelector('[data-slot="form-item"]');
      expect(formItem).toBeInTheDocument();
      expect(formItem).toHaveClass('grid gap-2');
      expect(formItem).toHaveTextContent('Item Content');
    });

    it('should apply custom className', () => {
      render(
        <FormItem className="custom-class">
          <div>Item Content</div>
        </FormItem>
      );
      
      const formItem = document.querySelector('[data-slot="form-item"]');
      expect(formItem).toHaveClass('custom-class');
    });
  });

  describe('FormLabel', () => {
    it('should render correctly', () => {
      render(
        <FormLabel>Label Text</FormLabel>
      );
      
      const formLabel = document.querySelector('[data-slot="form-label"]');
      expect(formLabel).toBeInTheDocument();
      expect(formLabel).toHaveTextContent('Label Text');
    });

    it('should apply custom className', () => {
      render(
        <FormLabel className="custom-class">Label Text</FormLabel>
      );
      
      const formLabel = document.querySelector('[data-slot="form-label"]');
      expect(formLabel).toHaveClass('custom-class');
    });

    it('should handle error state', () => {
      jest.spyOn(React, 'useContext').mockImplementation(() => ({
        error: { message: 'Error message' },
        formItemId: 'test-form-item',
      }));

      render(
        <FormLabel>Label Text</FormLabel>
      );
      
      const formLabel = document.querySelector('[data-slot="form-label"]');
      expect(formLabel).toHaveAttribute('data-error', 'true');
      expect(formLabel).toHaveClass('data-[error=true]:text-destructive');
    });
  });

  describe('FormControl', () => {
    it('should render correctly', () => {
      render(
        <FormControl>
          <input type="text" data-testid="test-input" />
        </FormControl>
      );
      
      const formControl = document.querySelector('[data-slot="form-control"]');
      expect(formControl).toBeInTheDocument();
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('should set aria attributes correctly', () => {
      jest.spyOn(React, 'useContext').mockImplementation(() => ({
        error: null,
        formItemId: 'test-form-item',
        formDescriptionId: 'test-form-description',
        formMessageId: 'test-form-message',
      }));

      render(
        <FormControl>
          <input type="text" data-testid="test-input" />
        </FormControl>
      );
      
      const formControl = document.querySelector('[data-slot="form-control"]');
      expect(formControl).toHaveAttribute('id', 'test-form-item');
      expect(formControl).toHaveAttribute('aria-describedby', 'test-form-description');
      expect(formControl).toHaveAttribute('aria-invalid', 'false');
    });

    it('should set aria attributes correctly with error', () => {
      jest.spyOn(React, 'useContext').mockImplementation(() => ({
        error: { message: 'Error message' },
        formItemId: 'test-form-item',
        formDescriptionId: 'test-form-description',
        formMessageId: 'test-form-message',
      }));

      render(
        <FormControl>
          <input type="text" data-testid="test-input" />
        </FormControl>
      );
      
      const formControl = document.querySelector('[data-slot="form-control"]');
      expect(formControl).toHaveAttribute('aria-describedby', 'test-form-description test-form-message');
      expect(formControl).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('FormDescription', () => {
    it('should render correctly', () => {
      jest.spyOn(React, 'useContext').mockImplementation(() => ({
        formDescriptionId: 'test-form-description',
      }));

      render(
        <FormDescription>Description Text</FormDescription>
      );
      
      const formDescription = document.querySelector('[data-slot="form-description"]');
      expect(formDescription).toBeInTheDocument();
      expect(formDescription).toHaveAttribute('id', 'test-form-description');
      expect(formDescription).toHaveClass('text-muted-foreground');
      expect(formDescription).toHaveClass('text-sm');
      expect(formDescription).toHaveTextContent('Description Text');
    });

    it('should apply custom className', () => {
      render(
        <FormDescription className="custom-class">Description Text</FormDescription>
      );
      
      const formDescription = document.querySelector('[data-slot="form-description"]');
      expect(formDescription).toHaveClass('custom-class');
    });
  });

  describe('FormMessage', () => {
    it('should render correctly with error', () => {
      jest.spyOn(React, 'useContext').mockImplementation(() => ({
        error: { message: 'Error message' },
        formMessageId: 'test-form-message',
      }));

      render(
        <FormMessage />
      );
      
      const formMessage = document.querySelector('[data-slot="form-message"]');
      expect(formMessage).toBeInTheDocument();
      expect(formMessage).toHaveAttribute('id', 'test-form-message');
      expect(formMessage).toHaveClass('text-destructive');
      expect(formMessage).toHaveClass('text-sm');
      expect(formMessage).toHaveTextContent('Error message');
    });

    it('should render children when provided', () => {
      render(
        <FormMessage>Custom message</FormMessage>
      );
      
      const formMessage = document.querySelector('[data-slot="form-message"]');
      expect(formMessage).toHaveTextContent('Custom message');
    });

    it('should apply custom className', () => {
      render(
        <FormMessage className="custom-class">Error Message</FormMessage>
      );
      
      const formMessage = document.querySelector('[data-slot="form-message"]');
      expect(formMessage).toHaveClass('custom-class');
    });

    it('should render nothing when no error and no children', () => {
      jest.spyOn(React, 'useContext').mockImplementation(() => ({
        error: null,
        formMessageId: 'test-form-message',
      }));

      const { container } = render(<FormMessage />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Integration test', () => {
    it('should render a complete form with all components', () => {
      render(<TestForm />);
      
      expect(screen.getByTestId('form-provider')).toBeInTheDocument();
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
  });
});
