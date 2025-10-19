import { useState } from "react";
import SurveyCardEditor from "./SurveyCardEditor";
import { useNavigate } from "react-router-dom";

export default function CreateSurveyForm() {
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();

    const payload = {title, content}

    try {
      const response = await fetch('/survey/post/send',{
        method: "POST",
        headers: {
          "Content-type": "application/json", // tells the backend that request body is json
        },
        body: JSON.stringify(payload), // converts javascript to json
        credentials: "include", // includes jwt & cookies
      })

      const data = await response.json();

      if(!data.ok) {
        return data.msg;
      }

      navigate('/home');
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ Add new question (no id, use Date.now() for unique name)
  const handleAddQuestion = (type) => {
    const newQuestion = {
      name: `question_${Date.now()}`, // unique per question
      title: "",
      type,
      options: [],
    };
    setFormData((prev) => [...prev, newQuestion]);
  };

  // ✅ Update a question by its name
  const handleUpdateQuestion = (name, updatedData) => {
    setFormData((prev) =>
      prev.map((q) => (q.name === name ? { ...q, ...updatedData } : q)),
    );
  };

  // ✅ Delete a question by its name
  const handleDeleteQuestion = (name) => {
    setFormData((prev) => prev.filter((q) => q.name !== name));
  };

  // ✅ Validation checks
  const validateSurvey = () => {
    const errors = [];

    if (!title.trim()) errors.push("Survey title is required");
    if (!content.trim()) errors.push("Survey content is required");
    if (formData.length === 0) errors.push("At least one question is required");

    formData.forEach((q, index) => {
      if (!q.title.trim()) {
        errors.push(`Question ${index + 1}: Title is required`);
      }

      if (
        (q.type === "radio" || q.type === "checkbox") &&
        q.options.length === 0
      ) {
        errors.push(`Question ${index + 1}: At least one option is required`);
      }

      if (q.type === "radio" || q.type === "checkbox") {
        const emptyOptions = q.options.filter((opt) => !opt.trim());
        if (emptyOptions.length > 0) {
          errors.push(`Question ${index + 1}: All options must have labels`);
        }
      }
    });

    return errors;
  };

  // ✅ Save handler
  const handleSave = () => {
    const errors = validateSurvey();

    if (errors.length > 0) {
      console.log("❌ Validation Errors:");
      errors.forEach((err) => console.log(`  - ${err}`));
      alert(`Validation Failed:\n\n${errors.join("\n")}`);
      return;
    }

    const cleaned = formData.map((q) => ({
      ...q,
      name: q.name || `question_${Date.now()}`, // ensure fallback
    }));

    const surveyJSON = {
      title,
      content,
      data: cleaned,
    };

    console.log("✅ Survey Validation: PASSED");
    console.log("📋 Survey JSON:");
    console.log(JSON.stringify(surveyJSON, null, 2));

    alert("Survey saved successfully! ✅\nCheck console for JSON output");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 bg-gray-900 p-8 shadow">
          <h1 className="mb-2 text-3xl font-bold text-white">Survey Builder</h1>
          <p className="text-gray-300">Create and manage your surveys</p>
        </div>

        {/* Survey Info Section */}
        <div className="mb-6 bg-white p-8 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Survey Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Survey Title *
              </label>
              <input
                type="text"
                placeholder="Enter survey title"
                className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
                value={title}
                onChange={(e) => settitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                content *
              </label>
              <textarea
                rows={3}
                placeholder="Enter survey content"
                className="w-full resize-none border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
                value={content}
                onChange={(e) => setcontent(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-6 bg-white p-8 shadow">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Add Question
            </h2>
            <select
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handleAddQuestion(e.target.value);
                  e.target.value = "";
                }
              }}
            >
              <option value="" disabled>
                Select question type
              </option>
              <option value="text">Short Text</option>
              <option value="essay">Long Text</option>
              <option value="radio">Single Choice</option>
              <option value="checkbox">Multiple Choice</option>
            </select>
          </div>

          {/* Question Cards */}
          <div className="space-y-6">
            {formData.length === 0 ? (
              <div className="border border-gray-300 bg-gray-50 px-4 py-16 text-center">
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  No questions yet
                </h3>
                <p className="text-gray-600">
                  Select a question type to get started
                </p>
              </div>
            ) : (
              formData.map((q, index) => (
                <div key={q.name}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center bg-gray-900 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      Question {index + 1}
                    </span>
                  </div>
                  <SurveyCardEditor
                    data={q}
                    onUpdate={(updated) =>
                      handleUpdateQuestion(q.name, updated)
                    }
                    onDelete={() => handleDeleteQuestion(q.name)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handlePost}
          className="w-full bg-emerald-500 py-4 text-lg font-bold text-white shadow transition-colors hover:bg-emerald-600"
        >
          Save Survey
        </button>
      </div>

      {/* ✅ Floating Action Button (FAB) */}
      <div className="fab fixed right-6 bottom-6 z-50">
        {/* Main FAB Button */}
        <div
          tabIndex={0}
          role="button"
          className="btn btn-lg btn-circle btn-secondary"
        >
          <svg
            aria-label="Add Question"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>

        {/* Option Buttons — appear when FAB expands */}

        <button
          className="btn btn-lg btn-circle"
          onClick={() => handleAddQuestion("radio")}
          title="Single Choice"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            fill="black"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320C528 205.1 434.9 112 320 112zM320 416C267 416 224 373 224 320C224 267 267 224 320 224C373 224 416 267 416 320C416 373 373 416 320 416z"
            />
          </svg>
        </button>

        <button
          className="btn btn-lg btn-circle"
          onClick={() => handleAddQuestion("checkbox")}
          title="Multiple Choice"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            ill="black"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96L480 96zM160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM390.7 233.9C398.5 223.2 413.5 220.8 424.2 228.6C434.9 236.4 437.3 251.4 429.5 262.1L307.4 430.1C303.3 435.8 296.9 439.4 289.9 439.9C282.9 440.4 276 437.9 271.1 433L215.2 377.1C205.8 367.7 205.8 352.5 215.2 343.2C224.6 333.9 239.8 333.8 249.1 343.2L285.1 379.2L390.7 234z"
            />
          </svg>
        </button>

        <button
          className="btn btn-lg btn-circle"
          onClick={() => handleAddQuestion("essay")}
          title="Essay"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5M3.75 9.75h10.5M3.75 14.25h7.5M3.75 18.75h3"
            />
          </svg>
        </button>

        <button
          className="btn btn-lg btn-circle"
          onClick={() => handleAddQuestion("text")}
          title="Short Text"
        >
          <span className="font-bold">T</span>
        </button>
      </div>
    </div>
  );
}
