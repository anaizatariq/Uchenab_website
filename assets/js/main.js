/* University of Chenab — Homepage interactions */
(function () {
  "use strict";

  // Footer year
  var y = document.getElementById("ucYear");
  if (y) y.textContent = new Date().getFullYear();

  // Search drawer
  var searchDrawer = document.getElementById("ucSearch");
  document.querySelectorAll("[data-uc-search]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!searchDrawer) return;
      searchDrawer.hidden = false;
      var input = searchDrawer.querySelector("input");
      if (input) input.focus();
    });
  });
  document.querySelectorAll("[data-uc-search-close]").forEach(function (btn) {
    btn.addEventListener("click", function () { if (searchDrawer) searchDrawer.hidden = true; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchDrawer && !searchDrawer.hidden) searchDrawer.hidden = true;
  });

  // Program-finder tabs
  var tabs = document.querySelectorAll(".uc-tab");
  var panels = document.querySelectorAll("[data-panel]");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      panels.forEach(function (p) { p.hidden = p.id !== target; });
    });
  });

  // Header shadow on scroll
  var header = document.querySelector(".uc-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Dynamic Active Navigation State
  var currentUrl = window.location.href.split('#')[0].split('?')[0];
  var currentDir = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
  
  var mainNavLinks = document.querySelectorAll('.uc-nav .nav-link');
  mainNavLinks.forEach(function(link) {
    link.classList.remove('active');
    var linkUrl = link.href.split('#')[0].split('?')[0];
    var linkDir = linkUrl.substring(0, linkUrl.lastIndexOf('/'));
    
    if (currentUrl === linkUrl) {
      link.classList.add('active');
    } else if (currentDir === linkDir && currentDir !== '') {
      if (link.textContent.trim().toLowerCase() !== 'home') {
        link.classList.add('active');
      }
    }
  });

  var subNavLinks = document.querySelectorAll('.uc-subnav__links a');
  subNavLinks.forEach(function(link) {
    link.classList.remove('active');
    var linkUrl = link.href.split('#')[0].split('?')[0];
    if (currentUrl === linkUrl) {
      link.classList.add('active');
    }
  });

})();
