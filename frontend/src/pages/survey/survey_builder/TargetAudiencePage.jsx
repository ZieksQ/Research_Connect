import { useState } from 'react';
import { MdPeople, MdBusiness, MdSchool, MdLocalHospital, MdEdit, MdCheck, MdWork, MdScience, MdComputer, MdFamilyRestroom, MdElderly } from 'react-icons/md';

export default function TargetAudiencePage({ data, onNext, onBack }) {
  const [selectedAudiences, setSelectedAudiences] = useState(
    Array.isArray(data.target) ? data.target : data.target ? [data.target] : []
  );
  const [customAudience, setCustomAudience] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const audiences = [
    { id: 'students', label: 'Students', icon: MdSchool },
    { id: 'businessStudents', label: 'Business Students', icon: MdBusiness },
    { id: 'generalPublic', label: 'General Public', icon: MdPeople },
    { id: 'professionals', label: 'Professionals', icon: MdWork },
    { id: 'educators', label: 'Educators', icon: MdSchool },
    { id: 'healthcareWorkers', label: 'Healthcare Workers', icon: MdLocalHospital },
    { id: 'itProfessionals', label: 'IT Professionals', icon: MdComputer },
    { id: 'researchers', label: 'Researchers', icon: MdScience },
    { id: 'parents', label: 'Parents', icon: MdFamilyRestroom },
    { id: 'seniorCitizens', label: 'Senior Citizens', icon: MdElderly }
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-giaza text-custom-blue mb-2">Target Audience</h2>
        <p className="text-sm text-gray-500">
          Select the audiences you want to target with this survey (max 5)
        </p>
        {selectedAudiences.length > 0 && (
          <p className="text-sm mt-2 text-custom-green font-medium">
            {selectedAudiences.length} of 5 selected
          </p>
        )}
      </div>

      <div className="space-y-3 mb-8">
        {audiences.map((audience) => {
          const Icon = audience.icon;
          const isSelected = selectedAudiences.includes(audience.id);
          
          return (
            <div
              key={audience.id}
              onClick={() => handleAudienceToggle(audience.id)}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border ${
                isSelected 
                  ? 'bg-blue-50 border-custom-blue' 
                  : 'bg-gray-50 border-transparent hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-custom-blue text-white' : 'bg-white text-custom-blue shadow-sm'
                }`}
              >
                <Icon className="text-2xl" />
              </div>
              <div className="flex-1">
                <p className={`text-base lg:text-lg ${isSelected ? 'text-custom-blue font-semibold' : 'text-gray-700'}`}>
                  {audience.label}
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-custom-blue flex items-center justify-center">
                  <MdCheck className="text-white text-sm" />
                </div>
              )}
            </div>
          );
        })}

        {/* Custom Audiences Display */}
        {customAudiences.map((customAud) => (
          <div
            key={customAud}
            className="flex items-center gap-4 p-4 rounded-lg transition-all bg-blue-50 border border-custom-blue"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-custom-blue text-white">
              <MdEdit className="text-2xl" />
            </div>
            <div className="flex-1">
              <p className="text-base lg:text-lg text-custom-blue font-semibold">
                {customAud}
              </p>
            </div>
            <button
              onClick={() => removeCustomAudience(customAud)}
              className="w-6 h-6 rounded-full bg-custom-blue flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <MdCheck className="text-white text-sm" />
            </button>
          </div>
        ))}

        {/* Add Other Option */}
        {selectedAudiences.length < 5 && (
          <div
            onClick={() => setShowCustomInput(true)}
            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border ${
              showCustomInput 
                ? 'bg-blue-50 border-custom-blue' 
                : 'bg-gray-50 border-transparent hover:bg-gray-100'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                showCustomInput ? 'bg-custom-blue text-white' : 'bg-white text-custom-blue shadow-sm'
              }`}
            >
              <MdEdit className="text-2xl" />
            </div>
            <div className="flex-1">
              <p className={`text-base lg:text-lg ${showCustomInput ? 'text-custom-blue font-semibold' : 'text-gray-700'}`}>
                Other (Specify)
              </p>
            </div>
          </div>
        )}

        {showCustomInput && (
          <div className="flex gap-2 px-4 pt-2">
            <input
              type="text"
              value={customAudience}
              onChange={(e) => setCustomAudience(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomAudience()}
              className="input input-bordered flex-1 bg-white border-gray-300 focus:border-custom-blue text-gray-900"
              placeholder="Enter custom audience"
              autoFocus
            />
            <button
              onClick={handleCustomAudience}
              className="btn bg-custom-blue hover:bg-blue-700 text-white border-none"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="btn flex-1 btn-ghost text-gray-600 hover:bg-gray-100 border-gray-300"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn flex-1 bg-custom-blue hover:bg-blue-700 text-white border-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
