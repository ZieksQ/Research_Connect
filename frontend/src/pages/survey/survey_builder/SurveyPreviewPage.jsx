import { MdCheckCircle } from 'react-icons/md';

export default function SurveyPreviewPage({ data, onBack, onPublish, isPublishing }) {
  const totalQuestions = data.data?.reduce((sum, section) => sum + section.questions.length, 0) || 0;

  return (
    <div className="rounded-xl shadow-lg p-6 bg-white">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-custom-green">
          <MdCheckCircle className="text-4xl text-white" />
        </div>
        <h2 className="mb-2 text-custom-blue font-bold text-xl">Review & Publish</h2>
        <p className="text-sm text-gray-600">
          Review your survey details before publishing
        </p>
      </div>

      {/* Survey Preview */}
      <div className="space-y-4 mb-6">
        {/* Survey Title */}
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-xs mb-1 text-gray-500">Survey Title</p>
          <p className="text-custom-blue font-medium">
            {data.surveyTitle || 'Untitled Survey'}
          </p>
        </div>

        {/* Survey Description */}
        {data.surveyDescription && (
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-xs mb-1 text-gray-500">Description</p>
            <p className="text-custom-blue">
              {data.surveyDescription}
            </p>
          </div>
        )}

        {/* Approximate Time */}
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-xs mb-1 text-gray-500">Approximate Time</p>
          <p className="text-custom-blue">
            {data.surveyApproxTime || 'Not specified'}
          </p>
        </div>

        {/* Tags */}
        {data.surveyTags && data.surveyTags.length > 0 && (
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-xs mb-2 text-gray-500">Tags</p>
            <div className="flex flex-wrap gap-2">
              {data.surveyTags.map((tag, index) => (
                <div
                  key={index}
                  className="badge bg-custom-green text-white border-none"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target Audience */}
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-xs mb-1 text-gray-500">Target Audience</p>
          <p className="text-custom-blue">
            {data.target || 'Not specified'}
          </p>
        </div>

        {/* Questions Summary */}
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-xs mb-2 text-gray-500">Survey Content</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-custom-blue">Total Sections:</span>
              <span className="text-custom-blue font-bold">
                {data.data?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-custom-blue">Total Questions:</span>
              <span className="text-custom-blue font-bold">
                {totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Question Details */}
        {data.data && data.data.length > 0 && (
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-xs mb-3 text-gray-500">Questions Preview</p>
            <div className="space-y-3">
              {data.data.map((section, sIndex) => (
                <div key={section.id}>
                  <p className="text-sm mb-2 text-custom-blue font-semibold">
                    {section.title}
                  </p>
                  {section.questions.length > 0 ? (
                    <ul className="space-y-1 ml-4">
                      {section.questions.map((question, qIndex) => (
                        <li
                          key={question.id}
                          className="text-sm flex items-start gap-2 text-gray-600"
                        >
                          <span>•</span>
                          <span>
                            {question.title || `Question ${qIndex + 1}`} ({question.type})
                            {question.required && <span className="text-red-500"> *</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm ml-4 text-gray-500">
                      No questions in this section
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg mb-6 bg-blue-50 border border-custom-blue/20">
        <p className="text-sm text-custom-blue">
          When you click "Publish", your survey will be ready and the complete JSON data will be logged to the console.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isPublishing}
          className="btn flex-1 bg-transparent border-custom-blue text-custom-blue hover:bg-blue-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="btn flex-1 bg-custom-blue border-custom-blue text-white hover:bg-blue-700 hover:border-blue-700 disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Publishing...
            </>
          ) : (
            'Publish'
          )}
        </button>
      </div>
    </div>
  );
}
