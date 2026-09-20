/* Rendering helpers: thumbnails, cards, reader content. No app state lives here. */
(function (window) {
	"use strict";

	function esc(s) {
		return String(s).replace(/[&<>"]/g, function (c) {
			return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
		});
	}

	function artThumb() {
		return '<span class="readerArtThumb"></span>';
	}

	function renderVersionTabs(container, versions, activeId, onSelect) {
		container.innerHTML = "";
		container.setAttribute("role", "tablist");
		versions.forEach(function (v) {
			var btn = document.createElement("button");
			btn.type = "button";
			btn.className = "tab";
			btn.textContent = v.label;
			btn.setAttribute("role", "tab");
			btn.setAttribute("aria-selected", String(v.id === activeId));
			btn.addEventListener("click", function () {
				onSelect(v.id);
			});
			container.appendChild(btn);
		});
	}

	function renderGrid(container, bhajans, query, onOpen) {
		container.innerHTML = "";
		var q = (query || "").trim().toLowerCase();
		var shown = 0;
		bhajans.forEach(function (b, index) {
			if (q && !(b.title + " " + b.subtitle + " " + b.language).toLowerCase().includes(q)) return;
			shown++;
			var card = document.createElement("button");
			card.type = "button";
			card.className = "card";
			card.dataset.type = b.type;
			card.setAttribute("aria-label", b.title + ", " + b.subtitle);
			card.innerHTML = '<span class="cardMark" aria-hidden="true"><span class="cardNumber">' + String(index + 1).padStart(2, "0") + "</span></span>" + '<span class="cardBody"><span class="cardTitle">' + esc(b.title) + '</span><span class="cardMeta"><span class="langTag">' + esc(b.language) + "</span><span>" + esc(b.subtitle) + "</span></span></span>" + '<span class="cardArrow" aria-hidden="true">›</span>';
			card.addEventListener("click", function () {
				onOpen(b.id);
			});
			container.appendChild(card);
		});
		if (shown === 0) {
			var empty = document.createElement("p");
			empty.className = "emptyState";
			empty.textContent = "No bhajans match your search.";
			container.appendChild(empty);
		}
		return shown;
	}

	function renderReader(refs, bhajan, index, total) {
		refs.title.textContent = bhajan.title;
		refs.meta.innerHTML = '<span class="langTag">' + esc(bhajan.language) + "</span> " + esc(bhajan.subtitle);
		refs.lyrics.textContent = bhajan.lyrics;
		refs.count.textContent = index + 1 + " / " + total;
		refs.art.dataset.type = bhajan.type;
		refs.art.innerHTML = artThumb();
		refs.prevBtn.disabled = index === 0;
		refs.nextBtn.disabled = index === total - 1;
	}

	window.BhajanUI = {
		esc: esc,
		renderVersionTabs: renderVersionTabs,
		renderGrid: renderGrid,
		renderReader: renderReader,
	};
})(window);
