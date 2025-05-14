import dotenv from 'dotenv';
import path from 'path';

// Load .env or .env.test depending on NODE_ENV
dotenv.config({
  path: path.join(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env'),
});

export default {
  port: process.env.PORT || 3000,
  db_url: process.env.MONGODB_URI,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  client_url: process.env.CLIENT_URL,
  server_url: process.env.SERVER_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  ssl_store_id: process.env.PAYMENT_STORE_ID,
  ssl_store_password: process.env.PAYMENT_STORE_PASSWORD,
};
