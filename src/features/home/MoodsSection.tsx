// src/features/home/MoodsSection.tsx
import React from 'react';
import type { HomeMoodsSectionLabels, MoodItem } from '@/types';
import Button from '@/components/common/Button';

interface MoodsSectionProps {
  labels: HomeMoodsSectionLabels | undefined;
  moods: readonly MoodItem[] | undefined; // Made readonly in type
  onRefresh: () => void;
  isFetching?: boolean;
}

const MoodsSection: React.FC<MoodsSectionProps> = ({ labels, moods, onRefresh, isFetching }) => {
  if (!labels) {
    return <p className="loading-text" style={{ fontStyle: 'italic' }}>Loading moods section...</p>;
  }

  return (
    <section className="page-content" style={{marginTop: '20px'}}> {/* Use class for styling */}
      <h4>{labels.sectionTitle}</h4> {/* Use h4 for sections within a page normally */}
      {moods && moods.length > 0 ? (
        <ul>
          {moods.map(mood => (
            <li key={mood.id}>{mood.name}: <strong>{mood.feeling}</strong></li>
          ))}
        </ul>
      ) : (
        <p>{labels.noMoodsMessage}</p>
      )}
      <Button onClick={onRefresh} isLoading={isFetching} loadingText="Refreshing...">
        {labels.refreshButtonText}
      </Button>
    </section>
  );
};
export default MoodsSection; 