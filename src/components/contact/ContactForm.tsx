'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject line is required.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Message body is required.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide a slightly more detailed message (minimum 10 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Read HubSpot tracking cookie if available from global tracking script
      let hutk: string | undefined;
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
        if (match && match[1]) {
          hutk = decodeURIComponent(match[1]);
        }
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          hutk,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send inquiry. Please try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setServerError(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-xs">
        <div className="flex items-center gap-3 text-emerald-600 mb-4">
          <CheckCircle2 className="w-8 h-8 shrink-0" />
          <h3 className="text-xl font-bold text-slate-900">Inquiry Received</h3>
        </div>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          Thank you for getting in touch, <strong className="text-slate-900">{formData.name}</strong>.
          Your inquiry regarding &ldquo;{formData.subject}&rdquo; has been received and logged directly into our system. Our editorial and advisory team typically responds within 1–2 business days.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      id="ai-for-business-leads"
      name="Ai for Business Leads"
      data-form-name="Ai for Business Leads"
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6"
    >
      {serverError && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Your Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jane Doe"
          className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
            errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
          } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Business Email <span className="text-rose-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="jane@company.com"
          className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
            errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
          } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Subject / Inquiry Type <span className="text-rose-500">*</span>
        </label>
        <input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Editorial inquiry, AI consultation feedback, or feature request"
          className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
            errors.subject ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
          } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
        />
        {errors.subject && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please share details about your business inquiry or feedback..."
          className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
            errors.message ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
          } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <span>Submit Message</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
