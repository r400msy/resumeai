import { useState, useEffect, useRef, createContext, useContext } from "react";

const API = "/api/generate";
const BRAND = "SwiftCV";

/* ── Themes ──────────────────────────────────────────────────── */
const themes = {
  light: {
    bg:         "#f4f8ff",
    surface:    "#ffffff",
    primary:    "#1565c0",
    primHover:  "#1248a8",
    primaryFg:  "#ffffff",
    copper:     "#1976d2",
    copperLt:   "#2196f3",
    copperPale: "#e3f2fd",
    teal:       "#0097a7",
    tealLt:     "#00acc1",
    gold:       "#e65100",
    goldLt:     "#ef6c00",
    border:     "#dce7f5",
    text:       "#0d1f3c",
    textMid:    "#2d4a70",
    textSoft:   "#607090",
    errBg:      "#fef2f2",
    errBorder:  "#fca5a5",
    errText:    "#b91c1c",
  },
  dark: {
    bg:         "#080e1a",
    surface:    "#0f1828",
    primary:    "#5b9cf6",
    primHover:  "#74aaf8",
    primaryFg:  "#080e1a",
    copper:     "#ff9640",
    copperLt:   "#ffac62",
    copperPale: "#ff964015",
    teal:       "#26d0ce",
    tealLt:     "#40dede",
    gold:       "#ffcc42",
    goldLt:     "#ffd966",
    border:     "#182038",
    text:       "#ccd8ee",
    textMid:    "#6888b8",
    textSoft:   "#486090",
    errBg:      "#180c0c",
    errBorder:  "#6b1d1d",
    errText:    "#f87171",
  },
};

const Ctx = createContext(themes.light);
const useT = () => useContext(Ctx);

/* ── Fonts & Dynamic CSS ─────────────────────────────────────── */
const fonts = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');`;

const buildCss = t => `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{scroll-behavior:smooth;overflow-x:hidden;max-width:100%;}
body{background:${t.bg};color:${t.text};font-family:'Poppins',sans-serif;min-height:100vh;transition:background-color .4s,color .3s;width:100%;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:${t.bg};}
::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
@keyframes shimmer{0%{background-position:-400px 0;}100%{background-position:400px 0;}}
.a0{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) both;}
.a1{animation:fadeUp .55s .06s cubic-bezier(.16,1,.3,1) both;}
.a2{animation:fadeUp .55s .12s cubic-bezier(.16,1,.3,1) both;}
.a3{animation:fadeUp .55s .18s cubic-bezier(.16,1,.3,1) both;}
.a4{animation:fadeUp .55s .24s cubic-bezier(.16,1,.3,1) both;}
.a5{animation:fadeUp .55s .30s cubic-bezier(.16,1,.3,1) both;}
input,textarea,select{outline:none;font-family:'Poppins',sans-serif;}
button{cursor:pointer;font-family:'Poppins',sans-serif;}
textarea{resize:vertical;}
.field-input{width:100%;padding:10px 0;border:none;border-bottom:2px solid ${t.border};background:transparent;font-size:14px;color:${t.text};transition:border-color .2s;font-family:'Poppins',sans-serif;}
.field-input:focus{border-bottom-color:${t.copper};outline:none;}
.field-input::placeholder{color:${t.textSoft};}
/* ── Responsive ─────────────────────────────────────────── */
.card-inner{padding:44px 52px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:0 28px;}
.step-label{font-size:12.5px;}
.hero-stat{text-align:center;padding:0 32px;}
.hero-stat+.hero-stat{border-left:1px solid ${t.border};}
@media(max-width:680px){
  .card-inner{padding:28px 24px;}
  .hero-stat{padding:0 20px;}
}
@media(max-width:480px){
  .card-inner{padding:20px 16px;}
  .two-col{grid-template-columns:1fr;}
  .step-label{display:none;}
  .hero-stat{padding:0 12px;}
  .paywall-features{grid-template-columns:1fr!important;}
}
`;

/* ── Upsell Config ───────────────────────────────────────────── */
const UPSELLS_DEF = [
  { id:"cover",    icon:"✉", title:"Cover Letter",    desc:"AI-crafted cover letter perfectly matched to your resume",           price:"£2.99", cta:"Add Cover Letter",  ck:"copper" },
  { id:"linkedin", icon:"◈", title:"LinkedIn Bio",     desc:"Optimised LinkedIn About section that gets noticed by recruiters",  price:"£1.99", cta:"Add LinkedIn Bio",  ck:"teal"   },
  { id:"ats",      icon:"◎", title:"ATS Score Report", desc:"See exactly how your resume scores against ATS systems + fix tips", price:"£3.99", cta:"Get ATS Report",    ck:"gold"   },
];

const steps = ["Your Info", "Experience", "Skills", "Resume"];

/* ── Theme Toggle ────────────────────────────────────────────── */
function ThemeToggle({ mode, onToggle }) {
  const t = useT();
  const dark = mode === "dark";
  const [h, setH] = useState(false);
  return (
    <button onClick={onToggle} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:"4px 2px", opacity:h?.85:1, transition:"opacity .15s" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? t.textSoft : t.copper} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <div style={{ width:36, height:20, borderRadius:10, background:dark?t.primary:t.border, position:"relative", transition:"background .35s ease", flexShrink:0 }}>
        <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:dark?19:3, transition:"left .3s ease", boxShadow:"0 1px 4px rgba(0,0,0,.3)" }} />
      </div>
      <svg width="13" height="13" viewBox="0 0 24 24" fill={dark?t.primary:"none"} stroke={dark?t.primary:t.textSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  );
}

/* ── Primitives ──────────────────────────────────────────────── */
function Label({ children }) {
  const t = useT();
  return <label style={{ display:"block", fontSize:10, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".12em", marginBottom:8 }}>{children}</label>;
}

function Input({ label, value, onChange, placeholder, type="text", hint }) {
  const t = useT();
  return (
    <div style={{ marginBottom:22 }}>
      {label && <Label>{label}</Label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="field-input" />
      {hint && <p style={{ fontSize:11, color:t.textSoft, marginTop:5 }}>{hint}</p>}
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=4 }) {
  return (
    <div style={{ marginBottom:22 }}>
      {label && <Label>{label}</Label>}
      <textarea value={value} placeholder={placeholder} rows={rows} onChange={e => onChange(e.target.value)} className="field-input" style={{ lineHeight:1.65 }} />
    </div>
  );
}

function Btn({ children, onClick, variant="primary", disabled, small, style:sx={} }) {
  const t = useT();
  const [h, setH] = useState(false);
  const base = { padding:small?"8px 18px":"11px 26px", borderRadius:8, fontSize:small?13:14, fontWeight:600, border:"none", letterSpacing:".01em", transition:"all .2s ease", opacity:disabled?.45:1, cursor:disabled?"not-allowed":"pointer", ...sx };
  const vs = {
    primary: { background:h&&!disabled?t.primHover:t.primary, color:t.primaryFg, boxShadow:h&&!disabled?`0 6px 22px ${t.primary}50`:`0 2px 8px ${t.primary}30`, transform:h&&!disabled?"translateY(-1px)":"none" },
    sky:     { background:h&&!disabled?t.tealLt:t.teal, color:t.primaryFg, boxShadow:h&&!disabled?`0 6px 22px ${t.teal}50`:`0 2px 8px ${t.teal}30`, transform:h&&!disabled?"translateY(-1px)":"none" },
    ghost:   { background:"transparent", color:h?t.copper:t.textMid, border:`1.5px solid ${h?t.copper:t.border}` },
    copper:  { background:h&&!disabled?t.copperLt:t.copper, color:t.primaryFg, boxShadow:h&&!disabled?`0 6px 22px ${t.copper}50`:`0 2px 8px ${t.copper}30`, transform:h&&!disabled?"translateY(-1px)":"none" },
  };
  return <button onClick={disabled?undefined:onClick} disabled={disabled} style={{...base,...vs[variant]}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</button>;
}

/* ── Steps Indicator ─────────────────────────────────────────── */
function StepsBar({ current }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:40 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display:"flex", alignItems:"center", flex:i<steps.length-1?1:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{
              width:28, height:28, borderRadius:"50%", fontSize:11, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center",
              background:i<current?t.copper:i===current?t.primary:"transparent",
              border:`2px solid ${i<current?t.copper:i===current?t.primary:t.border}`,
              color:i<=current?t.primaryFg:t.textSoft, transition:"all .3s ease",
              boxShadow:i===current?`0 0 0 4px ${t.primary}18`:"none",
            }}>{i < current ? "✓" : i + 1}</div>
            <span className="step-label" style={{ fontWeight:i===current?600:400, color:i===current?t.primary:i<current?t.copper:t.textSoft, transition:"color .3s" }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex:1, height:2, margin:"0 12px", background:i<current?t.copper:t.border, transition:"background .4s ease", borderRadius:2 }} />}
        </div>
      ))}
    </div>
  );
}

/* ── Step Header ─────────────────────────────────────────────── */
function StepHead({ title, subtitle }) {
  const t = useT();
  return (
    <>
      <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:26, fontWeight:700, marginBottom:6, color:t.primary, letterSpacing:"-.02em" }}>{title}</h2>
      <p style={{ color:t.textSoft, marginBottom:32, fontSize:13.5, lineHeight:1.6 }}>{subtitle}</p>
    </>
  );
}

/* ── Step 1 ──────────────────────────────────────────────────── */
function Step1({ form, setForm, onNext }) {
  const u = k => v => setForm(f => ({ ...f, [k]:v }));
  return (
    <div className="a0">
      <StepHead title="Personal Details" subtitle="Let's start with the basics." />
      <div className="two-col">
        <Input label="Full Name" value={form.name} onChange={u("name")} placeholder="Alex Johnson" />
        <Input label="Job Title" value={form.title} onChange={u("title")} placeholder="Senior UX Designer" />
        <Input label="Email" value={form.email} onChange={u("email")} placeholder="alex@email.com" type="email" />
        <Input label="Phone" value={form.phone} onChange={u("phone")} placeholder="+44 7700 000000" />
      </div>
      <Input label="Location" value={form.location} onChange={u("location")} placeholder="London, UK" />
      <Textarea label="Brief Summary (optional — AI will enhance it)" value={form.summary} onChange={u("summary")} placeholder="Short intro about your background..." rows={3} />
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
        <Btn onClick={onNext} disabled={!form.name || !form.email}>Continue →</Btn>
      </div>
    </div>
  );
}

/* ── Step 2 ──────────────────────────────────────────────────── */
function Step2({ form, setForm, onNext, onBack }) {
  const t = useT();
  const add = () => setForm(f => ({ ...f, experience:[...f.experience, { company:"", role:"", duration:"", description:"" }] }));
  const upd = (i, k, v) => setForm(f => { const e = [...f.experience]; e[i] = { ...e[i], [k]:v }; return { ...f, experience:e }; });
  const rem = i => setForm(f => ({ ...f, experience:f.experience.filter((_, j) => j !== i) }));
  return (
    <div className="a0">
      <StepHead title="Work Experience" subtitle="Add your roles — AI will write compelling bullet points." />
      {form.experience.map((exp, i) => (
        <div key={i} style={{ border:`1px solid ${t.border}`, borderLeft:`3px solid ${t.copper}`, borderRadius:"0 10px 10px 0", padding:"20px 20px 4px", marginBottom:14, background:t.surface }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:10, fontWeight:700, color:t.copper, textTransform:"uppercase", letterSpacing:".12em" }}>Role {i + 1}</span>
            {form.experience.length > 1 && <button onClick={() => rem(i)} style={{ background:"none", border:"none", color:t.textSoft, fontSize:16, lineHeight:1 }}>✕</button>}
          </div>
          <div className="two-col">
            <Input label="Company" value={exp.company} onChange={v => upd(i,"company",v)} placeholder="Acme Ltd" />
            <Input label="Job Title" value={exp.role} onChange={v => upd(i,"role",v)} placeholder="Product Manager" />
          </div>
          <Input label="Dates" value={exp.duration} onChange={v => upd(i,"duration",v)} placeholder="Mar 2022 – Present" />
          <Textarea label="What did you do? (rough notes fine)" value={exp.description} onChange={v => upd(i,"description",v)} placeholder="Managed roadmap, led team of 5, launched 3 features, increased retention by 18%..." rows={3} />
        </div>
      ))}
      <button onClick={add} style={{ width:"100%", padding:11, background:"transparent", border:`1.5px dashed ${t.border}`, borderRadius:8, color:t.textSoft, fontSize:13, marginBottom:22, transition:"all .2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.copper; e.currentTarget.style.color = t.copper; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSoft; }}>
        + Add another role
      </button>
      <Textarea label="Education" value={form.education} onChange={v => setForm(f => ({ ...f, education:v }))} placeholder="BSc Computer Science, University of Manchester, 2020" rows={2} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={onNext}>Continue →</Btn>
      </div>
    </div>
  );
}

/* ── Step 3 ──────────────────────────────────────────────────── */
function Step3({ form, setForm, onNext, onBack }) {
  const t = useT();
  const u = k => v => setForm(f => ({ ...f, [k]:v }));
  const tones = ["professional","confident","creative","technical","executive"];
  return (
    <div className="a0">
      <StepHead title="Skills & Target Role" subtitle="This is what the AI optimises for." />
      <Textarea label="Your Skills" value={form.skills} onChange={u("skills")} placeholder="React, TypeScript, Figma, Python, SQL, Agile, Leadership..." rows={3} />
      <Input label="Target Job" value={form.targetJob} onChange={u("targetJob")} placeholder="e.g. Senior Frontend Engineer at a tech startup" hint="Be specific — the more detail, the better the AI tailors your resume." />
      <div style={{ marginBottom:22 }}>
        <Label>Tone</Label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {tones.map(tone => (
            <button key={tone} onClick={() => setForm(f => ({ ...f, tone }))} style={{ padding:"6px 16px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer", border:`1.5px solid ${form.tone===tone?t.primary:t.border}`, background:form.tone===tone?t.primary:"transparent", color:form.tone===tone?t.primaryFg:t.textMid, transition:"all .18s", textTransform:"capitalize" }}>{tone}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={onNext} disabled={!form.skills || !form.targetJob}>Generate Resume ✦</Btn>
      </div>
    </div>
  );
}

/* ── Upsell Card ─────────────────────────────────────────────── */
function UpsellCard({ item, onBuy, bought }) {
  const t = useT();
  const [h, setH] = useState(false);
  const color = t[item.ck];
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ border:`1px solid ${h?color:t.border}`, borderRadius:10, padding:"14px 18px", background:t.surface, transition:"all .2s", display:"flex", alignItems:"center", gap:16, boxShadow:h?`0 6px 24px ${color}20`:"none", transform:h?"translateY(-2px)":"none" }}>
      <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, background:`${color}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color, fontWeight:700 }}>{item.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:600, fontSize:13.5, color:t.primary }}>{item.title}</p>
            <p style={{ fontSize:11.5, color:t.textSoft, marginTop:2, lineHeight:1.5 }}>{item.desc}</p>
          </div>
          <div style={{ marginLeft:16, textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:14, fontWeight:700, color }}>{item.price}</div>
            {bought
              ? <div style={{ color:t.teal, fontSize:11.5, fontWeight:600, marginTop:3 }}>✓ Added</div>
              : <button onClick={() => onBuy(item.id)} style={{ marginTop:5, padding:"4px 12px", borderRadius:6, fontSize:11.5, fontWeight:600, border:`1.5px solid ${color}`, background:"transparent", color, cursor:"pointer", transition:"all .18s", display:"block" }}
                  onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = t.primaryFg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = color; }}>
                  {item.cta} →
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Paywall Overlay ─────────────────────────────────────────── */
function Paywall({ resume, targetJob, name, onUnlock }) {
  const t = useT();
  const [btnH, setBtnH] = useState(false);

  const features = [
    "Full professional CV — ready to send",
    "ATS-optimised for applicant tracking systems",
    "Tailored specifically to your target role",
    "Instant copy & download in plain text",
  ];

  return (
    <div style={{ position:"relative", marginBottom:28, animation:"fadeIn .4s ease both" }}>

      {/* Blurred resume preview */}
      <div style={{ position:"relative", overflow:"hidden", borderRadius:10, border:`1px solid ${t.border}` }}>
        <div style={{
          padding:"36px 40px", fontFamily:"'Poppins',sans-serif",
          fontSize:13, lineHeight:1.9, color:t.text, whiteSpace:"pre-wrap",
          background:t.surface, filter:"blur(5px)", userSelect:"none", pointerEvents:"none",
          maxHeight:260, overflow:"hidden",
        }}>
          {resume}
        </div>
        {/* Gradient fade */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:160,
          background:`linear-gradient(to bottom, transparent, ${t.surface})`,
          pointerEvents:"none",
        }} />
        {/* Lock icon centered */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", opacity:.15, pointerEvents:"none" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill={t.primary} stroke="none">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>

      {/* Paywall card */}
      <div style={{
        marginTop:"-1px", border:`1.5px solid ${t.copper}40`, borderRadius:"0 0 14px 14px",
        background:t.surface, padding:"32px 36px 28px",
        boxShadow:`0 12px 48px ${t.primary}14`,
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:t.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primaryFg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:19, fontWeight:800, color:t.primary, letterSpacing:"-.02em" }}>
              Your CV is Ready to Unlock
            </h3>
            <p style={{ fontSize:12.5, color:t.textSoft, marginTop:2 }}>
              Tailored for <strong style={{ color:t.copper }}>{targetJob}</strong> — crafted in seconds by AI
            </p>
          </div>
        </div>

        <p style={{ fontSize:13.5, color:t.textMid, lineHeight:1.7, marginBottom:20, marginTop:14 }}>
          Your professional CV has been carefully crafted by our AI and is personalised specifically for you, <strong style={{ color:t.text }}>{name}</strong>. Unlock it now to copy, download, and start applying today.
        </p>

        {/* Features */}
        <div className="paywall-features" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 16px", marginBottom:24 }}>
          {features.map(f => (
            <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:`${t.copper}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.copper} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span style={{ fontSize:12.5, color:t.textMid, lineHeight:1.5 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:32, fontWeight:800, color:t.primary, letterSpacing:"-.03em" }}>£4.99</span>
              <span style={{ fontSize:12, color:t.textSoft, textDecoration:"line-through" }}>£14.99</span>
            </div>
            <p style={{ fontSize:11, color:t.textSoft, marginTop:2 }}>One-time · No subscription</p>
          </div>
          <button
            onClick={onUnlock}
            onMouseEnter={() => setBtnH(true)}
            onMouseLeave={() => setBtnH(false)}
            style={{
              flex:1, minWidth:200, padding:"14px 28px", borderRadius:10, fontSize:15,
              fontWeight:700, border:"none", cursor:"pointer", letterSpacing:".01em",
              background:btnH?t.primHover:t.primary, color:t.primaryFg,
              boxShadow:btnH?`0 10px 36px ${t.primary}55`:`0 4px 20px ${t.primary}35`,
              transform:btnH?"translateY(-2px)":"none", transition:"all .22s ease",
            }}
          >
            🔓 Unlock My CV Now →
          </button>
        </div>

        {/* Trust signals */}
        <div style={{ display:"flex", gap:20, marginTop:16, flexWrap:"wrap" }}>
          {["🔒 Secure Checkout", "⚡ Instant Access", "↩ 30-Day Guarantee", "👥 50,000+ Job Seekers"].map(s => (
            <span key={s} style={{ fontSize:11, color:t.textSoft, fontWeight:500 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 4 ──────────────────────────────────────────────────── */
function Step4({ form, onBack, onReset }) {
  const t = useT();
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bought, setBought] = useState({});
  const [upsellContent, setUpsellContent] = useState({});
  const [activeTab, setActiveTab] = useState("resume");
  const fetched = useRef(false);

  useEffect(() => { if (!fetched.current) { fetched.current = true; generate(); } }, []);

  const buildPrompt = () => {
    const exp = form.experience.map((e, i) => `${i+1}. ${e.role} at ${e.company} (${e.duration}): ${e.description}`).join("\n");
    return `You are an expert resume writer. Write a polished, ATS-optimised resume.

Name: ${form.name} | Title: ${form.title} | Email: ${form.email} | Phone: ${form.phone} | Location: ${form.location}
Summary provided: ${form.summary || "none"}
Education: ${form.education}
Skills: ${form.skills}
Target role: ${form.targetJob}
Tone: ${form.tone}

Experience:
${exp}

Write a complete resume in clean plain text:
- Start with the person's name (no "Resume" header)
- 3-4 line professional summary tailored to target role
- Each role: 3-5 bullet points with action verbs and metrics
- Skills organised by category
- Section headers in ALL CAPS, bullets use •
- ${form.tone} tone throughout`;
  };

  const generate = async () => {
    setLoading(true); setError(""); setUnlocked(false);
    try {
      const res = await fetch(API, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:buildPrompt() }] }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      if (!text) throw new Error(data.error?.message || "Empty response from API");
      setResume(text);
    } catch(e) { setError(`Generation failed: ${e.message}. Please try again.`); }
    finally { setLoading(false); }
  };

  const buyUpsell = async (id) => {
    setBought(b => ({ ...b, [id]:true }));
    setActiveTab(id);
    const prompts = {
      cover:    `Write a compelling ${form.tone} cover letter for ${form.name} applying for: ${form.targetJob}. Experience: ${form.experience.map(e => `${e.role} at ${e.company}`).join(", ")}. Skills: ${form.skills}. Under 350 words. No placeholders.`,
      linkedin: `Write an optimised LinkedIn About section for ${form.name}, targeting: ${form.targetJob}. Background: ${form.experience.map(e => `${e.role} at ${e.company}`).join(", ")}. Skills: ${form.skills}. First person, 3-4 paragraphs, ends with a value proposition.`,
      ats:      `Analyse this candidate's resume for ATS compatibility against the target role: "${form.targetJob}". Name: ${form.name}. Skills: ${form.skills}. Experience: ${form.experience.map(e => `${e.role} at ${e.company}`).join(", ")}. Provide: 1) Overall ATS Score X/100, 2) Keyword Match (present vs missing), 3) Format Score, 4) 5 specific improvements. Be direct and specific.`,
    };
    try {
      const res = await fetch(API, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:prompts[id] }] }) });
      const data = await res.json();
      setUpsellContent(u => ({ ...u, [id]:data.content?.map(b => b.text || "").join("") || "" }));
    } catch { setUpsellContent(u => ({ ...u, [id]:"Error generating. Please try again." })); }
  };

  const copy = () => {
    const content = activeTab === "resume" ? resume : upsellContent[activeTab];
    navigator.clipboard.writeText(content || "");
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [{ id:"resume", label:"Resume" }, ...Object.keys(bought).map(id => ({ id, label:UPSELLS_DEF.find(u => u.id === id)?.title }))];
  const activeContent = activeTab === "resume" ? resume : upsellContent[activeTab];
  const isLoading = activeTab === "resume" ? loading : (bought[activeTab] && !upsellContent[activeTab]);

  return (
    <div className="a0">
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:26, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:26, fontWeight:700, color:t.primary, marginBottom:4, letterSpacing:"-.02em" }}>
            {unlocked ? "Your Resume is Ready ✓" : "Your Resume Has Been Generated"}
          </h2>
          <p style={{ fontSize:13, color:t.textSoft }}>
            Tailored for: <span style={{ color:t.copper, fontWeight:600 }}>{form.targetJob}</span>
          </p>
        </div>
        {unlocked && !loading && resume && (
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="ghost" onClick={generate} small>↺ Redo</Btn>
            <Btn variant="copper" onClick={copy} small>{copied ? "✓ Copied!" : "Copy Text"}</Btn>
          </div>
        )}
      </div>

      {/* Tabs (only when unlocked + extra content) */}
      {unlocked && tabs.length > 1 && (
        <div style={{ display:"flex", marginBottom:20, borderBottom:`2px solid ${t.border}` }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding:"9px 18px", fontSize:13, fontWeight:600, border:"none", background:"none", cursor:"pointer", color:activeTab===tab.id?t.primary:t.textSoft, borderBottom:`2px solid ${activeTab===tab.id?t.copper:"transparent"}`, marginBottom:-2, transition:"all .18s" }}>{tab.label}</button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:"48px 32px", textAlign:"center", marginBottom:22 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", margin:"0 auto 18px", border:`2.5px solid ${t.border}`, borderTopColor:t.copper, animation:"spin .8s linear infinite" }} />
          <p style={{ fontFamily:"'Montserrat',sans-serif", color:t.textMid, fontSize:18, fontWeight:600 }}>Crafting your CV...</p>
          <p style={{ color:t.textSoft, fontSize:13, marginTop:5 }}>Optimising for {form.targetJob}</p>
        </div>
      ) : error && activeTab === "resume" ? (
        <div style={{ background:t.errBg, border:`1px solid ${t.errBorder}`, borderRadius:8, padding:18, marginBottom:22 }}>
          <p style={{ color:t.errText, fontSize:14 }}>{error}</p>
          <Btn variant="ghost" onClick={generate} small style={{ marginTop:10 }}>Try Again</Btn>
        </div>
      ) : resume && !unlocked && activeTab === "resume" ? (
        /* ── PAYWALL ── */
        <Paywall resume={resume} targetJob={form.targetJob} name={form.name} onUnlock={() => setUnlocked(true)} />
      ) : activeContent ? (
        /* ── Unlocked content ── */
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:"36px 40px", marginBottom:22, fontFamily:"'Poppins',sans-serif", fontSize:13, lineHeight:1.9, color:t.text, whiteSpace:"pre-wrap", boxShadow:`0 2px 20px ${t.primary}08` }}>
          {activeContent}
        </div>
      ) : null}

      {/* Upsells — only shown after unlock */}
      {unlocked && activeTab === "resume" && !loading && resume && (
        <div style={{ marginBottom:26 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:t.border }} />
            <span style={{ fontSize:10, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".12em", whiteSpace:"nowrap" }}>Supercharge Your Application</span>
            <div style={{ flex:1, height:1, background:t.border }} />
          </div>
          <div style={{ display:"grid", gap:10 }}>
            {UPSELLS_DEF.map(item => <UpsellCard key={item.id} item={item} onBuy={buyUpsell} bought={!!bought[item.id]} />)}
          </div>
          <p style={{ fontSize:11, color:t.textSoft, textAlign:"center", marginTop:12 }}>🔒 Secure payment · Instant delivery · No subscription</p>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <Btn variant="ghost" onClick={onBack}>← Edit</Btn>
        <Btn variant="ghost" onClick={onReset} style={{ color:t.textSoft }}>Start over</Btn>
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero({ onStart }) {
  const t = useT();
  const [btnH, setBtnH] = useState(false);
  return (
    <div style={{ maxWidth:680, width:"100%", margin:"0 auto", padding:"32px 24px 28px", textAlign:"center" }}>
      <div className="a0" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:24, background:t.copperPale, border:`1px solid ${t.copper}40`, color:t.copper, fontSize:11, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:20 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:t.copper, display:"inline-block", animation:"pulse 2s infinite" }} />
        AI-Powered · Free to Start
      </div>

      <h1 className="a1" style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:"clamp(32px,5.5vw,60px)", lineHeight:1.1, color:t.primary, marginBottom:14, letterSpacing:"-.03em" }}>
        Your CV, Built by AI.<br />
        <em style={{ fontStyle:"italic", fontWeight:700, color:t.copper }}>In 2 minutes.</em>
      </h1>

      <p className="a2" style={{ fontSize:15.5, color:t.textMid, lineHeight:1.7, maxWidth:440, margin:"0 auto 24px" }}>
        Tailored to your target role. ATS-optimised. Recruiter-ready.
      </p>

      <div className="a3" style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
        {[{ n:"2 min", l:"to build" }, { n:"ATS", l:"optimised" }, { n:"50k+", l:"job seekers" }].map(s => (
          <div key={s.n} className="hero-stat">
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:26, fontWeight:800, color:t.primary, lineHeight:1 }}>{s.n}</div>
            <div style={{ fontSize:11.5, color:t.textSoft, marginTop:4, letterSpacing:".03em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="a4">
        <button onClick={onStart} onMouseEnter={() => setBtnH(true)} onMouseLeave={() => setBtnH(false)} style={{ padding:"14px 44px", fontSize:15, fontWeight:700, letterSpacing:".02em", background:btnH?t.primHover:t.primary, color:t.primaryFg, border:"none", borderRadius:10, cursor:"pointer", boxShadow:btnH?`0 12px 40px ${t.primary}55`:`0 4px 20px ${t.primary}35`, transform:btnH?"translateY(-2px)":"none", transition:"all .22s ease" }}>
          Build My CV — Free →
        </button>
        <p style={{ fontSize:12, color:t.textSoft, marginTop:10 }}>No sign-up required · 2 minutes · 100% free to start</p>
      </div>

      <div className="a5" style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginTop:24 }}>
        {["✓ ATS Optimised", "✓ Recruiter-Approved", "✓ Role-Tailored", "✓ Instant Results"].map(f => (
          <span key={f} style={{ padding:"6px 14px", borderRadius:6, fontSize:12, fontWeight:500, background:t.surface, border:`1px solid ${t.border}`, color:t.textMid }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────── */
const initForm = {
  name:"", title:"", email:"", phone:"", location:"", summary:"",
  experience:[{ company:"", role:"", duration:"", description:"" }],
  education:"", skills:"", targetJob:"", tone:"professional",
};

export default function App() {
  const [screen, setScreen] = useState("hero");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initForm);
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("resumeai-theme") || "light"; } catch { return "light"; }
  });

  useEffect(() => {
    document.title = `${BRAND} — AI CV Builder`;
  }, []);

  useEffect(() => {
    try { localStorage.setItem("resumeai-theme", mode); } catch {}
  }, [mode]);

  const t = themes[mode];
  const reset = () => { setStep(0); setForm(initForm); setScreen("hero"); };

  return (
    <Ctx.Provider value={t}>
      <style>{fonts + buildCss(t)}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:t.bg, width:"100%" }}>

        {/* Background glow */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"55vw", height:"55vw", borderRadius:"50%", background:`radial-gradient(circle,${t.copper}06 0%,transparent 65%)` }} />
          <div style={{ position:"absolute", bottom:"-15%", left:"-10%", width:"45vw", height:"45vw", borderRadius:"50%", background:`radial-gradient(circle,${t.teal}05 0%,transparent 65%)` }} />
          <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:"70vw", height:"40vw", background:`radial-gradient(ellipse,${t.primary}04 0%,transparent 60%)` }} />
        </div>

        {/* Header */}
        <header style={{ position:"sticky", top:0, zIndex:50, background:`${t.surface}f0`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:t.primary, display:"flex", alignItems:"center", justifyContent:"center", color:t.primaryFg, fontFamily:"'Montserrat',sans-serif", fontSize:15, fontWeight:800 }}>S</div>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:18, color:t.primary, letterSpacing:"-.02em" }}>{BRAND}</span>
            </div>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              {screen === "builder" && (
                <button onClick={reset} style={{ background:"none", border:"none", color:t.textSoft, fontSize:13, cursor:"pointer", transition:"color .15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = t.primary}
                  onMouseLeave={e => e.currentTarget.style.color = t.textSoft}>
                  ← Start over
                </button>
              )}
              <ThemeToggle mode={mode} onToggle={() => setMode(m => m === "light" ? "dark" : "light")} />
              {screen === "hero" && <Btn onClick={() => setScreen("builder")} small>Get Started →</Btn>}
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ flex:1, position:"relative", zIndex:1, display:"flex", flexDirection:"column" }}>
          {screen === "hero" && (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Hero onStart={() => setScreen("builder")} />
            </div>
          )}
          {screen === "builder" && (
            <div style={{ maxWidth:780, width:"100%", margin:"0 auto", padding:"40px 20px 80px" }}>
              <div className="card-inner" style={{ background:t.surface, borderRadius:14, border:`1px solid ${t.border}`, boxShadow:`0 8px 40px ${t.primary}0a` }}>
                <StepsBar current={step} />
                {step === 0 && <Step1 form={form} setForm={setForm} onNext={() => setStep(1)} />}
                {step === 1 && <Step2 form={form} setForm={setForm} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                {step === 2 && <Step3 form={form} setForm={setForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                {step === 3 && <Step4 form={form} onBack={() => setStep(2)} onReset={reset} />}
              </div>
            </div>
          )}
        </main>

        {screen === "hero" && (
          <footer style={{ borderTop:`1px solid ${t.border}`, padding:"24px", textAlign:"center" }}>
            <p style={{ fontSize:12, color:t.textSoft, letterSpacing:".03em" }}>© 2026 {BRAND} · Professional CV Builder</p>
          </footer>
        )}
      </div>
    </Ctx.Provider>
  );
}
