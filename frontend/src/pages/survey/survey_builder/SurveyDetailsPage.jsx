import { useState, useEffect } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

export default function SurveyDetailsPage({ data, onNext, isFirstStep }) {
  const [title, setTitle] = useState(data.surveyTitle || '');
  const [description, setDescription] = useState(data.surveyDescription || '');
  const [selectedTime, setSelectedTime] = useState(data.surveyApproxTime || '');
  const [customTime, setCustomTime] = useState('');
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [tags, setTags] = useState(data.surveyTags || []);
  const [customTag, setCustomTag] = useState('');
  const [showCustomTag, setShowCustomTag] = useState(false);
  const [titleError, setTitleError] = useState('');
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
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleCustomTagAdd = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      const trimmedTag = customTag.trim();
      if (trimmedTag.length > 16) {
        alert('Custom tag must be 16 characters or less');
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

    if (description.trim() && countWords(description) < 5) {
      setDescriptionError('Survey description must contain at least 5 words if provided');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!selectedTime) {
      alert('Please select approximate time');
      isValid = false;
    }

    if (isValid) {
      onNext({
        surveyTitle: title,
        surveyDescription: description,
        surveyApproxTime: selectedTime,
        surveyTags: tags
      });
    }
  };

  return (
    <div 
      className="rounded-xl shadow-lg" 
      style={{ 
        backgroundColor: '#ffffff',
        padding: 'clamp(1.5rem, 3vw, 3rem)'
      }}
    >
      <div 
        style={{ 
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)'
        }}
      >
        <h2 
          style={{ 
            color: 'var(--color-primary-color)',
            marginBottom: 'clamp(0.5rem, 1vw, 1rem)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)'
          }}
        >
          Create Your Survey
        </h2>
        <p 
          style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
          }}
        >
          Fill in the basic information about your survey to get started
        </p>
      </div>

      {/* Survey Title */}
      <div 
        style={{ 
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)'
        }}
      >
        <label className="label">
          <span 
            className="label-text" 
            style={{ 
              color: 'var(--color-primary-color)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
            }}
          >
            Survey Title <span style={{ color: '#dc2626' }}>*</span>
          </span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: titleError ? '#dc2626' : 'var(--color-shade-primary)',
            color: 'var(--color-primary-color)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
            padding: 'clamp(0.625rem, 1.2vw, 1rem)'
          }}
          placeholder="Enter survey title"
        />
        {titleError && (
          <p 
            style={{ 
              color: '#dc2626',
              fontSize: 'clamp(0.75rem, 1.25vw, 0.9375rem)',
              marginTop: 'clamp(0.25rem, 0.5vw, 0.5rem)'
            }}
          >
            {titleError}
          </p>
        )}
      </div>

      {/* Survey Description */}
      <div 
        style={{ 
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)'
        }}
      >
        <label className="label">
          <span 
            className="label-text" 
            style={{ 
              color: 'var(--color-primary-color)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
            }}
          >
            Survey Description
          </span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: descriptionError ? '#dc2626' : 'var(--color-shade-primary)',
            color: 'var(--color-primary-color)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
            padding: 'clamp(0.625rem, 1.2vw, 1rem)',
            minHeight: 'clamp(6rem, 10vw, 8rem)'
          }}
          placeholder="Describe what your survey is about (optional)"
        />
        {descriptionError && (
          <p 
            style={{ 
              color: '#dc2626',
              fontSize: 'clamp(0.75rem, 1.25vw, 0.9375rem)',
              marginTop: 'clamp(0.25rem, 0.5vw, 0.5rem)'
            }}
          >
            {descriptionError}
          </p>
        )}
      </div>

      {/* Approximate Time */}
      <div 
        style={{ 
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)'
        }}
      >
        <label className="label">
          <span className="label-text" style={{ color: 'var(--color-primary-color)' }}>
            Approximate Time to Complete <span style={{ color: '#dc2626' }}>*</span>
          </span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className="badge badge-lg cursor-pointer transition-colors"
              style={{
                backgroundColor: selectedTime === time ? 'var(--color-primary-color)' : 'var(--color-secondary-background)',
                color: selectedTime === time ? '#ffffff' : 'var(--color-primary-color)',
                border: 'none',
                padding: '0.75rem 1rem'
              }}
            >
              {time}
            </button>
          ))}
          <button
            onClick={() => setShowCustomTime(!showCustomTime)}
            className="badge badge-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--color-secondary-background)',
              color: 'var(--color-accent-100)',
              border: 'none',
              padding: '0.75rem 1rem'
            }}
          >
            + More
          </button>
        </div>
        
        {showCustomTime && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomTimeAdd()}
              className="input input-sm flex-1"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-shade-primary)',
                color: 'var(--color-primary-color)'
              }}
              placeholder="Enter custom time (e.g., 20-30 min)"
            />
            <button
              onClick={handleCustomTimeAdd}
              className="btn btn-sm"
              style={{
                backgroundColor: 'var(--color-accent-100)',
                borderColor: 'var(--color-accent-100)',
                color: '#ffffff'
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-8">
        <label className="label">
          <span className="label-text" style={{ color: 'var(--color-primary-color)' }}>
            Survey Tags
          </span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {predefinedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className="badge badge-lg cursor-pointer transition-colors"
              style={{
                backgroundColor: tags.includes(tag) ? 'var(--color-primary-color)' : 'var(--color-secondary-background)',
                color: tags.includes(tag) ? '#ffffff' : 'var(--color-primary-color)',
                border: 'none',
                padding: '0.75rem 1rem'
              }}
            >
              {tag}
            </button>
          ))}
          <button
            onClick={() => setShowCustomTag(!showCustomTag)}
            className="badge badge-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--color-secondary-background)',
              color: 'var(--color-accent-100)',
              border: 'none',
              padding: '0.75rem 1rem'
            }}
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
              className="input input-sm flex-1"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-shade-primary)',
                color: 'var(--color-primary-color)'
              }}
              placeholder="Enter custom tag (max 16 chars)"
            />
            <button
              onClick={handleCustomTagAdd}
              className="btn btn-sm"
              style={{
                backgroundColor: 'var(--color-accent-100)',
                borderColor: 'var(--color-accent-100)',
                color: '#ffffff'
              }}
            >
              Add
            </button>
          </div>
        )}

        {/* Selected Tags */}
        {tags.length > 0 && (
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Selected Tags:
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="badge badge-lg gap-2"
                  style={{
                    backgroundColor: 'var(--color-accent-100)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1rem'
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70"
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
        className="btn w-full"
        style={{
          backgroundColor: 'var(--color-primary-color)',
          borderColor: 'var(--color-primary-color)',
          color: '#ffffff'
        }}
      >
        Continue
      </button>
    </div>
  );
}