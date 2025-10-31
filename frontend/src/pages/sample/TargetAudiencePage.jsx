import { useState } from 'react';
import { MdPeople, MdBusiness, MdSchool, MdLocalHospital, MdEdit } from 'react-icons/md';

export default function TargetAudiencePage({ data, onNext, onBack }) {
  const [selectedAudience, setSelectedAudience] = useState(data.target || '');
  const [customAudience, setCustomAudience] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const audiences = [
    { id: 'all-students', label: 'All Students', icon: MdSchool },
    { id: 'business-students', label: 'Business Students', icon: MdBusiness },
    { id: 'engineering-students', label: 'Engineering Students', icon: MdSchool },
    { id: 'medical-students', label: 'Medical Students', icon: MdLocalHospital },
    { id: 'general-public', label: 'General Public', icon: MdPeople }
  ];

  const handleAudienceSelect = (audienceId) => {
    setSelectedAudience(audienceId);
    setShowCustomInput(false);
    setCustomAudience('');
  };

  const handleCustomAudience = () => {
    if (customAudience.trim()) {
      setSelectedAudience(customAudience.trim());
      setShowCustomInput(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAudience) {
      alert('Please select a target audience');
      return;
    }

    onNext({
      target: selectedAudience
    });
  };

  return (
    <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="mb-6">
        <h2 className="mb-2" style={{ color: 'var(--color-primary-color)' }}>Target Audience</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Select the audience you want to target with this survey
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {audiences.map((audience) => {
          const Icon = audience.icon;
          const isSelected = selectedAudience === audience.id;
          
          return (
            <div
              key={audience.id}
              onClick={() => handleAudienceSelect(audience.id)}
              className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: isSelected ? 'var(--color-secondary-background)' : 'var(--color-background)',
                border: `2px solid ${isSelected ? 'var(--color-primary-color)' : 'transparent'}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: isSelected ? 'var(--color-primary-color)' : 'var(--color-secondary-background)',
                  color: isSelected ? '#ffffff' : 'var(--color-primary-color)'
                }}
              >
                <Icon className="text-2xl" />
              </div>
              <div className="flex-1">
                <p style={{ color: 'var(--color-primary-color)', fontWeight: isSelected ? '600' : '400' }}>
                  {audience.label}
                </p>
              </div>
              {isSelected && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary-color)' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Other Option */}
        <div
          onClick={() => setShowCustomInput(true)}
          className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all"
          style={{
            backgroundColor: showCustomInput || (selectedAudience && !audiences.find(a => a.id === selectedAudience)) 
              ? 'var(--color-secondary-background)' 
              : 'var(--color-background)',
            border: `2px solid ${showCustomInput || (selectedAudience && !audiences.find(a => a.id === selectedAudience))
              ? 'var(--color-primary-color)' 
              : 'transparent'}`,
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: showCustomInput || (selectedAudience && !audiences.find(a => a.id === selectedAudience))
                ? 'var(--color-primary-color)' 
                : 'var(--color-secondary-background)',
              color: showCustomInput || (selectedAudience && !audiences.find(a => a.id === selectedAudience))
                ? '#ffffff' 
                : 'var(--color-primary-color)'
            }}
          >
            <MdEdit className="text-2xl" />
          </div>
          <div className="flex-1">
            <p style={{ 
              color: 'var(--color-primary-color)', 
              fontWeight: showCustomInput || (selectedAudience && !audiences.find(a => a.id === selectedAudience)) 
                ? '600' 
                : '400' 
            }}>
              {selectedAudience && !audiences.find(a => a.id === selectedAudience) 
                ? selectedAudience 
                : 'Other (Specify)'}
            </p>
          </div>
          {(showCustomInput || (selectedAudience && !audiences.find(a => a.id === selectedAudience))) && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-color)' }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
            </div>
          )}
        </div>

        {showCustomInput && (
          <div className="flex gap-2 px-4">
            <input
              type="text"
              value={customAudience}
              onChange={(e) => setCustomAudience(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomAudience()}
              className="input input-bordered flex-1"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-shade-primary)',
                color: 'var(--color-primary-color)'
              }}
              placeholder="Enter custom audience"
              autoFocus
            />
            <button
              onClick={handleCustomAudience}
              className="btn"
              style={{
                backgroundColor: 'var(--color-accent-100)',
                borderColor: 'var(--color-accent-100)',
                color: '#ffffff'
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
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
    </div>
  );
}
