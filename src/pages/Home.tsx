import { Link } from "react-router-dom";
import Header from "@/components/ui/Header";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fff0f6]">
      {/* Custom Header */}
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="brand-title">Twirly Tails</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[#c0225e]">
            Complete Order Management System
          </h2>
          <p className="text-lg text-[#6c2d45] mb-8 max-w-xl">
            The house of the creamiest ice cream, the tastiest milkteas, fruit teas, fruity soda,
            fruity yakult is now offering unlimited samgyupsal for only ₱199.00.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
            <Link
              to="/auth"
              className="bg-[#b7285f] text-white px-6 py-3 rounded-md text-base font-semibold shadow hover:opacity-90 transition"
            >
              Get Started →
            </Link>
            <Link
              to="/about"
              className="bg-white border-2 border-[#b7285f] text-[#b7285f] px-6 py-3 rounded-md text-base font-semibold hover:bg-[#fff5f8] transition"
            >
              Learn More
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a href="https://www.facebook.com/TwirlyTailsDessertCorner/" target="_blank" rel="noreferrer">
              <FaFacebook className="text-[#b7285f] w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="https://www.instagram.com/twirlytails/?hl=en" target="_blank" rel="noreferrer">
              <FaInstagram className="text-[#b7285f] w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="https://www.foodpanda.ph/restaurant/s2xk/twirly-tails-dessert-corner-mercato-de-mactan" target="_blank" rel="noreferrer">
              <img
                src="/foodpanda.png"
                alt="Order on FoodPanda"
                className="w-10 h-10 object-contain hover:opacity-80 transition"
              />
            </a>
          </div>
        </div>

        {/* Right Content (Image Section) */}
        <div className="relative lg:w-1/2 flex justify-center">
          <img
            src="/circle.png"
            alt="Background Circle"
            className="absolute w-[300px] sm:w-[400px] lg:w-[500px] animate-pulse-slow"
          />
          <img
            src="/dessert.png"
            alt="Twirly Tails Dessert"
            className="relative w-[250px] sm:w-[300px] lg:w-[400px] drop-shadow-xl"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Twirly Tails Dessert Corner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
