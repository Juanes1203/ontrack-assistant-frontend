import React from 'react';
import logoImage from '../../unnamed.webp';

export const MentorAILogo: React.FC = () => {
  return (
    <svg width="120" height="150" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <clipPath id="logo-circle">
          <circle cx="60" cy="40" r="36" />
        </clipPath>
      </defs>
      <image href={logoImage} x="24" y="4" width="72" height="72" clipPath="url(#logo-circle)" />
      <text x="60" y="105" textAnchor="middle" fontFamily="'Segoe UI', Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="24" fill="#1E293B">OnTrack</text>
      <text x="60" y="128" textAnchor="middle" fontFamily="'Segoe UI', Arial, Helvetica, sans-serif" fontWeight="500" fontSize="15" fill="#64748b">Assistant</text>
    </svg>
  );
}; 