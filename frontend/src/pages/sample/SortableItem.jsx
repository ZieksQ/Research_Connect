import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  getDefaultKeyBinding,
} from "draft-js";
import "draft-js/dist/Draft.css";
import {
  FaGripVertical,
  FaTrash,
  FaBold,
  FaItalic,
  FaUnderline,
  FaPlus,
  FaDotCircle,
  FaCheckSquare,
  FaFont,
  FaAlignLeft,
  FaTimes,
} from "react-icons/fa";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

function ChoiceItem({ choice, index, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: choice.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <FaGripVertical size={12} />
      </div>
      <span className="text-sm text-gray-400">{index + 1}.</span>
      <input
        type="text"
        className="input input-bordered flex-1 border-gray-200 bg-white focus:border-gray-400 focus:outline-none"
        placeholder="Option text"
        value={choice.text}
        onChange={(e) => onUpdate(choice.id, e.target.value)}
      />
      <button
        className="text-gray-300 transition-colors hover:text-red-500"
        onClick={() => onDelete(choice.id)}
      >
        <FaTrash size={14} />
      </button>
    </div>
  );
}

export default function SortableItem({
  id,
  title,
  description,
  required,
  questionType = "none",
  choices = [],
  minChoices = 1,
  maxChoices = null,
  onChange,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const editorRef = useRef(null);
  const isUpdating = useRef(false);

  const [descOpen, setDescOpen] = useState(true);
  const [choicesOpen, setChoicesOpen] = useState(true);

  const toggleStyle = (styleType) => {
    try {
      isUpdating.current = true;
      const newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        styleType.toUpperCase(),
      );
      setEditorState(newEditorState);
      const raw = convertToRaw(newEditorState.getCurrentContent());
      onChange(id, "description", raw);
      setTimeout(() => {
        isUpdating.current = false;
        editorRef.current?.focus();
      }, 0);
    } catch (e) {
      console.warn("Error toggling style:", e);
      isUpdating.current = false;
    }
  };

  const handleEditorChange = (newState) => {
    if (isUpdating.current) return;
    try {
      setEditorState(newState);
      const raw = convertToRaw(newState.getCurrentContent());
      onChange(id, "description", raw);
    } catch (e) {
      console.warn("Error in editor change:", e);
    }
  };

  const handleKeyCommand = (command, editorState) => {
    if (["bold", "italic", "underline"].includes(command)) {
      toggleStyle(command);
      return "handled";
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const keyBindingFn = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") return "bold";
      if (e.key === "i") return "italic";
      if (e.key === "u") return "underline";
    }
    return getDefaultKeyBinding(e);
  };

  const currentStyle = editorState.getCurrentInlineStyle();

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onChange(id, "questionType", newType);
    if (!["checkbox", "radio"].includes(newType)) {
      onChange(id, "choices", []);
      onChange(id, "required", false);
    }
    if (newType === "checkbox") {
      onChange(id, "minChoices", 1);
      onChange(id, "maxChoices", null);
    }
  };

  const handleAddChoice = () => {
    const newChoice = { id: Date.now(), text: "" };
    onChange(id, "choices", [...choices, newChoice]);
  };

  const handleChoiceChange = (choiceId, value) => {
    const updated = choices.map((c) =>
      c.id === choiceId ? { ...c, text: value } : c,
    );
    onChange(id, "choices", updated);
  };

  const handleDeleteChoice = (choiceId) => {
    const updated = choices.filter((c) => c.id !== choiceId);
    onChange(id, "choices", updated);
  };

  const handleChoiceDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = choices.findIndex((c) => c.id === active.id);
    const newIndex = choices.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(choices, oldIndex, newIndex);
    onChange(id, "choices", reordered);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "radio":
        return <FaDotCircle size={14} />;
      case "checkbox":
        return <FaCheckSquare size={14} />;
      case "text":
        return <FaFont size={14} />;
      case "textarea":
        return <FaAlignLeft size={14} />;
      default:
        return <FaTimes size={14} />;
    }
  };

  const isRequiredDisabled = questionType === "none";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <div
          className="cursor-grab rounded-lg bg-white p-2 text-gray-400 shadow-md hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <FaGripVertical size={16} />
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <input
            type="text"
            className="flex-1 border-b-2 border-transparent bg-transparent px-1 py-2 text-lg font-medium text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
            placeholder="Untitled Question"
            value={title}
            onChange={(e) => onChange(id, "title", e.target.value)}
          />
          <button
            onClick={() => onDelete(id)}
            className="mt-2 text-gray-300 transition-colors hover:text-red-500"
            type="button"
          >
            <FaTrash size={16} />
          </button>
        </div>

        <div className="collapse-arrow collapse mb-4 rounded-lg border-0 bg-gray-50">
          <input
            type="checkbox"
            checked={descOpen}
            onChange={() => setDescOpen((p) => !p)}
          />
          <div className="collapse-title min-h-0 px-4 py-2 text-sm font-medium text-gray-600">
            Description
          </div>

          <div className="collapse-content px-4">
            <div className="mb-3 min-h-[80px] rounded-lg border border-gray-200 bg-white p-3 transition-colors focus-within:border-gray-400">
              <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={handleEditorChange}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindingFn}
                placeholder="Add a description..."
                spellCheck={true}
              />
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleStyle("bold");
                }}
                className={`rounded-lg p-2 transition-colors ${
                  currentStyle.has("BOLD")
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title="Bold (Ctrl+B)"
              >
                <FaBold size={13} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleStyle("italic");
                }}
                className={`rounded-lg p-2 transition-colors ${
                  currentStyle.has("ITALIC")
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title="Italic (Ctrl+I)"
              >
                <FaItalic size={13} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleStyle("underline");
                }}
                className={`rounded-lg p-2 transition-colors ${
                  currentStyle.has("UNDERLINE")
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title="Underline (Ctrl+U)"
              >
                <FaUnderline size={13} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Answer Type
          </label>
          <select
            className="select select-bordered w-full border-gray-200 bg-white text-gray-900 focus:border-gray-400 focus:outline-none"
            value={questionType}
            onChange={handleTypeChange}
          >
            <option value="none">
              {String.fromCharCode(10005)} None
            </option>
            <option value="radio">
              {String.fromCharCode(9678)} Single Choice
            </option>
            <option value="checkbox">
              {String.fromCharCode(9745)} Multiple Choice
            </option>
            <option value="text">
              {String.fromCharCode(65313)} Short Text
            </option>
            <option value="textarea">
              {String.fromCharCode(9783)} Long Text
            </option>
          </select>
        </div>

        {["radio", "checkbox"].includes(questionType) && (
          <>
            <div className="collapse-arrow collapse mb-4 rounded-lg border-0 bg-gray-50">
              <input
                type="checkbox"
                checked={choicesOpen}
                onChange={() => setChoicesOpen((p) => !p)}
              />
              <div className="collapse-title min-h-0 px-4 py-2 text-sm font-medium text-gray-600">
                Options
              </div>

              <div className="collapse-content px-4">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleChoiceDragEnd}
                >
                  <SortableContext
                    items={choices.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-2">
                      {choices.map((choice, index) => (
                        <ChoiceItem
                          key={choice.id}
                          choice={choice}
                          index={index}
                          onUpdate={handleChoiceChange}
                          onDelete={handleDeleteChoice}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm mt-2 justify-start border-gray-200 text-gray-600 hover:bg-gray-100"
                  onClick={handleAddChoice}
                >
                  <FaPlus size={12} /> Add Option
                </button>
              </div>
            </div>

            {questionType === "checkbox" && (
              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">
                  Choice Limits
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Minimum
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={maxChoices || choices.length}
                      className="input input-bordered input-sm w-full border-gray-200 bg-white focus:border-gray-400 focus:outline-none"
                      value={minChoices || 1}
                      onChange={(e) =>
                        onChange(
                          id,
                          "minChoices",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Maximum
                    </label>
                    <input
                      type="number"
                      min={minChoices || 1}
                      max={choices.length}
                      className="input input-bordered input-sm w-full border-gray-200 bg-white focus:border-gray-400 focus:outline-none"
                      placeholder="No limit"
                      value={maxChoices || ""}
                      onChange={(e) =>
                        onChange(
                          id,
                          "maxChoices",
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-end border-t border-gray-100 pt-4">
          <label
            className={`flex cursor-pointer items-center gap-3 ${
              isRequiredDisabled ? "cursor-not-allowed opacity-40" : ""
            }`}
          >
            <span className="text-sm text-gray-600">Required</span>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary border-gray-300 bg-gray-200 [--tglbg:white] hover:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100"
              checked={required}
              disabled={isRequiredDisabled}
              onChange={(e) => onChange(id, "required", e.target.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}