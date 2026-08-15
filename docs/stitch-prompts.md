# StayOps — Stitch Prompts

One prompt per page/component group. Paste `design.md` into Stitch first (or
reference it as project context) so every prompt below can stay short and
inherit the color, type, and layout system instead of restating it.

Each prompt assumes: sidebar app shell, Linen background, Ink/Brass/status
colors, Fraunces for headings + Inter for UI + IBM Plex Mono for data, per
`design.md`.

---

## Pages

**1. Login**
> Design a login screen for StayOps, a hotel operations tool. Centered white card (max 384px) on a dark Ink background. Small brass square mark + "StayOps" wordmark in Fraunces above a "Sign in" headline. Email and password fields, a solid brass "Sign in" button full width. Quiet, no illustration — this is a staff tool opened dozens of times a shift.

**2. Dashboard**
> Design the StayOps dashboard: app shell with dark Ink sidebar (nav: Dashboard, Room Service, Inventory, Rooms, Staff, Suppliers, Purchase Orders, Reports, Settings — active item marked with a small brass notch on the left edge) and Linen content area. Top: a welcome line, then a low-stock alert banner (only if items are low) in a soft urgent-red bordered card. Below: a row of 4 stat cards (Active orders, Pending, Urgent, Low stock items) with small icon chips. Below that: a live kanban board of room service orders in 4 columns (Pending, Preparing, On the way, Delivered), each order as a compact white card showing room number, item list, assignee, and time.

**3. Room Service — Orders board**
> Design the full Room Service page: same app shell, header reading "Room Service." A secondary button "Generate room QR codes" top right. Main content is the 4-column kanban board (Pending / Preparing / On the way / Delivered) on a light Mist track, order cards showing room number, up to 3 items with quantities, a priority dot (grey/amber/red), assignee name, and relative time. Empty column state: quiet centered "No orders here" text.

**4. Order detail**
> Design an order detail page: back link, two-column layout. Left (wide) card: "Room {number}" heading with a status badge top right, itemized list of ordered items, guest notes in a soft Linen box, primary button to advance status ("Mark as preparing" etc.) plus a secondary cancel button. If delivered, show a guest rating/feedback block below a divider. Right (narrow) card: "Assign to" with a vertical list of staff name buttons, selected one highlighted with a brass border and tint.

**5. Inventory list**
> Design an inventory list page: search input top left, "+ Add item" brass button top right. Below, a white table with Linen header row: Item (name + "Perishable" amber tag if relevant), SKU (monospace), On hand (red text if at/below reorder level), Reorder at, Location, Updated, and an "Adjust stock" secondary button per row. Rows are clickable.

**6. Add / edit inventory item**
> Design an inventory item form page: back link, "Add inventory item" Fraunces heading, a white card with a responsive 2-column form — item name (full width), SKU (mono input), unit, category dropdown, supplier dropdown, quantity on hand, reorder threshold, unit cost, storage location, a perishable checkbox that reveals an expiry date field, and a primary "Save item" button bottom right.

**7. Inventory item detail**
> Design an inventory item detail page combining the edit form (as above) with a "Recent stock movements" card below it: a simple list of movement type (stock in/out/waste/adjustment), signed quantity in green/red, and date.

**8. Rooms grid**
> Design a Rooms page: intro line about QR codes, then a responsive grid of room cards (2–4 columns), each showing "Room {number}" in Fraunces, room type + floor in small grey text, a status badge (Vacant·Clean green / Vacant·Dirty amber / Occupied blue / Out of service red / Maintenance red), and an "N active" amber badge if there are open orders.

**9. Room detail**
> Design a room detail page: two-column layout. Left: room header with status badge, a row of status-change buttons (Vacant·Clean, Vacant·Dirty, Occupied, Maintenance, Out of service — selected one outlined in brass), and a "Recent orders" list below with date + status badge per row. Right: a QR code card — white card, centered QR code rendered in Ink ink-color modules, caption "Scan to request room service — Room {number}", the guest URL in small monospace text below, and a "Download QR code" secondary button.

**10. Staff directory**
> Design a Staff page: responsive grid of staff cards, each a horizontal white card with a circular Ink avatar showing the person's initial, name + role (capitalized, grey) in the middle, and a status badge (Active/On shift/Off shift/Inactive) on the right.

**11. Staff detail**
> Design a staff detail page: back link, a header card with a large circular Ink avatar, name in Fraunces, role and phone number below. Under it, a "Shift history" section with a white table: Staff, Starts, Ends, Checked in, Checked out.

**12. Suppliers**
> Design a Suppliers page: intro line, "+ Add supplier" brass button. An optional inline add-supplier form card (name, contact, phone, email in a 2-column grid). Below, a white table: Supplier, Contact, Email, Phone.

**13. Purchase orders**
> Design a Purchase Orders page: intro line, "+ New purchase order" button. An optional order-builder card: supplier dropdown, then a repeatable list of item rows (item dropdown + quantity + remove icon) with an "+ Add item" link, and a primary "Send purchase order" button. Below, a table of past purchase orders: Supplier, Status (badge: draft grey / sent blue / partially received amber / received green / cancelled red), Expected date, Created date.

**14. Reports**
> Design a Reports page: intro line "Last 30 days…", a row of 3 stat cards (Orders, Avg. delivery time, Items tracked), then two side-by-side horizontal bar-chart cards ("Most requested items", "Orders by day") — each row is a label, a brass horizontal bar on a Mist track, and a monospace value at the right edge. Minimal, data-forward, no gradients or 3D.

**15. Settings**
> Design a Settings page: single centered card, "Property details" Fraunces heading, a simple vertical form (Property name, Address, Timezone), primary "Save changes" button. Very plain — this is an infrequently visited utility screen.

**16. Notifications**
> Design a Notifications page: a vertical list of white notification cards, unread ones with a subtle brass left border/tint, each showing a title, optional body text, and a relative date top right. Empty state: "You're all caught up" with a bell icon.

**17. Guest room-service request (public, no login)**
> Design a mobile-first guest page reached by scanning a room QR code — no sidebar, no login, standalone Linen page. Heading "Room service — Room {number}" in Fraunces, subtext "Tap + to add items, then send your request." A vertical list of item rows, each with the item name and a small quantity stepper (− count +). A notes textarea below. A full-width brass "Send request (N items)" button, disabled/greyed until at least one item is added. On submit, replace with a centered confirmation: green check icon, "Request sent," and a short reassuring line. Slightly warmer and more welcoming in tone than the staff-facing screens, still on-brand.

---

## Shared components (for a Stitch component/style-guide pass)

**18. App sidebar (nav)**
> Design a dark Ink vertical sidebar, 256px wide: brass square mark + "StayOps" wordmark in Fraunces at top, a vertical nav list below with icon + label per item, active item shown with a small brass vertical notch on the left edge and a subtle lighter background, and a footer block showing the signed-in person's name and role in muted white text.

**19. App header**
> Design a slim white top bar: page title in Fraunces on the left, a notification bell (with a small red unread-count dot) and a "Sign out" text link on the right, all sitting on a 1px Mist bottom border.

**20. Notification bell dropdown**
> Design a notification bell dropdown panel: white card anchored below the bell icon, "Notifications" header, a scrollable list of items (title + optional body, unread ones tinted Linen), empty state "Nothing new right now."

**21. Stat card**
> Design a small stat card: white rounded card, a square icon chip on the left (brass tint by default, red tint for urgent metrics), a large Fraunces number and a small grey label stacked on the right.

**22. Empty state**
> Design a reusable empty-state block: centered in a white card, a soft Linen circle containing a grey icon, a Fraunces headline, one line of grey supporting text, and an optional brass primary button below.

**23. Status badges (order + room)**
> Design a set of small pill badges: a colored dot + label, low-opacity tinted background matching the status color system — order statuses (Pending grey, Preparing amber, On the way blue, Delivered green, Cancelled red) and room statuses (Vacant·Clean green, Vacant·Dirty amber, Occupied blue, Out of service red, Maintenance red).

**24. Order card (kanban)**
> Design a compact white order card for the kanban board: "Room {number}" in Fraunces with a small priority dot top right, up to 3 item lines below in grey, "+N more" if truncated, and a footer row with assignee name and relative time in small light-grey text.

**25. Stock adjust modal**
> Design a centered modal on a translucent dark scrim: white card (~384px), "Adjust stock — {item name}" heading, current quantity subtext, a movement-type dropdown (Stock in / Stock out / Waste / Manual correction), a quantity number input, an optional reason textarea, and Cancel/Save button pair bottom right (Cancel outlined, Save solid brass).

**26. Confirm dialog**
> Design a small centered confirmation modal: white card, Fraunces title, one line of grey description, Cancel (outlined) and Confirm (solid brass, or solid urgent-red if destructive) buttons bottom right.

**27. Toast notifications**
> Design bottom-right toast messages: small solid-color rounded rectangles (green for success, red for error, dark ink for info), white text, stacked with 8px gaps, subtle shadow.

**28. Low-stock alert banner**
> Design a horizontal alert banner: soft red-tinted background, red left accent, warning triangle icon, bold "N items below reorder level" with a grey list of affected item names, and a "Review" link on the right in red.

**29. Inventory table**
> Design a data table for warehouse inventory: Linen header row with uppercase grey labels, white body rows separated by 1px Mist lines, columns for Item (name + optional amber "Perishable" tag), SKU (monospace grey), On hand (bold red when at/below threshold, else ink), Reorder at, Location, Updated, and a small outlined "Adjust stock" button per row.

**30. QR code generator card**
> Design a centered white card: caption "Scan to request room service — Room {number}," a generated QR code with Ink-navy modules on white, the guest URL below in small monospace grey text, and an outlined "Download QR code" button.
