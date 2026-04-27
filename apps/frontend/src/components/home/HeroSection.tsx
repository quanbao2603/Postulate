import { buttonVariants } from "../ui/Button";
import Link from "next/link";
import { ArrowRight, BarChart3, Calendar, MessageSquare } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background decoration: Subtle grid that works in both dark and light mode */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(150,150,150,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(150,150,150,0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>

      <div className="container relative mx-auto px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 shadow-[0_0_8px_rgba(45,50,80,0.8)]"></span>
            Postulate 1.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">social media</span> universe
          </h1>
          
          <p className="text-xl text-muted max-w-2xl mx-auto">
            The all-in-one operating system to schedule posts, analyze performance, and engage with your audience across all platforms.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/register" 
              className={buttonVariants({ size: "lg", className: "w-full sm:w-auto gap-2" })}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link 
              href="#demo"
              className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto" })}
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Feature Highlights Row */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
          <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl border border-border shadow-sm transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Scheduling</h3>
            <p className="text-muted text-sm">Plan months of content in advance with our visual drag-and-drop calendar.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl border border-border shadow-sm transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-500">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Deep Analytics</h3>
            <p className="text-muted text-sm">Understand what works with comprehensive reports on engagement and growth.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl border border-border shadow-sm transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-500">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Unified Inbox</h3>
            <p className="text-muted text-sm">Never miss a comment. Reply to all your social interactions from one dashboard.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
