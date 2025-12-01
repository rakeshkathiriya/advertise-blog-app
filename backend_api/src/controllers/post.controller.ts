import { NextFunction, Request, Response } from 'express';
import { deleteAdvertiseService, getAllAdvertiseService, handlePostCreation } from '../services/post.service';
import { Post } from '../utils/types/type';

export const createAdvertise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'Image is required' });
    }
    const { description, fbPostId = null, igPostId = null } = req.body;

    const data: Post = {
      fileBuffer: req.file.buffer,
      description,
      uploadOnFacebook: req.body.uploadOnFacebook === 'true',
      uploadOnInstagram: req.body.uploadOnInstagram === 'true',
      fbPostId,
      igPostId,
      client: req.body.client,
    };

    // console.log('Data In A Post Controller', data);
    const result = await handlePostCreation(data);

    res.status(201).json({
      status: true,
      message: 'Post created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdvertise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;
    const posts = await getAllAdvertiseService({
      name: name as string,
    });

    res.status(200).json({
      status: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdvertise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deleteAdd = await deleteAdvertiseService(id);

    res.status(200).json({
      status: true,
      message: 'Advertise deleted successfully',
      data: deleteAdd,
    });
  } catch (error) {
    next(error);
  }
};
