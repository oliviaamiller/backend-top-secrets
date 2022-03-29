const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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
      .send({ 
        email: 'ernie@longdog.com',
        password: 'littlekitty1'
      });

    expect(res.body).toEqual({ id: expect.any(String), email: 'ernie@longdog.com' });
  });

});
