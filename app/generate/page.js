// app/generate/page.js  (server component)
import dynamic from "next/dynamic";

const GenerateClient = dynamic(() => import("../../components/GenerateClient"), { ssr: false });

export default function Page() {
  return <GenerateClient />;
}
