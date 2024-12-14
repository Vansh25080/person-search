'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserFormData } from '../actions/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserFormProps {
  form: UseFormReturn<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function UserForm({ form, onSubmit, isSubmitting }: UserFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setError(null);
      setSuccess(null);
      await onSubmit(data);
      setSuccess('User saved successfully!');
      form.reset(); // Reset form on success
    } catch (err) {
      setError('Failed to save user. Please try again.');
      console.error('Error submitting form:', err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'Phone number must be 10 digits',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (optional)</FormLabel>
              <FormControl>
                <Input placeholder="New York, NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
