# Manual style rules

Nikolay's rules, in his words where possible. Every one of these came from him
having to point at a sentence. **Read this before editing any chapter**, and when
a new rule arrives, add it here and sweep the whole manual for other violations —
not just the sentence he selected.

`npm run lint:style` enforces the mechanical ones.

---

## Register

**Matter of fact. Not clever.** This is the rule broken most often.

> "everything is supposed to be very matter of fact and not, like, just beating
> around the bush"

> "It's this kind of writing style that fucking pisses me off. Like, styling never
> travels. What the fuck? Just styling doesn't get exported when you save your
> data. … this isn't clever. this is a fucking manual."

| Don't | Do |
|---|---|
| Styling never travels. | Styling is not exported. |
| Map imagery streamed from a web service, rather than a file you hold. | Map imagery streamed from a web service. |
| Georeferenced images that sit under your data. | Georeferenced images pinned to real-world coordinates. |
| Add Point is the quick one. | *(just describe what it does)* |

No figurative verbs for software behaviour: things do not *travel*, *live under*,
*bite*, *fan out*, or *sit in the middle of* anything. State what happens.

## No filler

Delete rather than soften. Phrases he has cut by hand: "if you like", "worth
knowing", "worth noting", "of course", "simply", "essentially", "in practice",
"that said". If a sentence survives deletion of the phrase, the phrase was filler.

## Don't state what the app cannot do as a headline

> "we don't need to make topokit sound fucking bad"

Limits belong where the reader hits them, not in the opening paragraph. The
Overview says what TopoKit is for; `points-lines-polygons` says attributes are
read-only, because that is where someone looks for an attribute editor.

## No redundant openers

If a section has bullets describing each item, the paragraph above must not
describe them again.

> "What is the point of this entire opening paragraph if all of the tools are just
> going to be described below"

## Consistency is a rule, not a preference

The same control gets the same name everywhere. **Tool card**, not toolbar card /
drawing card / measurement toolbar / floating toolbar. If one item in a list gets
a detailed description, they all do.

> "why is the writing so god damn inconsistent"

## Brackets

A parenthetical that is a whole sentence should be a sentence. Reserve parentheses
for a short aside inside a sentence.

## Bold

Bold the UI string being named, not the prose around it. Do not bold whole
clauses for emphasis.

## Platform content

`:::ios` / `:::mac` blocks hide when the toggle is set. They must be invisible
containers — no indent, no border, no badge. If a paragraph mentions both
platforms, split it so each side hides properly rather than leaving a fragment
behind.

## Images

- Sizing only. No shadows, borders, or rounded corners on his artwork.
- Never add an image he did not ask for, in a place he did not name.
- No floats in a section that has more than one image.
- Use his SVG icons; never a Lucide stand-in for a real TopoKit control.

## Facts

- The app is the authority — check the Swift source, not another doc.
- Code that exists is not a feature. Trace it to a reachable call site.
- When a fact is corrected, grep every chapter for the same claim.

## Screenshot placement

Default: **centre it**. Most captures are narrower than the text column and
read as slipped when left-aligned. `.sl-markdown-content img` carries
`margin-inline: auto`, so a new screenshot centres with no extra rule.

Float a capture beside its prose only when the section holds **one** image. A
float must also be placed **above** the paragraphs it should sit beside — a
float only affects content that follows it, so from below the text it does
nothing.
