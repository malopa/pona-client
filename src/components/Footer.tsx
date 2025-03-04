import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const links = [
    { title: 'About Us', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Contact Us', href: '#' },
    { title: 'Terms of Service', href: '#' },
    { title: 'Key', href: '/admin/login' }
  ];

  const socials = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Logo className="h-8 w-8 text-emerald-500" />
            <span className="ml-2 text-xl font-semibold">Pona Health</span>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-4">Download Our App Now!</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.ponahealth.mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.184l2.71-2.712 4.267 2.717a.99.99 0 0 1 0 1.692l-4.267 2.717-2.71-2.712 2.71-2.702zM5.865 2.658L14 10.794 5.865 18.93 5.865 2.658z"/>
                </svg>
                Play Store
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.06-.46-2.02-.45-3.12 0-1.37.62-2.095.53-2.97-.35-4.24-4.65-3.72-11.31.94-11.69.87.06 1.51.35 2.03.35.82 0 1.39-.35 2.35-.35.85 0 1.51.35 2.03.35.52 0 2.12-.87 3.12-.35-2.51 1.67-2.12 5.37.59 6.37-.52 1.67-1.24 3.32-1.89 4.99l.01.02zM12.03 6.3c-.02-2.15 1.66-3.87 3.57-3.92.26 2.12-1.57 3.95-3.57 3.95v-.03z"/>
                </svg>
                App Store
              </a>
            </div>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            {socials.map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="text-gray-400 hover:text-emerald-500 transition-colors"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
          {links.map(({ title, href }) => (
            <Link
              key={title}
              to={href}
              className="text-gray-400 hover:text-emerald-500 transition-colors"
            >
              {title}
            </Link>
          ))}
        </div>

        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Pona Health. All rights reserved.
        </div>
      </div>
    </footer>
  );
}