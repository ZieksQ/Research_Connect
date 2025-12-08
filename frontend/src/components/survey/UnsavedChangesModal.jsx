import { MdSave, MdDeleteForever } from 'react-icons/md';

export default function UnsavedChangesModal({ 
  isOpen, 
  onSaveAndExit, 
  onExitWithoutSaving, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-8 rounded-xl shadow-xl bg-white max-w-md w-[90%]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-50 flex items-center justify-center">
          <MdSave className="text-4xl text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold mb-3 text-gray-900 text-center">
          Save Your Progress?
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          Would you like to save your survey as a draft? You can continue working on it later.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onSaveAndExit}
            className="btn w-full bg-custom-blue hover:bg-blue-700 text-white border-none"
          >
            <MdSave className="text-lg" />
            Save Draft & Exit
          </button>
          <button
            onClick={onExitWithoutSaving}
            className="btn w-full btn-ghost text-red-500 hover:bg-red-50"
          >
            <MdDeleteForever className="text-lg" />
            Exit Without Saving
          </button>
          <button
            onClick={onCancel}
            className="btn w-full btn-ghost text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
