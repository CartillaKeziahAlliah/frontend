import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SectionDetail = () => {
  const { sectionName } = useParams();

  return (
    <div className="course-Sectiondetail-container p-4">
      <h1 className="text-3xl font-bold mb-4">{sectionName}</h1>
    </div>
  );
};

export default SectionDetail;
