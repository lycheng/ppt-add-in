import React from 'react';
import { Textarea, Button, tokens } from '@fluentui/react-components';
import { Stack } from '@fluentui/react';

interface InputPaneProps {
    handleSubmit: (text: string) => Promise<any>;
    openPPTGenerateDialog: () => void;
}


const InputPane: React.FC<InputPaneProps> = (props: InputPaneProps) => {
  const [inputValue, setValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const conClickSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsSubmitting(true);
    console.log("Submitting:", inputValue);

    await props.handleSubmit(inputValue);
    setIsSubmitting(false);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      conClickSubmit();
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "16px",
        backgroundColor: "white",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <Stack verticalAlign="end" style={{ rowGap: tokens.spacingVerticalS }}>
        <Textarea
          placeholder="Type your message here..."
          resize="vertical"
          style={{
            flex: 1,
            minHeight: "40px",
            maxHeight: "100px",
          }}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          value={inputValue}
          onChange={(e) => setValue(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Button
            appearance="primary"
            style={{
              width: "120px", // 固定宽度
              height: "36px", // 固定高度(可选)
              marginRight: "5px"
            }}
            onClick={conClickSubmit}
            disabled={!inputValue.trim() || isSubmitting}
            icon={isSubmitting ? { children: "⏳" } : undefined}
          >
            {isSubmitting ? "Sending..." : "Enter"}
          </Button>
          <Button
            appearance="secondary"
            style={{
              width: "120px", // 固定宽度
              height: "36px", // 固定高度(可选)
            }}
            onClick={props.openPPTGenerateDialog}
          >
            Generate PPT
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default InputPane;