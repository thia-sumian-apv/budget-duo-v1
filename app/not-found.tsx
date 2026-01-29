import Link from "next/link";
import { ArrowLeft, Compass, HelpCircle, User, Users } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base text-navy flex flex-col overflow-hidden relative">
      <main className="flex-1 flex items-center justify-center relative px-4 py-16">
        <div className="absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-highlight/5 blur-3xl -z-10 pointer-events-none" />
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <div className="relative w-72 h-64 mx-auto mb-2 select-none pointer-events-none">
            <div className="absolute inset-0 bg-white/40 rounded-full scale-90 blur-xl" />
            <div className="absolute bottom-8 left-6 transform -rotate-6">
              <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center shadow-lg border-4 border-base relative z-10">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="absolute bottom-8 right-6 transform rotate-6">
              <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center shadow-lg border-4 border-base relative z-10">
                <Users className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-highlight/20">
                <Compass className="h-12 w-12 text-highlight animate-spin [animation-duration:8s]" />
              </div>
            </div>
            <HelpCircle className="absolute top-4 left-10 h-10 w-10 text-navy/40 -rotate-12" />
            <HelpCircle className="absolute top-10 right-4 h-8 w-8 text-navy/40 rotate-12" />
          </div>
          <h1 className="text-[8rem] md:text-[10rem] font-bold text-navy leading-none font-heading tracking-tighter drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4 mt-2">
            Oops! This page is off the budget.
          </h2>
          <p className="text-lg text-navy/60 mb-10 font-medium">
            We couldn&apos;t find the page you were looking for.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-highlight hover:bg-highlight/90 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-highlight/20 transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-navy/50">
        <p>© {new Date().getFullYear()} Budget Duo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotFound;
