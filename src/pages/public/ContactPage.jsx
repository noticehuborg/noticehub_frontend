import { useState } from "react";
import { Icon } from "@iconify/react";
import Button from "../../components/ui/Button";
import LinesVectorBg from "../../assets/svg/linesvectorbg.svg";
import GroupDiscussion from "../../assets/svg/group-discussion-rafiki.svg";
import Input from "../../components/ui/Input";
import api from "../../services/api";

const fieldClass =
  "w-full px-4 py-3.5 bg-zinc-100 rounded-[10px] text-neutral-gray-9 text-base placeholder:text-neutral-gray-6 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    program: "",
    level: "",
    messageType: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", program: "", level: "", messageType: "", subject: "", message: "" });
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute w-full h-full">
          <img
            src={LinesVectorBg}
            alt=""
            className="opacity-60 object-center object-cover w-200 h-full md:w-500"
          />
        </div>
        <div className="relative mt-24 mb-18 md:mt-26 md:mb-20 lg:mt-30 lg:mb-24 section-container  flex flex-col items-center text-center gap-7">
          <h1 className="text-4xl xsm:text-[40px] sm:text-5xl md:text-6xl lg:text-[68px] xl:text-7xl font-semibold leading-tight">
            <span className="text-secondary">Contact </span>
            <span className="text-primary">Us</span>
          </h1>
          <p className="max-w-2xl text-neutral-gray-8 text-sm md:text-lg leading-5 md:leading-6">
            Something not working? Got an idea? Want to report an issue? Drop us
            a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="bg-white">
        <div className="section-container section-padding">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Illustration */}
            <div className="w-full lg:w-1/2 h-72 sm:h-96 md:h-[500px] lg:h-[650px] rounded-3xl overflow-hidden shrink-0">
              <img
                src={GroupDiscussion}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Form */}
            <div className="w-full max-w-[768px] lg:w-1/2 flex flex-col gap-9">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-secondary">
                  Speak Up — Your Voice Matters
                </h2>
                <p className="text-neutral-gray-8 text-sm md:text-lg leading-6 md:leading-8 max-w-lg">
                  Got a suggestion, complaint, or just something we should know?
                  We read everything. Nothing is too small.
                </p>
              </div>

              {submitted && (
                <div className="flex items-start gap-3 px-5 py-4 bg-success-1 rounded-2xl outline outline-1 outline-success-4">
                  <Icon icon="mdi:check-circle-outline" className="w-5 h-5 text-success-7 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-success-8">Message sent!</p>
                    <p className="text-sm text-success-7 mt-0.5">We've received your message and will get back to you soon.</p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="flex items-center gap-2 px-5 py-4 bg-error-1 rounded-2xl outline outline-1 outline-error-3">
                  <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-error-7 shrink-0" />
                  <p className="text-sm text-error-8">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                />

                {/* Program + Level */}
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="relative flex-1">
                    <select
                      name="program"
                      value={form.program}
                      onChange={handleChange}
                      className={`${fieldClass} appearance-none pr-9 ${
                        form.program === ""
                          ? "text-neutral-gray-6"
                          : "text-neutral-gray-9"
                      }`}
                    >
                      <option value="" disabled>
                        Select program
                      </option>
                      <option value="cs">Computer Science</option>
                      <option value="it">Information Technology</option>
                      <option value="other">Other</option>
                    </select>
                    <Icon
                      icon="mdi:chevron-down"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-6 pointer-events-none"
                      width={16}
                    />
                  </div>
                  <div className="relative flex-1">
                    <select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      className={`${fieldClass} appearance-none pr-9 ${
                        form.level === ""
                          ? "text-neutral-gray-6"
                          : "text-neutral-gray-9"
                      }`}
                    >
                      <option value="" disabled>
                        Select Level
                      </option>
                      <option value="100">Level 100</option>
                      <option value="200">Level 200</option>
                      <option value="300">Level 300</option>
                      <option value="400">Level 400</option>
                    </select>
                    <Icon
                      icon="mdi:chevron-down"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-6 pointer-events-none"
                      width={16}
                    />
                  </div>
                </div>

                {/* Message type */}
                <div className="relative">
                  <select
                    name="messageType"
                    value={form.messageType}
                    onChange={handleChange}
                    className={`${fieldClass} appearance-none pr-9 ${
                      form.messageType === ""
                        ? "text-neutral-gray-6"
                        : "text-neutral-gray-9"
                    }`}
                  >
                    <option value="" disabled>
                      Message Type
                    </option>
                    <option value="suggestion">Suggestion</option>
                    <option value="complaint">Complaint</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                  <Icon
                    icon="mdi:chevron-down"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-6 pointer-events-none"
                    width={16}
                  />
                </div>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  placeholder="Please type your message here..."
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className={`input-base resize-none`}
                />

                <div>
                  <Button type="submit" variant="primary" size="md" loading={submitting} disabled={submitting}>
                    {submitting ? "Sending..." : "Send message"}
                    {!submitting && <Icon icon="tabler:arrow-right" width={20} />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
