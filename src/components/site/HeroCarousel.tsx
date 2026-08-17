import { motion } from "framer-motion";

import carouselWedding from "@/assets/carousel-wedding-tiers.jpg";
import carouselBespoke from "@/assets/carousel-bespoke.jpg";
import carouselCupcakes from "@/assets/carousel-cupcakes.jpg";
import carouselCookies from "@/assets/carousel-cookies.jpg";

const slides = [
  {
    image: carouselWedding,
    title: "Multi-Tiered Wedding Cakes",
    caption: "Hand-applied gold leaf, sugar florals, four tiers",
  },
  {
    image: carouselBespoke,
    title: "Bespoke Celebration Cakes",
    caption: "Palette-knife buttercream in cream and champagne",
  },
  {
    image: carouselCupcakes,
    title: "Themed Cupcakes",
    caption: "Silk-swirl buttercream with edible gold",
  },
  {
    image: carouselCookies,
    title: "Iced Custom Sugar Cookies",
    caption: "Fine royal-icing detail, monograms and crests",
  },
];

export function HeroCarousel() {
  const ribbon = [...slides, ...slides];

  return (
    <div
      className="relative overflow-hidden"
      aria-label="Selected work from the Wendy's Bakehouse studio"
    >
      <motion.div
        className="flex w-max gap-5 md:gap-7"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 46, ease: "linear", repeat: Infinity, repeatType: "loop" }}
      >
        {ribbon.map((slide, i) => (
          <figure
            key={`${slide.title}-${i}`}
            className="group relative w-[15rem] shrink-0 overflow-hidden bg-secondary sm:w-[19rem] lg:w-[23rem]"
          >
            <img
              src={slide.image}
              alt={slide.title}
              width={1008}
              height={1264}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-[20rem] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05] sm:h-[26rem] lg:h-[32rem]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/75 to-transparent px-5 pt-14 pb-5">
              <span className="block font-serif text-lg text-cream">{slide.title}</span>
              <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.2em] text-champagne-soft">
                {slide.caption}
              </span>
            </figcaption>
          </figure>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-28" />
    </div>
  );
}