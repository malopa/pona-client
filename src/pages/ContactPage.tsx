import React from 'react';
import { Mail, MapPin, Phone, Send, Clock, Globe2, MessageSquare } from 'lucide-react';

const offices = [
  {
    city: 'Dar es Salaam',
    country: 'Tanzania',
    address: 'Msasani Peninsula, Plot 1479',
    area: 'Masaki',
    flag: '🇹🇿'
  },
  {
    city: 'Johannesburg',
    country: 'South Africa',
    address: '90 Rivonia Road, Sandton',
    area: 'Gauteng',
    flag: '🇿🇦'
  }
];

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Our friendly team is here to help.',
    info: 'info@ponahealth.com',
    link: 'mailto:info@ponahealth.com',
    color: 'emerald'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: '24/7 emergency support available.',
    info: '+255687511886',
    link: 'tel:+255687511886',
    color: 'blue'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team.',
    info: 'Available 24/7',
    link: '#',
    color: 'purple'
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We'd Love to Hear From You
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you have a question about our services, pricing, or anything else, 
            our team is ready to answer all your questions.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method) => (
            <a
              key={method.title}
              href={method.link}
              className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300
                       transform hover:-translate-y-1 border-b-4 border-${method.color}-500
                       group`}
            >
              <div className={`w-14 h-14 bg-${method.color}-100 rounded-xl mb-4
                           flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <method.icon className={`w-7 h-7 text-${method.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 mb-4">{method.description}</p>
              <p className={`text-${method.color}-600 font-semibold`}>{method.info}</p>
            </a>
          ))}
        </div>

        {/* Office Locations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((office) => (
              <div
                key={office.city}
                className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300
                         transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{office.flag}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{office.city}</h3>
                    <p className="text-gray-600">{office.country}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{office.address}</p>
                      <p className="text-gray-600">{office.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-emerald-500" />
                    <p className="text-gray-600">Mon - Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Send Us a Message
            </h2>
            <form className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-300"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-300"
                  placeholder="Doe"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-300"
                  placeholder="john@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-300"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
                           py-4 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                           hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                           active:scale-98 font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
              <Globe2 className="w-5 h-5 text-emerald-500" />
              <span>We typically respond within 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}