'use client';

import { useLanguage, getTranslation, interview } from '@/shared/i18n';

type StateLayoutProps = {
  children: React.ReactNode;
};

const StateLayout = ({ children }: StateLayoutProps) => (
  <main className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4 max-w-md">{children}</div>
  </main>
);

export const LoadingState = () => {
  const lang = useLanguage();

  return (
    <StateLayout>
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-gray-600">{getTranslation(interview.states.verifying, lang)}</p>
    </StateLayout>
  );
};

type ErrorStateProps = {
  error: string | null;
  onBack: () => void;
};

export const ErrorState = ({ error, onBack }: ErrorStateProps) => {
  const lang = useLanguage();

  return (
    <StateLayout>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-3xl">X</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        {getTranslation(interview.states.verificationError, lang)}
      </h1>
      <p className="text-gray-600">
        {error || getTranslation(interview.states.verificationErrorMessage, lang)}
      </p>
      <button
        onClick={onBack}
        className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-default"
      >
        {getTranslation(interview.states.backToHome, lang)}
      </button>
    </StateLayout>
  );
};

type UsedStateProps = {
  onBuyNew: () => void;
};

export const UsedState = ({ onBuyNew }: UsedStateProps) => {
  const lang = useLanguage();

  return (
    <StateLayout>
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-3xl">!</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        {getTranslation(interview.states.sessionUsed, lang)}
      </h1>
      <p className="text-gray-600">
        {getTranslation(interview.states.sessionUsedMessage, lang)}
      </p>
      <button
        onClick={onBuyNew}
        className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-default"
      >
        {getTranslation(interview.states.buyNewSession, lang)}
      </button>
    </StateLayout>
  );
};

export const GeneratingState = () => {
  const lang = useLanguage();

  return (
    <StateLayout>
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        {getTranslation(interview.states.generating, lang)}
      </h1>
      <p className="text-gray-600">
        {getTranslation(interview.states.generatingMessage, lang)}
      </p>
      <div className="flex justify-center gap-1 pt-4">
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </StateLayout>
  );
};
