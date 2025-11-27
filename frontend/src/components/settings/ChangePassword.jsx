import React, { useState, useEffect, useRef } from 'react';
import { MdLock, MdEmail, MdCheck, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { sendOTP, inputOTP, changePassword } from '../../services/user/otp..service';
import { useAuth } from '../../hooks/useAuth';

const TIMER_KEY = 'password_otp_timer_end';

const ChangePassword = () => {
  const { userInfo } = useAuth();
  const modalRef = useRef(null);

  // Steps: 'send' -> 'otp' -> 'password' -> 'success'
  const [step, setStep] = useState('send');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Timer state
  const [timer, setTimer] = useState(0);

  const userEmail = userInfo?.message?.user_info?.email || null;

  // Initialize timer from localStorage
  useEffect(() => {
    const savedEnd = localStorage.getItem(TIMER_KEY);
    if (savedEnd) {
      const remaining = Math.floor((parseInt(savedEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
      } else {
        localStorage.removeItem(TIMER_KEY);
      }
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(TIMER_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = (seconds = 60) => {
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem(TIMER_KEY, endTime.toString());
    setTimer(seconds);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    const visible = localPart.slice(0, 2);
    return `${visible}${'*'.repeat(Math.min(localPart.length - 2, 5))}@${domain}`;
  };

  const openModal = () => {
    setStep('send');
    setOtp('');
    setPassword('');
    setRePassword('');
    setError('');
    setSuccess('');
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  const handleSendOTP = async () => {
    if (!userEmail) {
      setError('No email found on your account');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await sendOTP({ email: userEmail });
      if (res?.ok) {
        startTimer(60);
        setStep('otp');
        setSuccess('OTP sent to your email!');
      } else {
        setError(res?.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await inputOTP({ otp });
      if (res?.ok) {
        setStep('password');
        setSuccess('OTP verified! Now set your new password.');
        setError('');
      } else {
        setError(res?.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    await handleSendOTP();
  };

  // Password validation
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    matches: password === rePassword && password.length > 0
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleChangePassword = async () => {
    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await changePassword({ new_password: password });
      if (res?.ok) {
        setStep('success');
        setSuccess('Password changed successfully!');
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setError(res?.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !userEmail;

  return (
    <>
      <div className="tooltip" data-tip={isDisabled ? 'Add an email first to change password' : ''}>
        <button
          className="btn btn-outline btn-sm"
          onClick={openModal}
          disabled={isDisabled}
        >
          <MdLock className="w-4 h-4" />
          Change Password
        </button>
      </div>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          {step === 'send' && (
            <>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MdLock className="text-primary" />
                Change Password
              </h3>
              <p className="py-2 text-sm text-text-secondary">
                To change your password, we'll send a verification code to your email.
              </p>

              <div className="bg-base-200 rounded-lg p-4 mt-4 flex items-center gap-3">
                <MdEmail className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Send OTP to:</p>
                  <p className="font-medium">{maskEmail(userEmail)}</p>
                </div>
              </div>

              {error && (
                <div className="alert alert-error py-2 mt-3">
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="modal-action">
                <button
                  className="btn btn-primary"
                  onClick={handleSendOTP}
                  disabled={loading || timer > 0}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : timer > 0 ? (
                    `Resend in ${formatTimer(timer)}`
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MdLock className="text-primary" />
                Enter Verification Code
              </h3>
              <p className="py-2 text-sm text-text-secondary">
                We sent a 6-digit code to <strong>{maskEmail(userEmail)}</strong>
              </p>

              {success && (
                <div className="alert alert-success py-2 mb-3">
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">6-Digit OTP</span>
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  className={`input input-bordered w-full text-center text-2xl tracking-widest ${error ? 'input-error' : ''}`}
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                  disabled={loading}
                />
                {error && (
                  <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                  </label>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleResendOTP}
                  disabled={timer > 0 || loading}
                >
                  {timer > 0 ? `Resend in ${formatTimer(timer)}` : 'Resend OTP'}
                </button>
              </div>

              <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => setStep('send')}>
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            </>
          )}

          {step === 'password' && (
            <>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MdLock className="text-primary" />
                Set New Password
              </h3>
              <p className="py-2 text-sm text-text-secondary">
                Create a strong password for your account.
              </p>

              {error && (
                <div className="alert alert-error py-2 mb-3">
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className={`input input-bordered w-full pr-10 ${
                      password && !passwordValidation.minLength ? 'input-error' : ''
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showRePassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    className={`input input-bordered w-full pr-10 ${
                      rePassword && !passwordValidation.matches ? 'input-error' : ''
                    }`}
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    onClick={() => setShowRePassword(!showRePassword)}
                  >
                    {showRePassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
                {rePassword && !passwordValidation.matches && (
                  <label className="label">
                    <span className="label-text-alt text-error">Passwords do not match</span>
                  </label>
                )}
              </div>

              {/* Password requirements checklist */}
              <div className="mt-4 p-3 bg-base-200 rounded-lg">
                <p className="text-sm font-medium mb-2">Password must include:</p>
                <ul className="space-y-1 text-sm">
                  <li className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-success' : 'text-text-secondary'}`}>
                    <span>{passwordValidation.minLength ? '✓' : '○'}</span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-success' : 'text-text-secondary'}`}>
                    <span>{passwordValidation.hasUppercase ? '✓' : '○'}</span>
                    At least one uppercase letter (A-Z)
                  </li>
                  <li className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-success' : 'text-text-secondary'}`}>
                    <span>{passwordValidation.hasLowercase ? '✓' : '○'}</span>
                    At least one lowercase letter (a-z)
                  </li>
                  <li className={`flex items-center gap-2 ${passwordValidation.hasSpecial ? 'text-success' : 'text-text-secondary'}`}>
                    <span>{passwordValidation.hasSpecial ? '✓' : '○'}</span>
                    At least one special character (!@#$%^&* etc.)
                  </li>
                  <li className={`flex items-center gap-2 ${passwordValidation.matches ? 'text-success' : 'text-text-secondary'}`}>
                    <span>{passwordValidation.matches ? '✓' : '○'}</span>
                    Both passwords match
                  </li>
                </ul>
              </div>

              <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => setStep('otp')}>
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleChangePassword}
                  disabled={loading || !isPasswordValid}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdCheck className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-bold text-lg">Password Changed!</h3>
              <p className="text-sm text-text-secondary mt-2">{success}</p>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ChangePassword;
