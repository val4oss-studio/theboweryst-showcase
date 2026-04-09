"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useI18n } from "@/app/i18n/provider";
import { ArrowDown, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import type { ShopEntity } from "@/domain/entities/shopEntity";

interface HeroSectionProps {
  id: string;
  shop: ShopEntity;
}

export function HeroSection({id, shop}: HeroSectionProps) {
  const { t, locale } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);

  const wrapperRef       = useRef<HTMLDivElement>(null);
  const firstLetterRef   = useRef<HTMLSpanElement>(null);
  const lastLetterRef    = useRef<HTMLSpanElement>(null);
  // Anchor spans: zero-size, positioned by JS at the center of each letter.
  // The flower <img> is offset from the anchor purely via CSS transform.
  const redAnchorRef     = useRef<HTMLSpanElement>(null);
  const yellowAnchorRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const positionFlowers = () => {
      const wrapper      = wrapperRef.current;
      const firstLetter  = firstLetterRef.current;
      const lastLetter   = lastLetterRef.current;
      const redAnchor    = redAnchorRef.current;
      const yellowAnchor = yellowAnchorRef.current;
      if (!wrapper || !firstLetter || !lastLetter || !redAnchor || !yellowAnchor) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const firstRect   = firstLetter.getBoundingClientRect();
      const lastRect    = lastLetter.getBoundingClientRect();

      // Place each anchor at the center of its letter (relative to the wrapper).
      // The flower image is then centered on that point via CSS transform.
      redAnchor.style.left    = `${firstRect.left - wrapperRect.left + firstRect.width  / 2}px`;
      redAnchor.style.top     = `${firstRect.top  - wrapperRect.top  + firstRect.height / 2}px`;
      yellowAnchor.style.left = `${lastRect.right  - wrapperRect.left + lastRect.width   / 2}px`;
      yellowAnchor.style.top  = `${lastRect.top   - wrapperRect.top  + lastRect.height  / 2}px`;
    };

    positionFlowers();
    document.fonts.ready.then(positionFlowers);
    window.addEventListener('resize', positionFlowers);
    return () => window.removeEventListener('resize', positionFlowers);
  }, []);

  const bIndex = shop.name.indexOf("B");

  const renderTitle = () => {
    if (bIndex === -1) {
      return (
        <>
          <span ref={firstLetterRef}>{shop.name[0]}</span>
          {shop.name.slice(1, -1)}
          <span ref={lastLetterRef}>{shop.name[shop.name.length - 1]}</span>
        </>
      );
    }
    const beforeB = shop.name.slice(0, bIndex); // e.g. "The "
    const afterB  = shop.name.slice(bIndex + 1); // e.g. "oweryst"
    return (
      <>
        <span ref={firstLetterRef}>{beforeB[0]}</span>
        {beforeB.slice(1)}
        <Image
          src="/theboweryst-B.png"
          alt="B"
          width={1024}
          height={1024}
          className="hero-title-b-logo"
          priority
        />
        {afterB.slice(0, -1)}
        <span ref={lastLetterRef}>{afterB[afterB.length - 1]}</span>
      </>
    );
  };

  return (
    <section id={id} className="section">
      <div className="section-header text-center">
        <div className="section-title-wrapper" ref={wrapperRef}>
          {/*
            Anchors: zero-size spans absolutely positioned by JS at each letter's center.
            JS only touches left/top on these spans — nothing on the <img> itself.
            Adjust flower appearance (size, offset, rotation…) freely in CSS.
          */}
          <span ref={redAnchorRef} className="hero-flower-anchor">
            <Image
              src="/theboweryst-red-flower.png"
              alt=""
              width={600}
              height={600}
              className="hero-flower hero-flower-red"
              aria-hidden="true"
            />
          </span>
          <span ref={yellowAnchorRef} className="hero-flower-anchor">
            <Image
              src="/theboweryst-yellow-flower.png"
              alt=""
              width={600}
              height={600}
              className="hero-flower hero-flower-yellow"
              aria-hidden="true"
            />
          </span>

          <h1 className="page-title" aria-label={shop.name}>
            {renderTitle()}
          </h1>
        </div>
        <p className="page-subtitle mt-4">{shop.description[locale]}</p>

        {/* Social Buttons */}
        <div className="hero-buttons">
          <a
            href={shop.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn hero-btn-instagram"
          >
            <FaInstagram className="hero-btn-icon" />
            <span>{t.hero.instagram}</span>
          </a>

          <a
            href={shop.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn hero-btn-facebook"
          >
            <FaFacebook className="hero-btn-icon" />
            <span>{t.hero.facebook}</span>
          </a>

          <a
            href={shop.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn hero-btn-location"
          >
            <MapPin className="hero-btn-icon" />
            <span>{t.hero.location}</span>
          </a>
        </div>
      </div>

      <div className={`hero-arrow-indicator ${isScrolled ? 'scrolled' : ''}`}>
        <span className="text-sm text-muted-foreground mb-2">{"Scroll"}</span>
        <ArrowDown className="h-5 text-primary" />
      </div>
    </section>
  );
}
