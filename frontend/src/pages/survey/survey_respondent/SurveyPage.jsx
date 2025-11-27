import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { submitSurveyResponse } from '../../../services/survey/survey.service';
import { MdArrowBack, MdArrowForward, MdStar, MdStarBorder, MdCheckCircle, MdError, MdHome } from 'react-icons/md';

export default function SurveyPage() {
  const { answerCheck, surveyData: loaderSurveyData } = useLoaderData();
  const navigate = useNavigate();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { success: boolean, message: string }
  
  const surveyData = loaderSurveyData?.message;
  const isAlreadyAnswered = answerCheck?.is_answered === true;

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Success/Error Screen after submission
  if (submitResult) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#ffffff', maxWidth: '500px', width: '90%' }}>
          {submitResult.success ? (
            <>
              <MdCheckCircle 
                className="mx-auto mb-4" 
                style={{ fontSize: '5rem', color: '#22c55e' }} 
              />
              <h2 
                className="text-2xl font-semibold mb-4" 
                style={{ color: 'var(--color-primary-color)' }}
              >
                Response Submitted!
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {submitResult.message || 'Thank you for completing this survey. Your response has been recorded.'}
              </p>
              <div className="border-t pt-6" style={{ borderColor: 'var(--color-secondary-background)' }}>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {surveyData?.survey_title}
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="btn gap-2"
                  style={{
                    backgroundColor: 'var(--color-accent-100)',
                    borderColor: 'var(--color-accent-100)',
                    color: '#ffffff'
                  }}
                >
                  <MdHome style={{ fontSize: '1.25rem' }} />
                  Back to Home
                </button>
              </div>
            </>
          ) : (
            <>
              <MdError 
                className="mx-auto mb-4" 
                style={{ fontSize: '5rem', color: '#dc2626' }} 
              />
              <h2 
                className="text-2xl font-semibold mb-4" 
                style={{ color: 'var(--color-primary-color)' }}
              >
                Submission Failed
              </h2>
              <p className="mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                {Array.isArray(submitResult.message) 
                  ? submitResult.message.join(', ') 
                  : submitResult.message || 'Something went wrong. Please try again.'}
              </p>
              {submitResult.extraMsg && (
                <p className="text-sm mb-4" style={{ color: '#dc2626' }}>
                  {submitResult.extraMsg}
                </p>
              )}
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => setSubmitResult(null)}
                  className="btn"
                  style={{
                    backgroundColor: 'var(--color-primary-color)',
                    borderColor: 'var(--color-primary-color)',
                    color: '#ffffff'
                  }}
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="btn btn-outline"
                  style={{
                    borderColor: 'var(--color-primary-color)',
                    color: 'var(--color-primary-color)'
                  }}
                >
                  Go Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Show message if survey is already answered
  if (isAlreadyAnswered) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#ffffff', maxWidth: '500px' }}>
          <MdCheckCircle 
            className="mx-auto mb-4" 
            style={{ fontSize: '4rem', color: 'var(--color-accent-100)' }} 
          />
          <h2 
            className="text-2xl font-semibold mb-4" 
            style={{ color: 'var(--color-primary-color)' }}
          >
            Survey Already Completed
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {answerCheck?.message || 'You have already answered this survey'}
          </p>
        </div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-text-secondary)' }}>Survey not found</p>
        </div>
      </div>
    );
  }

  const currentSection = surveyData.survey_section[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === surveyData.survey_section.length - 1;

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        answer: value,
        section: currentSection.section_id
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
      if (currentAnswers.length < question.question_maxChoice) {
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
        section: currentSection.section_id
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
      const answer = responses[question.question_id]?.answer;
      
      // Check required fields
      if (question.question_required) {
        if (!answer || 
            (Array.isArray(answer) && answer.length === 0) || 
            (typeof answer === 'string' && answer.trim() === '')) {
          newErrors[question.question_id] = 'This question is required';
          return; // Skip other validations if empty
        }
        
        // Validate multiple choice min/max
        if (question.question_type === 'Multiple Choice' && Array.isArray(answer)) {
          if (answer.length < question.question_minChoice) {
            newErrors[question.question_id] = `Please select at least ${question.question_minChoice} option(s)`;
          }
        }
      }
      
      // Email validation (even if not required, validate format if provided)
      if (['email', 'Email'].includes(question.question_type) && answer && answer.trim() !== '') {
        if (!isValidEmail(answer)) {
          newErrors[question.question_id] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSectionIndex(prev => Math.min(prev + 1, surveyData.survey_section.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentSectionIndex(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (validateSection()) {
      setIsSubmitting(true);
      
      // Transform responses to match backend format
      const responsesBySection = {};
      
      Object.entries(responses).forEach(([questionId, responseData]) => {
        const sectionId = responseData.section;
        
        if (!responsesBySection[sectionId]) {
          responsesBySection[sectionId] = {};
        }
        
        // Find the question to determine its type
        const question = surveyData.survey_section
          .flatMap(section => section.questions)
          .find(q => q.question_id === questionId);
        
        if (!question) {
          console.warn(`Question ${questionId} not found`);
          return;
        }
        
        // Get the actual answer value
        let answerValue = responseData.answer;
        
        // Handle checkbox/multiple choice - MUST remain as array
        if (['checkBox', 'multipleChoice', 'Checkbox', 'Multiple Choice'].includes(question.question_type)) {
          // Ensure it's an array
          if (!Array.isArray(answerValue)) {
            answerValue = answerValue ? [answerValue] : [];
          }
          
          // Convert option IDs to option text if needed
          if (question.question_choices) {
            answerValue = answerValue.map(selectedId => {
              if (typeof selectedId === 'string' && question.question_choices.includes(selectedId)) {
                return selectedId;
              }
              const option = question.question_choices.find(opt => 
                typeof opt === 'object' && opt.pk_option_id === selectedId
              );
              return option ? option.option_text : selectedId;
            });
          }
        } 
        // Handle all other question types - single value
        else {
          // For choice-based questions (radio/dropdown), convert ID to text if needed
          if (['radioButton', 'singleChoice', 'Radio Button', 'Single Choice', 'dropdown', 'Dropdown'].includes(question.question_type)) {
            if (question.question_choices && question.question_choices.length > 0) {
              if (typeof answerValue === 'string' && question.question_choices.includes(answerValue)) {
                // Already a string value
              } else {
                const option = question.question_choices.find(opt => 
                  typeof opt === 'object' && opt.pk_option_id === answerValue
                );
                if (option) {
                  answerValue = option.option_text;
                }
              }
            }
          }
          // For text/rating/date inputs, keep the value as-is (single value)
        }
        
        responsesBySection[sectionId][questionId] = answerValue;
      });
      
      const submissionData = {
        surveyTitle: surveyData.survey_title,
        surveyDescription: surveyData.survey_content,
        submittedAt: new Date().toISOString(),
        responses: responsesBySection
      };
      
      console.log('=== SURVEY SUBMISSION ===');
      console.log(JSON.stringify(submissionData, null, 2));
      console.log('=== END ===');
      
      try {
        const res = await submitSurveyResponse(surveyData.pk_survey_id, submissionData);

        if (res && res.ok) {
          setSubmitResult({
            success: true,
            message: res.message || 'Your response has been recorded successfully!'
          });
        } else {
          setSubmitResult({
            success: false,
            message: res?.message || 'Failed to submit survey. Please try again.',
            extraMsg: res?.extra_msg
          });
        }
      } catch (error) {
        console.error('Error submitting survey:', error);
        setSubmitResult({
          success: false,
          message: 'An unexpected error occurred. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderQuestion = (question) => {
    const hasError = errors[question.question_id];

    switch (question.question_type) {
      case 'shortText':
      case 'Short Text':
      case 'Text':
      case 'textInput':
        return (
          <input
            type="text"
            value={responses[question.question_id]?.answer || ''}
            onChange={(e) => handleInputChange(question.question_id, e.target.value)}
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
            value={responses[question.question_id]?.answer || ''}
            onChange={(e) => handleInputChange(question.question_id, e.target.value)}
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

      case 'number':
      case 'Number':
        return (
          <input
            type="number"
            value={responses[question.question_id]?.answer || ''}
            onChange={(e) => handleInputChange(question.question_id, e.target.value)}
            onKeyDown={(e) => {
              // Allow: backspace, delete, tab, escape, enter, decimal point
              if ([46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) ||
                  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                  (e.keyCode === 65 && e.ctrlKey === true) ||
                  (e.keyCode === 67 && e.ctrlKey === true) ||
                  (e.keyCode === 86 && e.ctrlKey === true) ||
                  (e.keyCode === 88 && e.ctrlKey === true) ||
                  // Allow: home, end, left, right
                  (e.keyCode >= 35 && e.keyCode <= 39) ||
                  // Allow: minus sign for negative numbers
                  e.keyCode === 189 || e.keyCode === 109) {
                return;
              }
              // Ensure that it is a number and stop the keypress if not
              if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
              }
            }}
            className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)'
            }}
            placeholder="Enter a number"
          />
        );

      case 'email':
      case 'Email':
        const emailValue = responses[question.question_id]?.answer || '';
        const isEmailInvalid = emailValue && !isValidEmail(emailValue);
        return (
          <div>
            <label className="input input-bordered flex items-center gap-2 w-full validator" style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError || isEmailInvalid ? '#dc2626' : 'var(--color-shade-primary)',
            }}>
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                value={emailValue}
                onChange={(e) => handleInputChange(question.question_id, e.target.value)}
                className="grow bg-transparent border-none outline-none"
                style={{
                  color: 'var(--color-primary-color)'
                }}
                placeholder="your.email@example.com"
              />
            </label>
            {isEmailInvalid && !hasError && (
              <p className="text-sm mt-2 flex items-center gap-1" style={{ color: '#dc2626' }}>
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
                Please enter a valid email address
              </p>
            )}
          </div>
        );

      case 'date':
      case 'Date':
        return (
          <input
            type="date"
            value={responses[question.question_id]?.answer || ''}
            onChange={(e) => handleInputChange(question.question_id, e.target.value)}
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
        const maxRating = question.question_maxRating || question.question_maxChoice || 5;
        return (
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(question.question_id, star)}
                className="btn btn-ghost btn-lg p-0"
                style={{ color: 'var(--color-accent-100)' }}
              >
                {responses[question.question_id]?.answer >= star ? (
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
            {responses[question.question_id]?.answer && (
              <span 
                className="ml-3 self-center" 
                style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                }}
              >
                {responses[question.question_id]?.answer} / {maxRating}
              </span>
            )}
          </div>
        );

      case 'radioButton':
      case 'singleChoice':
      case 'Radio Button':
      case 'Single Choice':
        if (!question.question_choices || question.question_choices.length === 0) {
          return <p style={{ color: 'var(--color-text-secondary)' }}>No options available</p>;
        }
        return (
          <div className="space-y-2">
            {question.question_choices.map((option, idx) => {
              const optionId = typeof option === 'string' ? option : option.pk_option_id;
              const optionText = typeof option === 'string' ? option : option.option_text;
              return (
                <label
                  key={optionId || idx}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors"
                  style={{
                    backgroundColor: responses[question.question_id]?.answer === optionId
                      ? 'rgba(80, 87, 233, 0.1)'
                      : 'var(--color-background)'
                  }}
                >
                  <input
                    type="radio"
                    name={question.question_id}
                    checked={responses[question.question_id]?.answer === optionId}
                    onChange={() => handleInputChange(question.question_id, optionId)}
                    className="radio"
                    style={{ borderColor: 'var(--color-accent-100)' }}
                  />
                  <span style={{ color: 'var(--color-primary-color)' }}>{optionText}</span>
                </label>
              );
            })}
          </div>
        );

      case 'checkBox':
      case 'multipleChoice':
      case 'Checkbox':
      case 'Multiple Choice':
        if (!question.question_choices || question.question_choices.length === 0) {
          return <p style={{ color: 'var(--color-text-secondary)' }}>No options available</p>;
        }
        const selectedCount = (responses[question.question_id]?.answer || []).length;
        return (
          <div>
            {question.question_maxChoice > 1 && (
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Select {question.question_minChoice === question.question_maxChoice 
                  ? `exactly ${question.question_maxChoice}`
                  : `${question.question_minChoice} to ${question.question_maxChoice}`} option(s)
                {selectedCount > 0 && ` (${selectedCount} selected)`}
              </p>
            )}
            <div className="space-y-2">
              {question.question_choices.map((option, idx) => {
                const optionId = typeof option === 'string' ? option : option.pk_option_id;
                const optionText = typeof option === 'string' ? option : option.option_text;
                const isSelected = (responses[question.question_id]?.answer || []).includes(optionId);
                return (
                  <label
                    key={optionId || idx}
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
                      onChange={() => handleMultipleChoiceChange(question.question_id, optionId, question)}
                      className="checkbox"
                      style={{ borderColor: 'var(--color-accent-100)' }}
                    />
                    <span style={{ color: 'var(--color-primary-color)' }}>{optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'dropdown':
      case 'Dropdown':
        if (!question.question_choices || question.question_choices.length === 0) {
          return <p style={{ color: 'var(--color-text-secondary)' }}>No options available</p>;
        }
        return (
          <select
            value={responses[question.question_id]?.answer || ''}
            onChange={(e) => handleInputChange(question.question_id, e.target.value)}
            className={`select select-bordered w-full ${hasError ? 'select-error' : ''}`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)'
            }}
          >
            <option value="">Choose an option</option>
            {question.question_choices.map((option, idx) => {
              const optionId = typeof option === 'string' ? option : option.pk_option_id;
              const optionText = typeof option === 'string' ? option : option.option_text;
              return (
                <option key={optionId || idx} value={optionId}>
                  {optionText}
                </option>
              );
            })}
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
              {surveyData.survey_title}
            </h1>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
              }}
            >
              {surveyData.survey_content}
            </p>
            {surveyData.survey_approx_time && (
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
                  ⏱️ {surveyData.survey_approx_time}
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
              {currentSection.section_title}
            </h2>
            <span 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.75rem, 1.25vw, 0.9375rem)'
              }}
            >
              Section {currentSectionIndex + 1} of {surveyData.survey_section.length}
            </span>
          </div>
          {currentSection.section_description && (
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
              }}
            >
              {currentSection.section_description}
            </p>
          )}
        </div>

        {/* Questions */}
        {currentSection.questions.map((question, index) => (
          <div
            key={question.question_id}
            className="rounded-xl shadow-lg p-6 mb-4"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-4">
              <label className="block mb-2">
                <span style={{ color: 'var(--color-primary-color)' }}>
                  {index + 1}. {question.question_text}
                  {question.question_required && (
                    <span style={{ color: '#dc2626' }}> *</span>
                  )}
                </span>
              </label>

              {/* Question Image */}
              {question.question_image && (
                <div className="mb-4">
                  <img
                    src={typeof question.question_image === 'string' ? question.question_image : question.question_image?.img_url}
                    alt="Question"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}

              {/* Question Video */}
              {question.question_url && (
                <div className="mb-4">
                  <iframe
                    width="100%"
                    height="315"
                    src={question.question_url.includes('youtu') 
                      ? question.question_url.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/')
                      : question.question_url}
                    title="Question video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}

              {renderQuestion(question)}

              {errors[question.question_id] && (
                <p className="text-sm mt-2" style={{ color: '#dc2626' }}>
                  {errors[question.question_id]}
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
              disabled={isSubmitting}
              className="btn flex-1"
              style={{
                backgroundColor: 'var(--color-accent-100)',
                borderColor: 'var(--color-accent-100)',
                color: '#ffffff',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                'Submit Survey'
              )}
            </button>
          )}
        </div>

        {/* Loading Modal */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="p-8 rounded-xl shadow-xl text-center" style={{ backgroundColor: '#ffffff', maxWidth: '300px' }}>
              <span className="loading loading-spinner loading-lg" style={{ color: 'var(--color-accent-100)' }}></span>
              <p className="mt-4 font-medium" style={{ color: 'var(--color-primary-color)' }}>
                Submitting your response...
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Please wait
              </p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6">
          <div className="flex justify-center gap-2">
            {surveyData.survey_section.map((_, index) => (
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