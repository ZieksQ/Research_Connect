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
  const [sections, setSections] = useState([]);

  // --------------------------
  // SECTION FUNCTIONS
  // --------------------------
  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "Untitled Section",
      description: "",
      questions: [],
    };
    setSections((prev) => [...prev, newSection]);
  };

  const handleSectionTitleChange = (id, newTitle) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleSectionDescriptionChange = (id, value) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, description: value } : s))
    );
  };

  const handleDeleteSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // --------------------------
  // QUESTION FUNCTIONS
  // --------------------------
  const addQuestion = (sectionId) => {
    const newQuestion = {
      id: Date.now().toString(),
      title: "",
      required: false,
      questionType: "none",
      choices: [],
      minChoices: 1,
      maxChoices: null,
    };
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      )
    );
  };

  const handleQuestionChange = (sectionId, questionId, field, value) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
              ),
            }
          : s
      )
    );
  };

  const handleDeleteQuestion = (sectionId, questionId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.filter((q) => q.id !== questionId),
            }
          : s
      )
    );
  };

  const handleQuestionDragEnd = (sectionId, event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const oldIndex = s.questions.findIndex((q) => q.id === active.id);
        const newIndex = s.questions.findIndex((q) => q.id === over.id);
        return { ...s, questions: arrayMove(s.questions, oldIndex, newIndex) };
      })
    );
  };

  const handleSubmit = () => {
    console.log(JSON.stringify({ data: sections }, null, 2));
  };

  // --------------------------
  // RENDER
  // --------------------------
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:flex lg:gap-8 lg:py-12">
        {/* MAIN CONTENT */}
        <div className="mx-auto w-full max-w-2xl pb-32 lg:pb-8">
          <div className="mb-8">
            <h1 className="mb-1 text-3xl font-bold tracking-tight text-gray-900">
              Form Builder
            </h1>
            <p className="text-gray-500">
              Create and organize your sections and questions
            </p>
          </div>

          {/* DND CONTEXT FOR SECTIONS */}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-6">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="collapse collapse-arrow rounded-xl border border-gray-300 bg-gray-200 shadow-sm"
                  >
                    <input type="checkbox" defaultChecked />
                    {/* SECTION HEADER */}
                    <div className="collapse-title flex items-center justify-between gap-3">
                      <input
                        type="text"
                        className="w-full border-b border-transparent bg-transparent text-lg font-semibold text-gray-900 focus:border-gray-900 focus:outline-none"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionTitleChange(section.id, e.target.value)
                        }
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent collapse toggle
                          handleDeleteSection(section.id);
                        }}
                        className="btn btn-ghost btn-xs text-gray-500 hover:text-red-500 z-10"
                      >
                        ✕
                      </button>
                    </div>

                    {/* SECTION CONTENT */}
                    <div className="collapse-content">
                      {/* SECTION DESCRIPTION */}
                      <textarea
                        className="textarea textarea-bordered mb-4 w-full border-gray-300 bg-white text-sm text-gray-800 focus:border-gray-400 focus:outline-none"
                        rows={3}
                        placeholder="Section description..."
                        value={section.description}
                        onChange={(e) =>
                          handleSectionDescriptionChange(section.id, e.target.value)
                        }
                      />

                      {/* QUESTIONS */}
                      <div className="mt-4">
                        <DndContext
                          collisionDetection={closestCenter}
                          onDragEnd={(event) =>
                            handleQuestionDragEnd(section.id, event)
                          }
                        >
                          <SortableContext
                            items={section.questions.map((q) => q.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="flex flex-col gap-4">
                              {section.questions.map((question) => (
                                <SortableItem
                                  key={question.id}
                                  id={question.id}
                                  title={question.title}
                                  required={question.required}
                                  questionType={question.questionType}
                                  choices={question.choices}
                                  minChoices={question.minChoices}
                                  maxChoices={question.maxChoices}
                                  onChange={(id, field, value) =>
                                    handleQuestionChange(
                                      section.id,
                                      id,
                                      field,
                                      value
                                    )
                                  }
                                  onDelete={(id) =>
                                    handleDeleteQuestion(section.id, id)
                                  }
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>

                      {/* ADD QUESTION BUTTON */}
                      <button
                        onClick={() => addQuestion(section.id)}
                        className="btn btn-neutral mt-4 w-full gap-2 border-0 bg-gray-900 text-white hover:bg-gray-800"
                      >
                        <FaPlus size={14} />
                        Add Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Empty state */}
          {sections.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="mb-1 text-lg font-medium text-gray-900">
                No sections yet
              </p>
              <p className="text-sm text-gray-500">
                Get started by adding your first section
              </p>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS (desktop) */}
        <div className="hidden lg:block lg:w-64">
          <div className="sticky top-20 space-y-3">
            <button
              onClick={addSection}
              className="btn btn-neutral w-full gap-2 border-0 bg-gray-900 text-white hover:bg-gray-800"
            >
              <FaPlus size={14} />
              Add Section
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-outline w-full border-2 border-gray-900 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            >
              Submit Form
            </button>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS (mobile fixed bottom) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden">
        <div className="flex gap-3">
          <button
            onClick={addSection}
            className="btn btn-neutral flex-1 gap-2 border-0 bg-gray-900 text-white hover:bg-gray-800"
          >
            <FaPlus size={14} />
            Add Section
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
  );
}
