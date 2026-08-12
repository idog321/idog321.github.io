# TopoKit manual — language spec

Nikolay's spec, in his words. `STYLE.md` lists mechanical rules and
`scripts/check-style.mjs` enforces the ones a regex can catch. This file is the
one that decides whether a sentence is worth keeping. When the two disagree,
this wins.

Paste this whole file into a chat along with one manual chapter. It tells the
model what register to write in and how to test a sentence. Calibration examples
are real lines from the TopoKit manual, good and bad.

Do not invent app behaviour. Where a rewrite needs a fact the chapter does not
contain, leave `[VERIFY: ...]` in place rather than guessing. The Swift source is
the authority.

## The register

Plain declarative. The reader is a GIS professional in the field who opened the
manual because something did not behave as expected. Tell them what happens.

**Every sentence must carry information the reader cannot get from looking at
the screen.** That is the entire standard. Everything below is a way of testing
it.

## One frame per section type

Pick the frame from what the section is, and do not switch inside a section.
Mixing frames in one list is the most common defect in this manual.

| Section type | Frame | Shape |
|---|---|---|
| Interface tour | Element is the subject | The \<element\> \<shows/contains/holds\> \<what is in it\>. |
| Control or setting entry | Name, then effect | \<Name\>: \<what it changes\>. \<Consequence the reader cannot see\>. |
| Procedure | Imperative, numbered | 1. Tap \<control\>. 2. Choose \<option\>. |
| Concept | Mechanism, then consequence | \<What the app does\>, so \<what the reader observes\>. |

### The frame violation to look for

`map-tools.md` describes the same six tools twice, 25 lines apart, in two
different frames:

```
19: **Add Point** — mark a location by tapping the map, or from your current GPS fix.
44: Add Point marks a single location. Tap the map to place it, or use the
    location button on the tool card to drop it where you are standing.
```

Line 19 commands the reader; line 44 makes the control the subject. Neither is
wrong alone. Both in one chapter is the inconsistency. An annotated-figure
legend is an interface tour: element as subject, both times.

## Four tests

Apply to every sentence that describes a control.

1. **Cover the label.** Hide the control's name and read the description. If it
   still identifies which control this is, it carries information. If it could
   describe any control by that name, it is dead.
   - `**Version**: the installed app version.` → covered, this is nothing. Cut.
   - `**Default Vertex Style**: the dots drawn while you create and measure.` →
     covered, still identifiable. Keep.
2. **Never enumerate picker values as the description.** The values are visible
   in the UI. Say what choosing one does.
   - Dead: `**Icon Size**: Small / Medium / Large.`
   - Alive: names the tradeoff between the values.
3. **Guessability.** If a reader could correctly predict the behaviour from the
   control's name and the screen, it does not need a bullet. A list that
   includes dead entries teaches the reader to skim past the live ones.
4. **Parallel depth.** Every item in a list gets the same grammatical shape and
   roughly the same depth. One three-clause entry beside six label-restatements
   is the defect, regardless of how good the long one is.

## Banned

- **Predicate that restates the subject.** "The reprojection sheet reprojects
  the raster." The verb must add something.
- **Figurative verbs for software behaviour.** Nothing travels, lives under,
  sits in, fans out, or gets turbo-charged. State what happens.
- **Outcome framing and evaluative adjectives.** No powerful, handy, effortless,
  seamless, professional-grade. No "so your fieldwork flows."
- **Filler.** simply, essentially, of course, in practice, worth noting, that
  said, if you like. If the sentence survives deleting the phrase, the phrase
  was filler.
- **Whole-sentence parentheticals.** Make it a sentence. Parentheses are for a
  short aside inside a sentence.
- **Bold on prose.** Bold the UI string being named, never a clause for emphasis.

## Calibration: the target

These are already right. Match this depth and this tone.

**`ui-settings-styling.md:70`**
> **Default Vertex Style**: the dots drawn while you create and measure. Unlike
> the other defaults this is not saved into features — it is read fresh every
> time you draw, so changing it changes what you see immediately.

Names the thing, then the one behaviour that would otherwise surprise you.

**`raster-overlays.md:61`**
> **There is no cancel button, and no way to pick up where it left off.** An
> interrupted reprojection keeps none of the work it finished.

States a hard limit plainly, at the point the reader hits it.

**`layer-tree.md:24`**
> A tile layer covers the whole map, so anything below it in the tree is hidden
> everywhere; a raster only hides the area inside its own footprint, so the same
> layer can be hidden in one part of the map and visible in another.

Mechanism, then the observable consequence, then the asymmetry between two cases.

**`measurement.md:39`**
> **Area and perimeter on the same card come from different earth models.**
> Perimeter is ellipsoidal, area is spherical.

Tells the reader something they would otherwise waste an afternoon on.

## Calibration: the failures

All from `ui-settings-styling.md`. Every one fails test 1 or test 2.

```
39: **Show Toolbar**: overall on/off.
40: **Position**: Left or Right edge.
41: **Icon Size**: Small / Medium / Large.
88: **Storage Location**: displays the iCloud projects root directory.
98: **Version**: the installed app version.
100: **Licenses**: third-party open-source licences.
104: **Replay Introduction**: re-runs the onboarding intro.
```

Correct handling splits three ways:

**Rewrite** when there is a real consequence to state:
> **Position**: which edge the sidebar sits on. [VERIFY: does the map reflow
> around it, or does the sidebar overlay the map content?]
>
> **Icon Size**: how large the tool buttons are drawn. [VERIFY: does Small fit
> all eleven buttons without scrolling on the smallest supported iPhone?]

**Fold** into a sentence when several trivial entries sit together. The About
section — Version, Licenses, Rate TopoKit, Send Feedback, Replay Introduction —
does not need five bullets.

**Cut** when there is genuinely nothing to say. A settings reference does not
have to enumerate every row. It has to explain every row that can surprise
someone.

## Working instructions

1. Read the chapter and identify each section's type, then its frame.
2. Flag every sentence failing a test. Quote the line with its number.
3. Propose a rewrite, or CUT, or FOLD.
4. Where a rewrite needs a fact not present in the chapter, write
   `[VERIFY: <the question>]`. Never fill the gap with a plausible guess.
5. Do not touch anything that passes. This manual has a lot of good writing in
   it and the job is to bring the weak entries up, not to restyle the strong
   ones.
