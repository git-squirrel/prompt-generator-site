/* =========================================================
   Prompt Generator — showcase interactions
   Vanilla JS, no dependencies. The studio is a front-end
   simulation: no network calls, no API keys, no uploads.
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* ---------------------------------------------------------
     Data
     --------------------------------------------------------- */

  const CATEGORIES = [
    {
      id: "scene",
      name: "场景",
      en: "Scenes",
      items: [
        { zh: "山水", en: "landscape", art: "dune", pal: "ice" },
        { zh: "城市", en: "city", art: "city", pal: "noir" },
        { zh: "森林", en: "forest", art: "forest", pal: "forest" },
        { zh: "海滩", en: "beach", art: "wave", pal: "sand" },
        { zh: "日落", en: "sunset", art: "dune", pal: "ember" },
        { zh: "星空", en: "starry sky", art: "stars", pal: "lilac" },
        { zh: "花园", en: "garden", art: "bloom", pal: "teal" },
        { zh: "建筑", en: "architecture", art: "arch", pal: "sand" }
      ]
    },
    {
      id: "style",
      name: "风格",
      en: "Styles",
      items: [
        { zh: "写实", en: "realistic" },
        { zh: "油画", en: "oil painting" },
        { zh: "水彩", en: "watercolor" },
        { zh: "动漫", en: "anime" },
        { zh: "像素风", en: "pixel art" },
        { zh: "赛博朋克", en: "cyberpunk" },
        { zh: "蒸汽朋克", en: "steampunk" },
        { zh: "水墨", en: "ink wash" }
      ]
    },
    {
      id: "light",
      name: "光线",
      en: "Lighting",
      items: [
        { zh: "自然光", en: "natural light" },
        { zh: "黄金时刻", en: "golden hour" },
        { zh: "逆光", en: "backlight" },
        { zh: "侧光", en: "side light" },
        { zh: "暖光", en: "warm light" },
        { zh: "冷光", en: "cool light" },
        { zh: "霓虹光", en: "neon light" },
        { zh: "烛光", en: "candlelight" }
      ]
    },
    {
      id: "visual",
      name: "画面",
      en: "Visual",
      items: [
        { zh: "浅景深", en: "shallow depth of field" },
        { zh: "广角", en: "wide angle" },
        { zh: "微距", en: "macro" },
        { zh: "长焦", en: "telephoto" },
        { zh: "特写", en: "close-up" },
        { zh: "全景", en: "panoramic" },
        { zh: "鱼眼", en: "fisheye" },
        { zh: "航拍", en: "aerial" }
      ]
    },
    {
      id: "color",
      name: "色彩",
      en: "Color",
      items: [
        { zh: "暖色调", en: "warm tones" },
        { zh: "冷色调", en: "cool tones" },
        { zh: "黑白", en: "black and white" },
        { zh: "复古色", en: "vintage colors" },
        { zh: "糖果色", en: "candy colors" },
        { zh: "暗黑系", en: "dark tones" },
        { zh: "莫兰迪色", en: "muted Morandi palette" },
        { zh: "渐变", en: "gradient" }
      ]
    },
    {
      id: "mood",
      name: "氛围",
      en: "Mood",
      items: [
        { zh: "静谧", en: "serene" },
        { zh: "梦幻", en: "dreamy" },
        { zh: "电影感", en: "cinematic" },
        { zh: "治愈", en: "healing" },
        { zh: "神秘", en: "mysterious" },
        { zh: "史诗", en: "epic" },
        { zh: "慵懒", en: "lazy" },
        { zh: "清新", en: "fresh" }
      ]
    }
  ];

  const REGIONS = [
    { zh: "中国", en: "Chinese" },
    { zh: "韩国", en: "Korean" },
    { zh: "日本", en: "Japanese" },
    { zh: "欧美", en: "Western" }
  ];

  const GENDERS = [
    { zh: "女", en: "Female" },
    { zh: "男", en: "Male" }
  ];

  const TEMPLATE_GROUPS = [
    {
      id: "frame",
      name: "画面描述",
      zh: "大师级摄影作品，完美曝光，构图精妙",
      en: "masterpiece photography, perfect exposure, refined composition",
      person: false
    },
    {
      id: "skin",
      name: "皮肤描述",
      zh: "细腻肤质，自然妆容",
      en: "delicate skin texture, natural makeup",
      person: true
    },
    {
      id: "quality",
      name: "画质描述",
      zh: "8K 超高清，电影级质感，细节丰富",
      en: "8K ultra HD, cinematic texture, rich detail",
      person: false
    }
  ];

  const SCENE_MOODS = {
    山水: {
      zh: "晨雾漫过山脊，侧逆光勾勒出层叠的轮廓",
      en: "morning mist spilling over the ridges, rim light tracing layered silhouettes"
    },
    城市: {
      zh: "雨水打湿街道，霓虹在玻璃幕墙上晕开",
      en: "rain-slicked streets, neon bleeding across glass facades"
    },
    森林: {
      zh: "光束穿过树冠，空气里浮着细小的尘埃",
      en: "shafts of light piercing the canopy, fine dust hanging in the air"
    },
    海滩: {
      zh: "潮水退去，湿润的沙面映着天光",
      en: "the tide receding, wet sand mirroring the sky"
    },
    日落: {
      zh: "云层被余晖烧成橘红，地平线泛着微光",
      en: "clouds burned orange by the afterglow, a faint glow along the horizon"
    },
    星空: {
      zh: "银河横过夜空，远处山脊只剩一道剪影",
      en: "the Milky Way arcing overhead, distant ridges reduced to silhouettes"
    },
    花园: {
      zh: "花瓣上还留着露水，光线柔软而安静",
      en: "dew still clinging to the petals, the light soft and quiet"
    },
    建筑: {
      zh: "长长的人影落在石阶上，空间安静得能听见回声",
      en: "long shadows falling across stone steps, the space quiet enough to hear an echo"
    }
  };

  const SAMPLE_PROMPTS = [
    {
      scene: "山水",
      zh: "中国，25岁，女，山水，写实，黄金时刻，浅景深，特写",
      en: "Chinese, 25 years old, Female, landscape, realistic, golden hour, shallow depth of field, close-up",
      size: "1024×1024",
      seed: 438892078
    },
    {
      scene: "森林",
      zh: "中国，31岁，女，森林，油画，逆光，微距，全景",
      en: "Chinese, 31 years old, Female, forest, oil painting, backlight, macro, panoramic",
      size: "832×1216",
      seed: 771204836
    },
    {
      scene: "城市",
      zh: "欧美，28岁，男，城市，赛博朋克，霓虹光，广角",
      en: "Western, 28 years old, Male, city, cyberpunk, neon light, wide angle",
      size: "1216×832",
      seed: 209384715
    },
    {
      scene: "花园",
      zh: "日本，24岁，女，花园，水彩，暖光，特写",
      en: "Japanese, 24 years old, Female, garden, watercolor, warm light, close-up",
      size: "832×1216",
      seed: 660127493
    }
  ];

  const ART_PALETTES = {
    ice: {
      sky: ["#06111f", "#174b66", "#8fd0de"],
      glow: "#efffff",
      land: ["#041019", "#092536", "#0f3a50"],
      accent: "#bfefff"
    },
    dusk: {
      sky: ["#0b1530", "#3a4f9e", "#e8a0a6"],
      glow: "#ffe0b8",
      land: ["#070d1c", "#111a36", "#1d2b4d"],
      accent: "#ffc9a3"
    },
    forest: {
      sky: ["#081d1a", "#1c4b3f", "#83b9a4"],
      glow: "#e8ffd6",
      land: ["#041310", "#0a251e", "#10382c"],
      accent: "#b7e6cd"
    },
    ember: {
      sky: ["#1c090c", "#7e2b27", "#ff9a5c"],
      glow: "#ffe3ae",
      land: ["#120607", "#2a0e10", "#48201a"],
      accent: "#ffb47a"
    },
    lilac: {
      sky: ["#150c2b", "#4b358a", "#c9a6ff"],
      glow: "#ffe9fb",
      land: ["#0d0720", "#1d1238", "#2f2153"],
      accent: "#d9b8ff"
    },
    sand: {
      sky: ["#251711", "#8d5836", "#ffc78f"],
      glow: "#fff0c9",
      land: ["#160c07", "#301b10", "#4f2e1b"],
      accent: "#ffd9a3"
    },
    noir: {
      sky: ["#08090c", "#23252e", "#7e8294"],
      glow: "#f4f0e4",
      land: ["#040506", "#101116", "#1d1f27"],
      accent: "#c9cbd6"
    },
    teal: {
      sky: ["#04181c", "#0f4c52", "#6fd3cf"],
      glow: "#e4fffb",
      land: ["#020f12", "#06242a", "#0a353d"],
      accent: "#a8f0e8"
    }
  };

  const STATE = {
    cats: CATEGORIES.map((cat) => ({ ...cat, enabled: true })),
    locks: {},
    identity: true,
    identityInfo: null,
    ai: true,
    lang: "both",
    batch: 2,
    size: "1024×1024",
    workflow: "Flux · 写实人像",
    seed: 438892078,
    picks: null,
    prompt: { zh: "", en: "" },
    optimized: false,
    polished: false,
    busy: false,
    polishing: false,
    autoRunning: false,
    gallery: [],
    nextId: 1,
    runId: 0,
    typeToken: 0
  };

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function formatSeed(n) {
    return String(n).replace(/\D/g, "").slice(0, 12) || "0";
  }

  function estimateTokens(zh, en) {
    const zhCount = (zh || "").replace(/\s/g, "").length;
    const enCount = (en || "").split(/\s+/).filter(Boolean).length;
    return Math.round(zhCount * 1.35 + enCount * 1.4);
  }

  function parseSize(size) {
    const parts = String(size).split("×").map((n) => parseInt(n, 10));
    if (parts.length !== 2 || !parts[0] || !parts[1]) return { w: 1024, h: 1024 };
    return { w: parts[0], h: parts[1] };
  }

  function sceneByName(name) {
    return CATEGORIES[0].items.find((item) => item.zh === name) || CATEGORIES[0].items[0];
  }

  function initialPicks() {
    const itemOf = (catId, zh) => {
      const cat = CATEGORIES.find((c) => c.id === catId);
      return cat ? cat.items.find((item) => item.zh === zh) : null;
    };
    return {
      scene: itemOf("scene", "山水"),
      style: itemOf("style", "写实"),
      light: itemOf("light", "黄金时刻"),
      visual: itemOf("visual", "浅景深")
    };
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  async function copyText(text, message) {
    if (!text || !text.trim()) {
      toast("还没有可复制的内容");
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast(message || "已复制到剪贴板");
    } catch (err) {
      toast("复制失败，请手动选择文本");
    }
  }

  /* ---------------------------------------------------------
     Generative SVG artwork (deterministic, local)
     --------------------------------------------------------- */

  let artSeq = 0;

  function artSVG(kind, palKey, seed, ratio) {
    const W = 480;
    ratio = ratio || 1.25;
    const H = Math.round(W * ratio);
    const p = ART_PALETTES[palKey] || ART_PALETTES.dusk;
    const rnd = mulberry32((seed >>> 0) || 1);
    const uid = "s" + ((seed >>> 0) || 1).toString(36) + "-" + kind + "-" + ++artSeq;
    const r = (min, max) => min + rnd() * (max - min);
    const sunX = W * r(0.22, 0.78);
    const sunY = H * r(0.16, 0.36);
    const sunR = W * r(0.055, 0.1);
    const glow = p.glow;
    let body = "";

    const defs = `
      <defs>
        <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0.22" y2="1">
          <stop offset="0" stop-color="${p.sky[0]}"/>
          <stop offset=".55" stop-color="${p.sky[1]}"/>
          <stop offset="1" stop-color="${p.sky[2]}"/>
        </linearGradient>
        <linearGradient id="sea-${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${p.sky[2]}" stop-opacity=".85"/>
          <stop offset="1" stop-color="${p.land[0]}"/>
        </linearGradient>
        <radialGradient id="halo-${uid}">
          <stop offset="0" stop-color="${glow}" stop-opacity=".9"/>
          <stop offset=".42" stop-color="${glow}" stop-opacity=".2"/>
          <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="vig-${uid}" cx=".5" cy=".46" r=".78">
          <stop offset=".5" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".48"/>
        </radialGradient>
        <filter id="blur-${uid}" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="${Math.round(W * 0.045)}"/>
        </filter>
        <filter id="soft-${uid}" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6"/>
        </filter>
        <filter id="noise-${uid}">
          <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </defs>`;

    body += `<rect width="${W}" height="${H}" fill="url(#sky-${uid})"/>`;
    body += `<circle cx="${sunX}" cy="${sunY}" r="${sunR * 3.1}" fill="url(#halo-${uid})"/>`;

    if (kind === "dune") {
      body += `<circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${glow}" opacity=".85"/>`;
      body += `<ellipse cx="${W * 0.5}" cy="${H * 0.56}" rx="${W * 0.68}" ry="${H * 0.07}" fill="${glow}" opacity=".1" filter="url(#blur-${uid})"/>`;
      const horizon = H * 0.55;
      for (let i = 0; i < 4; i++) {
        const y = horizon + i * H * 0.105;
        const y2 = y - H * r(0.03, 0.09);
        const y3 = y + H * r(0.02, 0.05);
        body += `<path d="M0 ${y + H * 0.03} C ${W * r(0.12, 0.26)} ${y2} ${W * r(0.42, 0.58)} ${y3} ${W} ${y - H * r(0, 0.05)} L ${W} ${H} L0 ${H}Z" fill="${p.land[Math.min(i, 2)]}" opacity="${1 - i * 0.06}"/>`;
        body += `<path d="M0 ${y + H * 0.03} C ${W * r(0.12, 0.26)} ${y2} ${W * r(0.42, 0.58)} ${y3} ${W} ${y - H * r(0, 0.05)}" fill="none" stroke="${glow}" stroke-opacity="${0.2 - i * 0.035}" stroke-width="1.2"/>`;
      }
    } else if (kind === "forest") {
      body += `<circle cx="${sunX}" cy="${sunY}" r="${sunR * 0.8}" fill="${glow}" opacity=".55"/>`;
      for (let i = 0; i < 3; i++) {
        body += `<ellipse cx="${W * 0.5}" cy="${H * (0.56 + i * 0.1)}" rx="${W * 0.62}" ry="${H * 0.05}" fill="${glow}" opacity=".08" filter="url(#blur-${uid})"/>`;
      }
      for (const layer of [2, 1, 0]) {
        const base = H * (0.6 + (2 - layer) * 0.1);
        const count = 7 + (2 - layer) * 4;
        for (let i = 0; i < count; i++) {
          const x = r(-20, W + 20);
          const h = H * r(0.12, 0.24) * (1 + (2 - layer) * 0.25);
          const w = h * r(0.2, 0.3);
          body += `<path d="M${x} ${base - h} L${x - w} ${base} L${x + w} ${base}Z" fill="${p.land[layer]}" opacity=".95"/>`;
          body += `<rect x="${x - 1.2}" y="${base - 4}" width="2.4" height="${H * 0.05}" fill="${p.land[0]}" opacity=".8"/>`;
        }
      }
      for (let i = 0; i < 2; i++) {
        body += `<polygon points="${W * r(0.1, 0.5)},0 ${W * r(0.55, 0.8)},0 ${W * r(0.2, 0.6)},${H * 0.7}" fill="${glow}" opacity=".035"/>`;
      }
    } else if (kind === "city") {
      const horizon = H * 0.66;
      body += `<circle cx="${sunX}" cy="${sunY}" r="${sunR * 0.8}" fill="${glow}" opacity=".7"/>`;
      body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#sea-${uid})" opacity=".7"/>`;
      let x = -10;
      const buildings = [];
      while (x < W) {
        const bw = r(14, 38);
        const bh = H * r(0.08, 0.35);
        const by = horizon - bh;
        buildings.push({ x, bw, bh, by });
        body += `<rect x="${x}" y="${by}" width="${bw}" height="${bh}" fill="${p.land[0]}" opacity=".96"/>`;
        body += `<rect x="${x}" y="${by}" width="1.5" height="${bh}" fill="${glow}" opacity=".14"/>`;
        for (let wy = by + 6; wy < horizon - 4; wy += 7) {
          for (let wx = x + 4; wx < x + bw - 3; wx += 6) {
            if (rnd() > 0.55) {
              body += `<rect x="${wx}" y="${wy}" width="2" height="2.6" fill="${glow}" opacity="${r(0.25, 0.7)}"/>`;
            }
          }
        }
        x += bw + r(2, 8);
      }
      body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="${p.land[0]}" opacity=".35"/>`;
      buildings.forEach((b) => {
        body += `<rect x="${b.x}" y="${horizon + 2}" width="${b.bw}" height="${Math.min(b.bh * 0.4, H - horizon - 4)}" fill="${glow}" opacity=".05"/>`;
      });
      for (let i = 0; i < 16; i++) {
        body += `<rect x="${r(10, W - 30)}" y="${r(horizon + 6, H - 6)}" width="${r(8, 26)}" height="1" fill="${glow}" opacity="${r(0.05, 0.18)}"/>`;
      }
    } else if (kind === "bloom") {
      const cx = W * 0.5;
      const cy = H * 0.44;
      body += `<circle cx="${cx}" cy="${cy}" r="${W * 0.3}" fill="${glow}" opacity=".1" filter="url(#blur-${uid})"/>`;
      for (let i = 0; i < 11; i++) {
        const angle = i * (360 / 11) + r(-4, 4);
        body += `<ellipse cx="${cx}" cy="${cy - H * 0.19}" rx="${W * r(0.055, 0.085)}" ry="${H * r(0.14, 0.2)}" fill="${glow}" opacity="${r(0.07, 0.16)}" stroke="${glow}" stroke-opacity=".16" stroke-width=".8" transform="rotate(${angle} ${cx} ${cy})"/>`;
      }
      body += `<circle cx="${cx}" cy="${cy}" r="${W * 0.045}" fill="${glow}" opacity=".55"/>`;
      body += `<circle cx="${cx}" cy="${cy}" r="${W * 0.018}" fill="${p.accent}" opacity=".9"/>`;
      for (let i = 0; i < 4; i++) {
        const bx = W * (0.2 + i * 0.2);
        body += `<path d="M${bx} ${H} Q ${bx + r(-40, 40)} ${H * 0.7} ${cx + r(-20, 20)} ${cy + H * 0.08}" fill="none" stroke="${p.land[0]}" stroke-opacity=".8" stroke-width="${r(2, 4)}"/>`;
      }
      for (let i = 0; i < 18; i++) {
        body += `<circle cx="${r(0, W)}" cy="${r(0, H)}" r="${r(0.6, 2)}" fill="${glow}" opacity="${r(0.1, 0.5)}"/>`;
      }
    } else if (kind === "wave") {
      const horizon = H * 0.48;
      body += `<circle cx="${sunX}" cy="${horizon - sunR * 0.6}" r="${sunR}" fill="${glow}" opacity=".65"/>`;
      body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#sea-${uid})"/>`;
      for (let i = 0; i < 6; i++) {
        const y = horizon + i * H * 0.075;
        const amp = H * r(0.015, 0.045);
        body += `<path d="M0 ${y} C ${W * 0.2} ${y - amp} ${W * 0.35} ${y + amp} ${W * 0.55} ${y - amp * 0.4} S ${W * 0.85} ${y + amp} ${W} ${y - amp * 0.6} L ${W} ${H} L0 ${H}Z" fill="${p.land[Math.min(i, 2)]}" opacity="${0.92 - i * 0.03}"/>`;
        body += `<path d="M0 ${y} C ${W * 0.2} ${y - amp} ${W * 0.35} ${y + amp} ${W * 0.55} ${y - amp * 0.4}" fill="none" stroke="${glow}" stroke-opacity="${0.22 - i * 0.025}" stroke-width="1.3"/>`;
      }
      body += `<path d="M0 ${H * 0.72} C ${W * 0.25} ${H * 0.6} ${W * 0.32} ${H * 0.52} ${W * 0.5} ${H * 0.56} C ${W * 0.4} ${H * 0.68} ${W * 0.22} ${H * 0.8} 0 ${H * 0.92}Z" fill="${p.land[1]}" opacity=".85"/>`;
      for (let i = 0; i < 18; i++) {
        body += `<circle cx="${r(0, W)}" cy="${r(horizon + 10, H)}" r="${r(0.6, 2.2)}" fill="${glow}" opacity="${r(0.12, 0.5)}"/>`;
      }
    } else if (kind === "stars") {
      body += `<rect width="${W}" height="${H}" fill="${p.sky[0]}" opacity=".9"/>`;
      body += `<ellipse cx="${W * 0.5}" cy="${H * 0.4}" rx="${W * 0.75}" ry="${H * 0.12}" fill="${glow}" opacity=".07" filter="url(#blur-${uid})" transform="rotate(-18 ${W * 0.5} ${H * 0.4})"/>`;
      for (let i = 0; i < 90; i++) {
        body += `<circle cx="${r(0, W)}" cy="${r(0, H * 0.78)}" r="${r(0.4, 1.5)}" fill="${i % 9 === 0 ? p.accent : "#ffffff"}" opacity="${r(0.2, 0.95)}"/>`;
      }
      body += `<circle cx="${W * 0.78}" cy="${H * 0.2}" r="${W * 0.05}" fill="${glow}" opacity=".8"/>`;
      body += `<circle cx="${W * 0.78}" cy="${H * 0.2}" r="${W * 0.12}" fill="${glow}" opacity=".1" filter="url(#blur-${uid})"/>`;
      for (let layer = 0; layer < 2; layer++) {
        let d = `M0 ${H * (0.78 + layer * 0.08)}`;
        for (let x = 0; x <= W; x += 60) {
          d += ` L${x + 30} ${H * (0.7 + layer * 0.08) - r(0, H * 0.06)} L${x + 60} ${H * (0.78 + layer * 0.08)}`;
        }
        d += ` L${W} ${H} L0 ${H}Z`;
        body += `<path d="${d}" fill="${p.land[layer]}" opacity=".95"/>`;
      }
    } else if (kind === "arch") {
      const floor = H * 0.86;
      body += `<rect y="${floor}" width="${W}" height="${H - floor}" fill="${p.land[0]}" opacity=".9"/>`;
      body += `<ellipse cx="${W * 0.5}" cy="${floor}" rx="${W * 0.6}" ry="${H * 0.1}" fill="${glow}" opacity=".1" filter="url(#blur-${uid})"/>`;
      for (let i = 0; i < 4; i++) {
        const inset = W * (0.1 + i * 0.1);
        const top = H * (0.16 + i * 0.08);
        const w = W - inset * 2;
        const r = w / 2;
        body += `<path d="M${inset} ${floor} L${inset} ${top + r} A ${r} ${r} 0 0 1 ${inset + w} ${top + r} L${inset + w} ${floor}" fill="none" stroke="${glow}" stroke-opacity="${0.2 - i * 0.035}" stroke-width="${2.5 - i * 0.4}"/>`;
      }
      body += `<polygon points="${W * 0.62},0 ${W * 0.84},0 ${W * 0.56},${floor} ${W * 0.3},${floor}" fill="${glow}" opacity=".05"/>`;
      body += `<path d="M${W * 0.44} 0 L${W * 0.5} 0 L${W * 0.36} ${floor} L${W * 0.3} ${floor}Z" fill="${glow}" opacity=".08"/>`;
      for (let i = 0; i < 6; i++) {
        body += `<rect x="${r(0, W)}" y="${r(floor, H)}" width="${r(20, 70)}" height="1" fill="${glow}" opacity=".06"/>`;
      }
    } else {
      body += `<circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${glow}" opacity=".8"/>`;
    }

    body += `<rect width="${W}" height="${H}" filter="url(#noise-${uid})" opacity=".09" style="mix-blend-mode:overlay"/>`;
    body += `<rect width="${W}" height="${H}" fill="url(#vig-${uid})"/>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="抽象生成的${escapeHTML(kind)}画面">${defs}${body}</svg>`;
  }

  const ART_VARIANTS = {    dune: ["ice", "dusk", "ember", "teal"],
    forest: ["forest", "teal", "ice"],
    city: ["noir", "lilac", "ember"],
    bloom: ["teal", "lilac", "sand"],
    wave: ["sand", "ice", "ember"],
    stars: ["lilac", "ice", "noir"],
    arch: ["sand", "noir", "ice"]
  };

  const HERO_ART = {
    dune: ["dune", "ice", 1287],
    forest: ["forest", "forest", 4471],
    city: ["city", "noir", 9032],
    bloom: ["bloom", "lilac", 6719],
    wave: ["wave", "sand", 3324],
    stars: ["stars", "lilac", 8126],
    arch: ["arch", "sand", 5502]
  };

  function hydrateStaticArt() {
    $$("[data-art]").forEach((el, index) => {
      const key = el.dataset.art;
      const conf = HERO_ART[key] || HERO_ART.dune;
      const ratio = el.closest(".mock-back") || el.closest(".gv-item.tall") ? 1.25 : 1;
      el.innerHTML = artSVG(conf[0], conf[1], conf[2] + index * 37, ratio);
    });
  }

  /* ---------------------------------------------------------
     Theme
     --------------------------------------------------------- */

  function setTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem("pg-page-theme", theme);
      } catch (e) {}
    }
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#070a13" : "#f6f7fb");
    const toggle = $("#themeToggle");
    if (toggle) toggle.setAttribute("aria-label", theme === "dark" ? "切换到亮色主题" : "切换到暗色主题");
  }

  /* ---------------------------------------------------------
     Library
     --------------------------------------------------------- */

  function renderLibrary() {
    const library = $("#library");
    if (!library) return;
    library.innerHTML = STATE.cats
      .map(
        (cat) => `
      <div class="lib-block${cat.enabled ? "" : " is-off"}" data-cat="${cat.id}">
        <div class="lib-head">
          <span class="lib-name">${cat.name}</span>
          <span class="lib-en">${cat.en}</span>
          <span class="lib-count">${cat.items.length}</span>
          <button class="switch${cat.enabled ? " is-on" : ""}" type="button" role="switch"
            aria-checked="${cat.enabled}" aria-label="启用${cat.name}类别" data-toggle="${cat.id}"><span></span></button>
        </div>
        <div class="lib-chips">
          ${cat.items
            .map(
              (item, i) => `
            <button class="lib-chip${STATE.locks[cat.id] === item ? " is-locked" : ""}" type="button"
              data-cat="${cat.id}" data-index="${i}" aria-pressed="${STATE.locks[cat.id] === item}"
              title="锁定「${item.zh}」">${item.zh}</button>`
            )
            .join("")}
        </div>
      </div>`
      )
      .join("");
    const total = STATE.cats.reduce((sum, cat) => sum + cat.items.length, 0);
    const meta = $("#libMeta");
    if (meta) meta.textContent = `${STATE.cats.length} 类 · ${total} 条`;
  }

  function handleLibraryClick(event) {
    const toggle = event.target.closest("[data-toggle]");
    if (toggle) {
      const cat = STATE.cats.find((c) => c.id === toggle.dataset.toggle);
      if (!cat) return;
      const enabledCount = STATE.cats.filter((c) => c.enabled).length;
      if (cat.enabled && enabledCount === 1) {
        toast("至少保留一个类别，否则组合不出提示词");
        return;
      }
      cat.enabled = !cat.enabled;
      toggle.classList.toggle("is-on", cat.enabled);
      toggle.setAttribute("aria-checked", String(cat.enabled));
      const block = toggle.closest(".lib-block");
      if (block) block.classList.toggle("is-off", !cat.enabled);
      toast(cat.enabled ? `已启用「${cat.name}」类别` : `已关闭「${cat.name}」类别`);
      return;
    }

    const chip = event.target.closest(".lib-chip");
    if (!chip) return;
    const cat = STATE.cats.find((c) => c.id === chip.dataset.cat);
    if (!cat) return;
    const item = cat.items[Number(chip.dataset.index)];
    if (!item) return;
    if (STATE.locks[cat.id] === item) {
      delete STATE.locks[cat.id];
      chip.classList.remove("is-locked");
      chip.setAttribute("aria-pressed", "false");
      toast(`已取消锁定「${item.zh}」`);
    } else {
      STATE.locks[cat.id] = item;
      $$(`.lib-chip[data-cat="${cat.id}"]`).forEach((el) => {
        const same = el === chip;
        el.classList.toggle("is-locked", same);
        el.setAttribute("aria-pressed", String(same));
      });
      toast(`已锁定「${item.zh}」，下次组合优先使用`);
    }
  }

  /* ---------------------------------------------------------
     Prompt composing
     --------------------------------------------------------- */

  function composePicks() {
    const picks = {};
    STATE.cats.forEach((cat) => {
      if (!cat.enabled) return;
      picks[cat.id] = STATE.locks[cat.id] || pick(cat.items);
    });
    STATE.picks = picks;

    if (STATE.identity) {
      const region = pick(REGIONS);
      const gender = pick(GENDERS);
      STATE.identityInfo = { region, gender, age: randInt(18, 49) };
    } else {
      STATE.identityInfo = null;
    }
  }

  function buildPrompt(picks, identityInfo) {
    const zh = [];
    const en = [];
    if (identityInfo) {
      zh.push(identityInfo.region.zh, `${identityInfo.age}岁`, identityInfo.gender.zh);
      en.push(identityInfo.region.en, `${identityInfo.age} years old`, identityInfo.gender.en);
    }
    STATE.cats.forEach((cat) => {
      const item = picks[cat.id];
      if (!item) return;
      zh.push(item.zh);
      en.push(item.en);
    });
    return { zh: zh.join("，"), en: en.join(", ") };
  }

  function readPrompt() {
    return {
      zh: ($("#promptZh")?.value || "").trim(),
      en: ($("#promptEn")?.value || "").trim()
    };
  }

  function updateMeta() {
    const prompt = readPrompt();
    const tokens = estimateTokens(prompt.zh, prompt.en);
    const pill = $("#tokenPill");
    if (pill) pill.textContent = `≈ ${tokens} tokens`;

    const meta = $("#promptMeta");
    if (meta) {
      let identityText;
      if (STATE.identityInfo) {
        identityText = `身份：${STATE.identityInfo.region.zh} · ${STATE.identityInfo.age} 岁 · ${STATE.identityInfo.gender.zh}`;
      } else {
        identityText = "人物身份已关闭 · 不含年龄 / 地区 / 性别";
      }
      const polishText = STATE.polished
        ? `AI 润色 · ${STATE.lang === "both" ? "中 + 英" : STATE.lang === "zh" ? "仅中文" : "仅英文"}`
        : STATE.optimized
        ? "模板优化 · 已套用"
        : "尚未润色";
      meta.innerHTML = `<span class="meta-dot"></span><span>${identityText}</span><span class="meta-sep"></span><span>${polishText}</span>`;
    }
  }

  function setPrompt(prompt, animate) {
    STATE.prompt = { zh: prompt.zh, en: prompt.en };
    const zhEl = $("#promptZh");
    const enEl = $("#promptEn");
    const token = ++STATE.typeToken;

    if (!zhEl || !enEl) return Promise.resolve();

    if (!animate || reduceMotion) {
      zhEl.value = prompt.zh;
      enEl.value = prompt.en;
      updateMeta();
      return Promise.resolve();
    }

    const duration = Math.min(520, 220 + Math.max(prompt.zh.length, prompt.en.length) * 2.4);
    const start = performance.now();
    return new Promise((resolve) => {
      function frame(now) {
        if (token !== STATE.typeToken) {
          resolve();
          return;
        }
        const k = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        zhEl.value = prompt.zh.slice(0, Math.ceil(prompt.zh.length * eased));
        enEl.value = prompt.en.slice(0, Math.ceil(prompt.en.length * eased));
        if (k < 1) {
          requestAnimationFrame(frame);
        } else {
          zhEl.value = prompt.zh;
          enEl.value = prompt.en;
          updateMeta();
          resolve();
        }
      }
      requestAnimationFrame(frame);
    });
  }

  async function randomize(options) {
    if (STATE.busy) {
      toast("正在生成，稍等一下再组合");
      return;
    }
    composePicks();
    STATE.optimized = false;
    STATE.polished = false;
    const prompt = buildPrompt(STATE.picks, STATE.identityInfo);
    await setPrompt(prompt, !(options && options.silent));
    updateMeta();

    // Locks are one-shot.
    if (Object.keys(STATE.locks).length) {
      STATE.locks = {};
      $$(".lib-chip.is-locked").forEach((el) => {
        el.classList.remove("is-locked");
        el.setAttribute("aria-pressed", "false");
      });
    }
    if (!(options && options.silent)) {
      toast("已从开启的类别中组合一组提示词");
    }
  }

  /* ---------------------------------------------------------
     Polish
     --------------------------------------------------------- */

  function applyTemplates() {
    const base = readPrompt();
    if (!base.zh && !base.en) {
      toast("先随机组合一句提示词，再套用模板");
      return;
    }
    const active = TEMPLATE_GROUPS.filter((group) => !group.person || STATE.identityInfo);
    const skipped = TEMPLATE_GROUPS.length - active.length;

    const zhParts = active.map((group) => group.zh);
    const enParts = active.map((group) => group.en);
    const zh = `${base.zh.replace(/[。.\s]+$/, "")}。${zhParts.join("，")}`;
    const en = `${base.en.replace(/[.\s]+$/, "")}. ${enParts.join(", ")}`;
    STATE.optimized = true;
    STATE.polished = false;
    setPrompt({ zh, en }, true);
    updateMeta();
    toast(skipped ? `已套用模板，跳过 ${skipped} 组人物相关模板` : "已套用画面、皮肤与画质模板");
  }

  async function aiPolish(options) {
    if (!STATE.ai) {
      toast("请先打开 AI 润色开关");
      return;
    }
    if (STATE.polishing || STATE.busy) {
      toast("正在处理，稍等一下");
      return;
    }
    const base = readPrompt();
    if (!base.zh && !base.en) {
      toast("先随机组合一句提示词，再交给 AI 润色");
      return;
    }

    const run = STATE.runId;
    STATE.polishing = true;
    const button = $("#btnAI");
    const original = button ? button.innerHTML : "";
    if (button) {
      button.disabled = true;
      button.classList.add("is-busy");
      button.innerHTML = `<svg class="icon spin"><use href="#i-sparkles"/></svg>润色中…`;
    }
    if (!(options && options.silent)) toast("AI 正在润色（演示，不会调用真实接口）");

    await wait(1250);
    if (run !== STATE.runId) {
      STATE.polishing = false;
      return;
    }

    const sceneName = STATE.picks && STATE.picks.scene ? STATE.picks.scene.zh : "山水";
    const mood = SCENE_MOODS[sceneName] || SCENE_MOODS["山水"];
    const cleanZh = base.zh.replace(/[。\s]+$/, "");
    const cleanEn = base.en.replace(/[.\s]+$/, "");

    let zh = base.zh;
    let en = base.en;
    if (STATE.lang === "both") {
      zh = `${cleanZh}。${mood.zh}，画面层次清晰，质感细腻`;
      en = `${cleanEn}. ${mood.en}, with clear depth and delicate texture`;
    } else if (STATE.lang === "zh") {
      zh = `${cleanZh}。${mood.zh}，画面层次清晰，质感细腻`;
    } else {
      en = `${cleanEn}. ${mood.en}, with clear depth and delicate texture`;
    }

    STATE.polished = true;
    STATE.optimized = false;
    await setPrompt({ zh, en }, true);
    updateMeta();

    if (button) {
      button.disabled = !STATE.ai;
      button.classList.remove("is-busy");
      button.innerHTML = original;
    }
    STATE.polishing = false;
    if (!(options && options.silent)) {
      toast(STATE.lang === "zh" ? "仅中文润色完成（演示）" : STATE.lang === "en" ? "仅英文润色完成（演示）" : "中英文润色完成（演示）");
    }
  }

  /* ---------------------------------------------------------
     Gallery
     --------------------------------------------------------- */

  function sizeRatio(size) {
    const { w, h } = parseSize(size);
    return h / w;
  }

  function makeCard(data) {
    const scene = sceneByName(data.scene || "山水");
    const ratio = sizeRatio(data.size);
    const variants = ART_VARIANTS[scene.art] || [scene.pal];
    const pal = data.sample ? scene.pal : variants[Math.abs(Number(data.seed)) % variants.length];
    return {
      id: STATE.nextId++,
      scene: scene.zh,
      size: data.size,
      seed: Number(data.seed),
      zh: data.zh,
      en: data.en,
      sample: !!data.sample,
      svg: artSVG(scene.art || "dune", pal, Number(data.seed), ratio)
    };
  }

  function seedSamples() {
    STATE.gallery = [];
    STATE.nextId = 1;
    SAMPLE_PROMPTS.forEach((prompt) => {
      STATE.gallery.push(makeCard({ ...prompt, sample: true }));
    });
    renderGallery();
  }

  function renderGallery() {
    const gallery = $("#gallery");
    if (!gallery) return;
    const count = $("#galleryCount");
    if (count) count.textContent = `${STATE.gallery.length} 张`;

    if (!STATE.gallery.length) {
      gallery.classList.add("is-empty");
      gallery.innerHTML = `<div class="gallery-empty">画廊还是空的 · 点击「开始生图」生成第一张演示图</div>`;
      return;
    }

    gallery.classList.remove("is-empty");
    gallery.innerHTML = STATE.gallery
      .map((card) => {
        const { w, h } = parseSize(card.size);
        return `
        <figure class="art-card" data-id="${card.id}" tabindex="0" role="button" aria-label="查看「${escapeHTML(card.scene)}」图片，尺寸 ${card.size}">
          <div class="art-frame" style="aspect-ratio:${w} / ${h}">${card.svg}</div>
          <span class="art-index">#${String(card.id).padStart(2, "0")}</span>
          ${card.sample ? '<span class="art-sample">示例</span>' : ""}
          <div class="art-actions">
            <button type="button" data-act="download" aria-label="下载这张演示图"><svg class="icon"><use href="#i-download"/></svg></button>
            <button type="button" data-act="delete" aria-label="删除这张图片"><svg class="icon"><use href="#i-trash"/></svg></button>
          </div>
          <figcaption class="art-bar"><span>${escapeHTML(card.scene)}</span><span>${card.size}</span></figcaption>
        </figure>`;
      })
      .join("");
  }

  function findCard(id) {
    return STATE.gallery.find((card) => card.id === Number(id));
  }

  function downloadCard(card) {
    if (!card) return;
    try {
      const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${card.svg}`], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prompt-generator-${card.seed}.svg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast("已下载 SVG 演示图");
    } catch (err) {
      toast("下载失败，请重试");
    }
  }

  function deleteCard(id) {
    const index = STATE.gallery.findIndex((card) => card.id === Number(id));
    if (index === -1) return;
    STATE.gallery.splice(index, 1);
    renderGallery();
    toast("已从演示画廊移除");
  }

  let activeCardId = null;

  function openLightbox(card) {
    const dialog = $("#lightbox");
    if (!dialog || !card) return;
    activeCardId = card.id;
    $("#lbArt").innerHTML = card.svg.replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"');
    $("#lbTitle").textContent = card.scene;
    $("#lbSize").textContent = card.size.replace("×", " × ");
    $("#lbSeed").textContent = `seed ${card.seed}`;
    $("#lbPrompt").textContent = card.zh + (card.en ? `\n\n${card.en}` : "");
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeLightbox() {
    const dialog = $("#lightbox");
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    activeCardId = null;
  }

  /* ---------------------------------------------------------
     Generation simulation
     --------------------------------------------------------- */

  function logLine(message, className) {
    const log = $("#genLog");
    if (!log) return;
    const p = document.createElement("p");
    if (className) p.className = className;
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function clearLog() {
    const log = $("#genLog");
    if (log) log.innerHTML = "";
  }

  function setProgress(pct, label) {
    const bar = $("#genBar");
    const pctEl = $("#genPct");
    const status = $("#genStatus");
    if (bar) bar.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${Math.round(pct)}%`;
    if (status && label) status.textContent = label;
  }

  function setQueueState(text) {
    const el = $(".queue-state");
    if (el) el.innerHTML = `<i></i>${text}`;
  }

  async function generate() {
    if (STATE.busy) return;
    const prompt = readPrompt();
    if (!prompt.zh && !prompt.en) {
      toast("先组合或写一句提示词，再开始生图");
      return;
    }

    const run = STATE.runId;
    const n = STATE.batch;
    const size = STATE.size;
    const baseSeed = Number(formatSeed($("#seed")?.value || STATE.seed)) || STATE.seed;
    const sceneName = STATE.picks && STATE.picks.scene ? STATE.picks.scene.zh : "山水";
    const snapshot = { ...prompt };

    STATE.busy = true;
    STATE.seed = baseSeed;
    const button = $("#btnGenerate");
    const label = $("#btnGenerate span");
    if (button) button.disabled = true;
    if (label) label.textContent = "生成中…";
    setQueueState("生成中");
    clearLog();
    setProgress(2, "准备提示词");

    const started = performance.now();
    const timed = (msg, cls) => {
      const t = ((performance.now() - started) / 1000).toFixed(1);
      logLine(`[${t}s] ${msg}`, cls);
    };

    timed(`载入工作流「${STATE.workflow}」`, "log-info");
    await wait(320);
    if (run !== STATE.runId) return;

    setProgress(12, "写入 CLIPTextEncode");
    timed(`写入 ${snapshot.zh ? "2" : "1"} 条提示词 · ${size}`, "log-info");
    await wait(280);
    if (run !== STATE.runId) return;

    const sampleSteps = [22, 34, 46, 58, 70, 82, 92];
    for (let i = 0; i < sampleSteps.length; i++) {
      const pct = sampleSteps[i];
      const step = Math.round(((i + 1) / sampleSteps.length) * 25);
      setProgress(pct, `采样 ${step} / 25`);
      if (i === 2) timed(`采样中 · seed ${baseSeed} · 25 steps`, "log-info");
      await wait(i === sampleSteps.length - 1 ? 300 : 190);
      if (run !== STATE.runId) return;
    }

    setProgress(97, "VAE 解码");
    timed("VAE 解码 · 写入画廊", "log-info");
    await wait(340);
    if (run !== STATE.runId) return;

    const newCards = [];
    for (let i = 0; i < n; i++) {
      const seed = Number(String(baseSeed + i * 1013).slice(-9));
      newCards.push(
        makeCard({
          scene: sceneName,
          size,
          seed,
          zh: snapshot.zh,
          en: snapshot.en,
          sample: false
        })
      );
    }
    STATE.gallery = [...newCards, ...STATE.gallery].slice(0, 16);
    renderGallery();

    setProgress(100, `完成 · ${n} 张`);
    setQueueState("就绪");
    timed(`完成 · ${n} 张 · 总计 ${((performance.now() - started) / 1000).toFixed(1)}s`, "log-ok");
    toast(`已生成 ${n} 张演示图`);

    if (label) label.textContent = "开始生图";
    if (button) button.disabled = false;
    STATE.busy = false;
  }

  async function autoDemo() {
    if (STATE.autoRunning || STATE.busy) return;
    STATE.autoRunning = true;
    const button = $("#btnAuto");
    const original = button ? button.innerHTML : "";
    if (button) {
      button.disabled = true;
      button.innerHTML = `<svg class="icon spin"><use href="#i-play"/></svg>演示中…`;
    }

    await randomize({ silent: true });
    await wait(420);
    if (STATE.ai) {
      await aiPolish({ silent: true });
      await wait(300);
    }
    await generate();

    STATE.autoRunning = false;
    if (button) {
      button.disabled = false;
      button.innerHTML = original;
    }
  }

  /* ---------------------------------------------------------
     Reset
     --------------------------------------------------------- */

  function resetDemo(options) {
    STATE.runId++;
    STATE.busy = false;
    STATE.polishing = false;
    STATE.autoRunning = false;
    STATE.cats = CATEGORIES.map((cat) => ({ ...cat, enabled: true }));
    STATE.locks = {};
    STATE.identity = true;
    STATE.ai = true;
    STATE.lang = "both";
    STATE.batch = 2;
    STATE.size = "1024×1024";
    STATE.workflow = "Flux · 写实人像";
    STATE.seed = 438892078;
    STATE.picks = null;
    STATE.optimized = false;
    STATE.polished = false;
    STATE.identityInfo = null;
    STATE.nextId = 1;

    renderLibrary();
    seedSamples();

    const identitySwitch = $("#identitySwitch");
    if (identitySwitch) {
      identitySwitch.classList.add("is-on");
      identitySwitch.setAttribute("aria-checked", "true");
    }
    const aiSwitch = $("#aiSwitch");
    if (aiSwitch) {
      aiSwitch.classList.add("is-on");
      aiSwitch.setAttribute("aria-checked", "true");
    }
    const mini = $("#miniIdentity");
    if (mini) {
      mini.classList.add("is-on");
      mini.setAttribute("aria-checked", "true");
    }
    const idVisual = $("#idVisual");
    if (idVisual) idVisual.classList.remove("off");

    $$(".seg-btn").forEach((btn) => {
      const active = btn.dataset.lang === "both";
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    const batchVal = $("#batchVal");
    if (batchVal) batchVal.textContent = "2";
    const size = $("#size");
    if (size) size.value = "1024×1024";
    const workflow = $("#workflow");
    if (workflow) workflow.value = "Flux · 写实人像";
    const seed = $("#seed");
    if (seed) seed.value = "438892078";

    const generateBtn = $("#btnGenerate");
    if (generateBtn) {
      generateBtn.disabled = false;
      const span = generateBtn.querySelector("span");
      if (span) span.textContent = "开始生图";
      const em = generateBtn.querySelector("em");
      if (em) em.textContent = "2 张";
    }
    const aiBtn = $("#btnAI");
    if (aiBtn) {
      aiBtn.disabled = false;
      aiBtn.classList.remove("is-muted");
      aiBtn.innerHTML = `<svg class="icon"><use href="#i-sparkles"/></svg>AI 润色`;
    }
    const autoBtn = $("#btnAuto");
    if (autoBtn) {
      autoBtn.disabled = false;
      autoBtn.innerHTML = `<svg class="icon"><use href="#i-play"/></svg>自动演示`;
    }

    clearLog();
    logLine("◦ 演示环境就绪 · 已连接模拟 ComfyUI", "log-muted");
    setProgress(0, "等待任务");
    setQueueState("就绪");

    const initial = SAMPLE_PROMPTS[0];
    STATE.prompt = { zh: initial.zh, en: initial.en };
    STATE.identityInfo = { region: REGIONS[0], gender: GENDERS[0], age: 25 };
    STATE.picks = initialPicks();
    const zhEl = $("#promptZh");
    const enEl = $("#promptEn");
    if (zhEl) zhEl.value = initial.zh;
    if (enEl) enEl.value = initial.en;
    updateMeta();

    if (!(options && options.silent)) toast("演示已重置");
  }

  /* ---------------------------------------------------------
     Gantt chart
     --------------------------------------------------------- */

  const MAX_SECONDS = 138;

  function buildGantt() {
    const gantt = $("#gantt");
    if (!gantt) return;

    const data = {
      serial: {
        polish: [0, 23, 46, 69, 92, 115],
        render: [8, 31, 54, 77, 100, 123]
      },
      pipeline: {
        polish: [0, 15, 30, 45, 60, 75],
        render: [8, 23, 38, 53, 68, 83]
      }
    };

    let order = 0;
    $$(".gantt-panel", gantt).forEach((panel) => {
      const mode = panel.dataset.mode;
      const conf = data[mode];
      if (!conf) return;
      const polishLane = $('[data-lane="polish"]', panel);
      const renderLane = $('[data-lane="render"]', panel);
      if (polishLane) {
        polishLane.innerHTML = conf.polish
          .map((start, i) => {
            order += 1;
            return `<span class="gp-bar polish" style="left:${(start / MAX_SECONDS) * 100}%;width:${(8 / MAX_SECONDS) * 100}%;--i:${order}" title="第 ${i + 1} 组 · 润色 8s"></span>`;
          })
          .join("");
      }
      if (renderLane) {
        renderLane.innerHTML = conf.render
          .map((start, i) => {
            order += 1;
            return `<span class="gp-bar render" style="left:${(start / MAX_SECONDS) * 100}%;width:${(15 / MAX_SECONDS) * 100}%;--i:${order}" title="第 ${i + 1} 组 · 生图 15s"></span>`;
          })
          .join("");
      }
    });

    gantt.classList.add("is-paused");
  }

  function replayGantt() {
    const gantt = $("#gantt");
    if (!gantt) return;
    const button = $("#btnReplay");
    if (button && button.disabled) return;

    const original = button ? button.innerHTML : "";
    if (button) {
      button.disabled = true;
      button.innerHTML = `<svg class="icon spin"><use href="#i-refresh"/></svg>重播中…`;
    }

    gantt.classList.remove("is-paused");
    const bars = $$(".gp-bar", gantt);
    bars.forEach((bar) => {
      bar.style.animation = "none";
    });
    void gantt.offsetHeight;
    bars.forEach((bar) => {
      bar.style.animation = "";
    });
    gantt.classList.add("is-replaying");

    const rect = gantt.getBoundingClientRect();
    if (rect.top < 80 || rect.bottom > window.innerHeight - 20) {
      const top = Math.max(0, rect.top + window.scrollY - 100);
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    }

    clearTimeout(replayGantt._timer);
    replayGantt._timer = setTimeout(() => {
      gantt.classList.remove("is-replaying");
      if (button) {
        button.disabled = false;
        button.innerHTML = original;
      }
    }, 2100);
  }

  function goToDemo(kind) {
    const isTemplates = kind === "templates";
    const target = isTemplates ? $("#btnPolish") : $(".lib-col");
    const scrollTarget = isTemplates ? $(".prompt-col") : target;
    if (!target || !scrollTarget) return;

    target.classList.add("demo-highlight");
    const top = Math.max(0, scrollTarget.getBoundingClientRect().top + window.scrollY - 96);
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });

    clearTimeout(goToDemo._timer);
    goToDemo._timer = setTimeout(() => {
      target.classList.remove("demo-highlight");
    }, 3000);

    toast(
      isTemplates
        ? "已定位到提示词区：点「模板优化」即可套用画面、皮肤与画质模板"
        : "已定位到词条库：开关类别，或点选词条锁定下一次组合"
    );
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */

  function initNavigation() {
    const nav = $(".site-nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initTheme() {
    const toggle = $("#themeToggle");
    if (!toggle) return;
    setTheme(document.documentElement.dataset.theme || "light", false);
    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next, true);
    });
  }

  function initDemo() {
    const initial = SAMPLE_PROMPTS[0];
    STATE.prompt = { zh: initial.zh, en: initial.en };
    STATE.identityInfo = { region: REGIONS[0], gender: GENDERS[0], age: 25 };
    STATE.picks = initialPicks();
    const zhEl = $("#promptZh");
    const enEl = $("#promptEn");
    if (zhEl) zhEl.value = initial.zh;
    if (enEl) enEl.value = initial.en;

    renderLibrary();
    seedSamples();
    updateMeta();
    buildGantt();
    setProgress(0, "等待任务");

    $("#library")?.addEventListener("click", handleLibraryClick);

    $("#btnRandom")?.addEventListener("click", () => randomize());
    $("#btnPolish")?.addEventListener("click", applyTemplates);
    $("#btnAI")?.addEventListener("click", () => aiPolish());
    $("#btnCopyZh")?.addEventListener("click", () => copyText($("#promptZh")?.value || "", "已复制中文提示词"));
    $("#btnCopyEn")?.addEventListener("click", () => copyText($("#promptEn")?.value || "", "已复制英文提示词"));
    $("#btnGenerate")?.addEventListener("click", generate);
    $("#btnAuto")?.addEventListener("click", autoDemo);
    $("#btnReset")?.addEventListener("click", () => resetDemo());
    $("#btnClearGallery")?.addEventListener("click", () => {
      if (!STATE.gallery.length) {
        toast("画廊已经是空的");
        return;
      }
      STATE.gallery = [];
      renderGallery();
      toast("已清空演示画廊");
    });

    $("#promptZh")?.addEventListener("input", updateMeta);
    $("#promptEn")?.addEventListener("input", updateMeta);

    $$(".seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        STATE.lang = btn.dataset.lang;
        $$(".seg-btn").forEach((el) => {
          const active = el === btn;
          el.classList.toggle("is-active", active);
          el.setAttribute("aria-pressed", String(active));
        });
        updateMeta();
        const label = STATE.lang === "both" ? "中 + 英" : STATE.lang === "zh" ? "仅中文" : "仅英文";
        toast(`润色语言：${label}${STATE.lang === "both" ? "" : " · 更省 Token"}`);
      });
    });

    $("#aiSwitch")?.addEventListener("click", (event) => {
      STATE.ai = !STATE.ai;
      event.currentTarget.classList.toggle("is-on", STATE.ai);
      event.currentTarget.setAttribute("aria-checked", String(STATE.ai));
      const aiBtn = $("#btnAI");
      if (aiBtn) {
        aiBtn.disabled = !STATE.ai;
        aiBtn.classList.toggle("is-muted", !STATE.ai);
      }
      toast(STATE.ai ? "AI 润色已开启" : "AI 润色已关闭，可只使用模板优化");
    });

    $("#identitySwitch")?.addEventListener("click", (event) => {
      STATE.identity = !STATE.identity;
      event.currentTarget.classList.toggle("is-on", STATE.identity);
      event.currentTarget.setAttribute("aria-checked", String(STATE.identity));
      STATE.optimized = false;
      STATE.polished = false;

      if (STATE.identity) {
        const region = pick(REGIONS);
        const gender = pick(GENDERS);
        STATE.identityInfo = { region, gender, age: randInt(18, 49) };
      } else {
        STATE.identityInfo = null;
      }
      if (STATE.picks) {
        const prompt = buildPrompt(STATE.picks, STATE.identityInfo);
        setPrompt(prompt, true);
      }
      updateMeta();
      toast(STATE.identity ? "人物身份已开启，会加入年龄、地区、性别" : "人物身份已关闭，本次生成不含人物描述");
    });

    $("#miniIdentity")?.addEventListener("click", (event) => {
      const visual = $("#idVisual");
      const on = event.currentTarget.getAttribute("aria-checked") !== "true";
      event.currentTarget.setAttribute("aria-checked", String(on));
      event.currentTarget.classList.toggle("is-on", on);
      visual?.classList.toggle("off", !on);
    });

    $("#batchMinus")?.addEventListener("click", () => {
      STATE.batch = Math.max(1, STATE.batch - 1);
      const el = $("#batchVal");
      if (el) el.textContent = String(STATE.batch);
      const gen = $("#genCount");
      if (gen) gen.textContent = `${STATE.batch} 张`;
    });
    $("#batchPlus")?.addEventListener("click", () => {
      STATE.batch = Math.min(4, STATE.batch + 1);
      const el = $("#batchVal");
      if (el) el.textContent = String(STATE.batch);
      const gen = $("#genCount");
      if (gen) gen.textContent = `${STATE.batch} 张`;
    });

    $("#btnSeed")?.addEventListener("click", () => {
      const seed = randInt(100000000, 999999999);
      STATE.seed = seed;
      const input = $("#seed");
      if (input) input.value = String(seed);
      toast(`已换种子 ${seed}`);
    });

    $("#seed")?.addEventListener("input", (event) => {
      event.target.value = event.target.value.replace(/[^\d]/g, "").slice(0, 12);
    });

    $("#workflow")?.addEventListener("change", (event) => {
      STATE.workflow = event.target.value;
    });
    $("#size")?.addEventListener("change", (event) => {
      STATE.size = event.target.value;
    });

    $("#gallery")?.addEventListener("click", (event) => {
      const cardEl = event.target.closest(".art-card");
      if (!cardEl) return;
      const card = findCard(cardEl.dataset.id);
      if (!card) return;
      const action = event.target.closest("[data-act]");
      if (action) {
        event.stopPropagation();
        if (action.dataset.act === "download") downloadCard(card);
        if (action.dataset.act === "delete") deleteCard(card.id);
        return;
      }
      openLightbox(card);
    });

    $("#gallery")?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest("button")) return;
      const cardEl = event.target.closest(".art-card");
      if (!cardEl) return;
      event.preventDefault();
      const card = findCard(cardEl.dataset.id);
      if (card) openLightbox(card);
    });

    $("#lbClose")?.addEventListener("click", closeLightbox);
    $("#lightbox")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeLightbox();
    });
    $("#lbDownload")?.addEventListener("click", () => {
      const card = findCard(activeCardId);
      if (card) downloadCard(card);
    });
    $("#lbDelete")?.addEventListener("click", () => {
      if (!activeCardId) return;
      const id = activeCardId;
      closeLightbox();
      deleteCard(id);
    });

    $("#btnCopyCmd")?.addEventListener("click", () => {
      const command = `git clone https://github.com/git-squirrel/prompt-generator.git\ncd prompt-generator\npython start_server.py`;
      copyText(command, "启动命令已复制").then(() => {
        const span = $("#btnCopyCmd span");
        if (!span) return;
        const old = span.textContent;
        span.textContent = "已复制";
        setTimeout(() => (span.textContent = old), 1600);
      });
    });

    $("#btnReplay")?.addEventListener("click", replayGantt);
    $("#pipelineTitle")?.addEventListener("click", (event) => {
      event.preventDefault();
      replayGantt();
    });

    $$("[data-demo-jump]").forEach((card) => {
      const activate = (event) => {
        if (event.target.closest("a, button")) return;
        goToDemo(card.dataset.demoJump);
      };
      card.addEventListener("click", activate);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        goToDemo(card.dataset.demoJump);
      });
    });
  }

  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }

    const targets = [
      ".hero-copy",
      ".hero-visual",
      ".hero-stats",
      ".flow-step",
      ".section-head",
      ".demo-shell",
      ".bento-card",
      ".feature-list",
      ".pipeline-copy",
      ".pipeline-chart",
      ".security-card",
      ".start-step",
      ".start-terminal",
      ".start-callouts",
      ".cta-inner"
    ];
    targets.forEach((selector) => {
      $$(selector).forEach((el, i) => {
        el.classList.add("reveal");
        if (selector === ".bento-card" || selector === ".flow-step" || selector === ".start-step") {
          el.style.transitionDelay = `${Math.min(i * 55, 220)}ms`;
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
            if (entry.target.id === "gantt" || entry.target.querySelector?.("#gantt")) {
              entry.target.querySelector?.(".gantt")?.classList.remove("is-paused");
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    $$(".reveal").forEach((el) => observer.observe(el));

    // Safety net: never leave content permanently hidden if IntersectionObserver
    // misses an element (older engines, programmatic scrolling, print).
    setTimeout(() => {
      $$(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    }, 6000);

    const gantt = $("#gantt");
    if (gantt) {
      const ganttObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gantt.classList.remove("is-paused");
              ganttObserver.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      ganttObserver.observe(gantt);
    }
  }

  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.count) || 0;
          const start = performance.now();
          const duration = 900;
          function tick(now) {
            const k = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - k, 3);
            el.textContent = String(Math.round(target * eased));
            if (k < 1) requestAnimationFrame(tick);
            else el.textContent = String(target);
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        if (link.hasAttribute("data-no-smooth")) return;
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }

  function init() {
    hydrateStaticArt();
    initTheme();
    initNavigation();
    initDemo();
    initReveal();
    initCounters();
    initSmoothAnchors();

    // Make the demo buttons reflect the AI switch state on first paint.
    const aiBtn = $("#btnAI");
    if (aiBtn) aiBtn.classList.toggle("is-muted", !STATE.ai);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
