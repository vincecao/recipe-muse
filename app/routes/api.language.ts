import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const language = session.get("language") || "en";
  return Response.json({ language });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const language = formData.get("language") as string;
  
  session.set("language", language);
  
  return Response.json(
    { success: true },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
} 