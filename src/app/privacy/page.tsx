import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Brain to Post',
  description: 'Privacy Policy for Brain to Post',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Brain to Post (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our voice interview service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Profile Information:</strong> Name, areas of expertise, and preferred social media platforms you provide during onboarding.</li>
              <li><strong>Voice Data:</strong> Audio recordings of your voice during the interview session.</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe. We do not store your credit card details.</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Browser type and language preferences</li>
              <li>Device type and operating system</li>
              <li>Session duration and interaction data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Service Delivery:</strong> To conduct the AI interview and generate personalized content ideas.</li>
              <li><strong>Audio Processing:</strong> Voice recordings are processed in real-time using OpenAI&apos;s Whisper API for transcription and are not stored after the session ends.</li>
              <li><strong>Content Generation:</strong> Your transcribed responses are used to generate content ideas using AI (OpenAI GPT-4).</li>
              <li><strong>Payment Processing:</strong> To process your payment securely through Stripe.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Retention</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Voice Recordings:</strong> Processed in real-time and immediately deleted after transcription. We do not store audio files.</li>
              <li><strong>Generated Content:</strong> Stored temporarily in your browser session. Once you close the browser or download the PDF, we do not retain copies.</li>
              <li><strong>Payment Records:</strong> Maintained by Stripe according to their data retention policies and legal requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>OpenAI:</strong> For speech-to-text transcription (Whisper), AI responses (GPT-4), and text-to-speech. Subject to <a href="https://openai.com/policies/privacy-policy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">OpenAI&apos;s Privacy Policy</a>.</li>
              <li><strong>ElevenLabs:</strong> For text-to-speech voice synthesis. Subject to <a href="https://elevenlabs.io/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">ElevenLabs&apos; Privacy Policy</a>.</li>
              <li><strong>Stripe:</strong> For secure payment processing. Subject to <a href="https://stripe.com/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</li>
              <li><strong>Netlify:</strong> For website hosting. Subject to <a href="https://www.netlify.com/privacy/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Netlify&apos;s Privacy Policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">If you are located in the European Economic Area (EEA), you have the following rights:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data.</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing.</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data.</li>
              <li><strong>Right to Object:</strong> Object to certain types of processing.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure API connections to third-party services</li>
              <li>No permanent storage of voice recordings</li>
              <li>PCI-compliant payment processing through Stripe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for individuals under the age of 18. We do not knowingly
              collect personal information from children. If you believe we have collected information
              from a minor, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be processed in countries outside your residence, including the United States,
              where our third-party service providers operate. We ensure appropriate safeguards are in
              place for such transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us
              through our <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a href="/" className="text-primary-600 hover:underline">&larr; Back to Home</a>
        </div>
      </div>
    </div>
  );
}
