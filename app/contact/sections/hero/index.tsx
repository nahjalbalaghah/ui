"use client";
import React from "react";
import Image from "next/image";
import Button from "@/app/components/button";
import HeroMosqueImage from "@/app/assets/images/hero-mosque.jpg";

const ContactHero = () => {
  const handleScrollToForm = () => {
    const formSection = document.getElementById("contact-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-[60vh] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          className="w-full h-full object-cover"
          src={HeroMosqueImage}
          alt="Contact Nahj al-Balagha"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/85 to-[#43896B]/20"></div>
      </div>
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjwvcGF0aD4KPC9zdmc+')] bg-repeat"></div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-24">
        <h1 className="text-4xl lg:text-6xl font-black leading-tight text-[#43896B] text-center mb-6">
          Get in Touch
        </h1>
        <p className="text-lg sm:text-2xl text-gray-700 font-semibold max-w-2xl mx-auto text-center mb-8">
          Have questions, feedback, or want to connect? We're here to help and would love to hear from you.
        </p>
        <Button variant="solid" onClick={handleScrollToForm}>
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default ContactHero; 