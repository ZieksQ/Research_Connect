import { useState } from 'react';
import SurveyDetailsPage from './SurveyDetailsPage';
import TargetAudiencePage from './TargetAudiencePage';
import SortableForm from './SortableForm';
import SurveyPreviewPage from './SurveyPreviewPage';
import { MdCheck } from 'react-icons/md';
import { publishSurvey } from '../../services/survey.services';

export default function SurveyWizard() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const handlePublish = async () => {
    // Helper function to convert type to camelCase
    const typeToCamelCase = (type) => {
      const typeMap = {
        'Short Text': 'shortText',
        'Long Text': 'longText',
        'Single Choice': 'singleChoice',
        'Multiple Choice': 'multipleChoice',
        'Rating': 'rating',
        'Dropdown': 'dropdown',
        'Date': 'date',
        'Email': 'email'
      };
      return typeMap[type] || type.toLowerCase();
    };

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

    // Log what we're sending
    console.log("=== SURVEY PUBLISHED ===");
    console.log(JSON.stringify(surveyDataForJson, null, 2));
    console.log("=== END ===");

    alert("Survey published! Check the console for data being sent.");

    await publishSurvey(surveyDataForJson);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="rounded-xl shadow-lg p-6 mb-6" style={{ backgroundColor: 'var(--color-secondary-background)' }}>
          <h1 className="text-center mb-1" style={{ color: 'var(--color-primary-color)' }}>Create Survey</h1>
          <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
            {steps[currentStep].name}
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex justify-center mb-8">
          <ul className="steps">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`step ${index <= currentStep ? 'step-primary' : ''} ${
                  index < currentStep ? 'cursor-pointer' : ''
                }`}
                style={{
                  '--step-color': 'var(--color-primary-color)',
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
          isLastStep={currentStep === steps.length - 1}
          isFirstStep={currentStep === 0}
        />
      </div>
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