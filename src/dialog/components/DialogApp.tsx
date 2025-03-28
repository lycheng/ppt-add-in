import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { TextField, PrimaryButton } from "@fluentui/react";
import { Stack } from '@fluentui/react';


interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const DialogApp: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();

  return (
    <div style={{ padding: "20px" }}>
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <div>{props.title}</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Stack>
    </div>
  );
};

export default DialogApp;
