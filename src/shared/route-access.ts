export const isProtectedAppPath = (path: string) =>
  path === '/app' || path.startsWith('/app/');
