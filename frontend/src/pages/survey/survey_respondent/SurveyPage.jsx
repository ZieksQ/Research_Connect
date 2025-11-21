import { useState } from 'react';
import { sampleSurveyData } from './sampleSurveyData';
import { MdArrowBack, MdArrowForward, MdStar, MdStarBorder } from 'react-icons/md';

export default function SurveyPage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const surveyData = sampleSurveyData;
  const currentSection = surveyData.data[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === surveyData.data.length - 1;

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        answer: value,
        section: currentSection.id
      }
    }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleMultipleChoiceChange = (questionId, optionId, question) => {
    const currentAnswers = responses[questionId]?.answer || [];
    let newAnswers;

    if (currentAnswers.includes(optionId)) {
      // Remove if already selected
      newAnswers = currentAnswers.filter(id => id !== optionId);
    } else {
      // Add if not selected, but check max limit
      if (currentAnswers.length < question.maxChoices) {
        newAnswers = [...currentAnswers, optionId];
      } else {
        // Replace the first selected if at max
        newAnswers = [...currentAnswers.slice(1), optionId];
      }
    }

    setResponses(prev => ({
      ...prev,
      [questionId]: {
        answer: newAnswers,
        section: currentSection.id
      }
    }));

    // Clear error
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateSection = () => {
    const newErrors = {};
    
    currentSection.questions.forEach(question => {
      if (question.required) {
        const answer = responses[question.id]?.answer;
        
        if (!answer || 
            (Array.isArray(answer) && answer.length === 0) || 
            (typeof answer === 'string' && answer.trim() === '')) {
          newErrors[question.id] = 'This question is required';
        }
        
        // Validate multiple choice min/max
        if (question.type === 'Multiple Choice' && Array.isArray(answer)) {
          if (answer.length < question.minChoices) {
            newErrors[question.id] = `Please select at least ${question.minChoices} option(s)`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSectionIndex(prev => Math.min(prev + 1, surveyData.data.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentSectionIndex(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (validateSection()) {
      // Transform responses to group by section
      const responsesBySection = {};
      
      Object.entries(responses).forEach(([questionId, responseData]) => {
        const sectionId = responseData.section;
        
        if (!responsesBySection[sectionId]) {
          responsesBySection[sectionId] = {};
        }
        
        responsesBySection[sectionId][questionId] = responseData.answer;
      });
      
      const submissionData = {
        surveyTitle: surveyData.surveyTitle,
        surveyDescription: surveyData.surveyDescription,
        submittedAt: new Date().toISOString(),
        responses: responsesBySection
      };
      
      console.log('=== SURVEY SUBMISSION ===');
      console.log(JSON.stringify(submissionData, null, 2));
      console.log('=== END ===');
      
      alert('Survey submitted successfully! Check the console for the response data.');
    }
  };

  const renderQuestion = (question) => {
    const hasError = errors[question.id];

    switch (question.type) {
      case 'shortText':
      case 'Short Text':
      case 'Text':
        return (
          <input
            type="text"
            value={responses[question.id]?.answer || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)'
            }}
            placeholder="Your answer"
          />
        );

      case 'longText':
      case 'Long Text':
      case 'Essay':
        return (
          <textarea
            value={responses[question.id]?.answer || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`textarea textarea-bordered w-full ${hasError ? 'textarea-error' : ''}`}
            rows="5"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)'
            }}
            placeholder="Your answer"
          />
        );

      case 'email':
      case 'Email':
        return (
          <input
            type="email"
            value={responses[question.id]?.answer || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)'
            }}
            placeholder="your.email@example.com"
          />
        );

      case 'date':
      case 'Date':
        return (
          <input
            type="date"
            value={responses[question.id]?.answer || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)'
            }}
          />
        );

      case 'rating':
      case 'Rating':
        const maxRating = question.maxRating || 5;
        return (
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(question.id, star)}
                className="btn btn-ghost btn-lg p-0"
                style={{ color: 'var(--color-accent-100)' }}
              >
                {responses[question.id]?.answer >= star ? (
                  <MdStar 
                    style={{ 
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)'
                    }} 
                  />
                ) : (
                  <MdStarBorder 
                    style={{ 
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)'
                    }} 
                  />
                )}
              </button>
            ))}
            {responses[question.id]?.answer && (
              <span 
                className="ml-3 self-center" 
                style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                }}
              >
                {responses[question.id]?.answer} / {maxRating}
              </span>
            )}
          </div>
        );

      case 'radioButton':
      case 'singleChoice':
      case 'Radio Button':
      case 'Single Choice':
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: responses[question.id]?.answer === option.id
                    ? 'rgba(80, 87, 233, 0.1)'
                    : 'var(--color-background)'
                }}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={responses[question.id]?.answer === option.id}
                  onChange={() => handleInputChange(question.id, option.id)}
                  className="radio"
                  style={{ borderColor: 'var(--color-accent-100)' }}
                />
                <span style={{ color: 'var(--color-primary-color)' }}>{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkBox':
      case 'multipleChoice':
      case 'Checkbox':
      case 'Multiple Choice':
        const selectedCount = (responses[question.id]?.answer || []).length;
        return (
          <div>
            {question.maxChoices > 1 && (
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Select {question.minChoices === question.maxChoices 
                  ? `exactly ${question.maxChoices}`
                  : `${question.minChoices} to ${question.maxChoices}`} option(s)
                {selectedCount > 0 && ` (${selectedCount} selected)`}
              </p>
            )}
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = (responses[question.id]?.answer || []).includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors"
                    style={{
                      backgroundColor: isSelected
                        ? 'rgba(80, 87, 233, 0.1)'
                        : 'var(--color-background)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultipleChoiceChange(question.id, option.id, question)}
                      className="checkbox"
                      style={{ borderColor: 'var(--color-accent-100)' }}
                    />
                    <span style={{ color: 'var(--color-primary-color)' }}>{option.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'dropdown':
      case 'Dropdown':
        return (
          <select
            value={responses[question.id]?.answer || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`select select-bordered w-full ${hasError ? 'select-error' : ''}`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)'
            }}
          >
            <option value="">Choose an option</option>
            {question.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div 
        className="mx-auto" 
        style={{ 
          maxWidth: 'clamp(768px, 75vw, 1200px)',
          padding: 'clamp(1rem, 2vw, 2rem)'
        }}
      >
        {/* Survey Header - Only show on first section */}
        {isFirstSection && (
          <div 
            className="rounded-xl shadow-lg mb-6 border-t-8 border-primary" 
            style={{ 
              backgroundColor: '#ffffff',
              padding: 'clamp(2rem, 4vw, 3.5rem)'
            }}
          >
            {/* Blue Line Removed Because its not aligned at the top for bigger screen size */}
            {/* <div className="border-t-8 rounded-t-xl" style={{ 
              borderColor: 'var(--color-accent-100)',
              marginTop: 'clamp(-2rem, -4vw, -3.5rem)',
              marginLeft: 'clamp(-2rem, -4vw, -3.5rem)',
              marginRight: 'clamp(-2rem, -4vw, -3.5rem)',
              marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)'
            }}></div> */}
            <h1 
              style={{ 
                color: 'var(--color-primary-color)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
              }}
            >
              {surveyData.surveyTitle}
            </h1>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
              }}
            >
              {surveyData.surveyDescription}
            </p>
            {surveyData.surveyApproxTime && (
              <div className="flex items-center gap-2">
                <div 
                  className="badge" 
                  style={{ 
                    backgroundColor: 'var(--color-secondary-background)',
                    color: 'var(--color-primary-color)',
                    border: 'none',
                    padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem)',
                    fontSize: 'clamp(0.75rem, 1.25vw, 0.9375rem)'
                  }}
                >
                  ⏱️ {surveyData.surveyApproxTime}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section Header */}
        <div 
          className="rounded-xl shadow-lg mb-6" 
          style={{ 
            backgroundColor: '#ffffff',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 
              style={{ 
                color: 'var(--color-primary-color)',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)'
              }}
            >
              {currentSection.title}
            </h2>
            <span 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.75rem, 1.25vw, 0.9375rem)'
              }}
            >
              Section {currentSectionIndex + 1} of {surveyData.data.length}
            </span>
          </div>
          {currentSection.description && (
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
              }}
            >
              {currentSection.description}
            </p>
          )}
        </div>

        {/* Questions */}
        {currentSection.questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-xl shadow-lg p-6 mb-4"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-4">
              <label className="block mb-2">
                <span style={{ color: 'var(--color-primary-color)' }}>
                  {index + 1}. {question.title}
                  {question.required && (
                    <span style={{ color: '#dc2626' }}> *</span>
                  )}
                </span>
              </label>

              {/* Question Image */}
              {question.image && (
                <div className="mb-4">
                  <img
                    src={question.image.preview || question.image}
                    alt="Question"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}

              {/* Question Video */}
              {question.video && (
                <div className="mb-4">
                  <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--color-background)' }}>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      📹 Video attached
                    </span>
                    <a
                      href={question.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                      style={{ color: 'var(--color-accent-100)' }}
                    >
                      View
                    </a>
                  </div>
                </div>
              )}

              {renderQuestion(question)}

              {errors[question.id] && (
                <p className="text-sm mt-2" style={{ color: '#dc2626' }}>
                  {errors[question.id]}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {!isFirstSection && (
            <button
              onClick={handleBack}
              className="btn"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--color-primary-color)',
                color: 'var(--color-primary-color)'
              }}
            >
              <MdArrowBack /> Back
            </button>
          )}

          {!isLastSection ? (
            <button
              onClick={handleNext}
              className="btn flex-1"
              style={{
                backgroundColor: 'var(--color-primary-color)',
                borderColor: 'var(--color-primary-color)',
                color: '#ffffff'
              }}
            >
              Next <MdArrowForward />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn flex-1"
              style={{
                backgroundColor: 'var(--color-accent-100)',
                borderColor: 'var(--color-accent-100)',
                color: '#ffffff'
              }}
            >
              Submit Survey
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6">
          <div className="flex justify-center gap-2">
            {surveyData.data.map((_, index) => (
              <div
                key={index}
                className="h-2 rounded-full transition-all"
                style={{
                  width: index === currentSectionIndex ? '32px' : '8px',
                  backgroundColor: index <= currentSectionIndex
                    ? 'var(--color-accent-100)'
                    : 'var(--color-secondary-background)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}