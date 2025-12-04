import {
  TextInput,
  LongTextInput,
  NumberInput,
  EmailInput,
  DateInput,
  RatingInput,
  RadioInput,
  CheckboxInput,
  DropdownInput
} from './inputs';

/**
 * SurveyQuestion - Renders a survey question with its input based on type
 * @param {Object} props
 * @param {Object} props.question - Question object with type, text, options, etc.
 * @param {number} props.index - Question index (0-based)
 * @param {*} props.value - Current answer value
 * @param {Function} props.onChange - Handler for simple value changes
 * @param {Function} props.onMultipleChoiceChange - Handler for checkbox/multiple choice changes
 * @param {string} props.error - Error message if validation failed
 */
export default function SurveyQuestion({ 
  question, 
  index, 
  value, 
  onChange, 
  onMultipleChoiceChange,
  error 
}) {
  const hasError = !!error;

  const renderQuestionInput = () => {
    switch (question.question_type) {
      case 'shortText':
      case 'Short Text':
      case 'Text':
      case 'textInput':
        return (
          <TextInput 
            value={value} 
            onChange={onChange} 
            hasError={hasError} 
          />
        );

      case 'longText':
      case 'Long Text':
      case 'Essay':
        return (
          <LongTextInput 
            value={value} 
            onChange={onChange} 
            hasError={hasError} 
          />
        );

      case 'number':
      case 'Number':
        return (
          <NumberInput 
            value={value} 
            onChange={onChange} 
            hasError={hasError} 
          />
        );

      case 'email':
      case 'Email':
        return (
          <EmailInput 
            value={value} 
            onChange={onChange} 
            hasError={hasError} 
          />
        );

      case 'date':
      case 'Date':
        return (
          <DateInput 
            value={value} 
            onChange={onChange} 
            hasError={hasError} 
          />
        );

      case 'rating':
      case 'Rating':
        const maxRating = question.question_maxRating || question.question_maxChoice || 5;
        return (
          <RatingInput 
            value={value} 
            onChange={onChange} 
            maxRating={maxRating} 
          />
        );

      case 'radioButton':
      case 'singleChoice':
      case 'Radio Button':
      case 'Single Choice':
        return (
          <RadioInput
            questionId={question.question_id}
            value={value}
            onChange={onChange}
            options={question.question_choices}
          />
        );

      case 'checkBox':
      case 'multipleChoice':
      case 'Checkbox':
      case 'Multiple Choice':
        return (
          <CheckboxInput
            value={value || []}
            onChange={(optionId) => onMultipleChoiceChange(optionId, question)}
            options={question.question_choices}
            minChoice={question.question_minChoice}
            maxChoice={question.question_maxChoice}
          />
        );

      case 'dropdown':
      case 'Dropdown':
        return (
          <DropdownInput
            value={value}
            onChange={onChange}
            options={question.question_choices}
            hasError={hasError}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl shadow-lg p-6 lg:p-8 mb-4 bg-white border border-gray-100">
      <div className="mb-4">
        <label className="block mb-4">
          <span className="text-gray-900 text-base lg:text-lg font-medium block mb-2">
            {index + 1}. {question.question_text}
            {question.question_required && (
              <span className="text-red-600 ml-1">*</span>
            )}
          </span>
        </label>

        {/* Question Image */}
        {question.question_image && (
          <div className="mb-6">
            <img
              src={typeof question.question_image === 'string' ? question.question_image : question.question_image?.img_url}
              alt="Question"
              className="max-w-full h-auto rounded-lg max-h-[300px] object-contain"
            />
          </div>
        )}

        {/* Question Video */}
        {question.question_url && (
          <div className="mb-6">
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
              className="rounded-lg w-full aspect-video"
            ></iframe>
          </div>
        )}

        <div className="mt-2">
          {renderQuestionInput()}
        </div>

        {error && (
          <p className="text-sm mt-2 text-red-600 font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
