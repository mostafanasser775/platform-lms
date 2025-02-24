# LMS Platform

## Overview

## 🌐 Live Demo
🚀 **Check out the LMS Platform in action:**  
🔗 [LMS Platform – Live Demo](https://platform-lms.vercel.app/)

The **LMS Platform** is a comprehensive Learning Management System designed to facilitate online education. It allows **users** to browse, purchase, and access courses, while **admins** can manage course content, handle purchases, and process refunds. The platform ensures **scalability, security, and a seamless learning experience**.

## Features
- **User Roles:** Admins and users with role-based access control.
- **Course Management:** Courses consist of sections, and each section contains lessons with video content.
- **Purchase & Access Control:** Users can purchase courses; access is granted only after a successful transaction.
- **Video Playback & Tracking:** Lessons include integrated video playback using React-Player, with automatic progress tracking.
- **Refund System:** Admins can issue refunds, revoking access while ensuring users receive their payment back.
- **Authentication & Security:** User authentication powered by Clerk for seamless and secure access control.
- **Responsive UI & Drag-and-Drop Support:** Built with TailwindCSS, HeroUI, and Dnd-Kit for modern and interactive design.

## Tech Stack
- **Frontend:** Next.js, React, HeroUI, TailwindCSS
- **Backend:** Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** Clerk
- **Payments:** Stripe (for checkout and refunds)
- **Media Management:** Cloudinary (videos), ImageKit (images)
- **Drag & Drop Support:** Dnd-Kit

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/mostafanasser775/platform-lms.git
   cd platform-lms
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (`.env` file):
   ```sh
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_key
   DATABASE_URL=your_database_url
   CLOUDINARY_URL=your_cloudinary_url
   IMAGEKIT_PUBLIC_KEY=your_imagekit_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser to access the platform.

## Usage
- **Users:** Browse, purchase, and access courses with structured lessons.
- **Admins:** Upload and manage courses, process refunds, and control user access.
- **Lesson Interaction:** Watch video lessons with **React-Player**, and track progress automatically.

## Contributing
Contributions are welcome! Feel free to submit pull requests or open issues.

## License
This project is licensed under the **MIT License**.

