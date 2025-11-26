const request = require('supertest');
const app = require('../src/server');

describe('Authentication', () => {
  test('POST /api/auth/login - valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ugochukwuhenry16@gmail.com',
        password: '1995Mobuchi@'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('POST /api/auth/login - invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
  });

  test('GET /api/auth/me - with valid token', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ugochukwuhenry16@gmail.com',
        password: '1995Mobuchi@'
      });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });
});