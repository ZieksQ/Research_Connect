import React, { useState } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { postProfilePicture } from "../../services/user";

export default function ChangeProfilePicture({ className = "", onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: "dropzone" });

  const handleFile = (f) => {
    if (!f) return;

    const validTypes = ["image/png", "image/jpeg"];
    const maxSize = 4 * 1024 * 1024; // 4MB

    if (!validTypes.includes(f.type)) {
      alert("Only PNG and JPEG formats are allowed.");
      return;
    }
    if (f.size > maxSize) {
      alert("File must be less than 4 MB.");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleFileInput = (e) => handleFile(e.target.files[0]);
  
  const handleDragOver = (e) => e.preventDefault();
  
  const handleDropFile = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    setPreview(null);
    setIsLoading(false);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      await postProfilePicture(file);
      handleClose();
      // Call the callback to refresh user data instead of reloading
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload profile picture. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <button 
        onClick={() => setIsOpen(true)} 
        className={`btn bg-custom-blue text-white hover:bg-blue-800 border-none btn-sm ${className}`}
      >
        Change Profile Picture
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Transparent backdrop - click to close */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-xl mb-6 text-gray-900">Upload a new profile picture</h3>

            {/* Drag & Drop Area - Hidden on mobile (< lg) */}
            <div className="hidden lg:block">
              <DndContext>
                <div
                  ref={setNodeRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDropFile}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isOver 
                      ? "border-custom-blue bg-blue-50" 
                      : "border-gray-300 hover:border-custom-blue hover:bg-gray-50"
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mb-3 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                  <p className="text-gray-700 font-medium mb-1">
                    Drag & Drop your image here
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG or JPEG, max 4 MB
                  </p>
                </div>
              </DndContext>

              <div className="divider my-4">OR</div>
            </div>

            {/* File Upload Input */}
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/png, image/jpeg"
              onChange={handleFileInput}
            />

            {/* Preview */}
            {preview && (
              <div className="mt-6 flex flex-col items-center">
                <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-500">
                  Preview
                </p>
                <div className="relative">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleClose} 
                className="btn btn-outline flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                className="btn bg-custom-blue text-white hover:bg-blue-800 border-none flex-1" 
                disabled={!file}
              >
                {isLoading ? <span className="loading loading-dots loading-md"></span> : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}