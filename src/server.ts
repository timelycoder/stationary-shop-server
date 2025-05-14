/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

main().catch((error) => console.error('Error in main function:', error));
