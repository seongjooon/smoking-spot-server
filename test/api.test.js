const test = require('node:test');
const assert = require('node:assert');

// DB 연결과 Firebase 검증을 스텁으로 대체
global.__mongoose = { conn: {}, promise: null };
const firebase = require('../lib/firebase');
firebase.getAuth = () => ({
  verifyIdToken: async t => {
    if (t !== 'good') throw new Error('bad');
    return { uid: 'u1', email: 'a@b.com', name: 'A' };
  }
});

const Spot = require('../models/spot');
const Coment = require('../models/coment');
const saved = [];
Spot.prototype.save = async function () { saved.push(this); return this; };
Coment.prototype.save = async function () { saved.push(this); return this; };
Coment.find = () => ({ sort: async () => [] });
Spot.exists = async () => true;

const app = require('../app');

let server, base;
test.before(() => new Promise(r => { server = app.listen(0, () => { base = `http://127.0.0.1:${server.address().port}`; r(); }); }));
test.after(() => server.close());

const call = (method, path, body, token = 'good') =>
  fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token && { authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body)
  });

const goodSpot = {
  title: 'Spot', address: 'Seoul', photo_url: 'https://x.public.blob.vercel-storage.com/a.png',
  location: { type: 'Point', coordinates: [126.9, 37.5] }
};
const id = '507f1f77bcf86cd799439011';

test('rejects missing / invalid token', async () => {
  assert.strictEqual((await call('get', '/spots', null, null)).status, 401);
  assert.strictEqual((await call('get', '/spots', null, 'bad')).status, 401);
});

test('create spot uses token email, ignores body email', async () => {
  const res = await call('post', '/spots/new', { ...goodSpot, email: 'evil@x.com' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(saved.at(-1).email, 'a@b.com');
});

test('create spot validates input', async () => {
  const bad = [
    { ...goodSpot, title: '' },
    { ...goodSpot, photo_url: 'http://insecure/a.png' },
    { ...goodSpot, location: { type: 'Point', coordinates: [999, 37] } },
    { ...goodSpot, location: { type: 'Point', coordinates: [1] } }
  ];
  for (const b of bad) assert.strictEqual((await call('post', '/spots/new', b)).status, 400);
});

test('comment: author from token, rate 0-5 enforced, bad id 404', async () => {
  const ok = await call('post', `/coments/${id}`, { coment_text: 'hi', rate: 4, created_by: 'evil' });
  assert.strictEqual(ok.status, 201);
  assert.strictEqual(saved.at(-1).created_by, 'a@b.com');
  assert.strictEqual((await call('post', `/coments/${id}`, { coment_text: 'hi', rate: 9 })).status, 400);
  assert.strictEqual((await call('post', `/coments/${id}`, { coment_text: '', rate: 3 })).status, 400);
  assert.strictEqual((await call('get', '/coments/not-an-id')).status, 404);
});

test('unknown route is JSON 404', async () => {
  const res = await call('get', '/nope');
  assert.strictEqual(res.status, 404);
});
