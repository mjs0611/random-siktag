import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "random-siktag",

  brand: {
    primaryColor: "#1B64DA"
  },

  permissions: [],
  webBundleDir: "out",

  webView: {
    bounces: true,
    pullToRefreshEnabled: false,
    allowsBackForwardNavigationGestures: false
  }
});
