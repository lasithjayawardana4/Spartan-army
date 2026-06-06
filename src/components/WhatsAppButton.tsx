"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const phoneNumber = "94715520324";
  const defaultMessage = "Hello Spartan Supplements, I would like to inquire about your products.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)] active:scale-95 transition-all duration-300 group cursor-pointer"
      title="Inquire on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-12" />
      <span className="absolute right-16 bg-black/90 text-white text-xs font-bold py-1.5 px-3 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Chat with Spartan
      </span>
    </a>
  );
};
export default WhatsAppButton;
