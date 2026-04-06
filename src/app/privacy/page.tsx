'use client';

import Footer1 from "../components/Footer1";
import Navbar from "../components/Navbar";


export default function PrivacyPage() {

  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Privacy Policy
        </h1>

        <div className="bg-white p-8 rounded-xl shadow space-y-6 text-gray-700">

          <p>
            We value your privacy and are committed to protecting your
            personal information.
          </p>

          <h2 className="text-xl font-semibold">
            Information We Collect
          </h2>

          <p>
            We may collect personal details such as name, email address,
            phone number, and order information when you use our platform.
          </p>

          <h2 className="text-xl font-semibold">
            How We Use Information
          </h2>

          <ul className="list-disc pl-6 space-y-2">

            <li>To process orders and provide services</li>

            <li>To improve our platform and customer experience</li>

            <li>To communicate with customers regarding orders</li>

          </ul>

          <h2 className="text-xl font-semibold">
            Data Protection
          </h2>

          <p>
            We implement appropriate security measures to protect
            your information against unauthorized access.
          </p>

          <h2 className="text-xl font-semibold">
            Contact
          </h2>

          <p>
            If you have questions about this Privacy Policy,
            contact us at fictilecore@gmail.com.
          </p>

        </div>

      </main>

      <Footer1 />

    </div>
  );
}