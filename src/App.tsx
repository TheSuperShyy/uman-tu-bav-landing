import ScrollProgress from './components/ui/ScrollProgress';
import Divider from './components/ui/Divider';
import Marquee from './components/ui/Marquee';
import Hero from './components/sections/Hero';
import Intro from './components/sections/Intro';
import PriceBlock from './components/sections/PriceBlock';
import WhyTuBav from './components/sections/WhyTuBav';
import WhatAwaits from './components/sections/WhatAwaits';
import WhoFor from './components/sections/WhoFor';
import ImportantInfo from './components/sections/ImportantInfo';
import Payment from './components/sections/Payment';
import Itinerary from './components/sections/Itinerary';
import LeadForm from './components/sections/LeadForm';
import ClosingQuote from './components/sections/ClosingQuote';
import Footer from './components/sections/Footer';
import { marquee } from './content/copy.he';

export default function App() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <Hero />
      <Marquee items={marquee} />
      <Intro />
      <Divider />
      <PriceBlock />
      <Divider />
      <WhyTuBav />
      <Divider />
      <WhatAwaits />
      <Divider />
      <WhoFor />
      <Divider />
      <ImportantInfo />
      <Divider />
      <Payment />
      <Divider />
      <Itinerary />
      <Divider />
      <LeadForm />
      <Divider />
      <ClosingQuote />
      <Footer />
    </main>
  );
}
