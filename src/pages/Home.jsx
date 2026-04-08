import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, MapPin, Activity, Settings, Users, ArrowRight, Target, Eye, Cpu, MonitorPlay, Infinity } from 'lucide-react';
import ThreeCanvas from '../components/ThreeCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const mainRef = useRef();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects_showcase"));
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        setProjects(list);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Fade in text effects
      const textRevealElements = gsap.utils.toArray('.reveal-text');
      textRevealElements.forEach((el) => {
        gsap.fromTo(el, 
          { y: 50, opacity: 0 },
          { 
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );
      });

      // Counters
      const counters = gsap.utils.toArray('.stat-counter');
      counters.forEach((counter) => {
        gsap.fromTo(counter, 
          { innerHTML: 0 }, 
          {
            innerHTML: counter.dataset.target,
            duration: 2,
            snap: { innerHTML: 1 },
            scrollTrigger: { trigger: counter, start: 'top 85%' }
          }
        );
      });
      
      // Horizontal Scroll for "Work Section"
      const horizontalContainer = document.querySelector('.horizontal-scroll-container');
      if (horizontalContainer) {
        gsap.to(horizontalContainer, {
          x: () => -(horizontalContainer.scrollWidth - window.innerWidth) + "px",
          ease: "none",
          scrollTrigger: {
            trigger: "#work-section",
            start: "top top",
            end: () => "+=" + horizontalContainer.scrollWidth,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }
      
      // Fade canvas out exactly after Work Section (trigged perfectly because it's defined after the pin)
      gsap.to('#canvas-container', {
        opacity: 0.15, 
        filter: 'blur(5px)',
        ease: 'none',
        scrollTrigger: {
          trigger: '#facts-section',
          start: 'top bottom', // Executes genuinely when facts-section hits the bottom of the viewport
          end: 'top center',
          scrub: 1,
        }
      });
      
      // Crucial: after we construct the new pinned scrub timeline (which changes vertical heights),
      // we must force GSAP to refresh all external ScrollTriggers (like the 3D model)
      setTimeout(() => ScrollTrigger.refresh(), 100);

    }, mainRef);

    return () => ctx.revert();
  }, [projects]); // Re-run GSAP when projects load

  return (
    <div ref={mainRef} className="portfolio-wrapper">
      <ThreeCanvas />

      <Navbar />

      {/* SECTION: Hero */}
      <section id="hero-section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%' }}>
        <h1 className="reveal-text text-gradient" style={{ fontSize: '5rem', maxWidth: '700px', marginBottom: '20px' }}>
          Centre for Extended Reality
        </h1>
        <p className="reveal-text" style={{ fontSize: '1.5rem', maxWidth: '500px', color: '#333' }}>
          Shaping the future of immersive computing through AR, VR, and mixed environments.
        </p>
        <div className="reveal-text" style={{ marginTop: '30px' }}>
          <button className="btn-primary" onClick={() => document.getElementById('mission-section').scrollIntoView({ behavior: 'smooth' })}>
            Explore Our Vision <ChevronRight size={20} style={{marginLeft: '8px'}} />
          </button>
        </div>
      </section>

      {/* SECTION: Mission & Vision */}
      <section id="mission-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 10%', background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.95))' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', width: '100%' }}>
          
          <div className="glass-panel text-content reveal-text" style={{ padding: '60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Target size={48} color="var(--accent-color)" />
            <h2 className="text-gradient" style={{ fontSize: '2.5rem' }}>Our Mission</h2>
            <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.6 }}>
              To empower students, researchers, and industry leaders by providing cutting-edge infrastructure and expertise in spatial computing. We strive to solve real-world problems through multidisciplinary technical innovation and hands-on learning in AR, VR, and MR.
            </p>
          </div>

          <div className="glass-panel text-content reveal-text" style={{ padding: '60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Eye size={48} color="var(--accent-color)" />
            <h2 className="text-gradient" style={{ fontSize: '2.5rem' }}>Our Vision</h2>
            <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.6 }}>
              To be a globally recognized hub for extended reality research and development, bridging the gap between imaginative concepts and accessible digital realities. We envision a future where spatial interfaces seamlessly augment human intellect and capabilities.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION: Fields of Work (Horizontal Scroll) */}
      <section id="work-section" style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: 'transparent' }}>
        <h2 className="reveal-text text-gradient" style={{ fontSize: '3rem', position: 'absolute', top: '10%', left: '10%', zIndex: 2 }}>Fields of Work</h2>
        
        <div className="horizontal-scroll-container" style={{ display: 'flex', width: '400vw', height: '100%', alignItems: 'center', paddingLeft: '10vw' }}>
          
          <div className="glass-panel" style={{ width: '70vw', height: '50vh', flexShrink: 0, marginRight: '10vw', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MonitorPlay size={64} color="var(--accent-color)" style={{ marginBottom: '30px' }} />
            <h3 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Virtual Reality (VR)</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Creating fully immersive digital environments for training, simulation, and entertainment using state-of-the-art headsets.</p>
          </div>
          
          <div className="glass-panel" style={{ width: '70vw', height: '50vh', flexShrink: 0, marginRight: '10vw', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Eye size={64} color="var(--accent-color)" style={{ marginBottom: '30px' }} />
            <h3 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Augmented Reality (AR)</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Overlaying dynamic digital information onto the physical world, enhancing situational awareness and interactivity.</p>
          </div>
          
          <div className="glass-panel" style={{ width: '70vw', height: '50vh', flexShrink: 0, marginRight: '10vw', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Infinity size={64} color="var(--accent-color)" style={{ marginBottom: '30px' }} />
            <h3 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Mixed Reality (MR)</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Blending physical and digital worlds where physical and digital objects co-exist and interact in real-time.</p>
          </div>
          
          <div className="glass-panel" style={{ width: '70vw', height: '50vh', flexShrink: 0, marginRight: '20vw', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Cpu size={64} color="var(--accent-color)" style={{ marginBottom: '30px' }} />
            <h3 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Spatial Tracking</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Advanced algorithmic research into inside-out tracking, hand tracking, and spatial mapping utilizing neural networks.</p>
          </div>
          
        </div>
      </section>

      {/* SECTION: Facts / Stats */}
      <section id="facts-section" style={{ padding: '100px 10%', display: 'flex', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap', background: 'transparent' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
          <Activity size={40} color="var(--accent-color)" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '4rem', margin: 0 }} className="stat-counter" data-target="150">0</h3>
          <p>Projects Completed</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
          <Users size={40} color="var(--accent-color)" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '4rem', margin: 0 }} className="stat-counter" data-target="45">0</h3>
          <p>Industry Partners</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
          <Settings size={40} color="var(--accent-color)" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '4rem', margin: 0 }} className="stat-counter" data-target="12">0</h3>
          <p>Active Patents</p>
        </div>
      </section>

      {/* SECTION: Projects */}
      <section id="projects-section" style={{ padding: '100px 10%', background: 'transparent' }}>
        <h2 className="reveal-text text-gradient" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '60px' }}>Ongoing Innovations</h2>
        
        {projects.length === 0 ? (
           <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No projects available yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {projects.map((project) => (
              <div key={project.id} className="glass-panel reveal-text" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  height: '200px', 
                  backgroundColor: 'var(--accent-color)', 
                  opacity: project.imageUrl ? 1 : 0.2,
                  backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
                <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '10px' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', flex: 1 }}>{project.description}</p>
                  
                  {project.repoLink && (
                    <a href={project.repoLink} target="_blank" rel="noreferrer" style={{ 
                      display: 'inline-flex', alignItems: 'center', color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none', marginTop: '20px' 
                    }}>
                      View Repository <ArrowRight size={16} style={{marginLeft:'8px'}}/>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION: Collaborators (Marquee) */}
      <section id="collaborators-section" style={{ padding: '60px 0', backgroundColor: 'rgba(0, 115, 103, 0.85)', backdropFilter: 'blur(5px)', color: '#fff', overflow: 'hidden' }}>
        <h3 style={{ textAlign: 'center', color: '#fff', marginBottom: '40px' }} className="reveal-text">Supported By Industry Leaders</h3>
        <div style={{ display: 'flex', width: '200%', animation: 'marquee 15s linear infinite' }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ flex: 1, whiteSpace: 'nowrap', fontSize: '1.5rem', fontWeight: 600, opacity: 0.7 }}>
              PARTNER CO. {i} 
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee { 
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}} />
      </section>

      {/* SECTION: Management Body */}
      <section id="management-section" style={{ padding: '100px 10%', background: 'transparent' }}>
        <h2 className="reveal-text text-gradient" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '60px' }}>Leadership & Engineering</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
          {[
            { role: 'Assistant Director', name: 'Dr. Jane Smith' },
            { role: 'Project Engineer', name: 'John Doe' },
            { role: 'Technical Assistant', name: 'Alex Wong' }
          ].map((member, i) => (
            <div key={i} className="glass-panel reveal-text" style={{ padding: '40px', width: '300px', textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ddd', margin: '0 auto 20px' }}></div>
              <h3>{member.name}</h3>
              <p style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Location & Lab */}
      <section id="location-section" style={{ padding: '100px 10%', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '50px' }}>
        <div className="reveal-text" style={{ flex: 1, minWidth: '300px' }}>
          <h2 className="text-gradient" style={{ fontSize: '3rem' }}>Our Laboratory</h2>
          <p>
            Nestled inside the core technology block, our facility boasts world-class VR treadmills, haptic feedback suits, and high-fidelity rendering clusters.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', fontWeight: 600 }}>
            <MapPin color="var(--accent-color)" /> Tech Park, Innovation Block 4
          </div>
        </div>
        <div className="glass-panel reveal-text" style={{ flex: 1, minWidth: '300px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Static Map Placeholder, could be an embedded iframe */}
          <h3 style={{ color: 'var(--accent-color)' }}>Interactive 3D Map Loading...</h3>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;