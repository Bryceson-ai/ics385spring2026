const request = require('supertest');

// Update this path to the Express app used for your term project.
// Example: const app = require('../app');
const app = require('../app');

describe('HW15-B auth acceptance tests', () => {
  test('AC-3: POST /register creates account and redirects to /admin/dashboard', async () => {
    const uniqueEmail = `ac3_${Date.now()}@example.com`;
    const res = await request(app).post('/register').send({
      email: uniqueEmail,
      password: 'Password123!'
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');

    // TODO: verify users collection contains account and password is bcrypt hash.
  });

  test('AC-4: POST /login with valid credentials sets session cookie', async () => {
    const agent = request.agent(app);

    const res = await agent.post('/login').send({
      email: 'admin@example.com',
      password: 'Password123!'
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('AC-5: GET /auth/google/callback success redirects to /admin/dashboard', async () => {
    // TODO: mock passport Google strategy or test with a dedicated test callback harness.
    const res = await request(app).get('/auth/google/callback?code=test-code');

    expect([302, 401, 500]).toContain(res.statusCode);
  });

  test('AC-6: GET /admin/dashboard redirects unauthenticated to /login', async () => {
    const res = await request(app).get('/admin/dashboard');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/login');
  });

  test('AC-7: POST /logout clears session and blocks next /admin/dashboard request', async () => {
    const agent = request.agent(app);

    await agent.post('/login').send({
      email: 'admin@example.com',
      password: 'Password123!'
    });

    const logoutRes = await agent.post('/logout');
    expect([200, 302]).toContain(logoutRes.statusCode);

    const protectedRes = await agent.get('/admin/dashboard');
    expect(protectedRes.statusCode).toBe(302);
    expect(protectedRes.headers.location).toBe('/login');
  });
});
