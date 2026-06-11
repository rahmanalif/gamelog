import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import ListHero from "@/component/lists/details/list-hero";
import ListActions from "@/component/lists/details/list-actions";
import ListGrid from "@/component/lists/details/list-grid";

export default async function ListDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listTitle = slug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      {/* Hero Backdrop */}
      <div className="absolute top-0 left-0 w-full h-125 md:h-162.5 overflow-hidden pointer-events-none z-0">
        <img
          alt="Backdrop"
          className="w-full h-full object-cover object-top opacity-50"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)' }}
          src="/elder 2.jpg"
        />
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="w-full max-w-container-max mx-auto px-gutter mt-32 md:mt-75 pb-12 flex flex-col gap-12 relative z-20">
        <ListHero listTitle={listTitle} />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="md:col-span-8 flex flex-col">
            <ListGrid />
          </div>
          <div className="md:col-span-4 mt-0 md:mt-20">
            <ListActions />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
