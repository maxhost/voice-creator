'use client';

import { useState, useMemo } from 'react';
import type { SocialNetwork, UserProfile } from '@/app/model/types';

const SOCIAL_NETWORKS: { id: SocialNetwork; label: string; icon: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'twitter', label: 'X / Twitter', icon: '𝕏' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'facebook', label: 'Facebook', icon: '👤' },
];

type Translations = {
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  networksLabel: string;
  networksHint: string;
  expertiseLabel: string;
  expertisePlaceholder: string;
  minChars: string;
  submit: string;
};

const TRANSLATIONS: Record<string, Translations> = {
  es: {
    title: 'Antes de empezar...',
    subtitle: 'Cuéntanos un poco sobre ti para personalizar tu entrevista',
    nameLabel: 'Tu nombre',
    namePlaceholder: '¿Cómo te llamas?',
    networksLabel: '¿Para qué redes quieres crear contenido?',
    networksHint: 'Selecciona al menos una red social',
    expertiseLabel: '¿Sobre qué tema te gustaría crear contenido?',
    expertisePlaceholder: 'Ej: Soy diseñador gráfico especializado en branding para startups. Me encanta enseñar sobre identidad visual y tipografía.',
    minChars: 'caracteres mínimo',
    submit: 'Comenzar entrevista',
  },
  en: {
    title: 'Before we start...',
    subtitle: 'Tell us a bit about yourself to personalize your interview',
    nameLabel: 'Your name',
    namePlaceholder: 'What\'s your name?',
    networksLabel: 'Which social networks do you want to create content for?',
    networksHint: 'Select at least one social network',
    expertiseLabel: 'What topic would you like to create content about?',
    expertisePlaceholder: 'E.g.: I\'m a graphic designer specialized in branding for startups. I love teaching about visual identity and typography.',
    minChars: 'minimum characters',
    submit: 'Start interview',
  },
  fr: {
    title: 'Avant de commencer...',
    subtitle: 'Parlez-nous un peu de vous pour personnaliser votre entretien',
    nameLabel: 'Votre nom',
    namePlaceholder: 'Comment vous appelez-vous?',
    networksLabel: 'Pour quels réseaux sociaux voulez-vous créer du contenu?',
    networksHint: 'Sélectionnez au moins un réseau social',
    expertiseLabel: 'Sur quel sujet aimeriez-vous créer du contenu?',
    expertisePlaceholder: 'Ex: Je suis graphiste spécialisé en branding pour startups. J\'adore enseigner l\'identité visuelle et la typographie.',
    minChars: 'caractères minimum',
    submit: 'Commencer l\'entretien',
  },
  de: {
    title: 'Bevor wir anfangen...',
    subtitle: 'Erzählen Sie uns etwas über sich, um Ihr Interview zu personalisieren',
    nameLabel: 'Ihr Name',
    namePlaceholder: 'Wie heißen Sie?',
    networksLabel: 'Für welche sozialen Netzwerke möchten Sie Inhalte erstellen?',
    networksHint: 'Wählen Sie mindestens ein soziales Netzwerk',
    expertiseLabel: 'Über welches Thema möchten Sie Inhalte erstellen?',
    expertisePlaceholder: 'Z.B.: Ich bin Grafikdesigner spezialisiert auf Branding für Startups. Ich unterrichte gerne über visuelle Identität und Typografie.',
    minChars: 'Mindestzeichen',
    submit: 'Interview starten',
  },
  pt: {
    title: 'Antes de começar...',
    subtitle: 'Conte-nos um pouco sobre você para personalizar sua entrevista',
    nameLabel: 'Seu nome',
    namePlaceholder: 'Qual é o seu nome?',
    networksLabel: 'Para quais redes sociais você quer criar conteúdo?',
    networksHint: 'Selecione pelo menos uma rede social',
    expertiseLabel: 'Sobre qual tema você gostaria de criar conteúdo?',
    expertisePlaceholder: 'Ex: Sou designer gráfico especializado em branding para startups. Adoro ensinar sobre identidade visual e tipografia.',
    minChars: 'caracteres mínimos',
    submit: 'Iniciar entrevista',
  },
  it: {
    title: 'Prima di iniziare...',
    subtitle: 'Raccontaci un po\' di te per personalizzare la tua intervista',
    nameLabel: 'Il tuo nome',
    namePlaceholder: 'Come ti chiami?',
    networksLabel: 'Per quali social network vuoi creare contenuti?',
    networksHint: 'Seleziona almeno un social network',
    expertiseLabel: 'Su quale argomento vorresti creare contenuti?',
    expertisePlaceholder: 'Es: Sono un grafico specializzato in branding per startup. Mi piace insegnare identità visiva e tipografia.',
    minChars: 'caratteri minimi',
    submit: 'Inizia intervista',
  },
};

function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.split('-')[0].toLowerCase();
  return TRANSLATIONS[lang] ? lang : 'en';
}

type OnboardingModalProps = {
  onComplete: (profile: UserProfile) => void;
};

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [name, setName] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<SocialNetwork[]>([]);
  const [expertise, setExpertise] = useState('');

  const lang = useMemo(() => getBrowserLanguage(), []);
  const t = TRANSLATIONS[lang];

  const toggleNetwork = (network: SocialNetwork) => {
    setSelectedNetworks((prev) =>
      prev.includes(network)
        ? prev.filter((n) => n !== network)
        : [...prev, network]
    );
  };

  const isValid = name.trim().length > 0 && selectedNetworks.length > 0 && expertise.trim().length > 10;

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
              {t.title}
            </h2>
            <p className="text-gray-600 mt-2">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t.nameLabel}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.networksLabel}
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
                <p className="text-sm text-gray-500 mt-2">{t.networksHint}</p>
              )}
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                {t.expertiseLabel}
              </label>
              <textarea
                id="expertise"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder={t.expertisePlaceholder}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900"
              />
              <p className="text-sm text-gray-500 mt-1">
                {expertise.length}/10 {t.minChars}
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
              {t.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
