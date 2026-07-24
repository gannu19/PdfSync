import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async () => {
        const { userId } = await auth();

        if (!userId) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/webp',
          ],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);

  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Upload failed';

    const status =
      message === 'Unauthorized' ? 401 : 400;

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}