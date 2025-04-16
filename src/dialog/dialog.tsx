import * as React from "react";
import Dialog from "./components/Dialog";
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
      <Dialog />
    </FluentProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/Dialog", () => {
    const NextApp = require("./components/Dialog").default;
    root?.render(NextApp);
  });
}
