import { Liveblocks } from "@liveblocks/node";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

export async function POST(req: Request) {
  const userSession = await auth();

  // Get the users room, and invitations to rooms
  const user = await db.user.findUniqueOrThrow({
    where: { id: userSession?.user.id },
    include: {
      ownedRooms: true,
      roomInvites: {
        include: {
          room: true,
        },
      },
    },
  });

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.email ?? "Anonymous",
    },
  });

  // Limit to 10 rooms per token to avoid Liveblocks limit
  const maxRoomsPerToken = 10;
  
  // Add owned rooms (up to limit)
  const ownedRoomsToAdd = user.ownedRooms.slice(0, maxRoomsPerToken);
  ownedRoomsToAdd.forEach((room) => {
    session.allow(`room:${room.id}`, session.FULL_ACCESS);
  });

  // Add room invites (up to remaining limit)
  const remainingSlots = maxRoomsPerToken - ownedRoomsToAdd.length;
  const invitesToAdd = user.roomInvites.slice(0, remainingSlots);
  invitesToAdd.forEach((invite) => {
    session.allow(`room:${invite.room.id}`, session.FULL_ACCESS);
  });

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
