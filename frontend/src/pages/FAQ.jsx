import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is the Student Activity Platform?",
      answer: "The Student Activity Platform is a comprehensive digital solution designed to help students track their academic journey, manage activities, earn certificates, and build impressive portfolios. It provides tools for students, faculty, and administrators to streamline activity management and achievement recognition."
    },
    {
      question: "How do I get started as a student?",
      answer: "Getting started is easy! Simply click on 'Get Started' or 'Student Sign In' on the homepage, create your account with your institutional email, and complete your profile. Once registered, you can immediately start tracking activities, uploading certificates, and building your portfolio."
    },
    {
      question: "Can faculty members use this platform?",
      answer: "Yes! Faculty members have dedicated access through the Faculty Portal. They can monitor student progress, approve activities, provide guidance, and access analytics to better support their students' academic journey."
    },
    {
      question: "What types of activities can I track?",
      answer: "You can track a wide range of activities including academic achievements, extracurricular activities, internships, workshops, competitions, volunteer work, research projects, and any other activities that contribute to your personal and professional development."
    },
    {
      question: "How are certificates verified?",
      answer: "Certificates uploaded to the platform undergo a verification process. Faculty members and administrators review and approve certificates to ensure their authenticity. Once verified, certificates are added to your official portfolio."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely! We take data security and privacy very seriously. All data is encrypted and stored securely. Only authorized users (you, your faculty advisors, and administrators) have access to your information. We comply with all relevant data protection regulations."
    },
    {
      question: "Can I export my portfolio?",
      answer: "Yes, you can export your complete portfolio in various formats including PDF and digital shareable links. This makes it easy to share your achievements with potential employers, graduate schools, or other institutions."
    },
    {
      question: "How do administrators use the platform?",
      answer: "Administrators have access to comprehensive tools for managing users, generating reports, monitoring system health, and configuring platform settings. They can oversee all activities and ensure smooth operation across the institution."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, the platform is web-based and optimized for mobile browsers. A dedicated mobile app is in development and will be available soon for both iOS and Android devices."
    },
    {
      question: "How can I get technical support?",
      answer: "Technical support is available through multiple channels. You can use the Help Center, email our support team, or contact your institution's IT department. We also provide comprehensive documentation and video tutorials."
    },
    {
      question: "Can I customize my profile and portfolio?",
      answer: "Yes! You can fully customize your profile with personal information, photos, bio, and achievements. Your portfolio can be organized into different sections and customized to highlight your strengths and accomplishments."
    },
    {
      question: "What analytics are available to faculty?",
      answer: "Faculty members have access to detailed analytics including student progress tracking, activity trends, engagement metrics, and performance insights. These analytics help faculty provide better guidance and support."
    },
    {
      question: "How are internships managed through the platform?",
      answer: "The platform includes a dedicated internship portal where students can find opportunities, submit applications, track progress, and document their experiences. Faculty can review and approve internship completions."
    },
    {
      question: "Can institutions customize the platform?",
      answer: "Yes, institutions can customize various aspects of the platform including branding, activity categories, approval workflows, and reporting formats to match their specific requirements and workflows."
    },
    {
      question: "What happens to my data after graduation?",
      answer: "After graduation, your account transitions to an alumni status. You retain access to your portfolio and can continue to use it for professional purposes. Your data remains secure and accessible for future reference."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 shadow-lg animate-pulse-slow group-hover:shadow-xl transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">Student Activity Platform</span>
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
            Frequently Asked <span className="text-indigo-600">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform. Can't find what you're looking for? 
            Feel free to contact our support team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 pl-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <button className="bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow text-sm font-medium text-gray-700 hover:text-indigo-600">
            Getting Started
          </button>
          <button className="bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow text-sm font-medium text-gray-700 hover:text-indigo-600">
            Features & Tools
          </button>
          <button className="bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow text-sm font-medium text-gray-700 hover:text-indigo-600">
            Account & Privacy
          </button>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you. Get in touch with us through any of the following channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Email Support
            </button>
            <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
              Live Chat
            </button>
            <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-400 transition-colors">
              Help Center
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
