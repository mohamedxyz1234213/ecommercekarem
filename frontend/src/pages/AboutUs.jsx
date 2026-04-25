import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getApiOrigin } from '../utils/apiBase';

const ABOUT_FALLBACKS = {
  aboutTitle: 'Our Story',
  aboutSubtitle: 'A Luxury Egyptian Perfume House',
  aboutStory:
    "Born from the ancient art of Egyptian perfumery, KARÉME blends centuries-old traditions with modern luxury. Our master perfumers source the finest raw materials — rare oud from the heart of Arabia, fresh florals from the Nile Delta, and precious resins carried by camel across desert trade routes — to craft fragrances that tell the story of Egypt's rich heritage.",
  aboutMission:
    "To celebrate the art of Egyptian perfumery by creating exceptional, hand-crafted fragrances that connect people to the timeless beauty and mystique of the ancient East.",
  aboutFoundedYear: '2020',
  aboutImage: '',
  aboutValue1Title: 'Authenticity',
  aboutValue1Desc: 'Every bottle carries the genuine soul of Egyptian perfumery — never synthetic, never artificial.',
  aboutValue2Title: 'Craftsmanship',
  aboutValue2Desc: 'Each fragrance is meticulously blended by hand, aged to perfection, and poured with care in small batches.',
  aboutValue3Title: 'Heritage',
  aboutValue3Desc: "Rooted in 5,000 years of Egyptian civilisation, our scents are a living tribute to the pharaohs' love of fragrance.",
  aboutStat1Value: '5+',
  aboutStat1Label: 'Years of Excellence',
  aboutStat2Value: '200+',
  aboutStat2Label: 'Unique Fragrances',
  aboutStat3Value: '10K+',
  aboutStat3Label: 'Happy Customers',
  aboutStat4Value: '100%',
  aboutStat4Label: 'Natural Ingredients',
};

const normalizeImageUrl = (src) => {
  if (!src) return '';
  if (/^https?:\/\//i.test(src) || src.startsWith('data:image')) return src;
  const apiBase = getApiOrigin();
  return src.startsWith('/') ? `${apiBase}${src}` : `${apiBase}/${src}`;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const AboutUs = () => {
  const [content, setContent] = useState(ABOUT_FALLBACKS);
  const [siteName, setSiteName] = useState('KARÉME');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        const t = (v) => (typeof v === 'string' ? v.trim() : '');
        setSiteName(t(data.siteName) || 'KARÉME');
        setContent({
          aboutTitle: t(data.aboutTitle) || ABOUT_FALLBACKS.aboutTitle,
          aboutSubtitle: t(data.aboutSubtitle) || ABOUT_FALLBACKS.aboutSubtitle,
          aboutStory: t(data.aboutStory) || ABOUT_FALLBACKS.aboutStory,
          aboutMission: t(data.aboutMission) || ABOUT_FALLBACKS.aboutMission,
          aboutFoundedYear: t(data.aboutFoundedYear) || ABOUT_FALLBACKS.aboutFoundedYear,
          aboutImage: normalizeImageUrl(data.aboutImage),
          aboutValue1Title: t(data.aboutValue1Title) || ABOUT_FALLBACKS.aboutValue1Title,
          aboutValue1Desc: t(data.aboutValue1Desc) || ABOUT_FALLBACKS.aboutValue1Desc,
          aboutValue2Title: t(data.aboutValue2Title) || ABOUT_FALLBACKS.aboutValue2Title,
          aboutValue2Desc: t(data.aboutValue2Desc) || ABOUT_FALLBACKS.aboutValue2Desc,
          aboutValue3Title: t(data.aboutValue3Title) || ABOUT_FALLBACKS.aboutValue3Title,
          aboutValue3Desc: t(data.aboutValue3Desc) || ABOUT_FALLBACKS.aboutValue3Desc,
          aboutStat1Value: t(data.aboutStat1Value) || ABOUT_FALLBACKS.aboutStat1Value,
          aboutStat1Label: t(data.aboutStat1Label) || ABOUT_FALLBACKS.aboutStat1Label,
          aboutStat2Value: t(data.aboutStat2Value) || ABOUT_FALLBACKS.aboutStat2Value,
          aboutStat2Label: t(data.aboutStat2Label) || ABOUT_FALLBACKS.aboutStat2Label,
          aboutStat3Value: t(data.aboutStat3Value) || ABOUT_FALLBACKS.aboutStat3Value,
          aboutStat3Label: t(data.aboutStat3Label) || ABOUT_FALLBACKS.aboutStat3Label,
          aboutStat4Value: t(data.aboutStat4Value) || ABOUT_FALLBACKS.aboutStat4Value,
          aboutStat4Label: t(data.aboutStat4Label) || ABOUT_FALLBACKS.aboutStat4Label,
        });
      } catch {
        // Keep fallbacks
      }
    };
    fetchSettings();
  }, []);

  const values = [
    { title: content.aboutValue1Title, desc: content.aboutValue1Desc, icon: '✦' },
    { title: content.aboutValue2Title, desc: content.aboutValue2Desc, icon: '◈' },
    { title: content.aboutValue3Title, desc: content.aboutValue3Desc, icon: '❖' },
  ];

  const stats = [
    { value: content.aboutStat1Value, label: content.aboutStat1Label },
    { value: content.aboutStat2Value, label: content.aboutStat2Label },
    { value: content.aboutStat3Value, label: content.aboutStat3Label },
    { value: content.aboutStat4Value, label: content.aboutStat4Label },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ overflowX: 'hidden' }}
    >
      {/* ── Hero Banner ── */}
      <section
        style={{
          position: 'relative',
          height: '70vh',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: content.aboutImage
            ? `url(${content.aboutImage}) center/cover no-repeat`
            : 'linear-gradient(135deg, #0a1a0e 0%, #142016 40%, #1e3526 70%, #2c4a35 100%)',
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(5,15,8,0.6) 0%, rgba(5,15,8,0.45) 60%, rgba(5,15,8,0.75) 100%)',
          }}
        />
        {/* Decorative gold orbs */}
        {[
          { w: '380px', t: '-80px', l: '-80px', delay: 0 },
          { w: '260px', t: '55%', l: '75%', delay: 1.5 },
          { w: '180px', t: '15%', l: '65%', delay: 3 },
        ].map((c, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: c.w,
              height: c.w,
              borderRadius: '50%',
              border: '1px solid rgba(196, 162, 101, 0.12)',
              top: c.t,
              left: c.l,
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, delay: c.delay }}
          />
        ))}

        <motion.div
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', maxWidth: '700px' }}
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '0.8rem',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: '#c4a265',
              marginBottom: '1.2rem',
              fontWeight: 400,
            }}
          >
            {content.aboutSubtitle}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '0.02em',
            }}
          >
            {content.aboutTitle}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '0.85rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            EST. {content.aboutFoundedYear} · Egypt
          </motion.p>
        </motion.div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', letterSpacing: '3px' }}
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <span>SCROLL</span>
            <div style={{ width: '1px', height: '28px', background: 'rgba(196,162,101,0.4)' }} />
          </motion.div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section style={{ background: '#faf8f5', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          {/* Decorative left panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                width: '100%',
                paddingTop: '130%',
                position: 'relative',
                borderRadius: '4px 60px 4px 60px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #1a2e14 0%, #2d5016 50%, #3d6b1e 100%)',
                boxShadow: '0 30px 80px rgba(20,32,16,0.25)',
              }}
            >
              {/* Gold ornamental lines */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#c4a265' }}>
                <div style={{ width: '1px', height: '60px', background: 'rgba(196,162,101,0.4)' }} />
                <span style={{ fontSize: '2.5rem', letterSpacing: '0.1em', fontFamily: 'var(--font-heading)', color: 'rgba(196,162,101,0.8)' }}>
                  {siteName}
                </span>
                <div style={{ width: '60px', height: '1px', background: 'rgba(196,162,101,0.4)' }} />
                <span style={{ fontSize: '0.65rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(196,162,101,0.5)' }}>
                  EST. {content.aboutFoundedYear}
                </span>
                <div style={{ width: '1px', height: '60px', background: 'rgba(196,162,101,0.4)' }} />
              </div>
            </div>
            {/* Gold accent square */}
            <div
              style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                background: '#c4a265',
                bottom: '-20px',
                right: '-20px',
                borderRadius: '4px',
                zIndex: -1,
              }}
            />
          </motion.div>

          {/* Story text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '0.75rem',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                color: '#c4a265',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Who We Are
            </motion.p>
            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 400,
                color: '#142016',
                lineHeight: 1.2,
                marginBottom: '1.75rem',
              }}
            >
              Perfume as an{' '}
              <span style={{ fontStyle: 'italic', color: '#4a6741' }}>Art Form</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#4a5540',
                marginBottom: '1.5rem',
              }}
            >
              {content.aboutStory}
            </motion.p>
            <motion.blockquote
              variants={fadeUp}
              style={{
                borderLeft: '3px solid #c4a265',
                paddingLeft: '1.25rem',
                margin: '1.5rem 0',
                fontStyle: 'italic',
                color: '#6b7c5c',
                fontSize: '1rem',
                lineHeight: 1.7,
              }}
            >
              {content.aboutMission}
            </motion.blockquote>
            <motion.div variants={fadeUp}>
              <Link
                to="/shop"
                style={{
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  padding: '0.9rem 2.2rem',
                  background: '#014421',
                  color: '#fff',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Explore Collection
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section style={{ background: 'linear-gradient(135deg, #0a1a0e 0%, #142016 100%)', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem' }}>
        <motion.div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 400,
                  color: '#c4a265',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Brand Values ── */}
      <section style={{ background: '#fff', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '4rem' }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '0.75rem',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                color: '#c4a265',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Our Values
            </motion.p>
            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 400,
                color: '#142016',
              }}
            >
              What We Stand For
            </motion.h2>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            {values.map((val, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(20,32,16,0.10)' }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  padding: '2.5rem 2rem',
                  background: '#faf8f5',
                  borderRadius: '16px',
                  border: '1px solid rgba(20,32,16,0.07)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #142016 0%, #2d5016 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '1.4rem',
                    color: '#c4a265',
                  }}
                >
                  {val.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.3rem',
                    fontWeight: 500,
                    color: '#142016',
                    marginBottom: '0.75rem',
                  }}
                >
                  {val.title}
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: '#5a6b52' }}>
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Egyptian Heritage Band ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1a2e14 0%, #2d5016 60%, #4a6741 100%)',
          padding: 'clamp(4rem, 8vw, 6rem) 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative */}
        {[
          { s: '500px', t: '-150px', l: '-150px' },
          { s: '300px', t: '50%', l: '80%' },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: c.s,
              height: c.s,
              borderRadius: '50%',
              border: '1px solid rgba(196,162,101,0.08)',
              top: c.t,
              left: c.l,
              pointerEvents: 'none',
            }}
          />
        ))}

        <motion.div
          style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            style={{ fontSize: '0.7rem', letterSpacing: '6px', textTransform: 'uppercase', color: '#c4a265', marginBottom: '1.2rem' }}
          >
            Egyptian Heritage
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}
          >
            Fragrance Has Been an Egyptian{' '}
            <span style={{ fontStyle: 'italic', color: '#c4a265' }}>Sacred Art</span>
            {' '}for 5,000 Years
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}
          >
            From the kyphi incense burned in ancient temples to the legendary perfumes of Queen Cleopatra,
            Egypt has always been synonymous with the art of scent. We carry that legacy forward — every
            drop is a bridge between civilisations.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              to="/shop"
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                background: '#c4a265',
                color: '#0a1a0e',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Discover the Collection
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default AboutUs;
