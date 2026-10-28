import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NewsletterCTA() {
  return (
    <section className="my-16 sm:my-24">
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            Editorial Advisory
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Independent AI analysis without vendor hype.
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
            Have a question about AI implementation budgets, agent architecture, or project scoping? Get in touch with our editorial and technical research team.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm"
            >
              Contact the Editorial Desk
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% vendor-agnostic insights. No sponsored bias.</span>
          </div>
        </div>

        {/* Subtle decorative background graphic */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
