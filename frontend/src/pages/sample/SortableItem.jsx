import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { FaGripVertical, FaTrash, FaPlus } from "react-icons/fa";
import { MdOutlineImage } from "react-icons/md";
import { IoLinkSharp } from "react-icons/io5";

function ChoiceItem({ choice, index, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: choice.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        className="cursor-grab text-gray-300 hover:text-gray-500"
        {...attributes}
        {...listeners}
      >
        <FaGripVertical size={12} />
      </div>
      <span className="text-sm text-gray-400">{index + 1}.</span>
      <input
        type="text"
        className="input input-bordered flex-1 border-gray-200 bg-white focus:border-gray-400"
        placeholder="Option text"
        value={choice.text}
        onChange={(e) => onUpdate(choice.id, e.target.value)}
      />
      <button
        className="text-gray-300 hover:text-red-500"
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
  required,
  questionType = "none",
  choices = [],
  onChange,
  onDelete,
}) {
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onChange(id, "questionType", newType);
    if (!["checkbox", "radio", "dropdown"].includes(newType)) {
      onChange(id, "choices", []);
    }
  };

  const handleAddChoice = () => {
    const newChoice = { id: Date.now(), text: "" };
    onChange(id, "choices", [...choices, newChoice]);
  };

  const handleChoiceChange = (choiceId, value) => {
    const updated = choices.map((c) =>
      c.id === choiceId ? { ...c, text: value } : c
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

  // ---------- Photo Upload ----------
  const handleFile = (f) => {
    if (!f) return;
    const validTypes = ["image/png", "image/jpeg"];
    const maxSize = 4 * 1024 * 1024;
    if (!validTypes.includes(f.type)) {
      alert("Only PNG and JPEG formats are allowed.");
      return;
    }
    if (f.size > maxSize) {
      alert("File must be less than 4 MB.");
      return;
    }
    setPhotoPreview(URL.createObjectURL(f));
    setPhotoModalOpen(false);
  };

  // ---------- Video Embed ----------
  const handleVideoSave = (url) => {
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      alert("Please enter a valid YouTube URL.");
      return;
    }
    setVideoUrl(url);
    setVideoModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* Drag handle */}
      <div
        className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-grab text-gray-400"
        {...attributes}
        {...listeners}
      >
        <FaGripVertical size={16} />
      </div>

      {/* Title */}
      <div className="mb-3 flex justify-between">
        <input
          type="text"
          className="flex-1 border-b border-transparent bg-transparent text-lg font-medium focus:border-gray-900"
          placeholder="Untitled Question"
          value={title}
          onChange={(e) => onChange(id, "title", e.target.value)}
        />
        <button onClick={() => onDelete(id)} className="text-gray-400 hover:text-red-500">
          <FaTrash size={16} />
        </button>
      </div>

      {/* Media Preview */}
      {(photoPreview || videoUrl) && (
        <div className="mb-4 space-y-3">
          {photoPreview && (
            <div className="relative inline-block">
              <img
                src={photoPreview}
                alt="preview"
                className="w-48 rounded-lg border"
              />
              <button
                onClick={() => setPhotoPreview(null)}
                className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error"
              >
                ✕
              </button>
            </div>
          )}
          {videoUrl && (
            <div className="relative">
              <iframe
                className="rounded-lg border"
                width="320"
                height="180"
                src={videoUrl.replace("watch?v=", "embed/")}
                title="YouTube video"
                allowFullScreen
              />
              <button
                onClick={() => setVideoUrl("")}
                className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Answer Type */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Answer Type
        </label>
        <select
          className="select select-bordered w-full border-gray-200 bg-white text-gray-900 focus:border-gray-400"
          value={questionType}
          onChange={handleTypeChange}
        >
          <option value="none">✗ None</option>
          <option value="radio">◉ Single Choice</option>
          <option value="checkbox">☑ Multiple Choice</option>
          <option value="dropdown">⬇ Dropdown</option>
          <option value="text">A Short Text</option>
          <option value="textarea">≋ Long Text</option>
          <option value="rating">⭐ Rating (Stars)</option>
          <option value="date">📅 Date</option>
        </select>
      </div>

      {/* Options */}
      {["radio", "checkbox", "dropdown"].includes(questionType) && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Options</p>
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
            className="btn btn-ghost btn-sm mt-2 border-gray-200 text-gray-600 hover:bg-gray-100"
            onClick={handleAddChoice}
          >
            <FaPlus size={12} /> Add Option
          </button>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex gap-3">
          <button
            onClick={() => setPhotoModalOpen(true)}
            className="text-gray-500 hover:text-blue-600"
          >
            <MdOutlineImage size={20} />
          </button>
          <button
            onClick={() => setVideoModalOpen(true)}
            className="text-gray-500 hover:text-indigo-600"
          >
            <IoLinkSharp size={20} />
          </button>
        </div>

        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Required</span>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary"
            checked={required}
            onChange={(e) => onChange(id, "required", e.target.checked)}
          />
        </label>
      </div>

      {/* Photo Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPhotoModalOpen(false)}></div>
          <div className="relative bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="font-bold text-xl mb-6">Upload Photo</h3>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="file-input file-input-bordered w-full"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="btn btn-primary flex-1"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setVideoModalOpen(false)}></div>
          <div className="relative bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="font-bold text-xl mb-6">Embed YouTube Video</h3>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Paste YouTube link here..."
              onKeyDown={(e) => e.key === "Enter" && handleVideoSave(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector("input[type='text']");
                  handleVideoSave(input.value);
                }}
                className="btn btn-primary flex-1"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
