import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields ❗");
      return;
    }
    try {
      await axios.post("https://myporfolio-6ms5.onrender.com/api/contact", form);
      alert("Message sent ✅");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

useEffect(() => {
  // ── Custom Cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  let mx=0,my=0,rx=0,ry=0;

  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    if(cursor) cursor.style.transform=`translate(${mx-6}px,${my-6}px)`;
  });

  function animRing(){
    rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
    if(ring) ring.style.transform=`translate(${rx-18}px,${ry-18}px)`;
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a,button,.project-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      if(ring){
        ring.style.width='56px';
        ring.style.height='56px';
      }
    });
    el.addEventListener('mouseleave',()=>{
      if(ring){
        ring.style.width='36px';
        ring.style.height='36px';
      }
    });
  });

  // ── Canvas particle system
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  let particles = [];

  const codeSnippets = [
    'const x = () =>',
    'async function()',
    'return Promise',
    '.then(res =>',
    'import React',
    'app.listen(3000)',
    'SELECT * FROM',
    'docker build .',
    'git commit -m',
    'npm run dev',
    'res.status(200)',
    'useEffect(() =>',
  ];

  class Particle {
    constructor(){
      this.x = Math.random()*W;
      this.y = Math.random()*H;
      this.vx = (Math.random()-0.5)*0.4;
      this.vy = (Math.random()-0.5)*0.4;
      this.r  = Math.random()*2+0.5;
      this.alpha = Math.random()*0.5+0.1;
      this.type = Math.random()>0.65 ? 'code' : 'dot';
      this.text = codeSnippets[Math.floor(Math.random()*codeSnippets.length)];
      this.fontSize = Math.random()*4+9;
      this.color = Math.random()>0.5 ? '0,240,255' : '123,47,255';
    }
    update(){
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>W) this.vx*=-1;
      if(this.y<0||this.y>H) this.vy*=-1;
    }
    draw(){
      if(this.type==='code'){
        ctx.font=`${this.fontSize}px 'Space Mono', monospace`;
        ctx.fillStyle=`rgba(${this.color},${this.alpha*0.35})`;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }
  }

  for(let i=0;i<110;i++) particles.push(new Particle());

  function drawConnections(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<110){
          ctx.beginPath();
          ctx.strokeStyle=`rgba(0,240,255,${(1-dist/110)*0.06})`;
          ctx.lineWidth=0.5;
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animLoop(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{ p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animLoop);
  }
  animLoop();

  // ── Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('visible');
    });
  },{threshold:0.12});
  reveals.forEach(r=>obs.observe(r));

  // ── Active nav
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll',()=>{
    let cur='';
    sections.forEach(s=>{
      if(window.scrollY>=s.offsetTop-200) cur=s.id;
    });
    links.forEach(l=>{
      l.style.color = l.getAttribute('href')==='#'+cur ? 'var(--accent)' : '';
    });
  });

}, []);
  return (
    <>
      {/* Cursor */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* Background */}
      <div className="grid-bg"></div>
      <canvas id="bg-canvas"></canvas>

      {/* NAV */}
      <nav>
        <div className="logo"><span>R-ZIP</span></div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#workshop">Workshop</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="home">
  <span className="hero-badge">✦ Open to work ✦</span>
  <h1 className="hero-name">Rohan's Zip</h1>
  <p className="hero-role">Web <span className="hl">&amp;</span> Back-End Developer</p>
  <p className="hero-desc">
    I build elegant, high-performance digital experiences — from pixel-perfect UIs to robust server-side architectures. Turning ideas into production-grade reality.
  </p>
  <div className="hero-btns">
    <a href="#workshop" className="btn btn-primary">View My Work</a>
    <a href="#contact" className="btn btn-outline">Let's Connect</a>
  </div>
  <div className="scroll-indicator">
    <div className="scroll-line"></div>
    <span>scroll</span>
  </div>
</section>
<div className="section-divider"></div>



      {/* ABOUT */}
     <section id="about">
  <div className="reveal">
    <p className="section-label">about me</p>
    <h2 className="section-title">Crafting Code<br></br><span>With Purpose</span></h2>
  </div>
  <div className="about-grid reveal">
    <div className="about-text">
      <p>Hey! I'm <strong style={{ color: 'var(--accent)' }}> Rohan Singh Rajput</strong>, a full-stack developer with a deep love for building things on the web. With 3+ years of experience, I specialise in creating seamless user experiences backed by solid, scalable server architectures.</p>
      <p>Whether it's a sleek front-end interface or a complex RESTful API, I approach every project with the same obsession — clean code, thoughtful design, and real-world performance.</p>
      <p>When I'm not coding, you'll find me contributing to open-source, exploring new frameworks, or building side projects that solve real problems.</p>
    </div>
    <div className="skills-grid">
      <div className="skill-item">
        <div className="skill-name">React / Next.js</div>
        <div className="skill-desc">Modern UI development</div>
      </div>
      <div className="skill-item">
        <div className="skill-name">Node.js</div>
        <div className="skill-desc">Server-side JavaScript</div>
      </div>
      <div className="skill-item">
        <div className="skill-name">Python</div>
        <div className="skill-desc">Back-end frameworks</div>
      </div>
      <div className="skill-item">
        <div className="skill-name">MySQL</div>
        <div className="skill-desc">Relational databases</div>
      </div>
      <div className="skill-item">
        <div className="skill-name">PHP / Laravel</div>
        <div className="skill-desc">Backend web development & MVC frameworks</div>
      </div>
      <div className="skill-item">
        <div className="skill-name">HTML & CSS</div>
        <div className="skill-desc">Responsive layouts & modern web design</div>
      </div>
    </div>
  </div>
</section>
<div className="section-divider"></div>



      {/* PROJECTS */}
     <section id="workshop">
  <div className="workshop-inner">
    <div className="reveal">
      <p className="section-label">my workshop</p>
      <h2 className="section-title">Projects I've<br /><span>Shipped</span></h2>
    </div>
    <div className="projects-grid reveal">

      <div className="project-card">
        <div className="project-num">01 ——</div>
        <div className="project-title">My Portfolio</div>
        <div className="project-desc">
          I have developed a personal portfolio website to showcase my skills, projects, and technical expertise. The platform highlights my work with a clean, responsive design and provides an overview of my experience, making it easy for recruiters and clients to explore my capabilities.
        </div>
        <div className="project-tags">
          <span className="tag">React</span>
          <span className="tag">HTML</span>
          <span className="tag purple">CSS</span>
          <span className="tag pink">JavaScript</span>
        </div>
      </div>

      <div className="project-card">
        <div className="project-num">02 ——</div>
        <div className="project-title">PulseAPI</div>
        <div className="project-desc">Developer API platform for real-time analytics. Processes 2M+ events/day with sub-10ms response times using a custom event streaming pipeline.</div>
        <div className="project-tags">
          <span className="tag">Python</span>
          <span className="tag purple">Kafka</span>
          <span className="tag">GraphQL</span>
          <span className="tag pink">Docker</span>
        </div>
      </div>

      <div className="project-card">
        <div className="project-num">03 ——</div>
        <div className="project-title">Orbita UI</div>
        <div className="project-desc">Open-source React component library with 80+ customisable components. 4k+ GitHub stars, used by teams across 30 countries.</div>
        <div className="project-tags">
          <span className="tag">React</span>
          <span className="tag">TypeScript</span>
          <span className="tag purple">Storybook</span>
        </div>
      </div>

      <div className="project-card">
        <div className="project-num">04 ——</div>
        <div className="project-title">VaultAuth</div>
        <div className="project-desc">Zero-trust auth micro-service with OAuth 2.0, biometric support, and anomaly detection. Deployed as a standalone Docker container.</div>
        <div className="project-tags">
          <span className="tag">Go</span>
          <span className="tag purple">JWT</span>
          <span className="tag pink">OAuth 2.0</span>
        </div>
      </div>

      <div className="project-card">
        <div className="project-num">05 ——</div>
        <div className="project-title">DataMapPro</div>
        <div className="project-desc">Interactive data visualisation dashboard for enterprise clients. Custom charting engine, real-time WebSocket feeds, and export pipeline.</div>
        <div className="project-tags">
          <span className="tag">D3.js</span>
          <span className="tag">Next.js</span>
          <span className="tag purple">WebSockets</span>
        </div>
      </div>

      <div className="project-card">
        <div className="project-num">06 ——</div>
        <div className="project-title">CloudSync CLI</div>
        <div className="project-desc">Developer CLI tool for seamless multi-cloud file syncing between AWS, GCP, and Azure. 15k+ weekly npm downloads.</div>
        <div className="project-tags">
          <span className="tag">Node.js</span>
          <span className="tag pink">AWS SDK</span>
          <span className="tag purple">GCP</span>
        </div>
      </div>

    </div>
  </div>
</section>

<div className="section-divider"></div>

      {/* CONTACT */}
    <section id="contact">
  <div className="reveal">
    <p className="section-label">contact us</p>
    <h2 className="contact-glow">Let's Build<br/>Something Together</h2>
    <p className="contact-sub">
      Have a project in mind? Looking for a developer to join your team? I'd love to hear from you. Drop me a message below.
    </p>
  </div>

  <div className="contact-form reveal">
    
    <div className="form-row">
      <div className="form-field">
        <label>Your Name</label>
        <input 
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Jane Smith"
        />
      </div>

      <div className="form-field">
        <label>Email Address</label>
        <input 
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="jane@example.com"
        />
      </div>
    </div>

    <div className="form-field">
      <label>Subject</label>
      <input 
        type="text"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        placeholder="Project collaboration / Job opportunity"
      />
    </div>

    <div className="form-field">
      <label>Message</label>
      <textarea 
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Tell me about your project or idea..."
      ></textarea>
    </div>

    <button 
      className="btn btn-primary submit-btn" 
      onClick={handleSend}
    >
      Send Message →
    </button>

  </div>
</section>

{/* Footer */}
<footer>
  <div className="footer-copy">© 2026 Alex XYZ — All rights reserved.</div>
  <div className="footer-socials">
    <a href=" ">GitHub</a>
    <a href=" ">LinkedIn</a>
    <a href=" ">Twitter</a>
    <a href=" ">Resume</a>
  </div>
</footer>

    </>
  );
}

export default App;