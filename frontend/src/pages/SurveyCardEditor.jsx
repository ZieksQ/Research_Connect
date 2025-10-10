import { useState, useRef } from "react";

export default function SurveyCardEditor({ data, onUpdate, onDelete }) {
  const [localData, setLocalData] = useState({
    ...data,
    options: data.options?.length ? data.options : [""],
  });

  const inputRefs = useRef([]);

  const handleChange = (key, value) => {
    const updated = { ...localData, [key]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleOptionChange = (index, newLabel) => {
    const newOptions = [...localData.options];
    newOptions[index] = newLabel;
    handleChange("options", newOptions);
  };

  const handleAddOption = () => {
    const newOptions = [...localData.options, ""];
    handleChange("options", newOptions);
    setTimeout(() => {
      const lastIndex = newOptions.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const handleRemoveOption = (index) => {
    const newOptions = localData.options.filter((_, i) => i !== index);
    handleChange("options", newOptions);
  };

  const handleOptionKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="border border-gray-300 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Enter your question"
          className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-gray-900 focus:outline-none sm:flex-1"
          value={localData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <button
          className="w-full self-end bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 sm:w-auto sm:self-auto"
          onClick={onDelete}
          type="button"
        >
          Delete
        </button>
      </div>

      {/* Type Selector */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Question Type
        </label>
        <select
          className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          value={localData.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="text">Short Text</option>
          <option value="essay">Long Text</option>
          <option value="radio">Single Choice</option>
          <option value="checkbox">Multiple Choice</option>
        </select>
      </div>

      {/* Radio / Checkbox Options */}
      {(localData.type === "radio" || localData.type === "checkbox") && (
        <div className="mb-4 space-y-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Answer Options
          </label>
          {localData.options.map((opt, index) => (
            <div key={index} className="group flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3 border border-gray-300 bg-white px-4 py-2">
                <div
                  className={`h-4 w-4 border-2 border-gray-400 ${localData.type === "radio" ? "rounded-full" : ""} flex-shrink-0`}
                ></div>
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  className="flex-1 bg-transparent text-gray-900 focus:outline-none"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                  placeholder="Option label"
                />
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center bg-gray-200 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                type="button"
                onClick={() => handleRemoveOption(index)}
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddOption}
            className="mt-2 text-sm font-medium text-gray-900 hover:text-gray-600"
          >
            + Add option
          </button>
        </div>
      )}

      {/* Text Preview */}
      {localData.type === "text" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Answer Preview
          </label>
          <input
            type="text"
            disabled
            placeholder="Short text answer"
            className="w-full border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
          />
        </div>
      )}

      {/* Essay Preview */}
      {localData.type === "essay" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Answer Preview
          </label>
          <textarea
            rows={4}
            disabled
            placeholder="Long text answer"
            className="w-full resize-none border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
          />
        </div>
      )}
    </div>
  );
}
