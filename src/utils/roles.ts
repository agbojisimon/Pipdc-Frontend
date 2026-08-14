export type Role = 'Admin' | 'Agent' | 'Client';

const ROLE_PRIORITY: Record<Role, number> = { Admin: 3, Agent: 2, Client: 1 };

export function primaryRole(roles: string[] | undefined): Role {
  if (!roles || roles.length === 0) return 'Client';
  return roles.reduce<Role>((highest, role) => {
    const candidate = role === 'Admin' ? 'Admin' : role === 'Agent' ? 'Agent' : 'Client';
    return ROLE_PRIORITY[candidate] > ROLE_PRIORITY[highest] ? candidate : highest;
  }, 'Client');
}

export function isAdmin(roles: string[] | undefined): boolean {
  return roles?.includes('Admin') ?? false;
}

export function isStaff(roles: string[] | undefined): boolean {
  return roles?.some((role) => role === 'Admin' || role === 'Agent') ?? false;
}
