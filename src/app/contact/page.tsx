import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, Clock, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact the AIForBusinessHub editorial desk for feedback, technical inquiries, and research collaboration.',
  alternates: {
    canonical: 'https://aiforbusinesshub.com/contact',
  },
  openGraph: {
    title: 'Contact Us | AIForBusinessHub',
    description:
      'Get in touch with the AIForBusinessHub editorial desk for inquiries, research questions, and feedback.',
    url: 'https://aiforbusinesshub.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            Editorial Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-4">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            We welcome business inquiries, editorial feedback, research ideas, and corrections. Let us know how we can assist your team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Editorial Principles
              </h3>
              
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Vendor Independent</strong>
                    We do not accept paid placements to bias our cost assessments or architecture recommendations.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Prompt Response</strong>
                    Editorial inquiries and corrections are typically reviewed within 1–2 business days.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Direct Collaboration</strong>
                    Interested in contributing data or real-world project telemetry? We love discussing practical AI deployments.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
