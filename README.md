# Leonida Platinum — GTA VI Trophy Guide & Tracker

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI:
1 platinum, 2 gold, 6 silver, 46 bronze. Every trophy is shown with its official
name, description and grade as PlayStation publishes them, plus a guide written in
our own words that cites its sources.

## What it does

- **Checklist** — tick trophies off; progress is saved in the browser (localStorage)
  and can be exported to a file and imported back. Per-trophy notes, too.
- **Filters** — search, kind (story / missable & watch list / collectibles /
  activities), grade, and unearned-only.
- **Spoiler setting** — hides the names and descriptions of the 28 hidden story
  trophies until they are earned.
- **Roadmap** — six stages to the platinum, in the order to play them, built from
  the official descriptions.
- **Missables** — the one trophy reported as possibly missable (*Positive Mental
  Attitude*), plus a watch list of one-shot moments that are not confirmed missable.
- **Planner** — your next unearned trophies in roadmap order.
- **Themes** — light and dark, saved in the browser.

## Honesty note

The game released 19 November 2026 and no complete walkthrough exists yet. The
guides are built from the official trophy descriptions, and where a place or step
is not yet verified in-game, the guide says so plainly instead of inventing it.
Sources are cited beside every trophy: Exophase's trophy list and PSNProfiles,
with GGRecon for the missable report.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

Any static file server works too — serve `app/` and open `index.html`. The app
makes no network requests and works with the network off.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`.

## License

MIT — see `LICENSE`. This is an unofficial fan guide, not affiliated with
Rockstar Games. No Rockstar logo, artwork or game screenshots are used.
