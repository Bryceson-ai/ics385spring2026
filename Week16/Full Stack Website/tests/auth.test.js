process.env.NODE_ENV = 'test';
process.env.USE_IN_MEMORY_DB = 'true';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.NODE_PATH = [
  'c:/Users/bryce/OneDrive/Desktop/ics385spring2026/Term3Project/node_modules',
  'c:/Users/bryce/OneDrive/Desktop/ics385spring2026/week15/hw15a/node_modules'
].join(';');
require('module').Module._initPaths();

const request = require('supertest');
const app = require('../app');
const userStore = require('../lib/userStore');

beforeEach(async () => {
  await userStore.clearMemoryUsers();
});

describe('HW15-C authentication integration', () => {
  test('AC-3: POST /register creates an account, hashes password, and redirects to /admin/dashboard', async () => {
    const response = await request(app).post('/register').type('form').send({
      displayName: 'Kai Admin',
      email: 'kai@example.com',
      password: 'Password123'
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/admin/dashboard');

    const createdUser = await userStore.findByEmail('kai@example.com');
    expect(createdUser).toBeTruthy();
    expect(createdUser.password).not.toBe('Password123');
    await expect(createdUser.comparePassword('Password123')).resolves.toBe(true);
  });

  test('AC-4: POST /login sets a session cookie and redirects to /admin/dashboard', async () => {
    await userStore.createLocalUser({
      displayName: 'Kai Admin',
      email: 'kai@example.com',
      password: 'Password123',
      role: 'admin'
    });

    const response = await request(app).post('/login').type('form').send({
      email: 'kai@example.com',
      password: 'Password123'
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/admin/dashboard');
    expect(response.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('connect.sid=')]));
  });

  test('AC-5: GET /auth/google/callback links an existing local account by verified email', async () => {
    await userStore.createLocalUser({
      displayName: 'Kai Admin',
      email: 'kai@example.com',
      password: 'Password123',
      role: 'admin'
    });

    const response = await request(app).get('/auth/google/callback').query({
      mockGoogleEmail: 'kai@example.com',
      mockGoogleId: 'google-123',
      mockDisplayName: 'Kai From Google'
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/admin/dashboard');

    const linkedUser = await userStore.findByEmail('kai@example.com');
    expect(linkedUser.googleId).toBe('google-123');
    expect(linkedUser.provider).toBe('google');
  });

  test('AC-6: GET /admin/dashboard redirects unauthenticated requests to /login', async () => {
    const response = await request(app).get('/admin/dashboard');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('AC-7: POST /logout clears session and blocks the next protected request', async () => {
    await userStore.createLocalUser({
      displayName: 'Kai Admin',
      email: 'kai@example.com',
      password: 'Password123',
      role: 'admin'
    });

    const agent = request.agent(app);
    const loginResponse = await agent.post('/login').type('form').send({
      email: 'kai@example.com',
      password: 'Password123'
    });

    expect(loginResponse.statusCode).toBe(302);

    const logoutResponse = await agent.post('/logout');
    expect(logoutResponse.statusCode).toBe(302);
    expect(logoutResponse.headers.location).toBe('/login');

    const protectedResponse = await agent.get('/admin/dashboard');
    expect(protectedResponse.statusCode).toBe(302);
    expect(protectedResponse.headers.location).toBe('/login');
  });
});
