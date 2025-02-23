'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, BookOpen, GraduationCap, Trophy } from 'lucide-react';

const stats = [
  { id: 1, name: 'Active Students', value: '50,000+', icon: Users },
  { id: 2, name: 'Total Courses', value: '300+', icon: BookOpen },
  { id: 3, name: 'Expert Instructors', value: '100+', icon: GraduationCap },
  { id: 4, name: 'Success Rate', value: '95%', icon: Trophy },
];

export const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-blue-600" ref={ref}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-blue-500 rounded-lg p-6 text-center"
            >
              <div className="flex justify-center">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="mt-4 text-3xl font-extrabold text-white"
              >
                {stat.value}
              </motion.p>
              <p className="mt-1 text-base text-blue-100">{stat.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};