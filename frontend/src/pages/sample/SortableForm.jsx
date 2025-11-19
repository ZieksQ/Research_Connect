import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import {
  MdAdd,
  MdDelete,
  MdImage,
  MdClose,
  MdUpload,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import { FaLink } from 'react-icons/fa';

export default function SortableForm({ data, onNext, onBack, updateData }) {
  const [sections, setSections] = useState(data.data || [
    {
      id: 'section-1',
      title: 'Section 1',
      description: '',
      questions: [],
      collapsed: false,
    },
  ]);

  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mediaLink, setMediaLink] = useState('');
  const fileInputRef = useRef(null);

  // Update parent data whenever sections change
  useEffect(() => {
    updateData({ data: sections });
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const questionTypes = [
    'Short Text',
    'Long Text',
    'Single Choice',
    'Multiple Choice',
    'Rating',
    'Dropdown',
    'Date',
    'Email',
  ];

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      description: '',
      questions: [],
      collapsed: false,
    };
    setSections([...sections, newSection]);
  };

  const toggleSection = (sectionId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s
      )
    );
  };

  const deleteSection = (sectionId) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const updateSection = (sectionId, field, value) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s))
    );
  };

  const addQuestion = (sectionId) => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      title: '',
      type: 'Short Text',
      required: false,
      options: [],
      image: null,
      video: null,
      minChoices: 1,
      maxChoices: 1,
    };

    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      )
    );
  };

  const deleteQuestion = (sectionId, questionId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
          : s
      )
    );
  };

  const updateQuestion = (sectionId, questionId, field, value) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) => {
                if (q.id === questionId) {
                  const updatedQuestion = { ...q, [field]: value };
                  if (field === 'maxChoices' && q.type === 'Multiple Choice') {
                    updatedQuestion.maxChoices = Math.min(value, q.options.length || 1);
                  }
                  return updatedQuestion;
                }
                return q;
              }),
            }
          : s
      )
    );
  };

  const addOption = (sectionId, questionId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) => {
                if (q.id === questionId) {
                  const newOptions = [
                    ...q.options,
                    { id: `option-${Date.now()}`, text: '' },
                  ];
                  const updatedMaxChoices = Math.max(q.maxChoices, 1);
                  return {
                    ...q,
                    options: newOptions,
                    maxChoices: updatedMaxChoices,
                  };
                }
                return q;
              }),
            }
          : s
      )
    );
  };

  const deleteOption = (sectionId, questionId, optionId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) => {
                if (q.id === questionId) {
                  const newOptions = q.options.filter((o) => o.id !== optionId);
                  const adjustedMaxChoices = Math.min(
                    q.maxChoices,
                    newOptions.length || 1
                  );
                  return {
                    ...q,
                    options: newOptions,
                    maxChoices: adjustedMaxChoices,
                  };
                }
                return q;
              }),
            }
          : s
      )
    );
  };

  const updateOption = (sectionId, questionId, optionId, text) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.map((o) =>
                        o.id === optionId ? { ...o, text } : o
                      ),
                    }
                  : q
              ),
            }
          : s
      )
    );
  };

  const handleQuestionDragEnd = (event, sectionId) => {
    const { active, over } = event;

    if (!over || !active || active.id === over.id) {
      return;
    }

    try {
      setSections((prevSections) =>
        prevSections.map((s) => {
          if (s.id === sectionId) {
            const oldIndex = s.questions.findIndex((q) => q.id === active.id);
            const newIndex = s.questions.findIndex((q) => q.id === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
              return { ...s, questions: arrayMove(s.questions, oldIndex, newIndex) };
            }
          }
          return s;
        })
      );
    } catch (error) {
      console.error('Error during question drag:', error);
    }
  };

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;

    if (!over || !active || active.id === over.id) {
      return;
    }

    try {
      setSections((prevSections) => {
        const oldIndex = prevSections.findIndex((s) => s.id === active.id);
        const newIndex = prevSections.findIndex((s) => s.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(prevSections, oldIndex, newIndex);
        }
        
        return prevSections;
      });
    } catch (error) {
      console.error('Error during section drag:', error);
    }
  };

  const handleOptionDragEnd = (event, sectionId, questionId) => {
    const { active, over } = event;

    if (!over || !active || active.id === over.id) {
      return;
    }

    try {
      setSections((prevSections) =>
        prevSections.map((s) => {
          if (s.id === sectionId) {
            return {
              ...s,
              questions: s.questions.map((q) => {
                if (q.id === questionId) {
                  const oldIndex = q.options.findIndex((o) => o.id === active.id);
                  const newIndex = q.options.findIndex((o) => o.id === over.id);
                  
                  if (oldIndex !== -1 && newIndex !== -1) {
                    return { ...q, options: arrayMove(q.options, oldIndex, newIndex) };
                  }
                }
                return q;
              }),
            };
          }
          return s;
        })
      );
    } catch (error) {
      console.error('Error during option drag:', error);
    }
  };

  const openMediaModal = (type, sectionId, questionId) => {
    setMediaType(type);
    setCurrentSectionId(sectionId);
    setCurrentQuestionId(questionId);
    setShowMediaModal(true);
    setMediaLink('');
  };

  const closeMediaModal = () => {
    setShowMediaModal(false);
    setMediaType(null);
    setCurrentQuestionId(null);
    setCurrentSectionId(null);
    setMediaLink('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (mediaType === 'image' && file.type.startsWith('image/')) {
      // Store the actual File object for FormData submission
      const imageData = {
        file: file, // Store the actual File object
        preview: URL.createObjectURL(file), // Create preview URL for display
        name: file.name,
        type: file.type,
        size: file.size
      };
      updateQuestion(currentSectionId, currentQuestionId, 'image', imageData);
      closeMediaModal();
    }
  };

  const handleLinkSubmit = () => {
    if (mediaType === 'video') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      const gdriveRegex = /^(https?:\/\/)?(drive\.google\.com)\/.+/;
      if (youtubeRegex.test(mediaLink) || gdriveRegex.test(mediaLink)) {
        updateQuestion(currentSectionId, currentQuestionId, 'video', mediaLink);
        closeMediaModal();
      } else {
        alert('Please enter a valid YouTube or Google Drive link');
      }
    }
  };

  const handleContinue = () => {
    // Validate that there's at least one question
    const hasQuestions = sections.some(section => section.questions.length > 0);
    
    if (!hasQuestions) {
      alert('Please add at least one question to your survey');
      return;
    }

    onNext();
  };

  return (
    <div>
      <div className="rounded-xl shadow-lg p-4 mb-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ color: 'var(--color-primary-color)' }}>Survey Questions</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Build your form with drag and drop functionality
            </p>
          </div>
          <button
            onClick={addSection}
            className="btn btn-sm"
            style={{ 
              backgroundColor: 'var(--color-accent-100)', 
              borderColor: 'var(--color-accent-100)',
              color: '#ffffff'
            }}
          >
            <MdAdd className="text-lg" /> Add Section
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section, sectionIndex) => (
            <SortableItem key={section.id} id={section.id} className="mb-4">
              <div
                className="rounded-xl shadow-lg"
                style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-shade-primary)' }}
              >
                <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-shade-primary)', paddingLeft: '2.5rem' }}>
                  <div className="flex-1 flex items-center gap-3">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="btn btn-ghost btn-sm btn-square"
                      style={{ color: 'var(--color-shade-primary)' }}
                    >
                      {section.collapsed ? <MdExpandMore className="text-xl" /> : <MdExpandLess className="text-xl" />}
                    </button>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        className="input input-sm w-full border-0 p-0"
                        style={{ 
                          backgroundColor: 'transparent',
                          color: 'var(--color-primary-color)',
                          fontWeight: '600'
                        }}
                        placeholder="Section Title"
                      />
                      <input
                        type="text"
                        value={section.description}
                        onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                        className="input input-sm w-full border-0 p-0 mt-1"
                        style={{ 
                          backgroundColor: 'transparent',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.875rem'
                        }}
                        placeholder="Section Description (optional)"
                      />
                    </div>
                  </div>
                  {sections.length > 1 && (
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#dc2626' }}
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  )}
                </div>

                {!section.collapsed && (
                  <div className="p-4"
                    style={{ backgroundColor: 'var(--color-background)' }}
                  >

                    {section.questions.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-3" style={{ color: 'var(--color-shade-primary)', opacity: '0.3' }}>📝</div>
                        <p style={{ color: 'var(--color-text-secondary)' }}>No questions in this section</p>
                        <button
                          onClick={() => addQuestion(section.id)}
                          className="btn btn-sm mt-4"
                          style={{ 
                            backgroundColor: 'var(--color-primary-color)',
                            borderColor: 'var(--color-primary-color)',
                            color: '#ffffff'
                          }}
                        >
                          <MdAdd className="text-lg" /> Add Question
                        </button>
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleQuestionDragEnd(e, section.id)}
                      >
                        <SortableContext
                          items={section.questions.map((q) => q.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {section.questions.map((question, qIndex) => (
                            <SortableItem key={question.id} id={question.id} className="mb-3">
                              <div className="card shadow-sm rounded-lg" style={{ 
                                backgroundColor: '#ffffff', 
                                border: '1px solid var(--color-shade-primary)',
                                paddingLeft: '2.5rem'
                              }}>
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="badge badge-sm" style={{ 
                                      backgroundColor: 'var(--color-secondary-background)',
                                      color: 'var(--color-primary-color)',
                                      border: 'none'
                                    }}>
                                      {question.type.toUpperCase()}
                                    </div>
                                    <button
                                      onClick={() => deleteQuestion(section.id, question.id)}
                                      className="btn btn-ghost btn-xs"
                                      style={{ color: '#dc2626' }}
                                    >
                                      <MdDelete className="text-lg" />
                                    </button>
                                  </div>

                                  <input
                                    type="text"
                                    value={question.title}
                                    onChange={(e) =>
                                      updateQuestion(
                                        section.id,
                                        question.id,
                                        'title',
                                        e.target.value
                                      )
                                    }
                                    className="input input-bordered input-sm w-full mb-3"
                                    style={{ 
                                      backgroundColor: 'var(--color-background)',
                                      borderColor: 'var(--color-shade-primary)',
                                      color: 'var(--color-primary-color)'
                                    }}
                                    placeholder="Enter your question"
                                  />

                                  <select
                                    value={question.type}
                                    onChange={(e) =>
                                      updateQuestion(
                                        section.id,
                                        question.id,
                                        'type',
                                        e.target.value
                                      )
                                    }
                                    className="select select-bordered select-sm w-full mb-3"
                                    style={{ 
                                      backgroundColor: 'var(--color-background)',
                                      borderColor: 'var(--color-shade-primary)',
                                      color: 'var(--color-primary-color)'
                                    }}
                                  >
                                    {questionTypes.map((type) => (
                                      <option key={type} value={type}>
                                        {type}
                                      </option>
                                    ))}
                                  </select>

                                  {question.type === 'Multiple Choice' && (
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                      <div>
                                        <label className="label py-1">
                                          <span className="label-text text-xs" style={{ color: 'var(--color-text-secondary)' }}>Min Choices</span>
                                        </label>
                                        <input
                                          type="number"
                                          min="1"
                                          value={question.minChoices}
                                          onChange={(e) =>
                                            updateQuestion(
                                              section.id,
                                              question.id,
                                              'minChoices',
                                              parseInt(e.target.value) || 1
                                            )
                                          }
                                          className="input input-bordered input-sm w-full"
                                          style={{ 
                                            backgroundColor: 'var(--color-background)',
                                            borderColor: 'var(--color-shade-primary)',
                                            color: 'var(--color-primary-color)'
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label className="label py-1">
                                          <span className="label-text text-xs" style={{ color: 'var(--color-text-secondary)' }}>Max Choices (max: {question.options.length || 0})</span>
                                        </label>
                                        <input
                                          type="number"
                                          min="1"
                                          max={question.options.length || 1}
                                          value={question.maxChoices}
                                          onChange={(e) =>
                                            updateQuestion(
                                              section.id,
                                              question.id,
                                              'maxChoices',
                                              parseInt(e.target.value) || 1
                                            )
                                          }
                                          className="input input-bordered input-sm w-full"
                                          style={{ 
                                            backgroundColor: 'var(--color-background)',
                                            borderColor: 'var(--color-shade-primary)',
                                            color: 'var(--color-primary-color)'
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {['Single Choice', 'Multiple Choice', 'Dropdown'].includes(
                                    question.type
                                  ) && (
                                    <div className="mb-3">
                                      <label className="label py-1">
                                        <span className="label-text text-xs" style={{ color: 'var(--color-text-secondary)' }}>Options</span>
                                      </label>
                                      <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={(e) => handleOptionDragEnd(e, section.id, question.id)}
                                      >
                                        <SortableContext
                                          items={question.options.map((o) => o.id)}
                                          strategy={verticalListSortingStrategy}
                                        >
                                          {question.options.map((option, optionIndex) => (
                                            <SortableItem
                                              key={option.id}
                                              id={option.id}
                                              className="mb-2"
                                            >
                                              <div className="flex items-center gap-2" style={{ paddingLeft: '2rem' }}>
                                                <div className="w-5 h-5 rounded-full border-2 flex-shrink-0" style={{ borderColor: 'var(--color-shade-primary)' }}></div>
                                                <input
                                                  type="text"
                                                  value={option.text || ''}
                                                  onChange={(e) =>
                                                    updateOption(
                                                      section.id,
                                                      question.id,
                                                      option.id,
                                                      e.target.value
                                                    )
                                                  }
                                                  className="input input-sm flex-1 border-0 border-b rounded-none"
                                                  style={{ 
                                                    backgroundColor: 'transparent',
                                                    borderColor: 'var(--color-shade-primary)',
                                                    color: 'var(--color-primary-color)'
                                                  }}
                                                  placeholder={`Option ${optionIndex + 1}`}
                                                />
                                                <button
                                                  onClick={() =>
                                                    deleteOption(section.id, question.id, option.id)
                                                  }
                                                  className="btn btn-ghost btn-xs"
                                                  style={{ color: '#dc2626' }}
                                                >
                                                  <MdClose />
                                                </button>
                                              </div>
                                            </SortableItem>
                                          ))}
                                        </SortableContext>
                                      </DndContext>
                                      <button
                                        onClick={() => addOption(section.id, question.id)}
                                        className="btn btn-ghost btn-xs mt-2"
                                        style={{ 
                                          color: 'var(--color-accent-100)',
                                          paddingLeft: '2rem'
                                        }}
                                      >
                                        <MdAdd /> Add Option
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between border-t pt-3 mt-3" style={{ borderColor: 'var(--color-shade-primary)' }}>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="checkbox"
                                          checked={question.required}
                                          onChange={(e) =>
                                            updateQuestion(
                                              section.id,
                                              question.id,
                                              'required',
                                              e.target.checked
                                            )
                                          }
                                          className="toggle toggle-sm"
                                        />
                                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Required</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          openMediaModal('image', section.id, question.id)
                                        }
                                        className="btn btn-ghost btn-xs"
                                        style={{ 
                                          color: 'var(--color-shade-primary)'
                                        }}
                                        title="Add Image"
                                      >
                                        <MdImage className="text-lg" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          openMediaModal('video', section.id, question.id)
                                        }
                                        className="btn btn-ghost btn-xs"
                                        style={{ 
                                          color: 'var(--color-shade-primary)'
                                        }}
                                        title="Add Video Link"
                                      >
                                        <FaLink className="text-base" />
                                      </button>
                                    </div>
                                  </div>

                                  {question.image && (
                                    <div className="mt-3 relative">
                                      <img
                                        src={question.image.preview}
                                        alt="Question"
                                        className="max-w-full h-auto rounded-lg"
                                        style={{ maxHeight: '200px' }}
                                      />
                                      <button
                                        onClick={() =>
                                          updateQuestion(section.id, question.id, 'image', null)
                                        }
                                        className="btn btn-xs btn-circle absolute top-2 right-2"
                                        style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
                                      >
                                        <MdClose />
                                      </button>
                                    </div>
                                  )}

                                  {question.video && (
                                    <div className="mt-3 relative">
                                      <div className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--color-background)' }}>
                                        <div className="flex items-center gap-2">
                                          <FaLink style={{ color: 'var(--color-accent-100)' }} />
                                          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                            Video Link Added
                                          </span>
                                        </div>
                                        <button
                                          onClick={() =>
                                            updateQuestion(section.id, question.id, 'video', null)
                                          }
                                          className="btn btn-ghost btn-xs"
                                          style={{ color: '#dc2626' }}
                                        >
                                          <MdClose />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </SortableItem>
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}

                    {section.questions.length > 0 && (
                      <button
                        onClick={() => addQuestion(section.id)}
                        className="btn btn-sm mt-3 w-full"
                        style={{ 
                          backgroundColor: 'transparent',
                          borderColor: 'var(--color-primary-color)',
                          color: 'var(--color-primary-color)'
                        }}
                      >
                        <MdAdd className="text-lg" /> Add Question
                      </button>
                    )}
                  </div>
                )}
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="btn flex-1"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'var(--color-primary-color)',
            color: 'var(--color-primary-color)'
          }}
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn flex-1"
          style={{
            backgroundColor: 'var(--color-primary-color)',
            borderColor: 'var(--color-primary-color)',
            color: '#ffffff'
          }}
        >
          Next
        </button>
      </div>

      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 max-w-md w-full mx-4" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: 'var(--color-primary-color)' }}>
                {mediaType === 'image' ? 'Add Image' : 'Add Video Link'}
              </h3>
              <button
                onClick={closeMediaModal}
                className="btn btn-ghost btn-sm btn-circle"
                style={{ color: 'var(--color-shade-primary)' }}
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {mediaType === 'image' ? (
              <div>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                  style={{
                    borderColor: dragActive ? 'var(--color-accent-100)' : 'var(--color-shade-primary)',
                    backgroundColor: dragActive ? 'rgba(80, 87, 233, 0.05)' : 'transparent'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <MdUpload className="text-5xl mx-auto mb-3" style={{ color: 'var(--color-shade-primary)' }} />
                  <p className="mb-1" style={{ color: 'var(--color-primary-color)' }}>
                    Drag and drop an image here
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    or click to browse
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <label className="label">
                  <span className="label-text" style={{ color: 'var(--color-text-secondary)' }}>
                    YouTube or Google Drive Link
                  </span>
                </label>
                <input
                  type="text"
                  value={mediaLink}
                  onChange={(e) => setMediaLink(e.target.value)}
                  className="input input-bordered w-full mb-4"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-shade-primary)',
                    color: 'var(--color-primary-color)'
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <button
                  onClick={handleLinkSubmit}
                  className="btn w-full"
                  style={{
                    backgroundColor: 'var(--color-accent-100)',
                    borderColor: 'var(--color-accent-100)',
                    color: '#ffffff'
                  }}
                >
                  Add Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}