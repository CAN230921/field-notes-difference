# Field Notes

[![make.fun spot-the-difference bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/CAN230921/field-notes-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/CAN230921/field-notes-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Compare a pair of illustrated plates at three field stations. Find 24 differences
across the coast, glasshouse, and observatory. Play against the clock or switch to
untimed mode without losing your marks.

## Play

Serve the `game/` directory with any static server, for example:

```sh
python3 -m http.server 8080 --directory game
```

Open http://localhost:8080. The game is self-contained and requires no downloads.

- Click either plate to mark a difference. Both plates show the mark.
- Tab to a plate, use the arrows to aim, and press Enter or Space to mark.
  Hold Shift for finer aim.
- Z toggles the synchronized 2× inspection window. Aim with the pointer or
  arrows to see the same detail in both plates.
- H uses one of your two hints per station. P pauses. Timed mode adds a
  four-second penalty for misses and a six-second penalty for hints.

## Build the make.fun output

Requires Node 22.18 or later.

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The screenshots were captured during real play. All illustrations are drawn
locally in Canvas and the optional chimes are synthesized in Web Audio.
