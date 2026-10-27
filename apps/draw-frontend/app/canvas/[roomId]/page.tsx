import { RoomCanvas } from "@/components/canvas";

export default async function Canvas({  params }: {
  params: { roomId: string };
}) {
  const roomId = (await params).roomId;

  console.log(roomId);
  
  return <RoomCanvas roomId={roomId} />;
}
