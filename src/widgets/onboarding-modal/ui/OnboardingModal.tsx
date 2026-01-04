'use client';

import { useState } from 'react';
import { useLanguage, getTranslation } from '@/shared/i18n';
import { interview } from '@/shared/i18n';
import type { SocialNetwork, UserProfile } from '@/app/model/types';

const SOCIAL_NETWORKS: { id: SocialNetwork; label: string; icon: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'twitter', label: 'X / Twitter', icon: '𝕏' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'facebook', label: 'Facebook', icon: '👤' },
];

type OnboardingModalProps = {
  onComplete: (profile: UserProfile) => void;
};

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [name, setName] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<SocialNetwork[]>([]);
  const [expertise, setExpertise] = useState('');

  const lang = useLanguage();

  const toggleNetwork = (network: SocialNetwork) => {
    setSelectedNetworks((prev) =>
      prev.includes(network)
        ? prev.filter((n) => n !== network)
        : [...prev, network]
    );
  };

  const isValid = name.trim().length > 0 && selectedNetworks.length > 0 && expertise.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onComplete({
      name: name.trim(),
      socialNetworks: selectedNetworks,
      expertise: expertise.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {getTranslation(interview.onboarding.title, lang)}
            </h2>
            <p className="text-gray-600 mt-2">
              {getTranslation(interview.onboarding.subtitle, lang)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(interview.onboarding.nameLabel, lang)}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={getTranslation(interview.onboarding.namePlaceholder, lang)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(interview.onboarding.networksLabel, lang)}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SOCIAL_NETWORKS.map((network) => (
                  <button
                    key={network.id}
                    type="button"
                    onClick={() => toggleNetwork(network.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
                      ${selectedNetworks.includes(network.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    <span className="text-xl">{network.icon}</span>
                    <span className="font-medium">{network.label}</span>
                  </button>
                ))}
              </div>
              {selectedNetworks.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">{getTranslation(interview.onboarding.networksHint, lang)}</p>
              )}
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(interview.onboarding.expertiseLabel, lang)}
              </label>
              <textarea
                id="expertise"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value.slice(0, 400))}
                placeholder={getTranslation(interview.onboarding.expertisePlaceholder, lang)}
                rows={3}
                maxLength={400}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900"
              />
              <p className="text-sm text-gray-500 mt-1">
                {expertise.length}/400
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all
                ${isValid
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {getTranslation(interview.onboarding.submit, lang)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
