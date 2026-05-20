import Container from '../layout/Container';
import { footer } from '../../content/copy.he';

export default function Footer() {
  return (
    <footer className="bg-ink-deep text-cream/85">
      <Container>
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-lg font-semibold text-cream">{footer.brand}</p>
          <p className="text-sm opacity-80">{footer.tagline}</p>
          <p className="text-xs opacity-60 pt-2">
            © {new Date().getFullYear()}
          </p>
        </div>
      </Container>
    </footer>
  );
}
