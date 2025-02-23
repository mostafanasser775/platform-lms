import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
export const revalidate = 0; // Disable caching

export default function PurchaseFailurePage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <XCircle className="text-red-500 animate-bounce duration-1000" size={80} />
      <h1 className="text-3xl font-bold text-red-600 mt-4">Purchase Failed</h1>
      <p className="text-gray-700 mt-2">Something went wrong with your transaction. Please try again.</p>
      
      <div className="mt-6 flex space-x-4">
       
        <Button asChild variant="outline">
          <Link href="/">
          Go to Homepage

          </Link>
        </Button>
      </div>
    </div>
  );
}
