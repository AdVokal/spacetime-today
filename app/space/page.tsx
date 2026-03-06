import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Canvas from "./canvas";

export default async function SpacePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <Canvas user={session.user} />;
}
