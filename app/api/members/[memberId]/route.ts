import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }
    if (!(await params).memberId) {
      return new NextResponse("Member ID is required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: (await params).memberId,
            profileId: {
              not: profile.id, // Ensure the member is not the current profile
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc", // Order by role
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Error in Member DELETE request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }
    if (!(await params).memberId) {
      return new NextResponse("Member ID is required", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: (await params).memberId,
              profileId: {
                not: profile.id, // Ensure the member is not the current profile
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc", // Order by role
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("Error in Member PATCH request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
