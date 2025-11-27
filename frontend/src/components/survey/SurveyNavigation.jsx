import { MdArrowBack, MdArrowForward } from 'react-icons/md';

/**
 * SurveyNavigation - Navigation buttons for survey sections
 * @param {Object} props
 * @param {boolean} props.isFirstSection - Whether current section is the first
 * @param {boolean} props.isLastSection - Whether current section is the last
 * @param {boolean} props.isSubmitting - Whether survey is being submitted
 * @param {Function} props.onBack - Callback for back button
 * @param {Function} props.onNext - Callback for next button
 * @param {Function} props.onSubmit - Callback for submit button
 */
export default function SurveyNavigation({ 
  isFirstSection, 
  isLastSection, 
  isSubmitting, 
  onBack, 
  onNext, 
  onSubmit 
}) {
  return (
    <div className="flex gap-3 mt-6">
      {!isFirstSection && (
        <button
          onClick={onBack}
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
          onClick={onNext}
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
          onClick={onSubmit}
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
  );
}
