import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
});

export const PLANS = {
    FREE: {
        name: "Free",
        price: 0,
        queryLimit: 100,
        priceId: null,
    },
    STARTER: {
        name: "Starter",
        price: 29,
        queryLimit: 1000,
        priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter_id",
    },
    PRO: {
        name: "Pro",
        price: 99,
        queryLimit: 10000,
        priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_id",
    },
};
