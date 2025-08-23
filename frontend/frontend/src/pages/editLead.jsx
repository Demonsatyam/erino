import { useEffect, useState } from "react";
import { getLead, updateLead } from "../services/leadService";
import { useNavigate, useParams } from "react-router-dom";
import LeadForm from "../components/leadForm";

export default function EditLead() {
  const { id } = useParams();
  const nav = useNavigate();
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getLead(id);
        setInitial(res.data.data); // ✅ fix here
      } catch (error) {
        console.error("Failed to fetch lead", error);
      }
    })();
  }, [id]);

  const onSubmit = async (payload) => {
    setSaving(true);
    try {
      await updateLead(id, payload);
      nav("/dashboard");
    } catch (error) {
      console.error("Failed to update lead", error);
    } finally {
      setSaving(false);
    }
  };

  if (!initial) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Lead</h1>
      <LeadForm initial={initial} onSubmit={onSubmit} submitting={saving} />
    </div>
  );
}
