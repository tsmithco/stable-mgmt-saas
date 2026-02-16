/**
 * Authentication middleware for Fastify
 */

export async function verifyToken(token: string): Promise<any> {
  // TODO: Verify JWT token from Supabase
  // For now, return a mock user
  return {
    sub: 'user-123',
    email: 'test@example.com'
  }
}

export async function getUser(authHeader: string) {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }

  const token = authHeader.slice(7)
  return await verifyToken(token)
}
