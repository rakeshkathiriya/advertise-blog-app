import createHttpError from 'http-errors';
import { uploadToCloudinary } from '../configs/cloudinaryUpload';
import { postToFacebook, postToInstagram } from '../helper/postOnSocial';
import { clientModel } from '../models/clientModel';
import { postModel } from '../models/postModel';
import { UserModel } from '../models/userModel';
import { Post } from '../utils/types/type';
const adminEmail = process.env.ADMIN_EMAIL;
export const handlePostCreation = async (data: Post) => {
  if (!data.fileBuffer || !data.description) {
    throw createHttpError.BadRequest('All fields are required');
  }

  const adminUser = await UserModel.findOne({ email: adminEmail });

  if (!adminUser) {
    throw createHttpError.Unauthorized('Admin user not found');
  }

  if (!adminUser.facebookAccessToken) {
    throw createHttpError.Unauthorized('Admin Facebook access token not found');
  }
  // console.log('🌐🌐🌐🌐🌐🌐🌐🌐facebook AccessToken in postservice', adminUser.facebookAccessToken);

  const client = await clientModel.findById(data.client);

  if (!client) {
    throw createHttpError.NotFound('Client not found');
  }

  // Ensure posts is an array
  const postCount = Array.isArray(client.posts) ? client.posts.length : 0;

  if (client?.expiredDate && client.expiredDate <= new Date()) {
    throw createHttpError.BadRequest('Client’s posting validity has expired');
  }

  if (client.postLimit !== undefined && postCount >= client.postLimit) {
    throw createHttpError.BadRequest('Client has reached the maximum number of posts');
  }
  const uploadedImage = await uploadToCloudinary(data.fileBuffer);
  const imageUrl = uploadedImage.secure_url;

  let fbPostId: string | null = data.fbPostId;
  let igPostId: string | null = data.igPostId;
  const errors: string[] = [];

  // Upload to Facebook if requested
  if (data.uploadOnFacebook) {
    if (!adminUser.facebookPageId) {
      errors.push('Facebook Page ID not configured');
    } else {
      try {
        fbPostId = await postToFacebook({
          pageId: adminUser.facebookPageId,
          accessToken: adminUser.facebookAccessToken,
          imageUrl,
          message: data.description,
        });
        // console.log('Posted to Facebook:', fbPostId);
      } catch (error) {
        return error;
      }
    }
  }

  // Upload to Instagram if requested
  if (data.uploadOnInstagram) {
    if (!adminUser.instagramBusinessAccountId) {
      errors.push('Instagram Business Account ID not configured');
    } else {
      try {
        igPostId = await postToInstagram({
          instagramAccountId: adminUser.instagramBusinessAccountId,
          accessToken: adminUser.facebookAccessToken,
          imageUrl,
          caption: data.description,
        });
        // console.log('Posted to Instagram:', igPostId);
      } catch (error) {
        return error;
      }
    }
  }

  // Save post to database
  const post = await postModel.create({
    image: imageUrl,
    description: data.description,
    uploadOnFacebook: data.uploadOnFacebook,
    uploadOnInstagram: data.uploadOnInstagram,
    fbPostId,
    igPostId,
    client: data.client,
  });

  await clientModel.findByIdAndUpdate(data.client, { $push: { posts: post._id } }, { new: true });

  // Return post
  return {
    post,
  };
};

export const getAllAdvertiseService = async () => {
  try {
    const posts = await postModel.find().sort({ _id: -1 }).populate('client');

    return posts;
  } catch (error) {
    throw createHttpError.InternalServerError('Failed to fetch posts');
  }
};

export const deleteAdvertiseService = async (id: string) => {
  try {
    const deleteAdd = await postModel.findByIdAndDelete(id);
    return deleteAdd;
  } catch (error) {
    throw createHttpError.InternalServerError('Failed to Delete Post');
  }
};
