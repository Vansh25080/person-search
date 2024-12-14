import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/app/actions/schemas';
import { searchUsers } from '@/app/actions/actions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const users = await searchUsers(query);

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    // Transform the response to match the expected schema
    const formattedUsers: User[] = users.map(user => ({
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email ?? undefined,
      location: user.location ?? undefined,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
