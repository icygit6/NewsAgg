/** Initial-hydration fallback for the router. Every route is `lazy`, so on the
 * very first load React Router must resolve a route module before it can paint.
 * Without a `HydrateFallback` it warns ("No `HydrateFallback` element provided…")
 * and renders a blank screen during that window; this brand spinner fills it. */
export function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
    </div>
  );
}
