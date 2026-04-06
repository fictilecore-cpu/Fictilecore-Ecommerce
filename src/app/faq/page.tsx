'use client';

import Footer1 from "../components/Footer1";
import Navbar from "../components/Navbar";

export default function ReturnsPage() {

  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Returns & Exchanges
        </h1>

        <div className="bg-white p-8 rounded-xl shadow space-y-6 text-gray-700">

          <p>
            We want our customers to be satisfied with every purchase.
            If you receive a damaged or incorrect product, you may request
            a return or exchange.
          </p>

          <h2 className="text-xl font-semibold">
            Return Policy
          </h2>

          <ul className="list-disc pl-6 space-y-2">

            <li>Returns must be requested within 7 days of delivery.</li>

            <li>Products must be unused and in original packaging.</li>

            <li>Proof of purchase is required.</li>

          </ul>

          <h2 className="text-xl font-semibold">
            Exchange Policy
          </h2>

          <ul className="list-disc pl-6 space-y-2">

            <li>Exchanges are allowed for defective or damaged items.</li>

            <li>Replacement will be shipped once the returned item is received.</li>

          </ul>

          <p>
            For return or exchange requests, please contact us at
            fictilecore@gmail.com or call +91 9482002071.
          </p>

        </div>

      </main>

      <Footer1 />

    </div>
  );
}