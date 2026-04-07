"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { scrollToSection } from "@/app/lib/utils/scroll";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/app/i18n/provider";

export function Navbar() {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavClick = (section: string) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            {/* Center group: Left links + Logo + Right links */}
            <div className="navbar-center">
              {/* Left navigation (close to logo) */}
              <div className="navbar-left">
                <button onClick={() => scrollToSection("about")} className="navbar-link">
                  {t.nav.about}
                </button>
                <button onClick={() => scrollToSection("artists")} className="navbar-link">
                  {t.nav.artists}
                </button>
              </div>

              {/* Center logo */}
              <div className="navbar-logo">
                <button onClick={() => scrollToSection("home")}>
                  <Image
                    src="/theboweryst-logo.png"
                    alt="The Bowery Street Logo"
                    width={60}
                    height={60}
                    className="navbar-logo-image"
                  />
                </button>
              </div>

              {/* Right navigation (close to logo) */}
              <div className="navbar-right">
                <button onClick={() => scrollToSection("gallery")} className="navbar-link">
                  {t.nav.gallery}
                </button>
                <button onClick={() => scrollToSection("contact")} className="navbar-link">
                  {t.nav.contact}
                </button>
              </div>
            </div>

            {/* Actions at the end */}
            <div className="navbar-actions">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="navbar-mobile">
            {/* Logo */}
            <div className="navbar-logo">
              <button onClick={() => scrollToSection("home")}>
                <Image
                  src="/theboweryst-logo.png"
                  alt="The Bowery Street Logo"
                  width={50}
                  height={50}
                  className="navbar-logo-image"
                />
              </button>
            </div>

            {/* Hamburger Button */}
            <button
              className={`hamburger ${isMenuOpen ? "open" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
            <div className="mobile-menu-content">
              <nav className="mobile-menu-nav">
                <button onClick={() => handleNavClick("home")} className="mobile-menu-link">
                  {t.hero.title}
                </button>
                <button onClick={() => handleNavClick("about")} className="mobile-menu-link">
                  {t.nav.about}
                </button>
                <button onClick={() => handleNavClick("artists")} className="mobile-menu-link">
                  {t.nav.artists}
                </button>
                <button onClick={() => handleNavClick("gallery")} className="mobile-menu-link">
                  {t.nav.gallery}
                </button>
                <button onClick={() => handleNavClick("contact")} className="mobile-menu-link">
                  {t.nav.contact}
                </button>
              </nav>

              {/* Mobile Actions */}
              <div className="mobile-menu-actions">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
