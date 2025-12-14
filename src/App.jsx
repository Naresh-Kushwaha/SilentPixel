import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate, 
  AnimatePresence 
} from 'framer-motion';
import { 
  Camera, Video, Mail, Instagram, Twitter, ChevronDown, 
  Play, ExternalLink, Menu, X, Monitor, Aperture, Cpu, Globe, 
  Clapperboard,
  VideoIcon,
  Linkedin,
  Phone
} from 'lucide-react';

// --- UTILS & VARIANTS ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// --- COMPONENTS ---

// 1. Custom Futuristic Cursor
const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Smooth physics for the cursor
  const springConfig = { damping: 25, stiffness: 700 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ x, y }}
      className="fixed top-0 left-0 w-8 h-8 border-2 border-cyan-400 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
    >
      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm" />
    </motion.div>
  );
};

// 2. Scroll Progress Bar
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
};

// 3. Preloader Overlay
const Preloader = ({ setLoading }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 2 }}
      onAnimationComplete={() => setLoading(false)}
      className="fixed inset-0 z-[999] bg-black flex items-center justify-center flex-col"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-white tracking-widest flex items-center gap-2"
      >
        <span className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse" />
        SILENT PIXEL
      </motion.div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-1 bg-cyan-500 mt-4"
      />
    </motion.div>
  );
};

// 4. 3D Tilt Card (Refined)
const TiltCard = ({ children, className }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: useMotionTemplate`perspective(1000px) rotateY(${mouseX.get() / 25}deg) rotateX(${-mouseY.get() / 25}deg)`
      }}
      className={`relative transition-all duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

// 5. Infinite Text Marquee
const Marquee = () => {
  return (
    <div className="w-full py-12 bg-cyan-900/10 border-y border-cyan-500/20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-white/30 uppercase px-8">
            Cinematography • Photography • Editing • Color Grading • Creative Direction • 
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// 6. Navigation
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2"
        >
          <Aperture className="text-cyan-400 animate-spin-slow" />
          SILENTPIXEL
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          {['Work', 'Services', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-xs">
              {item}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden text-white cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 text-white">
              {['Work', 'Services', 'About', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-xl font-bold uppercase tracking-widest hover:text-cyan-400">
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// 7. Hero Section
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Glow Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" 
      />
      <motion.div 
         animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
         transition={{ duration: 10, repeat: Infinity, delay: 1 }}
         className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" 
      />

      <motion.div style={{ y: y1, opacity }} className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          OPEN TO WORK
        </motion.div>
        
        <div className="overflow-hidden mb-4">
          <motion.h1 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter"
          >
            VISUAL
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tighter"
          >
            REALITY
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="text-gray-400 max-w-xl mx-auto text-lg mb-10 leading-relaxed"
        >
          Crafting digital experiences through the lens of tomorrow. 
          Specializing in high-end video graphy and cinematic photography.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <button className="group relative px-8 py-4 bg-cyan-500 text-black font-bold uppercase tracking-widest overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            View Work
          </button>
        </motion.div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

// 8. Services Section (New)
const Services = () => {
  const services = [
    { icon: <Camera size={32} />, title: "Photography", desc: "Editorial, Product, and Lifestyle photography with high-end retouching." },
    { icon: <VideoIcon size={32} />, title: "Video Graphy", desc: "Professional editing, color grading, and VFX compositing." },
    { icon: <Clapperboard size={32} />, title: "Video Editing", desc: "Abstract 3D assets and motion graphics for modern brands." },
  ];

  return (
    <section id="services" className="py-32 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">SERVICES</h2>
          <div className="h-0.5 w-20 bg-cyan-500"></div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-none hover:border-cyan-500/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Aperture size={100} />
              </div>
              <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform origin-left">{s.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
              <p className="text-gray-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
// --- ABOUT COMPONENT ---
const About = () => {
  // Skill data structure
  const skills = [
    { name: "Adobe Premiere", level: 95 },
    { name: "After Effects", level: 90 },
    { name: "DaVinci Resolve", level: 85 },
    { name: "Cinema 4D", level: 75 },
    { name: "Sound Design", level: 80 },
    { name: "Unreal Engine", level: 60 },
  ];

  return (
    <section id="about" className="py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Holographic Image Frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* The Image Container */}
            <div className="relative z-10 p-2 border border-white/20 bg-white/5 backdrop-blur-sm">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />
              
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800 grayscale hover:grayscale-0 transition-all duration-500 group">
                {/* REPLACE THIS SRC WITH YOUR PHOTO */}
                <img 
                  src="https://res.cloudinary.com/dov5gbt0g/image/upload/v1765709356/pappu_raktn6.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                
                {/* Scanning Line Animation */}
                <motion.div 
                  animate={{ top: ["0%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-20 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Data Overlays */}
                <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-500">
                  <div>ID: NX-8842</div>
                  <div>STATUS: ONLINE</div>
                </div>
              </div>
            </div>

            {/* Background offset square */}
            <div className="absolute top-4 left-4 w-full h-full border border-white/10 -z-0" />
          </motion.div>

          {/* Right Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-cyan-500 font-bold tracking-widest text-xs uppercase">The Operator</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                BEHIND THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">VISUALS</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
              I’m a creative video producer and content writer passionate about storytelling through visuals and words.
               I craft engaging videos and compelling content that connect with audiences, build brand identity, and deliver meaningful
                impact across digital platforms.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-cyan-500 pl-4">
                "In a world of noise, clarity is the ultimate luxury. My mission is to cut through the static."
              </p>
            </div>

            {/* Skills "System Specs" */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">System Proficiency</h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between text-xs text-gray-500 mb-1 font-mono uppercase">
                      <span>{skill.name}</span>
                      <span className="text-cyan-500">{skill.level}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 + (index * 0.1) }}
                        className="h-full bg-cyan-500 group-hover:bg-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
               <button className="flex items-center gap-2 text-white border-b border-cyan-500 pb-1 hover:text-cyan-400 hover:border-white transition-all text-sm uppercase tracking-widest font-bold">
                  Download Resume / CV <ExternalLink size={14} />
               </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
// 9. Stats Section (New)
const Stats = () => {
  return (
    <div className="py-20 bg-cyan-900/10 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { num: "50+", label: "Clients" },
          { num: "120+", label: "Projects" },
          { num: "1", label: "Years Exp" },
          { num: "100%", label: "Satisfaction" }
        ].map((stat, i) => (
          <div key={i}>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.num}</div>
            <div className="text-cyan-500 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 10. Portfolio Grid
const Portfolio = () => {
  const projects = [
    { title: "Neon Nights", category: "Photography", color: "from-pink-600 to-purple-900", type: "photo" },
    { title: "Cyber Punk", category: "Videography", color: "from-blue-600 to-cyan-900", type: "video" },
    { title: "Urban Decay", category: "Photography", color: "from-emerald-600 to-green-900", type: "photo" },
    { title: "Future Tech", category: "Commercial", color: "from-indigo-600 to-purple-900", type: "video" },
  ];

  return (
    <section id="work" className="py-32 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-16 flex justify-between items-end"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">SELECTED WORK</h2>
            <div className="h-1 w-20 bg-cyan-500"></div>
          </div>
          <button className="hidden md:flex items-center gap-2 text-white hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm font-bold">
            View Archive <ExternalLink size={16} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <TiltCard key={index} className="group cursor-pointer">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-[500px] rounded-sm bg-gradient-to-br ${project.color} relative overflow-hidden border border-white/10`}
              >
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] pointer-events-none" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 w-full z-30">
                   <div className="flex items-center gap-2 mb-3 text-cyan-400 text-xs uppercase tracking-[0.2em] font-bold">
                      {project.type === 'video' ? <Video size={14} /> : <Camera size={14} />}
                      {project.category}
                   </div>
                   <h3 className="text-4xl font-black text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                   <div className="h-0.5 w-0 group-hover:w-full bg-cyan-500 transition-all duration-500 ease-out"></div>
                </div>

                {/* Center Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center">
                    {project.type === 'video' ? <Play className="fill-white text-white ml-1" /> : <ExternalLink className="text-white" />}
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// 11. Contact Section
const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-zinc-950 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
       
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">START A PROJECT</h2>
          <p className="text-gray-400 text-lg">Let's build something unique together.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 bg-black/50 p-8 md:p-12 border border-white/10 backdrop-blur-sm">
          {/* Info */}
          <div className="space-y-8">
             <div>
                <h3 className="text-xl font-bold text-white mb-1">Contact Info</h3>
                <p className="text-gray-500 text-sm">Always open for new opportunities.</p>
             </div>
             
             <div className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Mail className="h-5 w-5" />
<a
  href="mailto:pappukushwaha2008@gmail.com"
  className="text-cyan-400 hover:text-cyan-300 transition duration-300 hover:drop-shadow-[0_0_10px_#22d3ee]"
>
  pappukushwaha2008@gmail.com
</a>
             </div>
             <div className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <Globe className="h-5 w-5" />
<a
  href="https://silent-pixel.vercel.app/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-cyan-400 hover:underline break-all"
>
  https://silent-pixel.vercel.app/
</a>
             </div>
             <div className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
  <Phone className="h-5 w-5" />
  <a
    href="tel:+919999999999"   // replace with your real number
    className="text-cyan-400 hover:underline break-all"
  >
    +91 83840 86499
  </a>
</div>

             <div className="pt-8 flex gap-4">
  {[
    { icon: Instagram, link: "https://www.instagram.com/visualstory.16?igsh=Z213eXFqZzZzMWZy" },
    { icon: Twitter, link: "https://x.com/deadgrose63543" },
    { icon: Linkedin, link: "https://www.linkedin.com/in/deepak-k-539948340?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } // YouTube/Vimeo later
  ].map(({ icon: Icon, link }, i) => (
    <motion.a
      key={i}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5 }}
      className="p-3 border border-white/10 text-white 
                 hover:text-cyan-400 transition-colors"
    >
      <Icon size={20} />
    </motion.a>
  ))}
</div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Identity</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Coordinates</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Email Address" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transmission</label>
              <textarea rows="4" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Message content..."></textarea>
            </div>
            <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors">
              Initialize
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black py-8 border-t border-white/10 text-center relative z-10">
    <p className="text-gray-600 text-xs tracking-widest uppercase">© 2026 silentpixel VISUALS SYSTEM. ALL RIGHTS RESERVED.</p>
  </footer>
);

// --- MAIN APP ---
export default function App() {
  const [loading, setLoading] = useState(true);

  // Lock scroll when loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  return (
    <div className="bg-black min-h-screen font-sans text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700;900&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; cursor: none; }
        /* Fallback for mobile where custom cursor is hidden */
        @media (max-width: 768px) { body { cursor: auto; } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      
      <AnimatePresence>
        {loading && <Preloader setLoading={setLoading} />}
      </AnimatePresence>

      {!loading && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <Hero />
          <Marquee />
          <Services />
          <About />
          <Stats />
          <Portfolio />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}