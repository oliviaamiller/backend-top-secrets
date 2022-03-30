const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


describe('backend-top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });


  it('registers a user with an email and password', async () => {
    const user = {
      email: 'ernie@longdog.com',
      password: 'littlekitty1'
    };

    const res = await request(app)
      .post('/api/v1/users')
      .send(user);

    expect(res.body).toEqual({ id: expect.any(String), email: 'ernie@longdog.com' });
  });


  it('logs in an existing user with email and password', async () => {
    const user = {
      email: 'ernie@longdog.com',
      password: 'littlekitty1'
    };

    await UserService.create(user);

    const agent = request.agent(app);

    const res = await agent
      .post('/api/v1/users/sessions')
      .send(user);

    expect(res.body).toEqual({ message: 'Signed in, welcome back!' });
  });

});
