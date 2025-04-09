/* global PowerPoint console */
// apiClient.ts
import axios, { AxiosResponse } from 'axios';

export interface TOCPayload {
  topic: string
  toc: string
}

export interface ConversationItem {
  role: string
  content: string
  topic?: string
  toc?: string
}

export async function postChat(items: ConversationItem[]): Promise<ConversationItem[]> {
  try {
    const response = await axios.post('http://localhost:8000/chat', {
      history: items
    });
    return response.data.history;
  } catch (error) {
    console.error('Failed to create user:', error);
    return error;
  }
}

export async function generateTOC(text: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:8000/toc', {
      topic: text
    });
    return response.data.content;
  } catch (error) {
    console.error('Failed to create user:', error);
    return error;
  }
}

async function removeShapes(context: PowerPoint.RequestContext, index: number) {
  const shapes: PowerPoint.ShapeCollection = context.presentation.slides.getItemAt(index).shapes;
  shapes.load("items/$none");
  await context.sync();
  shapes.items.forEach(function (shape) {
    shape.delete();
  });
  await context.sync();
}

async function _addHeader(context: PowerPoint.RequestContext, itemAt: number, text: string, color: string, left: number, top: number, height: number, width: number, fontSize: number) {
  const shapes: PowerPoint.ShapeCollection = context.presentation.slides.getItemAt(itemAt).shapes;
  const textbox: PowerPoint.Shape = shapes.addTextBox(text,
    {
      left: left,
      top: top,
      height: height,
      width: width 
    });
  textbox.name = "Textbox";
  textbox.textFrame.textRange.font.size = fontSize;
  textbox.textFrame.textRange.font.color = color;
  await context.sync();
}

async function addHeader(context: PowerPoint.RequestContext, text: string) {
  await _addHeader(context, 0, text, 'blue', 10, 10, 50, 1000, 40)
}

async function addSubHeader(context: PowerPoint.RequestContext, index: number, text: string): Promise<number> {
  const presentation = context.presentation;
  const slides = presentation.slides;
  slides.add();
  await context.sync();
  index += 1;

  await context.sync()
  await removeShapes(context, index);
  await _addHeader(context, index, text, 'black', 10, 10, 50, 800, 30)
  return index
}

async function addParagraph(context: PowerPoint.RequestContext, itemAt: number, text: string, color: string, bold: boolean, left: number, top: number, height: number, width: number, fontSize: number) {
  const shapes: PowerPoint.ShapeCollection = context.presentation.slides.getItemAt(itemAt).shapes;
  const textbox: PowerPoint.Shape = shapes.addTextBox(text,
    {
      left: left,
      top: top,
      height: height,
      width: width 
    });
  textbox.name = "Textbox";
  textbox.textFrame.textRange.font.size = fontSize;
  textbox.textFrame.textRange.font.color = color;
  textbox.textFrame.textRange.font.bold = bold;
  await context.sync();
}


export async function generatePPT(text: string) {
  var response: AxiosResponse;
  try {
    response = await axios.post('http://localhost:8000/markdown/parse', {
      text: text
    });
  } catch (error) {
    console.error('Failed to generate PPT:', error);
    return error;
  }
  const payload = response.data;
  try {
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      var index = 0;
      var paddingTop = 10;
      for (const item of payload.structure) {
        if (item.level == 1 && item.type == "heading") {
          await removeShapes(context, index);
          await addHeader(context, item.text);
        } else if (item.level == 2 && item.type == "heading") {
          index = await addSubHeader(context, index, item.text);
          paddingTop = 10;
        } else if (item.level == 3 && item.type == "heading") {
          paddingTop = paddingTop + 20 + 18;
          await addParagraph(context, index, item.text, 'black', true, 10, paddingTop, 50, 800, 18);
        } else if (item.type == "paragraph") {
          paddingTop = paddingTop + 20 + 16;
          await addParagraph(context, index, item.text, 'black', false, 10, paddingTop, 50, 800, 16);
        } else if (item.type == "list") {
          paddingTop = paddingTop + 20 + 15;
          for (const child of item.children) {
            await addParagraph(context, index, child.children[0].text, 'blue', false, 10, paddingTop, 50, 800, 14);
            paddingTop = paddingTop + 15;
          }
        }
      }
    });
  } catch (error) {
    console.error("Error: " + error);
  }
  return payload.content;
}