import * as React from 'react';
import { Avatar, Button } from '@fluentui/react-components';
import { Chat, ChatMessage, ChatMyMessage } from '@fluentui-contrib/react-chat';
import { ConversationItem } from '../taskpane';
import {
  BotRegular,
} from "@fluentui/react-icons";      

interface ConversationProps {
  conversation: ConversationItem[]
  handleDraftPPT: () => any
}

interface MessageProps {
  key: number
  item: ConversationItem
  handleDraftPPT?: () => any
}

const ConversationHumanMessage: React.FC<MessageProps> = (mp: MessageProps) => {
  return <ChatMyMessage key={mp.key}>{mp.item.content}</ChatMyMessage>;
}

const ConversationAIMessage: React.FC<MessageProps> = (mp: MessageProps) => {
  return (
    <>
      <ChatMessage
        avatar={
          <Avatar name="AI" badge={{ status: "available" }} icon={<BotRegular />} key={mp.key} />
        }
      >
        {mp.item.content}
        {mp.item.intent === "ppt" && (
          <>
            <br />
            <Button appearance='primary' style={{ marginTop: "5px"}} onClick={mp.handleDraftPPT}>Draft PPT</Button>
          </>
        )}
      </ChatMessage>
    </>
  );
};

export const Conversation: React.FC<ConversationProps> = (props: ConversationProps) => {
  return (
    <Chat>
      <ChatMessage
        avatar={<Avatar name="AI" badge={{ status: "available" }} icon={<BotRegular />} />}
      >
        Hi, I'm Office AI, how can I help you?
      </ChatMessage>
      {props.conversation.length > 0 &&
        props.conversation.map((item, index) => {
          if (item.role === "human") {
            return <ConversationHumanMessage key={index} item={item}></ConversationHumanMessage>;
          }
          return <ConversationAIMessage key={index} item={item} handleDraftPPT={props.handleDraftPPT}></ConversationAIMessage>;
        })}
    </Chat>
  );
};