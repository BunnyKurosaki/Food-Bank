import { useState, useEffect, useRef } from "react";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const buildCSS = (colors) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: ${colors.pageBg};
    --card: ${colors.cardBg};
    --primary: ${colors.primary};
    --primary-dark: ${colors.primaryDark};
    --secondary: ${colors.secondary};
    --text: ${colors.text};
    --muted: ${colors.muted};
    --border: ${colors.border};
    --radius: 14px;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 48px rgba(0,0,0,0.14);
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
  .display { font-family: 'Playfair Display', serif; }

  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 5vw; height: 64px; background: ${colors.navBg}; backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); transition: box-shadow .3s; }
  .navbar.scrolled { box-shadow: var(--shadow); }
  .navbar-logo { font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 900; color: var(--primary); cursor: pointer; }
  .navbar-logo span { color: var(--secondary); }
  .navbar-links { display: flex; align-items: center; gap: 8px; }
  .nav-link { background: none; border: none; font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 500; color: var(--muted); cursor: pointer; padding: 6px 12px; border-radius: 8px; transition: color .2s, background .2s; }
  .nav-link:hover { color: var(--text); background: var(--border); }
  .nav-btn { background: var(--primary); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 600; cursor: pointer; padding: 8px 20px; border-radius: 8px; transition: background .2s, transform .15s; }
  .nav-btn:hover { background: var(--primary-dark); transform: translateY(-1px); }
  @media (max-width: 600px) { .navbar-links .nav-link { display: none; } }

  .btn { display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 1rem; border: none; border-radius: 10px; padding: 14px 28px; cursor: pointer; transition: all .2s; text-decoration: none; }
  .btn-primary { background: var(--primary); color: #fff; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 6px 20px color-mix(in srgb, var(--primary) 40%, transparent); }
  .btn-outline { background: rgba(255,255,255,0.12); color: #fff; border: 1.5px solid rgba(255,255,255,0.35); }
  .btn-outline:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }
  .btn-secondary { background: var(--secondary); color: var(--text); }
  .btn-secondary:hover { background: var(--secondary); filter: brightness(0.9); transform: translateY(-2px); }
  .btn-ghost { background: transparent; color: var(--muted); }
  .btn-ghost:hover { background: var(--border); color: var(--text); }
  .btn-danger { background: #fee2e2; color: #991b1b; }
  .btn-danger:hover { background: #fecaca; }
  .btn-sm { padding: 9px 18px; font-size: .875rem; }
  .btn-lg { padding: 16px 36px; font-size: 1.1rem; }

  .hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .hero-img { position: absolute; inset: 0; z-index: 0; background-size: cover; background-position: center; }
  .hero-img::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.55); }
  .hero-grain { position: absolute; inset: 0; z-index: 1; opacity: .22; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px; }
  .hero-content { position: relative; z-index: 2; text-align: center; padding: 0 5vw; max-width: 860px; }
  .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); color: var(--secondary); font-size: .8rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 6px 14px; border-radius: 50px; margin-bottom: 28px; }
  .hero-tag .dot { width: 6px; height: 6px; background: var(--secondary); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  .hero-h1 { font-size: clamp(3rem,8vw,6rem); font-weight: 900; color: #fff; line-height: 1.05; margin-bottom: 24px; }
  .hero-h1 em { color: var(--secondary); font-style: normal; }
  .hero-sub { font-size: clamp(.95rem,2vw,1.2rem); color: rgba(255,255,255,0.75); max-width: 560px; margin: 0 auto 40px; }
  .hero-cta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .hero-scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(255,255,255,0.4); font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; }
  .hero-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent); animation: scrollLine 2s ease-in-out infinite; }
  @keyframes scrollLine { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }

  .stats { background: var(--card); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .stats-inner { max-width: 900px; margin: 0 auto; padding: 56px 5vw; display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .stat-item { text-align: center; padding: 24px; position: relative; }
  .stat-item:not(:last-child)::after { content:''; position:absolute; right:0; top:20%; bottom:20%; width:1px; background:var(--border); }
  .stat-val { font-size: clamp(2.4rem,5vw,3.5rem); font-weight: 900; color: var(--primary); line-height: 1; }
  .stat-label { margin-top: 8px; color: var(--muted); font-size: .9rem; }
  @media(max-width:600px){ .stats-inner{grid-template-columns:1fr} .stat-item:not(:last-child)::after{display:none} }

  .section { padding: 100px 5vw; }
  .section-label { font-size:.75rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--primary); margin-bottom:12px; }
  .section-title { font-size:clamp(2rem,4vw,3rem); font-weight:900; line-height:1.15; margin-bottom:16px; }
  .section-sub { color:var(--muted); font-size:1.05rem; max-width:520px; }
  .section-header { margin-bottom:60px; }
  .section-header.center { text-align:center; }
  .section-header.center .section-sub { margin:0 auto; }

  .steps-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:28px; max-width:1100px; margin:0 auto; }
  .step-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:32px 28px; text-align:center; transition:transform .25s,box-shadow .25s; position:relative; overflow:hidden; }
  .step-num { position:absolute; top:10px; right:16px; font-size:3.5rem; font-weight:900; color:var(--border); line-height:1; pointer-events:none; user-select:none; font-family:'Playfair Display',serif; }
  .step-card:hover { transform:translateY(-6px); box-shadow:var(--shadow-lg); }
  .step-icon { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,var(--primary),var(--primary-dark)); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
  .step-icon svg { width:26px; height:26px; stroke:#fff; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  .step-title { font-size:1.2rem; font-weight:700; margin-bottom:10px; }
  .step-desc { font-size:.9rem; color:var(--muted); line-height:1.65; }

  .impact-section { background: ${colors.impactBg}; color: #fff; }
  .impact-section .section-title { color: #fff; }
  .impact-section .section-label { color: var(--secondary); }
  .impact-section .section-sub { color: rgba(255,255,255,0.6); }
  .testimonials { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; max-width:1100px; margin:0 auto; }
  .tcard { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:var(--radius); padding:28px; }
  .tcard-quote { font-size:1rem; color:rgba(255,255,255,0.85); line-height:1.7; margin-bottom:20px; font-style:italic; }
  .tcard-author { display:flex; align-items:center; gap:12px; }
  .tcard-avatar { width:40px; height:40px; border-radius:50%; font-weight:700; font-size:1rem; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0; font-family:'Playfair Display',serif; }
  .tcard-name { font-weight:600; font-size:.9rem; }
  .tcard-role { font-size:.8rem; color:rgba(255,255,255,0.45); margin-top:2px; }

  .cta-band { color:#fff; text-align:center; padding:80px 5vw; background: ${colors.ctaBg}; }
  .cta-band .section-title { color:#fff; margin-bottom:16px; }
  .cta-band p { color:rgba(255,255,255,0.85); margin-bottom:36px; font-size:1.05rem; }

  .footer { background:${colors.footerBg}; color:rgba(255,255,255,0.55); padding:48px 5vw 28px; }
  .footer-inner { max-width:1100px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:28px; margin-bottom:20px; }
  .footer-logo { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:900; color:#fff; }
  .footer-logo span { color:var(--secondary); }
  .footer-links { display:flex; gap:24px; font-size:.85rem; }
  .footer-links a { color:rgba(255,255,255,0.5); text-decoration:none; cursor:pointer; transition:color .2s; }
  .footer-links a:hover { color:#fff; }
  .footer-copy { text-align:center; font-size:.8rem; max-width:1100px; margin:0 auto; }

  .overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn .2s; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background:var(--card); border-radius:20px; width:100%; max-width:480px; padding:40px; position:relative; box-shadow:var(--shadow-lg); animation:slideUp .3s cubic-bezier(.16,1,.3,1); max-height:90vh; overflow-y:auto; }
  @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  .modal-close { position:absolute; top:18px; right:18px; background:var(--bg); border:none; width:34px; height:34px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--muted); transition:background .2s; }
  .modal-close:hover { background:var(--border); }
  .modal-title { font-size:1.8rem; font-weight:900; margin-bottom:6px; }
  .modal-sub { color:var(--muted); font-size:.9rem; margin-bottom:28px; }

  .form-group { margin-bottom:18px; }
  .form-label { display:block; font-size:.82rem; font-weight:600; color:var(--text); margin-bottom:7px; }
  .form-input { width:100%; padding:11px 15px; border:1.5px solid var(--border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.95rem; background:var(--bg); color:var(--text); outline:none; transition:border-color .2s,box-shadow .2s; }
  .form-input:focus { border-color:var(--primary); box-shadow:0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent); }
  .form-input.error { border-color:#e53e3e; }
  .form-error { font-size:.78rem; color:#e53e3e; margin-top:5px; }
  .form-hint { font-size:.78rem; color:var(--muted); margin-top:5px; }
  .form-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a6e62' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; }

  .role-cards { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:22px; }
  .role-card { border:2px solid var(--border); border-radius:12px; padding:18px 16px; cursor:pointer; transition:all .2s; text-align:left; background:none; }
  .role-card:hover { border-color:var(--primary); background:color-mix(in srgb, var(--primary) 5%, transparent); }
  .role-card.active { border-color:var(--primary); background:color-mix(in srgb, var(--primary) 8%, transparent); }
  .role-card-icon { font-size:1.6rem; margin-bottom:8px; }
  .role-card-title { font-weight:700; font-size:.95rem; margin-bottom:4px; color:var(--text); }
  .role-card-desc { font-size:.78rem; color:var(--muted); line-height:1.5; }

  .dashboard { min-height:100vh; }
  .dash-header { background:var(--card); border-bottom:1px solid var(--border); padding:28px 5vw; }
  .dash-header-inner { max-width:1100px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
  .dash-greeting { font-size:1.5rem; font-weight:900; }
  .dash-role-badge { background:var(--primary); color:#fff; font-size:.75rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:4px 12px; border-radius:50px; }
  .dash-main { max-width:1100px; margin:0 auto; padding:40px 5vw; }
  .dash-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:20px; margin-bottom:40px; }
  .dash-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:24px; }
  .dash-card-num { font-size:2.4rem; font-weight:900; color:var(--primary); font-family:'Playfair Display',serif; }
  .dash-card-label { font-size:.85rem; color:var(--muted); margin-top:4px; }
  .dash-section-title { font-size:1.4rem; font-weight:900; margin-bottom:20px; font-family:'Playfair Display',serif; }
  .listing-form { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:28px; margin-bottom:32px; }
  .listing-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media(max-width:500px){ .listing-form-grid{grid-template-columns:1fr} }
  .listings { display:flex; flex-direction:column; gap:14px; }
  .listing-item { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:20px 24px; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; transition:box-shadow .2s; }
  .listing-item:hover { box-shadow:var(--shadow); }
  .listing-info-name { font-weight:700; font-size:1rem; margin-bottom:4px; }
  .listing-info-meta { font-size:.82rem; color:var(--muted); }
  .badge { display:inline-flex; align-items:center; font-size:.72rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; padding:4px 10px; border-radius:50px; }
  .badge-green { background:#dcfce7; color:#166534; }
  .badge-yellow { background:#fef9c3; color:#854d0e; }
  .badge-red { background:#fee2e2; color:#991b1b; }
  .badge-blue { background:#dbeafe; color:#1e40af; }
  .listing-actions { display:flex; gap:8px; }
  .tab-bar { display:flex; gap:4px; background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:4px; margin-bottom:28px; width:fit-content; flex-wrap:wrap; }
  .tab { background:none; border:none; font-family:'DM Sans',sans-serif; font-size:.88rem; font-weight:600; color:var(--muted); padding:8px 18px; border-radius:8px; cursor:pointer; transition:all .2s; }
  .tab.active { background:var(--card); color:var(--text); box-shadow:0 1px 6px rgba(0,0,0,0.08); }
  .empty-state { text-align:center; padding:48px 20px; color:var(--muted); }
  .empty-state p { font-size:.95rem; margin-top:12px; }
  .toast { position:fixed; bottom:28px; right:28px; z-index:9999; background:var(--text); color:#fff; padding:14px 22px; border-radius:12px; font-size:.9rem; font-weight:500; box-shadow:var(--shadow-lg); animation:toastIn .3s cubic-bezier(.16,1,.3,1); max-width:320px; }
  .toast.success::before { content:'✓  '; color:#4ade80; font-weight:800; }
  .toast.error::before { content:'✕  '; color:#f87171; font-weight:800; }
  @keyframes toastIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .divider { display:flex; align-items:center; gap:12px; color:var(--muted); font-size:.82rem; margin:20px 0; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:var(--border); }
  .fade-up { opacity:0; transform:translateY(24px); transition:opacity .6s ease,transform .6s ease; }
  .fade-up.visible { opacity:1; transform:translateY(0); }
  .request-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:20px 24px; margin-bottom:14px; }
  .request-card-top { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:10px; }
  .request-card-title { font-weight:700; }
  .request-card-body { font-size:.88rem; color:var(--muted); }
  .cms-section { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:28px; margin-bottom:24px; }
  .cms-add-btn { background:none; border:2px dashed var(--border); border-radius:10px; width:100%; padding:12px; font-family:'DM Sans',sans-serif; font-size:.88rem; color:var(--muted); cursor:pointer; transition:all .2s; margin-top:8px; }
  .cms-add-btn:hover { border-color:var(--primary); color:var(--primary); }
  .color-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media(max-width:540px){ .color-row{grid-template-columns:1fr} }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=24, color="currentColor" }) => {
  const d = {
    utensils:<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></>,
    heart:<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    shield:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    trending:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    arrow:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    check:<polyline points="20 6 9 18 4 13"/>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    box:<><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    logout:<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    inbox:<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></>,
    upload:<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    palette:<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d[name]}</svg>;
};

// ─── Utils ────────────────────────────────────────────────────────────────────
const useScrolled = () => { const [s,setS]=useState(false); useEffect(()=>{const fn=()=>setS(window.scrollY>10); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn);},[]);return s; };
const useFadeUp = () => { useEffect(()=>{const run=()=>document.querySelectorAll(".fade-up").forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight-20)el.classList.add("visible");}); run();const t=setTimeout(run,80); window.addEventListener("scroll",run,{passive:true}); return()=>{clearTimeout(t);window.removeEventListener("scroll",run);}; }); };
const uid = () => Math.random().toString(36).slice(2,9);
const fmt = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

// ─── DEFAULT SITE CONTENT ─────────────────────────────────────────────────────
const DEFAULT_CONTENT = {
  colors: {
    primary: "#c94a2b",
    primaryDark: "#a33820",
    secondary: "#f5a623",
    text: "#1a1208",
    muted: "#7a6e62",
    border: "#e8e0d4",
    pageBg: "#faf7f2",
    cardBg: "#ffffff",
    navBg: "rgba(250,247,242,0.92)",
    impactBg: "#1a0a05",
    ctaBg: "linear-gradient(135deg,#c94a2b 0%,#e85d3a 60%,#f5a623 100%)",
    footerBg: "#0e0804",
  },
  hero: {
    imageUrl: "", imageBase64: "",
    bgMode: "gradient",
    gradientAngle: 135,
    gradientColor1: "#c94a2b",
    gradientColor2: "#1a0a05",
    gradientColor3: "#f5a623",
    gradientType: "linear",
    title1: "Share Food,",
    title2: "Reduce Waste",
    subtitle: "Connecting food donors with those in need. Together, we can eliminate hunger and reduce food waste in our communities.",
    btnDonate: "Donate Food",
    btnReceive: "Receive Food",
  },
  stats: [
    { value: "1.3B", label: "Tons of food wasted yearly" },
    { value: "828M", label: "People go hungry daily" },
    { value: "40%",  label: "Food wasted post-harvest" },
  ],
  steps: [
    { icon: "utensils", title: "Donors List Food",    desc: "Restaurants, hotels & households list surplus food available for donation." },
    { icon: "heart",    title: "Receivers Request",   desc: "Orphanages, old-age homes & individuals request the food they need." },
    { icon: "shield",   title: "Admin Manages",       desc: "Our admin team coordinates pickups and ensures safe, timely delivery." },
    { icon: "trending", title: "Impact Grows",        desc: "Every meal saved reduces waste and feeds someone in need." },
  ],
  testimonials: [
    { quote: "FoodBank helped us feed 200 families last month. Incredibly easy to use.", name: "Sarah M.", role: "Director, Hope Shelter", color: "#c94a2b" },
    { quote: "We used to throw away 20kg of food daily. Now it reaches people who need it.", name: "Ravi T.", role: "Owner, The Grand Restaurant", color: "#f5a623" },
    { quote: "Getting nutritious meals for our elderly residents has never been easier.", name: "Linda K.", role: "Manager, Silver Oak Home", color: "#2b7ac9" },
  ],
  cta: {
    title: "Ready to Make a Difference?",
    subtitle: "Whether you have surplus food or need a meal, FoodBank connects you with the right people.",
    btnText: "Join FoodBank Today",
  },
  about: {
    heroTitle: "Fighting Hunger,\nOne Meal at a Time",
    heroSubtitle: "FoodBank was founded on a simple belief — no food should go to waste while people go hungry.",
    missionTitle: "Why We Exist",
    missionBody1: "Every year, billions of tons of food are wasted while hundreds of millions go to bed hungry. FoodBank exists to close that gap.",
    missionBody2: "We believe technology can be a force for social good. Our platform makes food donation as easy as a few clicks.",
    values: [
      { icon: "🌍", title: "Reduce Food Waste", desc: "We divert surplus food from landfills, cutting methane emissions." },
      { icon: "🤝", title: "Feed Communities",  desc: "We connect donors to shelters, orphanages, and families in need." },
      { icon: "📊", title: "Track Impact",       desc: "Every donation is recorded so donors see the real difference." },
    ],
    team: [
      { name: "Amara J.",  role: "Founder & CEO",       color: "#c94a2b" },
      { name: "Dev P.",    role: "Head of Operations",   color: "#2b7ac9" },
      { name: "Lena K.",   role: "Community Lead",       color: "#f5a623" },
      { name: "Marcus R.", role: "Tech Lead",             color: "#166534" },
    ],
  },
  contact: {
    heroTitle: "We'd Love to Hear From You",
    heroSubtitle: "Questions, partnerships, or just want to say hi — we'll reply within 24 hours.",
    address: "123 Community Lane, Dhaka, BD 1200",
    email: "hello@foodbank.org",
    phone: "+880 1700-000000",
    hours: "Mon–Fri, 9am–6pm BST",
  },
  privacy: {
    lastUpdated: "March 2026",
    intro: "Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights.",
    sections: [
      { title: "Information We Collect", body: "We collect name, email, role, listings and requests. No payment info." },
      { title: "How We Use Your Information", body: "Used solely to operate FoodBank — matching donors with receivers. Never sold." },
      { title: "Data Sharing", body: "Shared only with matched donors/receivers as needed for a food exchange." },
      { title: "Data Security", body: "Industry-standard encryption and secure password storage." },
      { title: "Cookies", body: "Minimal session cookies only. No tracking or advertising cookies." },
      { title: "Your Rights", body: "Request deletion at privacy@foodbank.org. Processed within 30 days." },
    ],
  },
};

// ─── Reactive content store ───────────────────────────────────────────────────
let _content = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
const _listeners = new Set();
const setSiteContent = updater => { _content = typeof updater==="function"?updater(_content):updater; _listeners.forEach(fn=>fn(_content)); };
const useSiteContent = () => { const [c,setC]=useState(_content); useEffect(()=>{_listeners.add(setC);return()=>_listeners.delete(setC);},[]);return c; };

// CSS is rebuilt every time colors change
const useDynamicCSS = () => { const c=useSiteContent(); return buildCSS(c.colors); };

// ─── Data stores ──────────────────────────────────────────────────────────────
const DEMO_USERS=[{id:"u1",name:"Admin User",email:"admin@foodbank.org",password:"admin123",role:"admin"}];
let _users=[...DEMO_USERS];
let _listings=[
  {id:uid(),donorId:"u1",donorName:"City Hotel",foodName:"Mixed Buffet Leftovers",quantity:"15 kg",category:"Cooked Food",expiry:"2026-03-06",status:"available",createdAt:Date.now()-3600000},
  {id:uid(),donorId:"u1",donorName:"Green Bakery",foodName:"Bread & Pastries",quantity:"5 kg",category:"Bakery",expiry:"2026-03-05",status:"claimed",createdAt:Date.now()-86400000},
];
let _requests=[{id:uid(),receiverId:"u1",receiverName:"Sunrise Orphanage",need:"Cooked meals for 30 children",urgency:"high",status:"open",createdAt:Date.now()-7200000}];

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast=({msg,type,onDone})=>{useEffect(()=>{const t=setTimeout(onDone,3200);return()=>clearTimeout(t);},[]);return <div className={`toast ${type}`}>{msg}</div>;};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar=({setPage,user,onLogin,onRegister,onLogout})=>{
  const scrolled=useScrolled();
  return(
    <nav className={`navbar${scrolled?" scrolled":""}`}>
      <div className="navbar-logo display" onClick={()=>setPage("home")}>Food<span>Bank</span></div>
      <div className="navbar-links">
        {!user&&<><button className="nav-link" onClick={()=>setPage("home")}>Home</button><button className="nav-link" onClick={()=>setPage("about")}>About</button><button className="nav-link" onClick={()=>setPage("contact")}>Contact</button><button className="nav-link" onClick={onLogin}>Log In</button><button className="nav-btn" onClick={onRegister}>Get Started</button></>}
        {user&&<><span style={{fontSize:".85rem",color:"var(--muted)",marginRight:4}}>Hi, {user.name.split(" ")[0]}</span><button className="nav-btn" onClick={()=>setPage("dashboard")}>Dashboard</button><button className="btn btn-ghost btn-sm" style={{color:"var(--muted)"}} onClick={onLogout}><Icon name="logout" size={16}/> Sign out</button></>}
      </div>
    </nav>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer=({setPage})=>(
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-logo display">Food<span>Bank</span></div>
      <div className="footer-links"><a onClick={()=>setPage("home")}>Home</a><a onClick={()=>setPage("about")}>About</a><a onClick={()=>setPage("contact")}>Contact</a><a onClick={()=>setPage("privacy")}>Privacy</a></div>
    </div>
    <div className="footer-copy">© {new Date().getFullYear()} FoodBank. Made with ♥ to reduce hunger.</div>
  </footer>
);

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage=({openLogin,openRegister})=>{
  useFadeUp();
  const c=useSiteContent();
  const {hero:h,stats,steps,testimonials,cta}=c;
  const getHeroBg=h=>{
    if(h.bgMode==="image"&&(h.imageBase64||h.imageUrl)) return `url(${h.imageBase64||h.imageUrl})`;
    const a=h.gradientAngle??135,c1=h.gradientColor1||"#c94a2b",c2=h.gradientColor2||"#1a0a05",c3=h.gradientColor3||"#f5a623";
    if(h.gradientType==="radial") return `radial-gradient(ellipse at 30% 50%,${c1},${c2},${c3})`;
    if(h.gradientType==="mesh") return `linear-gradient(${a}deg,${c1},${c2},${c3})`;
    return `linear-gradient(${a}deg,${c1} 0%,${c2} 50%,${c3} 100%)`;
  };
  return(
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-img" style={{backgroundImage:getHeroBg(h)}}/>
        <div className="hero-grain"/>
        <div className="hero-content">
          <div className="hero-tag"><span className="dot"/>Live &amp; Active</div>
          <h1 className="hero-h1 display">{h.title1}<br/><em>{h.title2}</em></h1>
          <p className="hero-sub">{h.subtitle}</p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={()=>openRegister("donor")}>{h.btnDonate} <Icon name="arrow" size={18}/></button>
            <button className="btn btn-outline btn-lg" onClick={()=>openRegister("receiver")}>{h.btnReceive}</button>
          </div>
        </div>
        <div className="hero-scroll"><div className="hero-scroll-line"/>Scroll</div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stats-inner">
          {stats.map(({value,label},i)=>(
            <div key={i} className="stat-item fade-up" style={{transitionDelay:`${i*.12}s`}}>
              <div className="stat-val display">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{background:"var(--bg)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div className="section-header center fade-up">
            <div className="section-label">The Process</div>
            <h2 className="section-title display">How It Works</h2>
            <p className="section-sub">Four simple steps to connect surplus food with people who need it most.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s,i)=>(
              <div key={i} className="step-card fade-up" style={{transitionDelay:`${i*.1}s`}}>
                <div className="step-num">{String(i+1).padStart(2,"0")}</div>
                <div className="step-icon"><Icon name={s.icon} size={24} color="#fff"/></div>
                <h3 className="step-title display">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section impact-section">
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div className="section-header center fade-up" style={{marginBottom:48}}>
            <div className="section-label">Stories</div>
            <h2 className="section-title display">Real Impact, Real People</h2>
            <p className="section-sub">See how FoodBank is changing lives across the community.</p>
          </div>
          <div className="testimonials">
            {testimonials.map((t,i)=>(
              <div key={i} className="tcard fade-up" style={{transitionDelay:`${i*.12}s`}}>
                <p className="tcard-quote">"{t.quote}"</p>
                <div className="tcard-author">
                  <div className="tcard-avatar" style={{background:t.color}}>{t.name[0]}</div>
                  <div><div className="tcard-name">{t.name}</div><div className="tcard-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band fade-up">
        <h2 className="section-title display">{cta.title}</h2>
        <p>{cta.subtitle}</p>
        <button className="btn btn-secondary btn-lg" onClick={()=>openRegister()}>{cta.btnText}</button>
      </section>
    </div>
  );
};

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
const AboutPage=({openRegister})=>{
  useFadeUp();
  const {about:a}=useSiteContent();
  return(
    <div>
      <section style={{background:"linear-gradient(135deg,#1a0a05 0%,#3d1a0a 60%,#1a0808 100%)",padding:"100px 5vw 80px",textAlign:"center"}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div className="section-label" style={{color:"var(--secondary)",marginBottom:14}}>Our Story</div>
          <h1 className="display" style={{color:"#fff",fontSize:"clamp(2.2rem,5vw,3.5rem)",fontWeight:900,lineHeight:1.1,marginBottom:20,whiteSpace:"pre-line"}}>{a.heroTitle}</h1>
          <p style={{color:"rgba(255,255,255,0.7)",fontSize:"1.05rem",lineHeight:1.75}}>{a.heroSubtitle}</p>
        </div>
      </section>
      <section className="section" style={{background:"var(--card)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48,alignItems:"start"}}>
          <div className="fade-up"><div className="section-label">Mission</div><h2 className="section-title display">{a.missionTitle}</h2><p style={{color:"var(--muted)",lineHeight:1.8,marginBottom:14}}>{a.missionBody1}</p><p style={{color:"var(--muted)",lineHeight:1.8}}>{a.missionBody2}</p></div>
          <div className="fade-up" style={{transitionDelay:".15s"}}>{a.values.map(({icon,title,desc},i)=>(<div key={i} style={{display:"flex",gap:16,marginBottom:24}}><div style={{fontSize:"1.8rem",flexShrink:0,marginTop:2}}>{icon}</div><div><div style={{fontWeight:700,marginBottom:4}}>{title}</div><div style={{fontSize:".88rem",color:"var(--muted)",lineHeight:1.65}}>{desc}</div></div></div>))}</div>
        </div>
      </section>
      <section className="section" style={{background:"var(--bg)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div className="section-header center fade-up"><div className="section-label">The Team</div><h2 className="section-title display">People Behind FoodBank</h2></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:20}}>
            {a.team.map(({name,role,color},i)=>(<div key={i} className="fade-up" style={{transitionDelay:`${i*.1}s`,background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"28px 20px",textAlign:"center"}}><div style={{width:60,height:60,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:900,color:"#fff"}}>{name[0]}</div><div style={{fontWeight:700,marginBottom:4}}>{name}</div><div style={{fontSize:".82rem",color:"var(--muted)"}}>{role}</div></div>))}
          </div>
        </div>
      </section>
      <section className="cta-band fade-up"><h2 className="section-title display">Join Our Mission</h2><p>Become a donor or receiver and help build a hunger-free community.</p><button className="btn btn-secondary btn-lg" onClick={()=>openRegister()}>Get Started</button></section>
    </div>
  );
};

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
const ContactPage=({setPage})=>{
  useFadeUp();
  const {contact:ct}=useSiteContent();
  const [form,setForm]=useState({name:"",email:"",subject:"",message:""});
  const [sent,setSent]=useState(false);
  const [errors,setErrors]=useState({});
  const validate=()=>{const e={};if(!form.name.trim())e.name="Required";if(!form.email.includes("@"))e.email="Valid email required";if(!form.subject.trim())e.subject="Required";if(form.message.trim().length<10)e.message="Min 10 characters";return e;};
  const submit=()=>{const e=validate();if(Object.keys(e).length){setErrors(e);return;}setSent(true);};
  return(
    <div>
      <section style={{background:"linear-gradient(135deg,#1a0a05 0%,#3d1a0a 60%,#1a0808 100%)",padding:"100px 5vw 80px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}><div className="section-label" style={{color:"var(--secondary)",marginBottom:14}}>Get In Touch</div><h1 className="display" style={{color:"#fff",fontSize:"clamp(2.2rem,5vw,3.5rem)",fontWeight:900,lineHeight:1.1,marginBottom:16}}>{ct.heroTitle}</h1><p style={{color:"rgba(255,255,255,0.7)",fontSize:"1rem"}}>{ct.heroSubtitle}</p></div>
      </section>
      <section className="section">
        <div style={{maxWidth:840,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:48,alignItems:"start"}}>
          <div className="fade-up"><h3 className="display" style={{fontSize:"1.3rem",fontWeight:900,marginBottom:24}}>Contact Info</h3>{[["📍","Address",ct.address],["📧","Email",ct.email],["📞","Phone",ct.phone],["🕐","Hours",ct.hours]].map(([icon,label,val])=>(<div key={label} style={{display:"flex",gap:14,marginBottom:20}}><div style={{fontSize:"1.4rem",flexShrink:0}}>{icon}</div><div><div style={{fontWeight:700,fontSize:".85rem",marginBottom:2}}>{label}</div><div style={{color:"var(--muted)",fontSize:".88rem"}}>{val}</div></div></div>))}</div>
          <div className="fade-up" style={{transitionDelay:".12s",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"36px 32px"}}>
            {sent?(<div style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:"3rem",marginBottom:16}}>✅</div><h3 className="display" style={{fontSize:"1.5rem",fontWeight:900,marginBottom:8}}>Sent!</h3><p style={{color:"var(--muted)",marginBottom:24}}>We'll reply within 24 hours.</p><button className="btn btn-primary btn-sm" onClick={()=>setSent(false)}>Send Another</button></div>)
            :<><div className="listing-form-grid"><div className="form-group"><label className="form-label">Name</label><input className={`form-input${errors.name?" error":""}`} placeholder="Jane Doe" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>{errors.name&&<div className="form-error">{errors.name}</div>}</div><div className="form-group"><label className="form-label">Email</label><input className={`form-input${errors.email?" error":""}`} type="email" placeholder="jane@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>{errors.email&&<div className="form-error">{errors.email}</div>}</div></div><div className="form-group"><label className="form-label">Subject</label><input className={`form-input${errors.subject?" error":""}`} placeholder="How can we help?" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}/>{errors.subject&&<div className="form-error">{errors.subject}</div>}</div><div className="form-group"><label className="form-label">Message</label><textarea className={`form-input${errors.message?" error":""}`} rows={5} style={{resize:"vertical"}} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}/>{errors.message&&<div className="form-error">{errors.message}</div>}</div><button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit}>Send Message</button></>}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── PRIVACY PAGE ─────────────────────────────────────────────────────────────
const PrivacyPage=({setPage})=>{
  useFadeUp();
  const {privacy:pv}=useSiteContent();
  return(
    <div>
      <section style={{background:"linear-gradient(135deg,#1a0a05 0%,#3d1a0a 60%,#1a0808 100%)",padding:"100px 5vw 80px",textAlign:"center"}}><div style={{maxWidth:600,margin:"0 auto"}}><div className="section-label" style={{color:"var(--secondary)",marginBottom:14}}>Legal</div><h1 className="display" style={{color:"#fff",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,lineHeight:1.1,marginBottom:14}}>Privacy Policy</h1><p style={{color:"rgba(255,255,255,0.6)",fontSize:".9rem"}}>Last updated: {pv.lastUpdated}</p></div></section>
      <section className="section"><div style={{maxWidth:760,margin:"0 auto"}}><div className="fade-up" style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"12px 24px",marginBottom:36,fontSize:".9rem",color:"var(--muted)"}}>{pv.intro}</div>{pv.sections.map(({title,body},i)=>(<div key={i} className="fade-up" style={{transitionDelay:`${i*.05}s`,marginBottom:32}}><h3 className="display" style={{fontSize:"1.15rem",fontWeight:900,marginBottom:10}}>{i+1}. {title}</h3><p style={{color:"var(--muted)",lineHeight:1.8,fontSize:".95rem"}}>{body}</p>{i<pv.sections.length-1&&<div style={{height:1,background:"var(--border)",marginTop:24}}/>}</div>))}<div className="fade-up" style={{marginTop:8}}><button className="btn btn-ghost btn-sm" onClick={()=>setPage("contact")}>Questions? Contact Us →</button></div></div></section>
    </div>
  );
};

// ─── AUTH MODALS ──────────────────────────────────────────────────────────────
const LoginModal=({onClose,onSuccess,onSwitch})=>{
  const [form,setForm]=useState({email:"",password:""});
  const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(false);
  const submit=()=>{const e={};if(!form.email)e.email="Required";if(!form.password)e.password="Required";if(Object.keys(e).length){setErrors(e);return;}setLoading(true);setTimeout(()=>{const u=_users.find(u=>u.email===form.email&&u.password===form.password);if(u)onSuccess(u);else{setErrors({password:"Invalid email or password"});setLoading(false);}},700);};
  return(<div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><button className="modal-close" onClick={onClose}><Icon name="x" size={16}/></button><h2 className="modal-title display">Welcome back</h2><p className="modal-sub">Sign in to your FoodBank account</p><div className="form-group"><label className="form-label">Email</label><input className={`form-input${errors.email?" error":""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()}/>{errors.email&&<div className="form-error">{errors.email}</div>}</div><div className="form-group"><label className="form-label">Password</label><input className={`form-input${errors.password?" error":""}`} type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()}/>{errors.password&&<div className="form-error">{errors.password}</div>}</div><button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit} disabled={loading}>{loading?"Signing in…":"Sign In"}</button><div className="divider">or</div><p style={{textAlign:"center",fontSize:".88rem",color:"var(--muted)"}}>No account? <button style={{background:"none",border:"none",color:"var(--primary)",fontWeight:700,cursor:"pointer"}} onClick={onSwitch}>Create one</button></p><div style={{marginTop:16,padding:"12px 16px",background:"var(--bg)",borderRadius:10,fontSize:".78rem",color:"var(--muted)",lineHeight:1.6}}><strong>Demo:</strong> admin@foodbank.org / admin123</div></div></div>);
};

const RegisterModal=({defaultRole,onClose,onSuccess,onSwitch})=>{
  const [role,setRole]=useState(defaultRole||"donor");
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(false);
  const submit=()=>{const e={};if(!form.name.trim())e.name="Required";if(!form.email.includes("@"))e.email="Valid email required";if(form.password.length<6)e.password="Min 6 characters";if(Object.keys(e).length){setErrors(e);return;}if(_users.find(u=>u.email===form.email)){setErrors({email:"Already registered"});return;}setLoading(true);setTimeout(()=>{const u={id:uid(),...form,role};_users.push(u);onSuccess(u);},700);};
  return(<div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="modal" style={{maxWidth:520}}><button className="modal-close" onClick={onClose}><Icon name="x" size={16}/></button><h2 className="modal-title display">Join FoodBank</h2><p className="modal-sub">Create your account and start making a difference</p><div className="role-cards">{[{id:"donor",icon:"🍽️",title:"Food Donor",desc:"Restaurants, hotels, households"},{id:"receiver",icon:"🤝",title:"Food Receiver",desc:"Shelters, orphanages, families"}].map(r=>(<button key={r.id} className={`role-card${role===r.id?" active":""}`} onClick={()=>setRole(r.id)}><div className="role-card-icon">{r.icon}</div><div className="role-card-title">{r.title}</div><div className="role-card-desc">{r.desc}</div></button>))}</div><div className="form-group"><label className="form-label">Name</label><input className={`form-input${errors.name?" error":""}`} placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>{errors.name&&<div className="form-error">{errors.name}</div>}</div><div className="listing-form-grid"><div className="form-group"><label className="form-label">Email</label><input className={`form-input${errors.email?" error":""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>{errors.email&&<div className="form-error">{errors.email}</div>}</div><div className="form-group"><label className="form-label">Password</label><input className={`form-input${errors.password?" error":""}`} type="password" placeholder="Min 6 chars" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>{errors.password&&<div className="form-error">{errors.password}</div>}</div></div><button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit} disabled={loading}>{loading?"Creating…":"Create Account"}</button><p style={{textAlign:"center",fontSize:".88rem",color:"var(--muted)",marginTop:16}}>Have an account? <button style={{background:"none",border:"none",color:"var(--primary)",fontWeight:700,cursor:"pointer"}} onClick={onSwitch}>Sign in</button></p></div></div>);
};

// ─── COLOR PICKER ROW ─────────────────────────────────────────────────────────
const ColorField=({label,value,onChange,hint})=>(
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      <input type="color" value={value||"#000000"} onChange={e=>onChange(e.target.value)} style={{width:38,height:38,border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",padding:2,flexShrink:0}}/>
      <input className="form-input" value={value||""} onChange={e=>onChange(e.target.value)} style={{fontSize:".85rem",padding:"9px 12px"}}/>
    </div>
    {hint&&<div className="form-hint">{hint}</div>}
  </div>
);

// ─── CMS EDITOR ───────────────────────────────────────────────────────────────
const CMSEditor=({toast})=>{
  const content=useSiteContent();
  const [draft,setDraft]=useState(JSON.parse(JSON.stringify(content)));
  const [sec,setSec]=useState("colors");
  const fileRef=useRef();

  const save=(section)=>{setSiteContent(prev=>({...prev,[section]:draft[section]}));toast(`${section.charAt(0).toUpperCase()+section.slice(1)} saved!`,"success");};
  const saveColors=()=>{setSiteContent(prev=>({...prev,colors:draft.colors}));toast("Colors & theme saved! Applied site-wide.","success");};

  const upd=(section,field,val)=>setDraft(d=>({...d,[section]:{...d[section],[field]:val}}));
  const updColor=(field,val)=>setDraft(d=>({...d,colors:{...d.colors,[field]:val}}));
  const updArr=(section,field,idx,subfield,val)=>setDraft(d=>{const arr=[...d[section][field]];arr[idx]={...arr[idx],[subfield]:val};return{...d,[section]:{...d[section],[field]:arr}};});
  const removeArr=(section,field,idx)=>setDraft(d=>({...d,[section]:{...d[section],[field]:d[section][field].filter((_,i)=>i!==idx)}}));
  const addArr=(section,field,tmpl)=>setDraft(d=>({...d,[section]:{...d[section],[field]:[...d[section][field],{...tmpl}]}}));
  const updRoot=(section,idx,subfield,val)=>setDraft(d=>{const arr=[...d[section]];arr[idx]={...arr[idx],[subfield]:val};return{...d,[section]:arr};});
  const removeRoot=(section,idx)=>setDraft(d=>({...d,[section]:d[section].filter((_,i)=>i!==idx)}));
  const addRoot=(section,tmpl)=>setDraft(d=>({...d,[section]:[...d[section],{...tmpl}]}));

  const handleImageFile=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>setDraft(d=>({...d,hero:{...d.hero,imageBase64:ev.target.result,imageUrl:""}}));r.readAsDataURL(file);toast("Image loaded — click Save to apply.","success");};

  const getPreviewBg=h=>{
    if(h.bgMode==="image"&&(h.imageBase64||h.imageUrl)) return `url(${h.imageBase64||h.imageUrl})`;
    const a=h.gradientAngle??135,c1=h.gradientColor1||"#c94a2b",c2=h.gradientColor2||"#1a0a05",c3=h.gradientColor3||"#f5a623";
    if(h.gradientType==="radial") return `radial-gradient(ellipse at 30% 50%,${c1},${c2},${c3})`;
    if(h.gradientType==="mesh") return `linear-gradient(${a}deg,${c1},${c2},${c3})`;
    return `linear-gradient(${a}deg,${c1} 0%,${c2} 50%,${c3} 100%)`;
  };

  const TABS=[["colors","🎨 Colors"],["hero","🏠 Hero"],["stats","📊 Stats"],["steps","🔢 Steps"],["testimonials","💬 Testimonials"],["cta","📣 CTA"],["about","📖 About"],["contact","📬 Contact"],["privacy","🔒 Privacy"]];

  const Sec=({title,onSave,children})=>(
    <div className="cms-section">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div className="dash-section-title" style={{marginBottom:0}}>{title}</div>
        <button className="btn btn-primary btn-sm" onClick={onSave}><Icon name="check" size={15}/> Save Changes</button>
      </div>
      {children}
    </div>
  );

  return(
    <div>
      <div style={{marginBottom:24,padding:"14px 18px",background:"color-mix(in srgb, var(--primary) 8%, transparent)",border:"1px solid color-mix(in srgb, var(--primary) 25%, transparent)",borderRadius:"var(--radius)",fontSize:".88rem",color:"var(--muted)",display:"flex",gap:10,alignItems:"center"}}>
        <Icon name="settings" size={16} color="var(--primary)"/>
        <span><strong style={{color:"var(--primary)"}}>Content Control Panel</strong> — Edit every visible element on the homepage and all pages. Changes apply instantly.</span>
      </div>

      {/* Tab bar */}
      <div className="tab-bar" style={{marginBottom:28}}>{TABS.map(([id,label])=>(<button key={id} className={`tab${sec===id?" active":""}`} onClick={()=>setSec(id)}>{label}</button>))}</div>

      {/* ── COLORS ── */}
      {sec==="colors"&&(
        <Sec title="🎨 Site Colors & Theme" onSave={saveColors}>
          <div style={{marginBottom:20,padding:"12px 16px",background:"var(--bg)",borderRadius:10,fontSize:".82rem",color:"var(--muted)"}}>
            These colors affect <strong>every page</strong> — buttons, headings, stats, step icons, backgrounds, footer, and more.
          </div>

          <div style={{marginBottom:8,fontWeight:700,fontSize:".9rem",color:"var(--text)"}}>Brand Colors</div>
          <div className="color-row" style={{marginBottom:20}}>
            <ColorField label="Primary Color (buttons, accents)" value={draft.colors.primary} onChange={v=>updColor("primary",v)} hint="Main brand color — used on buttons, links, step icons"/>
            <ColorField label="Primary Dark (hover state)" value={draft.colors.primaryDark} onChange={v=>updColor("primaryDark",v)}/>
            <ColorField label="Secondary / Accent" value={draft.colors.secondary} onChange={v=>updColor("secondary",v)} hint="Hero accent, CTA buttons, team tags"/>
            <ColorField label="Body Text" value={draft.colors.text} onChange={v=>updColor("text",v)}/>
            <ColorField label="Muted Text" value={draft.colors.muted} onChange={v=>updColor("muted",v)} hint="Descriptions, labels, meta text"/>
            <ColorField label="Border / Divider" value={draft.colors.border} onChange={v=>updColor("border",v)}/>
          </div>

          <div style={{height:1,background:"var(--border)",margin:"8px 0 20px"}}/>
          <div style={{marginBottom:8,fontWeight:700,fontSize:".9rem",color:"var(--text)"}}>Backgrounds</div>
          <div className="color-row" style={{marginBottom:20}}>
            <ColorField label="Page Background" value={draft.colors.pageBg} onChange={v=>updColor("pageBg",v)}/>
            <ColorField label="Card / Panel Background" value={draft.colors.cardBg} onChange={v=>updColor("cardBg",v)}/>
          </div>

          <div style={{height:1,background:"var(--border)",margin:"8px 0 20px"}}/>
          <div style={{marginBottom:8,fontWeight:700,fontSize:".9rem",color:"var(--text)"}}>Section Backgrounds</div>
          <div className="color-row" style={{marginBottom:20}}>
            <ColorField label="Testimonials Section BG" value={draft.colors.impactBg} onChange={v=>updColor("impactBg",v)} hint="The dark background behind testimonial cards"/>
            <ColorField label="Footer Background" value={draft.colors.footerBg} onChange={v=>updColor("footerBg",v)}/>
          </div>

          <div style={{height:1,background:"var(--border)",margin:"8px 0 20px"}}/>
          <div style={{marginBottom:12,fontWeight:700,fontSize:".9rem",color:"var(--text)"}}>CTA Band Background</div>
          <div className="form-group">
            <label className="form-label">CSS background value (color or gradient)</label>
            <input className="form-input" value={draft.colors.ctaBg} onChange={e=>updColor("ctaBg",e.target.value)} placeholder="linear-gradient(135deg,#c94a2b,#f5a623)"/>
            <div className="form-hint">Supports any CSS: solid color, linear-gradient, etc.</div>
          </div>
          <div style={{height:40,borderRadius:10,backgroundImage:draft.colors.ctaBg.startsWith("linear")||draft.colors.ctaBg.startsWith("radial")?draft.colors.ctaBg:undefined,background:draft.colors.ctaBg.startsWith("linear")||draft.colors.ctaBg.startsWith("radial")?undefined:draft.colors.ctaBg,border:"1px solid var(--border)",marginTop:8}}/>

          {/* Live mini-preview */}
          <div style={{height:1,background:"var(--border)",margin:"24px 0 20px"}}/>
          <div style={{marginBottom:12,fontWeight:700,fontSize:".9rem"}}>Preview</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",padding:"20px",background:draft.colors.pageBg,borderRadius:12,border:"1px solid var(--border)"}}>
            <div style={{padding:"10px 20px",background:draft.colors.primary,color:"#fff",borderRadius:8,fontWeight:700,fontSize:".85rem"}}>Primary Button</div>
            <div style={{padding:"10px 20px",background:draft.colors.secondary,color:draft.colors.text,borderRadius:8,fontWeight:700,fontSize:".85rem"}}>Secondary Button</div>
            <div style={{padding:"10px 16px",background:draft.colors.cardBg,border:`1px solid ${draft.colors.border}`,borderRadius:8,fontSize:".85rem",color:draft.colors.text}}>Card text</div>
            <div style={{fontSize:".85rem",color:draft.colors.muted}}>Muted text sample</div>
            <div style={{fontSize:"1.4rem",fontWeight:900,color:draft.colors.primary,fontFamily:"'Playfair Display',serif"}}>3.4B</div>
          </div>
        </Sec>
      )}

      {/* ── HERO ── */}
      {sec==="hero"&&(
        <Sec title="🏠 Hero Section" onSave={()=>save("hero")}>
          {/* Background mode toggle */}
          <div className="form-label" style={{marginBottom:10,fontWeight:700}}>Background</div>
          <div style={{display:"flex",marginBottom:16,borderRadius:10,overflow:"hidden",border:"1px solid var(--border)",width:"fit-content"}}>
            {[["gradient","🎨 Gradient"],["image","🖼️ Photo"]].map(([mode,label])=>(
              <button key={mode} onClick={()=>setDraft(d=>({...d,hero:{...d.hero,bgMode:mode}}))} style={{padding:"9px 22px",border:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".85rem",cursor:"pointer",transition:"all .2s",background:draft.hero.bgMode===mode?"var(--primary)":"var(--bg)",color:draft.hero.bgMode===mode?"#fff":"var(--muted)"}}>{label}</button>
            ))}
          </div>
          {/* Preview */}
          <div style={{width:"100%",height:120,borderRadius:12,marginBottom:18,overflow:"hidden",border:"1px solid var(--border)",backgroundImage:getPreviewBg(draft.hero),backgroundSize:"cover",backgroundPosition:"center",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)"}}/>
            <div style={{position:"relative",textAlign:"center",color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:900,textShadow:"0 2px 8px rgba(0,0,0,0.6)"}}>Live Preview</div>
          </div>

          {/* Gradient builder */}
          {draft.hero.bgMode==="gradient"&&(
            <div style={{marginBottom:20}}>
              <div className="form-label" style={{marginBottom:10}}>Quick Presets</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
                {[{name:"Sunset",c1:"#c94a2b",c2:"#1a0a05",c3:"#f5a623",angle:135,type:"linear"},{name:"Ocean",c1:"#0f3460",c2:"#16213e",c3:"#0ea5e9",angle:160,type:"linear"},{name:"Forest",c1:"#166534",c2:"#052e16",c3:"#65a30d",angle:135,type:"linear"},{name:"Dusk",c1:"#7c3aed",c2:"#1e1b4b",c3:"#db2777",angle:120,type:"linear"},{name:"Gold",c1:"#b45309",c2:"#1c1917",c3:"#d97706",angle:145,type:"linear"},{name:"Aurora",c1:"#0d9488",c2:"#1e1b4b",c3:"#7c3aed",angle:135,type:"radial"},{name:"Ember",c1:"#991b1b",c2:"#0c0a09",c3:"#ea580c",angle:150,type:"mesh"},{name:"Midnight",c1:"#1e3a5f",c2:"#0a0a0f",c3:"#2d6a9f",angle:180,type:"linear"}].map(p=>{
                  const active=draft.hero.gradientColor1===p.c1&&draft.hero.gradientColor2===p.c2;
                  const pbg=p.type==="radial"?`radial-gradient(ellipse at 30% 50%,${p.c1},${p.c2},${p.c3})`:`linear-gradient(${p.angle}deg,${p.c1},${p.c2},${p.c3})`;
                  return(<button key={p.name} onClick={()=>setDraft(d=>({...d,hero:{...d.hero,gradientColor1:p.c1,gradientColor2:p.c2,gradientColor3:p.c3,gradientAngle:p.angle,gradientType:p.type}}))} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:"none",border:`2px solid ${active?"var(--primary)":"var(--border)"}`,borderRadius:10,padding:"8px 10px",cursor:"pointer",transition:"all .2s"}}><div style={{width:48,height:30,borderRadius:6,backgroundImage:pbg}}/><span style={{fontSize:".7rem",fontWeight:700,color:active?"var(--primary)":"var(--muted)"}}>{p.name}</span></button>);
                })}
              </div>
              <div className="color-row" style={{marginBottom:14}}>
                {[["gradientColor1","Color 1"],["gradientColor2","Color 2"],["gradientColor3","Color 3"]].map(([field,label])=>(<ColorField key={field} label={label} value={draft.hero[field]} onChange={v=>setDraft(d=>({...d,hero:{...d.hero,[field]:v}}))}/>))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div className="form-group"><label className="form-label">Style</label><select className="form-input form-select" value={draft.hero.gradientType||"linear"} onChange={e=>setDraft(d=>({...d,hero:{...d.hero,gradientType:e.target.value}}))}><option value="linear">Linear</option><option value="radial">Radial</option><option value="mesh">Mesh</option></select></div>
                <div className="form-group"><label className="form-label">Angle — {draft.hero.gradientAngle??135}°</label><input type="range" min="0" max="360" value={draft.hero.gradientAngle??135} onChange={e=>setDraft(d=>({...d,hero:{...d.hero,gradientAngle:Number(e.target.value)}}))} style={{width:"100%",marginTop:10,accentColor:"var(--primary)",cursor:"pointer"}}/></div>
              </div>
            </div>
          )}
          {draft.hero.bgMode==="image"&&(
            <div style={{marginBottom:20}}>
              <button className="btn btn-ghost btn-sm" style={{marginBottom:10}} onClick={()=>fileRef.current.click()}><Icon name="upload" size={15}/> Upload Photo</button>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImageFile}/>
              <div className="form-group"><label className="form-label">Or paste image URL</label><input className="form-input" placeholder="https://…/photo.jpg" value={draft.hero.imageUrl||""} onChange={e=>setDraft(d=>({...d,hero:{...d.hero,imageUrl:e.target.value,imageBase64:""}}))}/>  </div>
            </div>
          )}

          <div style={{height:1,background:"var(--border)",margin:"4px 0 20px"}}/>
          {/* Text content */}
          <div className="listing-form-grid">
            <div className="form-group"><label className="form-label">Headline Line 1</label><input className="form-input" value={draft.hero.title1} onChange={e=>upd("hero","title1",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Headline Line 2 (accent color)</label><input className="form-input" value={draft.hero.title2} onChange={e=>upd("hero","title2",e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Subtitle</label><textarea className="form-input" rows={2} value={draft.hero.subtitle} onChange={e=>upd("hero","subtitle",e.target.value)}/></div>
          <div className="listing-form-grid">
            <div className="form-group"><label className="form-label">Primary Button</label><input className="form-input" value={draft.hero.btnDonate} onChange={e=>upd("hero","btnDonate",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Secondary Button</label><input className="form-input" value={draft.hero.btnReceive} onChange={e=>upd("hero","btnReceive",e.target.value)}/></div>
          </div>
        </Sec>
      )}

      {/* ── STATS ── */}
      {sec==="stats"&&(
        <Sec title="📊 Stats Section" onSave={()=>save("stats")}>
          {draft.stats.map((s,i)=>(
            <div key={i} style={{background:"var(--bg)",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr auto",gap:12,alignItems:"end"}}>
                <div className="form-group" style={{marginBottom:0}}><label className="form-label">Value</label><input className="form-input" value={s.value} onChange={e=>updRoot("stats",i,"value",e.target.value)} placeholder="1.3B"/></div>
                <div className="form-group" style={{marginBottom:0}}><label className="form-label">Label</label><input className="form-input" value={s.label} onChange={e=>updRoot("stats",i,"label",e.target.value)} placeholder="Description"/></div>
                <button className="btn btn-danger btn-sm" onClick={()=>removeRoot("stats",i)}><Icon name="trash" size={14}/></button>
              </div>
            </div>
          ))}
          <button className="cms-add-btn" onClick={()=>addRoot("stats",{value:"0",label:"New Stat"})}>+ Add Stat</button>
        </Sec>
      )}

      {/* ── STEPS ── */}
      {sec==="steps"&&(
        <Sec title="🔢 How It Works Steps" onSave={()=>save("steps")}>
          <div className="form-hint" style={{marginBottom:16}}>Icons: utensils, heart, shield, trending, arrow, box, inbox, upload, check</div>
          {draft.steps.map((s,i)=>(
            <div key={i} style={{background:"var(--bg)",borderRadius:10,padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontWeight:700,fontSize:".85rem",color:"var(--muted)"}}>Step {i+1}</div>
                <button className="btn btn-danger btn-sm" onClick={()=>removeRoot("steps",i)}><Icon name="trash" size={14}/> Remove</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12,marginBottom:10}}>
                <div className="form-group" style={{marginBottom:0}}><label className="form-label">Icon name</label><input className="form-input" value={s.icon} onChange={e=>updRoot("steps",i,"icon",e.target.value)}/></div>
                <div className="form-group" style={{marginBottom:0}}><label className="form-label">Title</label><input className="form-input" value={s.title} onChange={e=>updRoot("steps",i,"title",e.target.value)}/></div>
              </div>
              <div className="form-group" style={{marginBottom:0}}><label className="form-label">Description</label><textarea className="form-input" rows={2} value={s.desc} onChange={e=>updRoot("steps",i,"desc",e.target.value)}/></div>
            </div>
          ))}
          <button className="cms-add-btn" onClick={()=>addRoot("steps",{icon:"check",title:"New Step",desc:"Step description here."})}>+ Add Step</button>
        </Sec>
      )}

      {/* ── TESTIMONIALS ── */}
      {sec==="testimonials"&&(
        <Sec title="💬 Testimonials" onSave={()=>save("testimonials")}>
          {draft.testimonials.map((t,i)=>(
            <div key={i} style={{background:"var(--bg)",borderRadius:10,padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontWeight:700,fontSize:".85rem",color:"var(--muted)"}}>Card {i+1}</div>
                <button className="btn btn-danger btn-sm" onClick={()=>removeRoot("testimonials",i)}><Icon name="trash" size={14}/> Remove</button>
              </div>
              <div className="form-group"><label className="form-label">Quote</label><textarea className="form-input" rows={2} value={t.quote} onChange={e=>updRoot("testimonials",i,"quote",e.target.value)}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:10,alignItems:"end"}}>
                <div className="form-group" style={{marginBottom:0}}><label className="form-label">Name</label><input className="form-input" value={t.name} onChange={e=>updRoot("testimonials",i,"name",e.target.value)}/></div>
                <div className="form-group" style={{marginBottom:0}}><label className="form-label">Role</label><input className="form-input" value={t.role} onChange={e=>updRoot("testimonials",i,"role",e.target.value)}/></div>
                <div><label className="form-label">Avatar Color</label><input type="color" value={t.color||"#c94a2b"} onChange={e=>updRoot("testimonials",i,"color",e.target.value)} style={{width:38,height:38,border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",padding:2,display:"block"}}/></div>
              </div>
            </div>
          ))}
          <button className="cms-add-btn" onClick={()=>addRoot("testimonials",{quote:"Add a testimonial quote here.",name:"Person Name",role:"Their Role",color:"#c94a2b"})}>+ Add Testimonial</button>
        </Sec>
      )}

      {/* ── CTA ── */}
      {sec==="cta"&&(
        <Sec title="📣 Call to Action Band" onSave={()=>save("cta")}>
          <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={draft.cta.title} onChange={e=>upd("cta","title",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Subtitle</label><textarea className="form-input" rows={2} value={draft.cta.subtitle} onChange={e=>upd("cta","subtitle",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Button Text</label><input className="form-input" value={draft.cta.btnText} onChange={e=>upd("cta","btnText",e.target.value)}/></div>
          <div style={{marginTop:16,padding:28,borderRadius:12,background:draft.colors.ctaBg,textAlign:"center"}}>
            <div style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:900,marginBottom:8}}>{draft.cta.title}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:".88rem",marginBottom:16}}>{draft.cta.subtitle}</div>
            <div style={{display:"inline-block",padding:"10px 24px",background:draft.colors.secondary,color:draft.colors.text,borderRadius:8,fontWeight:700,fontSize:".88rem"}}>{draft.cta.btnText}</div>
          </div>
        </Sec>
      )}

      {/* ── ABOUT ── */}
      {sec==="about"&&(
        <Sec title="📖 About Page" onSave={()=>save("about")}>
          <div className="form-group"><label className="form-label">Hero Title (\\n = line break)</label><textarea className="form-input" rows={2} value={draft.about.heroTitle} onChange={e=>upd("about","heroTitle",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Hero Subtitle</label><textarea className="form-input" rows={2} value={draft.about.heroSubtitle} onChange={e=>upd("about","heroSubtitle",e.target.value)}/></div>
          <div style={{height:1,background:"var(--border)",margin:"16px 0"}}/>
          <div className="form-group"><label className="form-label">Mission Title</label><input className="form-input" value={draft.about.missionTitle} onChange={e=>upd("about","missionTitle",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Mission Body 1</label><textarea className="form-input" rows={3} value={draft.about.missionBody1} onChange={e=>upd("about","missionBody1",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Mission Body 2</label><textarea className="form-input" rows={3} value={draft.about.missionBody2} onChange={e=>upd("about","missionBody2",e.target.value)}/></div>
          <div style={{height:1,background:"var(--border)",margin:"16px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div className="form-label" style={{marginBottom:0,fontWeight:700}}>Values</div><button className="cms-add-btn" style={{width:"auto",padding:"7px 14px",fontSize:".8rem"}} onClick={()=>addArr("about","values",{icon:"✨",title:"New Value",desc:"Description."})}>+ Add</button></div>
          {draft.about.values.map((v,i)=>(<div key={i} style={{background:"var(--bg)",borderRadius:10,padding:"12px",marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"50px 1fr 1fr auto",gap:10,alignItems:"end"}}><div className="form-group" style={{marginBottom:0}}><label className="form-label">Icon</label><input className="form-input" value={v.icon} onChange={e=>updArr("about","values",i,"icon",e.target.value)} style={{textAlign:"center",fontSize:"1.2rem",padding:"6px 4px"}}/></div><div className="form-group" style={{marginBottom:0}}><label className="form-label">Title</label><input className="form-input" value={v.title} onChange={e=>updArr("about","values",i,"title",e.target.value)}/></div><div className="form-group" style={{marginBottom:0}}><label className="form-label">Description</label><input className="form-input" value={v.desc} onChange={e=>updArr("about","values",i,"desc",e.target.value)}/></div><button className="btn btn-danger btn-sm" style={{marginBottom:0}} onClick={()=>removeArr("about","values",i)}><Icon name="trash" size={14}/></button></div></div>))}
          <div style={{height:1,background:"var(--border)",margin:"16px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div className="form-label" style={{marginBottom:0,fontWeight:700}}>Team Members</div><button className="cms-add-btn" style={{width:"auto",padding:"7px 14px",fontSize:".8rem"}} onClick={()=>addArr("about","team",{name:"New Member",role:"Role",color:"#666"})}>+ Add</button></div>
          {draft.about.team.map((m,i)=>(<div key={i} style={{background:"var(--bg)",borderRadius:10,padding:"12px",marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 40px auto",gap:10,alignItems:"end"}}><div className="form-group" style={{marginBottom:0}}><label className="form-label">Name</label><input className="form-input" value={m.name} onChange={e=>updArr("about","team",i,"name",e.target.value)}/></div><div className="form-group" style={{marginBottom:0}}><label className="form-label">Role</label><input className="form-input" value={m.role} onChange={e=>updArr("about","team",i,"role",e.target.value)}/></div><div><label className="form-label">Color</label><input type="color" value={m.color||"#666"} onChange={e=>updArr("about","team",i,"color",e.target.value)} style={{width:38,height:38,border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",padding:2,display:"block"}}/></div><button className="btn btn-danger btn-sm" style={{marginBottom:0}} onClick={()=>removeArr("about","team",i)}><Icon name="trash" size={14}/></button></div></div>))}
        </Sec>
      )}

      {/* ── CONTACT ── */}
      {sec==="contact"&&(
        <Sec title="📬 Contact Page" onSave={()=>save("contact")}>
          <div className="form-group"><label className="form-label">Hero Title</label><input className="form-input" value={draft.contact.heroTitle} onChange={e=>upd("contact","heroTitle",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Hero Subtitle</label><textarea className="form-input" rows={2} value={draft.contact.heroSubtitle} onChange={e=>upd("contact","heroSubtitle",e.target.value)}/></div>
          <div style={{height:1,background:"var(--border)",margin:"16px 0"}}/>
          <div className="listing-form-grid">
            {[["address","📍 Address"],["email","📧 Email"],["phone","📞 Phone"],["hours","🕐 Hours"]].map(([field,label])=>(<div key={field} className="form-group"><label className="form-label">{label}</label><input className="form-input" value={draft.contact[field]} onChange={e=>upd("contact",field,e.target.value)}/></div>))}
          </div>
        </Sec>
      )}

      {/* ── PRIVACY ── */}
      {sec==="privacy"&&(
        <Sec title="🔒 Privacy Policy Page" onSave={()=>save("privacy")}>
          <div className="listing-form-grid"><div className="form-group"><label className="form-label">Last Updated</label><input className="form-input" value={draft.privacy.lastUpdated} onChange={e=>upd("privacy","lastUpdated",e.target.value)}/></div></div>
          <div className="form-group"><label className="form-label">Intro Text</label><textarea className="form-input" rows={2} value={draft.privacy.intro} onChange={e=>upd("privacy","intro",e.target.value)}/></div>
          <div style={{height:1,background:"var(--border)",margin:"16px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div className="form-label" style={{marginBottom:0,fontWeight:700}}>Policy Sections</div><button className="cms-add-btn" style={{width:"auto",padding:"7px 14px",fontSize:".8rem"}} onClick={()=>addArr("privacy","sections",{title:"New Section",body:"Content here."})}>+ Add Section</button></div>
          {draft.privacy.sections.map((s,i)=>(<div key={i} style={{background:"var(--bg)",borderRadius:10,padding:"16px",marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontWeight:700,fontSize:".85rem",color:"var(--muted)"}}>Section {i+1}</div><button className="btn btn-danger btn-sm" onClick={()=>removeArr("privacy","sections",i)}><Icon name="trash" size={14}/> Remove</button></div><div className="form-group"><label className="form-label">Title</label><input className="form-input" value={s.title} onChange={e=>updArr("privacy","sections",i,"title",e.target.value)}/></div><div className="form-group" style={{marginBottom:0}}><label className="form-label">Body</label><textarea className="form-input" rows={3} value={s.body} onChange={e=>updArr("privacy","sections",i,"body",e.target.value)}/></div></div>))}
        </Sec>
      )}
    </div>
  );
};

// ─── DASHBOARDS ───────────────────────────────────────────────────────────────
const DonorDashboard=({user,toast})=>{
  const [tab,setTab]=useState("listings");
  const [myListings,setMyListings]=useState(_listings.filter(l=>l.donorId===user.id));
  const [form,setForm]=useState({foodName:"",quantity:"",category:"Cooked Food",expiry:""});
  const [errors,setErrors]=useState({});
  const [showForm,setShowForm]=useState(false);
  const add=()=>{const e={};if(!form.foodName.trim())e.foodName="Required";if(!form.quantity.trim())e.quantity="Required";if(!form.expiry)e.expiry="Required";if(Object.keys(e).length){setErrors(e);return;}const item={id:uid(),donorId:user.id,donorName:user.name,...form,status:"available",createdAt:Date.now()};_listings.push(item);setMyListings(p=>[...p,item]);setForm({foodName:"",quantity:"",category:"Cooked Food",expiry:""});setErrors({});setShowForm(false);toast("Listing added!","success");};
  const del=id=>{_listings=_listings.filter(l=>l.id!==id);setMyListings(p=>p.filter(l=>l.id!==id));toast("Removed.","success");};
  const toggle=id=>{const l=_listings.find(x=>x.id===id);if(l)l.status=l.status==="available"?"claimed":"available";setMyListings(p=>p.map(l=>l.id===id?{...l,status:l.status==="available"?"claimed":"available"}:l));};
  return(<div>
    <div className="dash-cards"><div className="dash-card"><div className="dash-card-num">{myListings.length}</div><div className="dash-card-label">Total Listings</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"var(--secondary)"}}>{myListings.filter(l=>l.status==="available").length}</div><div className="dash-card-label">Available</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"#166534"}}>{myListings.filter(l=>l.status==="claimed").length}</div><div className="dash-card-label">Claimed</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"#1e40af"}}>{_requests.length}</div><div className="dash-card-label">Open Requests</div></div></div>
    <div className="tab-bar"><button className={`tab${tab==="listings"?" active":""}`} onClick={()=>setTab("listings")}>My Listings</button><button className={`tab${tab==="requests"?" active":""}`} onClick={()=>setTab("requests")}>Requests</button></div>
    {tab==="listings"&&<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div className="dash-section-title">My Listings</div><button className="btn btn-primary btn-sm" onClick={()=>setShowForm(f=>!f)}><Icon name="plus" size={16}/> {showForm?"Cancel":"Add"}</button></div>
    {showForm&&<div className="listing-form"><div className="listing-form-grid"><div className="form-group"><label className="form-label">Food Name</label><input className={`form-input${errors.foodName?" error":""}`} value={form.foodName} onChange={e=>setForm(f=>({...f,foodName:e.target.value}))}/>{errors.foodName&&<div className="form-error">{errors.foodName}</div>}</div><div className="form-group"><label className="form-label">Quantity</label><input className={`form-input${errors.quantity?" error":""}`} value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))}/></div><div className="form-group"><label className="form-label">Category</label><select className="form-input form-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{["Cooked Food","Bakery","Fruits & Vegetables","Packaged Food","Dairy","Other"].map(c=><option key={c}>{c}</option>)}</select></div><div className="form-group"><label className="form-label">Expires</label><input type="date" className={`form-input${errors.expiry?" error":""}`} value={form.expiry} min={new Date().toISOString().split("T")[0]} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))}/></div></div><button className="btn btn-primary btn-sm" onClick={add}><Icon name="check" size={15}/> Submit</button></div>}
    <div className="listings">{myListings.length===0&&<div className="empty-state"><Icon name="box" size={48}/><p>No listings yet.</p></div>}{myListings.map(l=>(<div key={l.id} className="listing-item"><div><div className="listing-info-name">{l.foodName}</div><div className="listing-info-meta">{l.quantity} · {l.category} · Expires {fmt(l.expiry)}</div></div><div className="listing-actions"><span className={`badge ${l.status==="available"?"badge-green":"badge-yellow"}`}>{l.status}</span><button className="btn btn-ghost btn-sm" onClick={()=>toggle(l.id)}><Icon name="check" size={15}/></button><button className="btn btn-ghost btn-sm" style={{color:"#e53e3e"}} onClick={()=>del(l.id)}><Icon name="trash" size={15}/></button></div></div>))}</div></>}
    {tab==="requests"&&<><div className="dash-section-title">Incoming Requests</div>{_requests.length===0&&<div className="empty-state"><Icon name="inbox" size={48}/><p>No requests.</p></div>}{_requests.map(r=>(<div key={r.id} className="request-card"><div className="request-card-top"><div><div className="request-card-title">{r.receiverName}</div><div style={{fontSize:".8rem",color:"var(--muted)"}}>{fmt(r.createdAt)}</div></div><span className={`badge ${r.urgency==="high"?"badge-red":r.urgency==="medium"?"badge-yellow":"badge-blue"}`}>{r.urgency}</span></div><div className="request-card-body">{r.need}</div><div style={{marginTop:12}}><button className="btn btn-primary btn-sm" onClick={()=>toast("Contact shared!","success")}><Icon name="check" size={15}/> Respond</button></div></div>))}</>}
  </div>);
};

const ReceiverDashboard=({user,toast})=>{
  const [tab,setTab]=useState("browse");
  const [available,setAvailable]=useState(_listings.filter(l=>l.status==="available"));
  const [myReqs,setMyReqs]=useState(_requests.filter(r=>r.receiverId===user.id));
  const [claimed,setClaimed]=useState(0);
  const [reqForm,setReqForm]=useState({need:"",urgency:"medium"});
  const [showReqForm,setShowReqForm]=useState(false);
  const claim=l=>{const idx=_listings.findIndex(x=>x.id===l.id);if(idx!==-1)_listings[idx].status="claimed";setAvailable(p=>p.filter(x=>x.id!==l.id));setClaimed(c=>c+1);toast(`Claimed "${l.foodName}"!`,"success");};
  const submitReq=()=>{if(!reqForm.need.trim()){toast("Describe what you need.","error");return;}const r={id:uid(),receiverId:user.id,receiverName:user.name,...reqForm,status:"open",createdAt:Date.now()};_requests.push(r);setMyReqs(p=>[...p,r]);setReqForm({need:"",urgency:"medium"});setShowReqForm(false);toast("Request submitted!","success");};
  return(<div>
    <div className="dash-cards"><div className="dash-card"><div className="dash-card-num">{available.length}</div><div className="dash-card-label">Available Now</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"var(--secondary)"}}>{claimed}</div><div className="dash-card-label">Claimed</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"#1e40af"}}>{myReqs.length}</div><div className="dash-card-label">My Requests</div></div></div>
    <div className="tab-bar"><button className={`tab${tab==="browse"?" active":""}`} onClick={()=>setTab("browse")}>Browse Food</button><button className={`tab${tab==="requests"?" active":""}`} onClick={()=>setTab("requests")}>My Requests</button></div>
    {tab==="browse"&&<><div className="dash-section-title">Available Donations</div>{available.length===0&&<div className="empty-state"><Icon name="box" size={48}/><p>Nothing available right now.</p></div>}<div className="listings">{available.map(l=>(<div key={l.id} className="listing-item"><div><div className="listing-info-name">{l.foodName}</div><div className="listing-info-meta">{l.quantity} · {l.category} · By <strong>{l.donorName}</strong> · Expires {fmt(l.expiry)}</div></div><button className="btn btn-primary btn-sm" onClick={()=>claim(l)}><Icon name="heart" size={15}/> Claim</button></div>))}</div></>}
    {tab==="requests"&&<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div className="dash-section-title">My Requests</div><button className="btn btn-primary btn-sm" onClick={()=>setShowReqForm(f=>!f)}><Icon name="plus" size={16}/> {showReqForm?"Cancel":"New"}</button></div>{showReqForm&&<div className="listing-form"><div className="form-group"><label className="form-label">What do you need?</label><textarea className="form-input" rows={3} style={{resize:"vertical"}} value={reqForm.need} onChange={e=>setReqForm(f=>({...f,need:e.target.value}))}/></div><div className="form-group"><label className="form-label">Urgency</label><select className="form-input form-select" value={reqForm.urgency} onChange={e=>setReqForm(f=>({...f,urgency:e.target.value}))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div><button className="btn btn-primary btn-sm" onClick={submitReq}><Icon name="check" size={15}/> Submit</button></div>}{myReqs.length===0&&!showReqForm&&<div className="empty-state"><Icon name="inbox" size={48}/><p>No requests yet.</p></div>}<div className="listings">{myReqs.map(r=>(<div key={r.id} className="listing-item"><div><div className="listing-info-name">{r.need.length>60?r.need.slice(0,60)+"…":r.need}</div><div className="listing-info-meta">{fmt(r.createdAt)}</div></div><span className={`badge ${r.urgency==="high"?"badge-red":r.urgency==="medium"?"badge-yellow":"badge-blue"}`}>{r.urgency}</span></div>))}</div></>}
  </div>);
};

const AdminDashboard=({user,toast})=>{
  const [tab,setTab]=useState("content");
  const [listings,setListings]=useState([..._listings]);
  const [requests,setRequests]=useState([..._requests]);
  const [users,setUsers]=useState([..._users]);
  const refresh=()=>{setListings([..._listings]);setRequests([..._requests]);setUsers([..._users]);};
  const approve=id=>{const l=_listings.find(x=>x.id===id);if(l){l.status="available";refresh();toast("Approved.","success");}};
  const removeL=id=>{_listings=_listings.filter(l=>l.id!==id);refresh();toast("Removed.","success");};
  const closeReq=id=>{const r=_requests.find(x=>x.id===id);if(r){r.status="fulfilled";refresh();toast("Fulfilled.","success");}};
  const removeU=id=>{_users=_users.filter(u=>u.id!==id);refresh();toast("User removed.","success");};
  const stats={users:users.length,listings:listings.length,available:listings.filter(l=>l.status==="available").length,requests:requests.filter(r=>r.status==="open").length};
  return(<div>
    <div className="dash-cards"><div className="dash-card"><div className="dash-card-num">{stats.users}</div><div className="dash-card-label">Users</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"var(--secondary)"}}>{stats.listings}</div><div className="dash-card-label">Listings</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"#166534"}}>{stats.available}</div><div className="dash-card-label">Available</div></div><div className="dash-card"><div className="dash-card-num" style={{color:"#1e40af"}}>{stats.requests}</div><div className="dash-card-label">Open Requests</div></div></div>
    <div className="tab-bar">{[["content","⚙️ Site Content"],["listings","Listings"],["requests","Requests"],["users","Users"]].map(([id,label])=>(<button key={id} className={`tab${tab===id?" active":""}`} onClick={()=>setTab(id)}>{label}</button>))}</div>
    {tab==="content"&&<CMSEditor toast={toast}/>}
    {tab==="listings"&&<><div className="dash-section-title">All Listings</div><div className="listings">{listings.map(l=>(<div key={l.id} className="listing-item"><div><div className="listing-info-name">{l.foodName}</div><div className="listing-info-meta">{l.quantity} · {l.category} · By {l.donorName} · Expires {fmt(l.expiry)}</div></div><div className="listing-actions"><span className={`badge ${l.status==="available"?"badge-green":"badge-yellow"}`}>{l.status}</span>{l.status!=="available"&&<button className="btn btn-ghost btn-sm" onClick={()=>approve(l.id)}><Icon name="check" size={15}/></button>}<button className="btn btn-ghost btn-sm" style={{color:"#e53e3e"}} onClick={()=>removeL(l.id)}><Icon name="trash" size={15}/></button></div></div>))}{listings.length===0&&<div className="empty-state"><Icon name="box" size={48}/><p>No listings.</p></div>}</div></>}
    {tab==="requests"&&<><div className="dash-section-title">All Requests</div>{requests.map(r=>(<div key={r.id} className="request-card"><div className="request-card-top"><div><div className="request-card-title">{r.receiverName}</div><div style={{fontSize:".8rem",color:"var(--muted)"}}>{fmt(r.createdAt)}</div></div><div style={{display:"flex",gap:8}}><span className={`badge ${r.urgency==="high"?"badge-red":r.urgency==="medium"?"badge-yellow":"badge-blue"}`}>{r.urgency}</span><span className={`badge ${r.status==="open"?"badge-green":"badge-yellow"}`}>{r.status}</span></div></div><div className="request-card-body">{r.need}</div>{r.status==="open"&&<div style={{marginTop:12}}><button className="btn btn-primary btn-sm" onClick={()=>closeReq(r.id)}><Icon name="check" size={15}/> Fulfilled</button></div>}</div>))}{requests.length===0&&<div className="empty-state"><Icon name="inbox" size={48}/><p>No requests.</p></div>}</>}
    {tab==="users"&&<><div className="dash-section-title">All Users</div><div className="listings">{users.map(u=>(<div key={u.id} className="listing-item"><div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{width:40,height:40,borderRadius:"50%",background:u.role==="admin"?"#1a0a05":u.role==="donor"?"var(--primary)":"#2b7ac9",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"'Playfair Display',serif",fontWeight:700,flexShrink:0}}>{u.name[0]}</div><div><div className="listing-info-name">{u.name}</div><div className="listing-info-meta">{u.email}</div></div></div><div style={{display:"flex",gap:8,alignItems:"center"}}><span className={`badge ${u.role==="admin"?"badge-red":u.role==="donor"?"badge-green":"badge-blue"}`}>{u.role}</span>{u.role!=="admin"&&<button className="btn btn-ghost btn-sm" style={{color:"#e53e3e"}} onClick={()=>removeU(u.id)}><Icon name="trash" size={15}/></button>}</div></div>))}</div></>}
  </div>);
};

const Dashboard=({user,toast,setPage,onLogout})=>{
  const Comp=user.role==="admin"?AdminDashboard:user.role==="donor"?DonorDashboard:ReceiverDashboard;
  return(<div className="dashboard"><div className="dash-header"><div className="dash-header-inner"><div><div className="dash-greeting display">Welcome, {user.name} 👋</div><div style={{color:"var(--muted)",fontSize:".88rem",marginTop:4}}>{user.email}</div></div><div style={{display:"flex",gap:10,alignItems:"center"}}><span className="dash-role-badge">{user.role}</span><button className="btn btn-ghost btn-sm" onClick={()=>setPage("home")}><Icon name="arrow" size={15}/> Home</button><button className="btn btn-ghost btn-sm" style={{color:"#e53e3e"}} onClick={onLogout}><Icon name="logout" size={15}/> Logout</button></div></div></div><div className="dash-main"><Comp user={user} toast={toast}/></div></div>);
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  const [user,setUser]=useState(null);
  const [modal,setModal]=useState(null);
  const [registerRole,setRegisterRole]=useState(null);
  const [toastData,setToastData]=useState(null);
  const css=useDynamicCSS();

  useEffect(()=>{window.scrollTo(0,0);},[page]);
  const showToast=(msg,type="success")=>setToastData({msg,type,key:Date.now()});
  const openLogin=()=>setModal("login");
  const openRegister=role=>{setRegisterRole(role||null);setModal("register");};
  const handleLogin=u=>{setUser(u);setModal(null);setPage("dashboard");showToast(`Welcome back, ${u.name.split(" ")[0]}!`);};
  const handleRegister=u=>{setUser(u);setModal(null);setPage("dashboard");showToast(`Welcome, ${u.name.split(" ")[0]} 🎉`);};
  const handleLogout=()=>{setUser(null);setPage("home");showToast("Signed out.");};

  return(<>
    <style>{css}</style>
    {page!=="dashboard"&&<Navbar setPage={setPage} user={user} onLogin={openLogin} onRegister={()=>openRegister()} onLogout={handleLogout}/>}
    <main style={page!=="dashboard"?{paddingTop:64}:{}}>
      {page==="home"&&<HomePage openLogin={openLogin} openRegister={openRegister}/>}
      {page==="about"&&<AboutPage openRegister={openRegister}/>}
      {page==="contact"&&<ContactPage setPage={setPage}/>}
      {page==="privacy"&&<PrivacyPage setPage={setPage}/>}
      {page==="dashboard"&&user&&<Dashboard user={user} toast={showToast} setPage={setPage} onLogout={handleLogout}/>}
      {page==="dashboard"&&!user&&(()=>{setTimeout(()=>{setPage("home");openLogin();},0);return null;})()}
    </main>
    {page!=="dashboard"&&<Footer setPage={setPage}/>}
    {modal==="login"&&<LoginModal onClose={()=>setModal(null)} onSuccess={handleLogin} onSwitch={()=>setModal("register")}/>}
    {modal==="register"&&<RegisterModal defaultRole={registerRole} onClose={()=>setModal(null)} onSuccess={handleRegister} onSwitch={()=>setModal("login")}/>}
    {toastData&&<Toast key={toastData.key} msg={toastData.msg} type={toastData.type} onDone={()=>setToastData(null)}/>}
  </>);
}
