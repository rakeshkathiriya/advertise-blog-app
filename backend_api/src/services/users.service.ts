import createHttpError from 'http-errors';
import { UserModel } from '../models/userModel';

interface Filters {
  email?: string;
  isSubscribed?: string;
  isForeverSubscribe?: string;
  page?: string;
}

export const getAllUsersService = async (filters: Filters) => {
  const limit = 10;
  const page = filters.page ? Number(filters.page) : 1;
  const skip = (page - 1) * limit;

  // ------------ MATCH STAGE CONDITIONS ------------
  const match: any = {
    role: 'User',
  };

  // Apply email filter only when value exists
  if (filters.email && filters.email.trim() !== '') {
    match.email = { $regex: filters.email, $options: 'i' };
  }

  // isSubscribed filter
  if (filters.isSubscribed === 'true') match.isSubscribed = true;
  if (filters.isSubscribed === 'false') match.isSubscribed = false;

  // isForeverSubscribe filter
  if (filters.isForeverSubscribe === 'true') match.isForeverSubscribe = true;
  if (filters.isForeverSubscribe === 'false') match.isForeverSubscribe = false;

  // Fields to remove
  const projection = { password: 0, __v: 0, updatedAt: 0 };

  // -------- 1️⃣ TOTAL COUNT AFTER FILTERS --------
  const totalRecords = await UserModel.countDocuments(match);

  // -------- 2️⃣ PAGINATED USERS LIST --------
  const userList = await UserModel.find(match, projection).sort({ createdAt: -1 }).skip(skip).limit(limit);

  // -------- 3️⃣ TOTAL PAGES --------
  const totalPages = Math.ceil(totalRecords / limit);

  // -------- 4️⃣ RETURN STRUCTURE --------
  return {
    totalRecords,
    page,
    limit,
    totalPages,
    userList,
  };
};

export const changeUserSubscriptionService = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw createHttpError.NotFound('User not found');
  }
  user.isForeverSubscribe = !user.isForeverSubscribe;

  await user.save();

  return user;
};
