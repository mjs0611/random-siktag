import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "random-siktag",
  brand: {
    displayName: "랜덤식탁",
    primaryColor: "#FF6B35",
    icon: "",
  },
  permissions: [],
  web: {
    port: 3001,
    commands: {
      dev: "npm run dev",
      build: "npm run build:ait",
    },
  },
  outdir: "out",
  webViewProps: {
    type: "partner",
    bounces: true,
    pullToRefreshEnabled: false,
    allowsBackForwardNavigationGestures: false,
  },
});
