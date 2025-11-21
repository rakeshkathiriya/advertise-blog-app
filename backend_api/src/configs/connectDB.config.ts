import mongoose from 'mongoose';
import logger from './logger.config';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.DATA_BASE_URL;

    if (!mongoUri) {
      logger.error('DATA_BASE_URL is missing in .env');
      throw new Error('DATA_BASE_URL is missing in .env');
    }

    await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', {
      message: error,
      stack: error,
    });
    process.exit(1);
  }
};

//detect disconnect
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
