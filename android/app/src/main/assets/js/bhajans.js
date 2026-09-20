/* Data layer: loads bhajan collections from /data/*.json and caches them in memory. */
(function (window) {
	"use strict";

	// Data-driven version registry — add an entry + matching JSON file to extend.
	var VERSIONS = [
		{ id: "current", label: "Mini", file: "./data/current.json" },
		{ id: "extended", label: "Extended", file: "./data/extended.json" },
	];

	var cache = Object.create(null);

	function getVersions() {
		return VERSIONS;
	}

	function getVersionMeta(versionId) {
		for (var i = 0; i < VERSIONS.length; i++) {
			if (VERSIONS[i].id === versionId) return VERSIONS[i];
		}
		return VERSIONS[0];
	}

	function load(versionId) {
		var meta = getVersionMeta(versionId);
		if (cache[meta.id]) return Promise.resolve(cache[meta.id]);
		return fetch(meta.file)
			.then(function (res) {
				if (!res.ok) throw new Error("Failed to load " + meta.file);
				return res.json();
			})
			.then(function (data) {
				var bhajans = (data.bhajans || []).slice();
				if (bhajans.length && typeof bhajans[0].order === "number") {
					bhajans.sort(function (a, b) {
						return a.order - b.order;
					});
				}
				cache[meta.id] = bhajans;
				return cache[meta.id];
			});
	}

	window.BhajanData = {
		getVersions: getVersions,
		getVersionMeta: getVersionMeta,
		load: load,
	};
})(window);
