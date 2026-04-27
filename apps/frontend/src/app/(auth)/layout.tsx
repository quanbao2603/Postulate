import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";
import { Sparkles, Command } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-primary/30">
      {/* Left Panel - Branding & Aesthetic (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-primary/40 via-purple-600/20 to-black z-0"></div>
        <div className="absolute -bottom-32 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
        <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 w-fit">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
               <Command className="text-black w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">Postulate</span>
          </Link>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI-Powered Social OS</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Automate your growth. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Amplify your voice.
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-md">
            The all-in-one platform to plan, generate, and schedule posts automatically across 30+ networks.
          </p>
          
          {/* Testimonial snippet */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-md">
            <p className="text-gray-200 italic mb-4">
              "Postulate's AI agents completely transformed our content strategy. We save 20 hours a week and engagement is up 300%."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-orange-400"></div>
              <div>
                <p className="text-sm font-bold text-white">Sarah Jenkins</p>
                <p className="text-xs text-gray-400">CMO at TechFlow</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        <header className="absolute top-0 w-full p-6 flex justify-between items-center lg:justify-end z-10">
          <Link href="/" className="flex items-center space-x-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
               <Command className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-xl text-foreground">Postulate</span>
          </Link>
          <ThemeToggle />
        </header>
        
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
