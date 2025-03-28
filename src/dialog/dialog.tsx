import * as React from "react";
import DialogApp from "./components/DialogApp";
import { createRoot } from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

/* global document, Office, module, require, HTMLElement */

const title = "Office AI Dialog";

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

/* Render application after Office initializes */
Office.onReady(() => {
  root?.render(
    <FluentProvider theme={webLightTheme}>
      <DialogApp />
    </FluentProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/DialogApp", () => {
    const NextApp = require("./components/DialogApp").default;
    root?.render(NextApp);
  });
}
