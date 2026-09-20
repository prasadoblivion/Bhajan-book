/* App bootstrap: wires DOM, routing, and data/UI modules together. */
(function () {
	"use strict";

	var STORAGE_KEY = "bhajanbook.version";

	var els = {
		listView: document.getElementById("listView"),
		readerView: document.getElementById("readerView"),
		versionTabs: document.getElementById("versionTabs"),
		collectionName: document.getElementById("collectionName"),
		collectionCount: document.getElementById("collectionCount"),
		grid: document.getElementById("grid"),
		search: document.getElementById("search"),
		homeBtn: document.getElementById("homeBtn"),
		backBtn: document.getElementById("backBtn"),
		listBtn: document.getElementById("listBtn"),
		prevBtn: document.getElementById("prevBtn"),
		nextBtn: document.getElementById("nextBtn"),
		title: document.getElementById("rtitle"),
		meta: document.getElementById("rmeta"),
		lyrics: document.getElementById("lyrics"),
		count: document.getElementById("count"),
		art: document.getElementById("readerArt"),
	};

	var state = {
		version: localStorage.getItem(STORAGE_KEY) || "current",
		bhajans: [],
		index: 0,
	};

	function showList() {
		els.readerView.classList.remove("active");
		els.listView.classList.add("active");
		window.scrollTo(0, 0);
	}

	function showReader() {
		els.listView.classList.remove("active");
		els.readerView.classList.add("active");
		window.scrollTo(0, 0);
	}

	function renderTabs() {
		BhajanUI.renderVersionTabs(els.versionTabs, BhajanData.getVersions(), state.version, function (versionId) {
			location.hash = BhajanRouter.buildHash(versionId);
		});
	}

	function renderList() {
		var shown = BhajanUI.renderGrid(els.grid, state.bhajans, els.search.value, function (id) {
			location.hash = BhajanRouter.buildHash(state.version, id);
		});
		els.collectionName.textContent = BhajanData.getVersionMeta(state.version).label;
		els.collectionCount.textContent = shown + (shown === 1 ? " prayer" : " prayers");
	}

	function openReaderAt(index) {
		state.index = index;
		BhajanUI.renderReader(els, state.bhajans[index], index, state.bhajans.length);
		showReader();
	}

	function goDelta(delta) {
		var i = state.index + delta;
		if (i >= 0 && i < state.bhajans.length) {
			location.hash = BhajanRouter.buildHash(state.version, state.bhajans[i].id);
		}
	}

	function loadAndRoute() {
		var route = BhajanRouter.parseHash(location.hash, state.version);
		var versionChanged = route.version !== state.version;
		state.version = route.version;
		localStorage.setItem(STORAGE_KEY, state.version);

		BhajanData.load(state.version)
			.then(function (bhajans) {
				state.bhajans = bhajans;
				renderTabs();

				if (route.id) {
					var idx = bhajans.findIndex(function (b) {
						return b.id === route.id;
					});
					if (idx === -1) {
						location.hash = BhajanRouter.buildHash(state.version);
						return;
					}
					openReaderAt(idx);
				} else {
					if (versionChanged) els.search.value = "";
					renderList();
					showList();
				}
			})
			.catch(function (err) {
				els.grid.innerHTML = '<p class="emptyState">Unable to load bhajans. Please check your connection and try again.</p>';
				console.error(err);
			});
	}

	els.homeBtn.addEventListener("click", function () {
		location.hash = BhajanRouter.buildHash(state.version);
	});
	els.backBtn.addEventListener("click", function () {
		location.hash = BhajanRouter.buildHash(state.version);
	});
	els.listBtn.addEventListener("click", function () {
		location.hash = BhajanRouter.buildHash(state.version);
	});
	els.prevBtn.addEventListener("click", function () {
		goDelta(-1);
	});
	els.nextBtn.addEventListener("click", function () {
		goDelta(1);
	});
	els.search.addEventListener("input", renderList);

	window.addEventListener("hashchange", loadAndRoute);

	var swipeStartX = 0;
	els.lyrics.addEventListener(
		"touchstart",
		function (e) {
			swipeStartX = e.changedTouches[0].screenX;
		},
		{ passive: true },
	);
	els.lyrics.addEventListener(
		"touchend",
		function (e) {
			var dx = e.changedTouches[0].screenX - swipeStartX;
			if (Math.abs(dx) > 70) goDelta(dx < 0 ? 1 : -1);
		},
		{ passive: true },
	);
	document.addEventListener("keydown", function (e) {
		if (!els.readerView.classList.contains("active")) return;
		if (e.key === "ArrowRight") goDelta(1);
		if (e.key === "ArrowLeft") goDelta(-1);
		if (e.key === "Escape") location.hash = BhajanRouter.buildHash(state.version);
	});

	if ("serviceWorker" in navigator) {
		window.addEventListener("load", function () {
			navigator.serviceWorker.register("./sw.js");
		});
	}

	loadAndRoute();
})();
