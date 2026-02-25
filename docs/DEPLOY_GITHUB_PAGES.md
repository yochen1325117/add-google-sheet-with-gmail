# 發佈至 GitHub Pages

## 一、發佈前確認

1. **`vite.config.ts` 的 `base`**  
   必須是 `"/你的repo名稱/"`，且結尾要有 `/`。  
   例如 repo 名為 `add-google-sheet-with-gmail`，則：
   ```ts
   base: "/add-google-sheet-with-gmail/",
   ```
   若 repo 名稱不同，請改成你的名稱。

2. **本機先建置一次**  
   ```bash
   npm run build
   npm run preview
   ```  
   用預覽確認畫面與送出都正常。

---

## 二、推上 GitHub 並啟用 Pages

1. **建立 repo 並 push**
   ```bash
   git remote add origin https://github.com/<你的帳號>/<repo名稱>.git
   git branch -M main
   git push -u origin main
   ```

2. **啟用 GitHub Pages（用 Actions 部署）**
   - 進 repo → **Settings** → 左側 **Pages**。
   - **Build and deployment** 底下 **Source** 選 **GitHub Actions**。
   - 儲存後不用再改，之後都由 workflow 部署。

3. **等 workflow 跑完**
   - 推上 `main` 後會自動觸發 `.github/workflows/deploy.yml`。
   - 到 **Actions** 分頁看「Deploy to GitHub Pages」是否成功。
   - 成功後約 1～2 分鐘可開網址。

---

## 三、網站網址

- 格式：`https://<你的帳號>.github.io/<repo名稱>/`
- 例如：`https://yochen.github.io/add-google-sheet-with-gmail/`

---

## 四、若 repo 名稱之後有改

記得同步改 `vite.config.ts` 的 `base`，再 push 到 `main`，讓 workflow 重新建置部署。
