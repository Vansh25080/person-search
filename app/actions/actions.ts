'use server'

import { PrismaClient, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { UserFormData, userSchema } from './schemas';

export async function searchUsers(query: string) {
  try {
    return await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
}

export async function addUser(data: UserFormData) {
  try {
    console.log('Attempting to add user:', data);
    const validatedUser = userSchema.omit({ id: true }).parse(data);
    const newUser = await prisma.user.create({
      data: validatedUser,
    });
    console.log('User added successfully:', newUser);
    return {
      id: newUser.id,
      name: newUser.name,
      phoneNumber: newUser.phoneNumber,
      email: newUser.email ?? undefined,
      location: newUser.location ?? undefined,
    };
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user');
  }
}

export async function editUser(userId: string, data: Partial<Omit<UserFormData, 'createdAt' | 'updatedAt'>>) {
  try {
    console.log('Attempting to edit user:', userId, data);

    if (data.email) {
      // Check if another user already has this email
      const existingEmailUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId }, // Exclude the current user
        },
      });

      if (existingEmailUser) {
        throw new Error(`Email "${data.email}" is already in use by another user.`);
      }
    }

    const validatedData = userSchema.partial().parse(data);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    });

    console.log('User updated successfully:', updatedUser);
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      phoneNumber: updatedUser.phoneNumber,
      email: updatedUser.email ?? undefined,
      location: updatedUser.location ?? undefined,
    };
  } catch (error) {
    console.error('Error editing user:', error);
    throw new Error('Failed to edit user');
  }
}
