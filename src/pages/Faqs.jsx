import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is a Learning Management System (LMS)?",
      answer:
        "An LMS is a digital platform that helps manage, deliver, and track educational courses and training programs. It allows students to access course materials, submit assignments, and communicate with teachers.",
    },
    {
      question: "How do I log in to the LMS?",
      answer:
        "To log in, visit the LMS website and enter your username and password provided by your school. If you have trouble logging in, check with your teacher or IT support.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "To update your profile, log in and go to your account settings. Here, you can change your personal information, including your email and password.",
    },
    {
      question: "Can I submit assignments online?",
      answer:
        "Yes, you can submit assignments directly through the LMS. Go to the assignment section of your course, follow the instructions, and upload your work.",
    },
    {
      question: "How can I manage my time effectively with online courses?",
      answer:
        "Use the calendar or planner feature in the LMS to track assignment due dates and scheduled assessments. Set aside regular study time each week to stay on track.",
    },
    {
      question: "How do I prepare for online tests and quizzes?",
      answer:
        "Review course materials, take practice quizzes if available, and ensure you understand the test format. Make sure to find a quiet environment and have reliable internet access during the test.",
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
        <div className="w-[70%] flex gap-10 flex-col mt-2">
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
