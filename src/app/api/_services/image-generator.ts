import axios from 'axios';
import FormData from 'form-data';

export async function getRecipeImages(prompt: string, count: number = 3): Promise<Buffer[]> {
  try {
    const requests = Array.from({ length: count }, () => {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('output_format', 'png');

      return axios.postForm(`https://api.stability.ai/v2beta/stable-image/generate/core`, formData, {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
          Accept: 'image/*',
        },
        responseType: 'arraybuffer',
        validateStatus: undefined,
      });
    });

    const responses = await Promise.allSettled(requests);

    // Filter successful responses and convert to Buffers
    const images = responses.flatMap(result => {
      if (result.status === 'fulfilled' && result.value.status === 200) {
        return [Buffer.from(result.value.data)];
      }
      
      if (result.status === 'fulfilled') {
        console.error('Image generation failed:', result.value.data.toString());
      } else {
        console.error('Request failed:', result.reason);
      }
      return [];
    });

    return images;
  } catch (error) {
    console.error('Failed to generate images:', error);
    return [];
  }
}
