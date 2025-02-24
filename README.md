# LMS Platform

## Overview
The **LMS Platform** is a full-featured Learning Management System that allows users to browse, purchase, and access courses. Admins can manage courses, handle purchases, and process refunds. The platform is designed for scalability, security, and seamless user experience.

## Features
- **User Roles:** Admins and users with different permissions.
- **Course Purchase System:** Users can browse and buy courses; access is granted only after purchase.
- **Course & Lesson Management:** Courses contain sections, and sections contain lessons with video content.
- **Video Playback & Progress Tracking:** Users can watch lessons using React-Player, and progress is tracked automatically.
- **Admin Panel:** Allows course uploads, refunds, and content organization.
- **Refund System:** Admins can revoke access and process refunds.
- **Secure Authentication:** User authentication via Clerk.
- **Responsive UI:** Built with TailwindCSS and HeroUI.

## Tech Stack
- **Frontend:** Next.js, React, HeroUI, TailwindCSS
- **Backend:** Drizzle ORM
- **Database:** PostgreSQL / MySQL
- **Authentication:** Clerk
- **Payments:** Stripe
- **Media Handling:** Cloudinary (videos), ImageKit (images)
- **Drag & Drop:** Dnd-Kit

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/lms-platform.git
   cd lms-platform
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```sh
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_key
   DATABASE_URL=your_database_url
   CLOUDINARY_URL=your_cloudinary_url
   IMAGEKIT_PUBLIC_KEY=your_imagekit_key
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Access the platform at `http://localhost:3000`

## Usage
- Users can **browse courses**, purchase them, and access content.
- Admins can **upload courses**, manage content, and issue **refunds**.
- Lessons include **video playback**, and user progress is **tracked automatically**.

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License.

