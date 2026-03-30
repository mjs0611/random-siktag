import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "random-siktag",
  brand: {
    displayName: "랜덤식탁",
    primaryColor: "#3182F6",
    icon: "https://static.toss.im/appsintoss/27829/c5d3b049-ac79-4812-bd00-fdeee121f5cf.png",
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
