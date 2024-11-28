import React, { useState } from "react";

const App = () => {
  const [rating, setRating] = useState(0); // Default value set to 0
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle rating change
  const handleRatingChange = (e) => {
    setRating(Number(e.target.value)); // Ensure rating is a number
    setFeedback(""); // Reset feedback when rating changes
    setSubmitted(false); // Reset submission state
  };

  // Handle feedback change
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    // Prepare data for submission
    const payload = {
      rating,
      feedback: rating <= 3 ? feedback || "No feedback provided" : "Positive feedback",
    };

    try {
      // Submit data to Google Apps Script
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbw028NfKVsJda2mdwCCT4NW6Tn-x_iqfbEOtFMD4o1qn2RVksseFeFKs07umYTWWCtLqQ/exec", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure this is correct
          },
          body: JSON.stringify(payload),
        }
      );

      // Ensure the response is successful
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();

      if (result.status === "success") {
        setSubmitted(true); // Mark submission as successful

        if (rating >= 4) {
          // Redirect to Google Review page for positive ratings
          const googleReviewLink = `https://g.page/r/CYMizBFu4jQwEAE/review`; // Replace with your Google Place ID
          window.open(googleReviewLink, "_blank");
        } else {
          alert("Thank you for your feedback. We will work to improve!");
        }
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again later.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1>Rate Our Service</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Please select your rating:</p>
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="rating"
                value={num}
                checked={rating === num} // Ensures radio button reflects the current rating
                onChange={handleRatingChange}
              />
              {num}
            </label>
          ))}
        </div>

        {rating <= 3 && rating !== 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>We’re Sorry to Hear That</h3>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Please let us know what went wrong."
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      {submitted && (
        <p style={{ marginTop: "20px", color: "green" }}>
          Thank you for your feedback!
        </p>
      )}
    </div>
  );
};

export default App;
