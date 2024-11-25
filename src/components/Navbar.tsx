"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

export function Navbar(): JSX.Element {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full backdrop-blur-lg bg-transparent transition-transform duration-300 ease-in-out border-b border-neutral-300 z-50 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-12 py-6">
        <div className="flex items-center">
          <span
            className="text-4xl font-bold tracking-wide"
            style={{ fontFamily: '"Montserrat", sans-serif', color: "black" }}
          >
            WattWallet
          </span>
        </div>
        <ul className="flex items-center space-x-8 text-lg font-medium">
          <li>
            <Link href="/home" className="hover:underline text-black">
              Home
            </Link>
          </li>
          <li>
            <Link href="/admin" className="hover:underline text-black">
              Admin
            </Link>
          </li>
          <li>
            <Link href="/user" className="hover:underline text-black">
              User
            </Link>
          </li>
        </ul>
        <div className="flex items-center">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <button
              className="bg-transparent border border-black text-black px-6 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition-all"
              onClick={() => openSignIn()}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
