import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SurveyDetailsPage from './SurveyDetailsPage';
import TargetAudiencePage from './TargetAudiencePage';
import SortableForm from './SortableForm';
import SurveyPreviewPage from './SurveyPreviewPage';
import { publishSurvey } from '../../../services/survey/survey.service';
import { MdCheckCircle, MdError, MdClose, MdVpnKey } from 'react-icons/md';
// import { MdCheck } from 'react-icons/md';
// import { log } from 'three';

export default function SurveyWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [postCode, setPostCode] = useState('');
  const [publishModal, setPublishModal] = useState({ show: false, success: false, message: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyContent: '',
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

  // Step 1: Show confirmation modal when publish is clicked
  const handlePublishClick = () => {
    setShowConfirmModal(true);
  };

  // Step 2: After confirmation, show code input modal
  const handleConfirmPublish = () => {
    setShowConfirmModal(false);
    setShowCodeModal(true);
  };

  // Step 3a: Submit with code
  const handleSubmitWithCode = () => {
    setShowCodeModal(false);
    handlePublish(postCode);
  };

  // Step 3b: Submit without code
  const handleSubmitWithoutCode = () => {
    setShowCodeModal(false);
    handlePublish('');
  };

  const handlePublish = async (code = '') => {
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
      surveyContent: surveyData.surveyContent,
      surveyDescription: surveyData.surveyDescription,
      surveyApproxTime: surveyData.surveyApproxTime,
      surveyTags: surveyData.surveyTags,
      target: surveyData.target,
      post_code: code, // Add post code for bypass approval
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
          onPublish={handlePublishClick}
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="p-8 rounded-xl shadow-xl text-center" style={{ backgroundColor: '#ffffff', maxWidth: '450px', width: '90%' }}>
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-secondary-background)' }}
            >
              <MdCheckCircle style={{ fontSize: '2.5rem', color: 'var(--color-accent-100)' }} />
            </div>
            <h2 
              className="text-xl font-semibold mb-3" 
              style={{ color: 'var(--color-primary-color)' }}
            >
              Publish Survey?
            </h2>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Are you sure you want to publish this survey? Once submitted, it will be sent for admin approval.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--color-shade-primary)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="btn"
                style={{
                  backgroundColor: 'var(--color-accent-100)',
                  borderColor: 'var(--color-accent-100)',
                  color: '#ffffff'
                }}
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Input Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="p-8 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff', maxWidth: '450px', width: '90%' }}>
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-secondary-background)' }}
            >
              <MdVpnKey style={{ fontSize: '2rem', color: 'var(--color-accent-100)' }} />
            </div>
            <h2 
              className="text-xl font-semibold mb-2 text-center" 
              style={{ color: 'var(--color-primary-color)' }}
            >
              Have an Approval Code?
            </h2>
            <p className="mb-4 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              If you have an approval code from an admin, enter it below to bypass the approval process. Otherwise, your survey will be sent for review.
            </p>
            
            <div className="mb-6">
              <label className="label">
                <span className="label-text" style={{ color: 'var(--color-text-secondary)' }}>
                  Approval Code (Optional)
                </span>
              </label>
              <input
                type="text"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                placeholder="Enter your code here..."
                className="input input-bordered w-full"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-shade-primary)',
                  color: 'var(--color-primary-color)'
                }}
              />
            </div>

            <div className="flex flex-col gap-3">
              {postCode.trim() && (
                <button
                  onClick={handleSubmitWithCode}
                  className="btn w-full"
                  style={{
                    backgroundColor: 'var(--color-accent-100)',
                    borderColor: 'var(--color-accent-100)',
                    color: '#ffffff'
                  }}
                >
                  Submit with Code
                </button>
              )}
              <button
                onClick={handleSubmitWithoutCode}
                className="btn w-full"
                style={{
                  backgroundColor: postCode.trim() ? 'transparent' : 'var(--color-primary-color)',
                  borderColor: postCode.trim() ? 'var(--color-shade-primary)' : 'var(--color-primary-color)',
                  color: postCode.trim() ? 'var(--color-text-secondary)' : '#ffffff'
                }}
              >
                {postCode.trim() ? 'Submit without Code' : 'Submit for Review'}
              </button>
              <Link 
                to="/home"
                className="text-center text-sm hover:underline"
                style={{ color: 'var(--color-accent-100)' }}
              >
                Cancel and return to homepage
              </Link>
            </div>
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