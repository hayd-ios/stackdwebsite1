export default function EULA() {
  return (
    <div className="bg-gray-950 min-h-screen text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          End User License Agreement (EULA)
        </h1>

        <div className="space-y-6 text-gray-300">
          <p className="mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              1. Agreement to Terms
            </h2>
            <p>
              By downloading, installing, or using Stackd ("the App"), you agree
              to be bound by these terms. If you do not agree to these terms, do
              not use the App.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              2. License Grant
            </h2>
            <p>
              Subject to your compliance with these terms, Stackd grants you a
              limited, non-exclusive, non-transferable, revocable license to use
              the App for your personal, non-commercial use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              3. Restrictions
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Modify, reverse engineer, or create derivative works of the App
              </li>
              <li>Use the App for any illegal purpose</li>
              <li>
                Share or distribute content that violates any laws or rights
              </li>
              <li>
                Attempt to gain unauthorized access to the App or its systems
              </li>
              <li>Use the App to transmit malware or harmful code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              4. Privacy
            </h2>
            <p>
              Your use of the App is also governed by our Privacy Policy, which
              is incorporated into this agreement by reference.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              5. User Content
            </h2>
            <p>
              You retain ownership of any content you share through the App. By
              sharing content, you grant Stackd a worldwide, non-exclusive
              license to use, store, and distribute that content for the purpose
              of providing and improving the App's services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              6. Termination
            </h2>
            <p>
              We may terminate or suspend your access to the App immediately,
              without prior notice, for any reason, including if you breach
              these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              7. Disclaimers
            </h2>
            <p>
              THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. STACKD
              DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
              PARTICULAR PURPOSE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              8. Limitation of Liability
            </h2>
            <p>
              STACKD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO
              YOUR USE OF THE APP.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes through the App or via email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              10. Contact Information
            </h2>
            <p>
              For questions about these terms, please contact us at:
              info@stackdsocial.com
            </p>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Stackd. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
