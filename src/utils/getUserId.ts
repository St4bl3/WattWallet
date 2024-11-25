import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId }: { userId: string | null } = await auth()

  if (!userId) return null

    return userId;
  }