"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/content/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        subject: form.get("subject"),
        message: form.get("message"),
        source: "Contact page",
      }),
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="soft-card grid gap-5 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Name
          <input name="name" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Phone
          <input name="phone" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        Email
        <input name="email" type="email" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        Subject
        <input name="subject" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        Message
        <textarea name="message" rows={5} required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
      </label>
      <button type="submit" disabled={status === "submitting"} className="gold-button magnetic inline-flex w-fit items-center gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-60">
        <Send size={17} />
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
      {status === "success" && <p className="rounded-lg bg-sage/12 px-4 py-3 text-sm font-semibold text-sage">Inquiry received. We will get back to you soon.</p>}
      {status === "error" && <p className="rounded-lg bg-rose/12 px-4 py-3 text-sm font-semibold text-rose">Unable to send right now. Please try again.</p>}
    </form>
  );
}
