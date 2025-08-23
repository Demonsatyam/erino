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
      const { data } = await getLead(id);
      setInitial(data);
    })();
  }, [id]);

  const onSubmit = async (payload) => {
    setSaving(true);
    try {
      await updateLead(id, payload);
      nav("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  if (!initial) return null;
  return (
    <div>
      <h1>Edit Lead</h1>
      <LeadForm initial={initial} onSubmit={onSubmit} submitting={saving} />
    </div>
  );
}
