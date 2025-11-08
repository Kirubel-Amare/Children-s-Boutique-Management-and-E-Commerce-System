// src/app/contact/page.tsx (updated data)
'use client';

import Layout from '@/components/layout/Layout';
import { HeroSection } from '@/components/contact/HeroSection';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { StoreHours } from '@/components/contact/StoreHours';
import { ContactForm } from '@/components/contact/ContactForm';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const CONTACT_ITEMS = [
  {
    icon: PhoneIcon,
    title: 'Phone',
    content: '+251 955901762',
    description: 'Call us directly for immediate assistance',
    action: {
      label: 'Call now',
      href: 'tel:+251955901762',
      type: 'phone' as const
    }
  },
  {
    icon: EnvelopeIcon,
    title: 'Email',
    content: 'akirubel8@gmail.com',
    description: 'Send us an email anytime',
    action: {
      label: 'Send email',
      href: 'mailto:akirubel8@gmail.com',
      type: 'email' as const
    }
  },
  {
    icon: MapPinIcon,
    title: 'Store Location',
    content: 'Deneba CBE Street',
    description: 'Fashion City, FC 12345',
    action: {
      label: 'Get directions',
      href: '#',
      type: 'map' as const
    }
  },
  {
    icon: ClockIcon,
    title: 'Response Time',
    content: 'Within 24 hours',
    description: 'We respond to all inquiries promptly'
  }
];

const STORE_HOURS = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', isOpen: true },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM', isOpen: true },
  { day: 'Sunday', hours: 'Closed', isOpen: false }
];

export default function ContactPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <HeroSection
          title="Get In Touch"
          subtitle="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        />

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Let's Talk</h2>
                
                <ContactInfo items={CONTACT_ITEMS} />

                <StoreHours hours={STORE_HOURS} />

                {/* Additional Info */}
                <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Why Choose Us?</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>✅ Premium quality children's clothing</li>
                    <li>✅ Fast and reliable shipping</li>
                    <li>✅ Excellent customer support</li>
                    <li>✅ Secure payment options</li>
                    <li>✅ Easy returns and exchanges</li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}