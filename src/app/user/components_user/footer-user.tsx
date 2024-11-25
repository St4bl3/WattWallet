import React from "react";
import Link from "next/link";

export function Footeruser(): JSX.Element {
  return (
    <footer className="bg-black text-white py-8 mt-auto w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Branding Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">WattWallet</h2>
            <p className="text-sm text-gray-400">
              Empowering clean energy markets with transparency and efficiency.
              Seamlessly trade renewable energy credits for a sustainable
              tomorrow.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0 mt-8 md:mt-0">
            <h3 className="text-xl font-semibold mb-4">User Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/user" className="hover:underline text-gray-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/user/store"
                  className="hover:underline text-gray-300"
                >
                  Store
                </Link>
              </li>
              <li>
                <Link
                  href="/user/transactions"
                  className="hover:underline text-gray-300"
                >
                  Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@wattwallet.com</li>
              <li>Phone: +91 2828282828</li>
              <li>Address: 123 Renewable Lane, Bengaluru, Electronic City</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} WattWallet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
