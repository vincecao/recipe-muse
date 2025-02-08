import { LoaderFunction } from '@remix-run/node';
import { MetaFunction, redirect } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Recipe Muse - Daily Menu' },
    { name: 'description', content: "Today's curated selection of dishes, crafted with care and precision." },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === '/') {
    return redirect('/home/menu');
  }
  return null;
};
