'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { deleteUnusedMediaAsset } from '@/lib/media-cleanup';

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export async function deleteUnusedMediaAssetAction(formData: FormData) {
  await requireAdmin();

  const fileId = formString(formData, 'fileId');
  let redirectTo = '/admin/media-cleanup?error=delete';

  if (fileId) {
    try {
      await deleteUnusedMediaAsset(fileId);
      redirectTo = '/admin/media-cleanup?status=deleted';
    } catch (error) {
      console.error('[admin] media cleanup delete failed', {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  revalidatePath('/admin/media-cleanup');
  redirect(redirectTo);
}
