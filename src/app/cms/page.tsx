import { readContent } from "@/lib/content";
import { CmsDashboard } from "./cms-dashboard";

export default async function CmsPage() {
  const initialContent = await readContent();

  return <CmsDashboard initialContent={initialContent} />;
}
