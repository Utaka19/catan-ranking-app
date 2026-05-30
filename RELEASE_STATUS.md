# 現在の公開状況

- Android APK作成済みか: はい
- Android実機確認済みか: はい。Galaxy実機で動作確認済み
- Play Store公開済みか: いいえ
- iOS対応状況: 未対応。現時点ではAndroid個人利用を優先

# EAS情報

- Expoアカウント名: 未記録
- EAS Project名: `shima-logbook` 想定
- EAS Project ID: `e0234103-e9a8-4b5d-a8eb-bef849391f22`
- Android package: `com.kimama.shimanokirokucho`
- 最終ビルド日時: 未記録
- 最終ビルド種別(APK/AAB): APK作成済み。具体的な最終ビルド種別と日時は未記録
- `eas.json` profiles:
  - `preview`: Android APK
  - `production`: Android AAB

# 次回リリース時の手順

1. Expo SDK 56の公式ドキュメントを確認する。
2. `git status` で不要な変更がないことを確認する。
3. `npm run typecheck` を実行する。
4. `npm run lint` を実行する。
5. `npx expo config --type public` で設定を確認する。
6. スプラッシュ画像サイズを調整した場合は、`app.json` と画像表示を確認する。
7. APKを作る場合は `eas build --platform android --profile preview` を実行する。
8. AABを作る場合は `eas build --platform android --profile production` を実行する。
9. Galaxy実機にインストールして以下を確認する。
   - 起動
   - スプラッシュ表示
   - 試合登録
   - 試合編集
   - 試合削除
   - 総合ランキング
   - 期間指定
   - CSVエクスポート
   - 戦績リセット
   - 開拓者名変更
10. APK配布またはPlay Store登録作業を行う。

# リリース前チェックリスト

- スプラッシュ画像が小さすぎない
- 背景が黒くならない
- タブと見出しが被らない
- 縦スクロールできる
- 保存データが壊れない
- CSV形式が変わっていない
- Play Store公開する場合はプライバシー方針を用意する
