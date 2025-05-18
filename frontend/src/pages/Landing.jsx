import React from "react";
import { Link } from "react-router-dom";

// Placeholder for actual icons. Consider using a library like Heroicons (e.g., ArchiveBoxIcon, UserGroupIcon, etc.)
// For demonstration, I'll use string placeholders where you'd put an <img /> or SVG component.
const IconPlaceholder = ({ name, className }) => (
  <div
    className={`flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white text-xl ${className}`}
  >
    {name.substring(0, 1).toUpperCase()} {/* Simple placeholder */}
  </div>
);

export default function LandingPageCalculator() {
  return (
    <div className="pt-14 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white selection:bg-purple-500 selection:text-white">
      {/* The Navbar component you provided would be rendered by a parent component in App.js or similar */}

      {/* Hero Section */}
      <header className="relative pt-28 pb-32 flex content-center items-center justify-center min-h-[80vh] md:min-h-[75vh]">
        {" "}
        {/* Adjusted padding-top for navbar */}
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover bg-fixed"
          style={{ backgroundImage: "url('/images/hero-calculator-bg.jpg')" }}
        >
          {" "}
          {/* Replace with a relevant, high-quality background (e.g., abstract data, subtle financial tech) */}
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-75 bg-slate-900"
          ></span>
        </div>
        <div className="container relative mx-auto px-4">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  Stop Tedious Chit Calculations.
                </span>
                <br />
                Automate Your Admin Work.
              </h1>
              <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 font-light">
                Our Chit Fund Calculator app eliminates manual monthly
                breakdowns. Save countless hours, ensure 100% accuracy, and
                effortlessly keep your members informed.
              </p>
              <Link
                to="/signup" // Assuming signup is the primary CTA for new users
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Join now
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </header>

      {/* Pain Points Section */}
      <section className="py-20 md:py-28 bg-slate-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Chit Admin Grind: Sound Familiar?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              You're dedicated to your members, but the manual backend work can
              be overwhelming.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Hours on Spreadsheets",
                description:
                  "Manually calculating intricate breakdowns for every member, every single month.",
                icon: "SP",
              }, // Replace with actual icon like <SpreadsheetIcon />
              {
                title: "Risk of Costly Errors",
                description:
                  "One small slip in manual math can lead to financial discrepancies and lost trust.",
                icon: "ER",
              }, // <AlertTriangleIcon />
              {
                title: "Communication Bottlenecks",
                description:
                  "The tedious task of individually informing each customer about their specific dues and payouts.",
                icon: "CB",
              }, // <ChatBubbleIcon />
              {
                title: "Admin Burnout",
                description:
                  "Drowning in repetitive tasks, leaving no room to focus on member relations or growth.",
                icon: "BO",
              }, // <TiredFaceIcon />
            ].map((pain, index) => (
              <div
                key={index}
                className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-pink-500/50 transition-colors duration-300"
              >
                <div className="flex justify-center mb-4">
                  {/* Replace IconPlaceholder with your actual SVG icon component */}
                  <IconPlaceholder
                    name={pain.icon}
                    className="bg-pink-600 group-hover:bg-pink-500 transition-colors duration-300 !w-10 !h-10 !text-base"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {pain.title}
                </h3>
                <p className="text-gray-400 text-center text-sm leading-relaxed">
                  {pain.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution/Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-slate-900/60 via-purple-900/70 to-slate-900/60 backdrop-blur-md">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Introducing{" "}
              <span className="text-purple-400">ChitSmart Calc</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Your dedicated assistant for effortless and accurate chit fund
              calculations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: "AC", // <CalculatorIcon /> or <AutomationIcon />
                title: "Automated Breakdowns",
                description:
                  "Input chit details once. Our app handles all monthly calculations precisely for every member.",
                gradient: "from-purple-600 to-indigo-600",
              },
              {
                icon: "LU", // <UserSearchIcon /> or <FindIcon />
                title: "Instant Member Look-up",
                description:
                  "Quickly find any customer's specific breakdown and payment status. No more sifting through records.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: "EA", // <ShieldCheckIcon /> or <AccuracyIcon />
                title: "Error-Proof Accuracy",
                description:
                  "Eliminate human error. Our validated algorithms ensure every calculation is correct, building member trust.",
                gradient: "from-sky-500 to-cyan-500",
              },
              {
                icon: "TS", // <ClockFastForwardIcon /> or <RocketIcon />
                title: "Time-Saving Efficiency",
                description:
                  "Drastically reduce your admin time. Tasks that took hours can now be done in minutes.",
                gradient: "from-emerald-500 to-green-500",
              },
              {
                icon: "SC", // <ChatIcon /> or <ShareIcon />
                title: "Simplified Communication",
                description:
                  "Easily access and share up-to-date financial information with your members whenever needed.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: "FG", // <TrendingUpIcon /> or <LightbulbIcon />
                title: "Focus on Growth",
                description:
                  "Free up your valuable time from mundane tasks to manage your business and member relations effectively.",
                gradient: "from-teal-500 to-cyan-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-slate-800 p-8 rounded-xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group border border-slate-700 hover:border-purple-500`}
              >
                <div
                  className={`mb-6 p-3 inline-flex items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:shadow-purple-400/50 transition-shadow duration-300`}
                >
                  {/* Replace IconPlaceholder with your actual SVG icon component */}
                  <IconPlaceholder
                    name={feature.icon}
                    className={`!bg-transparent !text-2xl`}
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-slate-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in 3 Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {[
              {
                step: "01",
                title: "Set Up Your Chits",
                description:
                  "Easily define your chit group parameters, auction rules, and add your members.",
                icon: "S1",
              }, // <SettingsIcon />
              {
                step: "02",
                title: "Automate Calculations",
                description:
                  "Our system automatically generates all monthly dues, auction payouts, and member balances.",
                icon: "S2",
              }, // <PlayCircleIcon />
              {
                step: "03",
                title: "Access & Inform",
                description:
                  "Instantly view any member's status and provide them with clear, accurate updates.",
                icon: "S3",
              }, // <InformationCircleIcon />
            ].map((item, index) => (
              <div key={index} className="relative p-6">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-purple-600/30 opacity-70 z-0">
                  {item.step}
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  {/* Replace IconPlaceholder */}
                  <IconPlaceholder
                    name={item.icon}
                    className="bg-purple-500 mb-4 !w-16 !h-16 !text-2xl"
                  />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="relative py-20 md:py-32">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/cta-calculator-bg.jpg')" }}
        >
          {" "}
          {/* Replace with a subtle, inspiring background for calculator app */}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/80 to-slate-900/10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-slate-800/80 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-2xl border border-slate-700">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Revolutionize Your Chit Fund Management?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Stop drowning in manual calculations. Embrace the efficiency of{" "}
              <span className="font-semibold text-purple-300">
                ChitSmart Calc
              </span>{" "}
              and give your chit fund business the smart upgrade it truly
              deserves.
            </p>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Sign Up
            </Link>
            <p className="mt-6 text-sm text-gray-400">
              Join fellow chit fund admins embracing effortless management.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <div className="mb-4">
            <Link
              to="/"
              className="mx-2 hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            {/* You might want to add a link to a more detailed features page or pricing */}
            <Link
              to="/features-calculator"
              className="mx-2 hover:text-purple-400 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/privacy"
              className="mx-2 hover:text-purple-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="mx-2 hover:text-purple-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MyApp (ChitSmart Calc). All rights
            reserved.
          </p>
          <p className="text-xs mt-1">
            Designed to make your chit fund admin life easier.
          </p>
        </div>
      </footer>
    </div>
  );
}
