export interface DialogPingMessage {
  type: 'ping'
}

export interface DialogTopicMessage {
  type: 'topic';
  topic: string;
  toc: string;
}

type DialogMessage = DialogPingMessage | DialogTopicMessage;

function isPingMessage (obj: any): obj is DialogMessage {
  return obj?.type === 'ping';
}

function isTopicMessage(obj: any): obj is DialogTopicMessage {
  return obj?.type === 'topic' && typeof obj?.topic === 'string' && typeof obj?.toc === 'string';
}

export default function parseDialogMessage(jsonString: string): DialogMessage | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (isPingMessage(parsed) || isTopicMessage(parsed))
        return parsed;
    console.error('Invalid JSON structure');
    return null;
  } catch (e) {
    console.error('Invalid JSON string');
    return null;
  }
}