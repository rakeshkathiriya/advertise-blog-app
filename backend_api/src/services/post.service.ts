import createHttpError from 'http-errors';
import { postToFacebook, postToInstagram } from '../helper/postOnSocial';
import { postModel } from '../models/postModel';
import { UserModel } from '../models/userModel';
import { Post } from '../utils/types/type';
const adminEmail = process.env.ADMIN_EMAIL;
export const handlePostCreation = async (data: Post) => {
  if (!data.image || !data.description) {
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
          imageUrl: data.image,
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
          imageUrl: data.image,
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
    ...data,
    fbPostId,
    igPostId,
  });

  // Return post
  return {
    post,
  };
};
