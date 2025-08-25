import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import fs from "fs";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     https: {
//       key: fs.readFileSync("localhost-key.pem"), // make sure this file exists
//       cert: fs.readFileSync("localhost-cert.pem"), // make sure this file exists
//     },
//     host: "localhost",
//     port: 5173,
//     open: true, // will auto-open browser
//   },
// });
