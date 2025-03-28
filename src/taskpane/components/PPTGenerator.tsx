import * as React from "react";
import { useState } from "react";
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown';

/* global HTMLTextAreaElement */

interface TopicInsertionProps {
  generateTOC: (text: string) => Promise<string>;
  generatePPT: (structure: any) => any;
}

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

const PPTGenerator: React.FC<TopicInsertionProps> = (props: TopicInsertionProps) => {
  const [text, setText] = useState<string>("Life insurance");
  const [toc, setToc] = useState<string>("");

  const handleTOCGeneration = async () => {
    setToc("");
    const generatedTOC = await props.generateTOC(text);
    setToc(generatedTOC);
  };

  const handlePPTGeneration = async () => {
    await props.generatePPT(toc);
  };

  const handleTextChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const styles = useStyles();

  const highlightWithTitles = (code) => {
    let highlighted = highlight(code, languages.markdown, "markdown");
    return highlighted;
  };

  return (
    <div className={styles.textPromptAndInsertion}>
      <Field className={styles.textAreaField} size="large" label="What you want to show?">
        <Textarea size="medium" value={text} onChange={handleTextChange} />
      </Field>
      <Button appearance="primary" disabled={false} size="large" onClick={handleTOCGeneration}>
        Generate TOC
      </Button>
      <br />
      {toc && (
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
      )}
      {toc &&
      <Button appearance="primary" disabled={false} size="large" onClick={handlePPTGeneration}>
        Draft PPT
      </Button>
      }
    </div>
  );
};

export default PPTGenerator;
