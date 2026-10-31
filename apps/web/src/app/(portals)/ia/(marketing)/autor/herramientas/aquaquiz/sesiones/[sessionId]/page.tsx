import { AquaQuizHost } from "../../_components/session";

export default async function AquaQuizHostPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <AquaQuizHost sessionId={sessionId} />;
}
