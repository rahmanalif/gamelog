import Link from "next/link";

const HQ_AVATARS = [
  "/users/pewdiepie.jpg",
  "/users/pewdiepie.jpg",
  "/users/pewdiepie.jpg",
  "/users/pewdiepie.jpg",
  "/users/pewdiepie.jpg",
  "/users/pewdiepie.jpg",
  "/users/pewdiepie.jpg"
];

export default function HQMembers() {
  return (
    <div className="mb-8">
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-4 pb-2 flex justify-between items-center font-bold">
        <span>HQ Members</span>
        <Link className="text-primary hover:underline text-xs" href="#">ALL</Link>
      </h2>
      <div className="flex flex-wrap gap-3">
        {HQ_AVATARS.map((avatar, i) => (
          <img 
            key={i} 
            alt="HQ Avatar" 
            className="w-10 h-10 rounded-full border border-outline-variant/50 hover:border-primary cursor-pointer transition-colors object-cover shadow-sm" 
            src={avatar} 
          />
        ))}
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/50 hover:border-primary cursor-pointer transition-colors flex items-center justify-center text-xs font-bold text-on-surface-variant shadow-sm">
          AFI
        </div>
      </div>
    </div>
  );
}
