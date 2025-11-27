import { MdCheckCircle } from 'react-icons/md';

export default function SurveyPreviewPage({ data, onBack, onPublish, isPublishing }) {
  const totalQuestions = data.data?.reduce((sum, section) => sum + section.questions.length, 0) || 0;

  return (
    <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="mb-6 text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-100)' }}>
          <MdCheckCircle className="text-4xl" style={{ color: '#ffffff' }} />
        </div>
        <h2 className="mb-2" style={{ color: 'var(--color-primary-color)' }}>Review & Publish</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Review your survey details before publishing
        </p>
      </div>

      {/* Survey Preview */}
      <div className="space-y-4 mb-6">
        {/* Survey Title */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Survey Title</p>
          <p style={{ color: 'var(--color-primary-color)' }}>
            {data.surveyTitle || 'Untitled Survey'}
          </p>
        </div>

        {/* Survey Description */}
        {data.surveyDescription && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Description</p>
            <p style={{ color: 'var(--color-primary-color)' }}>
              {data.surveyDescription}
            </p>
          </div>
        )}

        {/* Approximate Time */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Approximate Time</p>
          <p style={{ color: 'var(--color-primary-color)' }}>
            {data.surveyApproxTime || 'Not specified'}
          </p>
        </div>

        {/* Tags */}
        {data.surveyTags && data.surveyTags.length > 0 && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>Tags</p>
            <div className="flex flex-wrap gap-2">
              {data.surveyTags.map((tag, index) => (
                <div
                  key={index}
                  className="badge"
                  style={{
                    backgroundColor: 'var(--color-accent-100)',
                    color: '#ffffff',
                    border: 'none'
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target Audience */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Target Audience</p>
          <p style={{ color: 'var(--color-primary-color)' }}>
            {data.target || 'Not specified'}
          </p>
        </div>

        {/* Questions Summary */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>Survey Content</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-primary-color)' }}>Total Sections:</span>
              <span style={{ color: 'var(--color-primary-color)' }}>
                {data.data?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-primary-color)' }}>Total Questions:</span>
              <span style={{ color: 'var(--color-primary-color)' }}>
                {totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Question Details */}
        {data.data && data.data.length > 0 && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>Questions Preview</p>
            <div className="space-y-3">
              {data.data.map((section, sIndex) => (
                <div key={section.id}>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-primary-color)' }}>
                    {section.title}
                  </p>
                  {section.questions.length > 0 ? (
                    <ul className="space-y-1 ml-4">
                      {section.questions.map((question, qIndex) => (
                        <li
                          key={question.id}
                          className="text-sm flex items-start gap-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <span>•</span>
                          <span>
                            {question.title || `Question ${qIndex + 1}`} ({question.type})
                            {question.required && <span style={{ color: '#dc2626' }}> *</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm ml-4" style={{ color: 'var(--color-text-secondary)' }}>
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
      <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: 'rgba(80, 87, 233, 0.1)', border: '1px solid var(--color-accent-100)' }}>
        <p className="text-sm" style={{ color: 'var(--color-primary-color)' }}>
          When you click "Publish", your survey will be ready and the complete JSON data will be logged to the console.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isPublishing}
          className="btn flex-1"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'var(--color-primary-color)',
            color: 'var(--color-primary-color)',
            opacity: isPublishing ? 0.5 : 1
          }}
        >
          Back
        </button>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="btn flex-1"
          style={{
            backgroundColor: 'var(--color-primary-color)',
            borderColor: 'var(--color-primary-color)',
            color: '#ffffff',
            opacity: isPublishing ? 0.5 : 1
          }}
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
