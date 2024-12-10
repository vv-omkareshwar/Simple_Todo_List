import React, { useState, useEffect } from 'react';

interface Recommendation {
  name: string;
  position: string;
  company: string;
  text: string;
}

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simulating fetching recommendations from an API
    const fetchedRecommendations: Recommendation[] = [
      {
        name: "John Doe",
        position: "Senior Developer",
        company: "Tech Corp",
        text: "Omkar is an exceptional developer with a keen eye for detail."
      },
      {
        name: "Jane Smith",
        position: "Project Manager",
        company: "Innovative Solutions",
        text: "Working with Omkar was a pleasure. His problem-solving skills are outstanding."
      },
      {
        name: "Mike Johnson",
        position: "CTO",
        company: "StartUp Inc",
        text: "Omkar's ability to quickly adapt to new technologies is impressive."
      }
    ];

    setRecommendations(fetchedRecommendations);
  }, []);

  const nextRecommendation = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + recommendations.length) % recommendations.length);
  };

  return (
    <section id="recommendations">
      <h2 className="recommendations-title">Recommendations</h2>
      {recommendations.length > 0 && (
        <div className="recommendation-container">
          <button onClick={prevRecommendation} className="recommendation-nav prev">
            &lt;
          </button>
          <div className="recommendation-content">
            <p className="recommendation-text">"{recommendations[currentIndex].text}"</p>
            <p className="recommendation-author">
              - {recommendations[currentIndex].name}, {recommendations[currentIndex].position} at {recommendations[currentIndex].company}
            </p>
          </div>
          <button onClick={nextRecommendation} className="recommendation-nav next">
            &gt;
          </button>
        </div>
      )}
    </section>
  );
};

export default Recommendations;