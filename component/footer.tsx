import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-surface-variant mt-12">
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-body text-body-md text-on-surface-variant text-sm">
          © GAMELOG. MADE BY ENTHUSIASTS.
        </div>
        <nav className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <Link href="/about" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase">About</Link>
          <Link href="/help" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase">Help</Link>
          <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase">Mobile</Link>
          <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase">Terms</Link>
          <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
