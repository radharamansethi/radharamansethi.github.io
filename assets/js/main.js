(() => {
  const root = document.body.dataset.root || "./";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */
  const themeBtn = $(".theme-toggle");
  const setTheme = (t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
  };
  themeBtn?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  });

  /* ---------- nav ---------- */
  const nav = $(".nav");
  const menuBtn = $(".menu-btn");
  const links = $(".nav-links");
  menuBtn?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$(".nav-links a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

  /* ---------- scroll: progress bar + nav border ---------- */
  const progress = $(".progress");
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    nav?.classList.toggle("scrolled", h.scrollTop > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- cursor glow ---------- */
  const glow = $(".cursor-glow");
  if (glow && !reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  /* ---------- card spotlight ---------- */
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  /* ---------- terminal tilt ---------- */
  const tilt = $(".terminal");
  if (tilt && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    tilt.addEventListener("pointerleave", () => (tilt.style.transform = ""));
  }

  /* ---------- typing effect ---------- */
  const typer = $(".typer .word");
  if (typer) {
    const words = JSON.parse(typer.dataset.words);
    if (reduceMotion) {
      typer.textContent = words[0];
    } else {
      let w = 0, i = 0, deleting = false;
      const tick = () => {
        const word = words[w];
        i += deleting ? -1 : 1;
        typer.textContent = word.slice(0, i);
        let delay = deleting ? 40 : 85;
        if (!deleting && i === word.length) { delay = 1800; deleting = true; }
        else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
        setTimeout(tick, delay);
      };
      tick();
    }
  }

  /* ---------- terminal script ---------- */
  const term = $(".terminal-body");
  if (term) {
    const lines = [
      ['<span class="t-prompt">~ $</span> whoami', 0],
      ['radharaman-sethi', 1],
      ['<span class="t-prompt">~ $</span> cat profile.yaml', 0],
      ['<span class="t-key">role</span>: <span class="t-str">OpenStack Infrastructure Engineer</span>', 1],
      ['<span class="t-key">based</span>: <span class="t-str">Gurugram, India</span>', 1],
      ['<span class="t-key">stack</span>: [<span class="t-str">Kolla-Ansible</span>, <span class="t-str">Nova</span>, <span class="t-str">Neutron</span>, <span class="t-str">Cinder</span>, <span class="t-str">Ceph</span>]', 1],
      ['<span class="t-key">learning</span>: <span class="t-str">Kubernetes (CKA)</span>', 1],
      ['<span class="t-prompt">~ $</span> kolla-ansible deploy -i multinode', 0],
      ['<span class="t-muted">PLAY RECAP ****************************</span>', 1],
      ['ctl01 : ok=<span class="t-str">412</span>  changed=<span class="t-str">38</span>  failed=<span class="t-str">0</span>', 1],
      ['<span class="t-prompt">~ $</span> <span class="caret"></span>', 0],
    ];
    const render = (n) => (term.innerHTML = lines.slice(0, n).map(([l]) => `<div class="ln">${l}</div>`).join(""));
    if (reduceMotion) render(lines.length);
    else {
      let n = 0;
      const step = () => { n++; render(n); if (n < lines.length) setTimeout(step, lines[n - 1][1] ? 160 : 650); };
      setTimeout(step, 500);
    }
  }

  /* ---------- counters ---------- */
  const countUp = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const dec = +(el.dataset.decimals || 0);
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    const frame = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  /* ---------- post cards ---------- */
  const posts = window.POSTS || [];
  const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  const card = (p, i = 0) => `
    <a class="card post-card reveal" data-delay="${i % 3 + 1}" href="${root}blog/${p.slug}/" data-tags="${p.tags.join("|")}" data-text="${(p.title + " " + p.excerpt + " " + p.tags.join(" ")).toLowerCase()}">
      <div class="post-cover ${p.cover}"><span class="emoji" aria-hidden="true">${p.emoji}</span></div>
      <div class="post-body">
        <div class="post-meta"><span>${fmtDate(p.date)}</span><span class="dot"></span><span>${p.readTime} min read</span></div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="tags" style="margin-bottom:18px">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <span class="read-more">Read article ${arrow}</span>
      </div>
    </a>`;

  $$("[data-posts]").forEach((el) => {
    const mode = el.dataset.posts;
    let list = posts;
    if (mode === "latest") list = posts.slice(0, 3);
    if (mode === "related") {
      const current = el.dataset.current;
      list = posts.filter((p) => p.slug !== current).slice(0, 2);
    }
    el.innerHTML = list.map(card).join("");
  });

  /* blog filtering */
  const filterWrap = $(".filters");
  const search = $(".search input");
  if (filterWrap) {
    const tags = ["All", ...new Set(posts.flatMap((p) => p.tags))];
    filterWrap.innerHTML = tags.map((t, i) => `<button class="chip${i ? "" : " active"}" data-tag="${t}">${t}</button>`).join("");
    let activeTag = "All";
    const apply = () => {
      const q = (search?.value || "").trim().toLowerCase();
      let shown = 0;
      $$(".post-card").forEach((c) => {
        const ok = (activeTag === "All" || c.dataset.tags.split("|").includes(activeTag)) && (!q || c.dataset.text.includes(q));
        c.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      const empty = $(".empty");
      if (empty) empty.style.display = shown ? "none" : "block";
    };
    filterWrap.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", filterWrap).forEach((c) => c.classList.toggle("active", c === b));
      activeTag = b.dataset.tag;
      apply();
    });
    search?.addEventListener("input", apply);
    const qp = new URLSearchParams(location.search).get("tag");
    if (qp) $(`.chip[data-tag="${CSS.escape(qp)}"]`, filterWrap)?.click();
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      $$("[data-count]", en.target).forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- active nav section ---------- */
  const sections = $$("section[id]");
  if (sections.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href").endsWith("#" + en.target.id)));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- toast + copy ---------- */
  const toast = (msg) => {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2000);
  };
  const copy = async (text, msg) => {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch (e) { toast("Couldn't copy — please copy manually"); }
  };
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy, b.dataset.copyMsg || "Copied!")));
  $$("[data-share]").forEach((b) => b.addEventListener("click", async () => {
    if (navigator.share) { try { await navigator.share({ title: document.title, url: location.href }); } catch (e) {} }
    else copy(location.href, "Link copied to clipboard");
  }));

  /* ---------- article: code copy + toc ---------- */
  $$(".code-block").forEach((block) => {
    const btn = $(".copy-btn", block);
    btn?.addEventListener("click", () => {
      copy($("pre", block).innerText, "Code copied");
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  });
  const toc = $(".toc ol");
  const heads = $$(".prose h2");
  if (toc && heads.length) {
    toc.innerHTML = heads.map((h, i) => {
      h.id ||= "s" + i + "-" + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `<li><a href="#${h.id}">${h.textContent}</a></li>`;
    }).join("");
    const tocIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) $$("a", toc).forEach((a) => a.classList.toggle("active", a.hash === "#" + en.target.id));
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    heads.forEach((h) => tocIO.observe(h));
  }

  /* ---------- command palette (Ctrl/Cmd + K) ---------- */
  const items = [
    { g: "Navigate", i: "🏠", t: "Home", u: root },
    { g: "Navigate", i: "👋", t: "About", u: root + "#about" },
    { g: "Navigate", i: "💼", t: "Experience", u: root + "#experience" },
    { g: "Navigate", i: "🛠️", t: "Skills", u: root + "#skills" },
    { g: "Navigate", i: "🎓", t: "Certifications", u: root + "#certs" },
    { g: "Navigate", i: "📦", t: "Projects", u: root + "#projects" },
    { g: "Navigate", i: "✍️", t: "Blog", u: root + "blog/" },
    { g: "Navigate", i: "📬", t: "Contact", u: root + "#contact" },
    ...posts.map((p) => ({ g: "Articles", i: p.emoji, t: p.title, u: `${root}blog/${p.slug}/` })),
    { g: "Elsewhere", i: "🐙", t: "GitHub", u: "https://github.com/radharamansethi", ext: true },
    { g: "Elsewhere", i: "🔗", t: "LinkedIn", u: "https://www.linkedin.com/in/radharaman-sethi-53a3b1200/", ext: true },
    { g: "Actions", i: "🌗", t: "Toggle theme", a: () => themeBtn?.click() },
    { g: "Actions", i: "📋", t: "Copy email address", a: () => copy("rrsethi13112001@gmail.com", "Email copied") },
  ];
  const bd = document.createElement("div");
  bd.className = "palette-backdrop";
  bd.innerHTML = `<div class="palette" role="dialog" aria-modal="true" aria-label="Command palette">
      <input type="text" placeholder="Type a command or search…" aria-label="Search commands" />
      <ul></ul></div>`;
  document.body.append(bd);
  const pInput = $("input", bd), pList = $("ul", bd);
  let filtered = items, sel = 0;
  const drawPalette = () => {
    const q = pInput.value.toLowerCase();
    filtered = items.filter((x) => x.t.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(filtered.length - 1, 0));
    let last = "";
    pList.innerHTML = filtered.map((x, idx) => {
      const head = x.g !== last ? `<div class="group">${(last = x.g)}</div>` : "";
      return `${head}<li class="${idx === sel ? "sel" : ""}" data-i="${idx}"><a href="${x.u || "#"}"${x.ext ? ' target="_blank" rel="noopener"' : ""}><span class="pi">${x.i}</span>${x.t}${x.ext ? "<small>↗</small>" : ""}</a></li>`;
    }).join("") || `<div class="group">No results</div>`;
    $(".sel", pList)?.scrollIntoView({ block: "nearest" });
  };
  const openPalette = () => { bd.classList.add("open"); pInput.value = ""; sel = 0; drawPalette(); pInput.focus(); };
  const closePalette = () => bd.classList.remove("open");
  const run = (x) => {
    if (!x) return;
    closePalette();
    if (x.a) x.a();
    else if (x.ext) window.open(x.u, "_blank", "noopener");
    else location.href = x.u;
  };
  pInput.addEventListener("input", () => { sel = 0; drawPalette(); });
  pList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    e.preventDefault();
    run(filtered[+li.dataset.i]);
  });
  bd.addEventListener("click", (e) => { if (e.target === bd) closePalette(); });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); bd.classList.contains("open") ? closePalette() : openPalette(); }
    if (!bd.classList.contains("open")) return;
    if (e.key === "Escape") closePalette();
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % filtered.length; drawPalette(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + filtered.length) % filtered.length; drawPalette(); }
    if (e.key === "Enter") { e.preventDefault(); run(filtered[sel]); }
  });
  $$(".kbd-hint").forEach((b) => b.addEventListener("click", openPalette));

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- a little easter egg ---------- */
  console.log("%cHey there, fellow dev 👋", "font-size:18px;font-weight:bold;color:#8b5cf6");
  console.log("%cLiked poking around? Say hi → rrsethi13112001@gmail.com", "color:#22d3ee");
})();
