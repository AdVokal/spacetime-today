import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth";

export default async function InvitationPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-0 pt-10 px-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            You are invited
          </p>
          <h1 className="text-4xl font-bold mt-3 leading-tight">
            something
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            spacetime.today
          </p>
        </CardHeader>

        <Separator className="mx-10 my-6" style={{ width: "calc(100% - 80px)" }} />

        <CardContent className="px-10 pb-0">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome, {session.user?.name?.split(" ")[0]}. You have been granted access.
            This space is reserved for you.
          </p>
        </CardContent>

        <CardFooter className="px-10 pb-10 pt-8 flex gap-3">
          <Button asChild className="flex-1">
            <a href="/space">Enter</a>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="outline" type="submit">
              Sign out
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
