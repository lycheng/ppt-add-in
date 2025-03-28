import * as React from "react";
import Header from "./Header";
import { useState } from "react";
// import PPTGenerator from "./PPTGenerator";
// import Dialog from "./Dialog";
import { makeStyles } from "@fluentui/react-components";
import InputPane from "./InputPane";
import { ConversationItem, postChat } from "../taskpane";
import { Conversation } from "./Conversation";
// import { generatePPT, generateTOC } from "../taskpane";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const styles = useStyles();

  const handleInputSubmit = async (text: string) => {
    const item: ConversationItem = {
      role: "human",
      content: text
    };
    const newConversation = [...conversation, item];
    setConversation(await postChat(newConversation));
    console.log(conversation);
  }

  const openPPTGenerateDialog = async () => {
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
  }

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Office AI" />
      <Conversation conversation={conversation}></Conversation>
      <InputPane handleSubmit={handleInputSubmit} openPPTGenerateDialog={openPPTGenerateDialog}></InputPane>
      {/* <PPTGenerator generateTOC={generateTOC} generatePPT={generatePPT}/> */}
      {/* <Dialog></Dialog> */}
    </div>
  );
};

export default App;
