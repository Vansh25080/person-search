import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin } from 'lucide-react'
import { UserDialog } from './user-dialog'
import { User } from '@/app/actions/schemas'

interface UserCardProps {
  user: User
  onEdit: (updatedUser: User) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">ID: {user.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{user.location}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <UserDialog user={user} onEdit={onEdit} />
      </CardFooter>
    </Card>
  )
}

