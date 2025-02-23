/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "The quality of courses and instructors is exceptional. I've learned more in 3 months than I did in my entire college program.",
    author: "Alex Thompson",
    role: "Software Developer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: 2,
    content: "The platform's flexibility allowed me to learn at my own pace while working full-time. The community support is incredible!",
    author: "Maria Rodriguez",
    role: "UX Designer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: 3,
    content: "As an instructor, I'm impressed by the platform's tools and the engagement from students. It's a win-win for everyone.",
    author: "Dr. James Wilson",
    role: "Data Science Instructor",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
];

export const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-white py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Students Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Don&apos;t just take our word for it - hear from our community
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="absolute -top-4 -left-4">
                <Quote className="h-8 w-8 text-blue-500" />
              </div>
              <blockquote className="mt-8">
                <p className="text-lg text-gray-600 italic">{testimonial.content}</p>
              </blockquote>
              <div className="mt-6 flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.author}
                />
                <div className="ml-4">
                  <div className="text-base font-medium text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};