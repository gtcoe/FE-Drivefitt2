import Link from "next/link";
import Image from "next/image";

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logo.svg"
            alt="Drive FITT"
            width={200}
            height={60}
            className="mx-auto"
          />
        </div>

        {/* 404 Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-[#1D1D1D] rounded-full flex items-center justify-center">
            <span className="text-4xl text-[#00DBDC] font-bold">404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-semibold text-white mb-4">
          Job Not Found
        </h1>
        <p className="text-[#BFBFBF] mb-8 leading-relaxed">
          The job posting you're looking for doesn't exist, has been removed, or
          is no longer available.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/careers"
            className="inline-block w-full bg-[#00DBDC] text-[#0D0D0D] font-medium py-3 px-6 rounded-lg hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC] border border-transparent transition-all duration-200"
          >
            Browse All Jobs
          </Link>
          <Link
            href="/"
            className="inline-block w-full text-[#BFBFBF] hover:text-white transition-colors duration-200"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-[#333333]">
          <p className="text-sm text-[#8A8A8A]">
            If you believe this is an error, please{" "}
            <Link href="/contact-us" className="text-[#00DBDC] hover:underline">
              contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
