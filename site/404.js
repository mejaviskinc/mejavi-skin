(function () {
  "use strict";

  const routes = {
    "": "index.html",
    about: "about.html",
    products: "products.html",
    ingredients: "ingredients.html",
    video: "video.html",
    reviews: "reviews.html",
    collaboration: "collaboration.html",
    faq: "faq.html",
    track: "track.html",
    halal: "halal.html",
    admin: "admin.html"
  };

  const marker = "/mejavi-skin/";
  const path = window.location.pathname;
  const usesProjectPath = path.includes(marker);
  const base = usesProjectPath ? marker : "/";
  const rawKey = usesProjectPath
    ? path.slice(path.indexOf(marker) + marker.length)
    : path.replace(/^\//, "");
  const key = rawKey.replace(/\/$/, "");
  const target = routes[key];

  if (target) {
    window.location.replace(`${base}${target}${window.location.search}${window.location.hash}`);
    return;
  }

  document.getElementById("message").textContent = "Halaman tidak ditemukan.";
})();
