import { LoaderFunction } from '@remix-run/node';
import { Navigate, Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { isAxiosError } from 'axios';
import { DbRecipe } from '~/core/type';
import { firebaseDb } from '~/services/firebase';

export interface HomeContext {
  recipes: DbRecipe[];
}

export const loader: LoaderFunction = async () => {
  let recipes: DbRecipe[] = [];
  try {
    recipes = await firebaseDb.getAllRecipes();
  } catch (error) {
    console.error('Loader error:', error);
    if (isAxiosError(error)) {
      throw new Response(error.response?.data?.error || 'Failed to load recipes', {
        status: error.response?.status || 500,
      });
    }
    throw new Response('Failed to load recipes', { status: 500 });
  }

  return Response.json({ recipes });
};

export default function HomeRoute() {
  const { recipes } = useLoaderData<{ recipes: DbRecipe[] }>();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-4">
      <Outlet context={{ recipes }} />
      {location.pathname === '/home' && <Navigate to="/home/menu" replace />}
    </div>
  );
}
