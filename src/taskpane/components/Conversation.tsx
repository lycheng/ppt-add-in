import * as React from 'react';
import { Avatar } from '@fluentui/react-components';
import { Chat, ChatMessage, ChatMyMessage } from '@fluentui-contrib/react-chat';
import { ConversationItem } from '../taskpane';
import {
  BotRegular,
} from "@fluentui/react-icons";      

interface ConversationProps {
  conversation: ConversationItem[]
}

export const Conversation: React.FC<ConversationProps> = (props: ConversationProps) => {
  return (
    <Chat>
      <ChatMessage
        avatar={<Avatar name="AI" badge={{ status: "available" }} icon={<BotRegular />} />}
      >
        Hi, I'm Office AI, how can I help you?
      </ChatMessage>
      {props.conversation.length > 0 &&
        props.conversation.map((item) => {
          if (item.role === "human") {
            return <ChatMyMessage>{item.content}</ChatMyMessage>;
          }
          return (
            <ChatMessage
              avatar={<Avatar name="AI" badge={{ status: "available" }} icon={<BotRegular />} />}
            >
              {item.content}
            </ChatMessage>
          );
        })}
    </Chat>
  );
};