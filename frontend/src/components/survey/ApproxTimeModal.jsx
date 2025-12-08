import { useState } from 'react';
import { MdClose, MdAccessTime } from 'react-icons/md';

export default function ApproxTimeModal({ isOpen, onClose, onSave }) {
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    // Validation
    const minValue = parseInt(minTime);
    const maxValue = parseInt(maxTime);

    if (!minTime || !maxTime) {
      setError('Please enter both minimum and maximum time');
      return;
    }

    if (isNaN(minValue) || isNaN(maxValue)) {
      setError('Please enter valid numbers');
      return;
    }

    if (minValue <= 0 || maxValue <= 0) {
      setError('Time values must be greater than 0');
      return;
    }

    if (minValue >= maxValue) {
      setError('Minimum time must be less than maximum time');
      return;
    }

    // Format the time string
    const timeString = `${minValue}-${maxValue} min`;
    
    // Call the onSave callback with the formatted string
    onSave(timeString);
    
    // Reset and close
    setMinTime('');
    setMaxTime('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setMinTime('');
    setMaxTime('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-[90%] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <MdAccessTime className="text-xl text-custom-blue" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Custom Time Range
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Enter the approximate time range it will take to complete your survey.
        </p>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="label">
              <span className="label-text text-gray-700 font-medium">
                Minimum Time (minutes) <span className="text-red-600">*</span>
              </span>
            </label>
            <input
              type="number"
              min="1"
              value={minTime}
              onChange={(e) => {
                setMinTime(e.target.value);
                setError('');
              }}
              className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900"
              placeholder="e.g., 20"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-gray-700 font-medium">
                Maximum Time (minutes) <span className="text-red-600">*</span>
              </span>
            </label>
            <input
              type="number"
              min="1"
              value={maxTime}
              onChange={(e) => {
                setMaxTime(e.target.value);
                setError('');
              }}
              className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900"
              placeholder="e.g., 30"
            />
          </div>
        </div>

        {/* Preview */}
        {minTime && maxTime && parseInt(minTime) < parseInt(maxTime) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <p className="text-lg font-semibold text-custom-blue">
              {minTime}-{maxTime} min
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="btn flex-1 btn-ghost text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn flex-1 bg-custom-blue hover:bg-blue-700 text-white border-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
