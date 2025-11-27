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
}) => {
  try {
    const query: any = {};

    // 1. Filter by name (case-insensitive)
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00:00 today

    // 2. Filter by expired / active
    if (filters.status === 'active') {
      query.expiredDate = { $gt: todayStart };
    }
    if (filters.status === 'expired') {
      query.expiredDate = { $lte: todayStart };
    }

    // 3. Start building Mongoose query
    let mongoQuery = clientModel.find(query).populate('posts');

    // 4. Filter by posts usage vs limit
    if (filters.postStatus === 'available') {
      mongoQuery = mongoQuery.where({
        $expr: { $lt: [{ $size: '$posts' }, '$postLimit'] },
      });
    }

    if (filters.postStatus === 'full') {
      mongoQuery = mongoQuery.where({
        $expr: { $gte: [{ $size: '$posts' }, '$postLimit'] },
      });
    }

    return await mongoQuery.exec();
  } catch (error) {
    throw createHttpError.InternalServerError('Failed to get Clients');
  }
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
