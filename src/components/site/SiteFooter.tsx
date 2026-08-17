import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3 lg:px-10">
        <div>
          <p className="font-serif text-2xl">Wendy's Bakehouse</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A cottage-style premium pastry atelier crafting sculptural cakes, cupcakes and iced sugar
            cookies for weddings and milestones across the Greater Toronto Area.
          </p>
        </div>
        <div>
          <p className="eyebrow">Studio</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Etobicoke, Toronto
            <br />
            Ontario, Canada
            <br />
            By appointment — Tue to Sat
          </p>
        </div>
        <div>
          <p className="eyebrow">Enquiries</p>
          <a
            href="mailto:sales@wendysbakehouse.ca"
            className="mt-4 block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            sales@wendysbakehouse.ca
          </a>
          <Link
            to="/atelier"
            className="mt-3 inline-block text-xs uppercase tracking-[0.22em] text-accent"
          >
            Custom Order Atelier
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 text-center text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground lg:px-10">
        © {new Date().getFullYear()} Wendy's Bakehouse — Etobicoke, Toronto, Ontario
      </div>
    </footer>
  );
}