import { AquaQuizReport } from "../../_components/report";

export default async function AquaQuizReportPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  return <AquaQuizReport meetingId={meetingId} />;
}
