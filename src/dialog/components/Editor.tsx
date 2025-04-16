import React, { useState } from "react";
import { Button, Textarea, Card } from "@fluentui/react-components";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Chapter {
  id: string;
  content: string;
}

const SortableChapter = ({ item, onAdd }: { item: Chapter; onAdd: (position: number) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const [content, setContent] = React.useState(item.content);
  // const styles = useStyles();

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: "1px solid #e1dfdd",
    borderRadius: "4px",
    padding: "10px",
    margin: "10px 0",
    boxShadow: "none",
  };

  const dragHandleStyle = {
    cursor: "move",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
  }

  const textAreaStyle = {
    display: "flex",
    "margin-left": "5px"
  }

  return (
      <Card
        ref={setNodeRef}
        className="sortable-item drag-handle"
        style={cardStyle}
      >
        <div style={{display: "flex", "flexDirection": "row"}}>
          <div className="drag-handle" {...attributes} {...listeners} style={dragHandleStyle}>
            ⠿
          </div>
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="输入内容..."
            style={textAreaStyle}
          />
        </div>
        <div className="controls">
          <Button onClick={() => onAdd(1)}>下方添加</Button>
          <Button onClick={() => onAdd(0)}>上方添加</Button>
        </div>
      </Card>
  );
};

export default function Editor() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", content: "1" },
    { id: "2", content: "2" },
    { id: "3", content: "3" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddChapter = (position: number, index: number) => {
    const newItem = {
      id: Date.now().toString(),
      content: "",
    };

    setChapters((items) => [
      ...items.slice(0, index + position),
      newItem,
      ...items.slice(index + position),
    ]);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
        <div className="container">
          {chapters.map((item, index) => (
            <SortableChapter
              key={item.id}
              item={item}
              onAdd={(position) => handleAddChapter(position, index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
