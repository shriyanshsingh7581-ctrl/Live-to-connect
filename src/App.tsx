/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { QuoteProvider } from './context/QuoteContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuoteDrawer } from './components/QuoteDrawer';
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { QuotePage } from './pages/QuotePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage, TermsAndConditionsPage } from './pages/LegalPages';
import { AdminPage } from './pages/AdminPage';

function ScrollToTopAndShortcuts() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  // Owner secret keyboard shortcut (Ctrl+Shift+A or Alt+Shift+A) to open the separate Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  // Render Admin Portal as a completely separate standalone application (no public Header/Footer/Cart)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050112] text-slate-100 selection:bg-[#6854fc] selection:text-white">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    );
  }

  // Public Customer Website (100% separate from Admin Panel)
  return (
    <div className="min-h-screen flex flex-col bg-[#060814] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <QuoteDrawer />
    </div>
  );
}

export default function App() {
  return (
    <QuoteProvider>
      <BrowserRouter>
        <ScrollToTopAndShortcuts />
        <AppShell />
      </BrowserRouter>
    </QuoteProvider>
  );
}

