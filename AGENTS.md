# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Current Project Status

### Version

- App name: 島の記録帳
- Product state: Ver1.3 equivalent
- Expo app version: `1.0.0` in `app.json` / `package.json`
- Current date of this status: 2026-05-30

### App Overview

「島の記録帳」は、兄弟3人で遊ぶカタン風ボードゲームの戦績をローカルに記録するAndroid向けMVPアプリ。
試合後に3人分のポイントを入力すると順位を自動判定し、履歴・総合ランキング・称号・CSV出力へ反映する。
公式名称・公式ロゴ・公式画像は使わず、開拓、島、地図、羊皮紙、冒険手帳の雰囲気だけを取り入れている。

### Implemented Features

- 固定3人の開拓者管理
- 開拓者名変更
- 試合登録
- ポイント入力による順位自動判定
- 同順位対応
- 試合履歴表示
- 試合編集
- 試合削除
- 総合ランキング
- 全期間 / 今月 / 先月 / 任意期間のランキング集計
- 現在の島王カード
- 総合ランキング称号
- 試合履歴称号
- 順位バッジ色分け
- 戦績リセット
- CSVエクスポート
- AsyncStorageによるローカル保存
- Expo Routerの3タブ構成
- Android APK向けEAS設定
- アプリアイコン / スプラッシュ / adaptive icon設定
- イラスト素材を使った羊皮紙風UI

### Design Direction

- 淡い羊皮紙・砂色を基調にする
- カードUI中心
- 見出しと本文は濃いブラウン系で読みやすさ優先
- アクセントは深緑、レンガ色、麦色、金・銀・銅系
- 画像は装飾として控えめに使い、順位・点数・名前の可読性を優先
- Web / Androidの両方で背景が黒くならないよう light theme 固定

### Image Assets In Use

- App icon: `assets/images/icon.png`
- Splash image: `assets/images/splash-icon.png`
- Android adaptive icon: `assets/images/adaptive-icon.png`
- Header illustration for record tab: `assets/images/illustrations/header-island.png`
- Header illustration for history tab: `assets/images/illustrations/header-map.png`
- Header illustration for settings tab: `assets/images/illustrations/header-journal.png`
- Island king emblem: `assets/images/illustrations/island-king-emblem.png`
- Ranking crown icon: `assets/images/illustrations/ranking-crown.png`
- Ranking battle icon: `assets/images/illustrations/ranking-battle.png`
- Ranking shield icon: `assets/images/illustrations/ranking-shield.png`
- Ranking settlement icon: `assets/images/illustrations/ranking-settlement.png`
- Ranking sheep icon: `assets/images/illustrations/ranking-sheep.png`

### Screen Structure

- `src/app/index.tsx`: 戦績画面
  - ヒーローカード
  - 期間指定
  - 現在の島王カード
  - 総合ランキング
  - 試合結果登録
- `src/app/explore.tsx`: 履歴画面
  - ヒーローカード
  - 試合履歴
  - 試合編集
  - 試合削除
- `src/app/settings.tsx`: 設定画面
  - ヒーローカード
  - 開拓者名変更
  - CSVエクスポート
  - 戦績リセット

### Saved Data Structure

Storage is local only via AsyncStorage.

- Players are stored separately under the players storage key.
- Games are stored separately under the games storage key.
- Player count is fixed at 3.
- `playerId` is stable and never changes when names are edited.
- Game results store `playerId`, `rank`, and `points`; they do not store `playerName`.
- Display names are resolved from current players at render time.
- Titles and illustration choices are computed at render time and are not saved.
- CSV export format remains:
  - `gameId,date,rank,playerId,playerName,point`

### Technology

- Expo SDK 56
- React Native 0.85.3
- React 19.2.3
- Expo Router 56.2.8
- TypeScript 6.0.3
- TypeScript strict mode
- AsyncStorage 2.2.0
- ESLint via `expo lint`
- EAS Build configured

### Android Status

- Android package: `com.kimama.shimanokirokucho`
- APK build profile exists in `eas.json` as `preview`
- Android APK has been built
- Galaxy実機で動作確認済み
- Store公開は未実施

### EAS Build Status

- `eas.json` exists
- `preview` profile builds APK
- `production` profile builds AAB
- EAS project ID in `app.json`: `e0234103-e9a8-4b5d-a8eb-bef849391f22`
- Expo account name is not documented in the repository
- Latest build timestamp is not documented in the repository

### Release Status

- Current release state: local APK distribution / test use
- Play Store release: not published
- iOS release: not targeted

### Known Issues

- Splash image appears too small and should be resized or regenerated before the next APK build.
- Some starter assets remain in `assets/images`; do not delete unless intentionally cleaning the starter project.
- Future EAS metadata such as Expo account name and latest build timestamp should be recorded after the next build.

### Future Improvement Candidates

- P1: Adjust splash image size.
- P2: Reflect real-use feedback from Galaxy testing.
- P3: Prepare Play Store listing assets and privacy/data safety notes if store release becomes necessary.
- Add CSV import only if backup/restore becomes necessary.
- Add simple backup guidance for AsyncStorage data before app reinstall.
- Consider reducing unused starter assets after release packaging is stable.
