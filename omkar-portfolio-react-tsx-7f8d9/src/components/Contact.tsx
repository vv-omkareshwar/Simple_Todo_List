import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., sending data to a server
    console.log('Form submitted:', { name, email, message });
    // Reset form fields after submission
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contact">
      <h2>Contact Me</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
      <div className="contact-info">
        <p>
          <img src="/images/envelope.png" alt="Email" />
          Email: <a href="mailto:omkar@example.com">omkar@example.com</a>
        </p>
        <p>
          <img src="/images/phone.png" alt="Phone" />
          Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
        </p>
      </div>
    </section>
  );
};

export default Contact;