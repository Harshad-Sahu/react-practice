// ============================================
// 1. React 18 — Plain (useState + controlled inputs)
// ============================================
import React, { useState } from "react";
import "./styles.css";

const initialState = {
  fullName: "",
  email: "",
  bio: "",
  role: "frontend",
  experience: "mid",
  newsletter: false,
  skills: [],
  resume: null,
};
export default function RegistrationForm() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const validate = (data) => {
    const newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (data.bio.length > 300)
      newErrors.bio = "Bio must be under 300 characters";
    if (data.skills.length === 0)
      newErrors.skills = "Select at least one skill";
    return newErrors;
  };
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };
  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setStatus("submitting");
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "skills") payload.append(key, JSON.stringify(val));
        else payload.append(key, val ?? "");
      });
      const res = await fetch("https://mock-api.example.com/api/register", {
        method: "POST",
        body: payload,
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <span role="alert">{errors.fullName}</span>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span role="alert">{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
        />
        {errors.bio && <span role="alert">{errors.bio}</span>}
      </div>
      <div>
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="frontend">Frontend Engineer</option>
          <option value="backend">Backend Engineer</option>
          <option value="fullstack">Full-Stack Engineer</option>
        </select>
      </div>
      <fieldset>
        <legend>Experience Level</legend>
        {["junior", "mid", "senior"].map((level) => (
          <label key={level}>
            <input
              type="radio"
              name="experience"
              value={level}
              checked={formData.experience === level}
              onChange={handleChange}
            />
            {level}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Skills</legend>
        {["React", "TypeScript", "CSS", "Node.js"].map((skill) => (
          <label key={skill}>
            <input
              type="checkbox"
              checked={formData.skills.includes(skill)}
              onChange={() => handleSkillToggle(skill)}
            />
            {skill}
          </label>
        ))}
        {errors.skills && <span role="alert">{errors.skills}</span>}
      </fieldset>
      <div>
        <label htmlFor="resume">Resume (PDF)</label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf"
          onChange={handleChange}
        />
      </div>
      <label className="newsletter-label">
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
        />
        Subscribe to newsletter
      </label>
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Submit"}
      </button>
      {status === "success" && (
        <p role="status">Form submitted successfully!</p>
      )}
      {status === "error" && (
        <p role="alert">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
