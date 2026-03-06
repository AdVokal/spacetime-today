import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function InvitationPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const firstName = session.user?.name?.split(" ")[0]?.toLowerCase() ?? "you";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="pb-0 pt-10 px-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            you are invited
          </p>
          <h1 className="text-4xl font-bold mt-3 leading-tight tracking-tight">
            something
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            spacetime.today
          </p>
        </CardHeader>

        <Separator className="mx-10 my-6" style={{ width: "calc(100% - 80px)" }} />

        <CardContent className="px-10 pb-0">
          <p className="text-sm text-muted-foreground leading-relaxed">
            welcome, {firstName}. you have been granted access.
            this space is reserved for you.
          </p>
        </CardContent>

        <CardFooter className="px-10 pb-10 pt-8 flex gap-3">
          <Button asChild className="flex-1 transition-all duration-200">
            <a href="/space">enter</a>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              variant="outline"
              type="submit"
              className="transition-all duration-200"
            >
              sign out
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
