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
          className="btn bg-transparent border-custom-blue text-custom-blue hover:bg-blue-50"
        >
          <MdArrowBack /> Back
        </button>
      )}

      {!isLastSection ? (
        <button
          onClick={onNext}
          className="btn flex-1 bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800"
        >
          Next <MdArrowForward />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn flex-1 bg-custom-green border-custom-green text-white hover:bg-green-600 hover:border-green-600 disabled:opacity-50 disabled:bg-custom-green"
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
