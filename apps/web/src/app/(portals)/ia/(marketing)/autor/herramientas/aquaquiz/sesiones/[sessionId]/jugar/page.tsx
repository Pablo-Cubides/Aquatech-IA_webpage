import { AquaQuizPlayer } from "../../../_components/session";

export default async function AquaQuizPlayerPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <AquaQuizPlayer sessionId={sessionId} />;
}
