# Planner Pages Redesign — Design Brief

## Context & Design Reference

Our **Setup Wizard** (`app/pages/planner/wizard/`) sets the visual tone for the entire product. It has a clear, confident design language that the planner tabs currently don't follow. This brief defines what the designer should produce for each planner tab so the post-wizard experience feels like a seamless continuation — not a downgrade.

### Wizard Design Language (Reference)

Open the wizard flow to see these patterns in action. Key characteristics:

| Pattern                    | How it looks in the wizard                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Page background**        | Content sits on a light grey page background — NOT inside a single wrapping card                                                                       |
| **White cards**            | Individual sections are `bg-white rounded-xl shadow-sm border border-navy/10` with `p-5`–`p-7` padding                                                 |
| **Navy accent cards**      | Hero stats use `bg-navy text-white` with `border-l-4 border-highlight` and a subtle gradient overlay. Used for the take-home pay hero in BreakdownStep |
| **Highlight accent cards** | Secondary accent cards use `bg-highlight text-white` (e.g., the privacy bento card in IncomeStep)                                                      |
| **Bento grid**             | Cards are laid out in a mixed grid — 1-col, 2-col, 3-col — creating visual rhythm, not uniform rows                                                    |
| **Typography**             | Page headings: `text-2xl md:text-3xl font-extrabold tracking-tight`. Card headings: `text-sm font-heading font-bold`. Subtitles: `text-navy/60`        |
| **Micro-labels**           | Stat labels use `text-xs font-semibold uppercase tracking-wider text-navy/40`                                                                          |
| **Icon containers**        | Icons sit inside `w-9 h-9 bg-highlight/10 rounded-full` circles                                                                                        |
| **Buttons**                | Primary: `rounded-full bg-highlight shadow-md shadow-highlight/20 font-semibold`. Ghost: `rounded-full text-navy/60`                                   |
| **Info callouts**          | `bg-highlight/10 rounded-xl` strips with icon + text for contextual help/privacy notes                                                                 |
| **Hover states**           | Interactive cards lift on hover: `hover:shadow-xl hover:-translate-y-0.5` with group-hover child transitions                                           |
| **Animations**             | Entrance: `opacity: 0, y: 20` → `opacity: 1, y: 0`. Staggered with `delay` increments                                                                  |
| **Stepper**                | Numbered circles with connecting lines, completed steps show checkmarks, active step has a ring                                                        |

### The Core Layout Change

**Currently**: The entire planner (header + tabs + content) is wrapped in a single `dashboard-card` (`bg-white border rounded-3xl shadow-sm`). Everything is squeezed inside this one card. This creates a flat, cramped feel.

**Proposed**: Break out of the single-card wrapper. The planner name, tab navigation, and section headings should live on the **grey page background** (like the wizard's stepper and headings do). Only discrete content sections should be white cards. This creates the same breathing room and visual hierarchy the wizard has.

**Important constraint**: The tab navigation needs to remain persistent and visible across all tabs. Consider whether it works as:

- (a) A horizontal tab bar pinned to the top of the content area on the grey background, OR
- (b) A pill/segment control on the grey background above the card area, OR
- (c) Something else entirely (sidebar on desktop, bottom nav on mobile)

The designer should explore what feels best given that this is a financial planning tool used daily by couples.

---

## Page-by-Page Specifications

---

### 0. Planner Shell (PlannerDetailView)

**What it is**: The outer container that wraps all tabs. Currently a single `dashboard-card`.

**Current state**: Everything inside one white rounded card — header, tab bar, and all tab content.

**What we want to see**:

- **Planner name** as a large heading (`text-2xl font-extrabold tracking-tight`) on the grey background
- **Tab navigation** on the grey background, below the heading
  - 4 tabs: Dashboard (LayoutDashboard icon), Income (Wallet icon), Goals (Target icon), Settings (Settings icon)
  - Each tab shows icon + label (label hidden on mobile, icon-only)
  - Active tab: `text-highlight` with a highlight underline or pill background
  - Inactive: `text-navy/60`, hover → `text-navy`
- **Tab content area** below — this is where individual white cards, navy cards, and bento grids live directly on the grey background
- Smooth transition when switching tabs (fade or slide)

**Clickable components**:
| Element | Action |
|---------|--------|
| Each tab button | Switches to that tab's content |

---

### 1. Dashboard Tab

**Purpose**: At-a-glance overview of the household's financial health.

**Layout direction**: A vertical stack of distinct sections on the grey background, using a mix of card styles:

#### Section A — Health Summary (Hero)

- **Navy hero card** (full width) showing:
  - Micro-label: "MONTHLY REMAINING"
  - Large amount in `text-highlight` (the remaining $)
  - Small health status pill (Healthy / Tight / Over Budget) with appropriate icon and color
  - Footnote: "X% of combined take-home"
  - Subtle gradient overlay on the right side
- If budget is warning/danger state: switch to white card with amber/red accent border instead

#### Section B — Flow Type Breakdown

- **White card** showing how the budget is allocated across Expense / Savings / Investment
- Each flow type row: colored dot, label, horizontal progress bar, dollar amount, expand chevron
- Expandable: clicking a row reveals the individual goals in that category
- Compact legend showing the 3 flow type colors

#### Section C — Member Summary (Bento 2-col)

- **Two white cards side by side** (1-col on mobile):
  - Left: Current user — avatar circle (highlight background), name, "You" subtitle, remaining amount (green if positive, red if negative)
  - Right: Partner (if exists) — avatar circle (navy background), name, "Partner" subtitle, remaining amount
- Cards should lift on hover

#### Section D — Quick Actions

- **Two buttons** on the grey background (no card wrapping):
  - Primary: "Add Goal" — `rounded-full bg-highlight shadow-md` → navigates to Goals tab
  - Ghost: "Adjust Contributions" with arrow → navigates to Income tab

#### Section E — Goal Count

- Subtle micro-label footer: "X GOALS TRACKED"

**Clickable components**:
| Element | Action |
|---------|--------|
| Flow type row (Expense/Savings/Investment) | Expands to show goals in that category |
| Expand chevron on flow type row | Same as above |
| "Add Goal" button | Switches to Goals tab |
| "Adjust Contributions" button | Switches to Income tab |

---

### 2. Income Tab

**Purpose**: View and edit each member's income profile, see CPF breakdowns, and configure how shared expenses are split.

**Layout direction**: Vertical stack on grey background.

#### Section A — Heading

- On the grey background (not inside a card):
  - Heading: "Income Profiles"
  - Subtitle: "Manage your income details and CPF breakdown."

#### Section B — Member Income Cards (1 per member, stacked)

Each member gets a **white card** with:

- **Header row**: Avatar circle + name + "You" or "Partner" + age. For the current user, a pencil icon button to enter edit mode.
- **Summary**: Micro-label "TAKE-HOME" with the dollar amount in bold
- **Expandable CPF breakdown**: A "View CPF breakdown" toggle at the bottom that reveals:
  - Gross Income, OA, SA, MA, Total CPF — each as a label/value row
  - Info tooltips (ℹ️) on OA, SA, MA explaining what they are
  - Background changes to `bg-navy/5` when expanded
- **Edit mode** (current user only): Replaces the summary with a form:
  - Display Name input, Age input, Gross Income input
  - Inputs styled: `rounded-full bg-navy/5 border-0` with highlight focus ring
  - Save (highlight pill button) and Cancel (ghost pill button)
  - Labels: `font-heading font-semibold`

#### Section C — Info Callout

- **Info strip** (on grey background or as a standalone element):
  - Calculator icon + "CPF contributions are auto-calculated based on current Singapore rates and your age bracket."
  - `bg-highlight/10 rounded-xl` styling

#### Section D — Contribution Split (only if 2 members)

- **White card** containing:
  - Heading: "Contribution Split" with info tooltip
  - Subtitle: "How should shared expenses be split between you?"
  - **Mode selector**: Two pill buttons — "Income-Based" and "Custom"
    - Active: `bg-highlight text-white`
    - Inactive: `bg-navy/5 text-navy/70`
  - **Income-Based view**: Shows each member's name, a proportional bar, and percentage. Footnote with combined total.
  - **Custom view**: Shows each member's name + editable percentage input + "%" label. "Save Ratio" pill button. Validates that percentages sum to 100%.

**Clickable components**:
| Element | Action |
|---------|--------|
| Pencil icon (current user card) | Enters edit mode for that card |
| Save button (edit mode) | Saves updated income data, triggers CPF recalculation |
| Cancel button (edit mode) | Exits edit mode without saving |
| "View CPF breakdown" toggle | Expands/collapses CPF account details |
| "Income-Based" pill | Switches split mode to income-based, saves immediately |
| "Custom" pill | Switches UI to custom input mode (does NOT save until button is clicked) |
| "Save Ratio" button (custom mode) | Validates and saves custom ratio |
| Info tooltip icons (ℹ️) | Shows tooltip with explanation of the term |

---

### 3. Goals Tab

**Purpose**: View, filter, create, edit, and delete financial goals.

**Layout direction**: Vertical stack on grey background.

#### Section A — Header Row

- On the grey background:
  - Left: Heading "Goals & Expenses" + subtitle "Track your shared and personal financial goals."
  - Right: "Add Goal" primary pill button with Plus icon

#### Section B — Filters

- **Filter bar** (can be on grey or in a subtle container):
  - Owner filter pills: All | Mine | Partner | Shared
  - Flow type filter pills: All | Expense | Savings | Investment
  - Active filter: `bg-highlight text-white`
  - Inactive filter: `bg-navy/5 text-navy/60`

#### Section C — Flow Type Legend

- Small inline legend showing colored dots + labels for Expense (red), Savings (green), Investment (blue)

#### Section D — Goal List

A **vertical stack of white cards**, one per goal:

Each **GoalListItem** card shows:

- **Main row**: Flow type badge (colored dot) | Goal name + owner label + CPF tag | Monthly amount + "/mo" | Duration (if applicable) | Expand chevron
- **Expanded state** (when chevron is clicked):
  - Per-person contribution breakdown (if partner exists): `bg-navy/5` sub-card showing each person's monthly contribution and the split ratio
  - For time-bound goals: Total Amount, Duration (months), Period (start–end)
  - CPF eligibility note (if applicable)
  - Remarks/notes section
  - **Action buttons**: Edit (ghost pill) and Delete (red ghost pill, with confirmation dialog)

#### Section E — Empty State (when no goals or no filter matches)

- **White card** (centered content):
  - Highlight circle with Plus icon
  - Heading: "No goals yet" or "No matching goals"
  - Description text
  - If no goals at all: "Add Your First Goal" primary pill button

#### Section F — Goal Count Footer

- Micro-label: "SHOWING X OF Y GOALS"

#### Goal Slide-Over Panel (triggered by Add/Edit)

A **right-side slide-over panel** (`max-w-md`) that overlays on top:

- **Backdrop**: Semi-transparent navy overlay
- **Panel**: White, full height, shadow-xl
- **Header**: "New Goal" or "Edit Goal" + close (X) button
- **2-step form**:
  - **Step 1 — Basic Info**:
    - Step indicator: "Step 1 of 2" in highlight color
    - Goal name input
    - Amount input (with $ prefix)
    - Flow type selector: 3 pill buttons (Expense / Savings / Investment) with color-coded active states
  - **Step 2 — Details**:
    - Owner selector (if partner): Mine / Partner / Shared — 3 pill buttons
    - Category: Ongoing Monthly / Time-bound Goal — 2 pill buttons
    - If time-bound: Start date (month picker) + Duration (months) input inside a `bg-navy/5` sub-section, with calculated monthly contribution shown
    - CPF OA eligible checkbox with info tooltip
    - Notes textarea
- **Footer**: Back (ghost) + Continue/Save (highlight pill) buttons
- Slide-in animation from the right, spring physics

**Clickable components**:
| Element | Action |
|---------|--------|
| "Add Goal" button (header) | Opens slide-over in create mode |
| Owner filter pills | Filters goal list by ownership |
| Flow type filter pills | Filters goal list by flow type |
| Goal card expand chevron | Toggles expanded details |
| "Edit" button (expanded goal) | Opens slide-over pre-filled with goal data |
| "Delete" button (expanded goal) | Shows browser confirmation dialog, then deletes |
| "Add Your First Goal" (empty state) | Opens slide-over in create mode |
| Slide-over close (X) button | Closes slide-over without saving |
| Slide-over "Cancel" button | Closes slide-over without saving |
| Step 1 "Continue" button | Advances to Step 2 (disabled if name/amount/flowType missing) |
| Step 2 "Back" button | Returns to Step 1 |
| Step 2 "Add Goal" / "Save Changes" | Submits form (disabled if required fields missing) |
| Flow type selector pills (step 1) | Sets goal's flow type |
| Owner selector pills (step 2) | Sets goal ownership |
| Category pills (step 2) | Toggles between ongoing and time-bound |
| CPF OA checkbox (step 2) | Toggles CPF eligibility flag |

---

### 4. Settings Tab

**Purpose**: View planner info, share the join code, see members, and leave the planner.

**Layout direction**: Vertical stack on grey background, `max-w-lg` for comfortable reading width.

#### Section A — Planner Details Card

- **White card** with:
  - Heading: "Planner Details" (`text-xl font-extrabold`)
  - Micro-label "NAME" + planner name in medium weight
  - Micro-label "SHARE CODE" + monospace code in a `bg-navy/5 rounded-lg` container + copy button (shows checkmark for 2 seconds after copy)
  - **Info callout**: `bg-highlight/10` strip with UserPlus icon + "Share this code with your partner so they can join this planner."

#### Section B — Members Card

- **White card** with:
  - Heading: "Members" with Users icon
  - List of members, each showing:
    - Avatar circle (highlight background) with initial
    - Name + email
    - Role badge: "Owner" (`bg-highlight/10 text-highlight`) or "Member" (`bg-navy/5 text-navy/60`)
  - If only 1 member: Footnote text "Waiting for partner to join using the share code above."

#### Section C — Danger Zone Card

- **Red-tinted card** (`bg-red-50/50 border border-red-200`) with:
  - Heading: "Danger Zone" in `text-red-700`
  - Warning text explaining the consequences
  - "Leave Planner" button: Ghost style with red text, LogOut icon. Shows "Leaving..." while processing.
  - Triggers browser confirmation dialog before executing

**Clickable components**:
| Element | Action |
|---------|--------|
| Copy button (share code) | Copies planner code to clipboard, shows checkmark feedback |
| "Leave Planner" button | Shows confirmation dialog → on confirm, leaves planner and redirects to home |

---

## Cross-Cutting Concerns

### Responsive Behavior

- **Desktop (≥640px)**: Bento grids, side-by-side member cards, full tab labels
- **Mobile (<640px)**: Single column, stacked cards, icon-only tabs, slide-over is full-width

### Color Palette (reference)

- `navy` — Primary text and dark backgrounds
- `highlight` — Brand accent (buttons, active states, links)
- `navy/60`, `navy/50`, `navy/40` — Secondary text hierarchy
- `navy/5`, `navy/10` — Subtle backgrounds and borders
- Red/Amber/Green — Semantic states (danger, warning, healthy)

### Transitions Between Wizard → Planner

When the user completes the wizard and lands on the Dashboard tab, the visual language should feel continuous. The wizard's "Go to Dashboard" navy bento card should feel like it's leading into the Dashboard tab's navy health summary hero card. No jarring style shift.

### Navigation Map

```
Wizard (if setup needed)
  └─ onComplete → Dashboard Tab

Dashboard Tab
  ├─ "Add Goal" button → Goals Tab
  └─ "Adjust Contributions" button → Income Tab

Goals Tab
  ├─ "Add Goal" / "Add Your First Goal" → Goal Slide-Over (create)
  ├─ Goal "Edit" button → Goal Slide-Over (edit, pre-filled)
  └─ Goal "Delete" button → Confirmation dialog → delete

Income Tab
  ├─ Pencil icon → Inline edit mode (same card)
  ├─ "Income-Based" pill → Saves immediately
  └─ "Custom" pill → "Save Ratio" button → Saves

Settings Tab
  ├─ Copy button → Clipboard
  └─ "Leave Planner" → Confirmation → Redirect to /
```
