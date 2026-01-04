'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/shared/i18n';

const REASONS = [
  { value: 'problem', label: { en: 'Technical Problem', es: 'Problema Técnico' } },
  { value: 'payment', label: { en: 'Payment Issue', es: 'Problema con Pago' } },
  { value: 'billing', label: { en: 'Billing / Invoice', es: 'Facturación' } },
  { value: 'other', label: { en: 'Other', es: 'Otro' } },
];

const TRANSLATIONS = {
  en: {
    title: 'Contact Us',
    subtitle: "Have a question or need help? Fill out the form below and we'll get back to you within 24-48 hours.",
    nameLabel: 'Your Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    reasonLabel: 'Reason for Contact',
    reasonPlaceholder: 'Select a reason...',
    messageLabel: 'Message',
    messagePlaceholder: 'Please describe your question or issue in detail...',
    submit: 'Send Message',
    sending: 'Sending...',
    successTitle: 'Message Sent!',
    successMessage: "Thank you for reaching out. We'll respond to your email within 24-48 hours.",
    sendAnother: 'Send another message',
    errorTitle: 'Error',
    backHome: 'Back to Home',
  },
  es: {
    title: 'Contáctanos',
    subtitle: '¿Tienes alguna pregunta o necesitas ayuda? Completa el formulario y te responderemos en 24-48 horas.',
    nameLabel: 'Tu Nombre',
    namePlaceholder: 'Juan Pérez',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    reasonLabel: 'Motivo del Contacto',
    reasonPlaceholder: 'Selecciona un motivo...',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Por favor describe tu pregunta o problema en detalle...',
    submit: 'Enviar Mensaje',
    sending: 'Enviando...',
    successTitle: '¡Mensaje Enviado!',
    successMessage: 'Gracias por contactarnos. Te responderemos a tu email en 24-48 horas.',
    sendAnother: 'Enviar otro mensaje',
    errorTitle: 'Error',
    backHome: 'Volver al Inicio',
  },
};

export default function Contact() {
  const lang = useLanguage();
  const t = TRANSLATIONS[lang === 'es' ? 'es' : 'en'];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    message: '',
    website: '', // Honeypot
  });
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Set timestamp when form loads (for bot detection)
  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: formTimestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', reason: '', message: '', website: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.successTitle}</h1>
          <p className="text-gray-600 mb-8">{t.successMessage}</p>
          <div className="space-y-4">
            <button
              onClick={() => {
                setStatus('idle');
                setFormTimestamp(Date.now());
              }}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t.sendAnother}
            </button>
            <a
              href="/"
              className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t.backHome}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600 mb-8">{t.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users, visible to bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              minLength={2}
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={t.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t.emailLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={t.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              {t.reasonLabel} <span className="text-red-500">*</span>
            </label>
            <select
              id="reason"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            >
              <option value="">{t.reasonPlaceholder}</option>
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label[lang === 'es' ? 'es' : 'en']}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              {t.messageLabel} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder={t.messagePlaceholder}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Error message */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{t.errorTitle}:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'sending' ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.sending}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t.submit}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <a href="/" className="text-primary-600 hover:underline">&larr; {t.backHome}</a>
        </div>
      </div>
    </div>
  );
}
