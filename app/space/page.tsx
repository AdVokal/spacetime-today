import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SpacePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">something</h1>
      </div>
    </div>
  );
}
