import React from 'react';

const Skills: React.FC = () => {
  const skillsData = [
    { name: 'HTML5', image: '/images/html5.png' },
    { name: 'CSS3', image: '/images/CSS3.png' },
    { name: 'JavaScript', image: '/images/js.jpeg' },
    { name: 'React', image: '/images/react.png' },
    { name: 'Node.js', image: '/images/node.png' },
    { name: 'Python', image: '/images/python.png' },
    { name: 'Java', image: '/images/java.png' },
    { name: 'C++', image: '/images/c++.png' },
    { name: 'PHP', image: '/images/php.png' },
    { name: 'MySQL', image: '/images/mysql.png' },
  ];

  return (
    <section id="skills">
      <h2 className="skills-header">Skills</h2>
      <div className="skills-container">
        {skillsData.map((skill, index) => (
          <div key={index} className="skill-card">
            <img src={skill.image} alt={skill.name} className="skill-image" />
            <p className="skill-name">{skill.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;