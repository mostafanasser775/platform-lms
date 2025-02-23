/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Edu Nexus Your Future with</span>
            <span className="block text-blue-600">Modern Online Learning</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Access world-class education from anywhere. Learn at your own pace with expert-led courses
            and join a community of lifelong learners.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link href={'/sign-in'}>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </motion.button>
            </Link>
            <Link href={'/all-courses'}>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
                Explore Courses
              </button>
            </Link>

          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20"
        >
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                alt="Students learning"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};