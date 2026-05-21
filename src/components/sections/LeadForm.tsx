import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import Button from '../ui/Button';
import { leadForm } from '../../content/copy.he';

const fieldClass =
  'w-full rounded-xl border border-cream/40 bg-cream/95 px-4 py-3 text-ink-body text-base ' +
  'placeholder:text-ink-deep/40 focus:outline-none focus:ring-4 focus:ring-cream/40 ' +
  'transition-shadow';

const labelClass = 'block text-cream font-semibold mb-1.5 text-base';

type RadioGroupProps = {
  name: string;
  label: string;
  options: readonly string[];
};

function RadioGroup({ name, label, options }: RadioGroupProps) {
  return (
    <fieldset>
      <legend className={labelClass}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="cursor-pointer rounded-full bg-cream/15 px-4 py-2 text-cream text-sm sm:text-base ring-1 ring-cream/30 hover:bg-cream/25 transition-colors has-[:checked]:bg-cream has-[:checked]:text-ink-deep has-[:checked]:ring-cream"
          >
            <input type="radio" name={name} value={opt} className="sr-only" />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function LeadForm() {
  const [showToast, setShowToast] = useState(false);
  const reduced = useReducedMotion();
  const f = leadForm.fields;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to a real submission target — see planning.md → Open TODOs
    console.warn('LeadForm not wired yet — see planning.md TODO');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
  }

  return (
    <Section bg="bg-accent" id="lead-form">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-10">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cream text-balance">
              {leadForm.title}
            </h2>
          </Reveal>
        </div>

        <Reveal>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="fullName" className={labelClass}>{f.fullName}</label>
              <input id="fullName" name="fullName" className={fieldClass} autoComplete="name" />
            </div>

            <div>
              <label htmlFor="age" className={labelClass}>{f.age}</label>
              <input id="age" name="age" type="number" inputMode="numeric" className={fieldClass} />
            </div>

            <RadioGroup name="company" label={f.company.label} options={f.company.options} />
            <RadioGroup name="passport" label={f.passport.label} options={f.passport.options} />
            <RadioGroup name="attraction" label={f.attraction.label} options={f.attraction.options} />

            <div className="pt-3 text-center">
              <Button pulse type="submit" className="w-full sm:w-auto">
                {leadForm.cta}
              </Button>
            </div>
          </form>
        </Reveal>

        <AnimatePresence>
          {showToast && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 bottom-6 mx-auto max-w-md rounded-xl bg-ink-deep text-cream px-5 py-4 shadow-cta z-50 text-center"
            >
              {leadForm.pendingNotice}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
