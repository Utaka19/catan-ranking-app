# 現在の状況

- 「島の記録帳」はVer1.3相当まで実装済み。
- `app.json` / `package.json` のアプリバージョンは `1.0.0`。
- Android APK作成済み。
- Galaxy実機で動作確認済み。
- Expo EAS Build導入済み。
- 羊皮紙風UI、イラストUI、島王エンブレム、3-2-1点方式の総合ランキング、CSV出力まで実装済み。
- 保存はAsyncStorageのみ。Firebase / Supabase / SQLite / ログインなし。

# 次回やること

- スプラッシュ画像サイズを調整する。
- Galaxy実機で継続利用し、入力しにくい箇所や見づらい箇所を洗い出す。
- Play Store公開が必要になった場合の準備を始める。

# 優先度

## P1

- スプラッシュ画像サイズ調整
- APK再ビルド前の `npx expo config --type public` 確認
- Android実機でスプラッシュ表示確認

## P2

- 実利用フィードバック反映
- 試合登録 / 編集 / 削除 / リセット / CSV出力の再確認
- イラストUIの視認性チェック

## P3

- Play Store公開準備
- ストア用説明文、スクリーンショット、プライバシー方針の整理
- 不要なスターター画像の棚卸し

# 想定作業時間

- P1: 30〜60分
- P2: 1〜2時間
- P3: 2〜4時間以上

# 修正対象ファイル

- スプラッシュ調整:
  - `assets/images/splash-icon.png`
  - `app.json`
- 実利用フィードバック反映:
  - `src/app/index.tsx`
  - `src/app/explore.tsx`
  - `src/app/settings.tsx`
  - `src/components/*`
  - `src/utils/*`
- Play Store準備:
  - `app.json`
  - `eas.json`
  - 必要に応じて新規ドキュメント

# 注意事項

- Expo SDK 56の正確なバージョンドキュメントを確認してから実装すること。
- 既存の `games` / `players` 保存形式を壊さないこと。
- 試合結果には `playerName` を保存しない。表示時に `playerId` から現在名を参照する。
- 称号や画像選択は保存しない。表示時に計算する。
- 総合ランキングは保存形式を変えず、rank 1=3点 / rank 2=2点 / rank 3=1点で再計算する。
- 総合点が同点の場合はカタン合計点で判定する。
- CSV形式は `gameId,date,rank,playerId,playerName,point` のまま維持する。
- Androidアップデート時のデータ引き継ぎのため、`app.json` の `android.package` は変更しない。
- Play Store公開は未実施。pushも行わない。

# メモ

- Android package: `com.kimama.shimanokirokucho`
- EAS project ID: `e0234103-e9a8-4b5d-a8eb-bef849391f22`
- `eas.json` の `preview` はAPK、`production` はAAB。
- スプラッシュ背景色は `#F1DDB3`。
- 既知の問題はスプラッシュ画像が小さいこと。

# Codexへ次回投げる推奨プロンプト

あなたはReact Native / Expo / TypeScriptに精通したシニアエンジニアです。

「島の記録帳」の次回作業として、スプラッシュ画像サイズ調整を行ってください。

前提:
- Expo SDK 56
- React Native 0.85.3
- Expo Router
- Android APK作成済み
- Galaxy実機確認済み
- 既知の問題: スプラッシュ画像が小さい

作業内容:
- Expo SDK 56の公式ドキュメントを確認する
- `app.json` の `expo-splash-screen` 設定を確認する
- `assets/images/splash-icon.png` のサイズや余白を確認する
- Androidで自然に見えるスプラッシュサイズへ調整する
- `npm run typecheck`
- `npm run lint`
- `npx expo config --type public`
- 必要なら `npm run web`
- 問題なければコミットする

制約:
- 既存機能、保存形式、CSV形式は変更しない
- pushはしない
