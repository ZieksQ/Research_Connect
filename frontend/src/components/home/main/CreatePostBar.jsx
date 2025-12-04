import { MdAdd } from 'react-icons/md';

export default function CreatePostBar({ onCreateClick }) {
  return (
    <div className="rounded-xl shadow-sm flex items-center justify-between bg-white border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-3 flex-1">
        <div className="avatar">
          <div className="rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" 
              alt="User" 
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Start a new research study..."
          className="input input-ghost w-full border-0 focus:outline-none bg-transparent text-gray-600 text-sm lg:text-base p-0"
          onClick={onCreateClick}
          readOnly
        />
      </div>
      <button
        onClick={onCreateClick}
        className="btn btn-circle btn-sm bg-custom-green border-custom-green text-white w-8 h-8 lg:w-10 lg:h-10 min-h-0 hover:bg-green-600 hover:border-green-600"
      >
        <MdAdd className="text-xl lg:text-2xl" />
      </button>
    </div>
  );
}
