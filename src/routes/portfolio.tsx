import { createFileRoute } from "@tanstack/react-router";
import studioFilm from "@/assets/studio-film.mp4.asset.json";

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
    <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10 lg:py-28">
      <p className="eyebrow">Archive</p>
      <h1 className="mt-5 text-4xl md:text-5xl">Portfolio & Flavor Profiler</h1>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        A short film from the bench — the finishing passes, hand-piped detail and final styling that
        go into a single commission.
      </p>

      <figure className="mx-auto mt-14 max-w-sm">
        <div className="overflow-hidden border border-accent/40 bg-secondary p-2">
          <video
            src={studioFilm.url}
            className="aspect-[9/16] w-full bg-charcoal object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="metadata"
            aria-label="Studio film of a Wendy's Bakehouse cake being finished"
          />
        </div>
        <figcaption className="mt-5 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          From the studio — Etobicoke, Toronto
        </figcaption>
      </figure>

      <p className="mx-auto mt-14 max-w-xl text-sm leading-relaxed text-muted-foreground">
        The interactive gallery and flavor pairing grid arrive in a later step.
      </p>
    </section>
  );
}