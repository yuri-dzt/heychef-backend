import crypto from 'crypto';
import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function parseDeviceInfo(userAgent?: string): string {
  if (!userAgent) return 'Desconhecido';

  const ua = userAgent.toLowerCase();

  // Detect OS
  let os = 'Desconhecido';
  if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('linux')) os = 'Linux';

  // Detect browser
  let browser = '';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  // Detect device type
  let deviceType = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) deviceType = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) deviceType = 'Tablet';

  return `${deviceType} • ${os}${browser ? ' • ' + browser : ''}`;
}

export async function createSession(params: {
  userId: string;
  organizationId?: string;
  userType: 'admin' | 'user';
  token: string;
  deviceInfo?: string;
  ipAddress?: string;
  expiresInMs?: number;
}): Promise<void> {
  const now = Date.now();
  const expiresAt = now + (params.expiresInMs || 7 * 24 * 60 * 60 * 1000); // default 7 days

  await prisma.session.create({
    data: {
      id: uuidv4(),
      user_id: params.userId,
      organization_id: params.organizationId || null,
      user_type: params.userType,
      token_hash: hashToken(params.token),
      device_info: parseDeviceInfo(params.deviceInfo) || null,
      ip_address: params.ipAddress || null,
      last_active_at: BigInt(now),
      expires_at: BigInt(expiresAt),
      created_at: BigInt(now),
    },
  });
}

export async function getUserSessions(userId: string) {
  const now = BigInt(Date.now());
  return prisma.session.findMany({
    where: { user_id: userId, expires_at: { gt: now } },
    orderBy: { last_active_at: 'desc' },
  });
}

export async function revokeSession(sessionId: string, userId: string): Promise<boolean> {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, user_id: userId },
  });
  if (!session) return false;
  await prisma.session.delete({ where: { id: sessionId } });
  return true;
}

export async function revokeAllSessions(userId: string, exceptTokenHash?: string): Promise<void> {
  const where: any = { user_id: userId };
  if (exceptTokenHash) {
    where.token_hash = { not: exceptTokenHash };
  }
  await prisma.session.deleteMany({ where });
}

export async function validateSession(tokenHash: string): Promise<boolean> {
  const session = await prisma.session.findFirst({
    where: { token_hash: tokenHash, expires_at: { gt: BigInt(Date.now()) } },
  });
  if (!session) return false;
  // Update last_active_at
  await prisma.session.update({
    where: { id: session.id },
    data: { last_active_at: BigInt(Date.now()) },
  });
  return true;
}
