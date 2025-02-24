import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}!</h1>
      <div className="mb-4">
        <p>Username: {session.user.username}</p>
        <p>Trust Level: {session.user.trustLevel}</p>
      </div>
      <LogoutButton />
    </div>
  );
}
