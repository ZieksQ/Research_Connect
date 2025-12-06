import { MdAdd } from 'react-icons/md';

export default function CreatePostBar({ onCreateClick }) {
  return (
    <div className="rounded-xl shadow-sm bg-white border border-gray-200 p-6 mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Create a New Survey</h2>
        <p className="text-gray-500 text-sm mt-1">Start gathering insights from your audience today.</p>
      </div>
      
      <button
        onClick={onCreateClick}
        className="btn bg-custom-blue border-custom-blue text-white hover:bg-blue-700 hover:border-blue-700 gap-2 px-6 rounded-lg normal-case"
      >
        <MdAdd className="text-xl" />
        Create Survey
      </button>
    </div>
  );
}
