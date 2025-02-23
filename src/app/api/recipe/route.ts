import { NextResponse } from 'next/server';
import { firebaseDb } from '../_services/firebase';

export async function GET() {
  try {
    const recipes = await firebaseDb.getAllRecipes();
    console.log('Firebase and Supabase menu fetched');
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Retrieval all recipes failed:', error);
    return NextResponse.json({ error: 'Failed to retrieve all recipes' }, { status: 500 });
  }
}
