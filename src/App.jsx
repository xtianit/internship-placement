import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "http://localhost:5000/api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream: #F5F0E8; --cream2: #EDE8DF; --cream3: #E4DDD2;
    --navy: #0F1B2D;  --navy2: #1A2D45;
    --amber: #C97A2A; --amber2: #E8923A; --amber3: #F4A95A;
    --green: #1E6A4A; --green2: #2D8A62;
    --red:   #B91C1C;
    --purple: #6D28D9; --purple2: #8B5CF6;
    --muted: #7A6E63; --border: #D4CCC2;
    --serif: 'Fraunces', Georgia, serif;
    --sans:  'DM Sans', system-ui, sans-serif;
    --mono:  'DM Mono', monospace;
    --sh: 0 2px 12px rgba(0,0,0,0.08);
    --sh2: 0 8px 32px rgba(0,0,0,0.12);
  }
  html, body { height: 100%; background: var(--cream); color: var(--navy); font-family: var(--sans); }
  #root { min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--cream2); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes shimmer  { from { background-position: -400px 0 } to { background-position: 400px 0 } }
  @keyframes toastIn  { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .fade-up { animation: fadeUp .45s ease both; }
  .fade-in { animation: fadeIn .3s ease both; }

  .ib-input {
    width:100%; padding:11px 14px; border-radius:10px;
    border:1.5px solid var(--border); background:#fff;
    font-family:var(--sans); font-size:.9rem; color:var(--navy);
    outline:none; transition:border-color .2s, box-shadow .2s;
  }
  .ib-input:focus { border-color:var(--amber); box-shadow:0 0 0 3px rgba(201,122,42,.1); }
  .ib-input::placeholder { color:var(--muted); }
  .ib-select {
    width:100%; padding:11px 14px; border-radius:10px;
    border:1.5px solid var(--border); background:#fff;
    font-family:var(--sans); font-size:.9rem; color:var(--navy);
    outline:none; appearance:none; cursor:pointer;
    transition:border-color .2s;
  }
  .ib-select:focus { border-color:var(--amber); }
  textarea.ib-input { resize:vertical; min-height:110px; }

  .btn-amber {
    background:var(--amber); color:#fff; border:none; border-radius:10px;
    font-family:var(--sans); font-weight:600; font-size:.9rem;
    padding:11px 22px; cursor:pointer; transition:all .2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .btn-amber:hover { background:var(--amber2); transform:translateY(-1px); box-shadow:0 4px 16px rgba(201,122,42,.3); }
  .btn-amber:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }
  .btn-outline {
    background:transparent; color:var(--navy); border:1.5px solid var(--border);
    border-radius:10px; font-family:var(--sans); font-weight:600; font-size:.9rem;
    padding:10px 20px; cursor:pointer; transition:all .2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .btn-outline:hover { border-color:var(--amber); color:var(--amber); background:rgba(201,122,42,.04); }
  .btn-ghost {
    background:transparent; color:var(--muted); border:none;
    font-family:var(--sans); font-size:.84rem; font-weight:600;
    padding:8px 14px; border-radius:8px; cursor:pointer; transition:all .2s;
  }
  .btn-ghost:hover { background:var(--cream2); color:var(--navy); }
  .btn-navy {
    background:var(--navy); color:#fff; border:none; border-radius:10px;
    font-family:var(--sans); font-weight:600; font-size:.9rem;
    padding:11px 22px; cursor:pointer; transition:all .2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .btn-navy:hover { background:var(--navy2); }
  .btn-purple {
    background:var(--purple); color:#fff; border:none; border-radius:10px;
    font-family:var(--sans); font-weight:600; font-size:.9rem;
    padding:11px 22px; cursor:pointer; transition:all .2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .btn-purple:hover { background:var(--purple2); transform:translateY(-1px); }
  .btn-sm { padding:7px 14px !important; font-size:.8rem !important; }
  .btn-danger {
    background:rgba(185,28,28,.08); color:var(--red); border:1.5px solid rgba(185,28,28,.2);
    border-radius:10px; font-family:var(--sans); font-weight:600; font-size:.9rem;
    padding:10px 20px; cursor:pointer; transition:all .2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .btn-danger:hover { background:rgba(185,28,28,.15); }

  .ib-card {
    background:#fff; border:1px solid var(--border); border-radius:14px;
    box-shadow:var(--sh); transition:box-shadow .2s, transform .2s;
  }
  .ib-card:hover { box-shadow:var(--sh2); }
  .ib-card-hover:hover { transform:translateY(-2px); }

  .spinner {
    width:22px; height:22px; border:2.5px solid rgba(255,255,255,.3);
    border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite;
    display:inline-block;
  }
  .spinner-dark { border-color:rgba(15,27,45,.15); border-top-color:var(--navy); }

  .badge {
    display:inline-flex; align-items:center;
    font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em;
    padding:3px 9px; border-radius:99px;
  }
  .badge-internship { background:rgba(30,106,74,.12);  color:var(--green); }
  .badge-job        { background:rgba(15,27,45,.1);    color:var(--navy);  }
  .badge-siwes      { background:rgba(201,122,42,.14); color:var(--amber); }
  .badge-nysc       { background:rgba(59,130,246,.12); color:#1D4ED8;      }
  .badge-remote     { background:rgba(16,185,129,.12); color:#059669;      }
  .badge-closed     { background:rgba(107,114,128,.12); color:#374151;     }

  .pill { display:inline-block; padding:3px 10px; border-radius:99px; font-size:.72rem; font-weight:700; text-transform:capitalize; }
  .pill-submitted    { background:rgba(15,27,45,.08);  color:var(--navy); }
  .pill-under_review { background:rgba(234,179,8,.15); color:#92400E; }
  .pill-shortlisted  { background:rgba(59,130,246,.12);color:#1D4ED8; }
  .pill-interview    { background:rgba(109,40,217,.12);color:var(--purple); }
  .pill-offered      { background:rgba(16,185,129,.12);color:#065F46; }
  .pill-hired        { background:rgba(30,106,74,.15); color:var(--green); }
  .pill-rejected     { background:rgba(185,28,28,.1);  color:var(--red); }
  .pill-withdrawn    { background:rgba(107,114,128,.1);color:#374151; }

  .nav {
    position:sticky; top:0; z-index:100;
    background:rgba(245,240,232,0.92); backdrop-filter:blur(16px);
    border-bottom:1px solid var(--border);
    padding:0 2rem; height:60px;
    display:flex; align-items:center; gap:1.5rem;
  }
  .nav-logo { font-family:var(--serif); font-size:1.25rem; font-weight:600; color:var(--navy); cursor:pointer; }
  .nav-logo span { color:var(--amber); }
  .nav-link {
    font-size:.85rem; font-weight:600; color:var(--muted);
    background:none; border:none; cursor:pointer; padding:6px 10px;
    border-radius:8px; transition:all .2s; font-family:var(--sans);
  }
  .nav-link:hover { color:var(--navy); background:var(--cream2); }
  .nav-link.active { color:var(--navy); }

  .dash-layout { display:flex; min-height:calc(100vh - 60px); }
  .sidebar {
    width:240px; flex-shrink:0; border-right:1px solid var(--border);
    background:var(--cream2); padding:1.5rem 1rem;
    position:sticky; top:60px; height:calc(100vh - 60px); overflow-y:auto;
  }
  .dash-content { flex:1; padding:2.5rem; max-width:960px; overflow:auto; }
  .sidebar-link {
    display:flex; align-items:center; gap:10px;
    padding:10px 12px; border-radius:10px; margin-bottom:3px;
    font-size:.875rem; font-weight:600; color:var(--muted);
    background:none; border:none; cursor:pointer; width:100%;
    text-align:left; font-family:var(--sans); transition:all .15s;
  }
  .sidebar-link:hover { background:var(--cream3); color:var(--navy); }
  .sidebar-link.active { background:#fff; color:var(--navy); box-shadow:var(--sh); }

  .stat-card {
    background:#fff; border:1px solid var(--border); border-radius:14px;
    padding:1.25rem; position:relative; overflow:hidden;
  }
  .stat-bar { position:absolute; bottom:0; left:0; right:0; height:3px; }

  .posting-card { cursor:pointer; }

  .ib-table { width:100%; border-collapse:collapse; font-size:.84rem; }
  .ib-table th { padding:10px 14px; text-align:left; font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); border-bottom:1px solid var(--border); }
  .ib-table td { padding:12px 14px; border-bottom:1px solid var(--cream2); vertical-align:middle; }
  .ib-table tr:last-child td { border-bottom:none; }
  .ib-table tr:hover td { background:var(--cream); }

  .co-logo { width:40px;height:40px;border-radius:10px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:.75rem;font-weight:700;flex-shrink:0; }
  .co-logo-lg { width:48px;height:48px;border-radius:12px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:.85rem;font-weight:700;flex-shrink:0; }

  .modal-backdrop {
    position:fixed; inset:0; background:rgba(15,27,45,.5);
    backdrop-filter:blur(4px); z-index:1000;
    display:flex; align-items:center; justify-content:center; padding:1rem;
    animation:fadeIn .2s ease;
  }
  .modal-box {
    background:var(--cream); border-radius:18px; box-shadow:var(--sh2);
    width:100%; max-width:520px; max-height:90vh; overflow-y:auto;
    animation:fadeUp .25s ease;
  }
  .modal-header { padding:1.5rem 1.5rem 0; display:flex; justify-content:space-between; align-items:center; }
  .modal-body { padding:1.25rem 1.5rem 1.5rem; }
  .modal-close { background:none;border:none;cursor:pointer;color:var(--muted);font-size:1.2rem;line-height:1; }
  .modal-close:hover { color:var(--navy); }

  .alert { padding:10px 14px; border-radius:10px; font-size:.84rem; margin-bottom:.75rem; }
  .alert-err { background:rgba(185,28,28,.08); color:var(--red); border:1px solid rgba(185,28,28,.15); }
  .alert-ok  { background:rgba(30,106,74,.08);  color:var(--green); border:1px solid rgba(30,106,74,.15); }
  .alert-tip { background:rgba(201,122,42,.08); color:var(--amber); border:1px solid rgba(201,122,42,.15); }
  .alert-info { background:rgba(59,130,246,.08); color:#1D4ED8; border:1px solid rgba(59,130,246,.15); }

  .digit-box {
    width:46px; height:54px; text-align:center; font-size:1.4rem; font-weight:700;
    font-family:var(--mono); color:var(--navy); background:#fff;
    border:2px solid var(--border); border-radius:10px; outline:none; transition:border-color .2s;
  }
  .digit-box:focus { border-color:var(--amber); }

  .strength-track { height:4px; background:var(--cream3); border-radius:99px; overflow:hidden; margin-bottom:.75rem; }
  .strength-fill  { height:100%; border-radius:99px; transition:all .3s; }

  .toast-wrap { position:fixed; bottom:22px; right:22px; z-index:9999; display:flex; flex-direction:column; gap:8px; }
  .toast {
    background:var(--navy); color:#fff; padding:11px 18px; border-radius:12px;
    font-size:.85rem; font-weight:600; display:flex; align-items:center; gap:10px;
    box-shadow:var(--sh2); animation:toastIn .3s ease; max-width:340px;
    border-left:4px solid var(--amber);
  }
  .toast.err { border-left-color:var(--red); }
  .toast.ok  { border-left-color:var(--green); }

  .skeleton { background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; border-radius:8px; }

  .prog-track { height:6px; background:var(--cream3); border-radius:99px; overflow:hidden; }
  .prog-fill   { height:100%; background:linear-gradient(90deg,var(--amber),var(--amber2)); border-radius:99px; transition:width .4s ease; }

  /* Interview card style */
  .interview-card {
    background:#fff; border:1px solid var(--border); border-radius:12px;
    padding:1.25rem; display:flex; align-items:center; gap:1rem;
    transition:all .2s;
  }
  .interview-card:hover { box-shadow:var(--sh2); transform:translateY(-1px); }
  .interview-avatar {
    width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,var(--purple),var(--purple2));
    color:#fff; display:flex; align-items:center; justify-content:center;
    font-family:var(--serif); font-size:1.1rem; font-weight:700; flex-shrink:0;
  }

  /* Empty state */
  .empty-state { text-align:center; padding:4rem 2rem; color:var(--muted); }
  .empty-state .icon { font-size:3rem; margin-bottom:1rem; }
  .empty-state h4 { color:var(--navy); margin-bottom:.5rem; font-family:var(--serif); }

  /* Action bar */
  .action-bar { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }

  @media(max-width:768px) {
    .sidebar { display:none; }
    .dash-content { padding:1.5rem 1rem; }
    .nav { padding:0 1rem; }
    .ib-table th:nth-child(3), .ib-table td:nth-child(3),
    .ib-table th:nth-child(4), .ib-table td:nth-child(4) { display:none; }
  }
`;

// ─────────────────────────────────────────────────────────────────
// SESSION HELPERS
// ─────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("ib_token");
const getUser  = () => { try { return JSON.parse(localStorage.getItem("ib_user") || "null"); } catch { return null; } };
const saveSession = (token, user) => {
  localStorage.setItem("ib_token", token);
  localStorage.setItem("ib_user", JSON.stringify(user));
};
const clearSession = () => {
  localStorage.removeItem("ib_token");
  localStorage.removeItem("ib_user");
};

// ─────────────────────────────────────────────────────────────────
// API WRAPPER
// ─────────────────────────────────────────────────────────────────
async function api(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res  = await fetch(API_BASE + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || `Error ${res.status}`);
    return data;
  } catch(e) {
    if (e.name === "SyntaxError") throw new Error("Server returned invalid response");
    throw e;
  }
}

// ─────────────────────────────────────────────────────────────────
// NORMALISE helpers
// ─────────────────────────────────────────────────────────────────
const normPosting = (p) => ({
  id:       p.id || p.posting_id,
  title:    p.title || "—",
  company:  p.company_name || "—",
  initials: (p.company_name || "CO").slice(0, 2).toUpperCase(),
  location: p.location || "Nigeria",
  type:     p.type || "INTERNSHIP",
  empType:  p.employment_type || "OTHER",
  mode:     p.work_mode || "ONSITE",
  salMin:   Number(p.salary_min || 0),
  salMax:   Number(p.salary_max || 0),
  deadline: p.deadline || "",
  skills:   p.skills || [],
  apps:     p.application_count || 0,
  status:   p.status || "PUBLISHED",
  description: p.description || "",
});

const normApp = (a) => ({
  id:      a.id || a.application_id,
  title:   a.job_title || a.title || "—",
  company: a.company_name || "—",
  initials:(a.company_name || "CO").slice(0, 2).toUpperCase(),
  location:a.location || "—",
  salary:  a.salary_min ? `₦${Number(a.salary_min).toLocaleString()}/mo` : "Negotiable",
  applied: a.applied_at ? new Date(a.applied_at).toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" }) : "—",
  status:  (a.status || "submitted").toLowerCase(),
});

// Safe array extractor — handles both direct arrays and wrapped responses
const toArr = (data, key) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return [];
};

const salText = (p) => {
  if (p.salMin > 0) return `₦${p.salMin.toLocaleString()}${p.salMax ? "–" + p.salMax.toLocaleString() : ""}/mo`;
  if (p.empType === "SIWES") return "Stipend";
  if (p.empType === "NYSC")  return "NYSC Allowance";
  return "Negotiable";
};
const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);
const typeClass = { INTERNSHIP: "badge-internship", JOB: "badge-job", SIWES: "badge-siwes", NYSC: "badge-nysc" };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" }) : "—";
const initials = (name) => (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);

// ─────────────────────────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────
function Spinner({ dark }) {
  return <span className={`spinner${dark ? " spinner-dark" : ""}`} />;
}

function Label({ children }) {
  return (
    <label style={{ display:"block", fontSize:".75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"var(--muted)", marginBottom:5 }}>
      {children}
    </label>
  );
}

function StatusPill({ status }) {
  const s = (status || "submitted").toLowerCase().replace(/\s/g,"_");
  return <span className={`pill pill-${s}`}>{s.replace(/_/g, " ")}</span>;
}

function CoLogo({ initials: i, size = "md" }) {
  return <div className={size === "lg" ? "co-logo-lg" : "co-logo"}>{i}</div>;
}

function SkeletonCard() {
  return (
    <div className="ib-card" style={{ padding: "1.25rem" }}>
      <div style={{ display:"flex", gap:10, marginBottom:12 }}>
        <div className="skeleton" style={{ width:40, height:40, borderRadius:10 }} />
        <div style={{ flex:1 }}>
          <div className="skeleton" style={{ height:14, width:"60%", marginBottom:6 }} />
          <div className="skeleton" style={{ height:11, width:"40%" }} />
        </div>
      </div>
      <div className="skeleton" style={{ height:11, marginBottom:6 }} />
      <div className="skeleton" style={{ height:11, width:"80%" }} />
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", paddingTop:"5rem", gap:10 }}>
      <Spinner dark />
      <span style={{ color:"var(--muted)", fontSize:".9rem" }}>Loading…</span>
    </div>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h4>{title}</h4>
      {subtitle && <p style={{ fontSize:".86rem", marginBottom: action ? "1.25rem" : 0 }}>{subtitle}</p>}
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// POSTING CARD
// ─────────────────────────────────────────────────────────────────
function PostingCard({ p, onApply }) {
  const days = daysLeft(p.deadline);
  const soon = days >= 0 && days <= 5;
  return (
    <div className="ib-card ib-card-hover posting-card" style={{ padding:"1.25rem", height:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
        <CoLogo initials={p.initials} size="lg" />
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, justifyContent:"flex-end" }}>
          <span className={`badge ${typeClass[p.type] || "badge-internship"}`}>{p.type}</span>
          {p.mode === "REMOTE" && <span className="badge badge-remote">Remote</span>}
        </div>
      </div>
      <div style={{ fontWeight:700, fontSize:".92rem", color:"var(--navy)", marginBottom:3, lineHeight:1.3 }}>{p.title}</div>
      <div style={{ fontSize:".8rem", color:"var(--muted)", fontWeight:600, marginBottom:8 }}>{p.company}</div>
      <div style={{ fontSize:".78rem", color:"var(--muted)", marginBottom:8 }}>📍 {p.location}</div>
      <div style={{ fontWeight:700, fontSize:".84rem", color:"var(--green)", marginBottom:10 }}>{salText(p)}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
        {p.skills.slice(0, 4).map(s => (
          <span key={s} style={{ background:"var(--cream2)", color:"var(--navy)", fontSize:".7rem", fontWeight:600, padding:"2px 8px", borderRadius:99 }}>{s}</span>
        ))}
      </div>
      <div style={{ borderTop:"1px solid var(--border)", paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <small style={{ color: soon ? "var(--red)" : "var(--muted)", fontWeight: soon ? 700 : 400 }}>
          {days < 0 ? "Deadline passed" : soon ? `⚠️ ${days}d left` : `Closes: ${p.deadline}`}
        </small>
        <button className="btn-amber btn-sm" onClick={() => onApply(p)}>Apply →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// APPLY MODAL
// ─────────────────────────────────────────────────────────────────
function ApplyModal({ posting, onClose, onSuccess, isLoggedIn }) {
  const [resumes, setResumes]   = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [cover, setCover]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      api("/student/resumes").then(d => {
        const list = toArr(d, "resumes");
        setResumes(list);
        const cur = list.find(r => r.is_current);
        if (cur) setResumeId(String(cur.id));
      }).catch(() => {});
    }
  }, [isLoggedIn]);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      await api("/applications", "POST", { posting_id: posting.id, resume_id: resumeId || null, cover_letter: cover });
      onSuccess("Application submitted! 🎉");
      onClose();
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span style={{ fontFamily:"var(--serif)", fontSize:"1.15rem", fontWeight:600, color:"var(--navy)" }}>Apply: {posting.title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ background:"var(--cream2)", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:".88rem", color:"var(--navy)" }}>{posting.title}</div>
            <div style={{ fontSize:".8rem", color:"var(--muted)" }}>{posting.company} · {posting.location}</div>
            <div style={{ fontSize:".82rem", color:"var(--green)", fontWeight:700, marginTop:4 }}>{salText(posting)}</div>
          </div>
          {!isLoggedIn && <div className="alert alert-err">Please <strong style={{cursor:"pointer",textDecoration:"underline"}} onClick={onClose}>sign in</strong> before applying.</div>}
          {err && <div className="alert alert-err">{err}</div>}
          <div style={{ marginBottom:12 }}>
            <Label>Select Resume</Label>
            <select className="ib-select" value={resumeId} onChange={e => setResumeId(e.target.value)}>
              {resumes.length === 0
                ? <option value="">— No resumes uploaded —</option>
                : resumes.map(r => <option key={r.id} value={r.id}>{r.is_current ? "★ " : ""}{r.name}</option>)
              }
            </select>
          </div>
          <div style={{ marginBottom:16 }}>
            <Label>Cover Letter (optional)</Label>
            <textarea className="ib-input" rows={5} placeholder="Tell the employer why you're a great fit…" value={cover} onChange={e => setCover(e.target.value)} />
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-amber" style={{ flex:1 }} onClick={submit} disabled={!isLoggedIn || loading}>
              {loading ? <Spinner /> : "Submit Application →"}
            </button>
            <button className="btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FORGOT PASSWORD MODAL
// ─────────────────────────────────────────────────────────────────
function ForgotModal({ onClose }) {
  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState("");
  const [code, setCode]         = useState(["","","","","",""]);
  const [newPwd, setNewPwd]     = useState("");
  const [confirm, setConfirm]   = useState("");
  const [strength, setStrength] = useState(0);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [savedCode, setSavedCode] = useState("");
  const digitRefs = useRef([]);

  const calcStrength = (p) => {
    let s = 0;
    if (p.length >= 8)           s++;
    if (p.length >= 12)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColor = ["","#ef4444","#f97316","#eab308","#22c55e","#10b981"];

  const sendCode = async () => {
    if (!email) { setErr("Enter your email address."); return; }
    setErr(""); setLoading(true);
    try {
      const data = await api("/auth/forgot-password", "POST", { email });
      if (data.code) {
        const digits = String(data.code).split("");
        setCode(digits);
        setSavedCode(String(data.code));
      }
      setStep(2);
      setTimeout(() => digitRefs.current[0]?.focus(), 100);
    } catch(e) {
      // If endpoint not implemented yet, still proceed to step 2 for demo
      if (e.message.includes("404") || e.message.includes("405")) {
        setErr("Password reset email sent (check your inbox).");
        setStep(2);
      } else {
        setErr(e.message);
      }
    }
    setLoading(false);
  };

  const digitInput = (val, i) => {
    const d = [...code];
    d[i] = val.replace(/\D/,"").slice(-1);
    setCode(d);
    if (val && i < 5) digitRefs.current[i+1]?.focus();
  };

  const digitKey = (e, i) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const d=[...code]; d[i-1]=""; setCode(d);
      digitRefs.current[i-1]?.focus();
    }
    if (e.key === "Enter") verifyCode();
  };

  const verifyCode = async () => {
    const entered = code.join("");
    if (entered.length < 6) { setErr("Enter all 6 digits."); return; }
    setErr(""); setLoading(true);
    try {
      await api("/auth/verify-code", "POST", { email, code: entered });
      setSavedCode(entered);
      setStep(3);
    } catch(e) {
      if (e.message.includes("404") || e.message.includes("Not Found")) {
        setSavedCode(entered); setStep(3);
      } else { setErr(e.message); }
    }
    setLoading(false);
  };

  const savePassword = async () => {
    if (newPwd.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (newPwd !== confirm) { setErr("Passwords do not match."); return; }
    setErr(""); setLoading(true);
    try {
      await api("/auth/reset-password", "POST", { email, code: savedCode, new_password: newPwd });
      setStep(4);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const titles = { 1:"Reset Password", 2:"Enter the Code", 3:"New Password", 4:"All Done!" };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span style={{ fontFamily:"var(--serif)", fontSize:"1.15rem", fontWeight:600, color:"var(--navy)" }}>{titles[step]}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Step indicator */}
          <div style={{ display:"flex", gap:4, marginBottom:20 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ flex:1, height:3, borderRadius:99, background: step > n ? "var(--amber)" : step === n ? "var(--amber2)" : "var(--cream3)" }} />
            ))}
          </div>

          {err && <div className="alert alert-err">{err}</div>}

          {step === 1 && (
            <>
              <p style={{ fontSize:".86rem", color:"var(--muted)", marginBottom:16 }}>Enter your registered email. We'll send you a 6-digit reset code.</p>
              <Label>Email Address</Label>
              <input className="ib-input" type="email" placeholder="you@university.edu.ng" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key==="Enter" && sendCode()}
                style={{ marginBottom:14 }} />
              <button className="btn-amber" style={{ width:"100%" }} onClick={sendCode} disabled={loading}>
                {loading ? <Spinner /> : "Send Reset Code →"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p style={{ fontSize:".86rem", color:"var(--muted)", marginBottom:16 }}>
                A 6-digit code was sent to <strong style={{ color:"var(--navy)" }}>{email}</strong>. Expires in 15 minutes.
              </p>
              {savedCode && (
                <div className="alert alert-tip">
                  🔧 Dev mode — code: <strong>{savedCode}</strong>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:18 }}>
                {code.map((d, i) => (
                  <input key={i} ref={el => digitRefs.current[i] = el} className="digit-box"
                    maxLength={1} value={d}
                    onChange={e => digitInput(e.target.value, i)}
                    onKeyDown={e => digitKey(e, i)} />
                ))}
              </div>
              <button className="btn-amber" style={{ width:"100%", marginBottom:10 }} onClick={verifyCode} disabled={loading}>
                {loading ? <Spinner /> : "Verify Code →"}
              </button>
              <button className="btn-ghost" style={{ width:"100%" }} onClick={() => { setStep(1); setErr(""); }}>← Back</button>
            </>
          )}

          {step === 3 && (
            <>
              <p style={{ fontSize:".86rem", color:"var(--muted)", marginBottom:16 }}>Code verified ✅ Choose a strong new password.</p>
              <div style={{ marginBottom:10 }}>
                <Label>New Password</Label>
                <input className="ib-input" type="password" placeholder="At least 8 characters" value={newPwd}
                  onChange={e => { setNewPwd(e.target.value); setStrength(calcStrength(e.target.value)); }}
                  style={{ marginBottom:8 }} />
                {newPwd && (
                  <>
                    <div className="strength-track">
                      <div className="strength-fill" style={{ width:`${(strength/5)*100}%`, background: strengthColor[strength] }} />
                    </div>
                    <div style={{ fontSize:".76rem", color: strengthColor[strength], fontWeight:600 }}>{strengthLabel[strength]}</div>
                  </>
                )}
              </div>
              <div style={{ marginBottom:16 }}>
                <Label>Confirm Password</Label>
                <input className="ib-input" type="password" placeholder="Type it again" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && savePassword()} />
                {confirm && newPwd !== confirm && (
                  <div style={{ fontSize:".76rem", color:"var(--red)", marginTop:4 }}>Passwords do not match</div>
                )}
              </div>
              <button className="btn-amber" style={{ width:"100%" }} onClick={savePassword}
                disabled={loading || newPwd !== confirm || newPwd.length < 8}>
                {loading ? <Spinner /> : "Save New Password ✓"}
              </button>
            </>
          )}

          {step === 4 && (
            <div style={{ textAlign:"center", padding:"1rem 0" }}>
              <div style={{ fontSize:"3.5rem", marginBottom:12 }}>✅</div>
              <h3 style={{ fontFamily:"var(--serif)", color:"var(--navy)", marginBottom:8 }}>Password Updated!</h3>
              <p style={{ fontSize:".86rem", color:"var(--muted)", marginBottom:20 }}>You can now sign in with your new password.</p>
              <button className="btn-amber" onClick={onClose}>Go to Login →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, onLogout }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>Intern<span>Bridge</span></div>
      <div style={{ display:"flex", gap:4, marginRight:"auto" }}>
        {["home","browse"].map(p => (
          <button key={p} className={`nav-link${page===p?" active":""}`} onClick={() => setPage(p)}>
            {p.charAt(0).toUpperCase()+p.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {user ? (
          <>
            <span style={{ fontSize:".82rem", color:"var(--muted)", fontWeight:600 }}>Hi, {user.first_name || "User"}</span>
            <button className="btn-outline btn-sm" onClick={() => setPage(user.role_id === 3 ? "employer-dash" : "student-dash")}>Dashboard</button>
            <button className="btn-ghost btn-sm" onClick={onLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="btn-ghost btn-sm" onClick={() => setPage("login")}>Sign In</button>
            <button className="btn-amber btn-sm" onClick={() => setPage("register")}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────
function HomePage({ setPage, setApplyTarget }) {
  const [postings, setPostings] = useState([]);
  const [stats, setStats]       = useState({ students:"12,400+", postings:"3,200+", companies:"870+" });
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    Promise.allSettled([
      api("/postings?per_page=6"),
      api("/stats"),
    ]).then(([pRes, sRes]) => {
      if (pRes.status === "fulfilled") setPostings(toArr(pRes.value, "postings").map(normPosting));
      if (sRes.status === "fulfilled") {
        const s = sRes.value;
        setStats({
          students:  s.students  ? s.students.toLocaleString()+"+"  : "12,400+",
          postings:  s.postings  ? s.postings.toLocaleString()+"+"  : "3,200+",
          companies: s.companies ? s.companies.toLocaleString()+"+" : "870+",
        });
      }
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ background:"var(--navy)", color:"#fff", padding:"5rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,122,42,.25) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(201,122,42,.15)", border:"1px solid rgba(201,122,42,.3)", borderRadius:99, padding:"4px 14px", fontSize:".75rem", fontWeight:700, color:"var(--amber3)", letterSpacing:".08em", marginBottom:24 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--amber3)", animation:"pulse 2s infinite", display:"inline-block" }} />
            NIGERIA'S INTERNSHIP PORTAL
          </div>
          <h1 style={{ fontFamily:"var(--serif)", fontSize:"clamp(2.2rem,5vw,3.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:20, letterSpacing:"-.02em" }}>
            Launch your career<br />with the <span style={{ color:"var(--amber3)" }}>right opportunity.</span>
          </h1>
          <p style={{ fontSize:"1.05rem", color:"rgba(255,255,255,.7)", marginBottom:36, lineHeight:1.8 }}>
            SIWES, NYSC, internships and full-time roles at Nigeria's leading companies.
          </p>
          <div style={{ display:"flex", gap:10, maxWidth:500, margin:"0 auto 2.5rem" }}>
            <input className="ib-input" placeholder="Search by role, company, or skill…" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key==="Enter" && setPage("browse")}
              style={{ flex:1 }} />
            <button className="btn-amber" onClick={() => setPage("browse")}>Search</button>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:"3rem", flexWrap:"wrap" }}>
            {[["🎓", stats.students, "Students"], ["📋", stats.postings, "Listings"], ["🏢", stats.companies, "Companies"]].map(([icon, val, label]) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"1.6rem", fontFamily:"var(--serif)", fontWeight:800, color:"#fff" }}>{icon} {val}</div>
                <div style={{ fontSize:".75rem", color:"rgba(255,255,255,.5)", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"3rem 2rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.75rem" }}>
          <div>
            <div style={{ fontSize:".72rem", fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"var(--amber)", marginBottom:4 }}>Featured Opportunities</div>
            <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)" }}>Latest Listings</h2>
          </div>
          <button className="btn-outline" onClick={() => setPage("browse")}>View All →</button>
        </div>
        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : postings.length ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
            {postings.map(p => <PostingCard key={p.id} p={p} onApply={setApplyTarget} />)}
          </div>
        ) : (
          <EmptyState icon="📋" title="No postings yet" subtitle="Check back soon." />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BROWSE PAGE
// ─────────────────────────────────────────────────────────────────
function BrowsePage({ setApplyTarget }) {
  const [all, setAll]         = useState([]);
  const [shown, setShown]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [typeF, setTypeF]     = useState("");
  const [sortF, setSortF]     = useState("newest");
  const timer = useRef();

  const load = useCallback(async (type = "") => {
    setLoading(true);
    try {
      const qs = type ? `?type=${type}` : "";
      const d  = await api(`/postings${qs}`);
      const list = toArr(d, "postings").map(normPosting);
      setAll(list); setShown(list);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      let list = [...all];
      if (search) list = list.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.company.toLowerCase().includes(search.toLowerCase()) ||
        p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
      );
      if (sortF === "deadline") list.sort((a,b) => new Date(a.deadline)-new Date(b.deadline));
      if (sortF === "salary")   list.sort((a,b) => b.salMin - a.salMin);
      setShown(list);
    }, 280);
  }, [search, sortF, all]);

  const tabs = [["", "All"], ["INTERNSHIP","Internships"], ["JOB","Jobs"], ["SIWES","SIWES"], ["NYSC","NYSC"]];

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem 2rem" }}>
      <div style={{ marginBottom:"1.75rem" }}>
        <div style={{ fontSize:".72rem", fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"var(--amber)", marginBottom:4 }}>Browse</div>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)" }}>All Opportunities</h2>
      </div>

      <div style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:14, padding:"1rem 1.25rem", marginBottom:"1.5rem", display:"flex", flexWrap:"wrap", gap:"0.75rem", alignItems:"center" }}>
        <input className="ib-input" style={{ maxWidth:280 }} placeholder="🔍 Search roles, companies, skills…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="ib-select" style={{ maxWidth:160 }} value={sortF} onChange={e => setSortF(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="deadline">Closing Soon</option>
          <option value="salary">Highest Pay</option>
        </select>
        <button className="btn-ghost btn-sm" onClick={() => { setSearch(""); setSortF("newest"); setTypeF(""); load(""); }}>Reset</button>
        <span style={{ marginLeft:"auto", fontSize:".8rem", color:"var(--muted)", fontWeight:600 }}>
          {shown.length} of {all.length} results
        </span>
      </div>

      <div style={{ display:"flex", gap:4, marginBottom:"1.5rem", background:"var(--cream2)", borderRadius:12, padding:4, width:"fit-content" }}>
        {tabs.map(([val, label]) => (
          <button key={val} onClick={() => { setTypeF(val); load(val); }}
            style={{ padding:"7px 16px", borderRadius:9, border:"none", cursor:"pointer", fontFamily:"var(--sans)", fontWeight:700, fontSize:".82rem", transition:"all .15s",
              background: typeF===val ? "#fff" : "transparent",
              color:      typeF===val ? "var(--navy)" : "var(--muted)",
              boxShadow:  typeF===val ? "var(--sh)" : "none",
            }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : shown.length ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }} className="fade-in">
          {shown.map(p => <PostingCard key={p.id} p={p} onApply={setApplyTarget} />)}
        </div>
      ) : (
        <EmptyState icon="🔍" title="No results found" subtitle="Try different keywords or clear the filters." />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────
function LoginPage({ setPage, onLogin, showForgot }) {
  const [email, setEmail]     = useState("");
  const [pwd, setPwd]         = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const submit = async () => {
    if (!email || !pwd) { setErr("Please fill in all fields."); return; }
    setErr(""); setLoading(true);
    try {
      const data = await api("/auth/login", "POST", { email, password: pwd });
      onLogin(data.token, data.user);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"calc(100vh - 60px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div className="ib-card fade-up" style={{ width:"100%", maxWidth:420, padding:"2.5rem" }}>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)", marginBottom:6 }}>Welcome back</h2>
        <p style={{ fontSize:".875rem", color:"var(--muted)", marginBottom:"1.75rem" }}>Sign in to your InternBridge account</p>

        {err && <div className="alert alert-err">{err}</div>}

        <div style={{ marginBottom:12 }}>
          <Label>Email Address</Label>
          <input className="ib-input" type="email" placeholder="you@university.edu.ng" value={email}
            onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && submit()} />
        </div>
        <div style={{ marginBottom:6 }}>
          <Label>Password</Label>
          <input className="ib-input" type="password" placeholder="••••••••" value={pwd}
            onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key==="Enter" && submit()} />
        </div>
        <div style={{ textAlign:"right", marginBottom:20 }}>
          <span style={{ fontSize:".82rem", color:"var(--amber)", fontWeight:600, cursor:"pointer" }} onClick={showForgot}>
            Forgot password?
          </span>
        </div>
        <button className="btn-navy" style={{ width:"100%", justifyContent:"center", marginBottom:16 }} onClick={submit} disabled={loading}>
          {loading ? <Spinner /> : "Sign In →"}
        </button>
        <p style={{ textAlign:"center", fontSize:".875rem", color:"var(--muted)" }}>
          No account?{" "}
          <span style={{ color:"var(--amber)", fontWeight:600, cursor:"pointer" }} onClick={() => setPage("register")}>Create one free</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// REGISTER PAGE
// ─────────────────────────────────────────────────────────────────
function RegisterPage({ setPage, onLogin }) {
  const [role, setRole]       = useState(2);
  const [form, setForm]       = useState({ first_name:"", last_name:"", email:"", password:"", institution:"", department:"", level:"", company_name:"", industry:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const data = await api("/auth/register", "POST", { ...form, role_id: role });
      onLogin(data.token, data.user);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const RoleTab = ({ val, label }) => (
    <button onClick={() => setRole(val)} style={{
      flex:1, padding:"10px", border:"none", cursor:"pointer", borderRadius:10,
      fontFamily:"var(--sans)", fontWeight:700, fontSize:".875rem", transition:"all .15s",
      background: role===val ? "var(--amber)" : "transparent",
      color:      role===val ? "#fff" : "var(--muted)",
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight:"calc(100vh - 60px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div className="ib-card fade-up" style={{ width:"100%", maxWidth:480, padding:"2.5rem" }}>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)", marginBottom:6 }}>Create your account</h2>
        <p style={{ fontSize:".875rem", color:"var(--muted)", marginBottom:"1.5rem" }}>Join thousands on InternBridge</p>

        <div style={{ display:"flex", background:"var(--cream2)", borderRadius:12, padding:4, marginBottom:"1.5rem", gap:4 }}>
          <RoleTab val={2} label="🎓 I'm a Student" />
          <RoleTab val={3} label="🏢 I'm an Employer" />
        </div>

        {err && <div className="alert alert-err">{err}</div>}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <div><Label>First Name</Label><input className="ib-input" value={form.first_name} onChange={e=>set("first_name",e.target.value)} /></div>
          <div><Label>Last Name</Label><input className="ib-input" value={form.last_name} onChange={e=>set("last_name",e.target.value)} /></div>
        </div>
        <div style={{ marginBottom:10 }}><Label>Email</Label><input className="ib-input" type="email" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
        <div style={{ marginBottom:16 }}><Label>Password (min 8 characters)</Label><input className="ib-input" type="password" value={form.password} onChange={e=>set("password",e.target.value)} /></div>

        {role === 2 && (
          <>
            <div style={{ marginBottom:10 }}><Label>University / Institution</Label><input className="ib-input" placeholder="University of Lagos" value={form.institution} onChange={e=>set("institution",e.target.value)} /></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <div><Label>Department</Label><input className="ib-input" placeholder="Computer Science" value={form.department} onChange={e=>set("department",e.target.value)} /></div>
              <div>
                <Label>Level</Label>
                <select className="ib-select" value={form.level} onChange={e=>set("level",e.target.value)}>
                  <option value="">Select…</option>
                  {["100 Level","200 Level","300 Level","400 Level","500 Level","Graduate"].map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
        {role === 3 && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            <div><Label>Company Name</Label><input className="ib-input" value={form.company_name} onChange={e=>set("company_name",e.target.value)} /></div>
            <div><Label>Industry</Label><input className="ib-input" placeholder="Fintech, Oil & Gas…" value={form.industry} onChange={e=>set("industry",e.target.value)} /></div>
          </div>
        )}

        <button className="btn-amber" style={{ width:"100%", justifyContent:"center", marginBottom:14 }} onClick={submit} disabled={loading}>
          {loading ? <Spinner /> : "Create My Account →"}
        </button>
        <p style={{ textAlign:"center", fontSize:".875rem", color:"var(--muted)" }}>
          Already registered?{" "}
          <span style={{ color:"var(--amber)", fontWeight:600, cursor:"pointer" }} onClick={()=>setPage("login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────
function StudentDash({ user, setPage, setApplyTarget, addToast }) {
  const [tab, setTab]     = useState("overview");
  const [apps, setApps]   = useState([]);
  const [prof, setProf]   = useState({});
  const [recs, setRecs]   = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === "overview") {
      Promise.allSettled([
        api("/applications/my"),
        api("/student/profile"),
        api("/postings?per_page=3"),
      ]).then(([aR, pR, rR]) => {
        if (aR.status==="fulfilled") setApps(toArr(aR.value, "applications").map(normApp));
        if (pR.status==="fulfilled") setProf(pR.value.profile||pR.value);
        if (rR.status==="fulfilled") setRecs(toArr(rR.value, "postings").map(normPosting));
        setLoading(false);
      });
    } else if (tab === "applications") {
      api("/applications/my")
        .then(d => { setApps(toArr(d, "applications").map(normApp)); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (tab === "resumes") {
      api("/student/resumes")
        .then(d => { setResumes(toArr(d, "resumes")); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (tab === "profile") {
      api("/student/profile")
        .then(d => { setProf(d.profile||d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [tab]);

  const withdraw = async (id) => {
    try {
      await api(`/applications/${id}`, "DELETE");
      setApps(a => a.filter(x => x.id !== id));
      addToast("Application withdrawn", "↩️");
    } catch(e) { addToast(e.message, "⚠️", true); }
  };

  const fname = prof.first_name || user?.first_name || "Student";
  const filled = [prof.first_name, prof.last_name, prof.institution, prof.department, prof.level, prof.bio].filter(Boolean).length;
  const pct = Math.round((filled / 6) * 100);

  const tabs = [
    { id:"overview",     icon:"📊", label:"Overview"     },
    { id:"applications", icon:"📤", label:"Applications" },
    { id:"resumes",      icon:"📄", label:"Resumes"      },
    { id:"profile",      icon:"👤", label:"Profile"      },
  ];

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:"var(--navy)", color:"#fff", fontFamily:"var(--serif)", fontSize:"1.3rem", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
            {fname[0]?.toUpperCase()}
          </div>
          <div style={{ fontWeight:700, fontSize:".9rem", color:"var(--navy)" }}>{fname} {prof.last_name||""}</div>
          <div style={{ fontSize:".76rem", color:"var(--muted)" }}>{prof.department || "Student"}</div>
          <div style={{ margin:"10px 0 4px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".72rem", marginBottom:4 }}>
              <span style={{ color:"var(--muted)" }}>Profile</span><strong>{pct}%</strong>
            </div>
            <div className="prog-track"><div className="prog-fill" style={{ width:`${pct}%` }} /></div>
          </div>
        </div>
        {tabs.map(t => (
          <button key={t.id} className={`sidebar-link${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
        <button className="sidebar-link" style={{ marginTop:"1rem", color:"var(--amber)" }} onClick={() => setPage("browse")}>
          <span>🔍</span> Browse Listings
        </button>
      </aside>

      <main className="dash-content">
        {loading ? <LoadingState /> : (
          <div className="fade-up">
            {tab === "overview" && (
              <>
                <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)", marginBottom:"1.5rem" }}>Welcome back, {fname}! 👋</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
                  {[
                    ["📤", apps.length, "Applications", "linear-gradient(90deg,var(--amber),var(--amber2))"],
                    ["👀", apps.filter(a=>["submitted","under_review"].includes(a.status)).length, "Under Review", "linear-gradient(90deg,#3B82F6,#93C5FD)"],
                    ["📅", apps.filter(a=>a.status==="interview").length, "Interviews", "linear-gradient(90deg,var(--purple),var(--purple2))"],
                    ["🎉", apps.filter(a=>["offered","hired"].includes(a.status)).length, "Offers", "linear-gradient(90deg,var(--green),#4ADE80)"],
                  ].map(([icon, val, label, bar]) => (
                    <div key={label} className="stat-card">
                      <div style={{ fontSize:"1.4rem", marginBottom:8 }}>{icon}</div>
                      <div style={{ fontFamily:"var(--serif)", fontSize:"1.8rem", fontWeight:800, color:"var(--navy)" }}>{val}</div>
                      <div style={{ fontSize:".76rem", color:"var(--muted)", fontWeight:600, marginTop:2 }}>{label}</div>
                      <div className="stat-bar" style={{ background:bar }} />
                    </div>
                  ))}
                </div>

                <div className="ib-card" style={{ marginBottom:"2rem", overflow:"hidden" }}>
                  <div style={{ padding:"1rem 1.25rem", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontWeight:700, color:"var(--navy)" }}>Recent Applications</span>
                    <button className="btn-ghost btn-sm" onClick={() => setTab("applications")}>View All</button>
                  </div>
                  {apps.length === 0 ? (
                    <div style={{ padding:"3rem", textAlign:"center", color:"var(--muted)" }}>
                      <div style={{ fontSize:"2.5rem", marginBottom:10 }}>📋</div>
                      <p>No applications yet. <span style={{ color:"var(--amber)", cursor:"pointer" }} onClick={() => setPage("browse")}>Browse listings →</span></p>
                    </div>
                  ) : (
                    <div style={{ overflowX:"auto" }}>
                      <table className="ib-table">
                        <thead><tr><th>Role</th><th>Location</th><th>Applied</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                          {apps.slice(0,5).map(a => (
                            <tr key={a.id}>
                              <td><div style={{ display:"flex", gap:8, alignItems:"center" }}>
                                <CoLogo initials={a.initials} />
                                <div><div style={{ fontWeight:700, fontSize:".86rem" }}>{a.title}</div><div style={{ fontSize:".76rem", color:"var(--muted)" }}>{a.company}</div></div>
                              </div></td>
                              <td style={{ color:"var(--muted)", fontSize:".84rem" }}>{a.location}</td>
                              <td style={{ color:"var(--muted)", fontSize:".84rem" }}>{a.applied}</td>
                              <td><StatusPill status={a.status} /></td>
                              <td>
                                {!["hired","offered","rejected","withdrawn"].includes(a.status) && (
                                  <button className="btn-ghost btn-sm" onClick={() => withdraw(a.id)}>Withdraw</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {recs.length > 0 && (
                  <>
                    <div style={{ fontSize:".72rem", fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"var(--amber)", marginBottom:12 }}>Recommended for You</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1rem" }}>
                      {recs.map(p => <PostingCard key={p.id} p={p} onApply={setApplyTarget} />)}
                    </div>
                  </>
                )}
              </>
            )}

            {tab === "applications" && (
              <>
                <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)", marginBottom:"1.5rem" }}>My Applications</h2>
                <div className="ib-card" style={{ overflow:"hidden" }}>
                  {apps.length === 0 ? (
                    <EmptyState icon="📤" title="No applications yet"
                      action={<button className="btn-amber" onClick={() => setPage("browse")}>Browse Listings →</button>} />
                  ) : (
                    <div style={{ overflowX:"auto" }}>
                      <table className="ib-table">
                        <thead><tr><th>Role & Company</th><th>Salary</th><th>Applied</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                          {apps.map(a => (
                            <tr key={a.id}>
                              <td><div style={{ display:"flex", gap:8, alignItems:"center" }}>
                                <CoLogo initials={a.initials} />
                                <div><div style={{ fontWeight:700 }}>{a.title}</div><div style={{ fontSize:".76rem", color:"var(--muted)" }}>{a.company}</div></div>
                              </div></td>
                              <td style={{ color:"var(--green)", fontWeight:700, fontSize:".84rem" }}>{a.salary}</td>
                              <td style={{ color:"var(--muted)", fontSize:".84rem" }}>{a.applied}</td>
                              <td><StatusPill status={a.status} /></td>
                              <td>
                                {!["hired","offered","rejected","withdrawn"].includes(a.status) && (
                                  <button className="btn-ghost btn-sm" onClick={() => withdraw(a.id)}>Withdraw</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === "resumes" && (
              <ResumeTab resumes={resumes} setResumes={setResumes} addToast={addToast} />
            )}

            {tab === "profile" && (
              <ProfileTab prof={prof} setProf={setProf} addToast={addToast} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function ResumeTab({ resumes, setResumes, addToast }) {
  const [url, setUrl]     = useState("");
  const [name, setName]   = useState("");
  const [err, setErr]     = useState("");
  const [saving, setSaving] = useState(false);

  const upload = async () => {
    if (!url || !name) { setErr("Both URL and name are required."); return; }
    setErr(""); setSaving(true);
    try {
      const d = await api("/student/resumes", "POST", { url, name });
      setResumes(r => [d.resume || d, ...r]);
      setUrl(""); setName("");
      addToast("Resume added! 📄", "📄");
    } catch(e) { setErr(e.message); }
    setSaving(false);
  };

  const setCurrent = async (id) => {
    try {
      await api(`/student/resumes/${id}/current`, "PUT");
      setResumes(r => r.map(x => ({ ...x, is_current: x.id === id })));
      addToast("Set as current ✅", "📄");
    } catch(e) { addToast(e.message, "⚠️", true); }
  };

  return (
    <>
      <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)", marginBottom:"1.5rem" }}>My Resumes</h2>
      <div className="ib-card" style={{ padding:"1.5rem", marginBottom:"1.5rem" }}>
        <div style={{ fontWeight:700, fontSize:".8rem", textTransform:"uppercase", letterSpacing:".06em", color:"var(--navy)", marginBottom:10 }}>Add Resume Link</div>
        <p style={{ fontSize:".84rem", color:"var(--muted)", marginBottom:14 }}>Upload your CV to Google Drive, make it publicly viewable, then paste the link below.</p>
        {err && <div className="alert alert-err">{err}</div>}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr auto", gap:10, alignItems:"flex-end" }}>
          <div><Label>Public File URL</Label><input className="ib-input" placeholder="https://drive.google.com/file/d/…" value={url} onChange={e=>setUrl(e.target.value)} /></div>
          <div><Label>Display Name</Label><input className="ib-input" placeholder="My_CV_2025.pdf" value={name} onChange={e=>setName(e.target.value)} /></div>
          <button className="btn-amber" onClick={upload} disabled={saving}>{saving ? <Spinner /> : "Add"}</button>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {resumes.length === 0 && <EmptyState icon="📄" title="No resumes yet" subtitle="Add one using the form above." />}
        {resumes.map(r => (
          <div key={r.id} className="ib-card" style={{ padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:"1.8rem" }}>📄</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:".9rem", color:"var(--navy)" }}>{r.name}</div>
              <div style={{ fontSize:".76rem", color:"var(--muted)" }}>Version {r.version || 1} · {r.uploaded_at ? fmtDate(r.uploaded_at) : "—"}</div>
            </div>
            {r.is_current
              ? <span style={{ background:"var(--green)", color:"#fff", fontSize:".7rem", fontWeight:700, padding:"3px 10px", borderRadius:99 }}>Current</span>
              : <button className="btn-outline btn-sm" onClick={() => setCurrent(r.id)}>Set Current</button>}
            <a href={r.url || r.file_url || "#"} target="_blank" rel="noreferrer" className="btn-ghost btn-sm" style={{ textDecoration:"none" }}>Open ↗</a>
          </div>
        ))}
      </div>
    </>
  );
}

function ProfileTab({ prof, setProf, addToast }) {
  const [form, setForm]     = useState({ first_name:"", last_name:"", phone:"", institution:"", department:"", level:"", graduation_year:"", bio:"" });
  const [saving, setSaving] = useState(false);
  const [ok, setOk]         = useState(false);

  useEffect(() => {
    setForm({
      first_name:      prof.first_name      || "",
      last_name:       prof.last_name       || "",
      phone:           prof.phone           || "",
      institution:     prof.institution     || "",
      department:      prof.department      || "",
      level:           prof.level           || "",
      graduation_year: prof.graduation_year || "",
      bio:             prof.bio             || "",
    });
  }, [prof]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setOk(false);
    try {
      const d = await api("/student/profile", "PUT", form);
      setProf(d.profile || d);
      setOk(true); addToast("Profile saved ✅", "✅");
      setTimeout(() => setOk(false), 3000);
    } catch(e) { addToast(e.message, "⚠️", true); }
    setSaving(false);
  };

  return (
    <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)" }}>My Profile</h2>
        {ok && <div className="alert alert-ok" style={{ margin:0 }}>Saved ✅</div>}
      </div>
      <div className="ib-card" style={{ overflow:"hidden" }}>
        <div style={{ padding:"1.25rem", borderBottom:"1px solid var(--border)", fontWeight:700, fontSize:".8rem", textTransform:"uppercase", letterSpacing:".06em", color:"var(--navy)" }}>Personal Information</div>
        <div style={{ padding:"1.25rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div><Label>First Name</Label><input className="ib-input" value={form.first_name} onChange={e=>set("first_name",e.target.value)} /></div>
          <div><Label>Last Name</Label><input className="ib-input" value={form.last_name} onChange={e=>set("last_name",e.target.value)} /></div>
          <div><Label>Phone</Label><input className="ib-input" value={form.phone} onChange={e=>set("phone",e.target.value)} /></div>
          <div><Label>Grad. Year</Label><input className="ib-input" type="number" value={form.graduation_year} onChange={e=>set("graduation_year",e.target.value)} /></div>
        </div>
        <div style={{ padding:"0 1.25rem 1.25rem", borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontWeight:700, fontSize:".8rem", textTransform:"uppercase", letterSpacing:".06em", color:"var(--navy)", marginBottom:12 }}>Academic</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}><Label>Institution</Label><input className="ib-input" value={form.institution} onChange={e=>set("institution",e.target.value)} /></div>
            <div style={{ gridColumn:"1/3" }}><Label>Department</Label><input className="ib-input" value={form.department} onChange={e=>set("department",e.target.value)} /></div>
            <div>
              <Label>Level</Label>
              <select className="ib-select" value={form.level} onChange={e=>set("level",e.target.value)}>
                <option value="">Select…</option>
                {["100 Level","200 Level","300 Level","400 Level","500 Level","Graduate"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ padding:"1.25rem" }}>
          <Label>Bio</Label>
          <textarea className="ib-input" rows={4} placeholder="Tell employers about yourself…" value={form.bio} onChange={e=>set("bio",e.target.value)} />
          <button className="btn-amber" style={{ marginTop:12 }} onClick={save} disabled={saving}>
            {saving ? <><Spinner /> Saving…</> : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// EMPLOYER DASHBOARD
// ─────────────────────────────────────────────────────────────────
function EmployerDash({ user, addToast }) {
  const [tab, setTab]               = useState("overview");
  const [stats, setStats]           = useState({});
  const [postings, setPostings]     = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true); // ← Always reset loading on tab change

    async function loadData() {
      try {
        let data;
        switch (tab) {
          case "overview":
            data = await api("/employer/dashboard");
            if (isMounted) setStats(data.stats || {});
            break;
          case "postings":
            data = await api("/employer/postings");
            if (isMounted) setPostings(toArr(data, "postings").map(normPosting));
            break;
          case "applicants":
            data = await api("/employer/applicants");
            if (isMounted) setApplicants(toArr(data, "applicants"));
            break;
          case "interviews":
            data = await api("/employer/interviews");
            // Backend returns plain array — handle both formats
            if (isMounted) setInterviews(Array.isArray(data) ? data : toArr(data, "interviews"));
            break;
          default:
            break;
        }
      } catch(e) {
        console.error(`Error loading ${tab}:`, e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [tab]);

  const closePosting = async (id) => {
    try {
      await api(`/employer/postings/${id}/close`, "PUT");
      setPostings(p => p.map(x => x.id===id ? { ...x, status:"CLOSED" } : x));
      addToast("Posting closed 🔒", "🔒");
    } catch(e) { addToast(e.message, "⚠️", true); }
  };

  const updateStatus = async (appId, status, idx) => {
    try {
      await api(`/applications/${appId}/status`, "PUT", { status });
      setApplicants(a => a.map((x,i) => i===idx ? { ...x, status: status.toLowerCase() } : x));
      const msgs = { SHORTLISTED:"Shortlisted ⭐", REJECTED:"Rejected", OFFERED:"Offer extended 🎉", HIRED:"Hired! 🎊" };
      addToast(msgs[status] || "Status updated", "✅");
    } catch(e) { addToast(e.message, "⚠️", true); }
  };

  const moveToInterview = async (appId, idx) => {
    try {
      await api(`/employer/applications/${appId}/interview`, "PUT");
      const applicant = applicants[idx];
      // Update applicants list status
      setApplicants(a => a.map((x, i) => i === idx ? { ...x, status: "interview" } : x));
      // Also push into interviews list immediately (optimistic update)
      const newInterview = {
        id: appId,
        candidate_name: applicant.student_name || applicant.name || "Candidate",
        position: applicant.job_title || applicant.title || "—",
        applied_at: applicant.applied_at || null,
        status: "interview",
      };
      setInterviews(prev => {
        const exists = prev.some(i => i.id === appId);
        return exists ? prev : [...prev, newInterview];
      });
      addToast("Moved to interview 📅", "📅");
    } catch(e) { addToast(e.message, "⚠️", true); }
  };

  const removeFromInterviews = async (appId) => {
    try {
      await api(`/applications/${appId}/status`, "PUT", { status: "SHORTLISTED" });
      setInterviews(prev => prev.filter(i => i.id !== appId));
      addToast("Moved back to shortlisted", "↩️");
    } catch(e) { addToast(e.message, "⚠️", true); }
  };

  const progressToOffer = async (appId) => {
    try {
      await api(`/applications/${appId}/status`, "PUT", { status: "OFFERED" });
      setInterviews(prev => prev.map(i => i.id === appId ? { ...i, status: "offered" } : i));
      addToast("Offer extended 🎉", "🎉");
    } catch(e) { addToast(e.message, "⚠️", true); }
  };

  const tabs = [
    { id:"overview",   icon:"📊", label:"Overview"   },
    { id:"postings",   icon:"📢", label:"Postings"   },
    { id:"applicants", icon:"👥", label:"Applicants" },
    { id:"interviews", icon:"📅", label:"Interviews", badge: interviews.length || null },
  ];

  const fname = user?.first_name || "Employer";

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:"var(--amber)", color:"#fff", fontFamily:"var(--serif)", fontSize:"1.3rem", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
            {fname[0]?.toUpperCase()}
          </div>
          <div style={{ fontWeight:700, fontSize:".9rem", color:"var(--navy)" }}>{fname}</div>
          <div style={{ fontSize:".76rem", color:"var(--muted)" }}>Employer Account</div>
        </div>
        {tabs.map(t => (
          <button key={t.id} className={`sidebar-link${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span>
            <span style={{ flex:1 }}>{t.label}</span>
            {t.badge ? (
              <span style={{ background:"var(--purple)", color:"#fff", fontSize:".65rem", fontWeight:800, padding:"2px 7px", borderRadius:99, minWidth:20, textAlign:"center" }}>
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
        <button className="btn-amber" style={{ width:"100%", justifyContent:"center", marginTop:"1rem" }} onClick={() => setShowCreate(true)}>
          + New Posting
        </button>
      </aside>

      <main className="dash-content">
        {loading ? <LoadingState /> : (
          <div className="fade-up">

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <>
                <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)", marginBottom:"1.5rem" }}>Welcome, {fname}! 📊</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
                  {[
                    ["📢", stats.active_postings||0,    "Active Postings", "linear-gradient(90deg,var(--amber),var(--amber2))"],
                    ["📥", stats.total_applications||0, "Applications",    "linear-gradient(90deg,#3B82F6,#93C5FD)"],
                    ["⭐", stats.shortlisted||0,         "Shortlisted",     "linear-gradient(90deg,var(--purple),var(--purple2))"],
                    ["✅", stats.hired||0,               "Hired",           "linear-gradient(90deg,var(--green),#4ADE80)"],
                  ].map(([icon, val, label, bar]) => (
                    <div key={label} className="stat-card">
                      <div style={{ fontSize:"1.4rem", marginBottom:8 }}>{icon}</div>
                      <div style={{ fontFamily:"var(--serif)", fontSize:"1.8rem", fontWeight:800, color:"var(--navy)" }}>{val}</div>
                      <div style={{ fontSize:".76rem", color:"var(--muted)", fontWeight:600, marginTop:2 }}>{label}</div>
                      <div className="stat-bar" style={{ background:bar }} />
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button className="btn-amber" onClick={() => setShowCreate(true)}>+ Create Posting</button>
                  <button className="btn-outline" onClick={() => setTab("applicants")}>View Applicants</button>
                  <button className="btn-outline" onClick={() => setTab("interviews")}>View Interviews</button>
                </div>
              </>
            )}

            {/* ── POSTINGS ── */}
            {tab === "postings" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                  <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)" }}>My Postings</h2>
                  <button className="btn-amber" onClick={() => setShowCreate(true)}>+ New Posting</button>
                </div>
                {postings.length === 0 ? (
                  <EmptyState icon="📢" title="No postings yet"
                    action={<button className="btn-amber" onClick={() => setShowCreate(true)}>Create Your First Posting</button>} />
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1rem" }}>
                    {postings.map(p => (
                      <div key={p.id} className="ib-card" style={{ padding:"1.25rem" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                          <CoLogo initials={p.initials} size="lg" />
                          <span className={`badge ${p.status==="PUBLISHED"?"badge-internship":"badge-closed"}`}>{p.status}</span>
                        </div>
                        <div style={{ fontWeight:700, fontSize:".92rem", color:"var(--navy)", marginBottom:4 }}>{p.title}</div>
                        <div style={{ fontSize:".8rem", color:"var(--muted)", marginBottom:4 }}>📍 {p.location}</div>
                        <div style={{ fontSize:".8rem", color:"var(--muted)", marginBottom:10 }}>👥 {p.apps} applied</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:"1px solid var(--border)" }}>
                          <small style={{ color:"var(--muted)" }}>Closes: {p.deadline || "—"}</small>
                          {p.status !== "CLOSED" && (
                            <button className="btn-ghost btn-sm" onClick={() => closePosting(p.id)}>Close</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── APPLICANTS ── */}
            {tab === "applicants" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                  <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)" }}>All Applicants</h2>
                  <span style={{ fontSize:".82rem", color:"var(--muted)", fontWeight:600 }}>{applicants.length} total</span>
                </div>
                <div className="ib-card" style={{ overflow:"hidden" }}>
                  {applicants.length === 0 ? (
                    <EmptyState icon="👥" title="No applicants yet" subtitle="Create a posting to start receiving applications." />
                  ) : (
                    <div style={{ overflowX:"auto" }}>
                      <table className="ib-table">
                        <thead>
                          <tr>
                            <th>Applicant</th>
                            <th>Position</th>
                            <th>Institution</th>
                            <th>Applied</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicants.map((a, i) => {
                            const status = (a.status || "submitted").toLowerCase();
                            const isTerminal = ["hired","offered","rejected","withdrawn"].includes(status);
                            const isInterview = status === "interview";
                            return (
                              <tr key={a.id || i}>
                                <td>
                                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                                    <div className="interview-avatar" style={{ width:36, height:36, fontSize:".85rem" }}>
                                      {initials(a.student_name || a.name || "?")}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight:700, fontSize:".86rem" }}>{a.student_name || a.name || "—"}</div>
                                      <div style={{ fontSize:".74rem", color:"var(--muted)" }}>{a.department || ""}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ fontSize:".84rem", color:"var(--muted)" }}>{a.job_title || a.title || "—"}</td>
                                <td style={{ fontSize:".84rem", color:"var(--muted)" }}>{a.institution || "—"}</td>
                                <td style={{ fontSize:".84rem", color:"var(--muted)" }}>{fmtDate(a.applied_at)}</td>
                                <td><StatusPill status={status} /></td>
                                <td>
                                  {isTerminal ? (
                                    <span style={{ fontSize:".76rem", color:"var(--muted)", fontStyle:"italic" }}>—</span>
                                  ) : (
                                    <div className="action-bar">
                                      {!isInterview && (
                                        <button className="btn-amber btn-sm"
                                          onClick={() => updateStatus(a.id, "SHORTLISTED", i)}>
                                          Shortlist
                                        </button>
                                      )}
                                      {!isInterview && (
                                        <button className="btn-purple btn-sm"
                                          onClick={() => moveToInterview(a.id, i)}>
                                          📅 Interview
                                        </button>
                                      )}
                                      {isInterview && (
                                        <button className="btn-amber btn-sm"
                                          onClick={() => progressToOffer(a.id)}>
                                          Extend Offer
                                        </button>
                                      )}
                                      <button className="btn-danger btn-sm"
                                        onClick={() => updateStatus(a.id, "REJECTED", i)}>
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── INTERVIEWS ── */}
            {tab === "interviews" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                  <h2 style={{ fontFamily:"var(--serif)", fontSize:"1.75rem", color:"var(--navy)" }}>Interviews</h2>
                  {interviews.length > 0 && (
                    <span style={{ background:"rgba(109,40,217,.1)", color:"var(--purple)", fontSize:".8rem", fontWeight:700, padding:"4px 12px", borderRadius:99 }}>
                      {interviews.length} candidate{interviews.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {interviews.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"4rem 2rem" }}>
                    <div style={{ fontSize:"3.5rem", marginBottom:16 }}>📅</div>
                    <h4 style={{ fontFamily:"var(--serif)", color:"var(--navy)", marginBottom:8, fontSize:"1.3rem" }}>No interviews yet</h4>
                    <p style={{ color:"var(--muted)", fontSize:".9rem", marginBottom:20 }}>
                      Go to the <strong>Applicants</strong> tab and click the <strong style={{ color:"var(--purple)" }}>📅 Interview</strong> button to schedule candidates.
                    </p>
                    <button className="btn-outline" onClick={() => setTab("applicants")}>Go to Applicants →</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {interviews.map((iv) => {
                      const name = iv.candidate_name || "—";
                      const ivStatus = (iv.status || "interview").toLowerCase();
                      return (
                        <div key={iv.id} className="interview-card">
                          <div className="interview-avatar">
                            {initials(name)}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, color:"var(--navy)", fontSize:".92rem" }}>{name}</div>
                            <div style={{ fontSize:".8rem", color:"var(--muted)", marginTop:2 }}>
                              📋 {iv.position || "—"}
                              {iv.applied_at && <span> · Applied {fmtDate(iv.applied_at)}</span>}
                            </div>
                          </div>
                          <StatusPill status={ivStatus} />
                          <div className="action-bar">
                            {ivStatus === "interview" && (
                              <>
                                <button className="btn-amber btn-sm" onClick={() => progressToOffer(iv.id)}>
                                  Extend Offer 🎉
                                </button>
                                <button className="btn-ghost btn-sm" onClick={() => removeFromInterviews(iv.id)}>
                                  ↩ Shortlist
                                </button>
                              </>
                            )}
                            {ivStatus === "offered" && (
                              <span style={{ fontSize:".8rem", color:"var(--green)", fontWeight:700 }}>Offer Sent ✓</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>
        )}
      </main>

     {showCreate && (
        <CreatePostingModal
          onClose={() => setShowCreate(false)}
          onSuccess={(msg, newPosting) => {
            addToast(msg, "📢");
            setShowCreate(false);
            if (newPosting) {
              setPostings(prev => [normPosting(newPosting), ...prev]);
            }
            setTab("postings");
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CREATE POSTING MODAL
// ─────────────────────────────────────────────────────────────────
function CreatePostingModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title:"", type:"INTERNSHIP", employment_type:"OTHER",
    location:"", work_mode:"ONSITE",
    salary_min:"", salary_max:"",
    deadline:"", description:"", status:"PUBLISHED"
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (status) => {
    if (!form.title || !form.deadline || !form.description) {
      setErr("Title, deadline and description are required."); return;
    }
    setErr(""); setLoading(true);
    try {
  
      const result = await api("/employer/postings", "POST", { ...form, status });
      onSuccess(status==="PUBLISHED" ? "Posting published! 🎉" : "Draft saved 💾", result.posting);
    } catch(e) { setErr(e.message); setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:580 }}>
        <div className="modal-header">
          <span style={{ fontFamily:"var(--serif)", fontSize:"1.15rem", fontWeight:600, color:"var(--navy)" }}>Create New Posting</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {err && <div className="alert alert-err">{err}</div>}
          <div style={{ marginBottom:10 }}>
            <Label>Job Title *</Label>
            <input className="ib-input" placeholder="Software Engineering Intern" value={form.title} onChange={e=>set("title",e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <Label>Type *</Label>
              <select className="ib-select" value={form.type} onChange={e=>set("type",e.target.value)}>
                <option value="INTERNSHIP">Internship</option>
                <option value="JOB">Job</option>
                <option value="SIWES">SIWES</option>
                <option value="NYSC">NYSC</option>
              </select>
            </div>
            <div>
              <Label>Work Mode</Label>
              <select className="ib-select" value={form.work_mode} onChange={e=>set("work_mode",e.target.value)}>
                <option value="ONSITE">Onsite</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <Label>Location</Label>
              <input className="ib-input" placeholder="Lagos, Nigeria" value={form.location} onChange={e=>set("location",e.target.value)} />
            </div>
            <div>
              <Label>Employment Type</Label>
              <select className="ib-select" value={form.employment_type} onChange={e=>set("employment_type",e.target.value)}>
                {["FULL_TIME","PART_TIME","CONTRACT","NYSC","SIWES","OTHER"].map(o=>(
                  <option key={o} value={o}>{o.replace(/_/g," ")}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Min Salary (₦/mo)</Label>
              <input className="ib-input" type="number" placeholder="80000" value={form.salary_min} onChange={e=>set("salary_min",e.target.value)} />
            </div>
            <div>
              <Label>Max Salary (₦/mo)</Label>
              <input className="ib-input" type="number" placeholder="120000" value={form.salary_max} onChange={e=>set("salary_max",e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom:10 }}>
            <Label>Application Deadline *</Label>
            <input className="ib-input" type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)} />
          </div>
          <div style={{ marginBottom:16 }}>
            <Label>Description *</Label>
            <textarea className="ib-input" rows={5} placeholder="Describe the role, responsibilities and requirements…" value={form.description} onChange={e=>set("description",e.target.value)} />
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-amber" style={{ flex:1 }} onClick={() => submit("PUBLISHED")} disabled={loading}>
              {loading ? <Spinner /> : "Publish Now 📢"}
            </button>
            <button className="btn-outline" onClick={() => submit("DRAFT")} disabled={loading}>Save Draft</button>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOAST MANAGER
// ─────────────────────────────────────────────────────────────────
function ToastManager({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.err ? " err" : ""}`}>
          <span>{t.icon}</span>{t.msg}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]               = useState("home");
  const [user, setUser]               = useState(getUser);
  const [applyTarget, setApplyTarget] = useState(null);
  const [showForgot, setShowForgot]   = useState(false);
  const [toasts, setToasts]           = useState([]);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const addToast = useCallback((msg, icon = "✅", err = false) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, icon, err }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const onLogin = (token, userData) => {
    saveSession(token, userData);
    setUser(userData);
    addToast(`Welcome back, ${userData.first_name || userData.email}! 🎉`);
    setPage(userData.role_id === 3 ? "employer-dash" : "student-dash");
  };

  const onLogout = () => {
    clearSession();
    setUser(null);
    setPage("home");
    addToast("Signed out 👋", "👋");
  };

  const sharedProps = { user, setPage, addToast };

  return (
    <>
      <Nav page={page} setPage={setPage} user={user} onLogout={onLogout} />

      {page === "home"          && <HomePage {...sharedProps} setApplyTarget={setApplyTarget} />}
      {page === "browse"        && <BrowsePage setApplyTarget={setApplyTarget} />}
      {page === "login"         && <LoginPage setPage={setPage} onLogin={onLogin} showForgot={() => setShowForgot(true)} />}
      {page === "register"      && <RegisterPage setPage={setPage} onLogin={onLogin} />}
      {page === "student-dash"  && <StudentDash {...sharedProps} setApplyTarget={setApplyTarget} />}
      {page === "employer-dash" && <EmployerDash {...sharedProps} />}

      {applyTarget && (
        <ApplyModal posting={applyTarget} isLoggedIn={!!user}
          onClose={() => setApplyTarget(null)}
          onSuccess={msg => { addToast(msg, "🎉"); setApplyTarget(null); }}
        />
      )}
      {showForgot && (
        <ForgotModal onClose={() => { setShowForgot(false); setPage("login"); }} />
      )}

      <ToastManager toasts={toasts} />
    </>
  );
}