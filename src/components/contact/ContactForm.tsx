'use client';

import { useEffect, useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          region: string;
          portalId: string;
          formId: string;
          target?: string;
          onFormReady?: ($form: unknown) => void;
          onFormSubmitted?: ($form: unknown) => void;
          [key: string]: unknown;
        }) => void;
      };
    };
  }
}

const HUBSPOT_PORTAL_ID = '246175508';
const HUBSPOT_FORM_ID = 'a18c2eec-dedb-4078-b1e8-a5e0128c11ed';
const HUBSPOT_REGION = 'na2';

export default function ContactForm() {
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Fallback form states (for visitors with ad blockers or script blocks)
  const [fallbackData, setFallbackData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [fallbackErrors, setFallbackErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let fallbackTimeout: NodeJS.Timeout;

    const renderHubSpotForm = () => {
      const targetElement = document.getElementById('hubspot-form-container');
      if (!targetElement) return;

      // Clear any prior children if remounting
      targetElement.innerHTML = '';

      if (window.hbspt && window.hbspt.forms) {
        try {
          window.hbspt.forms.create({
            region: HUBSPOT_REGION,
            portalId: HUBSPOT_PORTAL_ID,
            formId: HUBSPOT_FORM_ID,
            target: '#hubspot-form-container',
            onFormReady: () => {
              if (isMounted) {
                setIsFormLoaded(true);
              }
            },
          });

          // Fallback timer to mark loaded in case iframe doesn't trigger onFormReady
          setTimeout(() => {
            if (isMounted) setIsFormLoaded(true);
          }, 1200);
        } catch (err) {
          console.warn('HubSpot forms.create error:', err);
          if (isMounted) setUseFallback(true);
        }
      }
    };

    if (window.hbspt) {
      renderHubSpotForm();
    } else {
      const scriptId = 'hubspot-v2-embed-script';
      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (!existing) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://js-${HUBSPOT_REGION}.hsforms.net/forms/embed/v2.js`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (isMounted) renderHubSpotForm();
        };

        script.onerror = () => {
          console.warn('HubSpot embed script failed to load (likely blocked by client adblocker). Using direct API fallback.');
          if (isMounted) setUseFallback(true);
        };

        document.body.appendChild(script);
      } else {
        existing.addEventListener('load', renderHubSpotForm);
      }
    }

    // Safety timeout: if HubSpot doesn't load within 5 seconds, switch to fallback
    fallbackTimeout = setTimeout(() => {
      if (isMounted && !isFormLoaded && !window.hbspt) {
        setUseFallback(true);
      }
    }, 5000);

    return () => {
      isMounted = false;
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [isFormLoaded]);

  // Fallback submit handler (submits directly to Next.js API -> HubSpot Submissions v3)
  const handleFallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errors: Record<string, string> = {};
    if (!fallbackData.name.trim()) errors.name = 'Your name is required.';
    if (!fallbackData.email.trim()) {
      errors.email = 'Business email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fallbackData.email)) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!fallbackData.subject.trim()) errors.subject = 'Subject is required.';
    if (!fallbackData.message.trim()) {
      errors.message = 'Message is required.';
    } else if (fallbackData.message.trim().length < 10) {
      errors.message = 'Please provide at least 10 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFallbackErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFallbackErrors({});

    try {
      // Extract HubSpot tracking cookie if available
      const cookies = document.cookie.split(';');
      const hutkCookie = cookies.find((c) => c.trim().startsWith('hubspotutk='));
      const hutk = hutkCookie ? hutkCookie.split('=')[1] : undefined;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fallbackData.name,
          email: fallbackData.email,
          subject: fallbackData.subject,
          message: fallbackData.message,
          hutk,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry.');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If fallback was submitted successfully
  if (useFallback && isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-xs">
        <div className="flex items-center gap-3 text-emerald-600 mb-4">
          <CheckCircle2 className="w-8 h-8 shrink-0" />
          <h3 className="text-xl font-bold text-slate-900">Inquiry Received</h3>
        </div>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          Thank you for reaching out, <strong className="text-slate-900">{fallbackData.name}</strong>.
          Your message regarding &ldquo;{fallbackData.subject}&rdquo; has been sent directly to our team. We typically respond within 1–2 business days.
        </p>

        <button
          type="button"
          onClick={() => {
            setFallbackData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitted(false);
          }}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  // If adblocker is active or script failed, render the resilient native fallback form
  if (useFallback) {
    return (
      <form onSubmit={handleFallbackSubmit} noValidate className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            Send Us an Inquiry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            We&apos;d love to hear from you! Please fill out the form and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {submitError && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Your Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Your Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={fallbackData.name}
            onChange={(e) => setFallbackData({ ...fallbackData, name: e.target.value })}
            placeholder="Jane Doe"
            className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
              fallbackErrors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
            } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
          />
          {fallbackErrors.name && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {fallbackErrors.name}
            </p>
          )}
        </div>

        {/* Business Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Business Email <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={fallbackData.email}
            onChange={(e) => setFallbackData({ ...fallbackData, email: e.target.value })}
            placeholder="jane@company.com"
            className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
              fallbackErrors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
            } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
          />
          {fallbackErrors.email && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {fallbackErrors.email}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            value={fallbackData.subject}
            onChange={(e) => setFallbackData({ ...fallbackData, subject: e.target.value })}
            placeholder="AI implementation inquiry or editorial feedback"
            className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
              fallbackErrors.subject ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
            } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
          />
          {fallbackErrors.subject && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {fallbackErrors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            value={fallbackData.message}
            onChange={(e) => setFallbackData({ ...fallbackData, message: e.target.value })}
            placeholder="Please describe how we can help your team..."
            className={`w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-slate-50 border transition-all ${
              fallbackErrors.message ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
            } focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
          />
          {fallbackErrors.message && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {fallbackErrors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          {isSubmitting ? (
            <span>Sending Inquiry...</span>
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

  // Primary: Native HubSpot Form embed
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-6 shadow-xs relative overflow-hidden">
      {/* Loading Skeleton while HubSpot script loads */}
      {!isFormLoaded && (
        <div className="space-y-6 animate-pulse py-4">
          <div className="space-y-2">
            <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
            <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-3 w-24 bg-slate-200 rounded-sm" />
            <div className="h-11 w-full bg-slate-100 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-28 bg-slate-200 rounded-sm" />
            <div className="h-11 w-full bg-slate-100 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded-sm" />
            <div className="h-11 w-full bg-slate-100 rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded-sm" />
            <div className="h-28 w-full bg-slate-100 rounded-lg" />
          </div>

          <div className="h-11 w-32 bg-slate-200 rounded-lg" />
        </div>
      )}

      {/* HubSpot Mount Target */}
      <div
        id="hubspot-form-container"
        className={`transition-opacity duration-300 ${isFormLoaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full pointer-events-none'}`}
      />
    </div>
  );
}
