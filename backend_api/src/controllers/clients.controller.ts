import { NextFunction, Request, Response } from 'express';
import {
  deleteClientService,
  getAllClientService,
  getFilteredClientService,
  handleClientCreation,
  updatedClientService,
} from '../services/client.service';
import { Client, ClientUpdate } from '../utils/types/type';

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, poc, contact, email, postLimit = 0, expiredDate } = req.body;
    const data: Client = {
      name,
      poc,
      contact,
      email,
      postLimit,
      expiredDate,
    };

    const client = await handleClientCreation(data);

    res.status(201).json({
      status: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, status, postStatus, page } = req.query;

    const client = await getAllClientService({
      name: name as string,
      status: status as string,
      postStatus: postStatus as string,
      page: page as string,
    });

    res.status(200).json({
      status: true,
      message: 'Client Fetched Successfully',
      data: client.data,
      pagination: {
        page: client.page,
        limit: client.limit,
        totalRecords: client.totalRecords,
        totalPages: client.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFilteredClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await getFilteredClientService();

    res.status(201).json({
      status: true,
      message: 'Client Fetched Successfully for Dropdown',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { poc, email, expiredDate, postLimit, contact } = req.body;

    const data: ClientUpdate = {
      poc,
      contact,
      email,
      expiredDate,
      postLimit,
    };

    const updatedClient = await updatedClientService(id, data);

    res.status(201).json({
      status: true,
      message: 'Client Updated Successfully ',
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const deletedClient = await deleteClientService(id);
    res.status(201).json({
      status: true,
      message: 'Client Deleted Successfully ',
      data: deletedClient,
    });
  } catch (error) {
    next(error);
  }
};
