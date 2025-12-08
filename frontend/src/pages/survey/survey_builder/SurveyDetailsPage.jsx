import { useState, useEffect } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { showToast } from '../../../utils/toast';

export default function SurveyDetailsPage({ data, onNext, isFirstStep }) {
  const [title, setTitle] = useState(data.surveyTitle || '');
  const [content, setContent] = useState(data.surveyContent || '');
  const [description, setDescription] = useState(data.surveyDescription || '');
  const [selectedTime, setSelectedTime] = useState(data.surveyApproxTime || '');
  const [customTime, setCustomTime] = useState('');
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [tags, setTags] = useState(data.surveyTags || []);
  const [customTag, setCustomTag] = useState('');
  const [showCustomTag, setShowCustomTag] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const timeOptions = ['1-2 min', '3-4 min', '5-10 min', '10-15 min'];
  
  const predefinedTags = [
    'Academic',
    'Health',
    'Technology',
    'Entertainment',
    'Lifestyle',
    'Business',
    'Research',
    'Marketing'
  ];

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowCustomTime(false);
    setCustomTime('');
  };

  const handleCustomTimeAdd = () => {
    if (customTime.trim()) {
      setSelectedTime(customTime.trim());
      setShowCustomTime(false);
      setCustomTime('');
    }
  };

  const handleTagToggle = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else if (tags.length >= 3) {
      showToast('You can only select up to 3 tags', 'warning');
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleCustomTagAdd = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      const trimmedTag = customTag.trim();
      if (trimmedTag.length > 16) {
        showToast('Custom tag must be 16 characters or less', 'warning');
        return;
      }
      if (tags.length >= 3) {
        showToast('You can only select up to 3 tags', 'warning');
        return;
      }
      setTags([...tags, trimmedTag]);
      setCustomTag('');
      setShowCustomTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleContinue = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Please enter a survey title');
      isValid = false;
    } else if (countWords(title) < 5) {
      setTitleError('Survey title must contain at least 5 words');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!content.trim()) {
      setContentError('Please enter post content');
      isValid = false;
    } else if (countWords(content) < 5) {
      setContentError('Post content must contain at least 5 words');
      isValid = false;
    } else {
      setContentError('');
    }

    if (!description.trim()) {
      setDescriptionError('Please enter a survey description');
      isValid = false;
    } else if (countWords(description) < 5) {
      setDescriptionError('Survey description must contain at least 5 words');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!selectedTime) {
      showToast('Please select approximate time', 'warning');
      isValid = false;
    }

    if (isValid) {
      onNext({
        surveyTitle: title,
        surveyContent: content,
        surveyDescription: description,
        surveyApproxTime: selectedTime,
        surveyTags: tags
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-12">
      <div className="mb-8 lg:mb-10">
        <h2 className="text-2xl lg:text-3xl font-giaza text-custom-blue mb-2">
          Create Your Survey
        </h2>
        <p className="text-gray-500 text-base lg:text-lg">
          Fill in the basic information about your survey to get started
        </p>
      </div>

      {/* Survey Title */}
      <div className="mb-8">
        <label className="label">
          <span className="label-text text-gray-700 font-medium text-base lg:text-lg">
            Survey Title <span className="text-red-600">*</span>
          </span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 text-base lg:text-lg p-4 h-auto ${
            titleError ? 'input-error' : 'border-gray-300'
          }`}
          placeholder="Enter survey title"
        />
        {titleError && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {titleError}
          </p>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-8">
        <label className="label">
          <span className="label-text text-gray-700 font-medium text-base lg:text-lg">
            Post Content <span className="text-red-600">*</span>
          </span>
        </label>
        <p className="text-xs mb-2 text-gray-500">
          This is the content that will be displayed on your post card in the homepage feed.
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`textarea textarea-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 text-base lg:text-lg p-4 min-h-[100px] ${
            contentError ? 'textarea-error' : 'border-gray-300'
          }`}
          placeholder="Write a brief description about your survey that will appear on the post card..."
        />
        {contentError && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {contentError}
          </p>
        )}
      </div>

      {/* Survey Description */}
      <div className="mb-8">
        <label className="label">
          <span className="label-text text-gray-700 font-medium text-base lg:text-lg">
            Survey Description <span className="text-red-600">*</span>
          </span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`textarea textarea-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 text-base lg:text-lg p-4 min-h-[120px] ${
            descriptionError ? 'textarea-error' : 'border-gray-300'
          }`}
          placeholder="Describe what your survey is about"
        />
        {descriptionError && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {descriptionError}
          </p>
        )}
      </div>

      {/* Approximate Time */}
      <div className="mb-8">
        <label className="label">
          <span className="label-text text-gray-700 font-medium text-base lg:text-lg">
            Approximate Time to Complete <span className="text-red-600">*</span>
          </span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`badge badge-lg h-auto py-3 px-4 cursor-pointer transition-all border-none ${
                selectedTime === time 
                  ? 'bg-custom-blue text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {time}
            </button>
          ))}
          <button
            onClick={() => setShowCustomTime(!showCustomTime)}
            className="badge badge-lg h-auto py-3 px-4 cursor-pointer transition-all border-none bg-gray-100 text-custom-blue hover:bg-gray-200 font-medium"
          >
            + More
          </button>
        </div>
        
        {showCustomTime && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomTimeAdd()}
              className="input input-sm flex-1 bg-gray-50 border-gray-300 focus:border-custom-blue text-gray-900"
              placeholder="Enter custom time (e.g., 20-30 min)"
            />
            <button
              onClick={handleCustomTimeAdd}
              className="btn btn-sm bg-custom-blue hover:bg-blue-700 text-white border-none"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-10">
        <label className="label">
          <span className="label-text text-gray-700 font-medium text-base lg:text-lg">
            Survey Tags <span className="text-gray-500 text-sm">(Max 3)</span>
          </span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {predefinedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`badge badge-lg h-auto py-2 px-4 cursor-pointer transition-all border-none ${
                tags.includes(tag) 
                  ? 'bg-custom-blue text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
          <button
            onClick={() => setShowCustomTag(!showCustomTag)}
            className="badge badge-lg h-auto py-2 px-4 cursor-pointer transition-all border-none bg-gray-100 text-custom-blue hover:bg-gray-200 font-medium"
          >
            + More
          </button>
        </div>

        {showCustomTag && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomTagAdd()}
              maxLength={16}
              className="input input-sm flex-1 bg-gray-50 border-gray-300 focus:border-custom-blue text-gray-900"
              placeholder="Enter custom tag (max 16 chars)"
            />
            <button
              onClick={handleCustomTagAdd}
              className="btn btn-sm bg-custom-blue hover:bg-blue-700 text-white border-none"
            >
              Add
            </button>
          </div>
        )}

        {/* Selected Tags */}
        {tags.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs mb-3 text-gray-500 font-medium uppercase tracking-wider">
              Selected Tags:
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="badge badge-lg gap-2 bg-custom-blue text-white border-none py-3 px-4"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="btn w-full bg-custom-blue hover:bg-blue-700 text-white border-none text-lg h-12"
      >
        Continue
      </button>
    </div>
  );
}