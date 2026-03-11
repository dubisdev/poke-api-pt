export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white py-6 px-4 shadow-md">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
          <div className="mt-1 h-4 w-40 rounded bg-red-400 animate-pulse" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 h-10 w-full max-w-sm rounded-lg bg-gray-200 animate-pulse" />

        <div className="mt-4 h-4 w-28 rounded bg-gray-200 animate-pulse" />

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm animate-pulse"
            >
              <div className="h-20 w-20 rounded-full bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="flex gap-1">
                <div className="h-5 w-12 rounded-full bg-gray-200" />
                <div className="h-5 w-12 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
