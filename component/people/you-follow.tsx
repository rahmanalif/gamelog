export default function YouFollow() {
  return (
    <div>
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-4 pb-2 flex justify-between items-center font-bold">
        <span>You Follow</span>
        <span className="text-on-surface text-xs font-bold">1</span>
      </h2>
      <div className="flex flex-wrap gap-3">
        <img 
          alt="Avatar" 
          className="w-10 h-10 rounded-full border border-outline-variant/50 hover:border-primary cursor-pointer transition-colors object-cover shadow-sm" 
          src="/users/pewdiepie.jpg" 
        />
      </div>
    </div>
  );
}
