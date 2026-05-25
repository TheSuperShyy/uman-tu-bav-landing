import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SplashScreen from './components/ui/SplashScreen';
import PageNav from './components/ui/PageNav';
import { PageNavContext } from './components/ui/PageNavContext';
import Divider from './components/ui/Divider';
import PhotoMarquee from './components/ui/PhotoMarquee';
import Hero from './components/sections/Hero';
import Intro from './components/sections/Intro';
import PriceBlock from './components/sections/PriceBlock';
import LetterFromRonit from './components/sections/LetterFromRonit';
import WhyTuBav from './components/sections/WhyTuBav';
import WhatAwaits from './components/sections/WhatAwaits';
import WhoFor from './components/sections/WhoFor';
import ImportantInfo from './components/sections/ImportantInfo';
import Payment from './components/sections/Payment';
import Itinerary from './components/sections/Itinerary';
import Gallery from './components/sections/Gallery';
import CinematicMoment from './components/sections/CinematicMoment';
import VideoMoment from './components/sections/VideoMoment';
import VideoGallery from './components/sections/VideoGallery';
import Testimonials from './components/sections/Testimonials';
import LeadForm from './components/sections/LeadForm';
import ClosingQuote from './components/sections/ClosingQuote';
import Footer from './components/sections/Footer';
import { editorial } from './content/media';

// Ebook flow — each page is a chapter the visitor walks through with
// Next / Back. Slugs are stable so /#/intro etc. can be deep-linked.
const PAGES = [
  {
    slug: 'welcome',
    render: () => (
      <>
        <Hero />
        <PhotoMarquee photos={editorial.marqueeStrip} height="md" />
      </>
    ),
  },
  {
    slug: 'intro',
    render: () => (
      <>
        <Intro />
        <CinematicMoment
          image={editorial.shofarTall}
          kicker="ביום הכי מסוגל לזיווגים"
          caption="ט״ו באב באומן — תאריך אחד, שינוי של שנה"
          height="standard"
        />
      </>
    ),
  },
  {
    slug: 'why',
    render: () => (
      <>
        <WhyTuBav />
        <CinematicMoment
          image={editorial.umanGate}
          kicker="ציון רבי נחמן · אומן"
          caption="המקום בו תפילות נשמעות אחרת"
          height="tall"
        />
      </>
    ),
  },
  {
    slug: 'price',
    render: () => (
      <>
        <PriceBlock />
        <LetterFromRonit />
      </>
    ),
  },
  {
    slug: 'what',
    render: () => (
      <>
        <WhatAwaits />
        <Divider />
        <WhoFor />
      </>
    ),
  },
  {
    slug: 'details',
    render: () => (
      <>
        <ImportantInfo />
        <Divider />
        <Itinerary />
        <CinematicMoment
          image={editorial.challahTable}
          kicker="הפקה של פעם בשנה"
          caption="כל פרט קטן נעטף באהבה ובאור"
          height="standard"
        />
      </>
    ),
  },
  {
    slug: 'videos',
    render: () => (
      <>
        <VideoGallery />
        <Testimonials />
        <VideoMoment
          src={editorial.ronitVideo}
          poster={editorial.ronitVideoPoster}
          kicker="ביחד נצעד אל הציון"
          caption="כי המסע הזה לא רק טיסה — הוא חיבור"
          height="tall"
        />
      </>
    ),
  },
  {
    slug: 'gallery',
    render: () => <Gallery />,
  },
  {
    slug: 'signup',
    render: () => (
      <>
        <Payment />
        <LeadForm />
      </>
    ),
  },
  {
    slug: 'end',
    render: () => (
      <>
        <ClosingQuote />
        <Footer />
      </>
    ),
  },
];

function getPageFromHash(): number {
  if (typeof window === 'undefined') return 0;
  const slug = window.location.hash.replace(/^#\/?/, '');
  const i = PAGES.findIndex((p) => p.slug === slug);
  return i >= 0 ? i : 0;
}

export default function App() {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState<number>(getPageFromHash);
  const [dir, setDir] = useState<1 | -1>(1);

  // Sync with browser back/forward + manual hash edits.
  useEffect(() => {
    function onHash() {
      const next = getPageFromHash();
      setDir((prev) => (next > idx ? 1 : next < idx ? -1 : prev));
      setIdx(next);
      window.scrollTo({ top: 0, left: 0 });
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [idx]);

  function goTo(i: number) {
    if (i < 0 || i >= PAGES.length || i === idx) return;
    setDir(i > idx ? 1 : -1);
    // Updating the hash fires `hashchange` which sets idx — but we set
    // it here too so the transition starts on the same frame.
    setIdx(i);
    window.location.hash = `/${PAGES[i].slug}`;
    window.scrollTo({ top: 0, left: 0 });
  }

  const ctx = {
    goNext: () => goTo(idx + 1),
    goBack: () => goTo(idx - 1),
    goTo,
    current: idx,
    total: PAGES.length,
  };

  // RTL ebook turn: "next" advances rightward in reading order, so the
  // outgoing page exits to the right and the incoming one enters from
  // the left. Using variants + `custom` so the EXITING page reads the
  // *current* direction (otherwise framer-motion uses its last-rendered
  // exit prop and Back animates the same way as Next).
  const variants = reduced
    ? {
        enter: { opacity: 1, x: 0 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 0 },
      }
    : {
        enter: (d: number) => ({ opacity: 0, x: d === 1 ? -120 : 120 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d === 1 ? 120 : -120 }),
      };

  return (
    <main className="min-h-screen overflow-x-clip">
      <SplashScreen />
      <PageNavContext.Provider value={ctx}>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={PAGES[idx].slug}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {PAGES[idx].render()}
          </motion.div>
        </AnimatePresence>
        <PageNav />
      </PageNavContext.Provider>
    </main>
  );
}
