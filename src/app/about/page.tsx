'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer1 from '../components/Footer1';

export default function AboutPage() {

  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-[1300px] mx-auto px-6 py-12">

        {/* HERO SECTION */}

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="text-center mb-16"
        >

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Building Smart Digital Solutions 🚀
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            We are a technology-driven company focused on delivering
            innovative software solutions, enterprise mobile applications,
            and scalable commerce platforms that empower businesses
            across India.
          </p>

        </motion.div>


        {/* COMPANY STORY */}

        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">

          <div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Story 🌱
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Our company was founded with a vision to build powerful
              technology solutions for real-world industries.
              We combine software engineering, mobile platforms,
              and commerce systems to help businesses operate
              more efficiently and scale faster.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Our team specializes in product engineering,
              digital transformation, and modern e-commerce platforms
              that connect manufacturers, retailers, and customers
              across India.
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-8">

            <h3 className="font-semibold text-lg mb-4">
              What Drives Us
            </h3>

            <ul className="space-y-3 text-gray-600">

              <li>✔ Innovation in traditional industries</li>
              <li>✔ Scalable technology platforms</li>
              <li>✔ Automation for business efficiency</li>
              <li>✔ Reliable and secure software systems</li>

            </ul>

          </div>

        </section>


        {/* PRODUCTS SECTION */}

        <section className="mb-20">

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Products & Platforms 💡
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* PRODUCT 1 */}

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">

              <h3 className="text-xl font-bold mb-4">
                CashewMOM
              </h3>

              <p className="text-gray-600 leading-relaxed">
                CashewMOM is an advanced Android-based enterprise
                application designed for the cashew processing industry.
                It provides end-to-end tracking of cashew nut processing,
                stock book maintenance, production monitoring,
                and operational analytics.
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Industry: Agro Processing Technology
              </p>

            </div>


            {/* PRODUCT 2 */}

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">

              <h3 className="text-xl font-bold mb-4">
                Android App Development
              </h3>

              <p className="text-gray-600 leading-relaxed">
                We build scalable Android enterprise applications
                for industries including manufacturing,
                inventory management, logistics, and
                operational workflow automation.
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Industry: Enterprise Software
              </p>

            </div>


            {/* PRODUCT 3 */}

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">

              <h3 className="text-xl font-bold mb-4">
                Toys E-Commerce Supply Network
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Our e-commerce platform connects toy suppliers
                with retailers across India.
                We manage product sourcing, catalog management,
                and logistics support for retailers nationwide.
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Industry: Retail Supply & Distribution
              </p>

            </div>

          </div>

        </section>


        {/* INVESTOR SECTION */}

        <section className="bg-white rounded-2xl shadow p-10 mb-20">

          <h2 className="text-3xl font-bold text-center mb-10">
            Why Investors Believe in Us 📈
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">
                Growing Market
              </h3>
              <p className="text-gray-600 text-sm">
                Expanding industries in AgroTech and Retail Commerce
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">
                Scalable Technology
              </h3>
              <p className="text-gray-600 text-sm">
                Platforms designed for nationwide adoption
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">
                Industry Solutions
              </h3>
              <p className="text-gray-600 text-sm">
                Products solving real operational challenges
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">
                Nationwide Reach
              </h3>
              <p className="text-gray-600 text-sm">
                Retail supply network across India
              </p>
            </div>

          </div>

        </section>


        {/* VISION SECTION */}

        <section className="text-center max-w-3xl mx-auto mb-20">

          <h2 className="text-3xl font-bold mb-6">
            Our Vision 🌍
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Our vision is to build scalable technology platforms that
            transform traditional industries through digital innovation.
            By combining software engineering, mobile technologies,
            and e-commerce infrastructure, we aim to create
            long-term value for businesses, partners, and investors.
          </p>

        </section>

      </main>

      <Footer1 />

    </div>

  );
}