import { useEffect, useState } from "react";

const empty = {
  first_name:"", last_name:"", email:"", phone:"",
  company:"", city:"", state:"",
  status:"new", source:"website",
  score:0, lead_value:0, last_activity_at:"", is_qualified:false
};

export default function LeadForm({ initial=empty, onSubmit, submitting }) {
  const [form, setForm] = useState(empty);
  useEffect(()=>setForm(prev=>({ ...prev, ...initial })), [initial]);

  const change = (k,v)=>setForm(f=>({...f,[k]:v}));

  return (
    <div className="grid-2">
      <div className="card">
        <h3>Lead Details</h3>
        <div className="grid-2">
          <div>
            <label>First Name</label>
            <input value={form.first_name} onChange={e=>change("first_name", e.target.value)} />
          </div>
          <div>
            <label>Last Name</label>
            <input value={form.last_name} onChange={e=>change("last_name", e.target.value)} />
          </div>
        </div>

        <label>Email</label>
        <input value={form.email} onChange={e=>change("email", e.target.value)} />

        <div className="grid-2">
          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={e=>change("phone", e.target.value)} />
          </div>
          <div>
            <label>Company</label>
            <input value={form.company} onChange={e=>change("company", e.target.value)} />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>City</label>
            <input value={form.city} onChange={e=>change("city", e.target.value)} />
          </div>
          <div>
            <label>State</label>
            <input value={form.state} onChange={e=>change("state", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card" style={{ flex: 1 }}>
        <h3>AI Score</h3>
        <label>Score (0 - 100)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={form.score}
          onChange={e => setForm({ ...form, score: e.target.value })}
          required
        />
      </div>


      <div className="card span-2">
        <h3>Lead Properties</h3>
        <label>Lead Value ($)</label>
        <input type="number" value={form.lead_value} onChange={e=>change("lead_value", Number(e.target.value))} />

        <div className="grid-3">
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e=>change("status", e.target.value)}>
              <option value="new">new</option>
              <option value="contacted">contacted</option>
              <option value="qualified">qualified</option>
              <option value="lost">lost</option>
              <option value="won">won</option>
            </select>
          </div>
          <div>
            <label>Source</label>
            <select value={form.source} onChange={e=>change("source", e.target.value)}>
              <option value="website">website</option>
              <option value="facebook_ads">facebook_ads</option>
              <option value="google_ads">google_ads</option>
              <option value="referral">referral</option>
              <option value="events">events</option>
              <option value="other">other</option>
            </select>
          </div>
          <div>
            <label>Qualified</label>
            <select value={String(form.is_qualified)} onChange={e=>change("is_qualified", e.target.value==="true")}>
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </div>
        </div>

        <div className="actions end">
          <button type="button" className="ghost" onClick={()=>history.back()}>Cancel</button>
          <button className="primary" disabled={submitting} onClick={()=>onSubmit(form)}>
            {submitting ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
