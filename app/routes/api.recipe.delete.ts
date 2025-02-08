import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { firebaseDb } from '~/services/firebase';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const recipeId = formData.get('recipeId')?.toString();

  if (!recipeId) {
    return json({ error: 'Missing recipe ID' }, { status: 400 });
  }

  try {
    await firebaseDb.deleteRecipeById(recipeId);
    return json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
};
