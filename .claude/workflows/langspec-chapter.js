export const meta = {
  name: 'langspec-chapter',
  description: "Apply LANGUAGE.md to one manual chapter, then settle every [VERIFY] against the Swift source",
  whenToUse: 'Pass the chapter filename as args, e.g. "ui-settings-styling.md". Run per chapter, review the findings, apply by hand.',
  phases: [
    { title: 'Analyse', detail: 'three lenses over the chapter, per the spec' },
    { title: 'Settle', detail: 'answer each [VERIFY] question from the Swift source' },
  ],
}

const CH = `/Users/nikolaysenilov/Developer/idog321.github.io/src/content/docs/manual/${args || 'raster-overlays.md'}`
const SPEC = '/Users/nikolaysenilov/Developer/idog321.github.io/LANGUAGE.md'
const APP = '/Users/nikolaysenilov/Developer/TopoKit'

const BRIEF = `Read ${SPEC} in full. It is the author's own language spec for this manual and it
is the ONLY standard you apply. Then read the chapter at ${CH}.

Your job is step 2 and 3 of the spec's "Working instructions": flag every sentence that fails a
test, and propose a rewrite, or CUT, or FOLD.

HARD RULES:
- Do NOT invent app behaviour. If a rewrite needs a fact the chapter does not contain, put the
  question in the "verify" field and write the rewrite with a [VERIFY: ...] marker inline. Never
  fill a gap with a plausible guess. You do not have the source; another agent will settle it.
- "quote" must be copied EXACTLY from the chapter, including typographic apostrophes, long enough
  to locate uniquely.
- Give the line number.
- DO NOT TOUCH ANYTHING THAT PASSES. The spec is explicit: the job is to bring weak entries up,
  not to restyle strong ones. The spec's "Calibration: the target" section quotes real lines from
  this manual that are already right — if the chapter you are reading contains one of them, leave
  it exactly as it is. If you propose changes to good writing you have failed the task.
- Ignore <div class="shot-needed"> blocks and image alt text. Not shipping prose.
- action must be REWRITE, CUT, or FOLD.`

const SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['line', 'quote', 'test_failed', 'action'],
        properties: {
          line: { type: 'number' },
          quote: { type: 'string' },
          test_failed: { type: 'string', description: 'which test or banned item, named from the spec' },
          action: { type: 'string', enum: ['REWRITE', 'CUT', 'FOLD'] },
          replacement: { type: 'string', description: 'the new text; omit for CUT' },
          verify: { type: 'string', description: 'a question about app behaviour the chapter does not answer, if the rewrite needs one' },
        },
      },
    },
  },
}

const LENSES = [
  {
    key: 'frames',
    prompt: `LENS: section type and frame, plus test 4 (parallel depth).

Go section by section. For each, name its type (interface tour / control or setting entry /
procedure / concept) and the frame it should therefore use. Then find every place the chapter
switches frame inside a section, and every list whose items are not the same grammatical shape
and roughly the same depth.

The spec calls mixing frames in one list "the most common defect in this manual", so look hardest
at every bulleted list, every table's rightmost column, the troubleshooting or FAQ sequence, and any
place the chapter describes the same controls twice in different sections.

A list where one entry is three clauses and six others restate their labels is the defect,
regardless of how good the long entry is.`,
  },
  {
    key: 'four-tests',
    prompt: `LENS: the four tests, especially test 1 (cover the label) and test 2 (never enumerate
picker values as the description).

Apply test 1 to every sentence describing a control: hide the control's name, read the
description, and ask whether it still identifies which control this is. Apply test 2 anywhere the
chapter lists a picker's values instead of saying what choosing one does.

Then test 3 (guessability): flag any entry a reader could correctly predict from the control's
name and the screen. The spec is explicit that a list containing dead entries teaches the reader
to skim past the live ones, so dead entries are a real cost, not a neutral one.

Remember the three-way split: REWRITE when there is a real consequence to state, FOLD when several
trivial entries sit together, CUT when there is genuinely nothing to say.`,
  },
  {
    key: 'banned',
    prompt: `LENS: the Banned list.

Find every instance in the chapter of:
- a predicate that restates its subject
- a figurative verb for software behaviour (travels, lives under, sits in, walks back, falls back,
  lands, holds, carries, buys, teaches — judge each on whether it states what happens or dresses
  it up)
- outcome framing or evaluative adjectives
- filler (simply, essentially, of course, in practice, worth noting, that said, if you like) —
  apply the spec's own test: delete the phrase and see whether the sentence survives
- whole-sentence parentheticals
- bold on a clause for emphasis rather than on a UI string being named

Be careful with the last one: this chapter uses bold headline sentences a lot. The spec says bold
the UI string being named, never a clause for emphasis. Flag every bolded clause that is not a UI
string, but say in test_failed whether you think it is load-bearing as a warning, because the spec
also praises one bolded warning sentence in this very chapter as a calibration target.`,
  },
]

phase('Analyse')
const analyses = await parallel(
  LENSES.map((l) => () =>
    agent(`${BRIEF}\n\n${l.prompt}`, { label: `lens:${l.key}`, phase: 'Analyse', schema: SCHEMA })
      .then((r) => ({ key: l.key, findings: r?.findings || [] }))
  )
)

const all = analyses.filter(Boolean).flatMap((a) => a.findings.map((f) => ({ ...f, lens: a.key })))
const questions = all.filter((f) => f.verify)
log(`${all.length} findings; ${questions.length} need a fact from the source`)

phase('Settle')
const settled = await parallel(
  questions.slice(0, 12).map((q) => () =>
    agent(
      `Answer one factual question about the TopoKit app by reading its Swift source at ${APP}.

QUESTION: ${q.verify}

CONTEXT — this is being asked because a manual sentence is being rewritten:
  current text: ${q.quote}
  proposed:     ${q.replacement || '(cut)'}

RULES:
- Shipping Swift is the only authority. NEVER read ${APP}/.claude/worktrees/ — stale copies.
- Trace to a live call site. Check #if os() gating; say if Mac and iPhone differ.
- Cite file:line and quote the deciding line.
- If the source does not settle it, say UNRESOLVED plainly. Do not guess.`,
      { label: `settle:${q.lens}`, phase: 'Settle', schema: {
        type: 'object',
        required: ['answer', 'evidence', 'resolved'],
        properties: {
          resolved: { type: 'boolean' },
          answer: { type: 'string' },
          evidence: { type: 'string' },
        },
      } }
    ).then((a) => ({ ...q, settlement: a }))
  )
)

return { findings: all, settled: settled.filter(Boolean) }
