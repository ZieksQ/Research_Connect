import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

export default function SortableList() {
  const [items, setItems] = useState(["sort 1", "sort 2", "sort 3"]);
  const sensors = useSensors(useSensor(PointerSensor));

  useState(() => {
    items.map(e => console.log(e));

    
  }, [items])

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        const newOrder = arrayMove(prev, oldIndex, newIndex);
        sendOrderToBackend(newOrder);
        return newOrder;
      });
    }
  };

  const sendOrderToBackend = async (order) => {
    const payload = { order };
    try {
      await fetch("/api/sort-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("✅ Sent new order:", payload);
    } catch (error) {
      console.error("❌ Failed to send order:", error);
    }
  };

  const addNewItem = () => {
    const newItem = `sort ${items.length + 1}`;
    const newList = [...items, newItem];
    setItems(newList);
    sendOrderToBackend(newList);
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <button
        onClick={addNewItem}
        className="mb-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
      >
        ➕ Add Item
      </button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
