import { Link } from 'react-router-dom';
import { MdVpnKey } from 'react-icons/md';

export default function CodeInputModal({ 
  isOpen, 
  postCode, 
  onPostCodeChange, 
  onSubmitWithCode, 
  onSubmitWithoutCode,
  cancelPath = '/home'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-8 rounded-xl shadow-xl bg-white max-w-md w-[90%]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <MdVpnKey className="text-3xl text-custom-blue" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-center text-gray-900">
          Have an Approval Code?
        </h2>
        <p className="mb-4 text-center text-sm text-gray-600">
          If you have an approval code from an admin, enter it below to bypass the approval process. Otherwise, your survey will be sent for review.
        </p>
        
        <div className="mb-6">
          <label className="label">
            <span className="label-text text-gray-600 font-medium">
              Approval Code (Optional)
            </span>
          </label>
          <input
            type="text"
            value={postCode}
            onChange={(e) => onPostCodeChange(e.target.value)}
            placeholder="Enter your code here..."
            className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-3">
          {postCode.trim() && (
            <button
              onClick={onSubmitWithCode}
              className="btn w-full bg-custom-blue hover:bg-blue-700 text-white border-none"
            >
              Submit with Code
            </button>
          )}
          <button
            onClick={onSubmitWithoutCode}
            className={`btn w-full ${
              postCode.trim() 
                ? 'btn-ghost text-gray-500 hover:bg-gray-100' 
                : 'bg-custom-blue hover:bg-blue-700 text-white border-none'
            }`}
          >
            {postCode.trim() ? 'Submit without Code' : 'Submit for Review'}
          </button>
          <Link 
            to={cancelPath}
            className="text-center text-sm text-custom-blue hover:underline mt-2"
          >
            Cancel and return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
