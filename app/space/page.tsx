import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { loadDrawing } from "@/lib/actions";
import Canvas from "./canvas-client";

export default async function SpacePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const initialSnapshot = await loadDrawing();

  return <Canvas user={session.user} initialSnapshot={initialSnapshot} />;
}
