import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
      questionType: "none",
      choices: [],
      minChoices: 1,
      maxChoices: null,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:flex lg:gap-8 lg:py-12">
        {/* Main Content */}
        <div className="mx-auto w-full max-w-2xl pb-32 lg:pb-8">
          <div className="mb-8">
            <h1 className="mb-1 text-3xl font-bold tracking-tight text-gray-900">
              Form Builder
            </h1>
            <p className="text-gray-500">
              Create and organize your questions
            </p>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    required={item.required}
                    questionType={item.questionType}
                    choices={item.choices}
                    minChoices={item.minChoices}
                    maxChoices={item.maxChoices}
                    onChange={handleChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {items.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
              <div className="mx-auto max-w-sm">
                <p className="mb-1 text-lg font-medium text-gray-900">
                  No questions yet
                </p>
                <p className="text-sm text-gray-500">
                  Get started by adding your first question
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64">
          <div className="sticky top-20 space-y-3">
            <button
              onClick={addItem}
              className="btn btn-neutral w-full gap-2 border-0 bg-gray-900 text-white hover:bg-gray-800"
            >
              <FaPlus size={14} />
              Add Question
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-outline w-full border-2 border-gray-900 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            >
              Submit Form
            </button>
          </div>
        </div>

        {/* Action Buttons - Mobile Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden">
          <div className="flex gap-3">
            <button
              onClick={addItem}
              className="btn btn-neutral flex-1 gap-2 border-0 bg-gray-900 text-white hover:bg-gray-800"
            >
              <FaPlus size={14} />
              Add Question
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-outline flex-1 border-2 border-gray-900 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}