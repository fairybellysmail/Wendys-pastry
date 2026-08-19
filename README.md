# Wendy's Atelier

### PROJECT ROLE & ARCHITECTURE METHODOLOGY
You are a senior agency-grade full-stack developer building a premium e-commerce and intake application for "Wendy's Bakehouse" (Bradley, Illinois, USA). 
Follow a strict "Frontend-First, Then Backend" iterative implementation workflow. Build the entire application using mock data structures first. Ensure the UI components, responsive layout, and multi-step user flows feel perfect before initializing Supabase schemas. Build one atomic piece at a time and ask for approval before progressing.

### DESIGN DIRECTION & BRAND FEEL
- **Aesthetic:** High-end boutique, editorial luxury pastry atelier, clean layout, intentional white space, subtle cinematic fade-in micro-interactions.
- **Color Palette:** Luxury Editorial Warm Base (Soft Creams `#FDFBF7`), Accents (Muted Champagne Gold `#D4AF37`), Text (Deep Charcoal `#1A1A1A`).
- **Typography:** Premium serif headings (e.g., Playfair Display feel) paired with modern, highly legible sans-serif body text (e.g., Inter).
- **Guardrail:** Avoid standard, generic, colorful e-commerce designs. Treat each pastry as a high-end visual sculpture. Use real-world copy and pricing rather than lorem ipsum placeholders.

### APP STRUCTURE & PAGES
1. **Home/Landing Page:** Immersive visual hero banner ("The Edible Art Studio"), horizontal rolling customer testimonials carousel, highlighted artistic masterpieces cards, and an obvious, prominent CTA button leading to the Custom Order Atelier.
2. **The Custom Order Atelier:** A responsive, multi-step intake tool containing 4 distinct sub-steps (outlined in Core Logic).
3. **Dynamic Flavor Profiler & Portfolio:** An interactive visual grid combining past project imagery with dynamic flavor pairings.
4. **FAQ & Policies:** Clear text cards covering cancellations, transport safety, and allergy statements.

### CORE FUNCTIONAL LOGIC (STEP-BY-STEP INTAKE)
Implement a 4-step progressive validation form structure within "The Custom Order Atelier":

- **Step 1: Location & Fulfillment Gatekeeper**
  - Prompt user for an Event ZIP Code. Calculate distance relative to a central hub (Bradley, IL 60915).
  - Conditional Rule: If distance <= 15 miles, show options for "Studio Pickup (Free)" and "Local Delivery ($25 Flat Fee)". If 15 to 40 miles, show "Studio Pickup" or "Extended Delivery ($2.50/mi over 15)". If > 40 miles, lock delivery and show notice: "Delivery unavailable. Studio pickup in Bradley, IL required."

- **Step 2: Calendar Capacity Throttler**
  - Display an interactive calendar picker.
  - Implement a hidden capacity weight engine: A Custom Cake order adds 3 points to a week; a Cupcake/Cookie dozen adds 1 point. Limit each calendar week to a maximum score of 10 points. 
  - If a calendar week hits 10 points, soft-block those dates (disable clicking) and display an elegant overlay card: "This week is fully booked. Join our priority waitlist."

- **Step 3: Creative Parameters & Sourcing**
  - Dropdowns: Occasion (Wedding, Milestone Birthday, Sweet 16, Holiday, Other), Style (Multi-tier, Palette-Knife, Cupcake Set, Sugar Cookies), Flavor Profiles (Rich Chocolate Fudge, Velvet Cream, Vanilla Bean).
  - Include an interactive drag-and-drop file upload zone for design reference images (up to 3 files, handle loading/success states cleanly).

- **Step 4: Deposit & Administrative Notification**
  - Display an explicit order cost breakdown summarizing all options chosen in Steps 1-3.
  - Render an embedded Stripe Checkout placeholder interface requiring a flat $50 non-refundable booking deposit to lock in the calendar date.

### CRITICAL PRODUCTION GUARDRAILS
1. Do not modify or break the navigation layout or step-by-step form progression when fixing visual elements.
2. Provide explicit loading, error, and empty states for the image upload field and fulfillment verification.
3. Configure all automated notification emails, administrative alerts, and order confirmations to route to the central node: sales@wendysbakehouse.ca.
4. Stop and explain the root cause in Plan Mode if any conflicting layout errors occur before editing the codebase.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pastry-art-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e7e55d71-d43f-41da-a081-82192ebd5640).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
