'use client';

import Footer1 from "../components/Footer1";
import Navbar from "../components/Navbar";


export default function ShippingPage() {

  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Shipping Information
        </h1>

        <div className="bg-white p-8 rounded-xl shadow space-y-6 text-gray-700">

          <p>
            We deliver products to retailers and customers across India
            through trusted logistics partners.
          </p>

          <h2 className="text-xl font-semibold">
            Processing Time
          </h2>

          <p>
            Orders are processed within 1–2 business days after confirmation.
          </p>

          <h2 className="text-xl font-semibold">
            Delivery Time
          </h2>

          <p>
            Standard delivery usually takes 3–7 business days depending
            on the location.
          </p>

          <h2 className="text-xl font-semibold">
            Shipping Charges
          </h2>

          <p>
            Shipping charges may vary based on product size,
            quantity, and delivery location.
          </p>

        </div>

      </main>

      <Footer1 />

    </div>
  );
}