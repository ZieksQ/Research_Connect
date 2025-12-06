import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, Link, useBlocker } from 'react-router-dom';
import { publishSurvey } from '../../../services/survey/survey.service';
import { MdCheckCircle, MdError, MdClose, MdVpnKey, MdArrowBack } from 'react-icons/md';
// import { MdCheck } from 'react-icons/md';
// import { log } from 'three';

// Lazy load survey builder components
const SurveyDetailsPage = lazy(() => import('./SurveyDetailsPage'));
const TargetAudiencePage = lazy(() => import('./TargetAudiencePage'));
const SortableForm = lazy(() => import('./SortableForm'));
const SurveyPreviewPage = lazy(() => import('./SurveyPreviewPage'));

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

  // Block navigation if survey has data and not publishing
  const shouldBlock = !isPublishing && !publishModal.success && (
    surveyData.surveyTitle !== '' || 
    surveyData.surveyContent !== '' || 
    surveyData.data.length > 0
  );

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldBlock && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
      if (blocker.state === "blocked" && !shouldBlock) {
          blocker.reset();
      }
  }, [blocker, shouldBlock]);

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
    // console.log("=== SURVEY PUBLISHED WITH FORMDATA ===");
    // console.log("\nSurvey JSON Data:");
    // console.log(JSON.stringify(surveyDataForJson, null, 2));
    // console.log("\nFormData Contents:");
    // for (let [key, value] of formData.entries()) {
    //   if (value instanceof File) {
    //     console.log(`${key}: [File] ${value.name} (${value.type}, ${value.size} bytes)`);
    //   } else {
    //     console.log(`${key}: ${value}`);
    //   }
    // }
    // console.log("=== END ===");

    setIsPublishing(true);
    try {
      const response = await publishSurvey(formData);
      
      // Helper function to format error message from backend
      const formatErrorMessage = (message) => {
        if (!message) return 'Failed to publish survey. Please try again.';
        if (typeof message === 'string') return message;
        if (typeof message === 'object') {
          // Handle object messages like {title: 'Missing survey title'}
          const errorMessages = Object.entries(message)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          return errorMessages || 'Failed to publish survey. Please try again.';
        }
        return 'Failed to publish survey. Please try again.';
      };

      // Check the 'ok' property from backend response (not HTTP response.ok)
      if (response && response.ok === true) {
        setPublishModal({
          show: true,
          success: true,
          message: typeof response.message === 'string' 
            ? response.message 
            : 'Survey published successfully!'
        });
      } else {
        // Handle error response from backend
        setPublishModal({
          show: true,
          success: false,
          message: formatErrorMessage(response?.message)
        });
      }
    } catch (error) {
      console.error('Error publishing survey:', error);
      // Try to extract message from error if it's from the API
      const errorMessage = error?.message || error?.response?.message || 'An unexpected error occurred. Please try again.';
      setPublishModal({
        show: true,
        success: false,
        message: typeof errorMessage === 'object' 
          ? Object.values(errorMessage).join(', ') 
          : errorMessage
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost btn-sm gap-2 mb-4 text-gray-600 hover:bg-gray-200 pl-0"
        >
          <MdArrowBack size={20} />
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
          <h1 className="text-center text-3xl lg:text-4xl font-giaza text-custom-blue mb-2">
            Create Survey
          </h1>
          <p className="text-center text-gray-500 text-lg">
            {steps[currentStep].name}
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex justify-center mb-12">
          <ul className="steps w-full max-w-4xl">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`step ${index <= currentStep ? 'step-primary' : ''} ${
                  index < currentStep ? 'cursor-pointer' : ''
                }`}
                onClick={() => index < currentStep && setCurrentStep(index)}
              >
                <span className="hidden md:inline font-medium">{step.name}</span>
                <span className="md:hidden font-medium">Step {index + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current Step Content */}
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-custom-blue"></span>
          </div>
        }>
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
        </Suspense>
      </div>

      {/* Publishing Loading Overlay */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-xs w-full">
            <span className="loading loading-spinner loading-lg text-custom-blue"></span>
            <p className="mt-4 font-medium text-gray-900">
              Publishing your survey...
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Please wait
            </p>
          </div>
        </div>
      )}

      {/* Publish Result Modal */}
      {publishModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-md w-[90%]">
            {publishModal.success ? (
              <>
                <MdCheckCircle className="mx-auto mb-4 text-6xl text-custom-green" />
                <h2 className="text-xl font-bold mb-3 text-gray-900">
                  Success!
                </h2>
                <p className="mb-4 text-gray-600">
                  {publishModal.message}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to home in 3 seconds...
                </p>
              </>
            ) : (
              <>
                <MdError className="mx-auto mb-4 text-6xl text-red-600" />
                <h2 className="text-xl font-bold mb-3 text-gray-900">
                  Publishing Failed
                </h2>
                <p className="mb-4 text-gray-600">
                  {publishModal.message}
                </p>
                <button
                  onClick={() => setPublishModal({ show: false, success: false, message: '' })}
                  className="btn bg-custom-blue hover:bg-blue-700 text-white border-none"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-md w-[90%]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <MdCheckCircle className="text-4xl text-custom-blue" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-900">
              Publish Survey?
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to publish this survey? Once submitted, it will be sent for admin approval.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-ghost text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="btn bg-custom-blue hover:bg-blue-700 text-white border-none"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Input Modal */}
      {showCodeModal && (
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
                onChange={(e) => setPostCode(e.target.value)}
                placeholder="Enter your code here..."
                className="input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900"
              />
            </div>

            <div className="flex flex-col gap-3">
              {postCode.trim() && (
                <button
                  onClick={handleSubmitWithCode}
                  className="btn w-full bg-custom-blue hover:bg-blue-700 text-white border-none"
                >
                  Submit with Code
                </button>
              )}
              <button
                onClick={handleSubmitWithoutCode}
                className={`btn w-full ${
                  postCode.trim() 
                    ? 'btn-ghost text-gray-500 hover:bg-gray-100' 
                    : 'bg-custom-blue hover:bg-blue-700 text-white border-none'
                }`}
              >
                {postCode.trim() ? 'Submit without Code' : 'Submit for Review'}
              </button>
              <Link 
                to="/home"
                className="text-center text-sm text-custom-blue hover:underline mt-2"
              >
                Cancel and return to homepage
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Modal */}
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="p-8 rounded-xl shadow-xl bg-white max-w-md w-[90%]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <MdError className="text-4xl text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-900 text-center">Unsaved Changes</h2>
            <p className="mb-6 text-gray-600 text-center">
              You have unsaved changes. Are you sure you want to leave? Your progress will be lost.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => blocker.reset()}
                className="btn btn-ghost text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => blocker.proceed()}
                className="btn bg-red-500 hover:bg-red-600 text-white border-none"
              >
                Leave
              </button>
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