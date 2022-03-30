const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Secret = require('../lib/models/Secret');


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


  it('logs out a user', async () => {
    const res = await request(app)
      .delete('/api/v1/users/sessions');
  
    expect(res.body).toEqual({
      success: true,
      message: 'You have signed out!'
    });
  });


  it('allows logged in users to view secrets', async () => {
    const user = {
      email: 'ernie@longdog.com',
      password: 'littlekitty1'
    };

    await UserService.create(user);

    const agent = request.agent(app);

    let res = await agent
      .get('/api/v1/secrets');
    
    expect(res.body).toEqual({ 
      message: 'You need to sign in', status: 401 
    });

    await agent
      .post('/api/v1/users/sessions')
      .send(user);

    res = await agent
      .get('/api/v1/secrets');

    const expected = [{
      id: expect.any(String),
      title: 'big secret',
      description: 'earth is round',
      createdAt: expect.any(String)
    }];

    expect(res.body).toEqual(expected);
  });


  it('allows logged in users to create new secrets', async () => {
    const user = {
      email: 'ernie@longdog.com',
      password: 'littlekitty1'
    };

    const expected = {
      id: expect.any(String),
      title: 'newest secret',
      description: 'earth is flat',
      createdAt: expect.any(String)
    };

    await UserService.create(user);

    const agent = request.agent(app);

    let res = await agent
      .get('/api/v1/secrets');
    
    expect(res.body).toEqual({ 
      message: 'You need to sign in', status: 401 
    });

    await agent
      .post('/api/v1/users/sessions')
      .send(user);

    res = await agent
      .post('/api/v1/secrets')
      .send(expected);

    expect(res.body).toEqual(expected);
  });


});
