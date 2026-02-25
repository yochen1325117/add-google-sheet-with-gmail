# 公司網域限定投票（純前端）

Vite + React + TypeScript + TailwindCSS 建置的投票前端，以 Email 輸入識別投票者、網域限制、多獎項多選（可搜尋、跨獎項去重），並將結果 POST 到 Google Form。

## 功能摘要

- 輸入公司 Email 作為投票識別（僅允許指定網域，如 `@company.com`）
- 非允許網域顯示拒絕訊息並可重新輸入
- 6 個獎項，每獎項可選 1～3 位參賽者，可搜尋、跨獎項不可重複選擇
- 送出至 Google Form（`application/x-www-form-urlencoded`），成功後寫入 localStorage 並顯示完成頁，可「再投一次」

## 環境需求

- Node.js 18+
- npm 或 yarn

## 安裝與啟動

```bash
npm install
npm run dev
```

瀏覽器開啟 http://localhost:5173

## 設定說明

### 1. 允許的網域

在 `src/config.ts` 修改：

```ts
export const ALLOWED_DOMAIN = "@company.com";
```

改為貴公司網域，例如 `@mycompany.com`。使用者輸入的 Email 須以此網域結尾才能投票。

### 2. Google 表單與試算表（讓使用者可提交）

**完整步驟**請看 **[docs/GOOGLE_FORM_SETUP.md](docs/GOOGLE_FORM_SETUP.md)**，包含：

- 如何用「表單 + 連結試算表」讓提交寫入你的 Google Sheet
- 表單要建 21 題（Email、員工編號、提交時間、18 個獎項名次）及對應關係
- 如何取得 Form ID 與每題的 entry id
- 如何填寫 `src/config.ts` 的 `FORM.id` 與 `FORM.entry`

以下為簡要說明。

#### 取得 Form ID

1. 開啟你的 Google 表單 → **傳送** → **連結** 複製網址  
   格式：`https://docs.google.com/forms/d/e/**FORM_ID**/viewform`
2. 中間的 `FORM_ID` 即為表單 ID，填進 `src/config.ts` 的 `FORM.id`。

#### 取得各題目的 entry id（欄位 ID）

**方法 A：預填連結**

1. 在表單中每一題先隨便選一個選項或輸入一個值
2. 點 **傳送** → **連結** 右側 **三個點** → **取得預填連結**
3. 複製網址，格式類似：  
   `https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.123456=預填值&entry.789012=預填值`
4. 網址中的 `entry.123456`、`entry.789012` 等即為各題的 entry id，對應到你的題目（email、時間、award1～award6 等）

**方法 B：檢視網頁原始碼**

1. 開啟表單的「預覽」頁（表單的檢視畫面）
2. 在頁面上 **右鍵 → 檢視網頁原始碼**（或 Ctrl+U / Cmd+Option+U）
3. 搜尋 `entry.`，會看到許多 `name="entry.xxxxx"` 或 `id="entry.xxxxx"` 的 input
4. 依題目順序或旁邊的 label 對應到你的欄位（email、submittedAt、award1～award6）

在 `src/config.ts` 的 `FORM.entry` 填入：

```ts
export const FORM = {
  id: "你的_FORM_ID",
  action: (id: string) => `https://docs.google.com/forms/d/e/${id}/formResponse`,
  entry: {
    email: "entry.123",      // 對應表單「Email」題
    submittedAt: "entry.456", // 對應表單「提交時間」題
    award1: "entry.111",
    award2: "entry.222",
    award3: "entry.333",
    award4: "entry.444",
    award5: "entry.555",
    award6: "entry.666",
  },
};
```

表單內請預先建立與上述欄位對應的題目（短答或段落皆可），以便接收 email、時間與六個獎項的答案。

## 部署到 GitHub Pages

1. 在 GitHub 建立 repo，將專案 push 上去。

2. 若 repo 名為 `company-domain-voting`，修改 `vite.config.ts`：
   ```ts
   export default defineConfig({
     plugins: [react()],
     base: "/company-domain-voting/",  // 改成你的 repo 名稱
   });
   ```

3. 建置：
   ```bash
   npm run build
   ```
   產出在 `dist/`。

4. 部署 `dist/` 內容：
   - **GitHub Actions**（建議）：專案已含 `.github/workflows/deploy.yml`。push 到 `main` 即會自動建置並部署。記得在 `vite.config.ts` 將 `base` 設為 `"/你的repo名稱/"`。
   - 或手動：另開一個 branch（如 `gh-pages`），把 `dist/` 內容複製到根目錄後 push，在 repo **Settings → Pages** 選擇該 branch 的根目錄。

5. 完成後網址為：  
   `https://你的帳號.github.io/company-domain-voting/`（依你的 base 與 repo 名稱而定）

## 專案結構（重點）

- `src/config.ts` — FORM_ID、entry 對應、ALLOWED_DOMAIN
- `src/data/candidates.ts` — 參賽者名單（可擴充至 100 人）
- `src/data/awards.ts` — 6 個獎項定義（id、title、min、max）
- `src/lib/formSubmit.ts` — 以 `application/x-www-form-urlencoded` POST 到 Google Form
- `src/lib/validation.ts` — 跨獎項去重、每獎項數量檢查
- `src/components/` — AwardCard、CandidateMultiSelect、DoneCard、RejectedCard

## 建置與預覽

```bash
npm run build   # 輸出至 dist/
npm run preview # 本地預覽 dist/
```

## 授權

可依需求自訂。
