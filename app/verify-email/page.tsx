'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Email verified successfully') {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong.');
      });
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded bg-white p-6 text-center shadow">
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h2 className="mb-2 text-lg font-bold">Email Verified!</h2>
            <p className="mb-4">
              Your email has been verified. You can now{' '}
              <a href="/" className="text-blue-600 underline">
                login
              </a>
              .
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="mb-2 text-lg font-bold text-red-600">
              Verification Failed
            </h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </main>
  );
}
// This page handles the email verification process.
// It checks the token from the URL, verifies it against the database,