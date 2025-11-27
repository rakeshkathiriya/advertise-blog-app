import createHttpError from 'http-errors';
import { clientModel } from '../models/clientModel';
import { Client, ClientUpdate } from '../utils/types/type';

export const handleClientCreation = async (data: Client) => {
  if (!data.name || !data.poc || !data.contact || !data.email || !data.postLimit) {
    throw createHttpError.BadRequest('All field are Required');
  }

  const client = await clientModel.create({
    name: data.name,
    poc: data.poc,
    email: data.email,
    contact: data.contact,
    postLimit: data.postLimit,
    expiredDate: data.expiredDate,
  });

  return client;
};

export const getAllClientService = async (filters: {
  name?: string;
  status?: string; // active | expired
  postStatus?: string; // available | full
  page?: number | string;
}) => {
  const limit = 10;
  const page = filters.page ? Number(filters.page) : 1;
  const skip = (page - 1) * limit;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00:00 today

  // ------------ MATCH STAGE CONDITIONS ------------
  const match: any = {};

  // Name filter
  if (filters.name) {
    match.name = { $regex: filters.name, $options: 'i' };
  }

  // Status filter
  if (filters.status === 'active') {
    match.expiredDate = { $gt: todayStart };
  }
  if (filters.status === 'expired') {
    match.expiredDate = { $lte: todayStart };
  }

  // ------------ AGGREGATION PIPELINE ------------
  const basePipeline: any[] = [
    { $match: match },

    // Load posts array (same as populate)
    {
      $lookup: {
        from: 'posts',
        localField: 'posts',
        foreignField: '_id',
        as: 'posts',
      },
    },

    // Add postCount field
    {
      $addFields: {
        postCount: { $size: '$posts' },
      },
    },
  ];

  // postStatus filter using postCount
  if (filters.postStatus === 'available') {
    basePipeline.push({
      $match: {
        $expr: { $lt: ['$postCount', '$postLimit'] },
      },
    });
  }

  if (filters.postStatus === 'full') {
    basePipeline.push({
      $match: {
        $expr: { $gte: ['$postCount', '$postLimit'] },
      },
    });
  }

  // Count stage
  const countPipeline = [...basePipeline, { $count: 'totalRecords' }];
  const countResult = await clientModel.aggregate(countPipeline);

  const totalRecords = countResult.length > 0 ? countResult[0].totalRecords : 0;
  const totalPages = Math.ceil(totalRecords / limit);

  // Pagination stage
  const dataPipeline = [...basePipeline, { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }];

  const data = await clientModel.aggregate(dataPipeline);

  return {
    page,
    limit,
    totalRecords,
    totalPages,
    data,
  };
};

export const getFilteredClientService = async () => {
  try {
    const now = new Date();

    const clients = await clientModel
      .find({
        expiredDate: { $gt: now },
        $expr: {
          $lt: [{ $size: '$posts' }, '$postLimit'],
        },
      })
      .select('name _id');

    return clients;
  } catch (error) {
    throw createHttpError.InternalServerError('Failed to get filtered Clients');
  }
};

export const updatedClientService = async (id: string, data: ClientUpdate) => {
  try {
    const updatedClient = await clientModel.findByIdAndUpdate(id, {
      poc: data.poc,
      email: data.email,
      contact: data.contact,
      postLimit: data.postLimit,
      expiredDate: data.expiredDate,
    });

    return updatedClient;
  } catch (error) {
    throw createHttpError.InternalServerError('Failed To Update the Client');
  }
};

export const deleteClientService = async (id: string) => {
  try {
    const deletedClient = await clientModel.findByIdAndDelete(id);
    return deletedClient;
  } catch (error) {
    throw createHttpError.InternalServerError('Failed To Delete the Client');
  }
};
