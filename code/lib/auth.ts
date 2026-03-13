import { cookies } from 'next/headers';

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
};

export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return !!token;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  
  // If starts with 0, replace with 62
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  
  // If doesn't start with 62, add it
  if (!digits.startsWith('62')) {
    return '62' + digits;
  }
  
  return digits;
};
