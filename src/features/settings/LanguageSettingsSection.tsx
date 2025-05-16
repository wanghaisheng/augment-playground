// src/features/settings/LanguageSettingsSection.tsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import type { Language, SettingsLanguageSectionLabels } from '@/types';
import Button from '@/components/common/Button';

interface LanguageSettingsSectionProps {
  labels: SettingsLanguageSectionLabels | undefined;
  isUpdatingPage?: boolean; // Indicates if the parent page is fetching new labels
}

const LanguageSettingsSection: React.FC<LanguageSettingsSectionProps> = ({ labels, isUpdatingPage }) => {
  const { language, setLanguage } = useLanguage();
  const [selectedLocalLang, setSelectedLocalLang] = useState<Language>(language);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setSelectedLocalLang(language); // Sync with global changes
    if (showSuccess) setShowSuccess(false); // Hide success if global lang changes elsewhere
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Only re-sync local if global language changes

  if (!labels) {
    return <p className="loading-text" style={{ fontStyle: 'italic' }}>Loading language settings...</p>;
  }

  const handleSave = () => {
    if (selectedLocalLang !== language) {
      setLanguage(selectedLocalLang); // This will trigger page label refetch
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }
  };

  // Use optional chaining and provide a fallback
  const currentLangDisplay = labels?.currentLanguageIs?.replace('{lang}', language.toUpperCase()) || `Current: ${language.toUpperCase()}`;

  return (
    <section className="task-item"> {/* Apply task-item style for a game-themed look */}
      <h4>{labels.sectionTitle}</h4>
      <p>{currentLangDisplay}</p>
      <div>
        <label htmlFor="lang-select-component" style={{ marginRight: '8px' }}>{labels.selectLanguagePrompt}</label>
        <select
          id="lang-select-component"
          value={selectedLocalLang}
          onChange={e => {
            setSelectedLocalLang(e.target.value as Language);
            if (showSuccess) setShowSuccess(false);
          }}
          disabled={isUpdatingPage}
        >
          <option value="en">{labels.langNameEn}</option>
          <option value="zh">{labels.langNameZh}</option>
        </select>
      </div>
      <Button
        onClick={handleSave}
        disabled={isUpdatingPage || selectedLocalLang === language}
        style={{marginTop: '15px'}}
        variant="jade" // Use jade button style
      >
        {labels.saveButtonText}
      </Button>
      {showSuccess && (
        <p style={{
          color: 'var(--ruyi-green)',
          marginTop: '10px',
          fontStyle:'italic',
          background: 'rgba(46, 139, 87, 0.1)',
          padding: '8px',
          borderRadius: 'var(--radius-sm)'
        }}>
          {labels.successMessage}
        </p>
      )}
    </section>
  );
};
export default LanguageSettingsSection;