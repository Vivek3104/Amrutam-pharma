import React, { useState } from 'react';
import { Hero } from '../components/Hero';

interface HomeProps {
  onExplorePharmacyClick: () => void;
}

export const Home: React.FC<HomeProps> = ({ onExplorePharmacyClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  return (
    <div style={{ background: '#FAF5EE', minHeight: '100vh' }}>
      {/* Exclusive Amrutam Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        onNavigateTab={(tab) => {
          if (tab === 'pharmacy') onExplorePharmacyClick();
        }}
      />
    </div>
  );
};
