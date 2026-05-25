import ScrollProgress from './components/ui/ScrollProgress';
import SplashScreen from './components/ui/SplashScreen';
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

export default function App() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <SplashScreen />
      <ScrollProgress />
      <Hero />
      <PhotoMarquee photos={editorial.marqueeStrip} height="md" />
      <Intro />
      <CinematicMoment
        image={editorial.shofarTall}
        kicker="ביום הכי מסוגל לזיווגים"
        caption="ט״ו באב באומן — תאריך אחד, שינוי של שנה"
        height="standard"
      />
      <PriceBlock />
      <LetterFromRonit />
      <WhyTuBav />
      <CinematicMoment
        image={editorial.umanGate}
        kicker="ציון רבי נחמן · אומן"
        caption="המקום בו תפילות נשמעות אחרת"
        height="tall"
      />
      <WhatAwaits />
      <Divider />
      <WhoFor />
      <Divider />
      <ImportantInfo />
      <Divider />
      <Itinerary />
      <CinematicMoment
        image={editorial.challahTable}
        kicker="הפקה של פעם בשנה"
        caption="כל פרט קטן נעטף באהבה ובאור"
        height="standard"
      />
      <VideoGallery />
      <Testimonials />
      <VideoMoment
        src={editorial.ronitVideo}
        poster={editorial.ronitVideoPoster}
        kicker="ביחד נצעד אל הציון"
        caption="כי המסע הזה לא רק טיסה — הוא חיבור"
        height="tall"
      />
      <Gallery />
      <Payment />
      <LeadForm />
      <ClosingQuote />
      <Footer />
    </main>
  );
}
