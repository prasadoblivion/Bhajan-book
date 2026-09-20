const CACHE_NAME = "bhajan-book-v10";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon.svg", "./css/app.css", "./assets/fonts/manrope-latin.woff2", "./assets/fonts/anek-devanagari.woff2", "./assets/fonts/tiro-marathi-latin.woff2", "./assets/fonts/tiro-marathi-devanagari.woff2", "./assets/images/hero.jpeg", "./assets/images/lyrics_side_bg.jpeg", "./assets/images/ganesha.png", "./assets/images/shiva.png", "./assets/images/hanuman.png", "./assets/images/om.png", "./assets/images/durga.jpeg", "./assets/images/panduranga.jpeg", "./assets/images/datta.jpeg", "./js/bhajans.js", "./js/ui.js", "./js/navigation.js", "./js/app.js", "./data/current.json", "./data/extended.json"];
self.addEventListener("install", (e) =>
	e.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((c) => c.addAll(APP_SHELL))
			.then(() => self.skipWaiting()),
	),
);
self.addEventListener("activate", (e) =>
	e.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
			.then(() => self.clients.claim()),
	),
);
self.addEventListener("fetch", (e) => {
	if (e.request.method !== "GET") return;
	e.respondWith(
		caches.match(e.request).then(
			(cached) =>
				cached ||
				fetch(e.request)
					.then((r) => {
						if (r.ok && new URL(e.request.url).origin === self.location.origin) {
							const copy = r.clone();
							caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
						}
						return r;
					})
					.catch(() => caches.match("./index.html")),
		),
	);
});
