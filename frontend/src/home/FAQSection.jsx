import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Alhnkar?",
    answer:
      "Alhnkar is a modern clothing brand focused on premium quality, timeless designs, and everyday comfort.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are usually delivered within 3-7 business days depending on your location.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes. We offer easy returns and exchanges within 7 days of delivery, provided the product is unused and in its original condition.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via email or SMS to monitor your shipment.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, debit cards, credit cards, net banking, wallets, and Cash on Delivery (COD).",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes, Cash on Delivery is available on eligible orders across most locations in India.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-lg uppercase tracking-[0.3em] text-accent font-bold">
            Support
          </p>

          <h2 className="mt-3 text-4xl text-primary/70 md:text-5xl font-serif">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-500">
            Everything you need to know about Alhnkar.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-neutral-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-primary/70 text-lg">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}