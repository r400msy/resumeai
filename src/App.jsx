import { useState, useEffect, useRef, createContext, useContext } from "react";

const API = "/api/generate";

/* ── Themes ──────────────────────────────────────────────────── */
const themes = {
  light: {
    bg:          "#f0e9dc",
    surface:     "#fdfaf5",
    primary:     "#1b2c1e",
    primHover:   "#263f2b",
    primaryFg:   "#ffffff",
    copper:      "#a86420",
    copperLt:    "#c27f3c",
    copperPale:  "#fdf0e5",
    teal:        "#27795a",
    tealLt:      "#358e6d",
    gold:        "#b58820",
    goldLt:      "#cb9e2a",
    border:      "#d3c8b2",
    text:        "#1b2c1e",
    textMid:     "#445a4c",
    textSoft:    "#87998b",
    errBg:       "#fff5f0",
    errBorder:   "#e8b0a0",
    errText:     "#8b2c20",
  },
  dark: {
    bg:          "#111814",
    surface:     "#1b2620",
    primary:     "#c89030",
    primHover:   "#d8a040",
    primaryFg:   "#111814",
    copper:      "#c07838",
    copperLt:    "#d08848",
    copperPale:  "#c0783812",
    teal:        "#3aaa78",
    tealLt:      "#4abb88",
    gold:        "#d4a820",
    goldLt:      "#e4b830",
    border:      "#2c3c2e",
    text:        "#c4ccbc",
    textMid:     "#7a9880",
    textSoft:    "#607060",
    errBg:       "#1a1214",
    errBorder:   "#4a2020",
    errText:     "#f06050",
  },
};

const Ctx = createContext(themes.light);
const useT = () => useContext(Ctx);

/* ── Fonts & Dynamic CSS ─────────────────────────────────────── */
const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');`;

const buildCss = t => `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:${t.bg};color:${t.text};font-family:'DM Sans',sans-serif;min-height:100vh;transition:background-color .4s,color .3s;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:${t.bg};}
::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.a0{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both;}
.a1{animation:fadeUp .6s .07s cubic-bezier(.16,1,.3,1) both;}
.a2{animation:fadeUp .6s .14s cubic-bezier(.16,1,.3,1) both;}
.a3{animation:fadeUp .6s .21s cubic-bezier(.16,1,.3,1) both;}
.a4{animation:fadeUp .6s .28s cubic-bezier(.16,1,.3,1) both;}
.a5{animation:fadeUp .6s .35s cubic-bezier(.16,1,.3,1) both;}
.a6{animation:fadeUp .6s .42s cubic-bezier(.16,1,.3,1) both;}
input,textarea,select{outline:none;font-family:'DM Sans',sans-serif;}
button{cursor:pointer;font-family:'DM Sans',sans-serif;}
textarea{resize:vertical;}
.field-input{width:100%;padding:10px 0;border:none;border-bottom:1.5px solid ${t.border};background:transparent;font-size:14.5px;color:${t.text};transition:border-color .2s;font-family:'DM Sans',sans-serif;}
.field-input:focus{border-bottom-color:${t.copper};outline:none;}
.field-input::placeholder{color:${t.textSoft};}
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
    <button
      onClick={onToggle}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:"4px 2px", opacity:h?.85:1, transition:"opacity .15s" }}
    >
      {/* Sun */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? t.textSoft : t.copper} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      {/* Pill */}
      <div style={{ width:36, height:20, borderRadius:10, background:dark?t.primary:t.border, position:"relative", transition:"background .35s ease", flexShrink:0 }}>
        <div style={{
          width:14, height:14, borderRadius:"50%", background:"#fff",
          position:"absolute", top:3, left:dark?19:3,
          transition:"left .3s ease", boxShadow:"0 1px 4px rgba(0,0,0,.3)",
        }} />
      </div>
      {/* Moon */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill={dark?t.primary:"none"} stroke={dark?t.primary:t.textSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  );
}

/* ── Primitives ──────────────────────────────────────────────── */
function Label({ children }) {
  const t = useT();
  return (
    <label style={{ display:"block", fontSize:10.5, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".1em", marginBottom:9 }}>
      {children}
    </label>
  );
}

function Input({ label, value, onChange, placeholder, type="text", hint }) {
  const t = useT();
  return (
    <div style={{ marginBottom:24 }}>
      {label && <Label>{label}</Label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="field-input" />
      {hint && <p style={{ fontSize:11, color:t.textSoft, marginTop:5 }}>{hint}</p>}
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=4 }) {
  return (
    <div style={{ marginBottom:24 }}>
      {label && <Label>{label}</Label>}
      <textarea value={value} placeholder={placeholder} rows={rows} onChange={e => onChange(e.target.value)} className="field-input" style={{ lineHeight:1.65 }} />
    </div>
  );
}

function Btn({ children, onClick, variant="primary", disabled, small, style:sx={} }) {
  const t = useT();
  const [h, setH] = useState(false);
  const base = {
    padding: small ? "8px 20px" : "12px 28px",
    borderRadius: 6, fontSize: small ? 13 : 14,
    fontWeight: 600, border: "none",
    transition: "all .2s ease",
    opacity: disabled ? .45 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    letterSpacing: ".01em", ...sx,
  };
  const vs = {
    primary: { background:h&&!disabled?t.primHover:t.primary, color:t.primaryFg, boxShadow:h&&!disabled?`0 6px 22px ${t.primary}44`:`0 2px 8px ${t.primary}25`, transform:h&&!disabled?"translateY(-1px)":"none" },
    sky:     { background:h&&!disabled?t.tealLt:t.teal, color:t.primaryFg, boxShadow:h&&!disabled?`0 6px 22px ${t.teal}44`:`0 2px 8px ${t.teal}25`, transform:h&&!disabled?"translateY(-1px)":"none" },
    ghost:   { background:"transparent", color:h?t.primary:t.textMid, border:`1.5px solid ${h?t.primary:t.border}` },
    copper:  { background:h&&!disabled?t.copperLt:t.copper, color:t.primaryFg, boxShadow:h&&!disabled?`0 6px 22px ${t.copper}44`:`0 2px 8px ${t.copper}25`, transform:h&&!disabled?"translateY(-1px)":"none" },
  };
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} style={{...base,...vs[variant]}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      {children}
    </button>
  );
}

/* ── Steps Indicator ─────────────────────────────────────────── */
function StepsBar({ current }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:44 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display:"flex", alignItems:"center", flex:i<steps.length-1?1:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
            <div style={{
              width:29, height:29, borderRadius:"50%", fontSize:11, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center",
              background:i<current?t.copper:i===current?t.primary:"transparent",
              border:`2px solid ${i<current?t.copper:i===current?t.primary:t.border}`,
              color:i<=current?t.primaryFg:t.textSoft,
              transition:"all .35s ease",
              boxShadow:i===current?`0 0 0 4px ${t.primary}14`:"none",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize:12.5, fontWeight:i===current?600:400, color:i===current?t.primary:i<current?t.copper:t.textSoft, transition:"color .35s" }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex:1, height:1.5, margin:"0 14px", background:i<current?t.copper:t.border, transition:"background .4s ease" }} />
          )}
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
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, marginBottom:6, color:t.primary, letterSpacing:"-.01em" }}>
        {title}
      </h2>
      <p style={{ color:t.textSoft, marginBottom:34, fontSize:14, lineHeight:1.6 }}>{subtitle}</p>
    </>
  );
}

/* ── Step 1 ──────────────────────────────────────────────────── */
function Step1({ form, setForm, onNext }) {
  const u = k => v => setForm(f => ({ ...f, [k]:v }));
  return (
    <div className="a0">
      <StepHead title="Personal Details" subtitle="Let's start with the basics." />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 28px" }}>
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
        <div key={i} style={{
          borderTop:`1px solid ${t.border}`, borderRight:`1px solid ${t.border}`,
          borderBottom:`1px solid ${t.border}`, borderLeft:`3px solid ${t.copper}`,
          borderRadius:"0 8px 8px 0", padding:"22px 22px 4px", marginBottom:16, background:t.surface,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <span style={{ fontSize:10.5, fontWeight:700, color:t.copper, textTransform:"uppercase", letterSpacing:".1em" }}>Role {i + 1}</span>
            {form.experience.length > 1 && (
              <button onClick={() => rem(i)} style={{ background:"none", border:"none", color:t.textSoft, fontSize:16, lineHeight:1 }}>✕</button>
            )}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 28px" }}>
            <Input label="Company" value={exp.company} onChange={v => upd(i,"company",v)} placeholder="Acme Ltd" />
            <Input label="Job Title" value={exp.role} onChange={v => upd(i,"role",v)} placeholder="Product Manager" />
          </div>
          <Input label="Dates" value={exp.duration} onChange={v => upd(i,"duration",v)} placeholder="Mar 2022 – Present" />
          <Textarea label="What did you do? (rough notes fine)" value={exp.description} onChange={v => upd(i,"description",v)} placeholder="Managed roadmap, led team of 5, launched 3 features, increased retention by 18%..." rows={3} />
        </div>
      ))}
      <button onClick={add} style={{ width:"100%", padding:12, background:"transparent", border:`1.5px dashed ${t.border}`, borderRadius:6, color:t.textSoft, fontSize:13, marginBottom:24, transition:"all .2s" }}
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
      <div style={{ marginBottom:24 }}>
        <Label>Tone</Label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {tones.map(tone => (
            <button key={tone} onClick={() => setForm(f => ({ ...f, tone }))} style={{
              padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer",
              border:`1.5px solid ${form.tone===tone?t.primary:t.border}`,
              background:form.tone===tone?t.primary:"transparent",
              color:form.tone===tone?t.primaryFg:t.textMid,
              transition:"all .18s", textTransform:"capitalize",
            }}>{tone}</button>
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
  const colorLt = t[item.ck + "Lt"];
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      border:`1px solid ${h?color:t.border}`, borderRadius:8, padding:"16px 20px",
      background:t.surface, transition:"all .2s", display:"flex", alignItems:"center", gap:18,
      boxShadow:h?`0 6px 22px ${color}18`:`0 1px 4px ${t.primary}06`,
      transform:h?"translateY(-2px)":"none",
    }}>
      <div style={{ width:42, height:42, borderRadius:8, flexShrink:0, background:`${color}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, color, fontWeight:700 }}>
        {item.icon}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:600, fontSize:14, color:t.primary }}>{item.title}</p>
            <p style={{ fontSize:12, color:t.textSoft, marginTop:3, lineHeight:1.5 }}>{item.desc}</p>
          </div>
          <div style={{ marginLeft:20, textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:15, fontWeight:700, color }}>{item.price}</div>
            {bought
              ? <div style={{ color:t.teal, fontSize:12, fontWeight:600, marginTop:4 }}>✓ Added — generating...</div>
              : <button onClick={() => onBuy(item.id)} style={{ marginTop:6, padding:"5px 13px", borderRadius:4, fontSize:12, fontWeight:600, border:`1.5px solid ${color}`, background:"transparent", color, cursor:"pointer", transition:"all .18s", display:"block" }}
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

/* ── Step 4 ──────────────────────────────────────────────────── */
function Step4({ form, onBack, onReset }) {
  const t = useT();
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    setLoading(true); setError("");
    try {
      const res = await fetch(API, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:buildPrompt() }] }) });
      const data = await res.json();
      setResume(data.content?.map(b => b.text || "").join("") || "");
    } catch { setError("Generation failed. Please try again."); }
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
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
        <div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:t.primary, marginBottom:5, letterSpacing:"-.01em" }}>
            Your Resume is Ready
          </h2>
          <p style={{ fontSize:13, color:t.textSoft }}>
            Tailored for: <span style={{ color:t.copper, fontWeight:600 }}>{form.targetJob}</span>
          </p>
        </div>
        {!loading && resume && (
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="ghost" onClick={generate} small>↺ Redo</Btn>
            <Btn variant="copper" onClick={copy} small>{copied ? "✓ Copied!" : "Copy Text"}</Btn>
          </div>
        )}
      </div>

      {tabs.length > 1 && (
        <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:`1.5px solid ${t.border}` }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding:"9px 18px", fontSize:13, fontWeight:600, border:"none",
              background:"none", cursor:"pointer",
              color:activeTab===tab.id?t.primary:t.textSoft,
              borderBottom:`2px solid ${activeTab===tab.id?t.copper:"transparent"}`,
              marginBottom:-2, transition:"all .18s",
            }}>{tab.label}</button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:"52px 48px", textAlign:"center", marginBottom:24 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", margin:"0 auto 20px", border:`2.5px solid ${t.border}`, borderTopColor:t.copper, animation:"spin .8s linear infinite" }} />
          <p style={{ fontFamily:"'Cormorant Garamond',serif", color:t.textMid, fontSize:20, fontWeight:600, fontStyle:"italic" }}>Crafting your content...</p>
          <p style={{ color:t.textSoft, fontSize:13, marginTop:6 }}>Optimising for {form.targetJob}</p>
        </div>
      ) : error && activeTab === "resume" ? (
        <div style={{ background:t.errBg, border:`1px solid ${t.errBorder}`, borderRadius:8, padding:20, marginBottom:24 }}>
          <p style={{ color:t.errText, fontSize:14 }}>{error}</p>
          <Btn variant="ghost" onClick={generate} small style={{ marginTop:12 }}>Try Again</Btn>
        </div>
      ) : activeContent ? (
        <div style={{
          background:t.surface, border:`1px solid ${t.border}`, borderRadius:8,
          padding:"44px 48px", marginBottom:24, fontFamily:"'DM Sans',sans-serif",
          fontSize:13.5, lineHeight:1.9, color:t.text, whiteSpace:"pre-wrap",
          boxShadow:`0 4px 32px ${t.primary}0b`,
        }}>
          {activeContent}
        </div>
      ) : null}

      {activeTab === "resume" && !loading && resume && (
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
            <div style={{ flex:1, height:1, background:t.border }} />
            <span style={{ fontSize:10.5, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".1em", whiteSpace:"nowrap" }}>
              Supercharge Your Application
            </span>
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
    <div style={{ maxWidth:720, width:"100%", margin:"0 auto", padding:"40px 24px", textAlign:"center" }}>
      <div className="a0" style={{
        display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px",
        borderRadius:24, background:t.copperPale, border:`1px solid ${t.copper}38`,
        color:t.copper, fontSize:11.5, fontWeight:600, letterSpacing:".07em",
        textTransform:"uppercase", marginBottom:36,
      }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:t.copper, display:"inline-block", animation:"pulse 2s infinite" }} />
        AI-Powered · Free to Start
      </div>

      <h1 className="a1" style={{
        fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
        fontSize:"clamp(44px,7.5vw,76px)", lineHeight:1.04,
        color:t.primary, marginBottom:28, letterSpacing:"-.02em",
      }}>
        Land Your Next Job<br />
        <em style={{ fontStyle:"italic", color:t.copper }}>with an AI Resume</em>
      </h1>

      <div className="a2" style={{ display:"flex", alignItems:"center", gap:16, maxWidth:280, margin:"0 auto 32px" }}>
        <div style={{ flex:1, height:1, background:t.border }} />
        <div style={{ width:5, height:5, borderRadius:"50%", background:t.copper, opacity:.75 }} />
        <div style={{ width:5, height:5, borderRadius:"50%", background:t.border }} />
        <div style={{ width:5, height:5, borderRadius:"50%", background:t.copper, opacity:.75 }} />
        <div style={{ flex:1, height:1, background:t.border }} />
      </div>

      <p className="a2" style={{ fontSize:17, color:t.textMid, lineHeight:1.72, maxWidth:480, margin:"0 auto 44px" }}>
        Answer a few questions and get a tailored, recruiter-ready resume in under 2 minutes. Free to generate — optional extras available.
      </p>

      <div className="a3" style={{ display:"flex", justifyContent:"center", marginBottom:48 }}>
        {[{ n:"2 min", l:"to build" }, { n:"ATS", l:"optimised" }, { n:"Free", l:"to generate" }].map((s, i) => (
          <div key={s.n} style={{ textAlign:"center", padding:"0 36px", borderRight:i<2?`1px solid ${t.border}`:"none" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:t.primary, lineHeight:1 }}>{s.n}</div>
            <div style={{ fontSize:12, color:t.textSoft, marginTop:5, fontWeight:400, letterSpacing:".02em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="a4">
        <button onClick={onStart} onMouseEnter={() => setBtnH(true)} onMouseLeave={() => setBtnH(false)} style={{
          padding:"15px 48px", fontSize:15, fontWeight:600,
          background:btnH?t.primHover:t.primary, color:t.primaryFg,
          border:"none", borderRadius:6, cursor:"pointer",
          boxShadow:btnH?`0 10px 36px ${t.primary}48`:`0 4px 20px ${t.primary}30`,
          transform:btnH?"translateY(-2px)":"none",
          transition:"all .22s ease", letterSpacing:".02em",
        }}>
          Build My Resume — Free →
        </button>
        <p style={{ fontSize:12, color:t.textSoft, marginTop:14 }}>No sign-up required · Takes 2 minutes</p>
      </div>

      <div className="a5" style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginTop:52 }}>
        {["✓ ATS Optimised", "✓ Recruiter-Approved Format", "✓ Role-Tailored Content", "✓ Instant Results"].map(f => (
          <span key={f} style={{
            padding:"6px 15px", borderRadius:4, fontSize:12, fontWeight:500,
            background:t.surface, border:`1px solid ${t.border}`,
            color:t.textMid, boxShadow:`0 1px 4px ${t.primary}07`,
          }}>{f}</span>
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
    try { localStorage.setItem("resumeai-theme", mode); } catch {}
  }, [mode]);

  const t = themes[mode];
  const reset = () => { setStep(0); setForm(initForm); setScreen("hero"); };

  return (
    <Ctx.Provider value={t}>
      <style>{fonts + buildCss(t)}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:t.bg, width:"100%", overflowX:"hidden" }}>

        {/* Background decoration */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-300, right:-200, width:700, height:700, borderRadius:"50%", background:`radial-gradient(circle,${t.copper}07 0%,transparent 65%)` }} />
          <div style={{ position:"absolute", bottom:-200, left:-200, width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,${t.teal}06 0%,transparent 65%)` }} />
          <div style={{ position:"absolute", top:"45%", left:"50%", transform:"translate(-50%,-50%)", width:1000, height:600, background:`radial-gradient(ellipse,${t.gold}04 0%,transparent 60%)` }} />
        </div>

        {/* Header */}
        <header style={{ position:"sticky", top:0, zIndex:50, background:`${t.surface}ee`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{
                width:34, height:34, borderRadius:7, background:t.primary,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:t.primaryFg, fontFamily:"'Cormorant Garamond',serif",
                fontSize:17, fontWeight:700, fontStyle:"italic", letterSpacing:"-.01em",
              }}>R</div>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:20, color:t.primary, letterSpacing:"-.02em" }}>
                ResuméAI
              </span>
            </div>
            <div style={{ display:"flex", gap:16, alignItems:"center" }}>
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
            <div style={{ maxWidth:760, width:"100%", margin:"0 auto", padding:"52px 24px 96px" }}>
              <div style={{
                background:t.surface, borderRadius:12, border:`1px solid ${t.border}`,
                padding:"44px 52px",
                boxShadow:`0 8px 48px ${t.primary}0c, 0 1px 0 rgba(255,255,255,.04) inset`,
              }}>
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
          <footer style={{ borderTop:`1px solid ${t.border}`, padding:"28px 24px", textAlign:"center" }}>
            <p style={{ fontSize:12, color:t.textSoft, letterSpacing:".02em" }}>© 2026 ResuméAI · Free to use · Optional paid extras</p>
          </footer>
        )}
      </div>
    </Ctx.Provider>
  );
}
