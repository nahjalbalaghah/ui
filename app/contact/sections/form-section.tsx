"use client";
import React, { useState } from "react";
import Input from "@/app/components/input";
import Button from "@/app/components/button";
import Checkbox from "@/app/components/checkbox";
import { Mail, User, MapPin, Phone, Info, MessageCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/app/components/modal";
import AboutSvg from "@/app/assets/images/about.svg";

const whyContact = [
  {
    icon: <MessageCircle className="w-6 h-6 text-[#43896B]" />, title: "Quick Support", desc: "Get fast answers to your questions and issues."
  },
  {
    icon: <Info className="w-6 h-6 text-[#43896B]" />, title: "Expert Guidance", desc: "Our team is ready to help you with any inquiry."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#43896B]" />, title: "Privacy First", desc: "Your information is always safe and confidential."
  }
];

const ContactFormSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !form.consent) {
      setError("Please fill all fields and accept the privacy policy.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section id="contact-form-section" className="relative py-24 px-4 bg-gradient-to-br from-white via-[#f6faf8] to-[#eaf4ef] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9IiM0Mzg5NkIiLz4KPHJlY3QgeD0iMTUiIHk9IjE1IiB3aWR0aD0iMTAiIGhlaWdodD0iMjAiIGZpbGw9IiM0Mzg5NkIiLz4KPC9zdmc+')] bg-repeat z-0"></div>
      <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-[#43896B] mb-2">Send Us a Message</h2>
            <p className="text-gray-700 mb-4">Our team will respond as soon as possible. You can also reach us directly:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 text-sm mb-2">
              <div className="flex items-center gap-2"><Mail size={16} className="text-[#43896B]" /> info@nahj-al-balagha.com</div>
              <div className="flex items-center gap-2"><Phone size={16} className="text-[#43896B]" /> +98 21 1234 5678</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-[#43896B]" /> Qom, Iran</div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <AnimatePresence>
              {submitted ? (
                <Modal isOpen={submitted} onClose={() => setSubmitted(false)} title="Message Sent!">
                  <div className="text-center text-green-600 font-semibold py-8">
                    Thank you for reaching out! We have received your message.<br />Our team will get back to you soon.
                  </div>
                </Modal>
              ) : (
                <motion.form
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Input
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    icon={<User size={18} />}
                    placeholder="Your Name"
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    icon={<Mail size={18} />}
                    placeholder="you@email.com"
                    required
                  />
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      className="w-full p-3 text-sm border border-[#D7DEE9] rounded-xl outline-none transition focus:ring-2 focus:ring-[#43896B] focus:border-[#43896B] min-h-[120px] resize-vertical"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="consent"
                      checked={form.consent}
                      onChange={(checked) => setForm((prev) => ({ ...prev, consent: checked }))}
                      label="I agree to the privacy policy."
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button type="submit" variant="solid" className="w-full">Send Message</Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#43896B]/30 to-transparent" />
            <span className="text-[#43896B] font-semibold text-sm">Why Contact Us?</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#43896B]/30 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {whyContact.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center bg-white/80 rounded-2xl p-6 shadow border border-white/40 hover:shadow-lg transition-all">
                <div className="mb-3">{item.icon}</div>
                <div className="font-bold text-gray-800 mb-1">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactFormSection; 