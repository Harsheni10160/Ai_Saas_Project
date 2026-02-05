import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />

      {/* Footer Snapshot */}
      <footer className="py-12 px-4 border-t-2 border-black flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-6 mt-20">
        <div className="text-xl font-serif font-bold tracking-tight">
          AI<span className="text-pastel-green">Support</span>
        </div>
        <div className="text-sm text-muted-foreground">
          © 2026 AI Support Agent SaaS. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </footer>
    </main>
  );
}
