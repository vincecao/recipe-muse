import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "MealMuse - Recipe Generator" },
    { name: "description", content: "End meal planning stress - AI chef generates customized recipes with perfect portion sizes and real-time cooking assistance." },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      
    </div>
  );
}

