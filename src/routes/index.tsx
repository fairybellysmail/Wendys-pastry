import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import workPalette from "@/assets/work-palette.jpg";
import workCookies from "@/assets/work-cookies.jpg";
import workWedding from "@/assets/work-wedding.jpg";
import { HeroCarousel } from "@/components/site/HeroCarousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Edible Art Studio — Wendy's Bakehouse, Toronto" },
      {
        name: "description",
        content:
          "Wendy's Bakehouse is a cottage-style premium pastry atelier in Etobicoke, Toronto, sculpting bespoke cakes, wedding tiers, themed cupcakes and iced sugar cookies.",
      },
      { property: "og:title", content: "The Edible Art Studio — Wendy's Bakehouse" },
      {
        property: "og:description",
        content:
          "Sculptural custom cakes and sugar work, handcrafted in small batches in Etobicoke, Toronto.",
      },
    ],
  }),
  component: Index,
});

const masterpieces = [
  {
    image: workWedding,
    title: "The Ivory Cascade",
    detail: "Four tiers, vanilla bean sponge, hand-piped botanicals",
    price: "From $685",
  },
  {
    image: workPalette,
    title: "Palette No. 12",
    detail: "Single tier, velvet cream, palette-knife oil-paint finish",
    price: "From $210",
  },
  {
    image: workCookies,
    title: "Gilded Sugar Suite",
    detail: "Dozen sugar cookies, 24k edible gold detailing",
    price: "From $78 / dozen",
  },
];

const testimonials = [
  {
    quote:
      "Our wedding cake looked like a sculpture we happened to be allowed to eat. Guests photographed it for twenty minutes before we cut it.",
    name: "Elena & Marcus R.",
    context: "Wedding — Kankakee, IL",
  },
  {
    quote:
      "Wendy took a swatch of my mother's china and translated it into a palette-knife cake. It was the centerpiece of her 70th.",
    name: "Priya N.",
    context: "Milestone Birthday — Bourbonnais, IL",
  },
  {
    quote:
      "The chocolate fudge is dangerously good. Restrained on the outside, completely indulgent on the inside.",
    name: "Daniel K.",
    context: "Sweet 16 — Bradley, IL",
  },
  {
    quote:
      "Delivery was flawless, on time, and set up with more care than our florist showed. Worth every dollar.",
    name: "The Halvorsen Family",
    context: "Anniversary — Manteno, IL",
  },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pt-16 pb-24 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:px-10 lg:pt-24 lg:pb-32">
          <div className="animate-fade-up">
            <p className="eyebrow">Bradley, Illinois · Est. 2014</p>
            <h1 className="mt-7 text-5xl leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
              The Edible
              <br />
              <span className="italic text-accent">Art Studio</span>
            </h1>
            <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              Every commission begins as a drawing and ends as a centerpiece. Small-batch cakes,
              palette-knife buttercream and gilded sugar work — made one date at a time so nothing is
              rushed.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild variant="atelier" size="atelier">
                <Link to="/atelier">Start Your Custom Order</Link>
              </Button>
              <Button asChild variant="goldOutline" size="atelier">
                <Link to="/portfolio">View the Portfolio</Link>
              </Button>
            </div>
            <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["10", "commissions per week"],
                ["40mi", "delivery radius"],
                ["$50", "date-locking deposit"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-2xl">{value}</dt>
                  <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 hidden rounded-none bg-secondary/60 lg:block" />
            <img
              src={heroCake}
              alt="Four-tier ivory buttercream cake finished with gold leaf on cream linen"
              width={1600}
              height={1104}
              className="h-[26rem] w-full object-cover shadow-[var(--shadow-atelier)] md:h-[34rem] lg:h-[38rem]"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30 py-8">
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <figure
                key={i}
                className="w-[22rem] shrink-0 border border-border bg-card px-8 py-7 md:w-[26rem]"
              >
                <blockquote className="text-[0.95rem] leading-relaxed italic">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5">
                  <span className="block text-xs uppercase tracking-[0.2em]">{t.name}</span>
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.context}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Selected works</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Artistic Masterpieces</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Each piece below has been commissioned and delivered. Pricing scales with tier count,
            sugar work and finish complexity.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {masterpieces.map((item) => (
            <article key={item.title} className="group">
              <div className="overflow-hidden bg-secondary">
                <img
                  src={item.image}
                  alt={item.title}
                  width={912}
                  height={1104}
                  loading="lazy"
                  className="h-[26rem] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-6 text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-accent">{item.price}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10 lg:py-32">
          <p className="eyebrow">Ten commissions per week</p>
          <h2 className="mt-5 text-4xl leading-tight md:text-5xl">
            Reserve your date in the <span className="italic text-accent">Atelier</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Four short steps: confirm fulfillment for your ZIP code, choose an open week, shape the
            design and flavor, then lock the date with a $50 deposit.
          </p>
          <div className="mt-10">
            <Button asChild variant="atelier" size="atelier">
              <Link to="/atelier">Enter the Custom Order Atelier</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
