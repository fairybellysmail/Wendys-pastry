import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio & Flavor Profiler — Wendy's Bakehouse" },
      {
        name: "description",
        content:
          "Browse past commissions and pair them with our house flavor profiles, from rich chocolate fudge to vanilla bean.",
      },
      { property: "og:title", content: "Portfolio & Flavor Profiler — Wendy's Bakehouse" },
      {
        property: "og:description",
        content: "Past commissions paired with dynamic house flavor profiles.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
      <p className="eyebrow">Archive</p>
      <h1 className="mt-5 text-4xl md:text-5xl">Portfolio & Flavor Profiler</h1>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        The interactive gallery and flavor pairing grid arrive in a later step.
      </p>
    </section>
  );
}