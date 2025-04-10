import * as React from "react";
import { Input, Button, makeStyles, Spinner } from "@fluentui/react-components";
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
    alignItems: "center" // Add this to align spinner with button
  },
  editorContainer: {
    width: "80%"
  }
});

const DialogApp = () => {
  const styles = useStyles();
  const [topic, setTopic] = React.useState("");
  const [toc, setToc] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState(false); // New state for loading

  const handleTopicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const clickGenerateTOC = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true); // Start loading
    try {
      const newToc = await generateTOC(topic);
      setToc(newToc);
    } finally {
      setIsGenerating(false); // Stop loading regardless of success/failure
    }
  };

  const clickConfirmTOC = async () => {
    if (!toc.trim()) return;

    Office.context.ui.messageParent(JSON.stringify({
      type: "topic",
      topic: topic,
      toc: toc
    }));
  }

  const clickPing = () => {
    Office.context.ui.messageParent(JSON.stringify({
      type: "ping",
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
        <Button
          appearance="primary"
          onClick={clickGenerateTOC}
          disabled={isGenerating} // Disable button while loading
        >
          {isGenerating ? (
            <>
              <Spinner size="tiny" style={{ marginRight: "8px" }} />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
        <Button appearance="secondary" onClick={clickPing} disabled={isGenerating}>Ping</Button>
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
            <Button appearance="primary" onClick={clickConfirmTOC} style={{ marginTop: "5px" }}>
              Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogApp;
