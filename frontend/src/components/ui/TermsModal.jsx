import React from "react";

const TermsModal = ({ isOpen, onClose, onConfirm, title = "Terms and Conditions", showConfirm = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow text-gray-600 text-sm leading-relaxed space-y-4">
          <p><strong>Last Updated: December 2025</strong></p>
          
          <p>Welcome to Inquira. By accessing or using our website and services, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>

          <h4 className="font-bold text-gray-800 mt-4">1. Acceptance of Terms</h4>
          <p>By creating an account, you agree to comply with all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>

          <h4 className="font-bold text-gray-800 mt-4">2. User Accounts</h4>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

          <h4 className="font-bold text-gray-800 mt-4">3. User Content</h4>
          <p>You retain ownership of any surveys, data, or content you submit. However, by posting content, you grant Inquira a non-exclusive license to use, reproduce, and display such content in connection with the service.</p>

          <h4 className="font-bold text-gray-800 mt-4">4. Prohibited Conduct</h4>
          <p>You agree not to use the service for any unlawful purpose, including but not limited to: harassment, spamming, or distributing malware.</p>

          <h4 className="font-bold text-gray-800 mt-4">5. Privacy Policy</h4>
          <p>Your privacy is important to us. We collect data to improve our services. We do not sell your personal data to third parties without your consent.</p>

          <h4 className="font-bold text-gray-800 mt-4">6. Termination</h4>
          <p>We reserve the right to terminate or suspend your account at any time, without notice, for conduct that we believe violates these Terms.</p>

          <h4 className="font-bold text-gray-800 mt-4">7. Changes to Terms</h4>
          <p>We may modify these terms at any time. Continued use of the service constitutes acceptance of the modified terms.</p>
          
          <p className="mt-8">If you have any questions, please contact support@inquira.com.</p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button 
            onClick={onClose} 
            className="btn btn-ghost text-gray-600 hover:bg-gray-200"
          >
            {showConfirm ? "Cancel" : "Close"}
          </button>
          {showConfirm && (
            <button 
              onClick={onConfirm} 
              className="btn bg-custom-blue text-white hover:bg-blue-800 border-none"
            >
              I Agree & Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
