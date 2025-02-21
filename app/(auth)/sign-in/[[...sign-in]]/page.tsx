"use client";

import { SignIn } from "@clerk/nextjs";

export default function CustomSignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 w-full">
      

      <div className="clerk-sign-in">
          <SignIn
            appearance={{
              elements: {
                formFieldInput:
                  "p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ease-in-out duration-200", // Input Fields
                formButtonPrimary:
                  "w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all ease-in-out duration-200", // Primary Button
                formButtonSecondary:
                  "w-full py-3 mt-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all ease-in-out duration-200", // Secondary Button
                formHeaderTitle: "text-2xl font-semibold text-gray-800 mb-4", // Title Styling
                formHeaderSubtitle: "text-sm text-gray-500", // Subtitle Styling
                formErrorMessage: "text-sm text-red-500 mt-2", // Error Message Styling
                formLinkText: "text-blue-600 font-semibold hover:underline", // Link Text Styling
              },
            }}
          />
        </div>

    </div>
  );
}
