"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">🔒 SheNation – Privacy Policy</h1>
      <p>
        <strong>Effective Date:</strong> 25/07/2025
      </p>
      <ol className="list-decimal pl-6 space-y-4 mt-4">
        <li>
          <strong>Introduction:</strong> This policy explains how we collect,
          use, and protect your personal data.
        </li>
        <li>
          <strong>Information We Collect:</strong>
          <ul className="list-disc pl-6">
            <li>Personal: name, email, phone, gender, birthdate</li>
            <li>Mentorship: session and interaction details</li>
            <li>Technical: IP, browser type, stats</li>
            <li>Optional: files or notes uploaded</li>
          </ul>
        </li>
        <li>
          <strong>How We Use Your Information:</strong> For mentorship,
          personalization, communication, and platform improvement.
        </li>
        <li>
          <strong>Sharing:</strong> We may share info with:
          <ul className="list-disc pl-6">
            <li>Mentors or mentees during sessions</li>
            <li>Third-party services (e.g., hosting, email)</li>
            <li>Legal authorities if required</li>
          </ul>
        </li>
        <li>
          <strong>Security:</strong> We use HTTPS, password hashing, and access
          controls.
        </li>
        <li>
          <strong>Your Rights:</strong> You can access, correct, delete data, or
          opt out of promotions.
        </li>
        <li>
          <strong>Cookies:</strong> Used for UX and analytics. You can disable
          them in your browser.
        </li>
        <li>
          <strong>Children’s Privacy:</strong> Users must be 18+. We don’t
          knowingly collect data from children.
        </li>
        <li>
          <strong>Changes:</strong> Updates will be notified via email or
          in-app.
        </li>
        <li>
          <strong>Contact:</strong> Email: support@shenation.org | Website:
          http://localhost:3000
        </li>
      </ol>
    </div>
  );
}
