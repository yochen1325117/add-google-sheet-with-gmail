import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 部署到 GitHub Pages：網址為 https://<你的帳號>.github.io/<repo名稱>/
// 若 repo 名為 add-google-sheet-with-gmail，base 設為 "/add-google-sheet-with-gmail/"
export default defineConfig({
  plugins: [react()],
  base: "/add-google-sheet-with-gmail/",
});
