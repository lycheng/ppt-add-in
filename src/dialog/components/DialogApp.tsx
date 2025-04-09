import * as React from "react";
import { Input, Button, makeStyles, useId } from "@fluentui/react-components";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown';
import { generateTOC } from "../dialog";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: '20px',
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  editorContainer: {
    width: "80%"
  }
});

const DialogApp = () => {
  const styles = useStyles();
  const [topic, setTopic] = React.useState("");
  const [toc, setToc] = React.useState<string>("");


  const handleTopicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const clickGenerateTOC = async () => {
    if (!topic.trim()) return;

    const newToc = await generateTOC(topic);
    setToc(newToc);
  }

  const clickConfirmTOC = async () => {
    if (!toc.trim()) return;

    Office.context.ui.messageParent(JSON.stringify({
      topic: topic,
      toc: toc
    }));
  }

  const highlightWithTitles = (code) => {
    let highlighted = highlight(code, languages.markdown, "markdown");
    return highlighted;
  };

  return (
    <div className={styles.root}>
      <div className={styles.inputGroup}>
        <Input
          placeholder="Enter the topic you want to generate a new PPT"
          size="medium"
          style={{ width: "400px" }}
          value={topic}
          onChange={handleTopicChange}
        />
        <Button appearance="primary" onClick={clickGenerateTOC}>
          Generate
        </Button>
      </div>
      <div className={styles.editorContainer}>
        {toc && (
          <div>
            <Editor
              value={toc}
              onValueChange={setToc}
              highlight={highlightWithTitles}
              padding={10}
              style={{
                backgroundColor: "#f5f5f5",
                minHeight: "300px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              textareaClassName="editor-textarea"
              preClassName="language-markdown"
            />
            <Button appearance="primary" onClick={clickConfirmTOC} style={{paddingTop: "5px"}}>
              Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogApp;
