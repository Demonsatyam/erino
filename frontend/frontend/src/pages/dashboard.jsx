import { useEffect, useMemo, useState } from "react";
import { listLeads, deleteLead } from "../services/leadService";
import { Link, useNavigate } from "react-router-dom";

const STATUS_BADGE = {
  new: "○ New",
  contacted: "📞 Contacted",
  qualified: "✅ Qualified",
  lost: "⛔ Lost",
  won: "🏆 Won",
};

export default function Dashboard() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page:1, limit:10, total:0, totalPages:1 });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  const fetchRows = async (p=1, l=meta.limit) => {
    setLoading(true);
    try {
      const { data } = await listLeads(p, l, { q, status, source });
      setRows(data?.data || []);
      setMeta({
        page: data?.page || p,
        limit: data?.limit || l,
        total: data?.total || 0,
        totalPages: data?.totalPages || 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRows(1, meta.limit); }, []); // initial

  const onSearch = (e) => setQ(e.target.value);
  const applyFilters = () => fetchRows(1, meta.limit);

  const onDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await deleteLead(id);
    fetchRows(meta.page, meta.limit);
  };

  const pager = useMemo(() => ({
    prev: () => meta.page>1 && fetchRows(meta.page-1, meta.limit),
    next: () => meta.page<meta.totalPages && fetchRows(meta.page+1, meta.limit),
    first: () => fetchRows(1, meta.limit),
    last: () => fetchRows(meta.totalPages, meta.limit),
  }), [meta]);

  return (
    <div className="leads-page">
      <div className="page-header">
        <div>
          <h1>Welcome back!</h1>
          <p>Here’s a list of your leads for this month.</p>
        </div>
        <button className="primary" onClick={()=>nav("/leads/create")}>+ Add lead</button>
      </div>

      <div className="filters">
        <input placeholder="Filter leads..." value={q} onChange={onSearch} onKeyDown={(e)=>e.key==="Enter"&&applyFilters()} />
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>
        <select value={source} onChange={e=>setSource(e.target.value)}>
          <option value="">Source</option>
          <option value="website">Website</option>
          <option value="facebook_ads">Facebook Ads</option>
          <option value="google_ads">Google Ads</option>
          <option value="referral">Referral</option>
          <option value="events">Events</option>
          <option value="other">Other</option>
        </select>
        <button onClick={applyFilters}>Apply</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Company</th>
              <th>Status</th>
              <th>Score</th>
              <th>Source</th>
              <th>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="7">No leads found</td></tr>
            ) : rows.map(l => (
              <tr key={l._id}>
                <td>
                  <div className="stack">
                    <div className="title">{`${l.first_name} ${l.last_name}`}</div>
                    <div className="muted">{l.email}</div>
                  </div>
                </td>
                <td>{l.company}</td>
                <td>{STATUS_BADGE[l.status] || l.status}</td>
                <td className={l.score>=85 ? "ok" : l.score<=50 ? "bad":"warn"}>{l.score ?? "-"}</td>
                <td>{l.source}</td>
                <td>${Number(l.lead_value||0).toLocaleString()}</td>
                <td className="row-actions">
                  <button onClick={()=>nav(`/leads/edit/${l._id}`)}>Edit</button>
                  <button className="danger" onClick={()=>onDelete(l._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pager">
          <span>Rows per page</span>
          <select value={meta.limit} onChange={e=>fetchRows(1, Number(e.target.value))}>
            {[10,20,50,100].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <span>Page {meta.page} of {meta.totalPages}</span>
          <div className="pager-btns">
            <button onClick={pager.first} disabled={meta.page===1}>&laquo;</button>
            <button onClick={pager.prev}  disabled={meta.page===1}>&lsaquo;</button>
            <button onClick={pager.next}  disabled={meta.page===meta.totalPages}>&rsaquo;</button>
            <button onClick={pager.last}  disabled={meta.page===meta.totalPages}>&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
