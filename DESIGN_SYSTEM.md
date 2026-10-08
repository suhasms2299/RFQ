# Fieldnote Frontend Design System

This document is the shared visual and interaction contract for every Fieldnote screen. New views and reusable components should use these tokens and patterns instead of adding one-off colors or control styles.

## Foundations

### Color tokens

Use semantic token names in components. Hex values are centralized in the MUI theme in `src/App.tsx`; the sidebar exception is scoped to `src/SidebarPalette.css`.

| Token | Value | Use |
| --- | --- | --- |
| `primary.main` | `#315F9E` | Main actions, selected controls, executed status |
| `primary.dark` | `#254875` | Hover and pressed primary actions |
| `primary.light` | `#E4EDF8` | Soft primary backgrounds |
| `secondary.main` | `#C56645` | Counteroffers, secondary emphasis, warm chart series |
| `secondary.dark` | `#A64B32` | Hover and pressed secondary actions |
| `secondary.light` | `#F7E8E1` | Soft response and callout backgrounds |
| `success.main` | `#4B7C52` | Open/positive states and successful outcomes |
| `warning.main` | `#BD862D` | Pending approval and expiry warnings |
| `info.main` | `#527AA8` | Quoted and informational states |
| `error.main` | `#B8524C` | Validation errors and destructive actions |
| `background.default` | `#F2F3F2` | Application canvas |
| `background.paper` | `#FFFEFD` | Panels, dialogs, and cards |
| `text.primary` | `#252D38` | Headings and primary content |
| `text.secondary` | `#697483` | Supporting text, labels, and metadata |
| `divider` | `#DFE3E8` | Borders, separators, and chart grids |

The left navigation uses a separate light palette so it is visually distinct without changing the dashboard theme: surface `#ECEEE9`, text `#303236`, secondary text `#777A73`, selected/hover surface `#F3EAE5`, clay accent `#A45F4B`, and workspace-card border `#D9DDD5`. Keep these overrides under `.app-drawer`; do not use sidebar tokens on main content.

### RFQ status colors

Statuses must be labeled with text as well as color. Keep the chart, badges, filters, and detail views aligned to this semantic mapping.

| RFQ status | Color | Meaning |
| --- | --- | --- |
| Open | `#4B7C52` | Accepting quotes |
| Pending Broker Approval | `#BD862D` | Waiting on broker review |
| Quoted | `#527AA8` | One or more quotes received |
| Executed | `#315F9E` | Accepted and completed |
| Expired | `#A16B7B` | Deadline passed without execution |
| Draft | `#A2AAB4` | Not published |

Quote response states use the same status system: `Submitted` is informational, `Responded` is secondary/copper, `Accepted` is success, and `Declined` is neutral. Never rely on color alone to communicate status.

### Typography

- Typeface: IBM Plex Sans, with `Segoe UI` and sans-serif fallbacks.
- Use weights 400 for body text, 500 for headings and data values, 600 for labels, and 700 sparingly for primary actions or table emphasis.
- Use the MUI type scale and theme variants (`h1` through `h6`, `body1`, `body2`, `caption`, `overline`) rather than per-component font declarations.
- Keep dense data readable: body copy 14–16 px, table content 13–14 px, metadata 12 px minimum, and overlines 11–12 px.
- Use tabular numerals for prices, quantities, counts, and timers so columns do not visually jump.

### Spacing and shape

Use a 4 px spacing base: `4`, `8`, `12`, `16`, `24`, `32`, and `40` px. Prefer 8–16 px inside controls, 16–24 px inside panels, and 24–32 px between page sections.

Use 4 px corners for controls and panels; repeated cards may use up to 8 px. Borders are subtle and functional. Avoid nested cards and decorative shadows; reserve elevation for dialogs and menus.

## Components

### Buttons

| Variant | Use |
| --- | --- |
| Contained primary | The single main action in a view or dialog, such as Publish RFQ |
| Contained secondary | A deliberate secondary workflow action, such as Send response |
| Outlined | Supporting actions that need a visible boundary |
| Text | Row actions, filters, and low-emphasis navigation |
| Icon button | Familiar compact actions; use Lucide icons with a tooltip and accessible label |

Use sentence case, concise verbs, and consistent sizing. Provide visible hover, focus, disabled, and loading states. Destructive actions such as Decline should use the error color and must not visually compete with the main action. On touch layouts, target at least 44 × 44 px.

### Tags and status badges

Use MUI `Chip` for statuses, selected filters, and short metadata only. Keep status text visible, use outlined chips for dense tables, and use semantic tokens from the status table above. Do not create one-off badge colors.

### Forms

- Use React Hook Form with Zod for validation.
- Every field has a persistent label; placeholders are examples, never the only label.
- Put validation text beside the field, explain how to fix the error, and preserve entered values after errors.
- Use date/time inputs for deadlines, numeric inputs for prices and quantities, and searchable/multi-select controls for long option lists.
- Keep units visible in the label or input adornment; do not make users infer USD, MT, or liters.
- Keep submission disabled only while a request is processing; show inline progress and success/error feedback.

### Tables and RFQ cards

Tables are for comparison: align numeric values consistently, keep headers explicit, use subtle row dividers, and preserve horizontal scrolling on narrow screens. RFQ cards show the commodity, status, volume, target, quote count, delivery window, and expiry. Keep the whole card keyboard accessible when it navigates to details.

### Charts

Use Recharts with the status tokens above. Always pair the visualization with a visible legend and exact counts. Keep axes and gridlines low contrast, tooltips legible, and chart containers at stable heights. Provide equivalent textual summaries for users who cannot interpret color or the chart itself.

### Icons

Use Lucide React icons at 16–20 px with a consistent 1.75–2 px stroke. Pair unfamiliar icons with text or a tooltip; always set an accessible name on icon-only controls. Icons supplement labels rather than replacing important status text.

## Layout and behavior

- Keep navigation, page headers, filters, and detail layouts consistent across Trader and Broker views.
- Use responsive MUI breakpoints and the existing 600/680/900 px adaptations as starting points; recheck text wrapping and control reach at 390 px and desktop widths.
- Preserve clear focus indicators, keyboard navigation, and reduced-motion preferences.
- Meet WCAG AA contrast: 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries.
- Do not use color as the only state indicator. Pair it with text, icons, or shape.

## Implementation rules

1. Add or update a semantic token in the MUI theme before introducing a new color.
2. Reuse shared components from `src/components` instead of copying markup or styles between pages.
3. Keep sidebar-only visual decisions scoped to `src/SidebarPalette.css`.
4. When adding a new status, define its label, semantic color, chart color, and accessible text together.
5. Verify changes on Trader and Broker views, at desktop and mobile widths, and in the workflow tests.