const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testUser = {
  email: 'ernie@longdog.com',
  password: 'littlekitty1'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...testUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('backend-top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('registers a user with an email and password', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(testUser);

    const { email } = testUser;

    expect(res.body).toEqual({ id: expect.any(String), email });
  });

  it('logs in an existing user with email and password and returns current user', async () => {
    const [agent, user] = await registerAndLogin();
    const thisUser = await agent.get('/api/v1/users/id');

    expect(thisUser.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number)
    });
  });

});
