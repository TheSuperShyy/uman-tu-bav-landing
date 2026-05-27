import { useState, type FormEvent, type InputHTMLAttributes } from 'react';
// Mapping of the Hebrew radio values used in the form UI to the
// English enum values the backend's Zod schema expects.
const PHONE_TYPE_MAP: Record<string, 'kosher' | 'regular'> = {
  כשר: 'kosher',
  רגיל: 'regular',
};
const PASSPORT_MAP: Record<string, 'yes' | 'no'> = {
  כן: 'yes',
  לא: 'no',
};
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

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

function RequiredMark() {
  return <span className="text-rose-300 ms-1" aria-hidden>*</span>;
}

function Field({ id, label, ...rest }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {rest.required && <RequiredMark />}
      </label>
      <input id={id} name={id} className={fieldClass} {...rest} />
    </div>
  );
}

type RadioGroupProps = {
  name: string;
  label: string;
  options: readonly string[];
  required?: boolean;
};

function RadioGroup({ name, label, options, required }: RadioGroupProps) {
  return (
    <fieldset>
      <legend className={labelClass}>
        {label}
        {required && <RequiredMark />}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="cursor-pointer rounded-full bg-cream/15 px-4 py-2 text-cream text-sm sm:text-base ring-1 ring-cream/30 hover:bg-cream/25 transition-colors has-[:checked]:bg-cream has-[:checked]:text-ink-deep has-[:checked]:ring-cream"
          >
            <input type="radio" name={name} value={opt} required={required} className="sr-only" />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const TOAST_TONE: Record<Exclude<Status, 'idle'>, string> = {
  submitting: 'bg-ink-deep text-cream',
  success: 'bg-emerald-700/95 text-cream',
  error: 'bg-rose-800/95 text-cream',
};

export default function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const reduced = useReducedMotion();
  const f = leadForm.fields;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const urlParams = new URLSearchParams(window.location.search);

    // Remap to the snake_case keys the backend expects, translate the
    // Hebrew radio values to the English enums, and tack on URL-derived
    // attribution fields so the backend can dedup IG-sourced leads.
    const ageRaw = formData.get('age');
    const phoneKindHe = String(formData.get('phoneKind') ?? '');
    const passportHe = String(formData.get('passport') ?? '');

    const payload = {
      name: String(formData.get('fullName') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      age: ageRaw ? Number(ageRaw) : undefined,
      birth_date: (formData.get('birthDate') as string) || undefined,
      city: (formData.get('city') as string) || undefined,
      occupation: (formData.get('occupation') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      // Backend Zod schema still requires phone_type + passport. UI marks
      // them optional, so we fall back to the most-common defaults when the
      // user skips them; Ronit can correct on her end if needed.
      phone_type: phoneKindHe ? (PHONE_TYPE_MAP[phoneKindHe] ?? phoneKindHe) : 'regular',
      passport: passportHe ? (PASSPORT_MAP[passportHe] ?? passportHe) : 'no',
      service: 'uman' as const,
      ig_id: urlParams.get('ig_id'),
      utm_source: urlParams.get('utm_source') || 'direct',
    };

    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`submit failed (${res.status})`);
      }
      setStatus('success');
      formEl.reset();
    } catch (err) {
      console.error('LeadForm submit failed', err);
      setStatus('error');
    }

    // Auto-dismiss success/error after a few seconds so the form returns
    // to an interactive state. (Submitting clears via the next setState.)
    setTimeout(() => {
      setStatus((prev) => (prev === 'submitting' ? prev : 'idle'));
    }, 5000);
  }

  const isSubmitting = status === 'submitting';
  const toastVisible = status === 'submitting' || status === 'success' || status === 'error';
  const toastMessage =
    status === 'submitting'
      ? leadForm.submitting
      : status === 'success'
        ? leadForm.success
        : status === 'error'
          ? leadForm.error
          : '';

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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field id="fullName" label={f.fullName} autoComplete="name" required />
              <Field id="phone" label={f.phone} type="tel" inputMode="tel" autoComplete="tel" required />
              <Field id="age" label={f.age} type="number" inputMode="numeric" min={16} max={120} />
              <Field id="birthDate" label={f.birthDate} type="date" />
              <Field id="city" label={f.city} autoComplete="address-level2" />
              <Field id="occupation" label={f.occupation} />
            </div>

            <RadioGroup name="phoneKind" label={f.phoneKind.label} options={f.phoneKind.options} />
            <RadioGroup name="passport" label={f.passport.label} options={f.passport.options} />

            <Field id="email" label={f.email} type="email" autoComplete="email" />

            <div className="pt-3 text-center">
              <Button
                pulse
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto disabled:opacity-70 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    {leadForm.submitting}
                  </span>
                ) : (
                  leadForm.cta
                )}
              </Button>
            </div>
          </form>
        </Reveal>

        <AnimatePresence>
          {toastVisible && (
            <motion.div
              key={status}
              role="status"
              aria-live="polite"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed inset-x-4 bottom-6 mx-auto max-w-md rounded-xl px-5 py-4 shadow-cta z-50 text-center ${
                TOAST_TONE[status as Exclude<Status, 'idle'>]
              }`}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
