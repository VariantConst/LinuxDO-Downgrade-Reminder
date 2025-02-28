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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 装饰元素 */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-50 to-purple-50 opacity-70 z-0"></div>
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-blue-100 opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-purple-100 opacity-20"></div>

      <div className="w-full max-w-xl z-10 relative">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          欢迎, <span className="text-blue-700">{session.user.name}</span>
        </h1>

        <div className="mb-10 flex flex-col space-y-2">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-500 font-medium">用户名</span>
            <span className="text-gray-800 font-semibold">
              {session.user.username}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-500 font-medium">信任等级</span>
            <span className="text-gray-800 font-semibold flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              {session.user.trustLevel}
            </span>
          </div>
        </div>

        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-gray-100">
          <EmailForm
            username={session.user.username}
            trustLevel={session.user.trustLevel}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
