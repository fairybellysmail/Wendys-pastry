import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ & Policies — Wendy's Bakehouse" },
      {
        name: "description",
        content:
          "Cancellation terms, transport safety guidance and allergy statements for Wendy's Bakehouse commissions.",
      },
      { property: "og:title", content: "FAQ & Policies — Wendy's Bakehouse" },
      {
        property: "og:description",
        content: "Cancellations, transport safety and allergy statements.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
      <p className="eyebrow">Good to know</p>
      <h1 className="mt-5 text-4xl md:text-5xl">FAQ & Policies</h1>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Policy cards are coming in a later step.
      </p>
    </section>
  );
}