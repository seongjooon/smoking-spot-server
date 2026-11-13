const mongoose = require('mongoose');

// 서버리스 환경에서는 함수 인스턴스가 재사용되므로 연결을 캐시한다.
let cached = global.__mongoose;
if (!cached) cached = global.__mongoose = { conn: null, promise: null };

async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.DATABASE_URL, { bufferCommands: false })
      .then(m => m)
      .catch(err => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDb;
