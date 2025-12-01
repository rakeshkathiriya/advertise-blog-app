import axios from 'axios';
import createHttpError from 'http-errors';

async function postToFacebook(params: {
  pageId: string;
  accessToken: string;
  imageUrl: string;
  message: string;
}): Promise<string> {
  const { pageId, accessToken, imageUrl, message } = params;

  // Post photo to Facebook Page
  const response = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
    url: imageUrl,
    message: message,
    access_token: accessToken,
  });

  if (!response.data.id) {
    throw createHttpError.BadRequest('Facebook API did not return a post ID');
  }

  return response.data.id;
}

async function postToInstagram(params: {
  instagramAccountId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
}): Promise<string> {
  const { instagramAccountId, accessToken, imageUrl, caption } = params;

  // Step 1: Create media container
  const containerResponse = await axios.post(`https://graph.facebook.com/v18.0/${instagramAccountId}/media`, {
    image_url: imageUrl,
    caption: caption,
    access_token: accessToken,
  });

  const creationId = containerResponse.data.id;

  if (!creationId) {
    throw createHttpError.BadRequest('Instagram API did not return a creation ID');
  }

  // Step 2: Wait for media to be processed
  await waitForInstagramMediaProcessing(instagramAccountId, creationId, accessToken);

  // Step 3: Publish the media
  const publishResponse = await axios.post(`https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`, {
    creation_id: creationId,
    access_token: accessToken,
  });

  if (!publishResponse.data.id) {
    throw createHttpError.BadRequest('Instagram API did not return a post ID');
  }

  return publishResponse.data.id;
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
