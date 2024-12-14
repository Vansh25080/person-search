import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addUser, editUser } from '@/app/actions/actions'
import { User, UserFormData, UserFormSchema } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

interface UserDialogProps {
  user?: User
  onEdit: (updatedUser: User) => void
  children?: React.ReactNode
}

export function UserDialog({ user, onEdit, children }: UserDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
    } : {
      name: '',
      email: '',
      phoneNumber: '',
      location: '',
    },
  })

  // Clear notification after 2 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)

    try {
      let updatedUser: User

      if (user) {
        // If editing an existing user, pass the user ID and form data to editUser
        updatedUser = await editUser(user.id, data)
      } else {
        // If adding a new user, pass only the form data to addUser
        updatedUser = await addUser(data);
      }

      // Trigger the onEdit callback (to update the state in the parent component)
      onEdit(updatedUser)

      // Set success notification
      setNotification({
        type: 'success',
        message: `User ${updatedUser.name} ${user ? 'updated' : 'added'} successfully`,
      })
      setOpen(false) // Close the dialog
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to ${user ? 'update' : 'add'} user`,
      })
    } finally {
      setIsSubmitting(false) // Set submitting to false once done
    }
  }

  return (
    <>
      {notification && (
        <Alert variant={notification.type === 'success' ? 'default' : 'destructive'} className="absolute -top-16 left-0 right-0 z-50">
          <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              {user ? 'Edit User' : 'Add New User'}
            </Button>
          )}
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {user ? 'Make changes to the user\'s information below.' : 'Fill out the form below to add a new user.'}
            </DialogDescription>
          </DialogHeader>

          {/* Pass the form and the handleSubmit function to UserForm */}
          <UserForm form={form} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>
    </>
  )
}
