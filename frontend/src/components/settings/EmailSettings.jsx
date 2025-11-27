import React, { useState, useEffect, useRef } from 'react';
import { MdEmail, MdLock, MdCheck } from 'react-icons/md';
import { sendOTP, addEmail } from '../../services/user/otp..service';
import { useAuth } from '../../hooks/useAuth';

const TIMER_KEY = 'email_otp_timer_end';

const EmailSettings = () => {
  const { refreshUser } = useAuth();
  const modalRef = useRef(null);

  // Steps: 'email' -> 'otp' -> 'success'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Timer state
  const [timer, setTimer] = useState(0);

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

  const openModal = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setError('');
    setSuccess('');
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  const handleSendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await sendOTP({ email });
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
      const res = await addEmail({ otp });
      if (res?.ok) {
        setStep('success');
        setSuccess('Email added successfully!');
        await refreshUser();
        setTimeout(() => {
          closeModal();
        }, 1500);
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

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={openModal}>
        <MdEmail className="w-4 h-4" />
        Add Email
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          {step === 'email' && (
            <>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MdEmail className="text-primary" />
                Add Email Address
              </h3>
              <p className="py-2 text-sm text-text-secondary">
                Enter your email address. We'll send you a verification code.
              </p>

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                {error && (
                  <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                  </label>
                )}
              </div>

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
                We sent a 6-digit code to <strong>{email}</strong>
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
                <button className="btn btn-ghost" onClick={() => setStep('email')}>
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
                    'Verify Email'
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
              <h3 className="font-bold text-lg">Email Added!</h3>
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

export default EmailSettings;
