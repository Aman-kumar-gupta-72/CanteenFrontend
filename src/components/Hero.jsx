import React from "react";

const Hero = () => {
  return (
    <section className="bg-orange-50 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 ">
        Welcome to <span className="text-orange-600">CIMAGE Canteen</span>
      </h1>
      <p className="text-gray-700 mb-8 text-lg md:text-xl">
        Delicious, fresh, and affordable meals for CIMAGE students. Order online and enjoy hassle-free dining on campus.
      </p>
      <div className="flex justify-center space-x-4">
        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
          Order Now
        </button>
        <button className="bg-white border border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
          View Menu
        </button>
      </div>
      </div>
    </section>
  );
};

export default Hero;
