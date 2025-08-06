"use client";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">
        📜 SheNation – Terms of Service
      </h1>
      <p className="mb-4">
        <strong>Effective Date:</strong> 25/07/2025
      </p>
      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <strong>Introduction:</strong> These Terms govern your use of
          SheNation. By using our platform, you agree to them.
        </li>
        <li>
          <strong>Eligibility:</strong> You must be at least 18 years old to use
          SheNation.
        </li>
        <li>
          <strong>Services Provided:</strong>
          <ul className="list-disc pl-6">
            <li>Access to women’s empowerment programs</li>
            <li>Profile creation and management</li>
            <li>Scheduling and communication tools</li>
          </ul>
        </li>
        <li>
          <strong>Account Responsibilities:</strong> Keep your account
          credentials secure and notify us of unauthorized access.
        </li>
        <li>
          <strong>Acceptable Use:</strong> Don’t:
          <ul className="list-disc pl-6">
            <li>Use the platform for unlawful purposes</li>
            <li>Impersonate others or spread false information</li>
            <li>Disrupt functionality or upload harmful content</li>
          </ul>
        </li>
        <li>
          <strong>Intellectual Property:</strong> All content belongs to
          SheNation or licensors. No copying or redistribution without
          permission.
        </li>
        <li>
          <strong>Termination:</strong> We may suspend or terminate your access
          if you violate the Terms.
        </li>
        <li>
          <strong>Disclaimers:</strong> Services are provided “as is.” No
          guarantee of error-free or uninterrupted use.
        </li>
        <li>
          <strong>Limitation of Liability:</strong> We’re not liable for
          indirect or consequential damages.
        </li>
        <li>
          <strong>Changes to Terms:</strong> Updates will be communicated via
          email or in-app notifications.
        </li>
        <li>
          <strong>Governing Law:</strong> These Terms follow the laws of the
          Republic of Burundi.
        </li>
      </ol>
    </div>
  );
}
