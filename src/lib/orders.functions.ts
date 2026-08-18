import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  DEPOSIT_CENTS,
  MAX_RADIUS_MILES,
  NOTIFICATION_EMAIL,
  WEEKLY_POINT_LIMIT,
  availableMethods,
  deliveryFeeCents,
  distanceFromStudio,
  formatMoney,
  isValidPostal,
  methodLabel,
  normalizePostal,
  pointsForStyle,
  weekStartKey,
} from "./atelier";

const capacityInput = z.object({ from: z.string(), to: z.string() });

const orderInput = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().max(180),
  customerPhone: z.string().max(40).optional(),
  postalCode: z.string().min(6).max(10),
  fulfillmentMethod: z.enum(["pickup", "white_glove", "extended"]),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  occasion: z.string().min(2).max(60),
  style: z.string().min(2).max(60),
  flavorProfile: z.string().min(2).max(60),
  servings: z.string().max(60).optional(),
  referenceFiles: z.array(z.string().max(180)).max(3).default([]),
  designNotes: z.string().max(2000).optional(),
});

/** Weekly workload totals so the calendar can soft-block full weeks. */
export const getWeekCapacity = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => capacityInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select("week_start, workload_points")
      .gte("week_start", data.from)
      .lte("week_start", data.to)
      .neq("status", "cancelled");
    if (error) throw new Error(error.message);

    const weeks: Record<string, number> = {};
    for (const row of rows ?? []) {
      const key = row.week_start as string;
      weeks[key] = (weeks[key] ?? 0) + Number(row.workload_points ?? 0);
    }
    return { weeks, limit: WEEKLY_POINT_LIMIT };
  });

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderInput.parse(input))
  .handler(async ({ data }) => {
    const postal = normalizePostal(data.postalCode);
    if (!isValidPostal(postal)) {
      return { ok: false as const, error: "That postal code doesn't look valid." };
    }

    // Never trust the client's pricing or capacity math — recompute it here.
    const miles = distanceFromStudio(postal);
    if (!availableMethods(miles).includes(data.fulfillmentMethod)) {
      return {
        ok: false as const,
        error:
          miles > MAX_RADIUS_MILES
            ? "Delivery is unavailable beyond 40 miles. Studio pickup in Etobicoke is required."
            : "That fulfillment option isn't available for this address.",
      };
    }

    const deliveryFee = deliveryFeeCents(data.fulfillmentMethod, miles);
    const points = pointsForStyle(data.style);
    const weekStart = weekStartKey(new Date(`${data.eventDate}T12:00:00Z`));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: weekRows, error: weekError } = await supabaseAdmin
      .from("orders")
      .select("workload_points")
      .eq("week_start", weekStart)
      .neq("status", "cancelled");
    if (weekError) throw new Error(weekError.message);

    const booked = (weekRows ?? []).reduce(
      (total, row) => total + Number(row.workload_points ?? 0),
      0,
    );
    if (booked + points > WEEKLY_POINT_LIMIT) {
      return {
        ok: false as const,
        error:
          "Our studio limits weekly custom bookings to protect design quality. That week filled up — please choose another date.",
      };
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone ?? null,
        event_postal_code: postal,
        distance_miles: miles,
        fulfillment_method: data.fulfillmentMethod,
        delivery_fee_cents: deliveryFee,
        event_date: data.eventDate,
        week_start: weekStart,
        workload_points: points,
        occasion: data.occasion,
        style: data.style,
        flavor_profile: data.flavorProfile,
        servings: data.servings ?? null,
        reference_files: data.referenceFiles,
        design_notes: data.designNotes ?? null,
        deposit_amount_cents: DEPOSIT_CENTS,
        deposit_status: "pending",
        status: "reserved",
        notification_email: NOTIFICATION_EMAIL,
        notification_status: "logged",
        notification_logged_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    // Email provider not connected yet: record the confirmation server-side so
    // the notification payload is auditable until delivery is wired up.
    console.log(
      [
        `[atelier] deposit confirmation queued for ${NOTIFICATION_EMAIL}`,
        `order: ${inserted.id}`,
        `client: ${data.customerName} <${data.customerEmail}>`,
        `event: ${data.eventDate} (week of ${weekStart}) — ${data.occasion}`,
        `design: ${data.style} / ${data.flavorProfile} — ${points} workload pts`,
        `fulfillment: ${methodLabel(data.fulfillmentMethod)} — ${miles} mi — ${formatMoney(deliveryFee)}`,
        `deposit: ${formatMoney(DEPOSIT_CENTS)} (non-refundable, pending)`,
        `references: ${data.referenceFiles.join(", ") || "none"}`,
      ].join(" | "),
    );

    return {
      ok: true as const,
      orderId: inserted.id as string,
      notifiedTo: NOTIFICATION_EMAIL,
    };
  });