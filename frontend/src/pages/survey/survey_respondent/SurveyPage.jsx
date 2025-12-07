import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { submitSurveyResponse } from '../../../services/survey/survey.service';
import {
  SurveyResultScreen,
  SurveyAlreadyAnswered,
  SurveyHeader,
  SurveySectionHeader,
  SurveyNavigation,
  SurveyProgressIndicator,
  SurveyLoadingModal,
  SurveyNotFound,
  SurveyQuestion,
  isValidEmail
} from '../../../components/survey';

export default function SurveyPage() {
  const { answerCheck, surveyData: loaderSurveyData } = useLoaderData();
  const navigate = useNavigate();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  
  const surveyData = loaderSurveyData?.message;
  const isAlreadyAnswered = answerCheck?.is_answered === true;

  // Success/Error Screen after submission
  if (submitResult) {
    return (
      <SurveyResultScreen
        submitResult={submitResult}
        surveyTitle={surveyData?.survey_title}
        onTryAgain={() => setSubmitResult(null)}
        onGoHome={() => navigate('/home')}
      />
    );
  }

  // Show message if survey is already answered
  if (isAlreadyAnswered) {
    return <SurveyAlreadyAnswered message={answerCheck?.message} />;
  }

  if (!surveyData) {
    return <SurveyNotFound />;
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
      
      // console.log('=== SURVEY SUBMISSION ===');
      // console.log(JSON.stringify(submissionData, null, 2));
      // console.log('=== END ===');
      
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

  return (
    <div className="min-h-screen bg-background py-8 lg:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Survey Header - Only show on first section */}
        {isFirstSection && (
          <SurveyHeader
            title={surveyData.survey_title}
            description={surveyData.survey_content}
            approxTime={surveyData.survey_approx_time}
          />
        )}

        {/* Section Header */}
        <SurveySectionHeader
          title={currentSection.section_title}
          description={currentSection.section_description}
          currentIndex={currentSectionIndex}
          totalSections={surveyData.survey_section.length}
        />

        {/* Questions */}
        {currentSection.questions.map((question, index) => (
          <SurveyQuestion
            key={question.question_id}
            question={question}
            index={index}
            value={responses[question.question_id]?.answer}
            onChange={(value) => handleInputChange(question.question_id, value)}
            onMultipleChoiceChange={(optionId, q) => handleMultipleChoiceChange(question.question_id, optionId, q)}
            error={errors[question.question_id]}
          />
        ))}

        {/* Navigation Buttons */}
        <SurveyNavigation
          isFirstSection={isFirstSection}
          isLastSection={isLastSection}
          isSubmitting={isSubmitting}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />

        {/* Loading Modal */}
        <SurveyLoadingModal isVisible={isSubmitting} />

        {/* Progress Indicator */}
        <SurveyProgressIndicator
          totalSections={surveyData.survey_section.length}
          currentIndex={currentSectionIndex}
        />
      </div>
    </div>
  );
}