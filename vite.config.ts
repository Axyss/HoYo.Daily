import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const browser = process.env.BROWSER || "chrome";

// Helper function to copy browser-specific files
function copyBrowserFiles() {
  return {
    name: "copy-browser-files",
    closeBundle: async function () {
      // Determines which manifest to use
      const manifestSource =
        browser === "firefox" ? "manifest.firefox.json" : "manifest.chrome.json";

      const outDir = resolve(__dirname, `dist/${browser}`);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      fs.copyFileSync(
        resolve(__dirname, `public/${manifestSource}`),
        resolve(outDir, "manifest.json"),
      );
      ["icon16.png", "icon32.png", "icon48.png", "icon128.png"].forEach((icon) => {
        fs.copyFileSync(resolve(__dirname, `public/${icon}`), resolve(outDir, icon));
      });

      console.log(`Built ${browser} extension in dist/${browser}/`);

      if (browser === "firefox") {
        const zipFilePath = resolve(__dirname, `dist/firefox-extension.zip`);
        if (fs.existsSync(zipFilePath)) {
          fs.unlinkSync(zipFilePath);
        }

        await execAsync(`tar -acf dist/firefox.zip -C dist/firefox .`, {
          cwd: resolve(__dirname),
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), copyBrowserFiles()],
  build: {
    outDir: `dist/${browser}`,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        app: "index.html",
        background: "src/scripts/background.ts",
      },
      output: {
        entryFileNames: ({ name }) => {
          return name === "background" ? "background.js" : "assets/[name].js";
        },
      },
    },
    copyPublicDir: false,
  },
});
