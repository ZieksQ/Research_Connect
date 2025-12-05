import { MdAdd, MdPoll, MdAssignment } from 'react-icons/md';

export default function CreatePostBar({ onCreateClick }) {
  return (
    <div className="rounded-xl shadow-sm bg-white border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="rounded-full w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 ring-2 ring-offset-2 ring-custom-blue/20">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" 
              alt="User" 
            />
          </div>
        </div>
        
        <button 
          onClick={onCreateClick}
          className="flex-1 text-left bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-xl p-4 border border-gray-100 hover:border-gray-200 group"
        >
          <span className="text-gray-500 font-medium text-base lg:text-lg group-hover:text-gray-700">
            What kind of research are you conducting today?
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-4">
           <button onClick={onCreateClick} className="flex items-center gap-2 text-gray-500 hover:text-custom-blue transition-colors text-sm font-medium">
              <MdPoll className="text-xl text-custom-blue" />
              <span>New Survey</span>
           </button>
           <button onClick={onCreateClick} className="flex items-center gap-2 text-gray-500 hover:text-custom-green transition-colors text-sm font-medium">
              <MdAssignment className="text-xl text-custom-green" />
              <span>Research Project</span>
           </button>
        </div>

        <button
          onClick={onCreateClick}
          className="btn btn-sm bg-custom-blue border-custom-blue text-white hover:bg-blue-700 hover:border-blue-700 gap-2 px-4 rounded-lg"
        >
          <MdAdd className="text-lg" />
          Create Survey
        </button>
      </div>
    </div>
  );
}
