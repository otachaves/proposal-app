import dynamic from "next/dynamic";

const ProposalDocument = dynamic(() => import("./ProposalDocument"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-400 text-sm">Preparing proposal...</div>
    </div>
  ),
});

export default function ProposalPage() {
  return <ProposalDocument />;
}
