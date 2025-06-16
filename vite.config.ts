import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import fs from "fs";
import archiver from "archiver";

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

        const output = fs.createWriteStream(resolve(__dirname, "dist/firefox.zip"));
        const archive = archiver("zip", {
          zlib: { level: 9 },
        });

        await new Promise((resolve, reject) => {
          output.on("close", () => {
            console.log(`Firefox extension zipped: ${archive.pointer()} total bytes`);
            resolve(true);
          });
          archive.on("error", (err) => {
            reject(err);
          });

          archive.pipe(output);
          const sourcePath = __dirname + "/dist/firefox";
          archive.glob("**/*", {
            cwd: sourcePath,
            dot: true,
          });
          archive.finalize();
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
