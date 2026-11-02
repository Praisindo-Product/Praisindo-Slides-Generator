# Praisindo Application Design System

**Version:** 1.13.1  
**Status:** Master guideline  
**Last updated:** 2026-10-07  
**Applies to:** Praisindo financial, investment, wealth, risk, reporting, compliance, operations, and administration applications

## Purpose

This document defines a reusable design system for Praisindo applications built with Next.js,
Tailwind CSS, and shadcn/ui-style primitives. It provides a shared visual and interaction
language without depending on one product, regulation, domain model, workflow, scoring method,
or catalogue.

An implementation following this guide should feel precise, calm, restrained, and premium. It
should resemble a serious operating workspace rather than a marketing site, trading terminal,
or generic analytics dashboard. Dense information is welcome when its hierarchy is clear.

This is a master guideline. Its semantic tokens, accessibility rules, financial-state language,
and interaction principles provide the default standard. Exact layout values and page recipes
are starting points that may be adapted when a product's users, workflow, density, or approved
client branding requires it.

Where a product specification and this system differ, the product team should record the reason
for the variation and preserve the shared semantic layer. An accidental implementation difference
does not become canonical merely because it has been coded.

The reference defaults are:

- The desktop sidebar is 228 px wide, with a documented wider option for nested navigation.
- The application header is 56 px high.
- Page titles use 24/32 typography. Section titles inside a page use 13 px semibold sentence case.
- Focused content is at most 1080 px wide. Wide operational workspaces may use more space.
- Solid primary controls use a darker, contrast-safe accent token, while the brighter accent is
  reserved for links, focus, selected states, outlines, and progress.
- Status is a semantic dot with plain text. A tinted label is reserved for states that need a
  person.

## Versioning and ownership

This document uses semantic versioning:

- Major versions change core visual language, accessibility expectations, or component behavior.
- Minor versions add compatible tokens, patterns, components, or application profiles.
- Patch versions clarify language or correct an issue without changing intended behavior.

The shared design-system owner governs foundation and semantic tokens, primitives, and common
interaction behavior. Product teams own domain information architecture, workflow, and content.
Client branding should normally change approved theme tokens and assets rather than fork feature
components.

## Design thesis

Financial software earns trust by showing the state of the work, the quality of the answer, and
the origin of the answer at the same time. The interface should make four things immediately
clear:

1. What is the current result or position?
2. How reliable and current is it?
3. What requires attention next?
4. Which data, judgment, and methodology produced it?

Every page should answer three shorter questions:

- Where am I?
- What matters here?
- What should I do next?

## Core principles

### Lead with the decision, not the machinery

Put the current result, readiness, or required decision before supporting data and configuration.
Methodology, history, evidence, and technical detail remain easy to reach, but they should not
compete with the user's immediate task.

### Make reliability part of the result

A figure without coverage, recency, source, or methodology can be misleading. Present result and
reliability together. A current result, stale result, partial result, and unavailable result must
look and read differently.

### Be honest about absence

Missing is not zero. Unknown is not not-applicable. Not calculated is not failed. Not configured
is not unsupported. Do not collapse materially different states into a dash or a generic warning.
Use a dash only when a value genuinely does not apply and nearby text makes that meaning clear.

### Separate facts, judgments, and governing rules

Keep these layers visually and semantically distinct:

1. Source or authority: the document, policy, mandate, or market source.
2. Methodology: the threshold, weighting, interpretation, model, or client configuration.
3. Execution: the actual inputs, transformations, result, warnings, actor, and timestamp.

Likewise, keep a system result, professional judgment, and the result used downstream in separate
fields. Never compress them into a slash-separated label.

### Use progressive disclosure

Start at the altitude where the user makes a decision. Put definitions and long explanations on
the detail page or behind a disclosure. Use tabs for distinct modes of work and a contextual
drawer or dialog for supporting information that should not interrupt the current task.

### Ask one consequential question at a time

When a workflow has mutually exclusive routes, ask the route question before rendering fields.
Explain the consequence of each choice before selection. Once a route is chosen and stored,
collapse the decision to one concise line with a way to change it.

### One obvious action per scope

Each page has one visually dominant action. Each row or card has at most one primary destination.
A header carries at most two controls side by side. Beyond two, the dominant action keeps its
button and every other action collapses into one menu beside it, with anything destructive last
and separated. Use `HeaderActions` rather than laying the buttons out by hand, so the threshold
is the same on every page.
Secondary actions use secondary, ghost, link, disclosure, or overflow treatments. Two controls
that lead to the same place are one control too many.

### Prefer structure over decoration

Use spacing, typography, alignment, and one-pixel borders to establish hierarchy. Color is a
semantic signal, not ornament. Avoid glossy gradients, heavy shadows, oversized illustrations,
celebratory effects, and decorative charts.

### Keep the interface quiet, not faint

Muted information must still be readable. Do not lower opacity until secondary text fails
contrast. Quietness comes from size, weight, placement, and semantic color rather than illegible
text.

## Experience character

The product should feel:

- Precise: figures, units, dates, and states are explicit.
- Calm: no flashing market-ticker behavior or unnecessary motion.
- Restrained: accent and status colors are used sparingly.
- Premium: typography, alignment, and spacing are polished rather than ornamental.
- Defensible: results can be traced to their sources and transformations.
- Work-oriented: the next useful action is easier to find than decorative insight.

The product should not feel:

- Like a consumer banking app with oversized balances and promotional cards.
- Like a trading terminal with constant red and green motion.
- Like a generic business-intelligence dashboard filled with charts.
- Like a document repository that makes users hunt for the operative result.
- Like an admin console that exposes enums, internal IDs, or implementation language.

## Foundations

### Typography

Use Libre Franklin as the primary sans-serif. Self-host the variable upright and italic font
files and load them through `next/font/local`. This prevents visual drift between builds and
avoids a third-party request in a product handling sensitive financial information.

Fallback stack:

```css
var(--font-libre-franklin), ui-sans-serif, system-ui, sans-serif
```

Type scale:

| Role                     | Size and line height | Weight     | Notes                                                |
| ------------------------ | -------------------- | ---------- | ---------------------------------------------------- |
| Composite or hero rating | 52/56                | 700        | Reserve for the single most important result.        |
| Compact result display   | 40/48                | 600        | Use when the hero also contains supporting controls. |
| Factor or large result   | 32/36                | 600        | Use for one level below the composite.               |
| Page title               | 24/32                | 600        | Letter spacing `-0.02em`. One per page.              |
| Small result             | 24/32                | 600        | Cards and factor summaries.                          |
| Metric result            | 22/28                | 600        | Emphasized value inside a result grid.               |
| Panel or step title      | 18/28                | 600        | Letter spacing `-0.01em`.                            |
| Section title            | 13/20                | 600        | Sentence case heading inside a page, panel, or step. |
| Product or row title     | 15/24                | 600        | Compact local heading.                               |
| Card title               | 14/20                | 600        | Default card heading.                                |
| Body                     | 14/22                | 400        | Default application text.                            |
| Dense body and table     | 13/20                | 400 to 500 | Tables, forms, summaries, and task lists.            |
| Label and caption        | 12/18                | 500        | Metadata and secondary facts.                        |
| Microcopy                | 11/16                | 400 to 500 | Build number and graph metadata only.                |

Sizes are tokens named by role, never a literal pixel class, because a theme's text size scales
them all together and a literal size would not follow it:

| Class | Size | Use |
| --- | --- | --- |
| `text-2xs` | 10 | Key caps and the smallest graph metadata |
| `text-micro` | 11 | Microcopy, navigation group names, category tags |
| `text-label` | 12 | A label sized alone, without the line height `text-xs` brings |
| `text-dense` | 13 | Dense body and tables |
| `text-body` | 14 | Body, without the line height `text-sm` brings |
| `text-title` | 15 | Product, row and panel titles |
| `text-lead`, `text-subhead` | 16, 17 | Rare lead lines |
| `text-heading`, `text-metric`, `text-result` | 20, 22, 24 | Headings and result values |
| `text-display-sm`, `text-display` | 26, 28 | Display results |

Tailwind's own `text-xs` to `text-3xl` are tokens too and scale the same way. A new role is added to
`globals.css` and to `TYPE_ROLES` in `src/lib/utils.ts` together, or merging classes would read it
as a colour and drop it.

Rules:

- Use sentence case for titles, actions, and labels.
- Use uppercase only for navigation group names. An uppercase eyebrow above every section produces
  a templated rhythm; inside a page, a 13 px semibold sentence-case heading is the section marker.
- A page title never competes with the data it introduces. Reserve display sizes for a single
  headline result, not for the name of a register.
- Use `font-variant-numeric: tabular-nums` for scores, dates, amounts, ratios, and aligned counts.
- Keep explanatory prose between 60 and 80 characters per line. The default measure is 68ch.
- Avoid more than three font weights on one screen.
- Do not use typography to mimic advertising or editorial layouts.

### Color model

Dark mode is the default experience. Light mode is a complete, accessible alternative, not an
inverted afterthought. Components consume semantic tokens only; feature code should not carry raw
hex values except for exceptional overlays or third-party chart configuration.

#### Dark theme

| Token                | Value                      | Use                                                              |
| -------------------- | -------------------------- | ---------------------------------------------------------------- |
| `background`         | `#090c12`                  | Viewport and main canvas.                                        |
| `sidebar`            | `#0c111b`                  | Persistent navigation.                                           |
| `surface`            | `#111722`                  | Cards, header, controls, and panels.                             |
| `raised`             | `#151d2b`                  | Hover, table header, selected-neutral, and nested surface.       |
| `border`             | `#263244`                  | Hairlines, card outlines, and separators.                        |
| `foreground`         | `#f5f7fb`                  | Primary text.                                                    |
| `muted`              | `#9aa8bc`                  | Captions, metadata, and tertiary text.                           |
| `muted-strong`       | `#c5d0e0`                  | Secondary prose and supporting values.                           |
| `accent`             | `#537cf6`                  | Links, focus, progress, selected borders, and active indicators. |
| `accent-hover`       | `#6f91ff`                  | Accent hover state.                                              |
| `accent-solid`       | `#4a6fe0`                  | Solid primary buttons with white text.                           |
| `accent-solid-hover` | `#5b7fee`                  | Solid primary button hover.                                      |
| `accent-contrast`    | `#ffffff`                  | Text on solid accent.                                            |
| `accent-subtle`      | `rgba(83, 124, 246, 0.14)` | Selected rows and active navigation.                             |
| `success`            | `#35c889`                  | Current, complete, or successful.                                |
| `warning`            | `#f5b84b`                  | Stale, provisional, or attention required.                       |
| `danger`             | `#f06a6a`                  | Invalid, failed, destructive, or blocking error.                 |
| `info`               | `#6aa7ff`                  | Neutral information.                                             |

#### Light theme

| Token                | Value                      | Use                                              |
| -------------------- | -------------------------- | ------------------------------------------------ |
| `background`         | `#ffffff`                  | Viewport and main canvas.                        |
| `sidebar`            | `#f6f8fc`                  | Persistent navigation.                           |
| `surface`            | `#ffffff`                  | Cards, header, controls, and panels.             |
| `raised`             | `#f2f5fa`                  | Hover, table header, and nested surface.         |
| `border`             | `#d8e0ec`                  | Hairlines, card outlines, and separators.        |
| `foreground`         | `#0d1522`                  | Primary text.                                    |
| `muted`              | `#4d5b70`                  | Captions, metadata, and tertiary text.           |
| `muted-strong`       | `#334054`                  | Secondary prose and supporting values.           |
| `accent`             | `#2f57cc`                  | Links, focus, progress, and selected borders.    |
| `accent-hover`       | `#24469f`                  | Accent hover state.                              |
| `accent-solid`       | `#2f57cc`                  | Solid primary buttons.                           |
| `accent-solid-hover` | `#24469f`                  | Solid primary button hover.                      |
| `accent-contrast`    | `#ffffff`                  | Text on solid accent.                            |
| `accent-subtle`      | `rgba(83, 124, 246, 0.12)` | Selected rows and active navigation.             |
| `success`            | `#10794f`                  | Current, complete, or successful.                |
| `warning`            | `#8a5a06`                  | Stale, provisional, or attention required.       |
| `danger`             | `#b4272c`                  | Invalid, failed, destructive, or blocking error. |
| `info`               | `#1f5fb8`                  | Neutral information.                             |

The brighter accent and the solid-button accent are intentionally separate. White text on the
dark theme's `#537cf6` does not meet normal-text AA contrast. Never merge those tokens.

#### Categorical series

Use categorical colors to preserve identity, never rank. An asset class, portfolio sleeve, or
category keeps its color when its weight changes.

| Slot     | Light     | Dark      |
| -------- | --------- | --------- |
| Series 1 | `#2a78d6` | `#3987e5` |
| Series 2 | `#eb6834` | `#d95926` |
| Series 3 | `#1baf7a` | `#199e70` |
| Series 4 | `#eda100` | `#c98500` |
| Series 5 | `#e87ba4` | `#d55181` |

Always pair a categorical visualization with a labeled legend or table. Some series colors do
not independently meet text contrast on white and must never be the only carrier of meaning.

#### White-label themes

An institution's look is a theme: the same tokens, given other values. No component carries a
client name or a client condition. A theme holds, for each of light and dark:

- A logo, a minimized logo for the collapsed sidebar (its own image, or a crop of the logo), and an
  optional sidebar watermark.
- Seven colours: brand, second brand, page background, cards and panels, sidebar, sidebar text
  (optional) and text.

Everything else is derived and held to contrast: borders and hover shades from the page, cards and
text; muted and secondary text at 4.5:1 or better on every surface they sit on; the link and focus
accent at 4.5:1 on the page; the solid button in the brand colour with white text where a small
deepening allows it, dark text where it does not. The sidebar receives its own token scope, so a
sidebar unlike the page still reads. A page, card or sidebar near middle grey is moved toward
light or dark until text has 7:1 on it, and cards on the other side of light and dark from the page
are brought to the page's side. Each correction is shown to the person with the shade used.

Success, warning, danger, info, gains and losses keep their hues on every theme; only their
lightness moves, and only as far as a new page needs. The second brand colour takes the second
chart series. The light and dark palettes are separate; one is suggested from the other by keeping
hues and moving lightness in OKLCH, never by inverting.

Logos are drawn in a box sized for their visible artwork toward one visual area, so a long
wordmark is drawn shorter than a stacked logo. Proportions are kept, artwork is never stretched or
cut, and a size setting moves the box between 60% and 150% within hard caps. Whether the
institution's name is set beside the logo is the theme's choice: on for a logo that is a symbol, off
where the logo spells the name. With it on, a mark-shaped logo reads as a wordmark would and a long
one is drawn shorter to give the name room; client statements follow the same choice. The watermark sits in the sidebar's bottom corner, decorative, behind
everything, at the strength the theme sets.

##### Documents and file exports

Every file the platform exports belongs to the institution. A document a person reads, a client's
consolidated statement first, carries on every page:

- The institution's legal name and context from its record, never the platform's name.
- Its logo: the light theme's, else the dark theme's, else the logo on its record. Never the
  platform's; without a logo of its own the name stands alone. The logo is printed as a PNG trimmed
  to its artwork and sized by it at the theme's logo size, as the sidebar sizes it.
- Its brand colours, on white paper whatever the screen's mode: the brand colour draws the
  portfolio's line and the first chart series, the second brand colour the second, then the
  platform's series that differ from them. Each is held to 3:1 against white. Gains, losses and
  states keep their own colours, as on screen.
- The institution as the document's author and creator in its metadata.

`printBrand` (`src/features/theme/print-brand.ts`) reads all of this from the record and the saved
theme in the browser; the pure rules are `printPalette` and `printLogo` in
`src/domain/theme/print.ts`. Every exporter calls it and passes the result into the document's
data, so a new export cannot fall back to the platform's look by forgetting. A data file (CSV,
spreadsheet) carries no styling, but names the institution wherever its format holds a title, a
header or metadata.

Beyond colour, a theme has a look and feel and, rarely, advanced settings:

- **Look and feel**, for the whole workspace and both modes: corners (Sharp, Standard, Soft, Round:
  the card, control and tag radii scaled together), text size (Compact 93%, Standard, Comfortable
  107%, Large 114%: every type token scaled together) and typeface (Libre Franklin, Inter, IBM Plex
  Sans, Source Sans 3, or the device's own). Each is chosen by picture, not by number. Documents keep
  their own typeface.
- **Advanced settings**, one part at a time: page, sidebar, menu items, tabs, page title, cards and
  panels, tables, tags, links, buttons and fields, each with a few properties (corners, text size,
  weight, row height, an underline's thickness, and colours per mode). Every property is automatic
  until set, and an automatic property follows the look and feel and the brand colours. A part's
  colours are held to the contrast their use needs, as the brand colours are.

A shared component a part setting reaches reads the setting's custom property with its design-system
value as the fallback, for example `rounded-[var(--radius-button,var(--radius-control))]` or
`text-[length:calc(var(--text-dense)*var(--scale-table,1))]`. A theme that sets nothing writes
nothing, so the platform's look is unchanged to the pixel. A weight is read with `font-(--weight-…)`,
whose default sits on `:root`, so a caller's own `font-normal` still overrides it. The registry of
parts and properties is `STYLE_PARTS` in `src/domain/theme/style.ts`; a new part or property is an
entry there and a fallback in the component, never a condition in a component.

Theme Configuration is edited as a draft. The preview follows the workspace's light or dark switch,
and the save bar is pinned flush to the bottom of the content area, so Save, Discard and Undo are
in reach wherever the page is scrolled and what just happened is said there. The settings reveal
themselves in order of need: brand (logo, minimized logo, watermark, colours), then look and feel,
then advanced settings, which open as the component editor: the parts listed by group, a large
preview in which pointing at a part outlines it everywhere it appears and clicking it chooses it, and
an inspector with the part's main properties and the rest behind More settings. A property that only
matters while another has a value appears only then (a stroke's colour while the stroke shows).
Every property says Automatic or offers Reset; a slider's drag is one step to undo. Presets sit in a
collapsible section at the foot of the page, closed by default: the institutions the platform ships,
and up to five looks the institution saves for itself, each holding both themes, the look and feel
and the advanced settings.

### Spacing

Use a four-pixel base with this preferred scale:

```text
4, 8, 12, 16, 24, 32, 48
```

Common compositions:

- 4 px between a label and its related value.
- 6 px to 8 px between a field label, control, help, and error.
- 8 px between compact list items or controls.
- 12 px inside dense rows and between tightly related blocks.
- 16 px default card padding.
- 20 px for prominent result panels and page-level cards.
- 24 px between sections within one subject.
- 28 px page-stack gap and desktop vertical page padding.
- 32 px desktop horizontal page padding.
- 48 px only for major empty or onboarding separation.

Dense does not mean cramped. A dense screen should have strong column alignment and repeatable
rhythm, not smaller unreadable type.

### Shape, border, and elevation

- Card radius: 10 px.
- Control radius: 8 px.
- Tag and small-label radius: 4 px. Reserve fully rounded shapes for a genuine capsule, such as an
  avatar or a single count indicator; a page of pills reads as decoration.
- Standard border: 1 px solid `border`.
- Active navigation indicator: 2 px solid `accent`.
- Cards normally have no shadow.
- Tooltips may use a small shadow.
- Modals use a restrained large shadow over a 70% near-black backdrop.
- Empty states use a dashed border.
- Avoid nested cards when a divider, definition list, or disclosure communicates the hierarchy.

### Browser chrome and text rendering

- Use antialiased text rendering.
- Set the browser `color-scheme` to match the active theme so native controls are coherent.
- Use thin scrollbars: 3 px where WebKit sizing is available, with a border-colored thumb on a
  transparent track.
- Tint text selection with `accent-subtle`.
- Prevent viewport overscroll and accidental horizontal document scrolling inside the fixed shell.

### Icons

Use one outline icon family. The chosen family is Phosphor, consumed through `react-icons/pi`.
When a needed metaphor is missing, fall back in this order: Circum, then Ionicons 5. Do not use
Lucide. The normal icon size is 16 px; small metadata icons may be 14 px, and compact empty-state
icons sit inside a 24 px neutral tile (see Addenda, Status color and containers).

- Icons reinforce text and do not replace it for important actions or states.
- Decorative icons use `aria-hidden="true"`.
- Icon-only controls require an accessible name and a tooltip where discovery matters.
- Use consistent metaphors across navigation, rows, alerts, and empty states.
- Do not mix filled, multicolor, and outline icon styles on the same surface.

## Layout system

### Viewport ownership

The application shell owns the viewport. Lock document scrolling and let only the main content
region scroll vertically. The sidebar and header remain in place. If sidebar navigation exceeds
the viewport, its list scrolls independently.

This creates a stable workstation: context and navigation do not disappear during long forms or
tables.

### Desktop shell

```text
Viewport
├── Sidebar: 228 px default, full height
└── Work area
    ├── Header: 56 px high
    ├── Optional application tab strip: 40 px high
    └── Scrollable main region
        └── Content: focused or operational width, 32 px x 28 px page padding
```

The shell dimensions are reference defaults, not immutable values. Select a declared layout
profile for each application:

| Profile | Content behavior | Typical use |
| --- | --- | --- |
| Focused | Centered, up to 1080 px | Forms, detail pages, methodology, administration |
| Operational | Fluid, up to 1600 px or available width | Registers, reconciliation, work queues, dense tables |
| Analytical | Fluid with a readable text column inside it | Dashboards, comparisons, charts, portfolio analysis |

Use a 228 px sidebar when labels remain clear. A complex application with two grouping levels or
longer domain terms may use 248 px, within a practical range of 228 to 272 px. The chosen width
must be a shell token and remain consistent within that application.

Sidebar anatomy:

1. Brand mark and concise product name.
2. One-line product descriptor.
3. Primary work navigation.
4. Administration navigation, shown only when relevant.
5. Build version at the bottom in readable muted text.

Header anatomy:

1. Organization or account context on the left.
2. Reporting period or portfolio context as secondary text.
3. Notifications, theme, and profile controls on the right.

Do not repeat the same context in both sidebar and header.

An application tab strip may sit between the header and main region when users regularly keep
several records or workspaces open. It is separate from in-page tabs:

- Application tabs represent open destinations and may be closed or reordered.
- In-page tabs organize sections within the current destination.
- Do not enable application tabs by default in applications where browser tabs and breadcrumbs
  already support the work efficiently.
- Restore tabs only when restoring their context is safe and understandable.
- Application tabs behave as browser tabs. Each keeps its page alive while another is in front and
  reopens where it was left: the record, the in-page tab, the filters, the open drawer, the scroll
  position and any half-finished form. A tab remembers its address across a refresh; its unsaved
  form does not.

### Navigation hierarchy

Use the smallest set of top-level domains that accurately matches the users' work. Do not impose
one universal number. Put reference data, configuration, and administration in clearly labeled
groups. Hide destinations a profile cannot use rather than presenting a wall of disabled
navigation.

Complex applications may use up to two non-clickable grouping levels before a clickable page:

```text
Domain group
└── Capability group
    └── Page
```

Both grouping levels must carry meaning. Do not add a level only to make the tree visually
symmetrical. A capability group should normally contain at least two related destinations. A
single destination may be linked directly from its domain group.

Large domain hierarchies belong inside their workspace. Do not place every portfolio, account,
metric, risk, or report in global navigation.

Active navigation uses:

- `accent-subtle` background.
- Foreground text at medium weight.
- A 2 px accent bar at the leading edge.
- No filled icon or loud badge unless it communicates an actionable count.

When navigation is waiting for a route, replace its icon with a same-size spinner so the row does
not reflow. Announce the loading state to assistive technology.

### Page frame

The page content is a vertical stack with a 28 px gap. A standard page header contains:

1. Breadcrumbs.
2. Page title.
3. One short sentence describing what matters on the page.
4. Optional status badges.
5. One primary action aligned to the right on wide screens.

Breadcrumbs use 12 px muted text and compact chevrons. The last crumb is plain text with
`aria-current="page"`. Every earlier crumb that is a real destination is a link: from a record, the
register that owns it is one click away. Grouping levels are not destinations and stay plain.

### Responsive behavior

Every application declares one supported viewport profile. Internal financial workstations use
the desktop profile by default. Do not imply phone support unless the application has been
designed and tested for it.

| Profile | Required reference viewports | Expectation |
| --- | --- | --- |
| Desktop workstation | 1440 by 900 and 1920 by 1080 | Complete production workflow |
| Adaptive | Desktop plus 768 by 1024 | Complete or explicitly bounded tablet workflow |
| Fully responsive | Desktop, tablet, and 360 by 800 | Complete phone workflow |

At desktop widths:

- Use the persistent shell and declared content-width profile.
- Let wide tables scroll inside a rounded bordered container. Do not allow the page itself to
  scroll horizontally.
- Preserve a readable text measure inside wide analytical pages.

When an application declares adaptive or fully responsive support:

- At tablet widths, reduce main horizontal padding, allow headers and action groups to wrap, and
  keep drawers usable without covering their own close controls.
- At phone widths, replace the persistent sidebar with a labeled navigation trigger and a modal
  navigation sheet. Keep the 56 px header and use 16 px main padding.
- Collapse multi-column summary grids to two columns and then one.
- Forms use two columns from `sm` upward and one column below it.
- Let tables scroll inside a rounded bordered container. Do not allow the page itself to scroll
  horizontally.
- Keep the identity column visible or repeat identity within a card transformation when a table
  cannot remain intelligible on a phone.
- Default complex lineage to its text outline on a phone.

At 200% zoom, every supported profile must keep content and actions reachable without overlap.
On large displays, retain the 1080 px reading width for prose and focused forms even when their
surrounding workspace is wider.

## Choosing a surface

Before composing a screen, choose the container the work belongs in. The wrong container is the
most expensive mistake in an operational product: a resumable process trapped in a dialog, or a
one-line decision spread over a page, costs more than any amount of visual polish.

| Surface | Use it when | Never use it for |
| --- | --- | --- |
| **Full page** | The work has its own identity, a URL, and a life longer than one sitting: a record, a register, a guided workflow, a configuration area | A single confirmation |
| **Dialog** | One focused, short, non-resumable decision or a small capture that must finish now: confirm, name a reason, pick a subject | Multi-step work, anything a person leaves and returns to, anything that needs a URL |
| **Drawer** | Contextual inspection beside the list that produced it: a record's detail, an event's evidence, a calculation breakdown | A durable record that other screens must link to; a drawer supplements a record page, it does not replace one |
| **Popover** | Supplementary content anchored to a control: a menu, a picker, a definition, a small filter | Anything a person must read to complete the task, or content that needs its own scroll |
| **Tabs** | Distinct modes of work on one subject, each meaningful alone | Sequential steps, or hiding a blocker the reader must see |
| **Accordion or disclosure** | Optional supporting material, technical detail, long explanation | A blocker, a validation error, a required action, a primary result |
| **Card** | A genuinely bounded surface that must be compared with siblings, or a container that carries its own actions | Grouping that a heading, a hairline, or spacing already provides |
| **Table** | Comparable records that people scan, sort, and act on repeatedly | Paragraphs, long requirements, or a single record's facts |
| **Definition list** | One record's facts, methodology, scope, or provenance | Comparing many records |
| **Guided workflow** | One choice changes later data, validation, or approval; the work spans a sitting | A form whose fields are all independent |
| **Worklist** | Work the user is accountable for, ordered by the workflow's own priorities | A catalogue of records with no pending action |
| **Empty state** | Any region that can legitimately hold nothing | Hiding a failure, or narrating development status |

Entry to a workflow may be a dialog; the workflow itself is a page. Pick the subject in a compact
dialog, then close it and open the work at its own route.

## Information hierarchy patterns

### Outcome-first dashboard

Order a financial operations dashboard as follows:

1. Primary outcome, state, position, readiness, or exception with its reliability and timestamp.
2. Blocking work and the next resolvable action.
3. Comparable category, factor, or portfolio summaries.
4. A short priority list.
5. Calculation context, history, and provenance.

The dashboard is not a chart gallery. Use cards only where comparison benefits from equal
containers. Use compact bordered lists for tasks and work queues.

### Workspace overview

A workspace is progress-oriented rather than one long form. Show:

- Overall outcome or state.
- Completion and blocker count.
- The next incomplete item.
- A worklist organized by the user's workflow.
- Latest run or valuation context.
- Links to readiness and lineage.

Follow the work rather than the catalogue or database hierarchy. Users may think in terms of a
customer, account, order, holding, exception, or report even when the underlying data model begins
elsewhere.

### Detail page

Place the current state and consequence above the form. A typical detail page contains:

1. Header and status.
2. Outcome or state summary.
3. Tabs for the work and supporting context.
4. Previous and next navigation where users process a sequence.

Choose tabs from the work that exists. Common options include:

- Overview.
- Data or inputs.
- Decisions or approvals.
- Calculation or allocation.
- Documents and evidence.
- Integration and reconciliation.
- Governing rules or scope.
- History and audit trail.

Build the tabs from sections that actually exist. Do not show an empty system-data tab for an
item that is determined entirely by a person.

### Operational register

Use a register for entities, instructions, transactions, holdings, reports, and exceptions that
users scan and act on repeatedly. Keep search, filters, saved views, counts, export, and the primary
creation action in a stable toolbar. Make status, ownership, effective date, source, and exception
state visible when they affect the next action.

Use bulk action only when the same action is safe and explainable for every selected row. A row
opens one canonical detail destination. Secondary row actions belong in a compact menu.

A register is judged on scanning, comparison, and action:

- Scanning: one row per record, one line per row, aligned columns, and no wrapping.
- Comparison: numbers right-aligned with tabular numerals, dates in one format, states in one
  vocabulary.
- Action: a clear row destination, and the applied policy stated once in context rather than as a
  repeated banner.

### Guided workflow

Use a guided workflow when the consequence of one choice changes later data, validation, or
approval requirements. Ask high-impact routing questions first, reveal dependent fields only when
needed, and show a review step before commitment.

Every guided workflow in an application uses the same frame, so a person who has completed one can
complete the next:

1. A page header naming the subject, its state, and its reference.
2. A stable context summary of two to five facts that stays visible on every step.
3. A step list on one side showing done, current, action required, and not started. The marker says
   where the step sits in the sequence, not how urgent it is: a check for done, a number for
   everything else, and colour only on the step the reader is looking at. A step that needs
   attention says so in words beneath its name.

   Those four states are read from the record, never from where the reader is standing. A step the
   workflow finished is done even when it is the last one, so a finished workflow shows no current
   step. Current belongs only to something still in progress. Action required is for a step that
   has been reached and is holding the work up; a requirement on a step nobody has opened yet is
   simply not started. A workflow that stopped part way keeps the steps it actually finished.
4. The current step's position stated in words, its own title, and one short description.
5. Fields grouped by intent, revealed progressively.
6. An action row in the same place on every step: a way back on one side, the one forward action on
   the other. Moving between steps returns the scrolling region to the top, so a person lands on the
   next step's heading rather than halfway down it.
7. Destructive or closing actions kept out of the step body and out of the header's primary row.

The user must be able to save a draft when the business process allows it. Display the current
step, completed steps, blockers, and the effect of changing an earlier answer. Do not force a
linear wizard when users need to move between sections during review.

### Integration and reconciliation workspace

An integration workspace shows how records entered manually, imported from a file, received from
an API, or processed in a batch converge on the same domain record. Present:

- Source system and external reference.
- Received, processed, and effective timestamps.
- Validation and mapping result.
- Accepted, rejected, duplicate, stale, and repair states.
- Internal and external values when reconciliation is required.
- Retry, repair, match, accept, or escalate actions when allowed.

Integration is part of the affected workflow, not a separate technical afterthought. Keep raw
payloads and diagnostics behind contextual detail unless they are the user's primary work.

### Configuration workspace

Configuration pages explain the business consequence of a setting, its scope, effective period,
default, override, and dependency. Separate business configuration that authorized client users
may manage from internal application configuration governed by Praisindo.

Show a preview or impact summary before a consequential change. Preserve version history and the
effective configuration used by completed records. Never silently reinterpret historical results
using a new rule.

### Report catalogue and run

Use a catalogue when an application exposes many standard, regulatory, ad hoc, or analytical
reports. Help users choose by purpose, domain, period, audience, and status. A report run shows its
parameters, source data time, generation state, validation results, output files, and submission
or distribution history when applicable.

Reports may also be entered contextually from the domain they describe. Both entry points must
open the same report definition and preserve the user's context.

### Contextual detail

Use a right-side drawer for evidence detail, calculation breakdown, lineage node detail, task
detail, or audit history. On a page whose purpose is to do work, such as a guided workflow, the
audit trail belongs in that drawer rather than beneath the work: it is evidence, consulted
occasionally, and a log running under a form competes with the task. Use a modal when the user must acknowledge or decide something before
continuing. Do not navigate away for information that merely supports the current decision.

## Component language

### Buttons

All buttons are inline-flex, horizontally centered, medium weight, 8 px radius, and use a 150 ms
color transition. Icons are 16 px and separated from text by 8 px.

Variants:

| Variant   | Treatment                                | Use                                         |
| --------- | ---------------------------------------- | ------------------------------------------- |
| Primary   | Solid `accent-solid`, white text         | The one main action in the current scope.   |
| Secondary | Border plus `raised` background          | Supporting actions and navigation.          |
| Ghost     | No border, muted text, subtle hover fill | Cancel, reveal, remove, or utility actions. |
| Link      | Accent text with underline on hover      | Low-emphasis navigation within prose.       |

Sizes:

| Size   | Height | Horizontal padding | Text  |
| ------ | ------ | ------------------ | ----- |
| Small  | 32 px  | 12 px              | 13 px |
| Medium | 36 px  | 16 px              | 14 px |
| Large  | 40 px  | 20 px              | 14 px |

Disabled controls remain legible at 50% to 60% opacity, do not accept pointer events, and should
have an adjacent explanation when the reason is not obvious.

A page header's actions follow one order, left to right: secondary actions, then the primary
action, then the "More actions" menu (three dots) as the rightmost control. The primary action is
never left of a secondary one, and nothing sits right of the menu. `HeaderActions` enforces this;
build headers with it rather than by hand.

### Cards and panels

Cards use a surface background, 1 px border, and 10 px radius. Default card padding is 16 px;
prominent result cards use 20 px. Headers stack with a 4 px gap. Cards do not lift on hover;
interactive cards change their border to accent.

Prefer these lighter structures before adding another card:

- Hairline-separated list.
- Definition list.
- Bordered section with no background change.
- Disclosure.
- Tab panel.

### Status language

An operational screen carries several different kinds of small labelled value, and giving them all
the same pill makes a healthy record look as urgent as a blocked one. Classify the value first,
then pick its treatment. Five treatments cover the field; anything that does not fit one of them is
plain text.

| Treatment | What it communicates | Visual form |
| --- | --- | --- |
| **Status indicator** | Durable business or workflow state: active, ended, in progress, completed, scheduled | Semantic dot, 6 px, plus plain 13 px text. No border, no fill |
| **Exception indicator** | A state that needs a person, or a terminal negative outcome: action required, review required, rejected, failed | Low-alpha semantic tint, 4 px radius, 12 px medium text. No icon unless the words alone are ambiguous |
| **Category tag** | Classification, not state: primary identifier, provisional record, record type | Neutral raised surface, 1 px border, 4 px radius, 11 px muted-strong text, no semantic colour |
| **Count badge** | An actionable quantity: outstanding items, items in a queue | Compact raised container with tabular numerals; warning tint only when the count is the exception |
| **Integration state** | A synchronization or submission result: new, changed, accepted, rejected, held, in sync | Semantic icon plus plain text, no fill and no border |

Rules:

- The common healthy state is the quietest thing in the row. `Active` on every record must not be
  the loudest element in a register.
- Colour never carries the meaning alone. Every treatment pairs colour with a word, and the
  integration treatment adds a shape as well.
- An exception label is a label, not a warning sign. The words say what is wrong; a tint supports
  them. Reserve warning and prohibition icons for a genuine alert, where one instance addresses the
  reader directly. A column of tinted icons turns three ordinary unfinished steps into an emergency.
- One concept, one treatment, product-wide. If two screens show the same state differently, the
  reader learns to distrust both.
- A dot, a tint, or an icon never replaces the label. There is no colour-only status.
- Do not raise a low-importance fact to a semantic treatment. A record type is a category tag, not
  a success state.
- Keep every treatment inside the row's line height. A status must not make rows taller.
- Avoid saturated outlines and capsule shapes. A ring of colour around every value reads as decoration.
- Prefer plain text when the value is neither a state nor a classification: a boolean answer, a
  count with no action behind it, a value that is simply a fact.
- When a state requires action right now, an inline alert in context beats a louder label.

Verify status treatments in place, not in a component gallery: table cells, record headers,
workflow summaries, inspectors, filters, tabs, empty states, and integration results.

### Alerts

Alerts are horizontal, compact, and factual: 16 px padding, 12 px gap, 13/20 text, card radius,
and a semantic border. The background remains `raised`; a large tinted fill would overpower the
page.

An alert states:

1. What happened.
2. What was preserved or affected.
3. What the user can safely do.
4. A stable reference when support may be needed.

Use `role="alert"` for urgent errors and `role="note"` for explanatory information.

### Progress

Progress bars are 8 px high by default and 6 px in compact cards. Use a raised track with an inset
border ring and an accent fill. The visual bar must expose its numeric value, label, and readable
text nearby. Clamp display values from 0 to 100.

Progress measures completion, not performance. Do not use a progress bar as a decorative score
gauge.

### Tabs

Tabs sit on a bottom border. Each tab uses 14 px text, 12 px horizontal padding, 8 px vertical
padding, and a 2 px bottom indicator. Active tabs use foreground text at medium weight and an
accent border. Inactive tabs use muted-strong text with foreground hover.

Behavior:

- Implement the WAI-ARIA tabs pattern.
- Support Left, Right, Home, and End keys.
- Keep inactive panels mounted when preserving unsaved state matters, but hide them from the
  accessibility tree with `hidden`.
- Store the active tab in the URL when it is useful for sharing or returning.
- Use history replacement for local tab changes so the Back button traverses pages, not every tab.
- Wrap tabs on narrow screens rather than truncating labels beyond recognition.

**One row of tabs per working area. Never nest tabs.** A tab strip inside a tab panel makes the
reader work out which row changed what, and hides the second row behind the first. When a page
needs both approval views (Records, My Requests, Pending Approval) and views of its own records,
put them in one row: the page's own views take the place of the Records tab, and the approval tabs
follow them. Where one row would carry too many tabs, split the content another way instead of
adding a row:

- sections stacked on the page under headings, when the reader benefits from seeing them together;
- a filter or segmented choice above one table, when the views are the same records sliced
  differently;
- a page of its own in the navigation, when the view is a job of its own.

A record's tabs under the application tab strip are not nested tabs; the rule is about two strips
inside the same working area.

### Disclosure

Use native `details` and `summary` for optional supporting material. Replace the browser marker
with a 14 px chevron that rotates 90 degrees. A disclosure should not hide a blocker, primary
result, validation error, or action required to complete the page.

### Definition lists

Definition lists are the preferred pattern for methodology, scope, source, and execution facts. A
value is a fact: a number, a state, a name, a link to the record it names. Controls do not belong
in it. Where a group of facts has an action, put that action beside the group's heading, one per
group, so the list stays readable down its value column.
Use a 170 px term column on larger screens and stack term above value on small screens. Terms use
muted text; values use foreground or muted-strong. Keep related facts in one bordered region.

### Tables

Tables are for scanning comparable records, not for storing paragraphs.

Visual rules:

- Use 13 px body text.
- Use 12 px or 13 px medium-weight headers.
- Use a raised header background for dense operational tables.
- Use 12 px horizontal and 8 px to 10 px vertical cell padding.
- Separate rows with one-pixel borders.
- Highlight hover and focus-within with `raised`.
- Keep the primary identity column widest.
- Right-align numeric values when comparison benefits; always use tabular numerals.
- Put long definitions and requirements on the detail page.
- Use contained horizontal scrolling with a declared minimum table width.
- Do not virtualize until measured performance requires it.

Interaction rules:

- Make the entire row one stretched link when every cell leads to the same destination.
- Provide one actual focus stop per row; trailing chevrons are decorative.
- If a row action differs from row navigation, expose it as a clearly named control.
- Sort headers are real links or buttons with `aria-sort` on the `th`.
- Keep search, filters, sort, and page in URL parameters.
- Server-side filtering, sorting, and pagination are preferred for large financial registers.
- Pagination preserves filters and focus.
- Never hide warnings or material values in hover-only content.
- A table whose rows carry a checkbox carries a select-all checkbox in the same column's header.
  It selects or clears every row in view, shows a mixed state while only some are chosen, and is
  disabled when nothing is in view. A filter narrows what "all" means; a selection the filter
  hides is left as it is. Use `TableSelectAllCell` and `TableSelectCell` rather than a bare input.

Useful operational columns answer state, not definition. Choose from identity, owner, source,
effective date, amount, completeness, result, classification, status, exception, and action.

Column widths are a design decision, and a value is never cut off:

- Declare a width for every column. With room, every column sits at its declared width, so the
  same register looks the same as the data changes. A declared width is what the column is given,
  not a wall: the `Table` component never clips a value silently.
- Say what kind of value each cell holds, because that decides what happens when it is wider than
  its column:
  - **One line** (`nowrap`): identifiers, references, dates, amounts, statuses, short source
    labels. They never wrap and never truncate; the column widens to fit the widest value. A
    reference broken across two lines reads as two values, and half a figure is a wrong figure.
  - **Truncate** (`truncate`): names and descriptions in the identity column. They never widen the
    table; they end in an ellipsis, and the whole value is offered as a tooltip when, and only
    when, it is cut. Never truncate an amount, a reference, or anything a person acts on.
  - **Wrap** (neither): prose such as a step name, a reason, a note. It breaks at words. Prefer it
    where the row is already two lines tall, so the wrap costs nothing.
- Give the identity column the remaining space (`null`).
- Headers never wrap: each sits on one line and its column is at least as wide as its header.
- In a frame narrower than the declared widths, the columns give way together in proportion, the
  identity column first, so the table fits without
  scrolling. Giving way is only worth it if the table then fits, or nearly does. A little short,
  the identity column gets its full width back and the table scrolls by that much; far short, the
  table keeps its declared widths and scrolls inside its own container, because squeezed columns
  that scroll anyway only make wrapped text tall. Never let the page scroll horizontally.
- A register of nine or more columns freezes its identity column (`frozen`), or its code and name,
  so a person never loses the row while reading the figures to its right. Frozen columns are placed
  from the widths the columns actually took, so a column that widened to fit a value stays aligned.
- Put the columns a person scans for first: identity, then the states that decide the next action.
  Slow-changing metadata such as source and last update belongs at the end, where it may scroll out
  of view without costing anything.
- Prefer trimming columns to shrinking them. Eleven columns at 100 px each is a table nobody reads.

### Institution logos

A logo is a recognition aid beside a name, never a replacement for it and never decoration for its
own sake. It stands for the entity behind the record, and which entity that is depends on whose
book is being read:

| Where | The logo is |
| --- | --- |
| A bank's shelf, a client's holdings, a product picker | The product's manufacturer: a fund's investment manager, a bond's or a note's issuer, an ETF's manager, a policy's insurer. Never the bank's own logo on a product another firm makes |
| A fund's or a mandate's holdings, instruments, an instrument picker | The issuer of the instrument held: a share's company, a government bond's issuer, a deposit's bank. Never the managing firm on its own holdings |
| The manager's own Funds and Mandates register | None: the firm does not brand its own funds |
| Partner registers | The partner's |

- **The emblem, not the logo.** Each brand is shown by its emblem alone, the symbol without its name,
  on a transparent background: the brand's own symbol file where it publishes one, otherwise the
  emblem's shapes taken from its logo. A brand whose logo is its name (AIA, Samsung, TSMC) keeps its
  wordmark.
- **Placement and size.** A 16 px square leads the name in a row, 28 px before a record's title, with
  8 px to the text. The emblem is fitted whole in the square, never stretched, so every emblem reads
  at the same size and the names after it start on one line. A row without a brand (cash) keeps the
  empty square.
- **Dark mode.** No plate behind the emblem. A brand's own reversed version is used where it publishes
  one (EY, IPOT); otherwise a black or dark-navy one-colour emblem is drawn white on a dark surface,
  and a coloured emblem keeps its colours.
- **Without a logo.** The entity's initials, on the raised surface, in the same square.
- **Source.** One directory of brands and the names their entities appear under
  (`src/domain/brands/directory.ts`) and one set of files (`src/features/brands/brand-logos.ts`). A
  partner's own uploaded logo takes precedence. Screens never map names to images themselves.

### Density profiles

Use one of two application-wide density profiles. Do not mix them unpredictably within the same
workflow.

| Profile | Row and control treatment | Typical use |
| --- | --- | --- |
| Standard | Default control sizes and 8 px to 10 px table padding | Forms, mixed workspaces, occasional users |
| Compact | 32 px controls and 6 px to 8 px table padding | High-volume registers, reconciliation, expert operations |

Compact does not mean smaller body text, weaker focus indicators, or hidden labels. Density comes
from spacing and information structure. A product may offer a user preference only after both
profiles have been intentionally designed and tested.

### Register toolbar and filters

A register toolbar is one slim row, not a form. A register is a place to read data; a wall of
selects above the table pushes the data down the page, and on most visits nearly all of them are
set to All.

- **Search stays in the toolbar**, wide enough to type a name into.
- **One or two filters may stay inline** when that is all a register has. Inline filters carry their
  name as a prefix inside the control (`Type: All`), with a real `label` for assistive technology.
- **Three or more filters live in a panel** behind a single `Filters` control. The control carries
  a count of what is applied, so a narrowed list is never a surprise.
- **Source, import, and bulk actions sit on the right**, separated from the controls that shape the
  list. The page's one primary action stays in the page header.

The filter panel is a non-modal popover: it sits next to its trigger in the DOM so Tab moves into
and out of it in reading order, Escape closes it and returns focus to the trigger, and a pointer
press outside closes it without moving focus. It does not animate. Inside, each filter is a label
above a compact control in two columns, with `Clear filters` and a way to close at the foot.

Beneath the table, state how many rows are shown out of how many exist, name the filters in force,
and offer to clear them. That summary is where a filtered view announces itself, so the toolbar
does not have to. A filtered empty state says the filters are the reason and offers to clear them.

### Forms

Controls are 36 px high, use an 8 px radius, 1 px border, surface background, and 14 px text.
Textareas use the same border and radius with 8 px vertical padding.

Each field includes:

- A visible 13 px medium-weight label.
- A textual required indicator available to assistive technology.
- An explicit unit near the control.
- Optional 12/16 help text.
- A 12/16 danger-colored inline error.
- Programmatic `label`, `aria-describedby`, `aria-invalid`, and required associations.

Form rules:

- Group fields by what the user is deciding, not by the shape of the record. A group has a short
  heading and holds the fields a person fills in one thought.
- Reveal dependent fields only after the choice that requires them, and place them visually beneath
  that choice.
- Use locale-appropriate input and display formatting.
- Format for readability without moving the cursor or discarding an incomplete decimal.
- Let users enter a decimal using the locale's expected separator.
- Show a clearly labeled convenience preview only when the server remains authoritative.
- State that the authoritative result is recalculated after save.
- Warn before destructive navigation when edits are unsaved.
- Preserve inputs when validation or calculation fails.
- Show save success near the form; a toast may reinforce it but cannot be the only record.
- Put multi-field errors in a summary and repeat them at their fields.
- Explain permission-based read-only state in prose.

### Choice cards and source-first entry

Use native radio inputs inside bordered choice rows. The selected row has an accent border and
accent-subtle background. Each row contains a concise title and a sentence describing the
consequence.

Do not show downstream fields until a route is selected. If changing route will clear or replace
data, say so before save. A stored route is derived from stored data where possible rather than
duplicated in a second state field.

For a shared dataset, ask where the body of data comes from once, then reuse it across every
record or result it feeds. Do not ask the same source question independently in each downstream
feature.

### Outcome summaries

An outcome summary is a bordered surface placed above data entry. Its cells must match the domain
decision. Use two to four cells rather than forcing one universal quartet. Common cells include:

1. Current value, balance, or measured result.
2. System-generated state, rating, or classification.
3. Recorded decision, exception, or professional assessment.
4. Effective value or state used downstream.

The primary value gets the strongest local emphasis. The effective state gets the strongest
semantic emphasis. Beneath the grid, use a hairline and a compact metadata row for relevant facts
such as scope, capture state, source, effective time, and methodology.

Do not display unavailable states as if a value is expected later when it is structurally not
applicable. Use explicit copy such as `Not applicable`, `Assessed professionally`, `Not yet
calculated`, or `Rule not configured`.

### Lists and work queues

Use a single bordered container with hairline-separated rows rather than a stack of cards. A row
contains a 14 px medium-weight title, a 13 px explanation, a 12 px urgency or state label, and a
right arrow. Keep descriptions to roughly 60ch.

Sort outstanding work by the workflow's deterministic priorities. Do not invent visual urgency
that the domain does not provide. A suggested improvement is not the same as required work.

### Educational empty states

An empty state is a compact row with a dashed card border, 16 px horizontal padding, a 24 px
accent-subtle icon tile, and text beside it. It is intentionally not a large illustration.

Every empty state includes:

1. A direct title describing the state.
2. One sentence explaining why the component exists.
3. What the user needs to prepare or decide.
4. One primary next action when an action is possible.
5. An optional secondary link to help or methodology.

Never use `No data` as the complete state. Distinguish true empty, filtered empty, successful
empty, unavailable, and permission-limited states.

### Loading states

Use skeletons shaped like the destination, not a page-level spinner. Preserve the exact shell
dimensions while identity or context loads to prevent layout shift.

- Hide decorative skeleton blocks from assistive technology.
- Put one polite live region and `aria-busy="true"` on the containing loading state.
- Respect reduced motion; static blocks are sufficient.
- Preserve the last valid financial result during a background refresh and label its timestamp.
- Show a spinner inside the navigation item that initiated route loading.

### Error states

Errors should reassure users about data integrity. State whether entered or stored data changed,
offer retry only when safe, and include a stable reference. Do not expose stack traces or raw
service errors. Never turn a failure into a poor rating, zero balance, or empty success state.

### Modals and drawers

Modal panels are full width and bottom-aligned on phones, centered with a maximum width of 640 px
from `sm` upward, and capped at the smaller of 88dvh or 720 px. Use a 70% near-black backdrop,
surface background, one-pixel border, card radius, and restrained shadow.

Accessibility and behavior:

- Use `role="dialog"`, `aria-modal="true"`, and explicit title and description references.
- Move focus to the panel so its title is announced before controls.
- Trap focus and restore it to the invoking control on close.
- Make whether Escape and backdrop close the dialog an explicit product decision.
- Keep a scrolling region keyboard-focusable when it contains no other focusable controls.
- Important acknowledgments may require an explicit named action rather than a generic close.

Release or change announcements should look like release notes: version, date, title, and headed
lists. Avoid celebration artwork and colored pills unless tone itself carries information.

## Financial data presentation

### Numbers

- Use `Intl.NumberFormat` with the user's locale for display.
- Keep stored precision separate from displayed precision.
- Show currency, percentage, ratio, day, year, and count units explicitly.
- Use tabular numerals in tables and score summaries.
- Right-align comparable numeric columns.
- Pair abbreviations with full values when precision matters.
- Keep zero, missing, unavailable, and not-applicable as separate states.
- Do not use JavaScript display rounding as a methodology rule.

### Dates and recency

Show the relevant time dimension: as-of date, observation period, last calculation, last updated,
or reporting period. A stale value stays visible as historical context with a conspicuous stale
label and a recalculation or refresh action. Never silently replace a prior result while the new
one is incomplete.

### Source and integration state

Data may originate from manual entry, uploaded files, APIs, scheduled batches, events, or another
client system. All routes should converge on the same domain meaning and validation policy. The
interface must distinguish transport state from business state. A successfully received file can
still contain rejected business records.

Show the smallest set of integration facts needed for the decision:

- Source name and source type.
- External reference when one exists.
- Received, processed, effective, and last synchronized times where relevant.
- Validation, mapping, matching, and reconciliation state.
- Record counts for accepted, rejected, duplicate, pending, and repaired items.
- The safe next action and whether retry could create a duplicate.

Manual entry is the default fallback, not a different class of business record. Preserve source
and provenance even when an operator repairs imported data.

### Ratings and direction

If a scale has a non-obvious direction, state it near first use and reinforce it with labels. Use
text such as `Strong`, `Moderate`, or `Weak` in addition to an ordinal code when appropriate.
Do not assume that green always means a larger number or red always means a smaller number.

Keep three rating concepts separate where they exist:

- System rating: deterministic output from current data and methodology.
- Professional rating: a person's recorded judgment with rationale and metadata.
- Effective rating: the value selected by policy for aggregation or reporting.

### Provenance and lineage

Every important result should be able to answer:

1. What contributed to it?
2. How was each value transformed?
3. Where did supporting data come from?
4. Which rule or authority governed it?

Use neutral provenance labels that name the source directly, such as regulator-defined,
internally configured, client configured, market supplied, custodian supplied, externally
calculated, or professionally assessed. Do not blend a source quotation with an internal
interpretation.

### Audit history

Every consequential user or system change must be traceable. A human-readable history entry
identifies the actor, time, action, affected record, prior value, new value, reason when required,
source channel, and correlation or reference identifier.

Use a compact timeline or event table. Summarize field changes in plain language and place raw
technical detail behind disclosure. Never allow the visual history to imply that an event can be
edited or removed when the underlying audit record is immutable.

### Formula presentation

Represent formulas as structured expressions when possible. Render them with native MathML so
fractions and operators read like mathematics and inherit the theme. Show a derivation in three
parts:

1. Symbolic formula.
2. Formula with recorded values substituted.
3. Result with unit.

Provide a visually hidden plain-language equivalent because assistive support for MathML varies.
Wrap segments on narrow screens rather than shrinking formulas into illegibility.

## Visualization

Use a visualization only when it explains a relationship more clearly than a value, progress bar,
or small table.

### Small charts

- Keep gridlines and axes in border or muted colors.
- Use accent for the primary series.
- Mark zero explicitly when positive and negative values matter.
- Distinguish states with shape as well as color. For example, use circles for profit and squares
  for loss.
- Disable decorative animation for calculated or periodic financial results.
- Provide the same data in an accessible table.
- Tooltips use a surface background, border, control radius, 13 px text, and small shadow.

### Allocation bars

Use a segmented bar only when composition is the question. Pair it with a labeled table containing
category, value, and percentage. Keep categorical color tied to identity rather than ordering.

### Lineage graphs

Lineage is an explainer, not a network spectacle.

- Use a deterministic top-down or bottom-up directed layout.
- Load only the root and one or two levels initially.
- Expand one branch at a time.
- Use 230 by 78 px nodes, 28 px node separation, and 64 px rank separation as a starting point.
- Use surface nodes with border outlines; reserve an accent border for the selected or primary
  aggregation node.
- Do not let users drag or connect read-only lineage nodes.
- Keep edges in the border color and labels at 10 px muted text.
- Provide visible fit, zoom, reset, and focus-path controls.
- Selecting a node opens contextual detail without losing the graph.
- Store root, focus, and depth in URL state when deep linking matters.
- Provide a synchronized nested text outline or table containing equivalent information.
- Hide the canvas from assistive technology when the outline is the accessible representation.
- Do not animate layout continuously.

## Content design

### Voice

Use direct, calm, professional language. Say what the state means and what the user can do. Avoid
marketing claims, alarmist warnings, and unexplained abbreviations.

### State labels

Map enums and internal codes to human language before rendering. Never expose raw enums, internal
IDs, stack traces, or implementation terms. Use exact counts and concrete nouns rather than vague
warnings.

Good:

- `4 items are blocking calculation.`
- `18 of 24 records are complete.`
- `This result is stale because source data changed after calculation.`

Avoid:

- `Attention required.`
- `Status: INPUT_INCOMPLETE.`
- `Something went wrong.`

### Separators and sentence quality

Do not use an em dash, middot character, vertical bar, or bullet glyph as shorthand between
fragments in user-facing text. Write the relationship. These symbols may still appear where they
carry their proper meaning, such as a minus sign in a value or a vertical separator drawn by the
interface rather than typed into copy.

Preferred patterns:

- Use a comma when the parts form one list.
- Use parentheses for an aside or identifier.
- Use a complete sentence when the relationship carries meaning.
- Use separate rows, cells, or definition-list entries when the facts are independent.
- Use spacing, borders, columns, or definition lists for visual separation.

### Regulatory and fiduciary language

- Qualify indicative, provisional, estimated, simulated, or externally calculated results.
- Do not call a result approved, submitted, compliant, official, or final unless that is a verified
  fact.
- State where management judgment, sign-off, filing, custody, or execution occurs outside the
  product.
- Never present a client-configured or internal assumption as a regulator-defined rule.
- A professional assessment is not an approval unless the workflow formally defines it as one.

### Localization

Use one language consistently within a sentence. Preserve canonical domain terms in their source
language, then explain them in the interface's primary language. Localize numbers, dates, currency,
units, status labels, and action verbs together rather than translating headings alone.

## Interaction and state

### URL as durable interface state

Put shareable state in the URL:

- Active tab.
- Search and filters.
- Sort and page.
- Selected portfolio, metric, or account.
- Graph root, focus, and depth.

Use local state for transient UI details and forms. Use a server-state library only where client
mutations and cache invalidation justify it. Do not duplicate server records in a global UI store.

### Saved, unsaved, and stale

The interface distinguishes:

- Saved data.
- Unsaved edits.
- Successfully calculated current results.
- Historical results made stale by later inputs.
- Background refresh of a still-valid result.

Show save status beside the action that caused it. When a source is superseded, preserve earlier
results and their provenance. Do not make old history disappear to simplify the current screen.

### Permission-aware behavior

Hide actions a user cannot perform. If a control remains visible because its context matters,
disable it and explain why. Never imply that lack of permission means a value is missing or a task
is complete.

### Focus and navigation feedback

- Place a skip link first in the tab order.
- Give the main region `tabIndex={-1}` so skip-link focus moves correctly.
- Restore focus after dialogs and drawers.
- Preserve focus after pagination and filtered empty states.
- Show immediate feedback after navigation is activated, even when data is slow.
- Focus and outline a deep-linked work item after its containing tab opens.

## Accessibility

Target WCAG 2.2 AA in both themes.

### Non-negotiable requirements

- Keyboard operation for navigation, forms, tables, tabs, dialogs, drawers, and graph controls.
- Visible 2 px accent focus ring with a 2 px offset.
- Focus order follows visual order.
- Text and interactive contrast meet AA.
- Status, rating, profit and loss, and warning states never rely on color alone.
- Inputs have associated labels, descriptions, units, errors, and required state.
- Validation errors are inline and announced; toasts are supplementary.
- Loading uses one polite live region rather than announcing every skeleton.
- Dialogs trap and restore focus.
- Charts and graph canvases have equivalent text or table representations.
- Content survives 200% zoom and narrow viewports without losing actions.
- Wide tables scroll within their own container.
- `prefers-reduced-motion` removes nonessential animation and smooth scrolling.

Base focus style:

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

Reduced-motion baseline:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Motion

Motion communicates feedback, state, or spatial relationship. An operational product is a place
people work in all day, so the correct amount of motion is small and the correct question is always
whether the animation should exist at all.

Decide in this order:

1. **How often is it seen?** Anything a person triggers dozens of times a day gets no animation.
   A surface opened by a keyboard shortcut, a tab switch, a navigation change, and a filter change
   are all instant. Occasional surfaces such as dialogs and drawers get standard motion. Rare
   moments may carry a little more.
2. **What does it explain?** Where the panel came from, that the interface heard the press, that a
   value changed. If the honest answer is that it looks nice, delete it.
3. **Which easing?** Entering and exiting use ease-out. Movement already on screen uses ease-in-out.
   Colour and hover changes use ease. Never `ease-in` on an interface element: it delays the moment
   the user is watching most closely.
4. **How long?** Press feedback 100 ms to 160 ms. Popovers and tooltips 125 ms to 200 ms. Dropdowns
   150 ms to 250 ms. Dialogs and drawers 180 ms to 240 ms. Nothing in an operational interface runs
   longer than 300 ms.

Standing rules:

- Hover and focus colour transitions: 120 ms to 180 ms; use 150 ms by default.
- Every pressable control acknowledges the press with a small scale, around 0.98, on the transform
  property only. It is the cheapest signal that the interface is alive.
- Name the properties a transition animates. `transition: all` animates properties nobody intended,
  off the compositor.
- Animate `transform` and `opacity`. Animating width, height, margin, padding, or offsets costs
  layout and paint on every frame.
- Never animate from `scale(0)`. Nothing appears from nothing; start at 0.95 or higher with opacity.
- A panel anchored to a trigger scales from that trigger. A centered dialog stays centered.
- Exits are slightly faster than entrances, and the exit must finish before unmount.
- Progress width: 200 ms. Navigation spinner: only while the route is pending.
- Skeleton pulse is decorative and stops under reduced motion.
- **Exception, Praisindo: the segmented view control** (`SegmentedControl`, such as Needs action,
  In progress, Completed, All orders). Its accent highlight is one shape that travels between the
  views. Its two edges move on their own springs: the edge nearer the new view leads, so the highlight
  stretches across, then the other edge draws in with a slight overshoot, settling in about 250 ms.
  Holding a press on another view leans the highlight 8 px towards it, and letting go completes
  the move; holding the chosen view presses the highlight in by 2 px. The highlight's width changes,
  never a horizontal scale, so its corners and the labels are never distorted. It moves straight to
  its place under reduced motion.
- The same control has a quiet variant (`SegmentedControl variant="quiet"`) for choosing a period or a
  measure inside a panel: unframed chips with the same travelling highlight. Every view switch and
  every period or measure chooser uses this one control, so they behave alike on every page.
- **Exception, Praisindo: in-page tabs** (`Tabs`, not the shell's application tabs) are meant to be
  played with. The underline is one 2 px shape on the same springs, stretching between tabs and
  drawing in with a bounce; a soft raised glow follows the pointer from tab to tab; a held tab
  squishes to 0.92 and pops back with an overshoot; holding another tab leans the underline 10 px
  towards it, holding the chosen tab pinches it 6 px narrower and 1 px thicker; a newly chosen
  tab's count hops; a panel arrives with a 6 px rise over 160 ms. Springs settle in about 250 ms.
  The strip is a fixed 40 px with the underline drawn over a 1 px divider, so the line is the same
  weight and the labels sit at the same height on every page. Straight under a page header the
  strip sits 16 px below it rather than the page's usual 24 px. All of it stops under reduced motion.
- **Exception, Praisindo: Search this page** (`PageFinder`, on dense record pages and My Work) shows
  the person round, quietly. It is offered as a second scope joined to the header's search bar, not
  on the page, so it never competes with the page's primary action or its tabs; it slides in as the
  page appears, a light passes over it once, and on hover its glass tilts and its spark turns. The dialog is navigation
  search's: it settles in without overshoot, rows arrive a few milliseconds apart, and a neutral
  highlight glides between rows on the follow spring. Going to a result walks there in visible steps:
  a chip at the top ticks off the tab, then the section, the page glides to the thing (eased, at most
  560 ms), and it is framed: the page dims by 14 %, a 1.5 px accent line settles in from 3 % larger
  over 280 ms, an accent wash fades beneath it, one soft halo spreads once, and a small label attached
  to the frame names it. The frame lifts after 2.6 s or at the first click, key or scroll. A result
  not on the record nudges its chip once. No bounce, nothing repeats. All of it stops under reduced
  motion, where the page jumps straight to the thing and the frame simply appears.
- No looping background motion, drifting grids, glows, shimmer sweeps, parallax, cursor effects, or
  cinematic transitions on any working screen. The one exception is the supporting panel of an
  authentication surface, which holds no work: see Addenda, Authentication surfaces.
- Do not animate score changes like live market prices, and do not animate chart drawing or lineage
  layout for periodic or calculated information.
- Disable theme-transition animation to avoid a flash across the full workstation.
- `prefers-reduced-motion: reduce` collapses all of it to an instant change.

Reference curves:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

## Next.js, Tailwind, and shadcn implementation

### Component boundaries

- Use Server Components for page shells, initial data, static explanation, and permission-aware
  navigation.
- Use Client Components only for forms, filters, tabs with URL synchronization, dialogs, graph
  interaction, and mutations.
- Keep client boundaries low in the tree.
- Stream the shell and page regions behind layout-matched skeletons.
- Lazy-load graph canvases and other heavy supplementary visuals.
- Keep business calculations and status derivation outside React components.

These boundaries are part of UX: smaller client bundles, stable first paint, and fast feedback
make a financial workstation feel dependable.

### Tailwind token setup

Use Tailwind v4 semantic theme variables. This reference matches the visual targets in this
guide:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-libre-franklin), ui-sans-serif, system-ui, sans-serif;

  --radius-card: 10px;
  --radius-control: 8px;

  --color-background: #ffffff;
  --color-sidebar: #f6f8fc;
  --color-surface: #ffffff;
  --color-raised: #f2f5fa;
  --color-border: #d8e0ec;
  --color-foreground: #0d1522;
  --color-muted: #4d5b70;
  --color-muted-strong: #334054;
  --color-accent: #2f57cc;
  --color-accent-hover: #24469f;
  --color-accent-solid: #2f57cc;
  --color-accent-solid-hover: #24469f;
  --color-accent-contrast: #ffffff;
  --color-accent-subtle: rgba(83, 124, 246, 0.12);
  --color-success: #10794f;
  --color-warning: #8a5a06;
  --color-danger: #b4272c;
  --color-info: #1f5fb8;
  --color-series-1: #2a78d6;
  --color-series-2: #eb6834;
  --color-series-3: #1baf7a;
  --color-series-4: #eda100;
  --color-series-5: #e87ba4;
}

.dark {
  --color-background: #090c12;
  --color-sidebar: #0c111b;
  --color-surface: #111722;
  --color-raised: #151d2b;
  --color-border: #263244;
  --color-foreground: #f5f7fb;
  --color-muted: #9aa8bc;
  --color-muted-strong: #c5d0e0;
  --color-accent: #537cf6;
  --color-accent-hover: #6f91ff;
  --color-accent-solid: #4a6fe0;
  --color-accent-solid-hover: #5b7fee;
  --color-accent-contrast: #ffffff;
  --color-accent-subtle: rgba(83, 124, 246, 0.14);
  --color-success: #35c889;
  --color-warning: #f5b84b;
  --color-danger: #f06a6a;
  --color-info: #6aa7ff;
  --color-series-1: #3987e5;
  --color-series-2: #d95926;
  --color-series-3: #199e70;
  --color-series-4: #c98500;
  --color-series-5: #d55181;
}
```

### Local font setup

```tsx
import localFont from "next/font/local";

const primarySans = localFont({
  src: [
    { path: "../assets/fonts/libre-franklin-variable.woff2", weight: "100 900" },
    {
      path: "../assets/fonts/libre-franklin-variable-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-libre-franklin",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});
```

Set `lang` to the interface language, apply the font variable to `html`, and use `next-themes`
with dark as the explicit default. Disable transitions during theme changes.

### Primitive strategy

Use shadcn/ui as a source of composable primitives, not as a visual identity. Centralize variants
with class-variance-authority and merge classes with `clsx` and `tailwind-merge`.

- Add primitives only when a current slice needs them.
- Keep semantic token classes inside primitive variants.
- Do not introduce a second component library.
- Prefer native HTML for disclosure, radio groups, tables, and simple controls when it already
  provides the required semantics.
- A custom primitive must meet the same keyboard, focus, labeling, and reduced-motion behavior as
  its established library equivalent.

### Recommended primitive inventory

- Button.
- Status indicator, exception indicator, category tag, count badge, and integration state.
- Card.
- Alert.
- Progress.
- Tabs.
- Table.
- Input, select, textarea, checkbox, and radio group.
- Dialog, modal, drawer, or sheet.
- Disclosure.
- Tooltip and popover where content is supplementary.
- Skeleton.
- Breadcrumb.
- Dropdown menu.
- Pagination.
- Separator.

### State ownership

- The declared system of record owns authoritative domain data. It may be the application or an
  external client system.
- The application server owns persisted workflow state, normalized records, configuration
  snapshots, and computed results that belong to the application.
- URL owns shareable navigation and view state.
- Forms own unsaved values.
- Local React state owns short-lived disclosure and dialog state.
- A server-state cache owns fetched client data when mutations require it.

The same fact should not be independently derived in multiple components. Completion, blockers,
status, and next action should come from one domain answer so sibling screens cannot disagree.

For prototypes, a local fixture or in-memory adapter may stand in for a system of record. Keep the
contract explicit so the prototype does not accidentally teach that browser storage is
authoritative.

## Page recipes

### Overview page

```text
Page header
Primary outcome card
Comparable summary cells when useful
Priority list
Optional provenance or lineage link
```

### Register page

```text
Page header
Search and filter row
Result count and active-filter summary
Bordered operational table
Pagination
Educational filtered-empty state
```

### Workspace page

```text
Page header with breadcrumbs and status
Outcome summary and completion
Tab strip
Domain worklist
Contextual blockers stated once
Supporting details through disclosure
```

### Detail and input page

```text
Breadcrumbs and canonical title
Scope and status
Two-to-four-cell outcome summary when useful
Tabs built from available work
Choice before fields
Inline save, validation, and unsaved states
Previous and next item navigation
```

### Guided workflow page

```text
Page header and draft state
Progress with current step
High-impact routing choice
Only the fields required by that route
Inline validation and blockers
Review of consequences
Save draft or commit action
```

### Reconciliation page

```text
Page header with source and processing time
Matched, unmatched, rejected, and pending counts
Search, filters, and tolerance controls
Side-by-side internal and external values
Contextual difference explanation
Repair, match, accept, or escalate action
Run and audit history
```

### Configuration page

```text
Page header with scope and effective version
Configuration category navigation
Current value, default, and override
Plain-language consequence and dependency
Impact preview
Effective date and reason
Change history
```

### Report catalogue page

```text
Page header
Report type and domain filters
Searchable catalogue
Purpose, audience, frequency, and latest run
Run or open action
Generation, validation, delivery, and submission history
```

### Methodology or provenance page

```text
Page header
Source summary
Version and current-state metadata
Definition lists or compact tables
Disclosures for formula and rule detail
History separated by hairlines rather than cards
```

## Avoiding generic AI-generated UI

Generated interfaces fail in a recognisable way: they look designed and say nothing. The patterns
below are not banned components; each has a legitimate use. They become tells when they appear by
default, everywhere, without a reason that comes from the content.

**Containers and surface**

- Rounded cards around everything. A card is a bounded surface with its own actions or a sibling to
  compare against. Where the grouping is already obvious, a heading and a hairline do the job.
- Grids of equal cards used as a menu. If the items are destinations, they are a list. Equal
  containers claim the items are comparable; usually they are not.
- Decorative gradients, glows, and glass panels. A blurred coloured blob behind a form is the
  clearest signal that nobody decided what the screen was for.
- Blue or purple ambient glow as a house style. Accent colour marks selection, focus, and links.
- A mixture of radii, shadow depths, icon families, and neutral palettes on one screen. Pick one
  scale for each and hold it.

**Typography and copy**

- Oversized headings on ordinary operational pages. The name of a register is not a headline.
- An uppercase eyebrow above every section. One templated rhythm repeated down the page.
- Explanatory paragraphs describing what the reader can already see, and repeated informational
  banners restating a rule the page already applies.
- Verbose empty states. Say the data condition, then the one next action.
- Placeholder copy narrating development status. A page with no records says it has no records; it
  never says a feature is coming.
- Invented regulatory, security, or monitoring claims. Say only what the product actually does.

**Data and evidence**

- Fake precision and invented metrics. If the number is not computed from real records, it does not
  belong on the screen. Percentages nobody calculated and round figures that look measured both
  destroy trust faster than an empty region.
- Decorative dashboards. A summary earns its place by supporting a decision the user has to make.
- Generic names, sequential placeholder data, and suspiciously tidy figures in anything a reader
  might mistake for real records.

**Controls and emphasis**

- Pill-shaped controls everywhere. Reserve capsule shapes for a genuine capsule.
- Every action styled as primary. One primary per scope; row-level actions are secondary or quiet.
- Colourful status pills on every value. See the status language: the healthy majority is quiet.
- A row of filter selects above every table. Most are set to All most of the time; put them behind
  one control and say underneath which ones are actually narrowing the list.
- Animation on everything, especially on frequent and keyboard-initiated actions.

The test for each of these is the same: name the reader's question that the element answers. If
there is no question, remove the element.

## Anti-patterns

Do not:

- Use color alone for rating, status, profit, loss, or urgency.
- Convert missing data, calculation failure, or not-applicable state into zero.
- Put a chart where one number or short table is clearer.
- Show every detail in the first viewport.
- Repeat the same blocker in a summary card, row, and alert on one page.
- Put long requirements or definitions inside a scanning table.
- Render two links in one row that lead to the same destination.
- Show all mutually exclusive form routes at once.
- Ask for a shared source dataset separately for each derived metric.
- Combine system, professional, and effective ratings into one string.
- Treat a recommended supporting action as blocking work.
- Expose raw enums or internal terminology.
- Use opacity to make already-muted text quieter.
- Use giant empty-state illustrations.
- Add gradients or shadows to create hierarchy that spacing and borders should provide.
- Animate periodic results like live prices.
- Make a toast the only record of an error.
- Rely on a graph or chart canvas as the only representation.
- Fetch a font at build or runtime when it can be self-hosted.
- Treat a successful import as proof that every business record was accepted.
- Overwrite historical meaning when configuration changes.
- Hide consequential changes from the audit history.
- Let a table size its own columns and wrap identifiers, dates, or sources.
- Give a low-importance category the same emphasis as a blocking exception.
- Repeat the same policy statement as a banner on every visit to a page.
- Animate a surface that a keyboard shortcut opens.

## Agent reproduction checklist

Before considering a similar interface faithful to this system, verify:

### Visual foundation

- Dark theme opens by default and both themes use the semantic token set.
- Libre Franklin is self-hosted and loaded with `next/font/local`.
- The shell uses its declared sidebar token, a 56 px header, and fixed viewport chrome on desktop.
- The page declares focused, operational, or analytical content behavior.
- Application tabs appear only when multi-workspace use warrants them.
- Cards use one-pixel borders, 10 px radius, and little or no shadow.
- Accent is used sparingly and solid buttons use the contrast-safe accent token.
- Every small labelled value maps to one of the five status treatments, and the common healthy
  state is the quietest.
- Nothing on the screen matches the generic patterns in Avoiding generic AI-generated UI.

### Hierarchy

- The first viewport answers current outcome, reliability, and next action.
- Each page has a breadcrumb, clear title, short description, and at most one primary action.
- Supporting methodology and provenance do not overpower the operational task.
- Work is stated once at each useful altitude.
- Navigation groups follow user work and use no more than two grouping levels before a page.

### Financial semantics

- Missing, zero, unavailable, failed, stale, and not-applicable are separate states.
- Units, locale, precision, period, and source are visible.
- System judgment, professional judgment, and effective result are separate.
- Important results can reach inputs, transformations, evidence, and governing rules.
- Provisional or configured methodology is not presented as authoritative fact.
- Source, external reference, synchronization time, and reconciliation state are visible when
  they affect the decision.
- Consequential changes have a human-readable audit record.

### Components and interaction

- Tables declare their column widths, never wrap identifiers or dates, and scroll inside their own
  container.
- Tables are scannable, row navigation has one focus stop, and state lives in the URL.
- Register toolbars are one compact row ordered by how often each control is used.
- Guided workflows share one frame: stable summary, one step vocabulary, actions in a fixed place.
- Forms ask route or source questions before fields and explain consequences.
- Empty states teach and provide a next action.
- Skeletons match the destination and navigation acknowledges slow routes.
- Modals trap and restore focus; close behavior matches the consequence of dismissal.
- Charts and lineage are sparse, static, and backed by accessible text or tables.

### Accessibility and responsive behavior

- Both themes meet WCAG 2.2 AA.
- The critical workflow works with keyboard only.
- Focus is visible and restored appropriately.
- No state is conveyed by color alone.
- Reduced motion removes nonessential transitions and animation.
- No animation runs on a keyboard-initiated or high-frequency action, and nothing loops.
- Pressable controls acknowledge the press.
- The application names its supported viewport profile and passes every claimed reference size.
- At 200% zoom, content and primary actions remain reachable.
- Wide tables are contained and the page never scrolls horizontally.

## Addenda

These entries extend the guideline. They refine earlier rules rather than replace them; where an
addendum and an earlier section disagree, the addendum is the current decision.

### Status color and containers

Color states the meaning; it does not draw the box.

- A status container (alert, inline result, callout, notice) keeps the neutral `border` color.
  Its semantic tone lives in the icon, and in the value text when a number itself is the state.
- Do not outline a component in the accent colour, at most times. An accent ring or glow around a
  card, a chip, an input or a slot reads as a default framework, not as a premium product. Show
  selection, listening or editing with neutral weight instead: a raised surface, a stronger neutral
  border, heavier text. Keep the accent for small marks (a dot, a caret, the active tab underline,
  a link) and for the one primary action's fill. The keyboard focus ring stays, for accessibility.
- An exception indicator keeps its tint, because its whole body is the state and the state needs a
  person. A status indicator carries no container at all.
- The compact empty-state icon tile uses the neutral `raised` surface with a `foreground` icon, so
  an empty region reads as calm rather than as an alert. Reserve the accent tile for a surface
  that is genuinely promoting an action.
- Success confirmations follow the same rule. A green outline around a saved record makes routine
  work look eventful.
- A statement of fact that is neither good nor bad takes the neutral tone, with a muted icon. A
  caution color on something merely scheduled reads as a problem the user has to solve, and a page
  that cautions about ordinary states teaches people to ignore the color.
- Choose the icon for what the state means, not for its severity. Something waiting on a date takes
  a clock; something reversed takes a prohibition mark. A warning triangle belongs on a warning.

### Counts on tabs and filters

A count answers "how much work is here", not "does this tab exist".

- On an informational tab (Current, History, Overview, Activity), hide the count when it is zero.
  The panel already says the set is empty, and a row of zeros trains users to ignore counts.
- On a work-queue tab (Pending Approval, Exceptions, Due, Awaiting Action), show the count even
  when it is zero. Zero is a real and reassuring result for a queue the user is accountable for.
- Counts use tabular numerals and muted text. They never become the tab's primary label.

### Single-destination rows

When every cell of a row leads to the same place and the row carries no second action, the whole
row is the control.

- Stretch the row's one control across the row rather than adding a row-level click handler. The
  control keeps its own accessible name, and the row keeps exactly one focus stop for keyboard
  users.
- The overlay needs a stacking order above the cells that follow it, or later cells swallow the
  click.
- Give the row a pointer cursor and a hover and focus-within background so the target is visible
  before it is used.
- A row that carries a second action, such as a link to a related record, is not a
  single-destination row. Keep its cells individually clickable.
- Identifier columns do not wrap. A reference number broken across two lines reads as two values.

### Scheduled and reversible actions

A change with a future effective date has not happened yet, and the interface should say so.

- Distinguish confirmed-and-effective from confirmed-and-scheduled. Derive the difference from the
  effective date rather than storing a second status that can drift.
- A scheduled change can be cancelled until its effective date. Cancelling reverses exactly the
  records the change created and keeps the cancelled record itself, with actor, time, and reason.
- Once a change has taken effect it can no longer be cancelled. Say that plainly and offer the
  forward-moving action instead, such as making another change.
- When a record already has something scheduled, say so wherever the user might act on it: in the
  record, in any picker that offers it, and at the top of the form that would act on it.
- A new change for the same record must take effect after the scheduled one, and starts from where
  the scheduled one leaves the record. Refuse an earlier date and name the change that blocks it.
- A later change is allowed, but the user confirms at the review step that they understand the
  scheduled change stands. Ask for that confirmation where the commitment happens, not when they
  first open the form.

### Missing values in tables and fact lists

An empty cell is a question the reader cannot answer. Every column decides, per record, which kind
of absence it is showing.

- **Not applicable.** The record structurally cannot hold a value: the unit of an RM placed
  directly at a branch, the parent of a head office, a replacement RM on a mutation that keeps its
  customers. Render `N/A` in tables, abbreviated because these repeat down a dense column, with the
  full wording available to assistive technology and on hover. Spell out `Not applicable` in fact
  lists, where there is room and only one instance.
- **Not recorded.** A value could exist and nobody captured it: a missing email, a location, an RM
  with no placement on file. Spell it out. It is a gap someone may need to close, and it should
  read differently from a value that can never exist.
- **Zero.** A count of zero is a measurement, not an absence. Render `0`. Never replace it with a
  blank marker, and never replace a structural absence with `0`, which would invite the reader to
  sum a column that has no members.
- **Named states.** Where the domain has a word for the absence, use the word: an effective range
  with no end is `Open`, a comparison with nothing to report is `No changes`. These are results,
  not blanks.
- Blank markers are muted, so a scan reads values first and absences second.
- The same record must give the same answer in its row, its detail panel, and its exports. Decide
  the kind of absence once, in the component that owns the value.

### Panel motion

Modals and drawers animate so the user can see where a panel came from and what it covers.

- A side panel enters from the edge it is anchored to over 180 ms to 240 ms with an ease-out
  curve, and leaves slightly faster.
- A centered dialog settles with opacity and a small scale. It does not slide.
- The backdrop fades with the panel.
- Animate the individual `translate` and `scale` properties rather than the `transform` shorthand,
  so panel motion never overwrites a positioning transform.
- Exit animation must complete before unmount, so the panel does not disappear mid-gesture.
- All of this collapses to an instant change under `prefers-reduced-motion: reduce`.
- Motion never delays the first paint of content the user asked for.

### Pointers and hit targets

Every enabled interactive control shows the pointer cursor on hover: buttons, links, menu items,
tabs, summary elements, labels bound to a control, selects, and checkable inputs. A control that
looks pressable and shows a text cursor reads as broken. Disabled controls keep the default cursor.

### Application keyboard shortcuts

An application that owns the viewport needs shortcuts that never collide with the browser.

- Use one modifier chord for application shortcuts: Alt+Shift on Windows and Linux, Option+Shift
  on macOS. Detect the platform for display only. The everyday ones take Ctrl because people reach
  for them by habit: search (Ctrl+Shift+F, Command+Shift+F), find on a record page (Ctrl+F,
  Command+F, only where the page has a finder, so the browser keeps its Find everywhere else), the
  previous and next workspace tab (Ctrl+Left and Ctrl+Right, giving way in a field), and the sidebar
  and theme toggles (Ctrl+Shift+[ and Ctrl+Shift+L, Control on macOS too, where the Command forms are
  the browser's own).
- Match on the physical key code, not the produced character, because Option+Shift changes the
  character on macOS layouts.
- Call `preventDefault` on a handled shortcut and ignore the event when focus is in a text input,
  textarea, select, or contenteditable region, except for a shortcut whose purpose is to leave the
  field, such as opening search.
- Verify a candidate key against Chrome, Edge, Firefox, and Safari defaults before claiming it.
- Register listeners once at the owning provider and remove them on unmount.
- Make shortcuts discoverable: a `kbd` hint on the control, a tooltip, and `aria-keyshortcuts`.
- Every shortcut is an action in one catalogue, run by one listener, and changeable by the person.
  A feature says what an action does (`useShortcut`) and shows the person's current keys
  (`useShortcutHint`); it never adds its own keydown listener or hard-codes a chord in copy.
- Recording a new shortcut happens in place, suspends every other shortcut while it listens, and
  shows its verdict before saving: a refusal (a key that types or moves focus), a clash with another
  action (reassigned in the open, never duplicated silently), a chord the browser or operating
  system keeps (cannot be saved), or a browser shortcut it would replace (saved with the warning).
- Draw chords as keycaps in the platform's own notation: words joined by plus signs on Windows and
  Linux, symbols on macOS.

### Navigation and shell behavior

- The primary navigation uses a drill-in model: a list of areas, then the selected area's groups
  and pages. No nested accordions. Escape returns to the area list. Browse state is not persisted,
  and the browser Back button traverses pages rather than navigation states.
- The active row carries an accent stripe flush with the panel's outer edge, an `accent-subtle`
  background, and a `foreground` icon. The icon does not take the accent color, because two accent
  elements in one row compete.
- Group headers are uppercase, muted, and separated from their rows and from the preceding group
  by real space rather than by rules.
- The application tab strip scrolls without a visible scrollbar and keeps the active tab in view by
  adjusting scroll offsets, never with `scrollIntoView`, which moves the sequential focus start
  point and breaks the skip link.
- Global search is a dialog over the navigation catalogue, opened from the header control or its
  shortcut, with fuzzy matching, a bounded result list, arrow-key navigation, and Enter to open.
  Selecting a result navigates through the normal router so the tab model activates an already
  open page rather than duplicating it.

### Form correctness

- Field ids must be unique within a page, including across a register's filter toolbar and any
  dialog opened above it. A duplicated id silently sends typed input to the wrong control.
- A form whose prerequisite record does not exist explains the gap and offers the page that
  creates it, rather than showing an empty select. Disable the submit action while the
  prerequisite is missing.
- Validation errors are field-scoped where a field owns them and summarized at the top of the form
  when they are not tied to one field.

### Dates and copy in the product voice

- Format dates and numbers with `Intl`, and never lowercase or otherwise reshape a formatted
  value in prose. If a sentence needs a lowercase lead-in, change the sentence.
- Write singular and plural properly. Never ship "1 customer(s)".
- Product screens describe the business, not the build. Do not mention a prototype, an increment,
  what is not implemented yet, or internal architecture such as domain ownership. Demonstration
  tools may describe themselves as demonstration tools; nothing else may.
- A page subtitle is one short sentence about what the user does there, not a list of features.
- An empty state describes the data condition ("No customers found."), never the development
  condition ("Not implemented yet").
- Do not claim an integration, calculation, or process is operational when it is not.
- No em dashes and no middle-dot separators.
- Environment and build information belongs in a quiet corner of the shell, not in the working
  header of a product screen.

### Authentication surfaces

A sign-in screen is the product's first impression and is held to the same standard as the
workspace: institution mark, product name, a single short statement, and the credential form.
It does not list domains, advertise capabilities, display credentials, or announce that the
environment is a demonstration. Decorative motion is allowed on the supporting panel when it is
slow, low-contrast, and never blocks or obscures the form.

### Multi-step workflows

A workflow with several stages is a page, not a dialog. A dialog holds one decision; a workflow
holds a working session that a person leaves and returns to.

- **Entry is a small decision, the work is a page.** The action that starts a workflow may open a
  compact dialog to pick the subject (find the record, choose the type). Once the subject is
  chosen, the dialog closes and the workflow opens as a full page with its own route, so it has a
  URL, sits in the application tab of its register, survives a refresh, and can be resumed.
- **Steps are navigation, not gates.** The step list on the left lets a person revisit any step
  while the work is open. Each step shows its own state (done, current, needs attention, not
  started). A step that cannot be completed yet says why in its own body; it does not lock the
  others.
- **One rule for readiness.** Whatever decides that the workflow can be completed is a single
  function over the record. The final step lists its output with a link to the step that owns
  each item, the worklist shows the same count, the step list marks the same steps, and the
  completing command refuses with the same list. Never re-derive readiness in a second place.
- **Resume where the work stopped.** The persisted current step is the furthest point reached
  and is the landing step when the page is reopened. Navigating back to look at an earlier step
  does not move it.
- **Closing is explicit and kept.** Cancelling or rejecting takes a reason, closes the workflow,
  keeps it readable for reference, and leaves the subject record in an honest state (linked but
  not onboarded, for example). A closed workflow shows its final step read-only with the closing
  reason at the top.
- **External calls are visible as calls.** When a step asks another system for a result
  (screening, scoring, registration), the button reads as a request, the result is recorded with
  the provider and its reference, and a failed call shows the provider's message. The page never
  computes such a result locally and presents it as the provider's.
- **Nothing clears itself.** A result that needs a person's judgement is resolved only by a
  person, with a written reason, recorded with their name and the time.

### Separate states for separate questions

When a record answers more than one question, give each question its own field and its own badge.
A customer's record status (is the record in use), workflow status (how far has onboarding got),
and eligibility (may they transact today) are three columns and three badges, never one. Collapsing
them into a single "Active" makes the common real-world case (active in the bank, not allowed to
invest) impossible to say.

### Governed registers: Records, My Requests, Pending Approval

A register whose changes need a second person carries the same three tabs whatever it lists, so
the control is learned once.

- **Records is the authoritative list and the default.** A proposal never appears in it. What a
  person sees on Records is what the institution holds.
- **My Requests is the maker's own work.** Drafts, submitted requests, returned requests, and
  decided ones, from the person's own point of view. The count is the open ones; decided requests
  stay listed for reference and are never deleted.
- **Pending Approval is a work queue.** It lists only what the current person may decide on, so a
  request they raised themselves is not in it under a policy that forbids self-approval. Its count
  stays visible at zero.
- **One request detail for both roles.** A drawer opened from either tab, with the checks at the
  top (what approval would do now: stale, expired, refused, or clean), the proposal beneath, the
  context a checker needs (structure, impact, duplicates, placement), the request's own facts,
  and its history. A creation shows the proposed record as a fact list. An update shows a
  field-level comparison of Current and Proposed, unchanged rows quiet, changed values in the
  foreground weight. Raw JSON never appears.
- **Decisions are small dialogs.** Approve, return, reject, and withdraw each confirm in a dialog
  that carries the comment field policy asks for. Return and reject take a comment; withdraw
  confirms. The drawer closes after a decision, because the request has left the queue it was
  opened from.
- **The maker form is the register's own form.** Under maker-checker its final action reads
  `Submit for approval`, a `Save draft` action sits beside it, a reason field appears where policy
  requires one, and a quiet notice says the change waits for approval. Revising a returned request
  reopens the same form with the checker's comment at the top. Nothing about the form's fields
  changes with the policy.
- **Request status is a durable state.** Pending, approved, draft, and withdrawn take the status
  indicator; returned and rejected are the two that need a person or record a refusal and take the
  exception treatment. A stale or expired request carries an exception label beside its status.
- **Both histories are one click apart.** An approved change's entry in the record's activity
  names the maker and the checker and links the request reference; the request's history links
  back to the record.

### Unsaved-work protection

- A form with modified fields is guarded until it is saved, submitted, or discarded on purpose.
  Closing the form, following a link that replaces its page, and browser Back ask with the
  application's own dialog (`Keep editing` first, `Discard changes` as the primary). Closing its
  application tab, or all tabs, asks `Close <tab>?` (`Keep open` first, `Close and discard` as the
  primary).
- Switching application tabs never asks and never loses work. A menu link to a page whose tab is
  behind with unsaved work brings that tab forward as it was left instead of replacing it.
  Refresh, closing the browser tab, and leaving for another site hand over to the browser's prompt,
  whose wording is not customised.
- Nothing warns when no field changed, nor after a successful save or submission. A confirmed
  discard closes the form and clears its state.
- The guard is one shared mechanism registered from the form, never a page-specific listener.

### Configuration surfaces

A configuration screen is read far more often than it is changed, and a change made there affects
everyone who uses the product afterwards. It is an operational register with a careful editor, not
a form.

- **The register lists what can be configured, one row per decision.** Columns say what the thing
  is, how it currently behaves, and which version is in force. A row that cannot be resolved reads
  as an exception rather than an empty cell, because a missing configuration is a problem, not an
  absence.
- **Editing happens in a focused surface opened from the row**, carrying the read-only identity of
  what is being configured, the choices, the effective timing, and the required reason. The
  identity is shown because a person needs to be sure what they are about to change.
- **A material change is confirmed against its consequence, not its fields.** Before applying,
  state in one plain sentence what the next person using that action will experience, and how much
  existing work stays on the previous version. A diff of field values is not a consequence.
- **Locked values are shown or omitted, never disabled in bulk.** Where a person needs to
  understand a restriction, show the value read-only with the reason beside it. Where showing it
  would add nothing, leave it out. A screen full of greyed controls teaches people that the screen
  is not for them.
- **Versioned configuration is superseded, never edited.** The editor says so before saving. What
  earlier work points at must still exist, exactly as it was.
- **Every applied change appears in a history on the same surface**, with the actor, the reason,
  and the before and after values. The history is the reason the change is safe to make.
- **A state machine is previewed, not drawn.** An ordered row of states with the alternatives
  beneath it, and one line explaining each, is enough for a short workflow. A graph canvas for a
  three-state process is decoration.

### Financial numbers

An investment page is read by someone who will compare its figures with another system's before
the day is over. The numbers carry that weight, so they follow rules of their own.

- **Money is whole in the base currency and grouped**, with the currency once in the column
  heading or the strip label rather than repeated on every cell. A page that mixes millions and
  billions in the same column keeps the full figure; abbreviated forms (1.24 bn) are for headline
  cells and chart axes only, and never inside a table that will be reconciled.
- **Precision follows the quantity.** Prices as the market quotes them, NAV per unit to four
  places, rates and percentages to two, basis points as whole numbers with the unit spelled
  (12 bp), ratios to two, years to one. Precision is a property of the measure, so the same figure
  shows the same precision everywhere it appears.
- **Signed values keep their sign**, including a plus, so a gain is not mistaken for a level.
  Negative zero is normalized before it is shown; a page never prints "-0".
- **Right-aligned, tabular numerals, no wrapping.** Every numeric column has a fixed alignment and
  a width that fits the largest expected value; text columns absorb the flex.
- **A figure that cannot be computed says so** ("Not calculated") in muted text, and never shows a
  zero, a dash, or an empty cell in its place. Zero is a value.
- **Units stay attached to the measure that owns them.** Units of a fund, nominal of a bond, lots
  of a share, and principal of a placement are all quantities, but the column heading names which.

### Value tone

Gains and losses use color as support for the sign, never in place of it.

- Positive values take the success tone, negative values the danger tone, and zero stays neutral
  in the foreground color. A missing value is muted.
- Tone applies to changes and results (daily change, unrealized result, return against benchmark),
  not to levels. A NAV, a price, a market value, and a cash balance are never colored.
- Tone never appears on its own: the signed figure carries the meaning and remains legible in
  monochrome, in high contrast, and to a reader who does not see the tint.
- Tone is not status. A negative return is a fact, not an exception; it never takes the exception
  indicator or a warning icon.

### Price freshness

Freshness is derived from the observation and the business date, never stored, and shown where the
price is used, not only where it is maintained.

- Four states: current, stale, missing, overridden. Current is the common case and stays quiet
  (a status indicator in the success tone). Stale takes the warning exception tag and missing the
  danger one, because both need a person. Overridden is factual (an info status indicator) with
  the reason and the actor one click away.
- The state sits beside the observation date, so a stale price shows how stale. The rule that
  decides stale (the previous business day) is stated once on the register, not on each row.
- A page that depends on prices leads with coverage: how many holdings are priced, how many
  stale, how many missing, per fund. The count is the exception, so the register does not have to
  be scanned to find the gap.
- A missing or stale price is blocking where it matters (finalizing a valuation) and informative
  where it does not (reading holdings). The page says which.

### Constraint utilization

A limit is shown as how much of it is used, so every rule reads the same way whether it is a cap
on an issuer or a floor on cash.

- **Utilization is a percentage of the limit**, where 100 means at the limit. A maximum rule at 8
  percent with a 10 percent cap reads 80 percent; a minimum rule with 6 percent cash against a 5
  percent floor reads under its own scale. The projected value, the limit, and the utilization are
  all shown; the bar is a summary, not the figure.
- **Three outcomes: within, near limit, breach.** Within takes the accent fill, near limit the
  warning fill, breach the danger fill. The worst outcome on the page is the page's outcome and is
  stated in one line at the top, not inferred from scanning the bars.
- **A breach names the rule, the limit, and the projected value** in plain words ("Single-issuer
  exposure would be 11.8 percent against a 10 percent limit"). It is blocking where the policy says
  it blocks, and the blocked action explains itself rather than disabling silently.
- Bars are 80 px, 6 px tall, a rounded track in the raised color, and carry `aria-hidden`; the
  percentage beside them is the accessible value.

### Before and after tables

A decision about a change is a comparison of the world with and without it. The table shows both.

- One row per measure the decision affects (each policy rule, cash, allocation by class). Columns:
  the measure, before, after, the limit or target if one exists, and the outcome. The change is
  the difference between two columns, not a fourth number to reconcile.
- The "after" column is the projection the system commits to. If the action is applied, the record
  shows the same figures; a projection that would differ from the result is a bug.
- The rows that change lead. Rows that do not change are still listed, because "unchanged" is
  part of the answer, but they carry no tone.
- Inside a drawer the same table runs in a compact form: the measure and the after figure with
  the outcome, and the before figure as the secondary line. It does not clip or scroll
  horizontally; a table that needs the full width belongs on the page, not in the drawer.

### Holdings tables

A holdings table is the fund's book at a glance and the first place a reconciler looks.

- Grouped by asset class in a fixed order (cash last), each group with a subtotal, and a footer
  with the totals the NAV is built from. Groups are not collapsible; the reader wants the whole
  book on one screen.
- Columns, left to right: code, name, quantity, average cost, price, market value, accrued
  income where the class has it, unrealized result, realized result, weight. The unit of each is
  the asset class's own: shares and price per share; nominal and clean price per 100; principal
  and rate; cash with no price at all ("Not applicable", not zero).
- Weight is against net assets, to two places, and the footer's weights sum to 100.
- An unpriced position shows its cost as the value, marked with the missing-price state, so the
  totals are complete and the gap is visible in the same row.
- A holding row opens the instrument; the fund's own record is one level up. The table does not
  hold actions.

### NAV and reconciliation

The valuation page answers three questions in order: what is the figure, does it agree with the
custodian, and can it be finalized.

- **Components first, per unit last.** Gross assets, liabilities, accrued fees, net assets, units
  outstanding, NAV per unit, in that order, as a definition list with the journal accounts behind
  each line one click away. A mandate stops at net assets.
- **The comparison is a difference in basis points against the tolerance**, with both figures
  shown. Matched inside the tolerance is a quiet success state; a difference is an exception
  that names the size and asks for a note before the figure can be finalized.
- **Not received is a factual state**, not an alarm: "Not received" in muted text beside the
  custodian line, and a control to record it.
- **Finalization is a governed action** with its own confirmation naming what becomes fixed:
  the figure, the date, and the series it joins. A finalized figure is not editable; a correction
  is a new record.
- The day's runs (valuation, accrual, fee, NAV) appear as a timeline beneath, each with its
  trigger and its accounting event.

### Dense charts

A chart on an operational page supports the table beside it; it is not the page.

- One series family per chart, with the benchmark as a thinner muted line when present. No
  gradients, no fills under lines, no drop shadows, no animated draws.
- Axes are labeled with the unit once; ticks use the compact numeric form; the time axis uses the
  same date format as the rest of the page.
- Allocation is a single stacked horizontal bar with a legend that lists the same figures the
  table shows, in the same order. No pie charts.
- Colors come from the semantic and accent tokens, so the chart reads in both themes, and every
  series is also distinguishable by position or label, not color alone.
- A chart with fewer than three points is replaced by the figures in text.

### Readiness checklist

Construction of a record that must be complete before it can go live is shown as a checklist
derived from the record, not a wizard that walks the record into existence.

- Each item names a requirement in the record's own words (a fee schedule, an investment policy,
  seed cash, the required documents), states whether it is met, and links to where it is
  completed. Items are computed from the record every render; nothing is ticked by hand.
- The primary action (activate) stays visible and is disabled only while items are unmet, with
  the unmet items as its explanation. It never disappears.
- Met items stay in the list. The checklist is evidence of readiness, not a to-do list that
  empties.
- Once the record is live, the checklist is replaced by the record's operational tabs; the
  activation itself lives in the audit timeline with the configuration it was made under.

### Exception-first monitoring

A monitoring page is opened to find what is wrong. It leads with that and reads calmly when
nothing is.

- Order: breaches, then warnings, then data quality (stale or missing prices, unreconciled
  figures), then the performance and exposure figures that are the normal reading.
- Exceptions are rows with the rule, the fund, the figure, the limit, and the link to act. They
  are not tiles, and they are not counts alone; a count without the rows behind it sends the
  reader searching.
- When there is nothing to report, the section says so in one line in the muted tone and takes no
  more space than that line. It does not celebrate.
- Performance measures are named as a person names them (Time-weighted return, Sharpe ratio,
  Maximum drawdown), with the window and the method one click away. The benchmark figure sits
  beside the fund's, and the difference is signed.
- The figure strip at the top holds at most five cells and never wraps at the supported widths;
  a sixth figure belongs in the body.

### Lifecycle, stage, and the actions offered

A record with a long lifecycle is read at two levels. The **stage** is the handful of words a
person thinks in and belongs on every row; the **exact status** is the machine's own value and sits
beside it. Both are derived from one stored field, never stored twice. A lifecycle stepper belongs
in the record detail, where there is room for it, and nowhere else: a stepper on every row of a
register is decoration.

A screen never offers a status as a choice. It offers the actions that are valid now, named for
what they do (Release for execution, Record acknowledgement, Confirm settlement, Amend transaction),
and nothing else. "Update status", "Process", and "Manage" are not actions.

A financial record is never edited or deleted in place. The verbs are Edit and Cancel for drafts,
Amend and Reverse for booked records, and Correct for a valuation. Each of those raises a request
that shows its own before and after before anybody approves it.

### Same-snapshot consistency

A headline figure and the components shown beneath it are read from one record. Never assemble a
headline from the latest of one kind of record and a breakdown from the latest of another, even
when both are correct: the reader will subtract one from the other and find a number nobody can
explain. Where two legitimate figures must coexist, show them as separately named concepts with
separate timestamps, and say in one line why they differ. A valuation-state label (live, indicative,
preliminary, finalized, custodian-reconciled) is mandatory on every figure that has one, and a
figure never sits under a generic "Net assets" or "NAV" label when it belongs to a different state.

### Naming a figure by its basis

A financial page often holds several numbers that look alike and mean different things: one read
live from current inputs, one from a snapshot, one calculated and unpublished, one published. A
reader who cannot tell them apart will quote the wrong one.

- **Every headline figure states its basis in the words a person uses**, not in a status code:
  "Live, not finalized", "Indicative", "Preliminary", "Finalized", "Finalized, reconciled".
- **Never label a real number as absent.** A figure on the screen that has not been through its
  process is not "Not calculated", because something plainly is calculated. Say what it is instead.
  "Not calculated" belongs where there is genuinely no figure.
- **A published figure never moves.** When live and published figures share a chart, the published
  part is drawn one way and the unpublished continuation another, so a reader can see at a glance
  that history has not changed.
- The basis carries its timestamp. A figure with a basis and no time is half an answer.

### Readiness before a result

Where a result is only meaningful once several things are in place, show the requirements as a
list the record answers, not as an error that appears when the action is refused.

- **Three kinds of outstanding item, distinguished by who resolves them.** Something the system
  will do for itself as part of the action; something that does not stop the action but stops the
  result being published; something only a person can settle. Each reads differently, and the
  wording says what it blocks rather than how serious it is.
- **Every item that needs a person links to where it is settled**, and where an item can be
  resolved in place, the row offers that action next to the explanation.
- **The primary action stays visible and is disabled only while a blocking item stands**, with the
  items themselves as the explanation. An action that vanishes teaches people nothing.
- **The action settles what it can and refuses what it cannot.** Doing half the work silently, or
  producing a result over an incomplete record, is worse than refusing.

### Lifecycle records

A record that moves through many states needs its history on the record, not inferred from a
status field.

- **A status is the result of a transition, never an editable field.** No screen offers a status as
  a choice, and the actions available are exactly the transitions the record can make next.
- **The record carries its own event list**: what it moved from, what to, when, who, and any
  external reference. It is shown on the record as a plain chronological list, newest last, so the
  order of events is the order they happened.
- **Name the next action.** A record in an open state says what the desk does with it next, in the
  words of the action, so a queue can be read without opening every row.
- **A refusal is a state, not a lost keystroke.** Where a check refuses an instruction, the record
  moves to a state that says so and keeps the reason. It can then be revised and tried again.
- **Where a record leaves the building, say how and where it went**, with the route, the counterpart,
  and the external reference on the record.

### Simulations and projections

- **Say what it is on the page, not in a tooltip.** A projection states that it is not a forecast,
  in a sentence a reader cannot miss.
- **Every assumption is listed with the result**, including the ones that are absent: what was
  modelled, what was not, and the seed or the method where the answer depends on it.
- **The same inputs give the same answer.** A figure nobody can reproduce is a figure nobody can
  review, so randomness is seeded and the seed is shown.
- **A distribution is reported by percentile**, with the probability of the outcome the reader
  actually fears, and never as a single expected number standing alone.
- **A heuristic says it is a heuristic.** Where the implementation is an approximation of a method
  a reader might assume is exact, the page states the limitation in full rather than implying more
  rigour than exists.

### Master records against typed names

- **A field that names another record points at it.** A fund that names its custodian, an
  instrument that names its counterparty, an order that names its broker: each is a reference a
  reader can open, not a string that happens to match one.
- **Registration asks for the record, not the words.** A select of existing partners, clients,
  desks, and benchmarks, with the one value that cannot vary shown locked and explained.
- **Show the locked value rather than hiding it.** Where a field is decided by the deployment, it
  appears read-only with one line saying why, because the reader needs to know it was considered.
- **Separate legal identity from operating assignment.** Who is responsible in law and who is
  responsible today are different questions with different answers and different lifetimes. Give
  each its own section, and let the second be effective dated so history stays true.

### Work that blocks against work that waits

A list of outstanding work is only useful when the reader can trust what being on it means.

- **Separate what stops a process from what merely needs attention, and both from personal drafts.**
  Three groups, three headings, in that order.
- **State the rule.** Where something plausibly ought to block and does not, say so in one line
  where the list appears. A count that silently includes somebody's unfinished draft is a count
  people learn to ignore.
- **The same derivation feeds every surface.** A summary, a work list, and an oversight page that
  count the same records differently is the fastest way to lose a reader's trust in all three.
- **A count is followed by the rows behind it.** A number with no way to see what it is made of
  sends the reader hunting.

## Final standard

The strongest expression of this design system is not a particular shade of blue or a card
radius. It is an interface that makes consequential financial work feel controlled. The user sees
the answer, understands its quality, knows the next action, and can defend where it came from.

## Version history

| Version | Date | Summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-11 | Established the Praisindo-wide master guideline from the existing financial operations design language. Preserved its visual foundations and extended it with adaptable shell profiles, layered navigation, operational workflows, integration and reconciliation states, configuration, reporting, audit history, and declared viewport support. |
| 1.1.0 | 2026-09-12 | Set Phosphor as the icon family and removed Lucide. Added Addenda: status color and containers, counts on tabs and filters, panel motion, pointers and hit targets, application keyboard shortcuts, navigation and shell behavior, form correctness, dates and copy in the product voice, and authentication surfaces. |
| 1.2.0 | 2026-09-12 | Added Addenda: single-destination rows and scheduled and reversible actions. |
| 1.3.0 | 2026-09-12 | Added Addendum: missing values in tables and fact lists. |
| 1.3.1 | 2026-09-12 | Status color: added the neutral tone for factual notices and the rule that icons follow meaning rather than severity. |
| 1.4.0 | 2026-09-13 | Added Addenda: multi-step workflows and separate states for separate questions. |
| 1.5.0 | 2026-09-13 | Replaced the single badge component with a five-treatment status language (status indicator, exception indicator, category tag, count badge, integration state) so a healthy record reads quieter than one that needs a person. Added a surface decision framework covering pages, dialogs, drawers, popovers, tabs, disclosures, cards, tables, definition lists, guided workflows, worklists, and empty states. Added a section on avoiding generic generated interfaces. Strengthened operational guidance for table column widths, toolbar and filter order, forms grouped by intent, and a shared guided-workflow frame. Rewrote Motion around frequency, purpose, easing, duration, press feedback, and the removal of decorative loops. Lowered the page-title scale and restricted uppercase eyebrows to navigation. Compatible refinement: tokens, themes, and component behavior are unchanged apart from the status treatments. |
| 1.5.1 | 2026-09-13 | Exception indicators drop their default icon: the words carry the state and warning marks are reserved for genuine alerts. Step markers show position rather than severity, so a workflow with several unfinished steps reads as a list instead of a row of warning signs. Motion clarified so that the decorative background permitted on an authentication panel does not read as a contradiction of the no-loops rule. |
| 1.5.2 | 2026-09-13 | Register toolbars: filters move behind one `Filters` control with an applied count once a register has three or more of them, and the summary under the table names the filters in force. Adds the non-modal popover behaviour those panels follow. Audit history on a workflow page moves into a drawer so the work itself is not trailed by a log. Moving between the steps of a workflow returns the scroll region to the top. A record page's breadcrumb links back to the register that owns it. |
| 1.6.0 | 2026-09-14 | Added Addenda: governed registers (Records, My Requests, Pending Approval, the shared request detail, decision dialogs, the maker form, request status treatment, and linked histories) and unsaved-work protection. |
| 1.7.0 | 2026-09-15 | Added Addendum: configuration surfaces (the register, the focused editor, consequence-based confirmation, locked values, supersession, on-surface history, and state previews without a graph canvas). |
| 1.8.0 | 2026-09-16 | Added Addenda for investment operations: financial numbers, value tone, price freshness, constraint utilization, before and after tables, holdings tables, NAV and reconciliation, dense charts, readiness checklists, and exception-first monitoring. Compatible refinement: no token or component change. |
| 1.9.3 | 2026-09-26 | Application tabs behave as browser tabs: each keeps its page and unsaved work alive while another is in front and reopens where it was left; only closing a tab asks. |
| 1.10.1 | 2026-10-05 | Added Documents and file exports: every exported document prints the institution's name, logo and brand colours from its record and theme, never the platform's. Compatible: screens unchanged. |
| 1.13.1 | 2026-10-08 | Whether the institution's name is set beside its logo is the theme's choice (on for a symbol, off where the logo spells the name), followed by client statements. Compatible: the platform's own theme looks as before. |
| 1.13.0 | 2026-10-07 | Added Search this page as a named motion exception: the trigger's single sheen, the dialog's settle and row arrival, the gliding row highlight, the stepped walk to a result, and the frame with its fading wash, single halo and attached label. |
| 1.12.0 | 2026-10-07 | In-page tabs: springing underline, hover glow, press and release, count hop, panel rise; fixed 40 px strip with the underline over the divider; 16 px under a page header. Segmented and tab springs quicker. |
| 1.11.3 | 2026-10-07 | Added the segmented view control's sliding, stretching highlight as a named motion exception. Compatible. |
| 1.11.2 | 2026-10-07 | A brand's own reversed emblem is used in dark mode where it publishes one. Compatible. |
| 1.11.1 | 2026-10-07 | Institution logos are the brand's emblem alone in a 16 px square (28 px on a record), transparent, with no plate in dark mode; dark one-colour emblems drawn white there. Compatible: same placement. |
| 1.11.0 | 2026-10-07 | Added Institution logos: whose logo a record carries in banking and in asset management, the row slot and the record placement, sizing by artwork, the dark-mode plate and the initials fallback. Compatible: names and columns unchanged. |
| 1.10.0 | 2026-10-05 | Added White-label themes: a theme is token values, not component conditions; seven chosen colours per mode with every other shade derived and held to contrast; semantic hues preserved; logos sized by visible artwork; minimized logo, watermark and sidebar token scope. Compatible: the platform theme's tokens are unchanged. |
| 1.9.2 | 2026-09-17 | Added Addendum: lifecycle, stage, and the actions offered, which puts the stage on the row and the stepper in the record, forbids status dropdowns, and fixes the vocabulary for changing a financial record. |
| 1.9.1 | 2026-09-16 | Added Addendum: same-snapshot consistency, which makes valuation-state labels mandatory and forbids assembling a headline and its breakdown from different records. |
| 1.9.0 | 2026-09-16 | Added Addenda: naming a figure by its basis, readiness before a result, lifecycle records, simulations and projections, master records against typed names, and work that blocks against work that waits. Compatible refinement: no token or component change. |
