import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function SortableForm() {
  const [items, setItems] = useState([]);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: "",
      description: {},
      required: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSubmit = () => {
    console.log(JSON.stringify(items, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Form Builder</h1>
          <p className="text-gray-600">Create and organize your form questions</p>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4 mb-6">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  required={item.required}
                  onChange={handleChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 mb-6">
            <p className="text-gray-500 mb-4">No questions yet. Click below to add your first question.</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button 
            onClick={addItem}
            className="btn btn-primary bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 text-white gap-2 px-6"
          >
            <FaPlus size={14} />
            Add Question
          </button>
          <button 
            onClick={handleSubmit}
            className="btn btn-outline border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 px-6"
          >
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
}