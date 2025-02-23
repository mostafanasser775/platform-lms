'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  BookOpen, 
  LineChart, 
  Award, 
  Smartphone, 
  Video, 
  Users 
} from 'lucide-react';

const features = [
  {
    name: 'Interactive Courses',
    description: 'Engage with dynamic content and real-world projects',
    icon: BookOpen,
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics',
    icon: LineChart,
  },
  {
    name: 'Certificates',
    description: 'Earn recognized certificates upon course completion',
    icon: Award,
  },
  {
    name: 'Mobile Learning',
    description: 'Learn on the go with our mobile-friendly platform',
    icon: Smartphone,
  },
  {
    name: 'Live Sessions',
    description: 'Interactive live classes with industry experts',
    icon: Video,
  },
  {
    name: 'Community',
    description: 'Connect and learn with peers worldwide',
    icon: Users,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Our platform provides all the tools and features you need to excel in your learning journey
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={item}
              className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-6 left-6 bg-blue-100 rounded-lg p-3">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};