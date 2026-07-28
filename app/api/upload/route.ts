import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Handles client-side file upload tokens for Vercel Blob storage.
 * Enforces Clerk authentication and restricts allowed file MIME types (PDF, JPEG, PNG, WEBP)
 * and maximum file size limits (50MB).
 * 
 * @param {Request} request Next.js API route incoming request object
 * @returns {Promise<NextResponse>} JSON response with upload token or error message
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      // Validate session and set upload permissions before token creation
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
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB maximum file size limit
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