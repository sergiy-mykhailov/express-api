/* eslint-disable no-undef */

const request = require('supertest');
const app = require('../../app');
const { runCommand } = require('../../utils/common');

describe('base server tests', () => {
  beforeAll(async () => {
    await runCommand('npm run migrate-test');
  });

  afterAll(async () => {
    await runCommand('npm run migrate-test-undo');
  });

  it('should return 200', async () => {
    const res = await request(app).get('/api/ping');

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('pong');
  });

  it('should return 404', async () => {
    const res = await request(app).get('/api/unknown_path');

    expect(res.statusCode).toEqual(404);

    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Not Found');
  });
});
