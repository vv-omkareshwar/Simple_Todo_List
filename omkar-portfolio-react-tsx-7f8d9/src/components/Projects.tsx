import React from 'react';

interface Project {
  name: string;
  description: string;
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      name: "Project 1",
      description: "This is a sample project description. Replace with actual project details."
    },
    {
      name: "Project 2",
      description: "Another sample project description. Replace with actual project details."
    },
    // Add more projects as needed
  ];

  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="projects-container">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;