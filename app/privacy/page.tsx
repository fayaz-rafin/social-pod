import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-[#375654] mb-4">Privacy Policy</h1>
          <p className="text-lg text-[#375654] opacity-80">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Broccoli ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our grocery planning application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-[#375654] mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Name and email address when you create an account</li>
                <li>Profile information you choose to provide</li>
                <li>Shopping preferences and dietary restrictions</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#375654] mb-3">Usage Data</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Grocery lists and shopping items you create</li>
                <li>App usage patterns and preferences</li>
                <li>Device information and IP address</li>
                <li>Location data (only if you grant permission)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and maintain our grocery planning services</li>
                <li>Personalize your shopping experience with AI recommendations</li>
                <li>Enable social features like group shopping pods</li>
                <li>Send you important updates about your account</li>
                <li>Improve our app through analytics and user feedback</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your data only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                <li><strong>Service providers:</strong> Trusted partners who help us operate our app (e.g., Supabase for data storage)</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Pod members:</strong> Shopping lists shared within your chosen grocery pods</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and authorization</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data by our team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from promotional communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze app usage. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Broccoli is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
                If you are a parent and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our app may contain links to third-party services (like grocery store websites). This privacy policy does not apply to those external services. 
                We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. 
                We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#375654] mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <div className="bg-[#E9E9D8] p-4 rounded-lg">
                <p className="text-[#375654] font-semibold">Broccoli Privacy Team</p>
                <p className="text-gray-700">Email: privacy@broccoli.app</p>
                <p className="text-gray-700">Website: broccoli.app</p>
              </div>
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
