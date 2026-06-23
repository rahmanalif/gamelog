import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import PeopleHeader from "@/component/people/people-header";
import FeaturedMembers from "@/component/people/featured-members";
import PopularThisWeek from "@/component/people/popular-this-week";
import HQMembers from "@/component/people/hq-members";
import YouFollow from "@/component/people/you-follow";
import RecentActivity from "@/component/recent-activity";

export default function PeoplePage() {
  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-[1100px] mx-auto px-gutter py-12 flex flex-col gap-8">
        <PeopleHeader />

        <FeaturedMembers />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-stack-lg">
          <PopularThisWeek />

          <aside className="lg:col-span-1 lg:border-l border-surface-variant lg:pl-8">
            <HQMembers />
            <YouFollow />
          </aside>
        </div>

        <RecentActivity />
      </main>

      <Footer />
    </div>
  );
}
