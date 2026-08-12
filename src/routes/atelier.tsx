import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "Custom Order Atelier — Wendy's Bakehouse" },
      {
        name: "description",
        content:
          "Commission a custom cake: confirm fulfillment, reserve your date, choose flavors and secure your booking deposit.",
      },
      { property: "og:title", content: "Custom Order Atelier — Wendy's Bakehouse" },
      {
        property: "og:description",
        content: "A guided four-step commission intake for custom cakes and sugar work.",
      },
    ],
  }),
  component: AtelierPage,
});

function AtelierPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
      <p className="eyebrow">Step-by-step commission</p>
      <h1 className="mt-5 text-4xl md:text-5xl">The Custom Order Atelier</h1>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        The four-step intake — fulfillment gatekeeper, calendar capacity, creative parameters and
        deposit — is being built next.
      </p>
    </section>
  );
}