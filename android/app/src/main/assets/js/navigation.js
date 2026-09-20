/* Hash-based routing helpers. Route shape: #/<version> or #/<version>/<bhajanId> */
(function (window) {
	"use strict";

	function parseHash(hash, defaultVersion) {
		var m = /^#\/([a-z]+)(?:\/([a-z0-9-]+))?$/i.exec(hash || "");
		if (!m) return { version: defaultVersion, id: null };
		return { version: m[1], id: m[2] || null };
	}

	function buildHash(version, id) {
		return id ? "#/" + version + "/" + id : "#/" + version;
	}

	window.BhajanRouter = {
		parseHash: parseHash,
		buildHash: buildHash,
	};
})(window);
