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
    <div
      className="rounded-xl shadow-lg p-6 mb-4"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="mb-4">
        <label className="block mb-2">
          <span style={{ color: 'var(--color-primary-color)' }}>
            {index + 1}. {question.question_text}
            {question.question_required && (
              <span style={{ color: '#dc2626' }}> *</span>
            )}
          </span>
        </label>

        {/* Question Image */}
        {question.question_image && (
          <div className="mb-4">
            <img
              src={typeof question.question_image === 'string' ? question.question_image : question.question_image?.img_url}
              alt="Question"
              className="max-w-full h-auto rounded-lg"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}

        {/* Question Video */}
        {question.question_url && (
          <div className="mb-4">
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
              className="rounded-lg"
            ></iframe>
          </div>
        )}

        {renderQuestionInput()}

        {error && (
          <p className="text-sm mt-2" style={{ color: '#dc2626' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
