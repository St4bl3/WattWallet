// components/ModalProvider.tsx

"use client";

import { useEffect } from "react";
import Modal from "react-modal";

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    // Check if the element exists before setting it
    const appElement = document.querySelector("#__next");
    if (appElement) {
      Modal.setAppElement(appElement as HTMLElement);
    } else {
      console.warn(
        "React Modal: #__next element not found. Using document.body as fallback."
      );
      Modal.setAppElement(document.body);
    }
  }, []);

  return <>{children}</>;
};

export default ModalProvider;
