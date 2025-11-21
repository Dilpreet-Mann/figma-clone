import { redirect } from "next/navigation";
import Link from "next/link";
import Canvas from "~/components/canvas/Canvas";
import { Room } from "~/components/liveblocks/Room";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

type ParamsType = Promise<{ id: string }>;

export default async function Page({ params }: { params: ParamsType }) {
  const { id } = await params;

  const session = await auth();

  const room = await db.room.findUnique({
    where: { id: id },
    select: {
      title: true,
      ownerId: true,
      roomInvites: {
        select: {
          user: true,
        },
      },
    },
  });

  if (!room) redirect("/404");

  const inviteeUserIds = room.roomInvites.map((invite) => invite.user.id);
  if (
    !inviteeUserIds.includes(session?.user.id ?? "") &&
    session?.user.id !== room.ownerId
  ) {
    redirect("/404");
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header with room title */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <Link 
              href="/dashboard" 
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                {room.title}
              </h1>
              <div className="h-8 w-1 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
      {/* Canvas container */}
      <div className="relative z-20 h-full w-full pt-20">
        <Room roomId={"room:" + id}>
          <Canvas
            roomName={room.title}
            roomId={id}
            othersWithAccessToRoom={room.roomInvites.map((x) => x.user)}
          />
        </Room>
      </div>
    </div>
  );
}
