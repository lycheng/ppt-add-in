
import * as React from "react";
import { Button, tokens, makeStyles } from "@fluentui/react-components";

/* global HTMLTextAreaElement */

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "5px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "20px",
    maxWidth: "80%",
  },
});

const Dialog = () => {

  const jumpToDialog = async () => {
    Office.context.ui.displayDialogAsync(
      window.location.origin + "/dialog.html", // 对话框 URL
      {
        height: 40, // 高度百分比（40%）
        width: 30,  // 宽度百分比（30%）
        promptBeforeOpen: false,
      },
      (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          console.error("Dialog 打开失败:", result.error.message);
        } else {
          const dialog = result.value;
          // 监听 Dialog 返回的消息
          dialog.addEventHandler(Office.EventType.DialogMessageReceived, (message) => {
            console.log("收到 Dialog 数据:", message);
            // 在这里处理数据（例如更新 PPT）
            dialog.close();
          });
        }
      }
    );
  };

  const styles = useStyles();
  return (
    <div className={styles.textPromptAndInsertion}>
      <Button appearance="primary" disabled={false} size="large" onClick={jumpToDialog}>
        Dialog
      </Button>
    </div>
  );
};

export default Dialog;
