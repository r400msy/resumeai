import { useState, useEffect, useRef } from "react";

const API = "/api/generate";

/* ── Design Tokens ───────────────────────────────────────────── */
const T = {
  navy:     "#0f2241",
  navyMid:  "#1a3560",
  navyLight:"#254980",
  sky:      "#2d7dd2",
  skyLight: "#5b9fe8",
  teal:     "#1ab5a0",
  gold:     "#e8a020",
  white:    "#ffffff",
  offWhite: "#f4f7fb",
  border:   "#d8e4f0",
  text:     "#0f2241",
  textMid:  "#4a5e7a",
  textSoft: "#8097b1",
  success:  "#1ab5a0",
  warn:     "#e8a020",
  surface:  "#ffffff",
  bg:       "#f4f7fb",
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');`;

const css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:${T.bg};color:${T.text};font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:${T.bg};}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
.a0{animation:fadeUp .5s ease both;}
.a1{animation:fadeUp .5s .1s ease both;}
.a2{animation:fadeUp .5s .2s ease both;}
.a3{animation:fadeUp .5s .3s ease both;}
.a4{animation:fadeUp .5s .4s ease both;}
.a5{animation:fadeUp .5s .5s ease both;}
input,textarea,select{outline:none;font-family:'Plus Jakarta Sans',sans-serif;}
button{cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;}
textarea{resize:vertical;}
`;

/* ── Upsell Config ───────────────────────────────────────────── */
const UPSELLS = [
  { id:"cover",   icon:"✉️", title:"Cover Letter",   desc:"AI-crafted cover letter perfectly matched to your resume",              price:"£2.99", cta:"Add Cover Letter",  color:T.sky  },
  { id:"linkedin",icon:"💼", title:"LinkedIn Bio",    desc:"Optimised LinkedIn About section that gets noticed by recruiters",      price:"£1.99", cta:"Add LinkedIn Bio",  color:T.teal },
  { id:"ats",     icon:"🎯", title:"ATS Score Report",desc:"See exactly how your resume scores against ATS systems + fix tips",     price:"£3.99", cta:"Get ATS Report",    color:T.gold },
];

const steps = ["Your Info","Experience","Skills","Resume"];

/* ── Primitives ──────────────────────────────────────────────── */
function Label({ children }) {
  return <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.textSoft, textTransform:"uppercase", letterSpacing:".09em", marginBottom:7 }}>{children}</label>;
}

function Input({ label, value, onChange, placeholder, type="text", hint }) {
  const [f,setF] = useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      {label && <Label>{label}</Label>}
      <input type={type} value={value} placeholder={placeholder}
        onChange={e=>onChange(e.target.value)}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${f?T.sky:T.border}`, borderRadius:8, fontSize:14, color:T.text, background:T.white, transition:"border-color .2s", boxShadow:f?`0 0 0 3px ${T.sky}18`:"none" }} />
      {hint && <p style={{ fontSize:11, color:T.textSoft, marginTop:4 }}>{hint}</p>}
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=4 }) {
  const [f,setF] = useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      {label && <Label>{label}</Label>}
      <textarea value={value} placeholder={placeholder} rows={rows}
        onChange={e=>onChange(e.target.value)}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${f?T.sky:T.border}`, borderRadius:8, fontSize:14, color:T.text, lineHeight:1.6, background:T.white, transition:"border-color .2s", boxShadow:f?`0 0 0 3px ${T.sky}18`:"none" }} />
    </div>
  );
}

function Btn({ children, onClick, variant="primary", disabled, small, style:sx={} }) {
  const [h,setH] = useState(false);
  const base = { padding:small?"8px 18px":"12px 26px", borderRadius:8, fontSize:small?13:14, fontWeight:600, border:"none", transition:"all .18s ease", opacity:disabled?.45:1, cursor:disabled?"not-allowed":"pointer", ...sx };
  const vs = {
    primary:{ background:h&&!disabled?T.navyMid:T.navy, color:T.white, boxShadow:h&&!disabled?`0 6px 20px ${T.navy}44`:`0 2px 8px ${T.navy}22`, transform:h&&!disabled?"translateY(-1px)":"none" },
    sky:{ background:h&&!disabled?T.skyLight:T.sky, color:T.white, boxShadow:h&&!disabled?`0 6px 20px ${T.sky}44`:`0 2px 8px ${T.sky}22`, transform:h&&!disabled?"translateY(-1px)":"none" },
    ghost:{ background:"transparent", color:h?T.sky:T.textMid, border:`1.5px solid ${h?T.sky:T.border}` },
  };
  return <button onClick={disabled?undefined:onClick} disabled={disabled} style={{...base,...vs[variant]}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</button>;
}

/* ── Steps Indicator ─────────────────────────────────────────── */
function StepsBar({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:36 }}>
      {steps.map((s,i) => (
        <div key={s} style={{ display:"flex", alignItems:"center", flex:i<steps.length-1?1:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", background:i<current?T.teal:i===current?T.navy:T.white, border:`2px solid ${i<current?T.teal:i===current?T.navy:T.border}`, color:i<=current?T.white:T.textSoft, transition:"all .3s", boxShadow:i===current?`0 0 0 4px ${T.navy}18`:"none" }}>
              {i<current?"✓":i+1}
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:i===current?T.navy:i<current?T.teal:T.textSoft }}>{s}</span>
          </div>
          {i<steps.length-1 && <div style={{ flex:1, height:2, margin:"0 12px", background:i<current?T.teal:T.border, transition:"background .3s" }} />}
        </div>
      ))}
    </div>
  );
}

/* ── Step 1 ──────────────────────────────────────────────────── */
function Step1({ form, setForm, onNext }) {
  const u = k => v => setForm(f=>({...f,[k]:v}));
  return (
    <div className="a0">
      <h2 style={{ fontFamily:"'Lora',serif", fontSize:24, marginBottom:6, color:T.navy }}>Personal Details</h2>
      <p style={{ color:T.textSoft, marginBottom:28, fontSize:14 }}>Let's start with the basics.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <Input label="Full Name" value={form.name} onChange={u("name")} placeholder="Alex Johnson" />
        <Input label="Job Title" value={form.title} onChange={u("title")} placeholder="Senior UX Designer" />
        <Input label="Email" value={form.email} onChange={u("email")} placeholder="alex@email.com" type="email" />
        <Input label="Phone" value={form.phone} onChange={u("phone")} placeholder="+44 7700 000000" />
      </div>
      <Input label="Location" value={form.location} onChange={u("location")} placeholder="London, UK" />
      <Textarea label="Brief Summary (optional — AI will enhance it)" value={form.summary} onChange={u("summary")} placeholder="Short intro about your background..." rows={3} />
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
        <Btn onClick={onNext} disabled={!form.name||!form.email}>Continue →</Btn>
      </div>
    </div>
  );
}

/* ── Step 2 ──────────────────────────────────────────────────── */
function Step2({ form, setForm, onNext, onBack }) {
  const add = () => setForm(f=>({...f,experience:[...f.experience,{company:"",role:"",duration:"",description:""}]}));
  const upd = (i,k,v) => setForm(f=>{ const e=[...f.experience]; e[i]={...e[i],[k]:v}; return {...f,experience:e}; });
  const rem = i => setForm(f=>({...f,experience:f.experience.filter((_,j)=>j!==i)}));
  return (
    <div className="a0">
      <h2 style={{ fontFamily:"'Lora',serif", fontSize:24, marginBottom:6, color:T.navy }}>Work Experience</h2>
      <p style={{ color:T.textSoft, marginBottom:28, fontSize:14 }}>Add your roles — AI will write compelling bullet points.</p>
      {form.experience.map((exp,i)=>(
        <div key={i} style={{ border:`1.5px solid ${T.border}`, borderRadius:10, padding:"20px 20px 4px", marginBottom:14, background:T.white }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.sky, textTransform:"uppercase", letterSpacing:".09em" }}>Role {i+1}</span>
            {form.experience.length>1 && <button onClick={()=>rem(i)} style={{ background:"none", border:"none", color:T.textSoft, fontSize:16 }}>✕</button>}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <Input label="Company" value={exp.company} onChange={v=>upd(i,"company",v)} placeholder="Acme Ltd" />
            <Input label="Job Title" value={exp.role} onChange={v=>upd(i,"role",v)} placeholder="Product Manager" />
          </div>
          <Input label="Dates" value={exp.duration} onChange={v=>upd(i,"duration",v)} placeholder="Mar 2022 – Present" />
          <Textarea label="What did you do? (rough notes fine)" value={exp.description} onChange={v=>upd(i,"description",v)} placeholder="Managed roadmap, led team of 5, launched 3 features, increased retention by 18%..." rows={3} />
        </div>
      ))}
      <button onClick={add} style={{ width:"100%", padding:11, background:T.white, border:`1.5px dashed ${T.border}`, borderRadius:8, color:T.textSoft, fontSize:13, marginBottom:20, transition:"all .2s" }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.sky;e.currentTarget.style.color=T.sky;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textSoft;}}>
        + Add another role
      </button>
      <Textarea label="Education" value={form.education} onChange={v=>setForm(f=>({...f,education:v}))} placeholder="BSc Computer Science, University of Manchester, 2020" rows={2} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={onNext}>Continue →</Btn>
      </div>
    </div>
  );
}

/* ── Step 3 ──────────────────────────────────────────────────── */
function Step3({ form, setForm, onNext, onBack }) {
  const u = k => v => setForm(f=>({...f,[k]:v}));
  const tones = ["professional","confident","creative","technical","executive"];
  return (
    <div className="a0">
      <h2 style={{ fontFamily:"'Lora',serif", fontSize:24, marginBottom:6, color:T.navy }}>Skills & Target Role</h2>
      <p style={{ color:T.textSoft, marginBottom:28, fontSize:14 }}>This is what the AI optimises for.</p>
      <Textarea label="Your Skills" value={form.skills} onChange={u("skills")} placeholder="React, TypeScript, Figma, Python, SQL, Agile, Leadership..." rows={3} />
      <Input label="Target Job" value={form.targetJob} onChange={u("targetJob")} placeholder="e.g. Senior Frontend Engineer at a tech startup" hint="Be specific — the more detail, the better the AI tailors your resume." />
      <div style={{ marginBottom:20 }}>
        <Label>Tone</Label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {tones.map(t=>(
            <button key={t} onClick={()=>setForm(f=>({...f,tone:t}))} style={{ padding:"7px 15px", borderRadius:20, fontSize:13, fontWeight:500, border:`1.5px solid ${form.tone===t?T.navy:T.border}`, background:form.tone===t?T.navy:T.white, color:form.tone===t?T.white:T.textMid, transition:"all .18s", textTransform:"capitalize" }}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={onNext} disabled={!form.skills||!form.targetJob}>Generate Resume ✦</Btn>
      </div>
    </div>
  );
}

/* ── Upsell Card ─────────────────────────────────────────────── */
function UpsellCard({ item, onBuy, bought }) {
  const [h,setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ border:`1.5px solid ${h?item.color:T.border}`, borderRadius:12, padding:"18px 20px", background:T.white, transition:"all .2s", boxShadow:h?`0 8px 24px ${item.color}18`:"0 1px 4px rgba(0,0,0,.05)", transform:h?"translateY(-2px)":"none" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
        <div style={{ width:42, height:42, borderRadius:10, flexShrink:0, background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{item.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontWeight:700, fontSize:14, color:T.navy }}>{item.title}</p>
              <p style={{ fontSize:12, color:T.textSoft, marginTop:3, lineHeight:1.5 }}>{item.desc}</p>
            </div>
            <span style={{ fontSize:15, fontWeight:700, color:item.color, marginLeft:12, flexShrink:0 }}>{item.price}</span>
          </div>
          <div style={{ marginTop:12 }}>
            {bought
              ? <div style={{ display:"flex", alignItems:"center", gap:6, color:T.teal, fontSize:13, fontWeight:600 }}>✓ Added — generating...</div>
              : <button onClick={()=>onBuy(item.id)} style={{ padding:"7px 16px", borderRadius:6, fontSize:12, fontWeight:600, border:`1.5px solid ${item.color}`, background:"transparent", color:item.color, cursor:"pointer", transition:"all .18s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=item.color;e.currentTarget.style.color=T.white;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=item.color;}}
                >{item.cta} →</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 4 ──────────────────────────────────────────────────── */
function Step4({ form, onBack, onReset }) {
  const [resume,setResume] = useState("");
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [copied,setCopied] = useState(false);
  const [bought,setBought] = useState({});
  const [upsellContent,setUpsellContent] = useState({});
  const [activeTab,setActiveTab] = useState("resume");
  const fetched = useRef(false);

  useEffect(()=>{ if(!fetched.current){fetched.current=true;generate();} },[]);

  const buildPrompt = () => {
    const exp = form.experience.map((e,i)=>`${i+1}. ${e.role} at ${e.company} (${e.duration}): ${e.description}`).join("\n");
    return `You are an expert resume writer. Write a polished, ATS-optimised resume.

Name: ${form.name} | Title: ${form.title} | Email: ${form.email} | Phone: ${form.phone} | Location: ${form.location}
Summary provided: ${form.summary||"none"}
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
      const res = await fetch(API, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:buildPrompt()}] }) });
      const data = await res.json();
      setResume(data.content?.map(b=>b.text||"").join("")||"");
    } catch { setError("Generation failed. Please try again."); }
    finally { setLoading(false); }
  };

  const buyUpsell = async (id) => {
    setBought(b=>({...b,[id]:true}));
    setActiveTab(id);
    const prompts = {
      cover:`Write a compelling ${form.tone} cover letter for ${form.name} applying for: ${form.targetJob}. Experience: ${form.experience.map(e=>`${e.role} at ${e.company}`).join(", ")}. Skills: ${form.skills}. Under 350 words. No placeholders.`,
      linkedin:`Write an optimised LinkedIn About section for ${form.name}, targeting: ${form.targetJob}. Background: ${form.experience.map(e=>`${e.role} at ${e.company}`).join(", ")}. Skills: ${form.skills}. First person, 3-4 paragraphs, ends with a value proposition.`,
      ats:`Analyse this candidate's resume for ATS compatibility against the target role: "${form.targetJob}". Name: ${form.name}. Skills: ${form.skills}. Experience: ${form.experience.map(e=>`${e.role} at ${e.company}`).join(", ")}. Provide: 1) Overall ATS Score X/100, 2) Keyword Match (present vs missing), 3) Format Score, 4) 5 specific improvements. Be direct and specific.`,
    };
    try {
      const res = await fetch(API, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompts[id]}] }) });
      const data = await res.json();
      setUpsellContent(u=>({...u,[id]:data.content?.map(b=>b.text||"").join("")||""}));
    } catch { setUpsellContent(u=>({...u,[id]:"Error generating. Please try again."})); }
  };

  const copy = () => {
    const content = activeTab==="resume"?resume:upsellContent[activeTab];
    navigator.clipboard.writeText(content||"");
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const tabs = [{ id:"resume", label:"Resume" }, ...Object.keys(bought).map(id=>({ id, label:UPSELLS.find(u=>u.id===id)?.title }))];
  const activeContent = activeTab==="resume"?resume:upsellContent[activeTab];
  const isLoading = activeTab==="resume"?loading:(bought[activeTab]&&!upsellContent[activeTab]);

  return (
    <div className="a0">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Lora',serif", fontSize:24, color:T.navy, marginBottom:4 }}>Your Resume is Ready</h2>
          <p style={{ fontSize:13, color:T.textSoft }}>Tailored for: <span style={{ color:T.sky, fontWeight:600 }}>{form.targetJob}</span></p>
        </div>
        {!loading && resume && (
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="ghost" onClick={generate} small>↺ Redo</Btn>
            <Btn variant="sky" onClick={copy} small>{copied?"✓ Copied!":"Copy Text"}</Btn>
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs.length>1 && (
        <div style={{ display:"flex", gap:4, marginBottom:16, borderBottom:`2px solid ${T.border}` }}>
          {tabs.map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ padding:"8px 16px", fontSize:13, fontWeight:600, border:"none", background:"none", cursor:"pointer", color:activeTab===tab.id?T.navy:T.textSoft, borderBottom:`2px solid ${activeTab===tab.id?T.navy:"transparent"}`, marginBottom:-2, transition:"all .18s" }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div style={{ background:T.white, border:`1.5px solid ${T.border}`, borderRadius:12, padding:48, textAlign:"center", marginBottom:24 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", margin:"0 auto 16px", border:`3px solid ${T.border}`, borderTopColor:T.sky, animation:"spin .75s linear infinite" }} />
          <p style={{ color:T.textMid, fontSize:14, fontWeight:500 }}>Crafting your content...</p>
          <p style={{ color:T.textSoft, fontSize:12, marginTop:6 }}>Optimising for {form.targetJob}</p>
        </div>
      ) : error && activeTab==="resume" ? (
        <div style={{ background:"#fff5f5", border:"1.5px solid #fccaca", borderRadius:10, padding:20, marginBottom:24 }}>
          <p style={{ color:"#c0392b", fontSize:14 }}>{error}</p>
          <Btn variant="ghost" onClick={generate} small style={{ marginTop:12 }}>Try Again</Btn>
        </div>
      ) : activeContent ? (
        <div style={{ background:T.white, border:`1.5px solid ${T.border}`, borderRadius:12, padding:"36px 40px", marginBottom:24, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13.5, lineHeight:1.85, color:"#1a1a2e", whiteSpace:"pre-wrap", boxShadow:"0 4px 24px rgba(15,34,65,.08)" }}>
          {activeContent}
        </div>
      ) : null}

      {/* Upsells */}
      {activeTab==="resume" && !loading && resume && (
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:T.border }} />
            <span style={{ fontSize:11, fontWeight:700, color:T.textSoft, textTransform:"uppercase", letterSpacing:".08em", whiteSpace:"nowrap" }}>Supercharge Your Application</span>
            <div style={{ flex:1, height:1, background:T.border }} />
          </div>
          <div style={{ display:"grid", gap:10 }}>
            {UPSELLS.map(item=><UpsellCard key={item.id} item={item} onBuy={buyUpsell} bought={!!bought[item.id]} />)}
          </div>
          <p style={{ fontSize:11, color:T.textSoft, textAlign:"center", marginTop:10 }}>🔒 Secure payment · Instant delivery · No subscription</p>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <Btn variant="ghost" onClick={onBack}>← Edit</Btn>
        <Btn variant="ghost" onClick={onReset} style={{ color:T.textSoft }}>Start over</Btn>
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero({ onStart }) {
  return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"56px 24px 40px", textAlign:"center" }}>
      <div className="a0" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:20, background:`${T.sky}12`, border:`1px solid ${T.sky}30`, color:T.sky, fontSize:12, fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:28 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:T.teal, display:"inline-block", animation:"pulse 2s infinite" }} />
        AI-Powered · Free to Start
      </div>
      <h1 className="a1" style={{ fontFamily:"'Lora',serif", fontWeight:700, fontSize:"clamp(32px,5.5vw,54px)", lineHeight:1.12, color:T.navy, marginBottom:22 }}>
        Land Your Next Job<br />
        <span style={{ background:`linear-gradient(90deg,${T.sky},${T.teal})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>with an AI Resume</span>
      </h1>
      <p className="a2" style={{ fontSize:16, color:T.textMid, lineHeight:1.7, marginBottom:36, maxWidth:500, margin:"0 auto 36px" }}>
        Answer a few questions and get a tailored, recruiter-ready resume in under 2 minutes. Free to generate — optional extras available.
      </p>
      <div className="a3" style={{ display:"flex", justifyContent:"center", gap:40, marginBottom:40 }}>
        {[{n:"2 min",l:"to build"},{n:"ATS",l:"optimised"},{n:"Free",l:"to generate"}].map(s=>(
          <div key={s.n} style={{ textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:700, color:T.navy, fontFamily:"'Lora',serif" }}>{s.n}</div>
            <div style={{ fontSize:12, color:T.textSoft, marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div className="a4">
        <Btn onClick={onStart} style={{ padding:"14px 40px", fontSize:15, borderRadius:10 }}>Build My Resume — Free →</Btn>
        <p style={{ fontSize:12, color:T.textSoft, marginTop:14 }}>No sign-up required · Takes 2 minutes</p>
      </div>
      <div className="a5" style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginTop:44 }}>
        {["✓ ATS Optimised","✓ Recruiter-Approved Format","✓ Role-Tailored Content","✓ Instant Results"].map(f=>(
          <span key={f} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:500, background:T.white, border:`1px solid ${T.border}`, color:T.textMid, boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────── */
const initForm = { name:"", title:"", email:"", phone:"", location:"", summary:"", experience:[{company:"",role:"",duration:"",description:""}], education:"", skills:"", targetJob:"", tone:"professional" };

export default function App() {
  const [screen,setScreen] = useState("hero");
  const [step,setStep] = useState(0);
  const [form,setForm] = useState(initForm);
  const reset = () => { setStep(0); setForm(initForm); setScreen("hero"); };

  return (
    <>
      <style>{fonts+css}</style>
      <div style={{ minHeight:"100vh", background:T.bg, width:"100%", overflowX:"hidden" }}>
        {/* BG decoration */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-200, right:-200, width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,${T.sky}08 0%,transparent 70%)` }} />
          <div style={{ position:"absolute", bottom:-150, left:-150, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,${T.teal}06 0%,transparent 70%)` }} />
        </div>

        {/* Header */}
        <header style={{ position:"sticky", top:0, zIndex:50, background:`${T.white}f0`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${T.navy},${T.sky})`, display:"flex", alignItems:"center", justifyContent:"center", color:T.white, fontSize:14, fontWeight:700 }}>R</div>
              <span style={{ fontFamily:"'Lora',serif", fontWeight:700, fontSize:17, color:T.navy }}>ResuméAI</span>
            </div>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              {screen==="builder" && <button onClick={reset} style={{ background:"none", border:"none", color:T.textSoft, fontSize:13, cursor:"pointer" }}>← Start over</button>}
              {screen==="hero" && <Btn onClick={()=>setScreen("builder")} small>Get Started →</Btn>}
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ position:"relative", zIndex:1 }}>
          {screen==="hero" && <Hero onStart={()=>setScreen("builder")} />}
          {screen==="builder" && (
            <div style={{ maxWidth:740, margin:"0 auto", padding:"44px 24px 80px" }}>
              <div style={{ background:T.white, borderRadius:16, border:`1.5px solid ${T.border}`, padding:"36px 40px", boxShadow:"0 8px 40px rgba(15,34,65,.1)" }}>
                <StepsBar current={step} />
                {step===0 && <Step1 form={form} setForm={setForm} onNext={()=>setStep(1)} />}
                {step===1 && <Step2 form={form} setForm={setForm} onNext={()=>setStep(2)} onBack={()=>setStep(0)} />}
                {step===2 && <Step3 form={form} setForm={setForm} onNext={()=>setStep(3)} onBack={()=>setStep(1)} />}
                {step===3 && <Step4 form={form} onBack={()=>setStep(2)} onReset={reset} />}
              </div>
            </div>
          )}
        </main>

        {screen==="hero" && (
          <footer style={{ borderTop:`1px solid ${T.border}`, padding:"24px", textAlign:"center" }}>
            <p style={{ fontSize:12, color:T.textSoft }}>© 2026 ResuméAI · Free to use · Optional paid extras</p>
          </footer>
        )}
      </div>
    </>
  );
}
