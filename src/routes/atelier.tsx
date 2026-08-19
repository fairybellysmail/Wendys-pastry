import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { Check, Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getWeekCapacity, submitOrder } from "@/lib/orders.functions";
import {
  DEPOSIT_CENTS,
  FLAVORS,
  MAX_RADIUS_MILES,
  NOTIFICATION_EMAIL,
  OCCASIONS,
  STYLES,
  availableMethods,
  dateKey,
  deliveryFeeCents,
  distanceFromStudio,
  formatMoney,
  isValidPostal,
  methodLabel,
  normalizePostal,
  pointsForStyle,
  weekStartKey,
  type FulfillmentMethod,
} from "@/lib/atelier";

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

const STEPS = ["Fulfillment", "Date", "Design", "Deposit"] as const;

function AtelierPage() {
  const [step, setStep] = useState(0);

  // Step 1 — fulfillment gatekeeper
  const [postal, setPostal] = useState("");
  const [checking, setChecking] = useState(false);
  const [postalError, setPostalError] = useState<string | null>(null);
  const [miles, setMiles] = useState<number | null>(null);
  const [method, setMethod] = useState<FulfillmentMethod | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  // Step 2 — calendar
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  // Step 3 — creative parameters
  const [occasion, setOccasion] = useState("");
  const [style, setStyle] = useState("");
  const [flavor, setFlavor] = useState("");
  const [servings, setServings] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Step 4 — client details + deposit
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState<{ orderId: string } | null>(null);

  const today = useMemo(() => new Date(), []);
  const horizon = useMemo(() => {
    const end = new Date(today);
    end.setMonth(end.getMonth() + 8);
    return end;
  }, [today]);

  const capacityFn = useServerFn(getWeekCapacity);
  const capacity = useQuery({
    queryKey: ["week-capacity", weekStartKey(today)],
    queryFn: () =>
      capacityFn({ data: { from: weekStartKey(today), to: weekStartKey(horizon) } }),
  });

  const fullWeeks = useMemo(() => {
    const limit = capacity.data?.limit ?? 10;
    const weeks = capacity.data?.weeks ?? {};
    return new Set(
      Object.entries(weeks)
        .filter(([, points]) => points >= limit)
        .map(([week]) => week),
    );
  }, [capacity.data]);

  const submitFn = useServerFn(submitOrder);
  const submission = useMutation({
    mutationFn: () =>
      submitFn({
        data: {
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim() || undefined,
          postalCode: normalizePostal(postal),
          fulfillmentMethod: method as FulfillmentMethod,
          eventDate: dateKey(eventDate as Date),
          occasion,
          style,
          flavorProfile: flavor,
          servings: servings.trim() || undefined,
          referenceFiles: files,
          designNotes: notes.trim() || undefined,
        },
      }),
    onSuccess: (result) => {
      if (result.ok) {
        setConfirmed({ orderId: result.orderId });
        capacity.refetch();
      }
    },
  });

  const verifyPostal = useCallback(() => {
    setPostalError(null);
    setMiles(null);
    setMethod(null);
    if (!isValidPostal(postal)) {
      setPostalError("Enter a valid Canadian postal code, e.g. M8V 1A4.");
      return;
    }
    setChecking(true);
    // Distance lookup against the Etobicoke studio origin.
    window.setTimeout(() => {
      const distance = distanceFromStudio(postal);
      setMiles(distance);
      setMethod("pickup");
      setChecking(false);
      if (distance > MAX_RADIUS_MILES) setDisclaimerOpen(true);
    }, 900);
  }, [postal]);

  const acceptFiles = useCallback(
    (incoming: FileList | null) => {
      setUploadError(null);
      if (!incoming || incoming.length === 0) return;
      const names = Array.from(incoming).map((file) => file.name);
      if (files.length + names.length > 3) {
        setUploadError("Up to three reference images per commission.");
        return;
      }
      setUploading(true);
      window.setTimeout(() => {
        setFiles((current) => [...current, ...names].slice(0, 3));
        setUploading(false);
      }, 700);
    },
    [files.length],
  );

  const methods = miles === null ? [] : availableMethods(miles);
  const fee = method && miles !== null ? deliveryFeeCents(method, miles) : 0;
  const points = style ? pointsForStyle(style) : 0;

  const canAdvance = [
    miles !== null && method !== null,
    eventDate !== undefined,
    Boolean(occasion && style && flavor),
    Boolean(name.trim() && /.+@.+\..+/.test(email)),
  ];

  if (confirmed) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-28 text-center lg:px-10">
        <p className="eyebrow">Reservation secured</p>
        <h1 className="mt-5 text-4xl md:text-5xl">Your date is held</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Commission <span className="text-foreground">{confirmed.orderId.slice(0, 8)}</span> is
          written into the studio calendar. A deposit confirmation has been routed to{" "}
          {NOTIFICATION_EMAIL}, and Wendy will follow up with a sketch consultation within one
          business day.
        </p>
        <Button
          variant="goldOutline"
          className="mt-10 h-11 px-8"
          onClick={() => {
            setConfirmed(null);
            setStep(0);
          }}
        >
          Start another commission
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
      <header className="text-center">
        <p className="eyebrow">Step-by-step commission</p>
        <h1 className="mt-5 text-4xl md:text-5xl">The Custom Order Atelier</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Four considered steps — fulfillment, calendar, design and deposit. Every reservation is
          held with a flat {formatMoney(DEPOSIT_CENTS)} non-refundable booking deposit.
        </p>
      </header>

      <ol className="mt-12 flex items-center justify-center gap-3 text-[0.65rem] tracking-[0.28em] uppercase">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-3">
            <span className={index === step ? "text-accent" : "text-muted-foreground"}>
              {index + 1}. {label}
            </span>
            {index < STEPS.length - 1 ? <span className="h-px w-6 bg-border" /> : null}
          </li>
        ))}
      </ol>

      <div className="mt-10 border border-border bg-card p-6 shadow-atelier sm:p-10">
        {step === 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl">Where is the celebration?</h2>
            <p className="text-sm text-muted-foreground">
              We measure from the studio in Etobicoke, Toronto. Delivery is available up to{" "}
              {MAX_RADIUS_MILES} miles.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="postal">Event postal code</Label>
                <Input
                  id="postal"
                  value={postal}
                  placeholder="M8V 1A4"
                  autoComplete="postal-code"
                  className="mt-2"
                  onChange={(event) => setPostal(event.target.value)}
                />
              </div>
              <Button
                variant="atelier"
                className="h-11 self-end px-8"
                disabled={checking || postal.trim().length === 0}
                onClick={verifyPostal}
              >
                {checking ? <Loader2 className="animate-spin" /> : null}
                {checking ? "Measuring" : "Verify"}
              </Button>
            </div>

            {postalError ? <p className="text-sm text-destructive">{postalError}</p> : null}

            {checking ? (
              <p className="text-sm text-muted-foreground">
                Calculating distance from the Etobicoke studio…
              </p>
            ) : null}

            {miles === null && !checking && !postalError ? (
              <p className="border border-dashed border-border p-6 text-sm text-muted-foreground">
                Enter a postal code to reveal your fulfillment options.
              </p>
            ) : null}

            {miles !== null && !checking ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Approximately{" "}
                  <span className="text-foreground">{miles} miles</span> from the studio.
                </p>
                {miles > MAX_RADIUS_MILES ? (
                  <p className="border-l-2 border-accent bg-secondary/60 p-4 text-sm">
                    Delivery unavailable beyond {MAX_RADIUS_MILES} miles. Studio pickup in
                    Etobicoke, Toronto is required.
                  </p>
                ) : null}
                <div className="space-y-3">
                  {methods.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMethod(option)}
                      className={`flex w-full items-center justify-between border p-4 text-left text-sm transition-colors ${
                        method === option
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/60"
                      }`}
                    >
                      <span>{methodLabel(option)}</span>
                      <span className="text-muted-foreground">
                        {formatMoney(deliveryFeeCents(option, miles))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-6">
            <h2 className="text-2xl">Reserve your date</h2>
            {capacity.isLoading ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Reading studio capacity…
              </p>
            ) : null}
            {capacity.isError ? (
              <p className="text-sm text-destructive">
                We couldn't read the studio calendar. Please try again in a moment.
              </p>
            ) : null}
            <Calendar
              mode="single"
              selected={eventDate}
              onSelect={setEventDate}
              disabled={(date) =>
                date < new Date(today.toDateString()) ||
                date > horizon ||
                fullWeeks.has(weekStartKey(date))
              }
              className="mx-auto"
            />
            {fullWeeks.size > 0 ? (
              <div className="border-l-2 border-accent bg-secondary/60 p-5 text-sm">
                <p>
                  Our studio limits weekly custom bookings to protect design quality. Some dates
                  are currently full —{" "}
                  <a href={`mailto:${NOTIFICATION_EMAIL}?subject=Priority%20Waiting%20List`} className="text-accent underline underline-offset-4">
                    join our Priority Waiting List
                  </a>
                  .
                </p>
              </div>
            ) : null}
            {eventDate ? (
              <p className="text-sm text-muted-foreground">
                Holding{" "}
                <span className="text-foreground">
                  {eventDate.toLocaleDateString("en-CA", { dateStyle: "long" })}
                </span>{" "}
                — week of {weekStartKey(eventDate)}.
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <h2 className="text-2xl">Creative parameters</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Occasion</Label>
                <Select value={occasion} onValueChange={setOccasion}>
                  <SelectTrigger className="mt-2" aria-label="Occasion">
                    <SelectValue placeholder="Select an occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCCASIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="mt-2" aria-label="Style">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((entry) => (
                      <SelectItem key={entry.value} value={entry.value}>
                        {entry.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Flavour profile</Label>
                <Select value={flavor} onValueChange={setFlavor}>
                  <SelectTrigger className="mt-2" aria-label="Flavour profile">
                    <SelectValue placeholder="Select a flavour" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLAVORS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="servings">Approximate servings</Label>
                <Input
                  id="servings"
                  value={servings}
                  placeholder="40 guests"
                  className="mt-2"
                  onChange={(event) => setServings(event.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Design references (up to 3)</Label>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  acceptFiles(event.dataTransfer.files);
                }}
                className={`mt-2 flex flex-col items-center gap-3 border border-dashed p-8 text-center text-sm transition-colors ${
                  dragging ? "border-accent bg-accent/10" : "border-border"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-5 animate-spin text-accent" />
                    <p className="text-muted-foreground">Preparing your references…</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="size-5 text-accent" />
                    <p className="text-muted-foreground">
                      Drag images here, or{" "}
                      <button
                        type="button"
                        className="text-accent underline underline-offset-4"
                        onClick={() => fileInput.current?.click()}
                      >
                        browse your device
                      </button>
                    </p>
                  </>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => acceptFiles(event.target.files)}
                />
              </div>
              {uploadError ? <p className="mt-2 text-sm text-destructive">{uploadError}</p> : null}
              {files.length === 0 && !uploading ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  No references attached yet — optional, but they help enormously.
                </p>
              ) : null}
              <ul className="mt-3 space-y-2">
                {files.map((file) => (
                  <li
                    key={file}
                    className="flex items-center justify-between border border-border px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="size-4 text-accent" /> {file}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${file}`}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setFiles((current) => current.filter((f) => f !== file))}
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label htmlFor="notes">Design notes</Label>
              <Textarea
                id="notes"
                value={notes}
                rows={4}
                className="mt-2"
                placeholder="Palette, textures, florals, dietary considerations…"
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6">
            <h2 className="text-2xl">Deposit &amp; confirmation</h2>
            <dl className="divide-y divide-border border border-border text-sm">
              <Row label="Fulfillment" value={method ? methodLabel(method) : "—"} />
              <Row label="Distance from studio" value={miles !== null ? `${miles} miles` : "—"} />
              <Row
                label="Event date"
                value={
                  eventDate ? eventDate.toLocaleDateString("en-CA", { dateStyle: "long" }) : "—"
                }
              />
              <Row label="Occasion" value={occasion || "—"} />
              <Row label="Style" value={`${style || "—"}${points ? ` — ${points} workload pts` : ""}`} />
              <Row label="Flavour" value={flavor || "—"} />
              <Row label="References" value={files.length ? files.join(", ") : "None attached"} />
              <Row label="Delivery fee" value={formatMoney(fee)} />
              <Row
                label="Booking deposit (non-refundable)"
                value={formatMoney(DEPOSIT_CENTS)}
              />
            </dl>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  className="mt-2"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="mt-2"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={phone}
                  className="mt-2"
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>

            <div className="border border-border bg-secondary/40 p-6">
              <p className="eyebrow">Secure checkout</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Stripe Checkout will render here to collect the flat{" "}
                {formatMoney(DEPOSIT_CENTS)} deposit that locks your calendar date. Until live keys
                are connected, confirming below reserves the slot and records the deposit as
                pending.
              </p>
            </div>

            {submission.data && !submission.data.ok ? (
              <p className="text-sm text-destructive">{submission.data.error}</p>
            ) : null}
            {submission.isError ? (
              <p className="text-sm text-destructive">
                We couldn't record your commission. Please try again.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            className="text-xs tracking-[0.18em] uppercase"
            disabled={step === 0 || submission.isPending}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button
              variant="atelier"
              className="h-11 px-8"
              disabled={!canAdvance[step]}
              onClick={() => setStep((current) => current + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="atelier"
              className="h-11 px-8"
              disabled={!canAdvance[3] || submission.isPending}
              onClick={() => submission.mutate()}
            >
              {submission.isPending ? <Loader2 className="animate-spin" /> : null}
              {submission.isPending ? "Reserving" : `Pay ${formatMoney(DEPOSIT_CENTS)} deposit`}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Studio pickup only</DialogTitle>
            <DialogDescription>
              Your event is more than {MAX_RADIUS_MILES} miles from Etobicoke, so hand delivery
              isn't possible. Tiered and sculpted cakes are structurally fragile: transport them
              flat on the vehicle floor, air-conditioned, and never on a seat or lap. Wendy's
              Bakehouse can't warrant structural integrity after pickup.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="goldOutline" className="h-10 px-6" onClick={() => setDisclaimerOpen(false)}>
              I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}