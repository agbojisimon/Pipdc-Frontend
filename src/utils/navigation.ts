export function isInternalPath(path: string | null | undefined): path is string {
  if (!path || typeof path !== 'string') return false;
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//') || path.startsWith('/\\')) return false;
  return true;
}
