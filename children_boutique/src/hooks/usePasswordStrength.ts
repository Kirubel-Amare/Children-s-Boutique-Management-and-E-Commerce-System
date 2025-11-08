// hooks/usePasswordStrength.ts
import { useState, useEffect } from 'react';

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export const usePasswordStrength = (password: string) => {
  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, feedback: [] });

  useEffect(() => {
    if (password) {
      setStrength(calculatePasswordStrength(password));
    } else {
      setStrength({ score: 0, feedback: [] });
    }
  }, [password]);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    return { score, feedback };
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  return {
    strength,
    getStrengthColor,
    getStrengthText,
  };
};