import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getApiOrigin } from '../utils/apiBase';

// Shown when API is slow, fails, or fields are empty.
const HERO_FALLBACKS = {
  heroSubtitle: 'Luxury Fragrances',
  heroTitle: 'Discover Your',
  heroTitleHighlight: 'Signature Scent',
  heroDescription:
    "Curated collection of the world's finest perfumes, each telling a unique story of elegance and sophistication.",
  heroPrimaryButtonText: 'Shop Now',
  heroPrimaryButtonLink: '/shop',
  heroSecondaryButtonText: 'View Collection',
  heroSecondaryButtonLink: '/shop',
};

const HeroSection = () => {
  const [content, setContent] = useState(() => ({
    ...HERO_FALLBACKS,
    heroImage: '',
  }));

  const normalizeAssetUrl = (src) => {
    if (!src) return '';
    if (/^https?:\/\//i.test(src) || src.startsWith('data:image')) return src;
    const apiBase = getApiOrigin();
    return src.startsWith('/') ? `${apiBase}${src}` : `${apiBase}/${src}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        const t = (v) => (typeof v === 'string' ? v.trim() : '');
        const opt = (raw, fb) => (raw === '' ? '' : t(raw) || fb);
        setContent({
          heroSubtitle: t(data.heroSubtitle) || HERO_FALLBACKS.heroSubtitle,
          heroTitle: t(data.heroTitle) || HERO_FALLBACKS.heroTitle,
          heroTitleHighlight: t(data.heroTitleHighlight) || HERO_FALLBACKS.heroTitleHighlight,
          heroDescription: t(data.heroDescription) || HERO_FALLBACKS.heroDescription,
          heroImage: normalizeAssetUrl(data.heroImage),
          heroPrimaryButtonText: opt(data.heroPrimaryButtonText, HERO_FALLBACKS.heroPrimaryButtonText),
          heroPrimaryButtonLink: t(data.heroPrimaryButtonLink) || HERO_FALLBACKS.heroPrimaryButtonLink,
          heroSecondaryButtonText: opt(data.heroSecondaryButtonText, HERO_FALLBACKS.heroSecondaryButtonText),
          heroSecondaryButtonLink: t(data.heroSecondaryButtonLink) || HERO_FALLBACKS.heroSecondaryButtonLink,
        });
      } catch {
        // Keep HERO_FALLBACKS + any poster image already set; text stays visible on mobile when API URL is wrong.
      }
    };
    fetchSettings();
  }, []);

  const hasImage = !!content.heroImage;
  const heroVideoSrc = '/HeroVideo.mp4';

  // Ping-pong reverse playback
  const videoRef = useRef(null);
  const reversingRef = useRef(false);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  const reverseStep = useCallback((timestamp) => {
    const video = videoRef.current;
    if (!video) return;

    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
    }
    const delta = (timestamp - lastTimeRef.current) / 1000; // seconds elapsed
    lastTimeRef.current = timestamp;

    const next = video.currentTime - delta;
    if (next <= 0) {
      video.currentTime = 0;
      reversingRef.current = false;
      lastTimeRef.current = null;
      video.play();
      return;
    }
    video.currentTime = next;
    rafRef.current = requestAnimationFrame(reverseStep);
  }, []);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    reversingRef.current = true;
    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(reverseStep);
  }, [reverseStep]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const styles = {
    hero: {
      position: 'relative',
      height: '100vh',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      isolation: 'isolate',
      background: hasImage
        ? `url(${content.heroImage}) center/cover no-repeat`
        : 'linear-gradient(135deg, #4a6354 0%, #5d7864 45%, #7d9280 100%)',
    },
    video: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
      // Keep video in its own compositor layer below UI (fixes iOS/Safari painting video on top of text)
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(rgba(90, 109, 102, 0.35), rgba(1, 50, 32, 0.45)), ' +
        'radial-gradient(ellipse at 30% 50%, rgba(131, 130, 116, 0.1) 0%, transparent 50%), ' +
        'radial-gradient(ellipse at 70% 30%, rgba(149, 170, 160, 0.25) 0%, transparent 50%)',
      zIndex: 2,
      pointerEvents: 'none',
    },
    content: {
      position: 'relative',
      zIndex: 3,
      textAlign: 'center',
      maxWidth: '800px',
      padding: '0 2rem',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
    },
    subtitle: {
      fontFamily: 'var(--font-body)',
      fontSize: '0.9rem',
      fontWeight: 300,
      letterSpacing: '6px',
      textTransform: 'uppercase',
      color: 'rgba(242, 235, 227, 0.94)',
      marginBottom: '1.5rem',
    },
    heading: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
      fontWeight: 400,
      color: '#fff',
      lineHeight: 1.1,
      marginBottom: '1.5rem',
    },
    headingItalic: {
      fontStyle: 'italic',
      color: '#f2ebe3',
    },
    desc: {
      fontSize: '1.1rem',
      fontWeight: 300,
      color: 'rgba(255, 255, 255, 0.9)',
      maxWidth: '520px',
      margin: '0 auto 2.5rem',
      lineHeight: 1.7,
    },
    btnRow: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    btnPrimary: {
      padding: '1rem 2.5rem',
      backgroundColor: 'var(--gold)',
      color: 'var(--primary)',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.9rem',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-block',
      textDecoration: 'none',
    },
    btnSecondary: {
      padding: '1rem 2.5rem',
      backgroundColor: 'transparent',
      color: '#f2ebe3',
      borderRadius: 'var(--radius-xl)',
      fontSize: '0.9rem',
      fontWeight: 400,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      border: '1px solid rgba(242, 235, 227, 0.65)',
      cursor: 'pointer',
      display: 'inline-block',
      textDecoration: 'none',
    },
    floatingCircle: (size, top, left) => ({
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      border: '1px solid rgba(196, 162, 101, 0.1)',
      top,
      left,
      zIndex: 1,
      pointerEvents: 'none',
    }),
    scrollHintWrapper: {
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 3,
    },
    scrollHint: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'rgba(255, 255, 255, 0.78)',
      fontSize: '0.75rem',
      letterSpacing: '2px',
    },
  };

  return (
    <section className="hero-section" style={styles.hero}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={handleEnded}
        style={styles.video}
        poster={content.heroImage || undefined}
      >
        <source src={heroVideoSrc} type="video/mp4" />
      </video>
      <div style={styles.overlay} />

      {/* Decorative circles */}
      {[
        { size: '400px', top: '-100px', left: '-100px', delay: 0 },
        { size: '300px', top: '60%', left: '80%', delay: 1 },
        { size: '200px', top: '20%', left: '70%', delay: 2 },
      ].map((c, i) => (
        <motion.div
          key={i}
          style={styles.floatingCircle(c.size, c.top, c.left)}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: c.delay }}
        />
      ))}

      <div style={styles.content}>
        <motion.p
          style={styles.subtitle}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {content.heroSubtitle}
        </motion.p>

        <motion.h1
          style={styles.heading}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {content.heroTitle} <br />
          <span style={styles.headingItalic}>{content.heroTitleHighlight}</span>
        </motion.h1>

        <motion.p
          style={styles.desc}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {content.heroDescription}
        </motion.p>

        <motion.div
          style={styles.btnRow}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={content.heroPrimaryButtonLink} style={styles.btnPrimary}>
            {content.heroPrimaryButtonText}
          </Link>
          {content.heroSecondaryButtonText ? (
            <Link to={content.heroSecondaryButtonLink} style={styles.btnSecondary}>
              {content.heroSecondaryButtonText}
            </Link>
          ) : null}
        </motion.div>
      </div>

      <div style={styles.scrollHintWrapper}>
        <motion.div
          style={styles.scrollHint}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>SCROLL</span>
          <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
