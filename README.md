# Career Compass

![Career Compass icon](.claude-plugin/icon.png)

**Honest fit checks for any job posting, and drafts built on your real work.**

Paste a job posting and your résumé, and ask **"Do I fit this?"** You get a straight
verdict (strong, stretch, or long shot), each of the posting's must-haves matched to real
evidence from your background, and the top two gaps with how to address them in your
application. You'll know whether to apply and what to fix first. No setup, no account.

## Get it

In the Claude app or on claude.ai, open **Customize → Plugins**, search for
**Career Compass**, and add it. That's the whole install.

| Where | What you get |
|---|---|
| **claude.ai chat** (web, desktop, mobile) | The skills only. Paste a résumé and a posting, and Claude does the fit check, tailoring, interview prep, or offer review in the conversation. A short Career Compass card carries your roles and dates into your next chat (keep it in a "Job search" Project and every chat there starts from it), and Claude can put your next follow-up on your calendar. |
| **Claude Code** and **Cowork** | The same skills, plus the slash commands below. This version saves nothing between sessions. |

**Want it to remember you?** The full version adds a local server that keeps your career
history and every application as files on your computer. In Claude Code:

```
/plugin marketplace add benskamps/career-compass-mcp
/plugin install career-compass@career-compass
```

It needs **Node.js 22 or newer**. The directory version is skills only because the
directory accepts plugins that run a program on your computer only from verified
organizations.

## Try it now

Just installed it and not sure what to type? Open a new chat and send whichever of these
fits where you are. Each one works on its own in claude.ai chat, Cowork and Claude Code.

**You have a job in mind.** Send this, with your résumé and the posting pasted or attached
underneath (a PDF is fine):

```
Here's my résumé and a job I'm considering. Do I fit this?
```

**You only have your résumé.**

```
Here's my résumé. What roles does it support today, and what would a screener skip?
```

**You have neither at hand.** See a full fit check on a made-up profile first, with nothing
of yours shared:

```
Show me a sample Career Compass fit check.
```

You get the answer first. Then, in claude.ai chat, Claude offers a short Career Compass card
to paste into your next chat; in Claude Code and Cowork it offers to save your résumé so the
next fit check, cover letter, and interview prep start from it.

## It won't make things up

Résumés, cover letters, and interview answers are written from what you've actually done.
When a detail is missing, like a number or a team size, the draft shows a `[confirm: …]`
placeholder for you to fill in instead of inventing one. Offer reviews use only market data
you provide, and say where to find more. How we checked this is
[further down](#measured-not-claimed).

## What else it does

Once the fit check is done, it carries the whole search:

- **Tailor your résumé** to one posting, plus a version laid out for applicant tracking
  systems.
- **Write the cover letter** for a specific role, from your real experience.
- **Prep the interview:** likely questions for that round, three to five STAR stories
  written out in full from your own work, and sharp questions to ask them.
- **Weigh an offer** against your own targets, and get the two or three points worth
  negotiating, with wording.
- **Turn your git history into résumé evidence:** with the full version, ask "Look at
  my project in ~/code/my-app and tell me what I can honestly claim on my résumé." It reads
  that project's git history on your computer, reports what you measurably did there with
  the command behind each number, and asks what the log can't know before drafting a bullet.
- **Handle the rest:** recruiter emails, rejections, interview debriefs, application form
  questions, and working out why final rounds keep slipping away.

The full version also remembers you. Your career history and every
application live as plain YAML files on your own computer. Each fit check reads your whole
record, "prep me for my Veridian final" finds that application with its rounds and
interviewers, and `/career-compass:today` gives you one "start here" move. There is no
cloud sync and no telemetry.

More, with a sample fit check: <https://benskamps.github.io/career-compass-mcp/how-it-works/>

## Commands

These work in Claude Code and Cowork. In claude.ai chat, just ask in plain words
("prep me for my interview on Friday"); the same skills apply.

| Command | What it does |
|---|---|
| `/career-compass:start` | Checks the install and sets up your career history from a pasted résumé, or shows what to try first |
| `/career-compass:fit-check` | A fit verdict for a pasted posting |
| `/career-compass:interview-prep` | Likely questions, STAR stories from your real work, and questions to ask |
| `/career-compass:today` | One "start here" move, then the rest of today's list |
| `/career-compass:debrief` | Right after an interview: what landed, what to sharpen, and a thank-you note per interviewer from your own notes |
| `/career-compass:week` | Your week: what moved, stalled or closed, your pace, and one focus for next week |
| `/career-compass:sweep` | Checks your inbox and calendar (through connectors you already use) for job-search mail and invites, then updates applications in one batch you approve. Never sends email |
| `/career-compass:find` | Finds open roles that match you, ranks the best few against your real history with a link to each, and skips what you already track. Never applies for you |
| `/career-compass:feedback` | Turns something it got wrong into a short report with your personal details taken out, shows you every word, and gives you a link to send it to the maker. Nothing is sent unless you send it |
| `/career-compass:answer` | Answers an application form's questions from your real history, within each character limit |

You can also just ask: "Prep me for my panel interview at Acme on Friday", "I got an offer,
is it good?", or "Run the Career Compass setup check."

## Measured, not claimed

We gave Claude 13 chat tasks for 8 fictional job seekers: fit checks, résumé tailoring,
cover letters, interview prep, an offer, a recruiter email, a rejection, company research,
and "what do I do today". Each task ran three times with Career Compass and three times with
plain Claude, and a strict AI judge checked every reply against that person's résumé.

| | With Career Compass | Plain Claude |
|---|---|---|
| Nothing untrue said about you | **33 of 39** | 23 of 39 |
| Did the job that was asked | **33 of 39** | 16 of 39 |

The judge fails a reply for any claim the résumé doesn't support, including a stronger
verb in a draft ("adopted" becoming "shipped"), a motive you never stated, or a skill
borrowed from the posting. The six misses with Career Compass were of that kind; none
added an employer, a title, a credential or a number. So read the drafts before you send
them, and fill in the `[confirm: …]` spots.
(Career Compass 2.11.2, October 2026. The cases and judge rubrics are in
[eval-src](https://github.com/benskamps/career-compass-mcp/tree/main/eval-src).)

## Tell me what it got wrong

There is no telemetry, so I only hear about a bad fit check if you say so.
[What did your first fit check get wrong?](https://github.com/benskamps/career-compass-mcp/issues/new?template=fit-check-wrong.yml)
is a short form; leave out anything personal. What you used it for, or what was missing,
is welcome in [Discussions](https://github.com/benskamps/career-compass-mcp/discussions).

## Privacy Policy

This version is skills only. It stores nothing and runs no program: what you paste goes to
the Claude client you use, for the requests you make, and nowhere else.

The full version (above) stores your career knowledge base and job pipeline as YAML in
`~/.career-compass/` on your computer and sends that data nowhere on its own. Its server
makes no network requests.

The full policy,
covering collection, storage, sharing, retention, and contact details, is at
<https://benskamps.github.io/career-compass-mcp/privacy>. Questions or concerns:
<https://github.com/benskamps/career-compass-mcp/issues>.

## Where your files live

Nowhere, in this version. With the full version they are in `~/.career-compass/`, as plain
YAML you can open, back up, or delete.

## What this plugin installs

- **Skills** in `skills/`. `career-compass` teaches Claude how to help with any job-search
  task, delivering an answer first. The others are the commands above.
- Nothing else: no MCP server, no `.mcp.json`, and no program that runs on your computer.

## Source

The skills are copied unmodified from
[career-compass-mcp](https://github.com/benskamps/career-compass-mcp) v2.16.0.
`BUNDLE.md` says which commit and how to rebuild it. CI checks every rebuilt bundle with
`claude plugin validate --strict` before opening a pull request.

## License

MIT. See [LICENSE](LICENSE).
