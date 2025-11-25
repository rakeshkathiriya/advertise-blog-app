import createHttpError from 'http-errors';
import { UserModel } from '../models/userModel';

interface Filters {
  email?: string;
  isSubscribed?: string;
}

export const getAllUsersService = async (filters: Filters) => {
  try {
    const query: any = {};

    // Apply email filter only when value exists
    if (filters.email && filters.email.trim() !== '') {
      query.email = { $regex: filters.email, $options: 'i' };
    }

    // Apply isSubscribed filter only when provided
    if (filters.isSubscribed === 'true') {
      query.isSubscribed = true;
    } else if (filters.isSubscribed === 'false') {
      query.isSubscribed = false;
    }

    // If query object is empty ⇒ no filter ⇒ return ALL users
    const users = Object.keys(query).length
      ? await UserModel.find(query).sort({ _id: -1 })
      : await UserModel.find().sort({ _id: -1 });

    return users;
  } catch (error) {
    throw createHttpError.InternalServerError('Failed to fetch users');
  }
};

export const changeUserSubscriptionService = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw createHttpError.NotFound('User not found');
    }
    user.isSubscribed = !user.isSubscribed;

    await user.save();

    return user;
  } catch (error) {
    throw createHttpError.InternalServerError('Failed to change user subscription');
  }
};
