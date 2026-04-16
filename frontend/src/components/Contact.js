import axios from "axios";
import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = () => {
    axios.post("http://localhost:5000/api/contact", form)
      .then(res => alert(res.data.message))
      .catch(err => console.log(err));
  };

  return (
    <section id="contact">
      <h2>Contact</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <textarea
        name="message"
        placeholder="Message"
        onChange={handleChange}
      />

      <button onClick={handleSend}>Send</button>
    </section>
  );
}

export default Contact;