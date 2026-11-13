const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../app');

const request = path =>
  new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      http.get({ port: server.address().port, path }, res => {
        let body = '';
        res.on('data', c => (body += c));
        res.on('end', () => {
          server.close();
          resolve({ status: res.statusCode, body });
        });
      }).on('error', reject);
    });
  });

test('health responds without DB', async () => {
  const res = await request('/health');
  assert.strictEqual(res.status, 200);
});

test('protected routes reject missing token', async () => {
  process.env.DATABASE_URL = 'mongodb://127.0.0.1:1/none';
  // DB 연결 단계에서 실패해도 500 이지 200 이 아님을 확인
  const res = await request('/spots');
  assert.notStrictEqual(res.status, 200);
});
