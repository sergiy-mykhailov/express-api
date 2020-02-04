/* eslint-disable no-undef */

const request = require('supertest');
const app = require('../../app');
const { runCommand } = require('../../utils/common');
const { matchers } = require('../../utils/tests');
const { userRoles } = require('../../config');
const { models } = require('../../models');

expect.extend({
  toBeArrayOfObjects: matchers.toBeArrayOfObjects,
});

describe('router: /auth', () => {
  beforeAll(async () => {
    await runCommand('npm run migrate-test');
  });

  afterAll(async () => {
    await runCommand('npm run migrate-test-undo');
  });

  describe('/register', () => {
    const payloadWithError = [
      ['null', null],
      ['undefined', undefined],
      ['number', '1'],
      ['empty string', ''],
      ['some string', 'some string'],
      ['boolean', 'true'],
      ['boolean', 'false'],
      ['empty array', []],
      ['empty object', {}],
      ['wrong properties', { property: 'value' }],
      ['without confirmPassword', { username: 'username', email: 'username@email.com', password: 'password' }],
      ['without password', { username: 'username', email: 'username@email.com', confirmPassword: 'password' }],
      ['without email', { username: 'username', password: 'password', confirmPassword: 'password' }],
      ['without username', { email: 'username@email.com', password: 'password', confirmPassword: 'password' }],
      ['different confirmPassword', { username: 'username', email: 'username@email.com', password: 'password', confirmPassword: 'another password' }],
      ['not valid email', { username: 'username', email: 'not-valid-email', password: 'password', confirmPassword: 'password' }],
      ['not valid username', { username: {}, email: 'username@email.com', password: 'password', confirmPassword: 'password' }],
      ['empty properties', { username: '', email: '', password: '', confirmPassword: '' }],
      ['null properties', { username: null, email: null, password: null, confirmPassword: null }],
    ];

    describe('should return correct validation error', () => {
      it.each(payloadWithError)('case %#: %s', async (caseTitle, payload) => {
        const res = await request(app)
          .post('/api/auth/register')
          .send(payload);

        expect(res.statusCode).toBe(422);

        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('errors');

        expect(res.body.status).toBe(422);

        expect(res.body.errors).toBeArray();
        expect(res.body.errors.length).toBeGreaterThan(0);
        expect(res.body.errors).toBeArrayOfObjects(['msg', 'param', 'location']);
      });
    });

    describe('should register user', () => {
      const userData1 = {
        payload: {
          username: 'user1',
          email: 'user1@email.com',
          password: 'password1',
          confirmPassword: 'password1',
        },
        expected: {
          username: 'user1',
          email: 'user1@email.com',
        },
      };
      const userData2 = {
        payload: {
          username: 'user2',
          email: 'user2@email.com',
          password: 'password2',
          confirmPassword: 'password2',
          firstName: 'John',
          lastName: 'Deere',
          role: 'admin',
        },
        expected: {
          username: 'user2',
          email: 'user2@email.com',
          firstName: 'John',
          lastName: 'Deere',
        },
      };

      it('register user #1 (success)', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send(userData1.payload);

        expect(res.statusCode).toBe(201);

        expect(res.body).toEqual(expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          firstName: null,
          lastName: null,
        }));

        expect(res.body).toMatchObject(userData1.expected);

        expect(res.body.firstName).toBeNull();
        expect(res.body.lastName).toBeNull();
      });

      it('register user #2 (success)', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send(userData2.payload);

        expect(res.statusCode).toBe(201);

        expect(res.body).toContainAllKeys([
          'id', 'username', 'email', 'role', 'createdAt', 'updatedAt', 'firstName', 'lastName',
        ]);

        expect(res.body).toMatchObject(userData2.expected);
        expect(res.body.id).toBeString();
        expect(res.body.role).toBeOneOf(Object.values(userRoles));
        expect(new Date(res.body.createdAt)).toBeDate();
        expect(new Date(res.body.updatedAt)).toBeDate();

        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('token');
        expect(res.body).not.toHaveProperty('refreshToken');
      });

      it('register a user with the same email/username (fail)', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send(userData1.payload);

        expect(res.statusCode).toBe(409);
      });

      it('check user #2 in DB', async () => {
        const user = await models.user.findOne({
          where: { email: userData2.payload.email },
          raw: true,
        });

        expect(user).toBeDefined();

        expect(user).toMatchObject(userData2.expected);
        expect(user.id).toBeString();
        expect(user.role).toBe(userRoles.USER);
        expect(new Date(user.createdAt)).toBeDate();
        expect(new Date(user.updatedAt)).toBeDate();

        expect(user.password).toBeString();
        expect(user.password).not.toEqual(userData2.payload.password);

        expect(user.token).toBeNull();
        expect(user.refreshToken).toBeNull();
      });
    });
  });

  describe('/login', () => {
    it.todo('should return an error');
    it.todo('should login user');
  });

  describe('/refresh-token', () => {
    it.todo('should return an error');
    it.todo('should return new token');
  });

  describe('/reset-password', () => {
    it.todo('should return an error');
    it.todo('should reset password');
  });

  describe('/logout', () => {
    it.todo('should return an error');
    it.todo('should logout user');
  });
});
