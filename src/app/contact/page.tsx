'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer1 from '../components/Footer1';

export default function ContactPage() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    alert("Thank you for contacting us! We will respond soon.");

    setForm({
      name:'',
      email:'',
      phone:'',
      company:'',
      message:''
    });

  };

  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-12">

        {/* HEADER */}

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="text-center mb-14"
        >

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question, partnership inquiry, or interested in our
            products and services? Our team is ready to help.
          </p>

        </motion.div>


        <div className="grid md:grid-cols-2 gap-10">

          {/* CONTACT INFORMATION */}

          <div className="bg-white p-8 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6 text-gray-700">

              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">+91 9482002071</p>
              </div>

              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">fictilecore@gmail.com</p>
              </div>

              <div>
                <p className="font-semibold">Business Hours</p>
                <p className="text-gray-600">
                  Monday – Saturday <br/>
                  9:00 AM – 6:00 PM IST
                </p>
              </div>

            </div>

            <div className="mt-8 text-gray-600 leading-relaxed">

              <p>
                We welcome partnerships, business inquiries,
                and investor discussions related to our platforms
                including enterprise Android solutions,
                Cashew processing management systems,
                and retail supply chain platforms.
              </p>

            </div>

          </div>


          {/* CONTACT FORM */}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow space-y-5"
          >

            <h2 className="text-2xl font-bold mb-4">
              Send Us a Message
            </h2>

            {/* NAME */}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            />

            {/* EMAIL */}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            />

            {/* PHONE */}

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            />

            {/* COMPANY */}

            <input
              type="text"
              name="company"
              placeholder="Company / Organization"
              value={form.company}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            />

            {/* MESSAGE */}

            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            />

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </main>

      <Footer1 />

    </div>

  );
}