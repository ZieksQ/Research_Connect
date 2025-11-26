import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getComputedResults } from '../../../services/survey/results.service';
import { MdClose, MdExpandMore, MdExpandLess, MdTextFields, MdRadioButtonChecked, MdCheckBox, MdArrowDropDown, MdStar, MdCalendarToday, MdEmail } from 'react-icons/md';

// Modal component for displaying text responses
const TextResponsesModal = ({ isOpen, onClose, questionText, responses, type }) => {
  if (!isOpen) return null;

  const getTypeLabel = (type) => {
    const labels = {
      shortText: 'Short Text',
      longText: 'Long Text',
      email: 'Email',
      date: 'Date',
    };
    return labels[type] || type;
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[80vh]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">{questionText}</h3>
            <span className="badge badge-outline badge-sm mt-1">{getTypeLabel(type)}</span>
          </div>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <MdClose size={20} />
          </button>
        </div>
        
        <div className="divider my-2"></div>
        
        <div className="space-y-2 overflow-y-auto max-h-[50vh]">
          <p className="text-sm text-text-secondary mb-3">
            Total Responses: {responses.length}
          </p>
          {responses.map((response, index) => (
            <div 
              key={index}
              className="bg-secondary-background p-3 rounded-lg"
            >
              <span className="text-sm text-text-secondary mr-2">#{index + 1}</span>
              <span className="text-primary-color">{response}</span>
            </div>
          ))}
        </div>
        
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

// Progress bar component for choice responses
const ChoiceProgressBar = ({ option, count, total, color }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-primary-color">{option}</span>
        <span className="text-sm text-text-secondary">
          {count} {count === 1 ? 'response' : 'responses'} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-secondary-background rounded-full h-3">
        <div 
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color || 'var(--color-accent-100)'
          }}
        ></div>
      </div>
    </div>
  );
};

// Question card component
const QuestionCard = ({ questionId, questionText, type, answerData, onViewResponses }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getTypeIcon = (type) => {
    const icons = {
      shortText: <MdTextFields size={20} />,
      longText: <MdTextFields size={20} />,
      email: <MdEmail size={20} />,
      date: <MdCalendarToday size={20} />,
      radioButton: <MdRadioButtonChecked size={20} />,
      checkBox: <MdCheckBox size={20} />,
      dropdown: <MdArrowDropDown size={20} />,
      rating: <MdStar size={20} />,
    };
    return icons[type] || <MdTextFields size={20} />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      shortText: 'Short Text',
      longText: 'Long Text',
      email: 'Email',
      date: 'Date',
      radioButton: 'Radio Button',
      checkBox: 'Checkbox',
      dropdown: 'Dropdown',
      rating: 'Rating',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      radioButton: 'var(--color-custom-blue)',
      checkBox: 'var(--color-custom-green)',
      dropdown: 'var(--color-custom-maroon)',
      rating: '#f59e0b',
    };
    return colors[type] || 'var(--color-accent-100)';
  };

  const isTextType = ['shortText', 'longText', 'email', 'date'].includes(type);
  const isChoiceType = ['radioButton', 'checkBox', 'dropdown', 'rating'].includes(type);

  // Calculate total responses for choice types
  const getTotalResponses = () => {
    if (isTextType) {
      return Array.isArray(answerData) ? answerData.length : 0;
    }
    if (isChoiceType) {
      return Object.values(answerData).reduce((sum, count) => sum + count, 0);
    }
    return 0;
  };

  const totalResponses = getTotalResponses();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-background overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'var(--color-secondary-background)' }}
          >
            {getTypeIcon(type)}
          </div>
          <div>
            <h4 className="font-medium text-primary-color">{questionText}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-sm badge-outline">{getTypeLabel(type)}</span>
              <span className="text-xs text-text-secondary">
                {totalResponses} {totalResponses === 1 ? 'response' : 'responses'}
              </span>
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm btn-circle">
          {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="divider my-2"></div>
          
          {isTextType && (
            <div className="flex flex-col items-center py-4">
              <p className="text-text-secondary text-sm mb-3">
                {totalResponses} text {totalResponses === 1 ? 'response' : 'responses'} collected
              </p>
              <button 
                className="btn btn-outline btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewResponses(questionId, questionText, answerData, type);
                }}
              >
                View All Responses
              </button>
            </div>
          )}

          {isChoiceType && (
            <div className="py-2">
              {Object.entries(answerData).map(([option, count]) => (
                <ChoiceProgressBar 
                  key={option}
                  option={option}
                  count={count}
                  total={totalResponses}
                  color={getTypeColor(type)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SurveyResult = () => {
  const { id } = useParams();
  const [resultsData, setResultsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    questionText: '',
    responses: [],
    type: '',
  });

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComputedResults(id);
      if (data?.ok) {
        setResultsData(data.message);
      } else {
        setError('Failed to load survey results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load survey results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResponses = (questionId, questionText, responses, type) => {
    setModalData({
      questionText,
      responses: Array.isArray(responses) ? responses : Object.keys(responses),
      type,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Collect all questions from different categories
  const getAllQuestions = () => {
    if (!resultsData) return [];
    
    const questions = [];
    
    // Text data
    if (resultsData.text_data) {
      Object.entries(resultsData.text_data).forEach(([id, data]) => {
        questions.push({ id, ...data, category: 'text' });
      });
    }
    
    // Choices data
    if (resultsData.choices_data) {
      Object.entries(resultsData.choices_data).forEach(([id, data]) => {
        questions.push({ id, ...data, category: 'choices' });
      });
    }
    
    // Dates data
    if (resultsData.dates_data) {
      Object.entries(resultsData.dates_data).forEach(([id, data]) => {
        questions.push({ id, ...data, category: 'dates' });
      });
    }
    
    // Rating data
    if (resultsData.rating_data) {
      Object.entries(resultsData.rating_data).forEach(([id, data]) => {
        questions.push({ id, ...data, category: 'rating' });
      });
    }
    
    return questions;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-text-secondary">Loading survey results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <p className="text-error text-lg">{error}</p>
          <button className="btn btn-primary mt-4" onClick={fetchResults}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const questions = getAllQuestions();

  return (
    <section className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Survey Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-primary-color mb-2">
            {resultsData?.survey_title || 'Survey Results'}
          </h1>
          <p className="text-text-secondary mb-4">
            {resultsData?.survey_content}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {resultsData?.survey_tags?.map((tag, index) => (
              <span key={index} className="badge badge-primary badge-outline">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>📝 {questions.length} Questions</span>
            <span>⏱️ {resultsData?.survey_approx_time}</span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary-color mb-4">
            Survey Responses
          </h2>
          
          {questions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-text-secondary">No responses yet</p>
            </div>
          ) : (
            questions.map((question) => (
              <QuestionCard
                key={question.id}
                questionId={question.id}
                questionText={question.question_text}
                type={question.type}
                answerData={question.answer_data}
                onViewResponses={handleViewResponses}
              />
            ))
          )}
        </div>
      </div>

      {/* Text Responses Modal */}
      <TextResponsesModal
        isOpen={modalOpen}
        onClose={closeModal}
        questionText={modalData.questionText}
        responses={modalData.responses}
        type={modalData.type}
      />
    </section>
  );
};

export default SurveyResult;
