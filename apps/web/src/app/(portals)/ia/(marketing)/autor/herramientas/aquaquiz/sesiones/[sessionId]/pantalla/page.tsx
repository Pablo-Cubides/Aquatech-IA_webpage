import { AquaQuizProjection } from "../../../_components/session";

export default async function AquaQuizProjectionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <AquaQuizProjection sessionId={sessionId} />;
}
