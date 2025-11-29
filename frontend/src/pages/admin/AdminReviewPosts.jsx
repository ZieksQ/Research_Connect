import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurvey } from '../../services/survey/survey.service';
import {
  SurveyHeader,
  SurveySectionHeader,
  SurveyQuestion,
  SurveyNotFound,
} from '../../components/survey';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminReviewPosts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    setLoading(true);
    try {
      const response = await getSurvey(id);
      
      if (response.ok) {
        setSurveyData(response.message);
      } else {
        setError(response.message || 'Failed to load survey');
      }
    } catch (err) {
      setError('An error occurred while loading the survey');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/request');
  };

  const handleNext = () => {
    setCurrentSectionIndex((prev) =>
      Math.min(prev + 1, surveyData.survey_section.length - 1)
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    setCurrentSectionIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/60">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="text-error text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Survey</h2>
          <p className="text-base-content/60 mb-6">{error}</p>
          <button onClick={handleBack} className="btn btn-primary">
            <FaArrowLeft />
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  if (!surveyData) {
    return <SurveyNotFound />;
  }

  const currentSection = surveyData.survey_section[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === surveyData.survey_section.length - 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: 'clamp(768px, 75vw, 1200px)',
          padding: 'clamp(1rem, 2vw, 2rem)',
        }}
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="btn btn-ghost gap-2 mb-4"
        >
          <FaArrowLeft />
          Back to Requests
        </button>

        {/* Review Mode Banner */}
        <div className="alert alert-info mb-6">
          <FaCheckCircle />
          <span>
            <strong>Review Mode:</strong> You are viewing this survey in read-only mode.
          </span>
        </div>

        {/* Survey Header - Only show on first section */}
        {isFirstSection && (
          <SurveyHeader
            title={surveyData.survey_title}
            description={surveyData.survey_content}
            approxTime={surveyData.survey_approx_time}
          />
        )}

        {/* Section Header */}
        <SurveySectionHeader
          title={currentSection.section_title}
          description={currentSection.section_description}
          currentIndex={currentSectionIndex}
          totalSections={surveyData.survey_section.length}
        />

        {/* Questions - Read-only mode */}
        <div className="space-y-6 mb-8">
          {currentSection.questions.map((question, index) => (
            <div key={question.question_id} className="opacity-75 pointer-events-none">
              <SurveyQuestion
                question={question}
                index={index}
                value={null}
                onChange={() => {}}
                onMultipleChoiceChange={() => {}}
                error={null}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pb-8">
          <button
            onClick={handlePrevious}
            disabled={isFirstSection}
            className="btn btn-outline"
          >
            Previous
          </button>
          
          <div className="text-sm text-base-content/60">
            Section {currentSectionIndex + 1} of {surveyData.survey_section.length}
          </div>

          <button
            onClick={handleNext}
            disabled={isLastSection}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>

        {/* Survey Tags */}
        {isFirstSection && (
          <div className="card bg-base-200 mb-6">
            <div className="card-body">
              <h3 className="font-semibold mb-2">Survey Details</h3>
              <div className="space-y-2">
                {surveyData.survey_tags && surveyData.survey_tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {surveyData.survey_tags.map((tag, index) => (
                        <span key={index} className="badge badge-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {surveyData.survey_target_audience && surveyData.survey_target_audience.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Target Audience:</p>
                    <div className="flex flex-wrap gap-2">
                      {surveyData.survey_target_audience.map((audience, index) => (
                        <span key={index} className="badge badge-secondary">
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-base-100 shadow-lg rounded-full px-6 py-2">
          <div className="flex gap-2">
            {surveyData.survey_section.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSectionIndex
                    ? 'bg-primary'
                    : index < currentSectionIndex
                    ? 'bg-success'
                    : 'bg-base-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewPosts;
