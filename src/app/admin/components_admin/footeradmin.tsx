import React from "react";
import Link from "next/link";

export function FooterAdmin(): JSX.Element {
  return (
    <footer className="bg-black text-white py-8 mt-auto w-full">
      <div className="container mx-auto px-8">
        {/* Footer Content */}
        <div className="flex flex-wrap justify-between">
          {/* Brand and Description */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">WattWallet</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering clean energy markets with transparency and efficiency.
              Seamlessly trade renewable energy credits for a sustainable
              tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/admin" className="hover:underline">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/market" className="hover:underline">
                  MarketPlace
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Back to Landing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: admin@wattwallet.com</li>
              <li>Phone: +91 2828282828</li>
              <li>Address: 123 Renewable Lane, Bengaluru, Electronic City</li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} WattWallet. Admin Portal. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
