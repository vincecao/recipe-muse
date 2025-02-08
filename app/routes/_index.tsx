import { MetaFunction, Navigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Recipe Muse - Daily Menu" }, { name: "description", content: "Today's curated selection of dishes, crafted with care and precision." }];
};


export default function IndexRoute() {
  return <Navigate to="/home" replace />;
}
