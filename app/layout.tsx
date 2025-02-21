import type { Metadata } from "next";
import Image from 'next/image';
import UVLogo from '@/public/UVHorizontal-White.svg';
import "./globals.css";

export const metadata: Metadata = {
  title: "Panna Labs Voice Agent",
  description: "Demonstration to create a call with an AI agent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="bg-white text-black">
        <div className="flex mx-auto justify-between my-4 max-w-[1206px]">
          <Image
            src={UVLogo}
            alt="Ultravox logo and wordmark"
            width={150}
            height={50}
          />
          <a href="mailto:contact@pannalabs.ai" >
            <button className="hover:bg-gray-700 hover:text-white px-6 py-2 border-2 rounded-[3px] w-40 mb-2">
              Contact Us
            </button>
          </a>
        </div>
        {children}
      </body>
    </html>
  );
}
