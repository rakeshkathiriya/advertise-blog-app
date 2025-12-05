import axios from 'axios';
import createHttpError from 'http-errors';

async function postToFacebook(params: {
  pageId: string;
  accessToken: string;
  imageUrl: string;
  message: string;
}): Promise<{ postId: string; permalink: string | null }> {
  const { pageId, accessToken, imageUrl, message } = params;

  // 1️⃣ Upload image (not published)
  const upload = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
    url: imageUrl,
    published: false,
    access_token: accessToken,
  });

  if (!upload.data.id) {
    throw createHttpError(500, 'Failed to upload image');
  }
  const mediaId = upload.data.id;

  // 2️⃣ Create REAL feed post by attaching media
  const feed = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
    message,
    attached_media: [{ media_fbid: mediaId }],
    access_token: accessToken,
  });

  if (!feed.data.id) {
    throw createHttpError(500, 'Failed to create feed post');
  }
  const postId = feed.data.id;

  // ⏳ 3️⃣ WAIT before fetching permalink (important)
  await new Promise((res) => setTimeout(res, 5000)); // wait 5 seconds

  // 4️⃣ Fetch permalink for the feed post
  const linkRes = await axios.get(`https://graph.facebook.com/v18.0/${postId}`, {
    params: {
      fields: 'permalink_url',
      access_token: accessToken,
    },
  });

  const permalink = linkRes.data.permalink_url || null;

  return { postId: upload.data.id, permalink };
}

async function postToInstagram(params: {
  instagramAccountId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
}): Promise<{ postId: string; permalink: string | null }> {
  const { instagramAccountId, accessToken, imageUrl, caption } = params;

  // 1️⃣ Create media container
  const containerResponse = await axios.post(`https://graph.facebook.com/v18.0/${instagramAccountId}/media`, {
    image_url: imageUrl,
    caption: caption,
    access_token: accessToken,
  });

  const creationId = containerResponse.data.id;

  if (!creationId) {
    throw createHttpError.BadRequest('Instagram API did not return a creation ID');
  }

  // 2️⃣ Wait for IG to finish processing media
  await waitForInstagramMediaProcessing(instagramAccountId, creationId, accessToken);

  // 3️⃣ Publish the media
  const publishResponse = await axios.post(`https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`, {
    creation_id: creationId,
    access_token: accessToken,
  });

  const postId = publishResponse.data.id;

  if (!postId) {
    throw createHttpError.BadRequest('Instagram API did not return a post ID');
  }

  // ⏳ 4️⃣ Give IG time to generate permalink
  await new Promise((res) => setTimeout(res, 5000));

  // 5️⃣ Fetch permalink of the IG post
  const linkRes = await axios.get(`https://graph.facebook.com/v18.0/${postId}`, {
    params: {
      fields: 'permalink',
      access_token: accessToken,
    },
  });

  const permalink = linkRes.data.permalink || null;

  return { postId, permalink };
}

/**
 * Wait for Instagram media to finish processing
 * Instagram needs time to download and process the image
 */
async function waitForInstagramMediaProcessing(
  instagramAccountId: string,
  creationId: string,
  accessToken: string,
  maxRetries: number = 10
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    const statusResponse = await axios.get(`https://graph.facebook.com/v18.0/${creationId}`, {
      params: {
        fields: 'status_code',
        access_token: accessToken,
      },
    });

    const statusCode = statusResponse.data.status_code;

    if (statusCode === 'FINISHED') {
      return; // Media is ready to publish
    }

    if (statusCode === 'ERROR') {
      throw createHttpError.BadRequest('Instagram media processing failed');
    }

    // Wait 2 seconds before checking again
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw createHttpError.BadRequest('Instagram media processing timeout - image may be too large or invalid');
}

export { postToFacebook, postToInstagram, waitForInstagramMediaProcessing };
