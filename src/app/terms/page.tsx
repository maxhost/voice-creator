import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Brain to Post',
  description: 'Terms of Service for Brain to Post',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using Brain to Post (&quot;Service&quot;), you agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use
              our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Brain to Post is an AI-powered service that conducts voice interviews to help users
              generate content ideas for social media platforms. The service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>A 10-minute AI voice interview session</li>
              <li>Generation of 4-7 personalized content ideas</li>
              <li>PDF export of generated ideas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Payment and Pricing</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The Service is provided on a pay-per-use basis at the price displayed at checkout.</li>
              <li>All payments are processed securely through Stripe.</li>
              <li>Prices are in USD and may be subject to applicable taxes.</li>
              <li>Each payment grants access to one (1) interview session.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We offer refunds under the following conditions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Minimum Ideas Guarantee:</strong> If your session generates fewer than 4 content ideas, you are entitled to a full refund.</li>
              <li><strong>Technical Issues:</strong> If technical problems prevent you from completing your interview, we will provide a refund or a new session at our discretion.</li>
              <li><strong>Refund Requests:</strong> Must be submitted within 7 days of purchase by contacting us via email.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Refunds are not available for completed sessions where 4 or more ideas were successfully generated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">By using the Service, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate information during onboarding</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to abuse, manipulate, or exploit the Service</li>
              <li>Not use the Service to generate content that is illegal, harmful, or infringes on others&apos; rights</li>
              <li>Not share or resell access to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">6.1 Your Content</h3>
            <p className="text-gray-700 leading-relaxed">
              You retain full ownership of the ideas and content generated during your interview session.
              The generated content is yours to use for any purpose, including commercial use.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">6.2 Our Service</h3>
            <p className="text-gray-700 leading-relaxed">
              Brain to Post, including its design, features, and underlying technology, is protected by
              intellectual property laws. You may not copy, modify, or create derivative works of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. AI-Generated Content Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The content ideas generated by our AI are suggestions based on your input. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>AI-generated content may require editing or refinement before publication</li>
              <li>We do not guarantee the accuracy, originality, or suitability of generated content</li>
              <li>You are responsible for reviewing and verifying content before use</li>
              <li>The AI may occasionally produce unexpected or inappropriate suggestions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BRAIN TO POST AND ITS OPERATORS SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES,
              ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our total liability for any claims arising from the Service shall not exceed the amount
              you paid for the specific session giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to maintain high availability but do not guarantee uninterrupted access to the Service.
              We reserve the right to modify, suspend, or discontinue the Service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to refuse service, terminate accounts, or cancel sessions at our
              sole discretion, particularly if we believe you have violated these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Spain,
              without regard to its conflict of law provisions. Any disputes arising from these Terms
              shall be resolved in the courts of Barcelona, Spain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. We will notify users of significant changes
              by posting the new Terms on this page. Your continued use of the Service after changes
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, please contact us through our{' '}
              <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.
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
