import assert from 'node:assert/strict';
import { createServer } from 'vite';

const routes = ['/', '/app', '/vendas', '/comprar/essencial', '/comprar/pro'];
const server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });

try {
  await server.listen();
  const address = server.httpServer?.address();
  assert(address && typeof address !== 'string', 'Test server has no available port');

  for (const route of routes) {
    const response = await fetch('http://127.0.0.1:' + address.port + route);
    const html = await response.text();
    assert.equal(response.status, 200, route + ' returned ' + response.status);
    assert.match(html, /id="root"/, route + ' did not deliver the React root');
  }

  const access = await server.ssrLoadModule('/src/shared/access-control.ts');
  assert.equal(access.requiredPlanForPage('agenda'), 'free');
  assert.equal(access.requiredPlanForPage('diary'), 'essential');
  assert.equal(access.requiredPlanForPage('nutrition'), 'premium');
  assert.equal(access.requiredPlanForPage('beauty'), 'premium');
  assert.equal(access.planMeets('free', 'essential'), false);
  assert.equal(access.planMeets('essential', 'essential'), true);
  assert.equal(access.planMeets('premium', 'premium'), true);

  const authApi = await server.ssrLoadModule('/src/modules/auth/auth-api.ts');
  for (const exportName of ['signUp', 'signIn', 'restoreOnlineSession', 'readEntitlement', 'signOut']) {
    assert.equal(typeof authApi[exportName], 'function', exportName + ' is not available from auth-api');
  }

  console.log('Smoke test passed: ' + routes.length + ' routes, access rules, and auth exports.');
} finally {
  await server.close();
}
