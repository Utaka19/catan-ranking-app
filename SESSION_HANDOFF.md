# SESSION_HANDOFF
## 1. Project
- App: 島の記録帳
- Version: `1.0.0` in `app.json` / `package.json`; product state is Ver1.3相当.
- Repository: `https://github.com/Utaka19/catan-ranking-app.git`
- Branch: `main`
- Expo project: `shima-logbook` assumed; EAS Project ID `e0234103-e9a8-4b5d-a8eb-bef849391f22`
- Expo account: not documented in repo.
- Stack: Expo SDK 56, React Native 0.85.3, React 19.2.3, Expo Router 56.2.8, TypeScript 6.0.3 strict.
- Storage: local AsyncStorage only; `games` and `players` are separate keys; no Firebase/Supabase/SQLite/login.
- Android: package `com.kimama.shimanokirokucho`; do not change it because update installs depend on it.

## 2. Local Environment
- Node.js: `v22.22.3`
- npm: `10.9.8`
- nvm: command not available in this shell; no `.nvmrc` / `.node-version` found.
- EAS: `eas.json` exists; `preview` builds APK, `production` builds AAB.
- Resume commands:
```bash
nvm use || true
git pull
npm install
npm run web
git status
```

## 3. GitHub / Expo
- GitHub remote account/path: `Utaka19/catan-ranking-app`
- `gh auth status`: tokens invalid for `kimama-dev` and `Utaka19`; re-auth with `gh auth login -h github.com` before using `gh`.
- Push target: `origin main` at `https://github.com/Utaka19/catan-ranking-app.git`
- Latest local state at handoff: `HEAD -> main, origin/main` on `1eed26f`.
- Expo account name: unknown/not recorded.

## 4. Implemented Features
- Fixed 3 players, player rename, match registration/edit/delete, auto rank calculation from points, tied ranks.
- History screen with match titles, ranking screen with period filters, island king card, overall titles.
- Overall ranking uses 3-2-1 rule and Catan total point tie-breaker.
- Settings screen with CSV export, explicit CSV copy button via `expo-clipboard`, reset records.
- AsyncStorage persistence, CSV format `gameId,date,rank,playerId,playerName,point`.
- Light parchment UI, illustration assets, app icon, splash image, adaptive icon, EAS Android profiles.

## 5. Recent Commits
- `1eed26f` style: スプラッシュ画像サイズを調整
- `9d787c9` style: 総合ランキングの点数表示を調整
- `78f3139` style: 総合ランキングカードをコンパクト表示に戻す
- `71ee0b2` style: 総合ランキングカードのレイアウトを調整
- `213e00d` feat: 総合ランキングを3-2-1点方式に変更
- `b143887` fix: CSVコピー機能を追加
- `40bd105` docs: プロジェクト状況を整理
- `2f59e2b` style: イラスト画像の余白を調整
- `5859da3` style: イラストサイズと履歴称号表示を調整
- `05f5a1b` style: イラストUIの表示を微調整

## 6. Current UI
- Home: island hero, period selector, island king card, compact overall ranking, match form.
- Overall ranking: left rank badge, center name/title/scores, right 3-column place counts.
- Score display is two lines: `総合点：N点` and `カタン合計点：N点`.
- History: map hero, newest-first matches, edit/delete, match titles unchanged.
- Settings: journal hero, player names, CSV export, `📋 CSVをコピー`, reset.
- Splash: `assets/images/splash-icon.png`; Android `imageWidth` changed from `76` to `220`; background `#F1DDB3`.

## 7. Ranking Rules
- Per match: rank 1 = 3 overall points, rank 2 = 2, rank 3 = 1.
- Tied rank receives the same overall points, e.g. A 10pt rank1 => 3, B/C 8pt rank2 => 2 each.
- Ranking order: higher overall score, then higher Catan total points, then same display rank.
- Island king is display rank 1 under this same order; ties show island king candidates.
- Overall titles/images derive from display rank and tie state; match history titles derive from per-match rank/points.

## 8. Android Distribution
- EAS Build configured; `preview` APK and `production` AAB.
- APK has been built before and Galaxy実機確認済み.
- Latest splash `imageWidth: 220` change requires a new APK build to verify on device.
- Play Store: not published; iOS not targeted.

## 9. Known Issues / Doc Mismatches
- Unresolved: latest splash size has not yet been verified on Galaxy after rebuilding APK.
- Docs mismatch: `NEXT_TASK.md`, `PROJECT_SUMMARY.md`, `RELEASE_STATUS.md`, and `AGENTS.md` still mention splash size as pending/known issue, but `app.json` was updated in `1eed26f`; update docs after real-device verification.
- Expo account name and latest EAS build timestamp are still undocumented.

## 10. Recommended Next Tasks
- P1, 30-60m: Build APK with `npx eas build --platform android --profile preview`, install on Galaxy, verify splash size.
- P2, 15-30m: Update docs after Galaxy splash verification and record latest EAS build timestamp/account.
- P3, 1-2h: Real-use QA for registration/edit/delete/reset/CSV/copy/ranking/period filters.
- P4, 1-2h: Add simple AsyncStorage backup guidance before reinstall.
- P5, 2-4h+: Prepare Play Store listing/privacy notes only if publishing becomes necessary.

## 11. New Session Resume Checklist
1. `nvm use || true`
2. `git pull`
3. `npm install`
4. `npm run web`
5. `git status`
6. Read `AGENTS.md`
7. Read `NEXT_TASK.md`
8. Read `SESSION_HANDOFF.md`

## 12. Current Git
- Branch/status before this file: `main`, clean.
- Latest commit before this handoff doc: `1eed26f style: スプラッシュ画像サイズを調整`
- Push status from local refs: `HEAD -> main, origin/main`; verify remote after `gh` re-auth if needed.
