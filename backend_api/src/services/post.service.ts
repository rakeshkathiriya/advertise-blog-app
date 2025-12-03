import createHttpError from 'http-errors';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '../configs/cloudinaryUpload';
import { postToFacebook, postToInstagram } from '../helper/postOnSocial';
import { clientModel } from '../models/clientModel';
import { postModel } from '../models/postModel';
import { UserModel } from '../models/userModel';
import { Post } from '../utils/types/type';
const adminEmail = process.env.ADMIN_EMAIL;
export const handlePostCreation = async (data: Post) => {
  if (!data.fileBuffer || !data.description || !data.client) {
    throw createHttpError.BadRequest('All fields are required');
  }

  const adminUser = await UserModel.findOne({ email: adminEmail });

  if (!adminUser) {
    throw createHttpError.Unauthorized('Admin not found');
  }

  if (!adminUser.facebookAccessToken) {
    throw createHttpError.Unauthorized('Facebook access token missing');
  }

  const client = await clientModel.findById(data.client);
  console.log('Client:-', client);
  if (!client) {
    throw createHttpError.NotFound('Client missing');
  }

  // Ensure posts is an array
  const postCount = Array.isArray(client.posts) ? client.posts.length : 0;

  if (client?.expiredDate && client.expiredDate <= new Date()) {
    throw createHttpError.BadRequest('Client posting validity expired');
  }

  if (client.postLimit !== undefined && postCount >= client.postLimit) {
    throw createHttpError.BadRequest('Client has reached the post limit');
  }
  const uploadedImage = await uploadToCloudinary(data.fileBuffer);
  const imageUrl = uploadedImage.secure_url;

  let fbPostId: string | null = data.fbPostId;
  let igPostId: string | null = data.igPostId;
  let fbPostLink: string | null = null;
  let igPostLink: string | null = null;

  // Upload to Facebook if requested
  if (data.uploadOnFacebook) {
    if (!adminUser.facebookPageId) {
      throw createHttpError.BadRequest('Facebook Page ID missing');
    } else {
      const fbResponse = await postToFacebook({
        pageId: adminUser.facebookPageId,
        accessToken: adminUser.facebookAccessToken,
        imageUrl,
        message: data.description,
      });

      // fbResponse = { postId: string, permalink: string | null }

      fbPostId = fbResponse.postId; // Save post ID
      fbPostLink = fbResponse.permalink; // Save FB link (if you want)
    }
  }

  // Upload to Instagram if requested
  if (data.uploadOnInstagram) {
    if (!adminUser.instagramBusinessAccountId) {
      throw createHttpError.BadRequest('Instagram Business Account ID missing');
    } else {
      const igResponse = await postToInstagram({
        instagramAccountId: adminUser.instagramBusinessAccountId,
        accessToken: adminUser.facebookAccessToken, // IG uses Page Access Token
        imageUrl,
        caption: data.description,
      });

      igPostId = igResponse.postId; // Save Instagram Post ID
      igPostLink = igResponse.permalink; // Save Instagram Permalink
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
    fbPostLink,
    igPostLink,
    client: data.client,
  });

  // console.log('Post', post);

  await clientModel.findByIdAndUpdate(data.client, { $push: { posts: post._id } }, { new: true });

  // Return post
  return {
    post,
  };
};

export const getAllAdvertiseService = async (filters: { name?: string }) => {
  let clientIds: Types.ObjectId[] = [];

  // Step 1: Search clients by name
  if (filters.name && filters.name.trim() !== '') {
    const matchingClients = await clientModel.find({
      name: { $regex: filters.name, $options: 'i' },
    });

    clientIds = matchingClients.map((c) => c._id as Types.ObjectId);
  }

  // Step 2: Build post query
  const query: any = {};

  if (clientIds.length > 0) {
    query.client = { $in: clientIds };
  }

  const posts = await postModel.find(query).populate('client').sort({ _id: -1 }).limit(40);

  return posts;
};

export const deleteAdvertiseService = async (id: string) => {
  const Advertise = await postModel.findById(id);

  if (!Advertise) {
    throw createHttpError.NotFound('Advertise Not Found');
  }
  const deleteAdd = await postModel.findByIdAndDelete(id);

  return deleteAdd;
};
