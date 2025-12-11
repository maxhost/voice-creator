'use client';

export const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </div>
            <span className="font-bold text-white">Voice Creator</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="mailto:support@voicecreator.ai" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {currentYear} Voice Creator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
