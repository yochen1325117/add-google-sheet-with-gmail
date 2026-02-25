import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// 部署到 GitHub Pages 時，若 repo 名為 company-domain-voting，改為 base: "/company-domain-voting/"
export default defineConfig({
    plugins: [react()],
    base: "/",
});
