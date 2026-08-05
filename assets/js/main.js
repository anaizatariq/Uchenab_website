/* University of Chenab — Homepage interactions */
(function () {
  "use strict";

  // Footer year
  var y = document.getElementById("ucYear");
  if (y) y.textContent = new Date().getFullYear();

  // Search drawer

  // Search drawer
  var searchDrawer = document.getElementById("ucSearch");
  var searchForm = searchDrawer ? searchDrawer.querySelector("form") : null;
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = searchForm.querySelector("input").value.toLowerCase().trim();
      if (input !== "") {
        var brand = document.querySelector('a.navbar-brand');
        var rootPath = brand ? brand.getAttribute('href').split('index.html')[0] : '';
        if (rootPath === '') rootPath = './';

        // Direct mapping for program pages
        var programMap = [
          { keys: ['computer science', 'cs', 'bs cs'], url: 'academics/ug-computer-science-bs.html' },
          { keys: ['ms computer science', 'ms cs'], url: 'academics/pg-computer-science-ms.html' },
          { keys: ['software engineering', 'software', 'se'], url: 'academics/ug-software-engineering-bs.html' },
          { keys: ['data science', 'ds'], url: 'academics/ug-data-science-bsds.html' },
          { keys: ['bba', 'business administration', 'business'], url: 'academics/ug-business-administration-bba.html' },
          { keys: ['mba', 'management sciences'], url: 'academics/pg-management-sciences-mphil.html' },
          { keys: ['pharmacy', 'pharm-d', 'pharmd'], url: 'academics/ug-doctor-of-pharmacy-pharm-d.html' },
          { keys: ['dpt', 'physical therapy', 'physiotherapy'], url: 'academics/ug-doctor-of-physio-therapy-dpt.html' },
          { keys: ['nursing', 'bsn'], url: 'academics/ug-bachelor-of-science-in-nursing.html' },
          { keys: ['mlt', 'medical lab', 'laboratory'], url: 'academics/ug-medical-lab-sciences-bs.html' },
          { keys: ['imaging', 'radiology', 'mit'], url: 'academics/ug-medical-imaging-sciences-bs.html' },
          { keys: ['nutrition', 'dietetics', 'hnd'], url: 'academics/ug-dietetics-and-nutritional-sciences.html' },
          { keys: ['optometry', 'vision'], url: 'academics/ug-bs-optometry-and-vision-sciences.html' },
          { keys: ['law', 'llb'], url: 'academics/ug-llb.html' },
          { keys: ['accounting', 'finance', 'baf'], url: 'academics/ug-accounting-and-finance-bs.html' },
          { keys: ['english', 'literature', 'linguistics'], url: 'academics/ug-bs-english.html' },
          { keys: ['psychology', 'clinical'], url: 'academics/ug-bachelor-of-science-in-psychology.html' },
          { keys: ['math', 'mathematics'], url: 'academics/ug-mathematics-bs.html' },
          { keys: ['physics'], url: 'academics/ug-physics-bs.html' },
          { keys: ['sports', 'physical education'], url: 'academics/ug-bs-sports-science-and-physical-education.html' },
          { keys: ['civil', 'engineering'], url: 'academics/ug-civil-engineering-technology-bsc.html' }
        ];

        var targetUrl = '';
        for (var i = 0; i < programMap.length; i++) {
          var matched = programMap[i].keys.some(function(key) {
            var regex = new RegExp('\\b' + key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&') + '\\b', 'i');
            return regex.test(input);
          });
          if (matched) {
            targetUrl = programMap[i].url;
            break;
          }
        }

        if (targetUrl !== '') {
          window.location.href = rootPath + targetUrl;
        } else {
          // Fallback if no specific page found
          window.location.href = rootPath + "admissions/degree-finder.html?q=" + encodeURIComponent(input);
        }
      }
    });
  }

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
  mainNavLinks.forEach(function (link) {
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
  subNavLinks.forEach(function (link) {
    link.classList.remove('active');
    var linkUrl = link.href.split('#')[0].split('?')[0];
    if (currentUrl === linkUrl) {
      link.classList.add('active');
    }
  });

  // Subnav horizontal scroll click
  var subnavHints = document.querySelectorAll('.uc-subnav__hint');
  subnavHints.forEach(function (hint) {
    var subnavLinks = hint.parentElement.querySelector('.uc-subnav__links');
    if (subnavLinks) {
      hint.style.cursor = 'pointer';
      hint.style.transition = 'opacity 0.3s ease';

      hint.addEventListener('click', function () {
        subnavLinks.scrollBy({ left: 300, behavior: 'smooth' });
      });

      var checkScroll = function () {
        if (subnavLinks.scrollWidth <= subnavLinks.clientWidth) {
          hint.style.display = 'none';
        } else {
          hint.style.display = '';
          if (subnavLinks.scrollLeft + subnavLinks.clientWidth >= subnavLinks.scrollWidth - 5) {
            hint.style.opacity = '0';
            hint.style.pointerEvents = 'none';
          } else {
            hint.style.opacity = '1';
            hint.style.pointerEvents = 'auto';
          }
        }
      };

      subnavLinks.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      setTimeout(checkScroll, 100);
    }
  });

})();
