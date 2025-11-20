import { useState } from 'react';
import { MdPeople, MdBusiness, MdSchool, MdLocalHospital, MdEdit, MdCheck } from 'react-icons/md';

export default function TargetAudiencePage({ data, onNext, onBack }) {
  const [selectedAudiences, setSelectedAudiences] = useState(
    Array.isArray(data.target) ? data.target : data.target ? [data.target] : []
  );
  const [customAudience, setCustomAudience] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const audiences = [
    { id: 'all-students', label: 'All Students', icon: MdSchool },
    { id: 'business-students', label: 'Business Students', icon: MdBusiness },
    { id: 'engineering-students', label: 'Engineering Students', icon: MdSchool },
    { id: 'medical-students', label: 'Medical Students', icon: MdLocalHospital },
    { id: 'general-public', label: 'General Public', icon: MdPeople }
  ];

  const handleAudienceToggle = (audienceId) => {
    setSelectedAudiences((prev) => {
      if (prev.includes(audienceId)) {
        // Remove if already selected
        return prev.filter((id) => id !== audienceId);
      } else {
        // Add if not selected and under limit
        if (prev.length < 5) {
          return [...prev, audienceId];
        } else {
          alert('You can select a maximum of 5 target audiences');
          return prev;
        }
      }
    });
  };

  const handleCustomAudience = () => {
    if (customAudience.trim()) {
      if (selectedAudiences.length < 5) {
        setSelectedAudiences((prev) => [...prev, customAudience.trim()]);
        setShowCustomInput(false);
        setCustomAudience('');
      } else {
        alert('You can select a maximum of 5 target audiences');
      }
    }
  };

  const removeCustomAudience = (customAud) => {
    setSelectedAudiences((prev) => prev.filter((aud) => aud !== customAud));
  };

  const handleContinue = () => {
    if (selectedAudiences.length === 0) {
      alert('Please select at least one target audience');
      return;
    }

    onNext({
      target: selectedAudiences
    });
  };

  // Get custom audiences (those not in the predefined list)
  const customAudiences = selectedAudiences.filter(
    (aud) => !audiences.find((a) => a.id === aud)
  );

  return (
    <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="mb-6">
        <h2 className="mb-2" style={{ color: 'var(--color-primary-color)' }}>Target Audience</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Select the audiences you want to target with this survey (max 5)
        </p>
        {selectedAudiences.length > 0 && (
          <p className="text-sm mt-2" style={{ color: 'var(--color-accent-100)' }}>
            {selectedAudiences.length} of 5 selected
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {audiences.map((audience) => {
          const Icon = audience.icon;
          const isSelected = selectedAudiences.includes(audience.id);
          
          return (
            <div
              key={audience.id}
              onClick={() => handleAudienceToggle(audience.id)}
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
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary-color)' }}
                >
                  <MdCheck className="text-white" />
                </div>
              )}
            </div>
          );
        })}

        {/* Custom Audiences Display */}
        {customAudiences.map((customAud) => (
          <div
            key={customAud}
            className="flex items-center gap-4 p-4 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--color-secondary-background)',
              border: `2px solid var(--color-primary-color)`,
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: 'var(--color-primary-color)',
                color: '#ffffff'
              }}
            >
              <MdEdit className="text-2xl" />
            </div>
            <div className="flex-1">
              <p style={{ color: 'var(--color-primary-color)', fontWeight: '600' }}>
                {customAud}
              </p>
            </div>
            <button
              onClick={() => removeCustomAudience(customAud)}
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-color)' }}
            >
              <MdCheck className="text-white" />
            </button>
          </div>
        ))}

        {/* Add Other Option */}
        {selectedAudiences.length < 5 && (
          <div
            onClick={() => setShowCustomInput(true)}
            className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all"
            style={{
              backgroundColor: showCustomInput ? 'var(--color-secondary-background)' : 'var(--color-background)',
              border: `2px solid ${showCustomInput ? 'var(--color-primary-color)' : 'transparent'}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: showCustomInput ? 'var(--color-primary-color)' : 'var(--color-secondary-background)',
                color: showCustomInput ? '#ffffff' : 'var(--color-primary-color)'
              }}
            >
              <MdEdit className="text-2xl" />
            </div>
            <div className="flex-1">
              <p style={{ 
                color: 'var(--color-primary-color)', 
                fontWeight: showCustomInput ? '600' : '400' 
              }}>
                Other (Specify)
              </p>
            </div>
          </div>
        )}

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
