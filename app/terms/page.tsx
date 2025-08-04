import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#E9E9D8] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/brocolli.svg"
              alt="Broccoli logo"
              width={320}
              height={107}
              className="w-64 h-auto mx-auto"
            />
          </Link>
          <h1 className="text-4xl font-bold text-[#375654] mb-4">Terms of Service</h1>
          <p className="text-lg text-[#375654] opacity-80">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Broccoli! These Terms of Service ("Terms") govern your use of our grocery planning application and services. 
                By accessing or using Broccoli, you agree to be bound by these Terms. If you disagree with any part of these terms, 
                then you may not access the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Broccoli is an AI-powered grocery planning application that helps you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Create and manage grocery shopping lists</li>
                <li>Receive AI-powered meal and shopping recommendations</li>
                <li>Collaborate with others in "grocery pods"</li>
                <li>Track shopping goals and achievements</li>
                <li>Connect with grocery stores and services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">User Accounts and Registration</h2>
              <h3 className="text-xl font-semibold text-[#375654] mb-3">Account Creation</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be at least 13 years old to create an account</li>
                <li>One person may not maintain more than one account</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#375654] mb-3">Account Responsibilities</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You are responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Keep your account information up to date</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Acceptable Use Policy</h2>
              <h3 className="text-xl font-semibold text-[#375654] mb-3">You agree NOT to:</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the service for any illegal purposes or activities</li>
                <li>Share inappropriate, offensive, or harmful content</li>
                <li>Attempt to reverse engineer, hack, or compromise our systems</li>
                <li>Spam other users or send unsolicited communications</li>
                <li>Impersonate others or create fake accounts</li>
                <li>Upload malicious code or attempt to disrupt the service</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Commercially exploit the service without our permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Grocery Pods and Social Features</h2>
              <h3 className="text-xl font-semibold text-[#375654] mb-3">Pod Participation</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>When you join a grocery pod, your shopping lists may be visible to other pod members</li>
                <li>Be respectful and collaborative when participating in shared shopping activities</li>
                <li>Pod creators have administrative rights within their pods</li>
                <li>You can leave a pod at any time through your account settings</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#375654] mb-3">Content Sharing</h3>
              <p className="text-gray-700 leading-relaxed">
                When you share content in pods (lists, comments, recommendations), you grant other pod members 
                permission to view and interact with that content for collaborative shopping purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">AI Recommendations and Disclaimers</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <h3 className="text-xl font-semibold text-[#375654] mb-2">Important Disclaimers</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Dietary Advice:</strong> Our AI provides suggestions only. Always consult healthcare professionals for dietary advice</li>
                  <li><strong>Allergies:</strong> We are not responsible for allergen information accuracy. Always verify ingredients yourself</li>
                  <li><strong>Nutritional Information:</strong> Nutritional data is for informational purposes only</li>
                  <li><strong>Store Prices:</strong> Prices and availability may vary from what is displayed in the app</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Intellectual Property Rights</h2>
              <h3 className="text-xl font-semibold text-[#375654] mb-3">Our Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Broccoli app, including its design, code, algorithms, content, and the Broccoli brand and logo, 
                are owned by us and protected by intellectual property laws. You may not copy, modify, or redistribute these materials.
              </p>

              <h3 className="text-xl font-semibold text-[#375654] mb-3">Your Content</h3>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of the shopping lists, preferences, and other content you create. However, you grant us a license 
                to use this content to provide and improve our services (like generating better AI recommendations).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Third-Party Integrations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Broccoli may integrate with third-party services such as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Grocery store websites and APIs</li>
                <li>Payment processors</li>
                <li>Social media platforms</li>
                <li>Delivery services</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These integrations are subject to the third party's own terms of service. We are not responsible for third-party services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Service Availability and Modifications</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We strive to keep Broccoli available 24/7, but cannot guarantee 100% uptime</li>
                <li>We may modify, suspend, or discontinue features with or without notice</li>
                <li>We may perform maintenance that temporarily affects service availability</li>
                <li>We reserve the right to impose usage limits to ensure fair access for all users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Account Termination</h2>
              <h3 className="text-xl font-semibold text-[#375654] mb-3">Termination by You</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may terminate your account at any time through your account settings or by contacting us. 
                Upon termination, your data will be handled according to our Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-[#375654] mb-3">Termination by Us</h3>
              <p className="text-gray-700 leading-relaxed">
                We may suspend or terminate your account if you violate these Terms, engage in harmful activities, 
                or for other legitimate business reasons. We will provide notice when reasonably possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Limitation of Liability</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Broccoli is provided "as is" without warranties of any kind</li>
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our total liability is limited to the amount you paid us in the past 12 months</li>
                  <li>We are not responsible for food safety, dietary outcomes, or purchase decisions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Governing Law and Disputes</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>These Terms are governed by the laws of [Your Jurisdiction]</li>
                <li>Any disputes will be resolved through binding arbitration</li>
                <li>You waive your right to participate in class action lawsuits</li>
                <li>If any provision is deemed invalid, the remaining provisions continue in effect</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update these Terms from time to time. We will notify you of significant changes by email or 
                through the app. Your continued use of Broccoli after changes become effective constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[#E9E9D8] p-4 rounded-lg">
                <p className="text-[#375654] font-semibold">Broccoli Legal Team</p>
                <p className="text-gray-700">Email: legal@broccoli.app</p>
                <p className="text-gray-700">Website: broccoli.app</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Acknowledgment</h2>
              <p className="text-gray-700 leading-relaxed">
                By using Broccoli, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                You also acknowledge that you have read our Privacy Policy, which explains how we collect and use your information.
              </p>
            </section>

          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-[#375654] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2d4240] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}