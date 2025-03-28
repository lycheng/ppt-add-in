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

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Office AI" />
      <Conversation conversation={conversation}></Conversation>
      <InputPane handleSubmit={handleInputSubmit}></InputPane>
      {/* <PPTGenerator generateTOC={generateTOC} generatePPT={generatePPT}/> */}
      {/* <Dialog></Dialog> */}
    </div>
  );
};

export default App;
