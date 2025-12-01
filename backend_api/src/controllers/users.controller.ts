import { NextFunction, Request, Response } from 'express';
import { changeUserSubscriptionService, getAllUsersService } from '../services/users.service';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, isSubscribed, isForeverSubscribe, page } = req.query;

    const response = await getAllUsersService({
      email: email as string,
      isSubscribed: isSubscribed as string,
      isForeverSubscribe: isForeverSubscribe as string,
      page: page as string,
    });

    res.status(200).json({
      status: true,
      message: 'Users fetched successfully',
      data: response.userList,
      pagination: {
        page: response.page,
        limit: response.limit,
        totalRecords: response.totalRecords,
        totalPages: response.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await changeUserSubscriptionService(id);

    res.status(200).json({
      status: true,
      message: 'Users Subscription Changed successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
