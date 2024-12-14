'use client'

import { useState } from 'react'
import AsyncSelect from 'react-select/async'
import { searchUsers } from '@/app/actions/actions'
import { UserCard } from './user-card'
import { UserDialog } from './user-dialog'
import { User } from '@/app/actions/schemas'
import { SingleValue } from 'react-select'
import { Button } from "@/components/ui/button"
import { UserPlus } from 'lucide-react'

interface Option {
  value: string;
  label: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phoneNumber: string;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}


export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const users = await searchUsers(inputValue)
    return users.map(user => ({ value: user.id, label: user.name, user }))
  }

  const handleChange = (option: SingleValue<Option>) => {
    if (option) {
      const normalizedUser = {
        ...option.user,
        email: option.user.email || undefined, // Convert null to undefined
        location: option.user.location || undefined, // Convert null to undefined
      };
      setSelectedUser(normalizedUser);
    } else {
      setSelectedUser(null);
    }
  };
  const handleEdit = (updatedUser: User) => {
    const normalizedUser = {
      ...updatedUser,
      email: updatedUser.email || undefined,
      location: updatedUser.location || undefined,
    };
    setSelectedUser(normalizedUser);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <AsyncSelect<Option>
          cacheOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          placeholder="Search for a user..."
          className="w-full"
        />
        <UserDialog onEdit={handleEdit}>
          <Button variant="outline" className="whitespace-nowrap">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </UserDialog>
      </div>
      {selectedUser && (
        <UserCard 
          user={selectedUser} 
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}

