import * as React from "react";
import Header from "./Header";
import { useState } from "react";
// import PPTGenerator from "./PPTGenerator";
// import Dialog from "./Dialog";
import { makeStyles } from "@fluentui/react-components";
import InputPane from "./InputPane";
import { ConversationItem, postChat, generatePPTBase64 } from "../taskpane";
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

  const openDialog = async () => {
    Office.context.ui.displayDialogAsync(
      window.location.origin + "/dialog.html", // 对话框 URL
      {
        height: 60, // 高度百分比（40%）
        width: 60,  // 宽度百分比（30%）
        promptBeforeOpen: false,
      },
      (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          console.error("Dialog open failed:", result.error.message);
          return;
        }
        const dialog = result.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, async (m) => {
          if ("message" in m) {
            const payload = JSON.parse(m.message);
            console.log("dialog message:", m);
            const item: ConversationItem = {
              role: "ai",
              content: `We are going to generate topic: ${payload.topic}`,
            };
            const newConversation = [...conversation, item];
            setConversation(newConversation);
            dialog.close();
            const base64encoded = await generatePPTBase64(payload.toc);
            await PowerPoint.run(async function (context) {
              context.presentation.insertSlidesFromBase64(base64encoded);
              await context.sync();
            });
            const generate_finished_item: ConversationItem = {
              role: "ai",
              content: `We have generated a new PPT`,
            };
            const _newConversation = [...newConversation, generate_finished_item];
            setConversation(_newConversation);
          } else {
            dialog.close();
            console.error("dialog message failed:", m);
          }
        });
      }
    );
  }

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Office AI" />
      <Conversation conversation={conversation}></Conversation>
      <InputPane handleSubmit={handleInputSubmit} openDialog={openDialog}></InputPane>
      {/* <PPTGenerator generateTOC={generateTOC} generatePPT={generatePPT}/> */}
      {/* <Dialog></Dialog> */}
    </div>
  );
};

export default App;
