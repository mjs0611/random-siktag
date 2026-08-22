import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "random-siktag",

  brand: {
    primaryColor: "#3182F6"
  },

  permissions: [],
  webBundleDir: "out",

  webView: {
    bounces: true,
    pullToRefreshEnabled: false,
    allowsBackForwardNavigationGestures: false
  }
});
