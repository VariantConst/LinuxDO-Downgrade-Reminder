import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { EmailForm } from "@/components/email-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubLink } from "@/components/ui/github-link";
import { TrustLevelBadge } from "@/components/ui/trust-level-badge";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <GitHubLink />
        <ThemeToggle />
        <LogoutButton />
      </div>

      <div className="w-full max-w-xl z-10 relative px-4 sm:px-0">
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-center sm:text-left">
              欢迎, <span className="text-foreground">{session.user.name}</span>
            </h1>
            <TrustLevelBadge
              level={session.user.trustLevel}
              className="mt-2 sm:mt-3 sm:ml-2 sm:self-start"
            />
          </div>
        </div>

        <EmailForm
          username={session.user.username}
          trustLevel={session.user.trustLevel}
        />
      </div>
    </div>
  );
}
