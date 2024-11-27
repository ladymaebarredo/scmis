import {
  MenuIcon,
  MailIcon,
  CalendarIcon,
  ClipboardListIcon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="font-sans">
      {/* Navigation */}
      <nav className="px-8 py-4 bg-red-950 flex items-center justify-between text-white fixed w-full top-0 left-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="logo" className="w-10" />
          <h1 className="hidden md:block text-xl font-bold">SPC CLINIC</h1>
          <MenuIcon className="md:hidden w-8 h-8" />
        </div>
        <div className="flex gap-6 items-center">
          <button className="bg-white px-5 py-2 rounded-md text-red-950">
            <Link to="/login">Login</Link>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="h-screen bg-red-100 flex flex-col justify-center items-center text-center"
      >
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-5xl font-extrabold text-red-950 mb-4">
            School Clinic Management Information System
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Manage your appointments and request medical certificates with ease.
            Designed for students and employees to streamline healthcare
            services.
          </p>
          <Link to="/register">
            <button className="bg-red-950 text-white px-6 py-3 rounded-md text-lg hover:bg-red-800 transition">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-red-950 mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <CalendarIcon className="w-12 h-12 text-red-950 mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Manage Appointments
                </h3>
                <p className="text-gray-600">
                  Schedule, modify, and track your appointments effortlessly
                  through our intuitive system.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <ClipboardListIcon className="w-12 h-12 text-red-950 mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Request Medical Certificates
                </h3>
                <p className="text-gray-600">
                  Easily request and receive medical certificates for various
                  needs.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <MailIcon className="w-12 h-12 text-red-950 mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  User-Friendly Interface
                </h3>
                <p className="text-gray-600">
                  Our system is designed with user experience in mind, ensuring
                  a smooth and efficient process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-8 bg-red-950 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg mb-8">
            Have questions or need support? Get in touch with us for assistance.
          </p>
          <a
            href="mailto:support@example.com"
            className="bg-white text-red-950 px-6 py-3 rounded-md text-lg hover:bg-gray-200 transition"
          >
            Email Support
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black p-6 text-white text-center">
        <p>
          &copy; {new Date().getFullYear()} School Clinic Management Information
          System. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
