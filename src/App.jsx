import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";

const API = "/api/generate";
const BRAND = "SwiftCV";

/* ── Country Dial Codes ──────────────────────────────────────── */
const COUNTRIES = [
  { name:"United Kingdom",             dial:"+44"  },
  { name:"United States",              dial:"+1"   },
  { name:"Afghanistan",                dial:"+93"  },
  { name:"Albania",                    dial:"+355" },
  { name:"Algeria",                    dial:"+213" },
  { name:"Andorra",                    dial:"+376" },
  { name:"Angola",                     dial:"+244" },
  { name:"Argentina",                  dial:"+54"  },
  { name:"Armenia",                    dial:"+374" },
  { name:"Australia",                  dial:"+61"  },
  { name:"Austria",                    dial:"+43"  },
  { name:"Azerbaijan",                 dial:"+994" },
  { name:"Bahamas",                    dial:"+1242"},
  { name:"Bahrain",                    dial:"+973" },
  { name:"Bangladesh",                 dial:"+880" },
  { name:"Belarus",                    dial:"+375" },
  { name:"Belgium",                    dial:"+32"  },
  { name:"Belize",                     dial:"+501" },
  { name:"Benin",                      dial:"+229" },
  { name:"Bolivia",                    dial:"+591" },
  { name:"Bosnia & Herzegovina",       dial:"+387" },
  { name:"Botswana",                   dial:"+267" },
  { name:"Brazil",                     dial:"+55"  },
  { name:"Brunei",                     dial:"+673" },
  { name:"Bulgaria",                   dial:"+359" },
  { name:"Burkina Faso",               dial:"+226" },
  { name:"Burundi",                    dial:"+257" },
  { name:"Cambodia",                   dial:"+855" },
  { name:"Cameroon",                   dial:"+237" },
  { name:"Canada",                     dial:"+1"   },
  { name:"Cape Verde",                 dial:"+238" },
  { name:"Chad",                       dial:"+235" },
  { name:"Chile",                      dial:"+56"  },
  { name:"China",                      dial:"+86"  },
  { name:"Colombia",                   dial:"+57"  },
  { name:"Congo",                      dial:"+242" },
  { name:"Costa Rica",                 dial:"+506" },
  { name:"Croatia",                    dial:"+385" },
  { name:"Cuba",                       dial:"+53"  },
  { name:"Cyprus",                     dial:"+357" },
  { name:"Czech Republic",             dial:"+420" },
  { name:"Denmark",                    dial:"+45"  },
  { name:"Dominican Republic",         dial:"+1809"},
  { name:"Ecuador",                    dial:"+593" },
  { name:"Egypt",                      dial:"+20"  },
  { name:"El Salvador",                dial:"+503" },
  { name:"Estonia",                    dial:"+372" },
  { name:"Ethiopia",                   dial:"+251" },
  { name:"Fiji",                       dial:"+679" },
  { name:"Finland",                    dial:"+358" },
  { name:"France",                     dial:"+33"  },
  { name:"Gabon",                      dial:"+241" },
  { name:"Georgia",                    dial:"+995" },
  { name:"Germany",                    dial:"+49"  },
  { name:"Ghana",                      dial:"+233" },
  { name:"Greece",                     dial:"+30"  },
  { name:"Guatemala",                  dial:"+502" },
  { name:"Guinea",                     dial:"+224" },
  { name:"Haiti",                      dial:"+509" },
  { name:"Honduras",                   dial:"+504" },
  { name:"Hong Kong",                  dial:"+852" },
  { name:"Hungary",                    dial:"+36"  },
  { name:"Iceland",                    dial:"+354" },
  { name:"India",                      dial:"+91"  },
  { name:"Indonesia",                  dial:"+62"  },
  { name:"Iran",                       dial:"+98"  },
  { name:"Iraq",                       dial:"+964" },
  { name:"Ireland",                    dial:"+353" },
  { name:"Israel",                     dial:"+972" },
  { name:"Italy",                      dial:"+39"  },
  { name:"Jamaica",                    dial:"+1876"},
  { name:"Japan",                      dial:"+81"  },
  { name:"Jordan",                     dial:"+962" },
  { name:"Kazakhstan",                 dial:"+7"   },
  { name:"Kenya",                      dial:"+254" },
  { name:"Kuwait",                     dial:"+965" },
  { name:"Kyrgyzstan",                 dial:"+996" },
  { name:"Laos",                       dial:"+856" },
  { name:"Latvia",                     dial:"+371" },
  { name:"Lebanon",                    dial:"+961" },
  { name:"Libya",                      dial:"+218" },
  { name:"Liechtenstein",              dial:"+423" },
  { name:"Lithuania",                  dial:"+370" },
  { name:"Luxembourg",                 dial:"+352" },
  { name:"Macau",                      dial:"+853" },
  { name:"Madagascar",                 dial:"+261" },
  { name:"Malawi",                     dial:"+265" },
  { name:"Malaysia",                   dial:"+60"  },
  { name:"Maldives",                   dial:"+960" },
  { name:"Mali",                       dial:"+223" },
  { name:"Malta",                      dial:"+356" },
  { name:"Mauritius",                  dial:"+230" },
  { name:"Mexico",                     dial:"+52"  },
  { name:"Moldova",                    dial:"+373" },
  { name:"Monaco",                     dial:"+377" },
  { name:"Mongolia",                   dial:"+976" },
  { name:"Montenegro",                 dial:"+382" },
  { name:"Morocco",                    dial:"+212" },
  { name:"Mozambique",                 dial:"+258" },
  { name:"Myanmar",                    dial:"+95"  },
  { name:"Namibia",                    dial:"+264" },
  { name:"Nepal",                      dial:"+977" },
  { name:"Netherlands",                dial:"+31"  },
  { name:"New Zealand",                dial:"+64"  },
  { name:"Nicaragua",                  dial:"+505" },
  { name:"Niger",                      dial:"+227" },
  { name:"Nigeria",                    dial:"+234" },
  { name:"North Macedonia",            dial:"+389" },
  { name:"Norway",                     dial:"+47"  },
  { name:"Oman",                       dial:"+968" },
  { name:"Pakistan",                   dial:"+92"  },
  { name:"Panama",                     dial:"+507" },
  { name:"Papua New Guinea",           dial:"+675" },
  { name:"Paraguay",                   dial:"+595" },
  { name:"Peru",                       dial:"+51"  },
  { name:"Philippines",                dial:"+63"  },
  { name:"Poland",                     dial:"+48"  },
  { name:"Portugal",                   dial:"+351" },
  { name:"Qatar",                      dial:"+974" },
  { name:"Romania",                    dial:"+40"  },
  { name:"Russia",                     dial:"+7"   },
  { name:"Rwanda",                     dial:"+250" },
  { name:"Saudi Arabia",               dial:"+966" },
  { name:"Senegal",                    dial:"+221" },
  { name:"Serbia",                     dial:"+381" },
  { name:"Sierra Leone",               dial:"+232" },
  { name:"Singapore",                  dial:"+65"  },
  { name:"Slovakia",                   dial:"+421" },
  { name:"Slovenia",                   dial:"+386" },
  { name:"Somalia",                    dial:"+252" },
  { name:"South Africa",               dial:"+27"  },
  { name:"South Korea",                dial:"+82"  },
  { name:"Spain",                      dial:"+34"  },
  { name:"Sri Lanka",                  dial:"+94"  },
  { name:"Sudan",                      dial:"+249" },
  { name:"Sweden",                     dial:"+46"  },
  { name:"Switzerland",                dial:"+41"  },
  { name:"Syria",                      dial:"+963" },
  { name:"Taiwan",                     dial:"+886" },
  { name:"Tajikistan",                 dial:"+992" },
  { name:"Tanzania",                   dial:"+255" },
  { name:"Thailand",                   dial:"+66"  },
  { name:"Togo",                       dial:"+228" },
  { name:"Trinidad & Tobago",          dial:"+1868"},
  { name:"Tunisia",                    dial:"+216" },
  { name:"Turkey",                     dial:"+90"  },
  { name:"Turkmenistan",               dial:"+993" },
  { name:"Uganda",                     dial:"+256" },
  { name:"Ukraine",                    dial:"+380" },
  { name:"United Arab Emirates",       dial:"+971" },
  { name:"Uruguay",                    dial:"+598" },
  { name:"Uzbekistan",                 dial:"+998" },
  { name:"Venezuela",                  dial:"+58"  },
  { name:"Vietnam",                    dial:"+84"  },
  { name:"Yemen",                      dial:"+967" },
  { name:"Zambia",                     dial:"+260" },
  { name:"Zimbabwe",                   dial:"+263" },
];

/* ── Dial code → Capital city map ────────────────────────────── */
const DIAL_TO_LOCATION = {
  "+44":"London, UK",           "+1":"Washington D.C., US",   "+93":"Kabul, Afghanistan",
  "+355":"Tirana, Albania",     "+213":"Algiers, Algeria",     "+376":"Andorra la Vella, Andorra",
  "+244":"Luanda, Angola",      "+54":"Buenos Aires, Argentina","+374":"Yerevan, Armenia",
  "+61":"Canberra, Australia",  "+43":"Vienna, Austria",       "+994":"Baku, Azerbaijan",
  "+1242":"Nassau, Bahamas",    "+973":"Manama, Bahrain",      "+880":"Dhaka, Bangladesh",
  "+375":"Minsk, Belarus",      "+32":"Brussels, Belgium",     "+501":"Belmopan, Belize",
  "+229":"Porto-Novo, Benin",   "+591":"Sucre, Bolivia",       "+387":"Sarajevo, Bosnia & Herzegovina",
  "+267":"Gaborone, Botswana",  "+55":"Brasília, Brazil",      "+673":"Bandar Seri Begawan, Brunei",
  "+359":"Sofia, Bulgaria",     "+226":"Ouagadougou, Burkina Faso", "+257":"Gitega, Burundi",
  "+855":"Phnom Penh, Cambodia","+237":"Yaoundé, Cameroon",    "+238":"Praia, Cape Verde",
  "+235":"N'Djamena, Chad",     "+56":"Santiago, Chile",       "+86":"Beijing, China",
  "+57":"Bogotá, Colombia",     "+242":"Brazzaville, Congo",   "+506":"San José, Costa Rica",
  "+385":"Zagreb, Croatia",     "+53":"Havana, Cuba",          "+357":"Nicosia, Cyprus",
  "+420":"Prague, Czech Republic", "+45":"Copenhagen, Denmark","+1809":"Santo Domingo, Dominican Republic",
  "+593":"Quito, Ecuador",      "+20":"Cairo, Egypt",          "+503":"San Salvador, El Salvador",
  "+372":"Tallinn, Estonia",    "+251":"Addis Ababa, Ethiopia","+679":"Suva, Fiji",
  "+358":"Helsinki, Finland",   "+33":"Paris, France",         "+241":"Libreville, Gabon",
  "+995":"Tbilisi, Georgia",    "+49":"Berlin, Germany",       "+233":"Accra, Ghana",
  "+30":"Athens, Greece",       "+502":"Guatemala City, Guatemala", "+224":"Conakry, Guinea",
  "+509":"Port-au-Prince, Haiti","+504":"Tegucigalpa, Honduras","+852":"Hong Kong",
  "+36":"Budapest, Hungary",    "+354":"Reykjavik, Iceland",   "+91":"New Delhi, India",
  "+62":"Jakarta, Indonesia",   "+98":"Tehran, Iran",          "+964":"Baghdad, Iraq",
  "+353":"Dublin, Ireland",     "+972":"Jerusalem, Israel",    "+39":"Rome, Italy",
  "+1876":"Kingston, Jamaica",  "+81":"Tokyo, Japan",          "+962":"Amman, Jordan",
  "+7":"Moscow, Russia",        "+254":"Nairobi, Kenya",       "+965":"Kuwait City, Kuwait",
  "+996":"Bishkek, Kyrgyzstan", "+856":"Vientiane, Laos",      "+371":"Riga, Latvia",
  "+961":"Beirut, Lebanon",     "+218":"Tripoli, Libya",       "+423":"Vaduz, Liechtenstein",
  "+370":"Vilnius, Lithuania",  "+352":"Luxembourg City, Luxembourg", "+853":"Macau",
  "+261":"Antananarivo, Madagascar", "+265":"Lilongwe, Malawi","+60":"Kuala Lumpur, Malaysia",
  "+960":"Malé, Maldives",      "+223":"Bamako, Mali",         "+356":"Valletta, Malta",
  "+230":"Port Louis, Mauritius","+52":"Mexico City, Mexico",  "+373":"Chișinău, Moldova",
  "+377":"Monaco",              "+976":"Ulaanbaatar, Mongolia","+382":"Podgorica, Montenegro",
  "+212":"Rabat, Morocco",      "+258":"Maputo, Mozambique",   "+95":"Naypyidaw, Myanmar",
  "+264":"Windhoek, Namibia",   "+977":"Kathmandu, Nepal",     "+31":"Amsterdam, Netherlands",
  "+64":"Wellington, New Zealand","+505":"Managua, Nicaragua", "+227":"Niamey, Niger",
  "+234":"Abuja, Nigeria",      "+389":"Skopje, North Macedonia","+47":"Oslo, Norway",
  "+968":"Muscat, Oman",        "+92":"Islamabad, Pakistan",   "+507":"Panama City, Panama",
  "+675":"Port Moresby, Papua New Guinea","+595":"Asunción, Paraguay","+51":"Lima, Peru",
  "+63":"Manila, Philippines",  "+48":"Warsaw, Poland",        "+351":"Lisbon, Portugal",
  "+974":"Doha, Qatar",         "+40":"Bucharest, Romania",    "+250":"Kigali, Rwanda",
  "+966":"Riyadh, Saudi Arabia","+221":"Dakar, Senegal",       "+381":"Belgrade, Serbia",
  "+232":"Freetown, Sierra Leone","+65":"Singapore",           "+421":"Bratislava, Slovakia",
  "+386":"Ljubljana, Slovenia", "+252":"Mogadishu, Somalia",   "+27":"Pretoria, South Africa",
  "+82":"Seoul, South Korea",   "+34":"Madrid, Spain",         "+94":"Colombo, Sri Lanka",
  "+249":"Khartoum, Sudan",     "+46":"Stockholm, Sweden",     "+41":"Bern, Switzerland",
  "+963":"Damascus, Syria",     "+886":"Taipei, Taiwan",       "+992":"Dushanbe, Tajikistan",
  "+255":"Dodoma, Tanzania",    "+66":"Bangkok, Thailand",     "+228":"Lomé, Togo",
  "+1868":"Port of Spain, Trinidad & Tobago","+216":"Tunis, Tunisia","+90":"Ankara, Turkey",
  "+993":"Ashgabat, Turkmenistan","+256":"Kampala, Uganda",    "+380":"Kyiv, Ukraine",
  "+971":"Abu Dhabi, UAE",      "+598":"Montevideo, Uruguay",  "+998":"Tashkent, Uzbekistan",
  "+58":"Caracas, Venezuela",   "+84":"Hanoi, Vietnam",        "+967":"Sana'a, Yemen",
  "+260":"Lusaka, Zambia",      "+263":"Harare, Zimbabwe",
};

/* ── Random placeholder helper ───────────────────────────────── */
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

const PH = {
  personas: [
    { name:"Alex Johnson",      email:"alex.johnson@gmail.com"        },
    { name:"Jordan Smith",      email:"jordan.smith@outlook.com"      },
    { name:"Priya Patel",       email:"priya.patel@email.com"         },
    { name:"Marcus Williams",   email:"m.williams@email.co.uk"        },
    { name:"Emma Clarke",       email:"emma.clarke@gmail.com"         },
    { name:"Sophie Bennett",    email:"s.bennett@outlook.com"         },
    { name:"Liam Carter",       email:"liam.carter@email.com"         },
    { name:"Olivia Harris",     email:"olivia.harris@gmail.com"       },
    { name:"Noah Thompson",     email:"n.thompson@outlook.com"        },
    { name:"Ava Robinson",      email:"ava.robinson@email.com"        },
    { name:"Ethan Mitchell",    email:"ethan.mitchell@gmail.com"      },
    { name:"Isabella Turner",   email:"i.turner@email.co.uk"          },
    { name:"James Walker",      email:"james.walker@gmail.com"        },
    { name:"Mia Anderson",      email:"mia.anderson@outlook.com"      },
    { name:"Oliver Brown",      email:"o.brown@email.com"             },
    { name:"Charlotte Davis",   email:"charlotte.davis@gmail.com"     },
    { name:"Harry Wilson",      email:"h.wilson@email.co.uk"          },
    { name:"Amelia Moore",      email:"amelia.moore@outlook.com"      },
    { name:"Jack Taylor",       email:"jack.taylor@gmail.com"         },
    { name:"Freya Evans",       email:"freya.evans@email.com"         },
    { name:"Ryan Martinez",     email:"r.martinez@gmail.com"          },
    { name:"Zoe Jackson",       email:"zoe.jackson@outlook.com"       },
    { name:"Daniel White",      email:"daniel.white@gmail.com"        },
    { name:"Grace Thomas",      email:"grace.thomas@email.co.uk"      },
    { name:"Samuel Lewis",      email:"sam.lewis@outlook.com"         },
    { name:"Chloe Roberts",     email:"chloe.roberts@gmail.com"       },
    { name:"Benjamin Hall",     email:"b.hall@email.com"              },
    { name:"Emily Green",       email:"emily.green@gmail.com"         },
    { name:"Lucas Adams",       email:"lucas.adams@outlook.com"       },
    { name:"Hannah Scott",      email:"h.scott@email.co.uk"           },
  ],
  title:    ["Senior UX Designer", "Software Engineer", "Product Manager", "Marketing Executive", "Data Analyst", "Operations Lead", "Full Stack Developer"],
  phone:    ["7700 000000", "7900 123456", "7800 654321", "7711 223344", "7833 445566"],
  location: ["London, UK", "Manchester, UK", "New York, US", "Toronto, Canada", "Sydney, Australia", "Berlin, Germany", "Dublin, Ireland"],
  summary:  [
    "Passionate designer with 5+ years crafting user-centred digital products for startups and scale-ups...",
    "Results-driven engineer with expertise in cloud infrastructure and high-performance systems...",
    "Creative problem-solver with a track record of launching successful products from 0 to 1...",
    "Strategic marketing leader with a passion for data-driven campaigns and brand growth...",
  ],
  company:  ["Acme Ltd", "TechFlow Inc", "Bright Digital", "Nova Solutions", "Peak Corp", "Orion Media", "Vertex Systems"],
  role:     ["Product Manager", "Senior Developer", "UX Lead", "Marketing Manager", "Operations Director", "Data Engineer", "Brand Strategist"],
  duration: ["Mar 2022 – Present", "Jan 2020 – Dec 2022", "Jun 2019 – Feb 2022", "Sep 2021 – Present", "Apr 2018 – May 2021"],
  desc:     [
    "Managed product roadmap, led cross-functional team of 6, launched 3 key features, improved retention by 18%...",
    "Built scalable microservices handling 2M+ daily requests, reduced API latency by 40%, mentored 3 junior devs...",
    "Spearheaded rebranding campaign that lifted conversions by 32%, managed £400k budget across 5 channels...",
    "Designed end-to-end user flows for iOS and Android, ran usability tests, increased task completion rate by 27%...",
    "Automated reporting pipelines saving 12hrs/week, built dashboards used daily by leadership team...",
  ],
  education:[
    "BSc Computer Science, University of Manchester, 2020",
    "BA Business Management, King's College London, 2019",
    "MSc Data Science, University of Edinburgh, 2021",
    "BEng Mechanical Engineering, University of Leeds, 2018",
    "BA Graphic Design, Central Saint Martins, 2020",
  ],
  skills:   [
    "React, TypeScript, Node.js, PostgreSQL, AWS, Docker, Agile, Leadership",
    "Python, Machine Learning, Pandas, SQL, Tableau, A/B Testing, Statistics",
    "Figma, Adobe XD, User Research, Prototyping, HTML/CSS, Accessibility",
    "SEO, Google Analytics, Content Strategy, HubSpot, Copywriting, PPC",
    "Java, Spring Boot, Kubernetes, CI/CD, Microservices, System Design",
  ],
  targetJob:[
    "Senior Frontend Engineer at a fast-growing tech startup",
    "Product Manager at a fintech company in London",
    "UX Designer at a creative agency focused on mobile apps",
    "Data Scientist at a healthcare analytics company",
    "Marketing Manager at a DTC e-commerce brand",
  ],
};

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
.field-input::placeholder{color:${t.textSoft};opacity:.45;}
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
  .phone-row{flex-direction:column!important;align-items:stretch!important;}
  .phone-row .phone-select{width:100%!important;max-width:none!important;}
}
`;

/* ── Upsell Config ───────────────────────────────────────────── */
const UPSELLS_DEF = [
  { id:"cover",    icon:"✉", title:"Cover Letter",    desc:"AI-crafted cover letter perfectly matched to your resume",           price:"£2.99", cta:"Add Cover Letter",  ck:"copper" },
  { id:"linkedin", icon:"◈", title:"LinkedIn Bio",     desc:"Optimised LinkedIn About section that gets noticed by recruiters",  price:"£1.99", cta:"Add LinkedIn Bio",  ck:"teal"   },
  { id:"ats",      icon:"◎", title:"ATS Score Report", desc:"See exactly how your resume scores against ATS systems + fix tips", price:"£3.99", cta:"Get ATS Report",    ck:"gold"   },
];

const steps = ["Your Info", "Experience", "Skills", "Generate", "Resume"];

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
function Label({ children, required }) {
  const t = useT();
  return <label style={{ display:"block", fontSize:10, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".12em", marginBottom:8 }}>{children}{required && <span style={{ color:t.errText, marginLeft:2 }}>*</span>}</label>;
}

function Input({ label, value, onChange, placeholder, type="text", hint, error, required }) {
  const t = useT();
  return (
    <div style={{ marginBottom:22 }}>
      {label && <Label required={required}>{label}</Label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        className="field-input"
        style={error ? { borderBottom:`2px solid ${t.errText}` } : undefined}
      />
      {error ? <p style={{ fontSize:11.5, color:t.errText, marginTop:4, fontWeight:500 }}>{error}</p>
             : hint ? <p style={{ fontSize:11, color:t.textSoft, marginTop:5 }}>{hint}</p> : null}
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=4, error }) {
  const t = useT();
  return (
    <div style={{ marginBottom:22 }}>
      {label && <Label>{label}</Label>}
      <textarea value={value} placeholder={placeholder} rows={rows} onChange={e => onChange(e.target.value)}
        className="field-input"
        style={{ lineHeight:1.65, ...(error ? { borderBottom:`2px solid ${t.errText}` } : {}) }}
      />
      {error && <p style={{ fontSize:11.5, color:t.errText, marginTop:4, fontWeight:500 }}>{error}</p>}
    </div>
  );
}

function PhoneInput({ dialCode, onDialChange, phone, onPhoneChange, placeholder="7700 000000", error, required }) {
  const t = useT();
  return (
    <div style={{ marginBottom:22 }}>
      <Label required={required}>Phone</Label>
      <div className="phone-row" style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
        <div style={{ flexShrink:0, minWidth:220 }}>
          <select
            value={dialCode}
            onChange={e => onDialChange(e.target.value)}
            className="phone-select"
            style={{ padding:"10px 6px", border:"none", borderBottom:`2px solid ${t.border}`, background:"transparent", fontSize:13.5, color:t.text, fontFamily:"'Poppins',sans-serif", cursor:"pointer", outline:"none", width:"100%" }}
          >
            {COUNTRIES.map((c, i) => (
              <option key={i} value={c.dial}>{c.name} ({c.dial})</option>
            ))}
          </select>
        </div>
        <div style={{ flex:1 }}>
          <input
            type="tel"
            value={phone}
            onChange={e => onPhoneChange(e.target.value)}
            placeholder={placeholder}
            className="field-input"
            style={{ width:"100%", ...(error ? { borderBottom:`2px solid ${t.errText}` } : {}) }}
          />
          {error && <p style={{ fontSize:11.5, color:t.errText, marginTop:4, fontWeight:500 }}>{error}</p>}
        </div>
      </div>
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
function StepsBar({ current, maxStep, onStepClick }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:40 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const clickable = i !== current && i <= maxStep;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center", flex:i<steps.length-1?1:"none" }}>
            <div
              onClick={() => clickable && onStepClick(i)}
              style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, cursor:clickable?"pointer":"default" }}
              title={clickable ? `Go to ${s}` : undefined}
            >
              <div style={{
                width:28, height:28, borderRadius:"50%", fontSize:11, fontWeight:700,
                display:"flex", alignItems:"center", justifyContent:"center",
                background:done?t.copper:active?t.primary:"transparent",
                border:`2px solid ${done?t.copper:active?t.primary:t.border}`,
                color:done||active?t.primaryFg:t.textSoft, transition:"all .3s ease",
                boxShadow:active?`0 0 0 4px ${t.primary}18`:"none",
                transform:clickable?"scale(1.05)":"none",
              }}>{done ? "✓" : i + 1}</div>
              <span className="step-label" style={{ fontWeight:active?600:400, color:active?t.primary:done?t.copper:t.textSoft, transition:"color .3s", textDecoration:clickable?"underline dotted":"none", textUnderlineOffset:3 }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex:1, height:2, margin:"0 12px", background:done?t.copper:t.border, transition:"background .4s ease", borderRadius:2 }} />}
          </div>
        );
      })}
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
  const [tried, setTried] = useState(false);
  const p = useMemo(() => { const persona = rnd(PH.personas); return { name:persona.name, email:persona.email, title:rnd(PH.title), phone:rnd(PH.phone), locationFallback:rnd(PH.location), summary:rnd(PH.summary) }; }, []);
  const locationPlaceholder = DIAL_TO_LOCATION[form.dialCode] || p.locationFallback;
  const emailInvalid = !form.email.trim() ? "req" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "fmt" : "";
  const hasErrors = !form.name.trim() || !form.title.trim() || emailInvalid || !form.phone.trim() || !form.location.trim();
  const e = tried ? {
    name:     !form.name.trim()     ? "This field is required" : "",
    title:    !form.title.trim()    ? "This field is required" : "",
    email:    emailInvalid === "req" ? "This field is required" : emailInvalid === "fmt" ? "Enter a valid email address" : "",
    phone:    !form.phone.trim()    ? "This field is required" : "",
    location: !form.location.trim() ? "This field is required" : "",
  } : {};
  const handleNext = () => { setTried(true); if (!hasErrors) onNext(); };
  return (
    <div className="a0">
      <StepHead title="Personal Details" subtitle="Let's start with the basics — fields marked with * are required." />
      <div className="two-col">
        <Input label="Full Name" value={form.name} onChange={u("name")} placeholder={p.name} error={e.name} required />
        <Input label="Job Title" value={form.title} onChange={u("title")} placeholder={p.title} error={e.title} required />
      </div>
      <Input label="Email" value={form.email} onChange={u("email")} placeholder={p.email} type="email" error={e.email} required />
      <PhoneInput
        dialCode={form.dialCode}
        onDialChange={v => setForm(f => ({ ...f, dialCode:v }))}
        phone={form.phone}
        onPhoneChange={v => setForm(f => ({ ...f, phone:v }))}
        placeholder={p.phone}
        error={e.phone}
        required
      />
      <Input label="Location" value={form.location} onChange={u("location")} placeholder={locationPlaceholder} error={e.location} required />
      <Textarea label="Brief Summary (optional — AI will enhance it)" value={form.summary} onChange={u("summary")} placeholder={p.summary} rows={3} />
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
        <Btn onClick={handleNext}>Continue →</Btn>
      </div>
    </div>
  );
}

/* ── Date Range Input ────────────────────────────────────────── */
function DateRangeInput({ dateStart, dateEnd, datePresent, onChange, errorStart, errorEnd }) {
  const t = useT();
  const today = new Date().toISOString().split("T")[0];
  const cs = t.bg==="#080e1a" ? "dark" : "light";
  return (
    <div style={{ marginBottom:22 }}>
      <Label>Dates</Label>
      <div style={{ display:"flex", alignItems:"flex-end", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:130 }}>
          <span style={{ fontSize:10, color:t.textSoft, display:"block", marginBottom:6, fontWeight:500 }}>Start date</span>
          <input type="date" value={dateStart} max={today}
            onChange={e => onChange({ dateStart:e.target.value })}
            className="field-input"
            style={{ width:"100%", colorScheme:cs, ...(errorStart ? { borderBottom:`2px solid ${t.errText}` } : {}) }}
          />
          {errorStart && <p style={{ fontSize:11.5, color:t.errText, marginTop:4, fontWeight:500 }}>{errorStart}</p>}
        </div>
        <div style={{ flex:1, minWidth:130, opacity:datePresent?0.4:1, transition:"opacity .2s" }}>
          <span style={{ fontSize:10, color:t.textSoft, display:"block", marginBottom:6, fontWeight:500 }}>End date</span>
          <input type="date" value={dateEnd} max={today} disabled={datePresent}
            onChange={e => onChange({ dateEnd:e.target.value })}
            className="field-input"
            style={{ width:"100%", colorScheme:cs, ...(errorEnd&&!datePresent ? { borderBottom:`2px solid ${t.errText}` } : {}) }}
          />
          {errorEnd && !datePresent && <p style={{ fontSize:11.5, color:t.errText, marginTop:4, fontWeight:500 }}>{errorEnd}</p>}
        </div>
        <label style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", flexShrink:0, paddingBottom:errorStart||errorEnd?22:11 }}>
          <input type="checkbox" checked={datePresent}
            onChange={e => onChange({ datePresent:e.target.checked, ...(e.target.checked ? { dateEnd:"" } : {}) })}
            style={{ width:15, height:15, accentColor:t.copper, cursor:"pointer" }}
          />
          <span style={{ fontSize:13, color:t.textMid, fontWeight:500 }}>Present</span>
        </label>
      </div>
    </div>
  );
}

/* ── Step 2 ──────────────────────────────────────────────────── */
function Step2({ form, setForm, onNext, onBack }) {
  const t = useT();
  const add = () => setForm(f => ({ ...f, experience:[...f.experience, { company:"", role:"", dateStart:"", dateEnd:"", datePresent:false, description:"" }] }));
  const upd = (i, k, v) => setForm(f => { const e = [...f.experience]; e[i] = { ...e[i], [k]:v }; return { ...f, experience:e }; });
  const rem = i => setForm(f => ({ ...f, experience:f.experience.filter((_, j) => j !== i) }));
  const p = useMemo(() => Array.from({length:8}, () => ({ company:rnd(PH.company), role:rnd(PH.role), duration:rnd(PH.duration), desc:rnd(PH.desc) })), []);
  const edu = useMemo(() => rnd(PH.education), []);
  const [tried, setTried] = useState(false);

  const expHasErrors = !form.noExperience && form.experience.some(e =>
    !e.company.trim() || !e.role.trim() || !e.dateStart || (!e.datePresent && !e.dateEnd) || !e.description.trim()
  );
  const hasErrors = expHasErrors || !form.education.trim();
  const handleNext = () => { setTried(true); if (!hasErrors) onNext(); };

  const expErrors = tried && !form.noExperience ? form.experience.map(e => ({
    company:     !e.company.trim()                    ? "This field is required" : "",
    role:        !e.role.trim()                       ? "This field is required" : "",
    dateStart:   !e.dateStart                         ? "This field is required" : "",
    dateEnd:     !e.datePresent && !e.dateEnd         ? "This field is required" : "",
    description: !e.description.trim()               ? "This field is required" : "",
  })) : form.experience.map(() => ({}));
  const eduError = tried && !form.education.trim() ? "This field is required" : "";

  return (
    <div className="a0">
      <StepHead title="Work Experience" subtitle="Add your roles — AI will write compelling bullet points." />

      {/* No experience toggle */}
      <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", marginBottom:18, padding:"11px 14px", borderRadius:9, background:form.noExperience?`${t.copper}12`:t.surface, border:`1.5px solid ${form.noExperience?t.copper:t.border}`, transition:"all .2s" }}>
        <input type="checkbox" checked={!!form.noExperience} onChange={e => setForm(f => ({ ...f, noExperience:e.target.checked }))}
          style={{ width:15, height:15, accentColor:t.copper, cursor:"pointer", flexShrink:0 }} />
        <span style={{ fontSize:13, color:form.noExperience?t.copper:t.textMid, fontWeight:500 }}>I have no previous employment</span>
      </label>

      {!form.noExperience && (
        <>
          {form.experience.map((exp, i) => (
            <div key={i} style={{ border:`1px solid ${t.border}`, borderLeft:`3px solid ${t.copper}`, borderRadius:"0 10px 10px 0", padding:"20px 20px 4px", marginBottom:14, background:t.surface }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ fontSize:10, fontWeight:700, color:t.copper, textTransform:"uppercase", letterSpacing:".12em" }}>Role {i + 1}</span>
                {form.experience.length > 1 && <button onClick={() => rem(i)} style={{ background:"none", border:"none", color:t.textSoft, fontSize:16, lineHeight:1 }}>✕</button>}
              </div>
              <div className="two-col">
                <Input label="Company" value={exp.company} onChange={v => upd(i,"company",v)} placeholder={p[i]?.company} error={expErrors[i]?.company} />
                <Input label="Job Title" value={exp.role} onChange={v => upd(i,"role",v)} placeholder={p[i]?.role} error={expErrors[i]?.role} />
              </div>
              <DateRangeInput
                dateStart={exp.dateStart} dateEnd={exp.dateEnd} datePresent={exp.datePresent}
                onChange={changes => setForm(f => { const e=[...f.experience]; e[i]={...e[i],...changes}; return {...f,experience:e}; })}
                errorStart={expErrors[i]?.dateStart} errorEnd={expErrors[i]?.dateEnd}
              />
              <Textarea label="What did you do? (rough notes fine)" value={exp.description} onChange={v => upd(i,"description",v)} placeholder={p[i]?.desc} rows={3} error={expErrors[i]?.description} />
            </div>
          ))}
          <button onClick={add} style={{ width:"100%", padding:11, background:"transparent", border:`1.5px dashed ${t.border}`, borderRadius:8, color:t.textSoft, fontSize:13, marginBottom:22, transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.copper; e.currentTarget.style.color = t.copper; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSoft; }}>
            + Add another role
          </button>
        </>
      )}

      <Textarea label="Education (write 'None' if not applicable)" value={form.education} onChange={v => setForm(f => ({ ...f, education:v }))} placeholder={`e.g. ${edu} — or write None`} rows={2} error={eduError} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={handleNext}>Continue →</Btn>
      </div>
    </div>
  );
}

/* ── Step 3 ──────────────────────────────────────────────────── */
function Step3({ form, setForm, onNext, onBack }) {
  const t = useT();
  const u = k => v => setForm(f => ({ ...f, [k]:v }));
  const tones = ["professional","confident","creative","technical","executive"];
  const p = useMemo(() => ({ skills:rnd(PH.skills), targetJob:rnd(PH.targetJob) }), []);
  const [tried, setTried] = useState(false);
  const hasErrors = !form.skills.trim() || !form.targetJob.trim();
  const handleNext = () => { setTried(true); if (!hasErrors) onNext(); };
  const skillsError   = tried && !form.skills.trim()    ? "This field is required" : "";
  const targetJobError = tried && !form.targetJob.trim() ? "This field is required" : "";
  return (
    <div className="a0">
      <StepHead title="Skills & Target Role" subtitle="This is what the AI optimises for." />
      <Textarea label="Your Skills" value={form.skills} onChange={u("skills")} placeholder={p.skills} rows={3} error={skillsError} />
      <Input label="Target Job" value={form.targetJob} onChange={u("targetJob")} placeholder={p.targetJob} hint="Be specific — the more detail, the better the AI tailors your resume." error={targetJobError} />
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
        <Btn onClick={handleNext}>Next →</Btn>
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
/* ── Step 4 — Generate ───────────────────────────────────────── */
function StepGenerate({ form, onNext, onBack }) {
  const t = useT();
  return (
    <div className="a0">
      <StepHead title="Ready to Generate" subtitle="Review your details below, then hit generate when you're ready." />
      <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:10, padding:"20px 24px", marginBottom:28 }}>
        {[
          ["Name", form.name],
          ["Job Title", form.title],
          ["Email", form.email],
          ["Phone", `${form.dialCode} ${form.phone}`],
          ["Location", form.location],
          ["Target Role", form.targetJob],
          ["Tone", form.tone],
          ["Skills", form.skills],
          ["Education", form.education],
        ].map(([label, val]) => val ? (
          <div key={label} style={{ display:"flex", gap:12, padding:"7px 0", borderBottom:`1px solid ${t.border}` }}>
            <span style={{ fontSize:11.5, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".08em", minWidth:100 }}>{label}</span>
            <span style={{ fontSize:13.5, color:t.text, flex:1 }}>{val}</span>
          </div>
        ) : null)}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={onNext}>Generate Resume ✦</Btn>
      </div>
    </div>
  );
}

/* ── Step 5 — Results ────────────────────────────────────────── */
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
    const fmtDate = iso => { if(!iso) return ""; const [y,m,d]=iso.split("-"); return `${d}/${m}/${y.slice(2)}`; };
    const exp = form.experience.map((e, i) => {
      const dur = e.datePresent ? `${fmtDate(e.dateStart)} – Present` : `${fmtDate(e.dateStart)} – ${fmtDate(e.dateEnd)}`;
      return `${i+1}. ${e.role} at ${e.company} (${dur}): ${e.description}`;
    }).join("\n");
    return `You are an expert resume writer. Write a polished, ATS-optimised resume.

Name: ${form.name} | Title: ${form.title} | Email: ${form.email} | Phone: ${form.dialCode}${form.phone} | Location: ${form.location}
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

  const apiHeaders = () => {
    const key = (() => { try { return localStorage.getItem("resumeai-api-key") || ""; } catch { return ""; } })();
    const gid = (() => { try { return localStorage.getItem("resumeai-group-id") || ""; } catch { return ""; } })();
    const model = (() => { try { return localStorage.getItem("resumeai-model") || "MiniMax-M2.5"; } catch { return "MiniMax-M2.5"; } })();
    const endpoint = (() => { try { return localStorage.getItem("resumeai-endpoint") || ""; } catch { return ""; } })();
    return { "Content-Type":"application/json", ...(key ? { "x-api-key": key } : {}), ...(gid ? { "x-group-id": gid } : {}), "x-model": model, ...(endpoint ? { "x-endpoint": endpoint } : {}) };
  };

  const generate = async () => {
    setLoading(true); setError(""); setUnlocked(false);
    try {
      const res = await fetch(API, { method:"POST", headers:apiHeaders(), body:JSON.stringify({ model:"MiniMax-M2.5", max_tokens:2000, messages:[{ role:"user", content:buildPrompt() }] }) });
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
      const res = await fetch(API, { method:"POST", headers:apiHeaders(), body:JSON.stringify({ model:"MiniMax-M2.5", max_tokens:2000, messages:[{ role:"user", content:prompts[id] }] }) });
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

/* ── Settings Modal ─────────────────────────────────────────── */
function SettingsModal({ onClose }) {
  const t = useT();
  const [key, setKey] = useState(() => { try { return localStorage.getItem("resumeai-api-key") || ""; } catch { return ""; } });
  const [groupId, setGroupId] = useState(() => { try { return localStorage.getItem("resumeai-group-id") || ""; } catch { return ""; } });
  const [model, setModel] = useState(() => { try { return localStorage.getItem("resumeai-model") || "MiniMax-M2.5"; } catch { return "MiniMax-M2.5"; } });
  const [endpoint, setEndpoint] = useState(() => { try { return localStorage.getItem("resumeai-endpoint") || "https://api.minimax.chat/v1/chat/completions"; } catch { return "https://api.minimax.chat/v1/chat/completions"; } });
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  const normaliseEndpoint = ep => {
    const v = (ep || "").trim();
    if (!v) return "https://api.minimax.chat/v1/chat/completions";
    return v.startsWith("http") ? v : "https://" + v;
  };

  const save = () => {
    try {
      localStorage.setItem("resumeai-api-key", key);
      localStorage.setItem("resumeai-group-id", groupId);
      localStorage.setItem("resumeai-model", model || "MiniMax-M2.5");
      localStorage.setItem("resumeai-endpoint", normaliseEndpoint(endpoint));
    } catch {}
    setEndpoint(normaliseEndpoint(endpoint));
    setMsg(""); setStatus(null);
  };

  const test = async () => {
    if (!key.trim()) { setStatus("error"); setMsg("Please enter an API key first."); return; }
    setStatus("testing"); setMsg("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key.trim(), "x-group-id": groupId.trim(), "x-model": model || "MiniMax-M2.5", "x-endpoint": endpoint },
        body: JSON.stringify({ messages:[{ role:"user", content:"Say OK" }], max_tokens:10 }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      if (data.error?.message) { setStatus("error"); setMsg(data.error.message); }
      else if (text) {
        setStatus("ok"); setMsg("Connection successful!");
        try { localStorage.setItem("resumeai-api-key", key); localStorage.setItem("resumeai-group-id", groupId); localStorage.setItem("resumeai-model", model || "MiniMax-M2.5"); localStorage.setItem("resumeai-endpoint", endpoint); } catch {}
      }
      else { setStatus("error"); setMsg("Unexpected response — check your key."); }
    } catch(e) { setStatus("error"); setMsg(e.message); }
  };

  const statusColor = status === "ok" ? "#27795a" : status === "error" ? t.errText : t.textSoft;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.45)", backdropFilter:"blur(4px)" }} />
      <div style={{ position:"relative", background:t.surface, border:`1px solid ${t.border}`, borderRadius:14, padding:"32px 36px", width:"100%", maxWidth:480, boxShadow:`0 24px 60px rgba(0,0,0,.18)` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:20, fontWeight:700, color:t.primary, margin:0 }}>Settings</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, color:t.textSoft, cursor:"pointer", lineHeight:1 }}>✕</button>
        </div>

        <label style={{ display:"block", fontSize:10, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".12em", marginBottom:8 }}>MiniMax API Key</label>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input
            type={show ? "text" : "password"}
            value={key}
            onChange={e => { setKey(e.target.value); setStatus(null); setMsg(""); }}
            placeholder="Enter your MiniMax API key"
            className="field-input"
            style={{ flex:1 }}
          />
          <button onClick={() => setShow(s => !s)} style={{ background:"none", border:`1px solid ${t.border}`, borderRadius:6, padding:"0 12px", fontSize:12, color:t.textSoft, cursor:"pointer", flexShrink:0 }}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
        <p style={{ fontSize:11.5, color:t.textSoft, marginBottom:20 }}>
          Get your key and Group ID from <span style={{ color:t.copper, fontWeight:600 }}>minimax.chat</span> → API Keys. Stored locally in your browser only.
        </p>

        <label style={{ display:"block", fontSize:10, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".12em", marginBottom:8 }}>Group ID</label>
        <input
          type="text"
          value={groupId}
          onChange={e => { setGroupId(e.target.value); setStatus(null); setMsg(""); }}
          placeholder="Enter your MiniMax Group ID"
          className="field-input"
          style={{ marginBottom:20 }}
        />

        <label style={{ display:"block", fontSize:10, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".12em", marginBottom:8 }}>Model</label>
        <input
          type="text"
          value={model}
          onChange={e => setModel(e.target.value)}
          placeholder="MiniMax-M2.5"
          className="field-input"
          style={{ marginBottom:20 }}
        />

        <label style={{ display:"block", fontSize:10, fontWeight:600, color:t.textSoft, textTransform:"uppercase", letterSpacing:".12em", marginBottom:8 }}>API Endpoint</label>
        <input
          type="text"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          placeholder="https://api.minimax.chat/v1/chat/completions"
          className="field-input"
          style={{ marginBottom:6 }}
        />
        <p style={{ fontSize:11, color:t.textSoft, marginBottom:20 }}>
          International: <span style={{ color:t.copper }}>api.minimax.chat</span> · Domestic: <span style={{ color:t.copper }}>api.minimax.chat</span>
        </p>

        {msg && <p style={{ fontSize:12.5, color:statusColor, marginBottom:16, fontWeight:500 }}>{status === "ok" ? "✓ " : status === "error" ? "✕ " : ""}{msg}</p>}

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <Btn variant="ghost" onClick={onClose} small>Cancel</Btn>
          <Btn variant="ghost" onClick={test} small disabled={status === "testing"}>{status === "testing" ? "Testing…" : "Test Connection"}</Btn>
          <Btn small onClick={() => { save(); onClose(); }}>Save</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────── */
const initForm = {
  name:"", title:"", email:"", dialCode:"+44", phone:"", location:"", summary:"",
  experience:[{ company:"", role:"", dateStart:"", dateEnd:"", datePresent:false, description:"" }],
  noExperience:false, education:"", skills:"", targetJob:"", tone:"professional",
};

const TEST_FORM = {
  name:"James Carter", title:"Senior Software Engineer", email:"james.carter@example.com",
  dialCode:"+44", phone:"7911 123456", location:"London, UK",
  summary:"Passionate software engineer with 6 years of experience building scalable web applications.",
  experience:[{
    company:"TechCorp Ltd", role:"Senior Software Engineer",
    dateStart:"2021-03-01", dateEnd:"", datePresent:true,
    description:"Led development of a microservices platform handling 2M daily requests, reducing latency by 40%.",
  },{
    company:"StartupXYZ", role:"Software Engineer",
    dateStart:"2018-06-01", dateEnd:"2021-02-28", datePresent:false,
    description:"Built React frontend and Node.js API for a SaaS product, growing to 10k users.",
  }],
  noExperience:false,
  education:"BSc Computer Science, University of Manchester, 2018",
  skills:"JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, Docker, AWS",
  targetJob:"Lead Software Engineer at a fintech startup",
  tone:"professional",
};

export default function App() {
  const [screen, setScreen] = useState("hero");
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [form, setForm] = useState(initForm);
  const [showSettings, setShowSettings] = useState(false);
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
  const reset = () => { setStep(0); setMaxStep(0); setForm(initForm); setScreen("hero"); };

  return (
    <Ctx.Provider value={t}>
      <style>{fonts + buildCss(t)}</style>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
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
              <div style={{ width:32, height:32, borderRadius:8, background:t.primary, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.primaryFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:18, color:t.primary, letterSpacing:"-.02em" }}>{BRAND}</span>
            </div>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              {screen === "builder" && (<>
                <button onClick={() => { setForm(TEST_FORM); setStep(0); setMaxStep(0); }} style={{ background:"none", border:`1px dashed ${t.border}`, borderRadius:6, color:t.textSoft, fontSize:12, padding:"4px 10px", cursor:"pointer", transition:"color .15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = t.copper}
                  onMouseLeave={e => e.currentTarget.style.color = t.textSoft}>
                  Fill Test Data
                </button>
                <button onClick={reset} style={{ background:"none", border:"none", color:t.textSoft, fontSize:13, cursor:"pointer", transition:"color .15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = t.primary}
                  onMouseLeave={e => e.currentTarget.style.color = t.textSoft}>
                  ← Start over
                </button>
              </>)}
              <button onClick={() => setShowSettings(true)} title="Settings" style={{ background:"none", border:"none", color:t.textSoft, cursor:"pointer", display:"flex", alignItems:"center", padding:4 }}
                onMouseEnter={e => e.currentTarget.style.color = t.primary}
                onMouseLeave={e => e.currentTarget.style.color = t.textSoft}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
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
                <StepsBar current={step} maxStep={maxStep} onStepClick={i => setStep(i)} />
                {step === 0 && <Step1 form={form} setForm={setForm} onNext={() => { setStep(1); setMaxStep(m => Math.max(m, 1)); }} />}
                {step === 1 && <Step2 form={form} setForm={setForm} onNext={() => { setStep(2); setMaxStep(m => Math.max(m, 2)); }} onBack={() => setStep(0)} />}
                {step === 2 && <Step3 form={form} setForm={setForm} onNext={() => { setStep(3); setMaxStep(m => Math.max(m, 3)); }} onBack={() => setStep(1)} />}
                {step === 3 && <StepGenerate form={form} onNext={() => { setStep(4); setMaxStep(m => Math.max(m, 4)); }} onBack={() => setStep(2)} />}
                {step === 4 && <Step4 form={form} onBack={() => setStep(3)} onReset={reset} />}
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
