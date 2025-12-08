import { MdSave } from 'react-icons/md';

export default function DraftModal({ isOpen, onLoadDraft, onDiscardDraft }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-8 rounded-xl shadow-xl bg-white max-w-md w-[90%]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <MdSave className="text-4xl text-custom-blue" />
        </div>
        <h2 className="text-xl font-bold mb-3 text-gray-900 text-center">
          Continue Previous Survey?
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          We found a saved draft from your previous session. Would you like to continue where you left off?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onLoadDraft}
            className="btn w-full bg-custom-blue hover:bg-blue-700 text-white border-none"
          >
            Continue Draft
          </button>
          <button
            onClick={onDiscardDraft}
            className="btn w-full btn-ghost text-gray-500 hover:bg-gray-100"
          >
            Start New Survey
          </button>
        </div>
      </div>
    </div>
  );
}
