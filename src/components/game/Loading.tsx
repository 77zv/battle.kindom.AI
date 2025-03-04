export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-stone-900 text-amber-100">
      <div className="text-4xl font-bold mb-4">Medieval Tycoon</div>
      <div className="w-64 h-2 bg-stone-700 rounded-full overflow-hidden">
        <div className="h-full bg-amber-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
      <div className="mt-4 text-amber-200 italic">Loading your kingdom...</div>
    </div>
  );
} 