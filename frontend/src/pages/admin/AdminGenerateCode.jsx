import React, { useState, useEffect } from 'react';
import { generateApprovalCode, getGeneratedCode } from '../../services/user/admin.service';
import { FaKey, FaCopy, FaCheck, FaRedo, FaEye, FaEyeSlash, FaClock } from 'react-icons/fa';

const AdminGenerateCode = () => {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [allCodes, setAllCodes] = useState([]);
  const [visibleCodes, setVisibleCodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Fetch all generated codes on mount
  useEffect(() => {
    fetchAllCodes();
  }, []);

  const fetchAllCodes = async () => {
    setLoadingCodes(true);
    try {
      const response = await getGeneratedCode();
      if (response.ok) {
        setAllCodes(response.message || []);
      }
    } catch (err) {
      console.error('Failed to fetch codes:', err);
    } finally {
      setLoadingCodes(false);
    }
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await generateApprovalCode();

      if (response.ok) {
        setGeneratedCode(response.generated_code);
        // Refresh the codes list after generating a new one
        fetchAllCodes();
      } else {
        setError(response.message || 'Failed to generate approval code');
      }
    } catch (err) {
      setError('An error occurred while generating the code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy code to clipboard');
    }
  };

  const handleCopyListCode = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(index);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleCodeVisibility = (index) => {
    setVisibleCodes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaKey className="text-3xl text-primary" />
          <h1 className="text-3xl font-bold">Generate Approval Code</h1>
        </div>
        <p className="text-base-content/60">
          Generate approval codes for users to bypass manual post approval
        </p>
        <div className="divider"></div>
      </div>

      {/* Content Card */}
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">
              <FaKey className="text-primary" />
              Approval Code Generator
            </h2>

            <p className="text-base-content/70 mb-6">
              Generate a unique approval code that users can use when creating posts. 
              Posts created with a valid approval code will be automatically approved 
              without requiring manual review.
            </p>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Generated Code Display */}
            {generatedCode && (
              <div className="bg-base-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-base-content/60">Generated Code:</span>
                  <button
                    onClick={handleCopyCode}
                    className={`btn btn-sm ${copied ? 'btn-success' : 'btn-ghost'}`}
                  >
                    {copied ? (
                      <>
                        <FaCheck className="mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy className="mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xl text-primary font-bold break-all">
                  {generatedCode}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="card-actions justify-center">
              <button
                onClick={handleGenerateCode}
                className={`btn btn-primary btn-lg gap-2 ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Generating...
                  </>
                ) : generatedCode ? (
                  <>
                    <FaRedo />
                    Generate New Code
                  </>
                ) : (
                  <>
                    <FaKey />
                    Generate Code
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
              <h3 className="font-semibold text-info mb-2">How it works:</h3>
              <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
                <li>Click the button above to generate a unique approval code</li>
                <li>Share the code with trusted users who need to create posts</li>
                <li>Users enter the code when creating their post</li>
                <li>Posts with valid codes are automatically approved</li>
              </ul>
            </div>
          </div>
        </div>

        {/* All Generated Codes Section */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">
              <FaKey className="text-primary" />
              All Generated Codes
            </h2>

            {loadingCodes ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : allCodes.length === 0 ? (
              <div className="text-center py-8 text-base-content/60">
                <FaKey className="text-4xl mx-auto mb-3 opacity-30" />
                <p>No codes generated yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Expires At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCodes.map((code, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">
                              {visibleCodes[index] ? code.text : '••••••'}
                            </span>
                            <button
                              onClick={() => toggleCodeVisibility(index)}
                              className="btn btn-ghost btn-xs"
                              title={visibleCodes[index] ? 'Hide code' : 'Show code'}
                            >
                              {visibleCodes[index] ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 text-sm">
                            <FaClock className="text-base-content/50" />
                            <span className={isExpired(code.expires_at) ? 'text-error' : ''}>
                              {formatDate(code.expires_at)}
                            </span>
                          </div>
                        </td>
                        <td>
                          {code.is_used ? (
                            <span className="badge badge-neutral">Used</span>
                          ) : isExpired(code.expires_at) ? (
                            <span className="badge badge-error">Expired</span>
                          ) : (
                            <span className="badge badge-success">Active</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleCopyListCode(code.text, index)}
                            className={`btn btn-sm ${copiedCodeId === index ? 'btn-success' : 'btn-ghost'}`}
                            disabled={code.is_used || isExpired(code.expires_at)}
                          >
                            {copiedCodeId === index ? (
                              <>
                                <FaCheck className="mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <FaCopy className="mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGenerateCode;
