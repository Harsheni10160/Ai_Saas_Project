import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return new NextResponse("Missing workspace ID", { status: 400 });
        }

        // Total conversations
        const totalConversations = await prisma.conversation.count({
            where: { workspaceId },
        });

        // Total messages
        const totalMessages = await prisma.message.count({
            where: { conversation: { workspaceId } },
        });

        // Messages this month
        const startDate = startOfMonth(new Date());
        const endDate = endOfMonth(new Date());

        const messagesThisMonth = await prisma.message.count({
            where: {
                conversation: { workspaceId },
                createdAt: { gte: startDate, lte: endDate },
            },
        });

        // Daily message count (last 30 days)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date;
        });

        const dailyMessages = await Promise.all(
            last30Days.map(async (date) => {
                const start = new Date(date);
                start.setHours(0, 0, 0, 0);
                const end = new Date(date);
                end.setHours(23, 59, 59, 999);

                const count = await prisma.message.count({
                    where: {
                        conversation: { workspaceId },
                        createdAt: { gte: start, lte: end },
                    },
                });

                return {
                    date: date.toISOString().split("T")[0],
                    count,
                };
            })
        );

        // Top questions (most common user messages)
        const recentMessages = await prisma.message.findMany({
            where: {
                conversation: { workspaceId },
                role: "user",
            },
            select: { content: true },
            take: 10,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            totalConversations,
            totalMessages,
            messagesThisMonth,
            dailyMessages,
            topQuestions: recentMessages.map((m) => m.content),
        });
    } catch (error) {
        console.error("ANALYTICS_ERROR", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
