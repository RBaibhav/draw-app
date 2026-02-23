import RoomCanvas from "@/components/roomCanvas";

export default async function Canvas({  params }: {
  params: { roomId: string };
}) {
  const roomId = (await params).roomId;

  console.log(roomId);
  
  return <RoomCanvas roomId={roomId} />;
}
