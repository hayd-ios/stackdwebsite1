'use client';

import Image from "next/image";
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaShare, FaImages, FaRocket, FaApple } from 'react-icons/fa';
import { MdSwipeRight } from "react-icons/md";
import SS1 from "./assets/1.jpg";
import SS2 from "./assets/2.jpg";
import SS3 from "./assets/3.jpg";
import Logo from "./assets/logo.png";
const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-gray-900/50 p-8 rounded-3xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-lg"
    whileHover={{ scale: 1.05, y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="text-purple-400 text-4xl mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">{title}</h3>
    <p className="text-gray-300 text-lg">{description}</p>
  </motion.div>
);

const AppStoreButton = ({ className }) => (
  <motion.a
    href="https://apps.apple.com/gb/app/stackd-bulk-image-sharing/id6736886196"
    className={`inline-flex items-center px-6 py-3 rounded-full text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <FaApple className="mr-2 text-xl" />
    <span className="font-semibold">Download on App Store</span>
  </motion.a>
);

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

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <nav className={`mx-auto max-w-6xl ${scrolled ? 'bg-gray-950/70' : 'bg-transparent'} backdrop-blur-md rounded-full transition-all duration-300 py-2`}>
          <div className="flex justify-between items-center px-8 py-2">
            <Image src={Logo} alt="Stackd Logo" width={100} height={40} />
            <AppStoreButton className="text-sm" />
          </div>
        </nav>
      </header>

      <main ref={heroRef} className="pt-32 pb-16 px-6 min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto text-center relative z-10"
          style={{ y, opacity, scale }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Share Memories. Effortlessly.
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stackd is a photo sharing platform that allows you to share multiple photos at once. Save time and effort by stacking your photos and sharing them with your friends and family.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AppStoreButton className="text-xl" />
          </motion.div>
        </motion.div>
      </main>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-auto md:h-[80vh]">
            {[SS1, SS2, SS3].map((src, index) => (
              <div
                key={index}
                // initial={{ opacity: 0, y: 20 }}
                // whileInView={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.5, delay: index * 0.1 }}
                // viewport={{ once: true }}
                className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image 
                  src={src} 
                  alt={`Stackd Screenshot ${index + 1}`} 
                  layout="fill" 
                  objectFit="contain" 
                  className="transition-transform duration-300 hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 
            className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500"
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
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FaRocket className="text-5xl text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
              Experience Stackd Now
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Download Stackd from the App Store and start sharing your memories effortlessly.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AppStoreButton className="text-lg" />
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-950/50 backdrop-blur-lg text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center">
            <div className="space-y-4">
              <Image src={Logo} alt="Stackd Logo" width={100} height={40} />
              <p className="text-gray-400">Share, Swipe, Save.</p>
            </div>
            
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Stackd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}