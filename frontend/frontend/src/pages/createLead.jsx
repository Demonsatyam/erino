import { useState } from "react";
import LeadForm from "../components/leadForm";
import { createLead } from "../services/leadService";
import { useNavigate } from "react-router-dom";

export default function CreateLead() {
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (payload) => {
    setSaving(true);
    try {
      await createLead(payload);
      nav("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Create New Lead</h1>
      <p>Fill in the details below to add a new lead to your pipeline.</p>
      <LeadForm onSubmit={onSubmit} submitting={saving} />
    </div>
  );
}
