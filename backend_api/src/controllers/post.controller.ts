import { NextFunction, Request, Response } from 'express';
import { handlePostCreation } from '../services/post.service';
import { Post } from '../utils/types/type';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      image,
      description,
      uploadOnFacebook = false,
      uploadOnInstagram = false,
      fbPostId = null,
      igPostId = null,
    } = req.body;

    if (!image) {
      return res.status(400).json({ status: false, message: 'Image is required' });
    }

    const data: Post = {
      image,
      description,
      uploadOnFacebook,
      uploadOnInstagram,
      fbPostId,
      igPostId,
    };

    // console.log('Data In A Post Controller', data);
    const result = await handlePostCreation(data);

    // Handle response based on whether we have errors
    // if (result.errors && result.errors.length > 0) {
    //   return res.status(207).json({
    //     status: 'partial',
    //     message: 'Post created with some errors',
    //     post: result.post,
    //     errors: result.errors,
    //     success: result.success,
    //   });
    // }

    res.status(201).json({
      status: true,
      message: 'Post created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
