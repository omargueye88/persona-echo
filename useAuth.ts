import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  createUserAccount, 
  signInWithEmail, 
  signOutUser, 
  onAuthStateChange,
  updateUserLastLogin 
} from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Update last login time when user signs in
      if (user) {
        try {
          await updateUserLastLogin(user.uid);
        } catch (error) {
          console.error('Failed to update last login:', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await createUserAccount(email, password, displayName);
      return result.user;
    } catch (error: any) {
      let errorMessage = 'Erreur lors de la création du compte';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cette adresse email est déjà utilisée';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmail(email, password);
      return result.user;
    } catch (error: any) {
      let errorMessage = 'Erreur de connexion';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cette adresse email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await signOutUser();
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    isAuthenticated: !!user
  };
};