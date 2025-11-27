import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyDetailsPage from './SurveyDetailsPage';
import TargetAudiencePage from './TargetAudiencePage';
import SortableForm from './SortableForm';
import SurveyPreviewPage from './SurveyPreviewPage';
import { publishSurvey } from '../../../services/survey/survey.service';
import { MdCheckCircle, MdError, MdClose } from 'react-icons/md';
// import { MdCheck } from 'react-icons/md';
// import { log } from 'three';

export default function SurveyWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [publishModal, setPublishModal] = useState({ show: false, success: false, message: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyDescription: '',
    surveyApproxTime: '',
    surveyTags: [],
    target: '',
    data: []
  });

  const steps = [
    { name: 'Create Your Survey', component: SurveyDetailsPage },
    { name: 'Target Audience', component: TargetAudiencePage },
    { name: 'Survey Questions', component: SortableForm },
    { name: 'Review & Publish', component: SurveyPreviewPage }
  ];

  const updateSurveyData = (newData) => {
    setSurveyData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = (data) => {
    if (data) {
      updateSurveyData(data);
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Auto-close modal and navigate on success
  useEffect(() => {
    if (publishModal.show && publishModal.success) {
      const timer = setTimeout(() => {
        setPublishModal({ show: false, success: false, message: '' });
        navigate('/home');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [publishModal, navigate]);

  const handlePublish = async () => {
    // Helper function to convert type to camelCase
    const typeToCamelCase = (type) => {
      const typeMap = {
        'Short Text': 'shortText',
        'Long Text': 'longText',
        'Radio Button': 'radioButton',
        'Checkbox': 'checkBox',
        'Rating': 'rating',
        'Dropdown': 'dropdown',
        'Date': 'date',
        'Email': 'email',
        'Number': 'number'
      };
      return typeMap[type] || type.toLowerCase();
    };

    // Create FormData to handle images
    const formData = new FormData();

    // Prepare survey data for JSON (without File objects)
    const surveyDataForJson = {
      surveyTitle: surveyData.surveyTitle,
      surveyDescription: surveyData.surveyDescription,
      surveyApproxTime: surveyData.surveyApproxTime,
      surveyTags: surveyData.surveyTags,
      target: surveyData.target,
      data: surveyData.data.map((section) => ({
        ...section,
        questions: section.questions.map((question) => {
          const questionData = { 
            ...question,
            type: typeToCamelCase(question.type) // Convert type to camelCase
          };

          // Replace image File object with metadata only
          if (question.image && question.image.file) {
            questionData.image = {
              name: question.image.name,
              type: question.image.type,
              size: question.image.size,
              fieldName: `image_${question.id}`,
            };
          }

          return questionData;
        }),
      })),
    };

    // Add survey JSON data to FormData
    formData.append('surveyData', JSON.stringify(surveyDataForJson));

    // Add all image files to FormData
    surveyData.data.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.image && question.image.file) {
          formData.append(`image_${question.id}`, question.image.file);
        }
      });
    });

    // Log what we're sending
    console.log("=== SURVEY PUBLISHED WITH FORMDATA ===");
    console.log("\nSurvey JSON Data:");
    console.log(JSON.stringify(surveyDataForJson, null, 2));
    console.log("\nFormData Contents:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log("=== END ===");

    setIsPublishing(true);
    try {
      const response = await publishSurvey(formData);
      
      if (response && response.ok) {
        setPublishModal({
          show: true,
          success: true,
          message: response.message || 'Survey published successfully!'
        });
      } else {
        setPublishModal({
          show: true,
          success: false,
          message: response?.message || 'Failed to publish survey. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error publishing survey:', error);
      setPublishModal({
        show: true,
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div 
        className="mx-auto" 
        style={{ 
          maxWidth: 'clamp(960px, 85vw, 1400px)',
          padding: 'clamp(1rem, 2vw, 2rem)'
        }}
      >
        {/* Header */}
        <div 
          className="rounded-xl shadow-lg mb-6" 
          style={{ 
            backgroundColor: 'var(--color-secondary-background)',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)'
          }}
        >
          <h1 
            className="text-center" 
            style={{ 
              color: 'var(--color-primary-color)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              marginBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)'
            }}
          >
            Create Survey
          </h1>
          <p 
            className="text-center" 
            style={{ 
              color: 'var(--color-text-secondary)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
            }}
          >
            {steps[currentStep].name}
          </p>
        </div>

        {/* Progress Stepper */}
        <div 
          className="flex justify-center" 
          style={{ 
            marginBottom: 'clamp(2rem, 3vw, 3rem)'
          }}
        >
          <ul className="steps">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`step ${index <= currentStep ? 'step-primary' : ''} ${
                  index < currentStep ? 'cursor-pointer' : ''
                }`}
                style={{
                  '--step-color': 'var(--color-primary-color)',
                  fontSize: 'clamp(0.75rem, 1.25vw, 1rem)'
                }}
                onClick={() => index < currentStep && setCurrentStep(index)}
              >
                <span className="hidden md:inline">{step.name}</span>
                <span className="md:hidden">Step {index + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current Step Content */}
        <CurrentStepComponent
          data={surveyData}
          onNext={handleNext}
          onBack={handleBack}
          updateData={updateSurveyData}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          isLastStep={currentStep === steps.length - 1}
          isFirstStep={currentStep === 0}
        />
      </div>

      {/* Publishing Loading Overlay */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="p-8 rounded-xl shadow-xl text-center" style={{ backgroundColor: '#ffffff', maxWidth: '300px' }}>
            <span className="loading loading-spinner loading-lg" style={{ color: 'var(--color-accent-100)' }}></span>
            <p className="mt-4 font-medium" style={{ color: 'var(--color-primary-color)' }}>
              Publishing your survey...
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              Please wait
            </p>
          </div>
        </div>
      )}

      {/* Publish Result Modal */}
      {publishModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="p-8 rounded-xl shadow-xl text-center" style={{ backgroundColor: '#ffffff', maxWidth: '400px', width: '90%' }}>
            {publishModal.success ? (
              <>
                <MdCheckCircle 
                  className="mx-auto mb-4" 
                  style={{ fontSize: '4rem', color: '#22c55e' }} 
                />
                <h2 
                  className="text-xl font-semibold mb-3" 
                  style={{ color: 'var(--color-primary-color)' }}
                >
                  Success!
                </h2>
                <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {publishModal.message}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Redirecting to home in 3 seconds...
                </p>
              </>
            ) : (
              <>
                <MdError 
                  className="mx-auto mb-4" 
                  style={{ fontSize: '4rem', color: '#dc2626' }} 
                />
                <h2 
                  className="text-xl font-semibold mb-3" 
                  style={{ color: 'var(--color-primary-color)' }}
                >
                  Publishing Failed
                </h2>
                <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {publishModal.message}
                </p>
                <button
                  onClick={() => setPublishModal({ show: false, success: false, message: '' })}
                  className="btn"
                  style={{
                    backgroundColor: 'var(--color-primary-color)',
                    borderColor: 'var(--color-primary-color)',
                    color: '#ffffff'
                  }}
                >
                  <MdClose className="mr-1" /> Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock function to simulate survey publishing
// async function publishSurvey(surveyData) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ success: true, message: 'Survey published successfully!' });
//     }, 1000);
//   });
// }