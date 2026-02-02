import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        return new NextResponse("Webhook signature verification failed", { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        ) as any;

        await prisma.workspace.update({
            where: { id: session.metadata?.workspaceId },
            data: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: (subscription.items.data[0].price as Stripe.Price).id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                plan: session.metadata?.plan as any,
                queryLimit: (subscription.items.data[0].price as Stripe.Price).id.includes("pro") ? 10000 : 1000,
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object as any;
        const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
        ) as any;

        await prisma.workspace.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                stripePriceId: (subscription.items.data[0].price as Stripe.Price).id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}
