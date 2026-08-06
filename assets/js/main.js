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


  // ==========================================================================
  // PROGRAM PAGE MOBILE UX - DYNAMIC ACCORDION CONVERSION
  // Converts long scrolling sections into a sleek accordion on mobile.
  // ==========================================================================
  if (window.innerWidth < 992) {
    var programDetailsContainer = document.querySelector('.col-lg-9[data-bs-spy="scroll"]');
    if (programDetailsContainer) {
      var sections = programDetailsContainer.querySelectorAll('section[id]');
      if (sections.length > 0) {
        programDetailsContainer.classList.add('accordion', 'uc-mobile-program-accordion');
        programDetailsContainer.id = 'programAccordion';
        programDetailsContainer.removeAttribute('data-bs-spy');
        
        // Add a mobile header for the sections
        var mobileHeader = document.createElement('h3');
        mobileHeader.className = 'mb-4 mt-2';
        mobileHeader.style.fontFamily = 'var(--uc-serif)';
        mobileHeader.style.fontSize = '1.75rem';
        mobileHeader.style.fontWeight = '700';
        mobileHeader.style.color = 'var(--uc-primary)';
        mobileHeader.textContent = 'Program Details';
        programDetailsContainer.insertBefore(mobileHeader, programDetailsContainer.firstChild);
        
        sections.forEach(function(sec, index) {
          var titleEl = sec.querySelector('.uc-section-title');
          if (!titleEl) return;
          
          var title = titleEl.textContent;
          var content = sec.querySelector('.uc-rich');
          var sectionId = sec.id;
          
          var accItem = document.createElement('div');
          accItem.className = 'accordion-item border-0 mb-3 rounded overflow-hidden';
          accItem.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
          
          var accHeader = document.createElement('h2');
          accHeader.className = 'accordion-header';
          accHeader.id = 'heading-' + sectionId;
          
          var accBtn = document.createElement('button');
          accBtn.className = 'accordion-button' + (index === 0 ? '' : ' collapsed');
          accBtn.type = 'button';
          accBtn.setAttribute('data-bs-toggle', 'collapse');
          accBtn.setAttribute('data-bs-target', '#collapse-' + sectionId);
          accBtn.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
          accBtn.setAttribute('aria-controls', 'collapse-' + sectionId);
          accBtn.style.fontFamily = 'var(--uc-ui)';
          accBtn.style.fontSize = '1rem';
          accBtn.style.fontWeight = '600';
          accBtn.style.color = 'var(--uc-primary)';
          accBtn.style.backgroundColor = '#fff';
          accBtn.style.padding = '1.25rem 1.5rem';
          accBtn.textContent = title;
          
          var accCollapse = document.createElement('div');
          accCollapse.id = 'collapse-' + sectionId;
          accCollapse.className = 'accordion-collapse collapse' + (index === 0 ? ' show' : '');
          accCollapse.setAttribute('aria-labelledby', 'heading-' + sectionId);
          accCollapse.setAttribute('data-bs-parent', '#programAccordion');
          
          var accBody = document.createElement('div');
          accBody.className = 'accordion-body pt-2 pb-4 px-4';
          accBody.style.backgroundColor = '#fff';
          
          if (content) {
              accBody.appendChild(content);
          } else {
              while (sec.firstChild) {
                  if (sec.firstChild !== titleEl) {
                      accBody.appendChild(sec.firstChild);
                  } else {
                      sec.removeChild(sec.firstChild);
                  }
              }
          }
          
          accHeader.appendChild(accBtn);
          accCollapse.appendChild(accBody);
          accItem.appendChild(accHeader);
          accItem.appendChild(accCollapse);
          
          programDetailsContainer.insertBefore(accItem, sec);
          sec.remove();
        });
      }
    }
  }


  // ==========================================================================
  // FEE STRUCTURE TABLE ACCORDION CONVERTER & CLEANUP
  // Cleans up cluttered headings and converts long fee tables into nice accordions.
  // ==========================================================================
  var feeTables = document.querySelectorAll('.uc-fee-table');
  feeTables.forEach(function(table, tableIndex) {
    var tbody = table.querySelector('tbody');
    if (!tbody) return;
    var rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Clean up redundant headings above the table
    var container = table.closest('.uc-rich');
    if (container) {
       var headings = container.querySelectorAll('h3.uc-rich-heading, h4.uc-rich-heading');
       headings.forEach(function(h) {
          var text = h.textContent.toLowerCase();
          // Remove messy repeated titles
          if (text.includes('fee structure') || text.includes('department of') || text.includes('bs ') || text.includes('doctor of')) {
             h.style.display = 'none';
          }
       });
    }

    var blocks = [];
    var currentBlock = null;
    
    rows.forEach(function(row) {
       var cells = row.querySelectorAll('td, th');
       if (cells.length === 0) return;
       var firstCellText = cells[0].textContent.trim().toLowerCase();
       var secondCellText = cells.length > 1 ? cells[1].textContent.trim() : '';
       
       if (firstCellText === 'semester' || firstCellText.includes('semester') && !firstCellText.includes('total')) {
           var semName = secondCellText || firstCellText; 
           if (firstCellText === 'semester' && secondCellText) {
               semName = secondCellText + ' Semester';
           } else if (firstCellText.includes('semester') && !secondCellText) {
               semName = cells[0].textContent.trim();
           } else if (firstCellText.includes('semester') && secondCellText) {
               semName = secondCellText + ' Semester';
           }
           currentBlock = { title: semName, rows: [], isTotal: false };
           blocks.push(currentBlock);
       } else if (firstCellText === 'total' || firstCellText === 'total semesters fee' || firstCellText === 'registration fee' || firstCellText === 'total fee' || firstCellText.includes('payable once')) {
           if (!currentBlock || !currentBlock.isTotal) {
               currentBlock = { title: 'Program Fee Summary', rows: [], isTotal: true };
               blocks.push(currentBlock);
           }
           currentBlock.rows.push(row);
       } else {
           if (currentBlock) {
               currentBlock.rows.push(row);
           } else {
               currentBlock = { title: 'General Details', rows: [row], isTotal: false };
               blocks.push(currentBlock);
           }
       }
    });

    if (blocks.length > 2) {
       var accordion = document.createElement('div');
       accordion.className = 'accordion accordion-flush fee-accordion mt-2';
       accordion.id = 'feeAcc-' + tableIndex;
       
       blocks.forEach(function(block, bIndex) {
           var item = document.createElement('div');
           item.className = 'accordion-item border rounded mb-2 overflow-hidden shadow-sm';
           
           var header = document.createElement('h2');
           header.className = 'accordion-header';
           
           var btn = document.createElement('button');
           btn.className = 'accordion-button' + (bIndex === 0 ? '' : ' collapsed');
           btn.type = 'button';
           btn.setAttribute('data-bs-toggle', 'collapse');
           btn.setAttribute('data-bs-target', '#feeCollapse-' + tableIndex + '-' + bIndex);
           btn.style.fontFamily = 'var(--uc-ui)';
           btn.style.fontWeight = '600';
           btn.style.backgroundColor = block.isTotal ? 'rgba(240, 178, 58, 0.1)' : 'var(--uc-cream-2)';
           btn.style.color = 'var(--uc-primary)';
           
           var cleanTitle = block.title.replace(/strong/ig, '').trim();
           btn.textContent = cleanTitle.toUpperCase();
           
           header.appendChild(btn);
           
           var collapse = document.createElement('div');
           collapse.id = 'feeCollapse-' + tableIndex + '-' + bIndex;
           collapse.className = 'accordion-collapse collapse' + (bIndex === 0 ? ' show' : '');
           collapse.setAttribute('data-bs-parent', '#feeAcc-' + tableIndex);
           
           var body = document.createElement('div');
           body.className = 'accordion-body p-0';
           
           var subTable = document.createElement('table');
           subTable.className = 'table table-borderless mb-0 uc-fee-subtable m-0';
           var subTbody = document.createElement('tbody');
           
           block.rows.forEach(function(r) {
               var clone = r.cloneNode(true);
               // Clean up any inner HTML like h4 or strong for cleaner look
               clone.querySelectorAll('h4, strong, h3').forEach(function(el) {
                   var txt = document.createTextNode(el.textContent);
                   el.parentNode.replaceChild(txt, el);
               });
               subTbody.appendChild(clone);
           });
           
           subTable.appendChild(subTbody);
           body.appendChild(subTable);
           collapse.appendChild(body);
           
           item.appendChild(header);
           item.appendChild(collapse);
           accordion.appendChild(item);
       });
       
       var tableWrapper = table.closest('.table-responsive');
       if (tableWrapper) {
           tableWrapper.parentNode.insertBefore(accordion, tableWrapper);
           tableWrapper.style.display = 'none';
       }
    }
  });

})();
