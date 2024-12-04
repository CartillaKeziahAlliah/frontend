import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is LMS?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "What is LMS?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "What is LMS?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "What is LMS?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "What is LMS?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <div
      style={{ fontFamily: "Arial, sans-serif" }}
      className="bg-white w-full h-full py-10"
    >
      <h2 style={{ color: "green" }} className="text-5xl font-bold text-center">
        Questions? Look Here!
      </h2>
      <p className="text-center">
        Can't find your concern? Email us at{" "}
        <a
          href="mailto:talambanNHS@gmail.com"
          style={{ color: "#207E68" }}
          className="font-bold"
        >
          talambanNHS@gmail.com
        </a>
        .
      </p>
      <center>
        {" "}
        <div className="w-[70%]  flex gap-10 flex-col">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-[#207E68] rounded-md">
              <div
                onClick={() => toggleFAQ(index)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                }}
                className="rounded-md"
              >
                <h3 style={{ margin: 0 }}>{faq.question}</h3>
                <span className="text-[#207E68]">
                  {openIndex === index ? <FaChevronDown /> : <FaChevronUp />}
                </span>
              </div>
              {openIndex === index && (
                <div
                  style={{ padding: "10px", backgroundColor: "#fff" }}
                  className="border border-t-[#207E68] rounded-b-md"
                >
                  <p className="text-left">
                    {faq.answer || "No answer provided yet."}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </center>
    </div>
  );
};

export default FAQ;
