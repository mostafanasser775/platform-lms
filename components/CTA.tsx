'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

export const CTA = () => {
  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                <span className="block">Ready to dive in?</span>
                <span className="block text-blue-600">Start your free trial today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-500">
                Get unlimited access to all our courses for 7 days. No credit card required.
              </p>
              <motion.div
                className="mt-8 flex gap-x-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Start free trial
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </button>
              </motion.div>
            </div>
          </div>
          <div className="relative pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h3 className="text-2xl font-extrabold text-gray-900">
                Subscribe to our newsletter
              </h3>
              <p className="mt-4 text-lg text-gray-500">
                Get the latest updates about new courses and features.
              </p>
              <div className="mt-8">
                <form className="sm:flex">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};