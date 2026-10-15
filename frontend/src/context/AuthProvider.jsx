import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const generateUserId = () => Math.floor(10000000 + Math.random() * 90000000).toString();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Process Google Redirect result on page mount
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          console.log("Google redirect sign in success:", result.user.email);
          const userRef = doc(db, 'users', result.user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const newUserData = {
              fullName: result.user.displayName || '',
              email: result.user.email || '',
              role: 'Customer',
              createdAt: new Date().toISOString(),
              customUserId: generateUserId()
            };
            await setDoc(userRef, newUserData, { merge: true });
            openAuthModal('google-details');
          } else if (!userSnap.data()?.organization) {
            openAuthModal('google-details');
          }
        }
      })
      .catch((err) => {
        console.error("Redirect result error:", err);
      });
  }, []);

  useEffect(() => {
    let unsubscribeDoc = null;

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);

        unsubscribeDoc = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            const isUserAdmin = data.role?.toLowerCase() === 'admin';
            const resolvedRole = isUserAdmin ? 'admin' : (data.role?.toLowerCase() === 'customer' ? 'user' : (data.role?.toLowerCase() || 'user'));
            setRole(resolvedRole);

            if (!data.organization && currentUser.providerData?.some(p => p.providerId === 'google.com')) {
              openAuthModal('google-details');
            }
          } else {
            const newUserData = {
              fullName: currentUser.displayName || '',
              email: currentUser.email || '',
              role: 'Customer',
              createdAt: new Date().toISOString(),
              customUserId: generateUserId()
            };
            try {
              await setDoc(docRef, newUserData, { merge: true });
            } catch (e) {
              console.warn("Could not save initial user doc:", e);
            }
            setUserData(newUserData);
            setRole('user');
            if (currentUser.providerData?.some(p => p.providerId === 'google.com')) {
              openAuthModal('google-details');
            }
          }
          clearTimeout(timeout);
          setLoading(false);
        }, (error) => {
          console.error("Error in real-time user doc snapshot:", error);
          setUserData(null);
          setRole('user');
          clearTimeout(timeout);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setRole(null);
        clearTimeout(timeout);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeout);
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, []);

  const value = {
    user,
    userData,
    role,
    loading,
    isAuthModalOpen,
    authMode,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
