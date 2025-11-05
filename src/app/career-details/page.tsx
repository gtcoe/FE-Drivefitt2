import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Details | Drive FITT Premium Club",
  description:
    "View detailed information about career opportunities at Drive FITT.",
};

export default function CareerDetailsPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">Career Details</h1>
        <p className="text-gray-400">This page is coming soon...</p>
      </div>
    </main>
  );
}
