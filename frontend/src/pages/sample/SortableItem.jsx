import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, getDefaultKeyBinding } from "draft-js";
import "draft-js/dist/Draft.css";
import { FaGripVertical, FaTrash, FaBold, FaItalic, FaUnderline } from "react-icons/fa";

export default function SortableItem({ id, title, description, required, onChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef(null);
  const isUpdating = useRef(false);

  const toggleStyle = (styleType) => {
    try {
      isUpdating.current = true;
      const newEditorState = RichUtils.toggleInlineStyle(editorState, styleType.toUpperCase());
      setEditorState(newEditorState);
      
      try {
        const raw = convertToRaw(newEditorState.getCurrentContent());
        onChange(id, "description", raw);
      } catch (e) {
        console.warn("Error converting to raw:", e);
      }
      
      // Refocus the editor after toggling style
      setTimeout(() => {
        isUpdating.current = false;
        if (editorRef.current) {
          editorRef.current.focus();
        }
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
      // Reset to a safe state if there's an error
      setEditorState(EditorState.createEmpty());
    }
  };

  const handleKeyCommand = (command, editorState) => {
    if (command === 'bold' || command === 'italic' || command === 'underline') {
      toggleStyle(command);
      return 'handled';
    }
    
    try {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        handleEditorChange(newState);
        return 'handled';
      }
    } catch (e) {
      console.warn("Error handling key command:", e);
    }
    
    return 'not-handled';
  };

  const keyBindingFn = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        return 'bold';
      }
      if (e.key === 'i') {
        e.preventDefault();
        return 'italic';
      }
      if (e.key === 'u') {
        e.preventDefault();
        return 'underline';
      }
    }
    return getDefaultKeyBinding(e);
  };

  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Purple left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500 rounded-l-lg"></div>
      
      <div className="pl-10 pr-4 py-4">
        {/* Drag Handle */}
        <div 
          className="absolute left-3 top-4 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes} 
          {...listeners}
        >
          <FaGripVertical size={16} />
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(id)}
          className="absolute right-3 top-4 text-gray-400 hover:text-red-500 transition-colors"
          type="button"
        >
          <FaTrash size={14} />
        </button>

        {/* Title Input */}
        <input
          type="text"
          className="w-full pr-8 px-3 py-2 text-base border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors mb-4 mt-2"
          placeholder="Question title"
          value={title}
          onChange={(e) => onChange(id, "title", e.target.value)}
        />

        {/* Description Editor */}
        <div className="mb-3 p-3 border border-gray-200 rounded-md min-h-[100px] bg-gray-50 focus-within:bg-white focus-within:border-purple-300 transition-colors">
          <div className="draft-editor-wrapper">
            <Editor 
              ref={editorRef}
              editorState={editorState} 
              onChange={handleEditorChange}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={keyBindingFn}
              placeholder="Description (optional)"
              spellCheck={true}
              stripPastedStyles={false}
            />
          </div>
        </div>

        {/* Bottom Section: Formatting Buttons and Required Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* Formatting Buttons */}
          <div className="flex gap-1">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleStyle("bold");
              }}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                currentStyle.has("BOLD") ? "bg-purple-100 text-purple-600" : "text-gray-600"
              }`}
              title="Bold (Ctrl+B)"
            >
              <FaBold size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleStyle("italic");
              }}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                currentStyle.has("ITALIC") ? "bg-purple-100 text-purple-600" : "text-gray-600"
              }`}
              title="Italic (Ctrl+I)"
            >
              <FaItalic size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleStyle("underline");
              }}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                currentStyle.has("UNDERLINE") ? "bg-purple-100 text-purple-600" : "text-gray-600"
              }`}
              title="Underline (Ctrl+U)"
            >
              <FaUnderline size={14} />
            </button>
          </div>

          {/* Required Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Required</span>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-purple"
              checked={required}
              onChange={(e) => onChange(id, "required", e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}