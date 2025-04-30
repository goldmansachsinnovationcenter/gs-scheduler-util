import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

describe('Form Components Additional Tests 2', () => {
  describe('FormField with real form integration', () => {
    const formSchema = z.object({
      username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
      }),
    });

    const TestForm = () => {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
      });

      return (
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <input {...field} data-testid="username-input" />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
    };

    it('should render the form with all components', () => {
      render(<TestForm />);
      
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByText('This is your public display name.')).toBeInTheDocument();
    });

    it('should handle form context correctly', () => {
      const { container } = render(<TestForm />);
      
      const formControl = container.querySelector('[data-slot="form-control"]');
      expect(formControl).toHaveAttribute('aria-invalid', 'false');
      
      const formItem = container.querySelector('[data-slot="form-item"]');
      expect(formItem).toBeInTheDocument();
      
      const formDescription = container.querySelector('[data-slot="form-description"]');
      expect(formDescription).toHaveAttribute('id');
      expect(formDescription?.getAttribute('id')).toMatch(/^form-description-/);
    });
  });

  describe('Form component with different props', () => {
    it('should apply custom className', () => {
      const mockUseFormReturn = {
        handleSubmit: jest.fn(),
      };
      
      const { container } = render(
        <Form {...mockUseFormReturn as any} className="custom-form-class">
          <div>Form Content</div>
        </Form>
      );
      
      const formProvider = container.firstChild;
      expect(formProvider).toHaveClass('custom-form-class');
    });
  });

  describe('FormItem with different props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FormItem className="custom-item-class">
          <div>Item Content</div>
        </FormItem>
      );
      
      const formItem = container.querySelector('[data-slot="form-item"]');
      expect(formItem).toHaveClass('custom-item-class');
    });
  });

  describe('FormLabel with different props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FormLabel className="custom-label-class">
          Test Label
        </FormLabel>
      );
      
      const formLabel = container.querySelector('[data-slot="form-label"]');
      expect(formLabel).toHaveClass('custom-label-class');
    });
  });

  describe('FormDescription with different props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FormDescription className="custom-description-class">
          Test Description
        </FormDescription>
      );
      
      const formDescription = container.querySelector('[data-slot="form-description"]');
      expect(formDescription).toHaveClass('custom-description-class');
    });
  });
});
