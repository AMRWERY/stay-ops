# StayOps — Design System

Reference for Stitch (or any designer/tool) generating visuals for this product.
There is no existing brand or design constant to match — this document **is**
the source of truth going forward. Follow it exactly; where it's silent, default
to calm, operational clarity over decoration.

## 1. Who this is for

StayOps is internal operations software used by hotel and resort staff —
warehouse managers, room-service runners, supervisors — during live shifts,
often on a phone at a cart or a tablet at a stockroom desk. It is not a
marketing site and not a guest-facing brand experience (except the single
guest QR-scan screen, which stays in the same system but is simpler).

**Design goal:** feel like a well-run hotel back-of-house — precise, calm,
a little warm, never flashy. Think night-porter's desk, not a startup landing
page. Every screen should let someone act in seconds, not admire it.

## 2. Concept & signature element

The recurring motif is the **room key** — hospitality's oldest trust object.
It shows up in one restrained, literal way: a small brass "key-tooth" notch
(a short vertical bar with a squared edge) marks the active item in navigation
and the current step in a status timeline. It is never used decoratively
elsewhere — one signature, used consistently, not scattered.

Status colors borrow the logic of a housekeeping door tag: green = ready/done,
amber = in progress, red = urgent/blocked. Staff already read this system
instinctively; the product should not invent a new one.

## 3. Color

Named tokens (also defined as Tailwind colors in `tailwind.config.ts`):

| Name | Hex | Use |
|---|---|---|
| Ink (`ink`) | `#10233D` | Sidebar, headers, primary text, dark surfaces |
| Ink Light | `#17304F` | Hover state on dark surfaces |
| Ink Dark | `#0B1929` | Auth screen background |
| Brass (`brass`) | `#A9832E` | Primary actions, links, active nav marker, focus rings |
| Brass Light | `#C7A257` | Hover/lighter accent, icon backgrounds |
| Brass Dark | `#8A6A22` | Primary button hover |
| Linen (`linen`) | `#F6F3EC` | App background (warm off-white, not clinical white) |
| Linen Dark | `#EFEAE0` | Subtle section backgrounds |
| Slate (`slate`) | `#5B6472` | Secondary text, captions, table labels |
| Slate Light | `#8A93A0` | Placeholder text, disabled state |
| Mist (`mist`) | `#E4E7EB` | Borders, dividers, table zebra |
| Mist Dark | `#D2D7DE` | Stronger borders, input borders on hover |
| White | `#FFFFFF` | Card surfaces |

Status colors (semantic, used only for badges/dots/alerts, never as decoration):

| Name | Hex | Meaning |
|---|---|---|
| Ready (`status-ready`) | `#3F7D5C` | Delivered, vacant & clean, in stock |
| Progress (`status-progress`) | `#E8813B` | Preparing, in progress, needs attention soon |
| Urgent (`status-urgent`) | `#B4472A` | Urgent priority, low stock, out of service, errors |
| Info (`status-info`) | `#3B6FA0` | On the way, occupied, neutral in-flight state |
| Idle (`status-idle`) | `#8A93A0` | Pending, inactive, unassigned |

Rules:
- Background is always Linen, not white — white is reserved for cards/surfaces sitting on top of it, so elevation reads clearly.
- Brass is the **only** accent used for interactive elements (buttons, links, active states, focus rings). Never introduce a second accent color.
- Status colors are used at low opacity (≈12–15%) as badge backgrounds with the full-strength color as text/dot, never as large fills.
- Don't use pure black or pure white text; use Ink and Slate.

## 4. Typography

Three roles, deliberately not "Inter everywhere":

- **Display — Fraunces** (variable serif, weights 400/500/600). Used for page titles, card headings, empty-state headlines, the login screen. Has warmth appropriate to hospitality without being decorative. Use at restraint — never for body copy or UI labels.
- **Body / UI — Inter** (400/500/600/700). Everything else: paragraphs, labels, buttons, nav, form fields.
- **Utility / data — IBM Plex Mono** (400/500). SKUs, order IDs, QR-code URLs, timestamps in dense tables — anywhere exact characters matter.

Type scale (approx, Tailwind defaults are fine as a base):
- Page title: Fraunces, 24–28px, weight 500–600, Ink
- Card/section heading: Fraunces, 18–20px, weight 500, Ink
- Body: Inter, 14px, weight 400, Ink or Slate
- Caption / label / table header: Inter, 12–13px, weight 500, Slate, sometimes uppercase with wide tracking for table headers only
- Data/mono: IBM Plex Mono, 12–13px

## 5. Layout

- **App shell:** fixed dark Ink sidebar (256px) on desktop with the StayOps mark, primary nav, and the signed-in staff member's name/role at the bottom. Collapses to a bottom tab bar or hamburger on mobile — staff are frequently on phones.
- **Content area:** Linen background, generous padding (24–40px), max content width where it aids scanability (e.g. detail pages ~640–768px; boards/tables can go full width).
- **Cards:** white surface, `10px` radius, 1px Mist border, soft shadow (`0 1px 2px rgba(16,35,61,0.06)`), never a heavy drop shadow.
- **Tables:** Linen header row, Slate uppercase labels, Mist row dividers, no vertical rules.
- **Kanban board (orders):** four columns (Pending / Preparing / On the way / Delivered) on a Mist/40%-opacity track, white order cards inside.
- **Buttons:** solid Brass primary (white text), outlined Mist secondary (Ink text). Rounded corners matching cards (10px). No pill buttons except status badges.
- **Spacing rhythm:** base unit 4px; prefer 8/12/16/24/32 steps. Don't crowd — this is used standing up.

## 6. Components at a glance

- **Badges** — pill shape, colored dot + label, 12px text, low-opacity background (see status colors).
- **Empty states** — centered icon in a soft Linen circle, Fraunces headline, one line of Slate body copy, one primary action if applicable. Written in an inviting, plain voice ("No active orders" / "New guest requests will show up here").
- **Toasts** — bottom-right, solid color (Ready/Urgent/Ink), white text, auto-dismiss.
- **Modals** — centered, white card on a translucent Ink scrim (40% opacity), max-width ~384px for confirmations/forms.
- **QR code card** — centered, white card, Ink-colored QR modules (not pure black), the guest URL shown below in mono for manual entry as a fallback.

## 7. Motion

Minimal and functional only: toast slide/fade (~150–200ms), modal fade, hover states on cards/buttons (~150ms ease). No page-load choreography, no decorative motion — this is a tool people return to dozens of times a shift; charm wears off, speed doesn't.

## 8. Voice

Plain, active, staff-to-staff. Buttons say what they do ("Mark as preparing," "Send purchase order," "Adjust stock") — not "Submit." Empty and error states explain what happened and what to do next, without apologizing. The one guest-facing screen (QR scan) is slightly warmer and more welcoming in tone since it's guest-to-hotel, everything else is staff-to-staff and efficient.

## 9. Accessibility & responsiveness

- Minimum 4.5:1 text contrast; verify Brass-on-white and white-on-Brass meet this for body text (use Brass Dark for small text if needed).
- Visible focus rings (Brass Light) on all interactive elements.
- Every screen usable down to a 375px-wide phone; sidebar becomes a bottom bar or drawer.
- Status must never be conveyed by color alone — always pair with a label (badges already do this).

## 10. What to avoid

- No generic AI-SaaS look: no cream-background/terracotta-accent combo, no near-black-with-neon-accent, no dense broadsheet hairline layout. This system already picked its own lane (Ink/Linen/Brass, Fraunces + Inter) — don't drift toward defaults.
- No stock photography of generic "hotel luxury" imagery — this is a working tool, not a hospitality brand site.
- No more than one accent color. No gradients as decoration.
