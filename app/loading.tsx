export default function Loading() {
  return (
    <div className="min-h-screen bg-canvas p-6">
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-16 rounded-xl bg-panel" />
        <div className="h-10 w-48 rounded-lg bg-panel" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-96 rounded-xl bg-panel lg:col-span-2" />
          <div className="h-96 rounded-xl bg-panel" />
        </div>
      </div>
    </div>
  );
}
