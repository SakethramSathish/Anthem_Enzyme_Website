import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithRedirect, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import CountrySelect from './CountrySelect';

const generateUserId = () => Math.floor(10000000 + Math.random() * 90000000).toString();


export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode);
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Forgot Password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  // Signup states
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [organization, setOrganization] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  
  const [googleUid, setGoogleUid] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError('');
    }
  }, [isOpen, defaultMode]);


  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError('Please verify your email address before logging in. Check your inbox for the verification link.');
        return;
      }
      
      onClose();
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Wrong Username or Password. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (signupPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    // Password requirements: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,4096}$/;
    if (!passwordRegex.test(signupPassword)) {
      return setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }
    

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      if (fullName) {
        await updateProfile(userCredential.user, { displayName: fullName });
      }
      
      const userData = {
        fullName,
        email: signupEmail,
        role: 'Customer', // Everyone starts as Customer
        createdAt: new Date().toISOString(),
        customUserId: generateUserId()
      };
      userData.organization = organization;
      userData.country = country;
      userData.phone = phone;

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      setMode('verify-email');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("Google Popup success:", result.user.email);

        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const existingData = userSnap.data() || {};
          if (!existingData.organization) {
            setGoogleUid(result.user.uid);
            setMode('google-details');
          } else {
            onClose();
          }
        } else {
          // Brand new user: create initial profile as Customer
          await setDoc(userRef, {
            fullName: result.user.displayName || '',
            email: result.user.email || '',
            role: 'Customer',
            createdAt: new Date().toISOString(),
            customUserId: generateUserId()
          });
          setGoogleUid(result.user.uid);
          setMode('google-details');
        }
      } catch (popupErr) {
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
          console.warn("Popup blocked, falling back to signInWithRedirect:", popupErr);
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupErr;
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domain is not authorized in Firebase Console. Please add it under Authentication → Settings → Authorized domains.');
      } else {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDetailsSubmit = async (e) => {
    e.preventDefault();
    const uid = googleUid || auth.currentUser?.uid;
    if (!uid) return;
    
    setError('');
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', uid), {
        organization,
        country,
        phone
      }, { merge: true });
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setResetSent(true);
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-fade-in-up">
      <div className={`bg-[#FCFCFC] dark:bg-slate-900 w-full ${mode === 'login' ? 'sm:max-w-[440px]' : 'sm:max-w-[480px]'} max-h-[92dvh] sm:max-h-none overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl relative border-t sm:border border-slate-200 dark:border-slate-800 transition-all duration-300`}>
        {/* Mobile top drag indicator handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {mode === 'forgot-password' && (
          <>
            <div className="px-5 sm:px-10 pt-6 sm:pt-12 pb-4 sm:pb-6">
              <h2 className="text-2xl sm:text-[32px] font-black text-black dark:text-white tracking-tight font-serif">Reset Password</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 sm:mt-4 text-sm sm:text-[17px] leading-relaxed pr-2 sm:pr-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            <div className="px-5 sm:px-10 pb-8 sm:pb-10">
              {resetSent ? (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6 text-[17px]">
                  If an account exists for this email, a password reset link has been sent. Please check your inbox. If it is not there, please check your spam folder.
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-[16px] font-bold text-black dark:text-slate-200 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-[17px]" 
                      placeholder="you@organization.com" 
                      required 
                    />
                  </div>
                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#111111] dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-white dark:text-slate-900 text-[18px] font-medium py-3.5 rounded-lg transition-all disabled:opacity-70 mt-2 shadow-sm"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <button 
                  onClick={() => {setMode('login'); setError(''); setResetSent(false);}} 
                  className="text-[16px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-medium"
                >
                  Return to Login
                </button>
              </div>
            </div>
          </>
        )}
        
        {mode === 'login' && (
          <>
            <div className="px-5 sm:px-10 pt-6 sm:pt-12 pb-4 sm:pb-6">
              <h2 className="text-2xl sm:text-[32px] font-black text-black dark:text-white tracking-tight font-serif">Welcome back</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 sm:mt-4 text-sm sm:text-[17px] leading-relaxed pr-2 sm:pr-4">
                Access your account to manage orders and track shipments.
              </p>
            </div>
            
            <div className="px-5 sm:px-10 pb-8 sm:pb-10">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[16px] font-bold text-black dark:text-slate-200 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-[17px]" 
                    placeholder="you@organization.com" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-[16px] font-bold text-black dark:text-slate-200 mb-2">Password</label>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-600 text-black dark:text-white text-[17px] tracking-widest font-mono" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex items-center justify-between pt-2 pb-3">
                  <label className="flex items-center text-[16px] text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-[18px] h-[18px] rounded-[4px] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1A73E8] focus:ring-[#1A73E8] mr-2.5" 
                    />
                    Remember me
                  </label>
                  <button type="button" onClick={() => {setMode('forgot-password'); setError(''); setResetSent(false);}} className="text-[16px] text-[#1A73E8] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#111111] dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-white dark:text-slate-900 text-[18px] font-medium py-3.5 rounded-lg transition-all disabled:opacity-70 mt-2 shadow-sm"
                >
                  {loading ? 'Processing...' : 'Login'}
                </button>
              </form>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-[15px] font-medium">Or continue with</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-[17px] font-medium py-3 rounded-lg transition-all disabled:opacity-70 flex justify-center items-center shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Google
              </button>

              <div className="mt-6 text-center text-[16px] text-slate-600 dark:text-slate-400">
                Don't have an account? <button onClick={() => {setMode('signup'); setError('');}} className="text-[#1A73E8] dark:text-blue-400 font-semibold hover:underline">Sign up</button>
              </div>
            </div>
          </>
        )}
        
        {mode === 'signup' && (
          <>
            <div className="px-5 sm:px-10 pt-6 sm:pt-10 pb-3 sm:pb-4">
              <h2 className="text-2xl sm:text-[32px] font-black text-black dark:text-white tracking-tight font-serif">Create Account</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 sm:mt-3 text-sm sm:text-[17px] leading-relaxed pr-2 sm:pr-4">
                Create your account to enjoy a faster, more personalized experience.
              </p>
            </div>
            
            <div className="px-5 sm:px-10 pb-8 sm:pb-10">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-[15px] sm:text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-base sm:text-[17px]" 
                    placeholder="Dr. Jane Smith" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[15px] sm:text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-base sm:text-[17px]" 
                    placeholder="you@organization.com" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[15px] sm:text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Password</label>
                    <input 
                      type="password" 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-black dark:text-white text-base sm:text-[17px] tracking-widest font-mono" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] sm:text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-black dark:text-white text-base sm:text-[17px] tracking-widest font-mono" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Organization / Lab Name</label>
                  <input 
                    type="text" 
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-[17px]" 
                    placeholder="University of Science / Biotech Inc." 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-[17px]" 
                    placeholder="+1 (555) 000-0000" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Country</label>
                  <CountrySelect 
                    value={country}
                    onChange={setCountry}
                  />
                </div>


                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#1A4BDB] hover:bg-blue-700 text-white text-[18px] font-medium py-3.5 rounded-lg transition-all disabled:opacity-70 mt-6 shadow-sm"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-[15px] font-medium">Or continue with</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-[17px] font-medium py-3 rounded-lg transition-all disabled:opacity-70 flex justify-center items-center shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Google
              </button>

              <div className="mt-6 text-center text-[16px] text-slate-600 dark:text-slate-400">
                Already have an account? <button onClick={() => {setMode('login'); setError('');}} className="text-[#1A73E8] dark:text-blue-400 font-semibold hover:underline">Log in</button>
              </div>
            </div>
          </>
        )}

        {mode === 'google-details' && (
          <>
            <div className="px-5 sm:px-10 pt-6 sm:pt-10 pb-3 sm:pb-4">
              <h2 className="text-2xl sm:text-[32px] font-black text-black dark:text-white tracking-tight font-serif">Complete Profile</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 sm:mt-3 text-sm sm:text-[17px] leading-relaxed pr-2 sm:pr-4">
                Please provide a few more details to complete your account setup.
              </p>
            </div>
            
            <div className="px-5 sm:px-10 pb-8 sm:pb-10">
              <form onSubmit={handleGoogleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="block text-[15px] sm:text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Organization / Lab Name</label>
                  <input 
                    type="text" 
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-base sm:text-[17px]" 
                    placeholder="University of Science / Biotech Inc." 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[15px] sm:text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-black dark:text-white text-base sm:text-[17px]" 
                    placeholder="+1 (555) 000-0000" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[15px] sm:text-[16px] font-bold text-black dark:text-slate-200 mb-1.5">Country</label>
                  <CountrySelect 
                    value={country}
                    onChange={setCountry}
                  />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#1A4BDB] hover:bg-blue-700 text-white text-[18px] font-medium py-3.5 rounded-lg transition-all disabled:opacity-70 mt-6 shadow-sm"
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </button>
              </form>
            </div>
          </>
        )}

        {mode === 'verify-email' && (
          <div className="px-5 sm:px-10 py-8 sm:py-12 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-[28px] font-black text-black dark:text-white tracking-tight font-serif mb-3 sm:mb-4">Verify your email</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-[17px] leading-relaxed mb-6 sm:mb-8">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account before logging in.
            </p>
            <button 
              onClick={() => {setMode('login'); setError('');}}
              className="w-full bg-[#1A4BDB] hover:bg-blue-700 text-white text-[18px] font-medium py-3.5 rounded-lg transition-all shadow-sm"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
