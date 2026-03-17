import GameBoard from '../components/GameBoard';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black tracking-tighter uppercase text-red-600 mb-2">The Great Escape</h1>
        <p className="text-stone-400 font-mono">Match the tools to dig your way out.</p>
      </div>
      <GameBoard />
    </main>
  );
}
