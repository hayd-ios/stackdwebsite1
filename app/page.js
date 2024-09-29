'use client';

import Image from "next/image";
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaShare, FaImages, FaSwipeRight, FaRocket, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdSwipeRight } from "react-icons/md";
import Logo from "./assets/s.png";
import SS1 from "./assets/ss1.png";

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-gray-900 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
    whileHover={{ scale: 1.05, y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="text-purple-400 text-4xl mb-6">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{title}</h3>
    <p className="text-gray-400 text-lg">{description}</p>
  </motion.div>
);

const TimelineItem = ({ date, content, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''} mb-8`}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="w-1/2 px-4">
        <motion.div
          className="bg-gray-900 p-6 rounded-lg shadow-lg"
          initial={{ scale: 0.8 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.2 + 0.2 }}
        >
          <h3 className="text-xl font-bold text-purple-400 mb-2">{date}</h3>
          <p className="text-gray-300">{content}</p>
        </motion.div>
      </div>
      <div className="w-8 h-8 bg-purple-500 rounded-full border-4 border-gray-800 z-10"></div>
      <div className="w-1/2 px-4"></div>
    </motion.div>
  );
};



const Timeline = () => {
  const timelineRef = useRef(null);
  const { scrollY } = useScroll();

  const opacity = useTransform(
    scrollY,
    [0, 800, 1000, 1200],  // Adjust these values based on when you want the fade to occur
    [0, 1, 1, 0]
  );

  const timelineData = [
    { date: "Early 2022", content: "Initial Idea for Stackd" },
    { date: "Mid 2022", content: "Development began, multiple revisions and kinks were ironed out." },
    { date: "Late 2024", content: "After 2 years, We are ready to launch." },
  ];

  return (
    <motion.section 
      ref={timelineRef}
      style={{ opacity }}
      className="py-20 px-6 bg-black relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 transform -translate-x-1/2"></div>
        {timelineData.map((item, index) => (
          <TimelineItem key={index} {...item} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default function Home() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 20]);
  return (
    <div className="bg-black text-white min-h-screen">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <nav className={`mx-auto max-w-6xl ${scrolled ? 'bg-black/30' : 'bg-transparent'} backdrop-blur-md rounded-full transition-all duration-300`}>
          <div className="flex justify-between items-center px-8 py-2">
            <Image src={Logo} alt="Stackd Logo" width={40} height={40} />
            <div className="flex items-center space-x-6">
              {/* <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a> */}
              <motion.button 
                className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Waitlist
              </motion.button>
            </div>
          </div>
        </nav>
      </header>

      <main ref={heroRef} className="pt-32 pb-16 px-6 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black pointer-events-none"></div>
        <motion.div 
          className="max-w-7xl mx-auto text-center relative z-10"
          style={{ y, opacity, scale, rotateX }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple-600 filter blur-3xl opacity-30 scale-y-75 transform -translate-y-4"></div>
            <motion.h1 
              className="text-8xl font-bold mb-8 metallic-text relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Share Memories. Effortlessly.
            </motion.h1>
          </div>
          <motion.p 
            className="text-md text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stackd is a photo sharing platform that allows you to share multiple photos at once. Save time and effort by stacking your photos and sharing them with your friends and family.
          </motion.p>
          <motion.button 
            className="px-10 py-4 rounded-full text-xl font-semibold transition-all duration-300 metallic-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Waitlist
          </motion.button>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      </main>

      <Timeline />

      <section className="py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 
            className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Why Choose Stackd?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<FaImages />} 
              title="Bulk Sharing" 
              description="Select and share multiple photos at once, saving you time and effort." 
            />
            <FeatureCard 
              icon={<MdSwipeRight />} 
              title="Swipe to Save" 
              description="Our intuitive swipe function makes saving photos as easy as a flick of your finger." 
            />
            <FeatureCard 
              icon={<FaShare />} 
              title="Instant Delivery" 
              description="Your stacked photos are delivered instantly to your friends and family." 
            />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-black to-purple-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FaRocket className="text-5xl text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Be the First to Experience Stackd
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join our exclusive waitlist and get early access to the future of photo sharing.
            </p>
          </motion.div>
          <motion.form 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-6 py-3 rounded-full bg-gray-800 text-white border border-purple-500/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full sm:w-auto"
              required
            />
            <button 
              type="submit" 
              className="px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 metallic-button w-full sm:w-auto"
            >
              Join Waitlist
            </button>
          </motion.form>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </section>

      <footer className="bg-black text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Image src={Logo} alt="Stackd Logo" width={40} height={40} />
              <p className="text-gray-400">Revolutionizing photo sharing with innovative solutions.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors"><FaInstagram /></a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors"><FaLinkedin /></a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors"><FaGithub /></a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Contact</h3>
              <ul className="space-y-2">
                <li><a href="mailto:support@stackd.com" className="text-gray-400 hover:text-white transition-colors">support@stackdapp.com</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">+1 (555) 123-4567</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2024 Stackd. All rights reserved.</p>
            <motion.button 
              className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 metallic-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Early Access
            </motion.button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-black pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </footer>
    </div>
  );
}