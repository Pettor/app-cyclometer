import { createBaseConfig, createPWAConfig, createReactConfig, mergeConfigs } from "@config/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, mergeConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = mergeConfigs([
    createBaseConfig(),
    createReactConfig({ enableReactCompiler: command === "build" }),
    createPWAConfig(),
    {
      plugins: [tanstackRouter({ routeToken: "route" })],
    },
    { resolve: { dedupe: ["react", "react-dom"] } },
  ]);

  switch (command) {
    case "build":
      return mergeConfig(config, {
        base: "./",
        build: {
          commonjsOptions: {
            exclude: ["@faker-js/faker"],
          },
        },
      });
    case "serve":
      return mergeConfig(config, {
        server: {
          cors: true,
          // basicSsl() below provides the self-signed cert; https: true signals intent
          https: true,
          port: 5113,
        },
        plugins: [basicSsl()],
      });
  }
});
