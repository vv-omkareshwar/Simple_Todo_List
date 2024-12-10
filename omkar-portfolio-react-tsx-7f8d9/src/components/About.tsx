import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about-me" className="container">
      <h2>About Me</h2>
      <img src="/profile_pic.gif" alt="Profile Picture" className="profile-image" />
      <div className="about-content">
        <p>
          Hello! I'm Omkar Srinivas Nath, a passionate and dedicated software engineer with a strong foundation in computer science and a keen interest in cutting-edge technologies. I graduated from Vellore Institute of Technology with a Bachelor's degree in Computer Science and Engineering.
        </p>
        <p>
          Throughout my academic journey and professional experiences, I've developed a diverse skill set that includes proficiency in various programming languages, web development frameworks, and database management systems. I'm particularly enthusiastic about artificial intelligence, machine learning, and their applications in solving real-world problems.
        </p>
        <p>
          When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or engaging in hackathons to challenge myself and learn from the developer community. I'm always eager to take on new challenges and collaborate on innovative projects that push the boundaries of what's possible in the world of technology.
        </p>
      </div>
    </section>
  );
};

export default About;