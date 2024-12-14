import { z } from 'zod'


export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional(),
  phoneNumber: z.string().regex(/^\d{10}$/, {
    message: 'Phone number must be 10 digits long.',
  }),
  location: z.string().optional(),
})

export type User = z.infer<typeof userSchema>

export const UserFormSchema = userSchema.omit({ id: true })


export type UserFormData = z.infer<typeof userSchema>;
