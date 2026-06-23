import Link from "next/link";

type HeroImageData = {
  gameId: string;
  imageUrl: string;
  gameTitle: string;
} | null;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function fetchHeroImage(): Promise<HeroImageData> {
  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/hero-image`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const payload = data?.data ?? data;
    if (!payload?.imageUrl) return null;
    return payload as HeroImageData;
  } catch {
    return null;
  }
}

export default async function Hero() {
  const heroImage = await fetchHeroImage();
  const backgroundUrl = heroImage?.imageUrl ?? "/elder1.jpg";

  return (
    <section className="relative w-full h-screen min-h-[400px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pt-10 z-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      >
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0 "></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl px-gutter mt-16">
        <h1 className="font-display text-display-lg md:text-[56px] text-white mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight tracking-tight">
          Track games you've played.<br/>
          Save those you want to play.<br/>
          Tell your friends what's good.
        </h1>
        <Link
          href="#"
          className="inline-block bg-[#00e676] text-[#00210b] font-label-md text-label-md uppercase tracking-widest px-10 py-4 rounded-lg hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95"
        >
          GET STARTED — IT'S FREE
        </Link>
        <p className="mt-6 text-on-surface-variant font-body text-base drop-shadow-md">The social network for game lovers.</p>
      </div>
    </section>
  );
}
