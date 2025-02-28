import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { EmailForm } from "@/components/email-form";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-xl z-10 relative px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 sm:mb-0">
            欢迎, <span className="text-gray-800">{session.user.name}</span>
          </h1>
          <div className="ml-0 sm:ml-4 mt-2 sm:mt-0">
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <EmailForm
            username={session.user.username}
            trustLevel={session.user.trustLevel}
          />
        </div>
      </div>
    </div>
  );
}
