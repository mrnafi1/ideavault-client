import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slideData = [
  {
    id: 1,
    title: "Turn Your Ideas Into Reality",
    subtitle: "Share your startup concepts with a global community of innovators and get real feedback.",
    cta: "Explore Ideas",
    ctaLink: "/ideas",
    badge: "🚀 New Ideas Daily",
    bg: "from-indigo-900 via-primary-800 to-primary-700",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Discover Trending Startups",
    subtitle: "Browse the most upvoted and discussed startup ideas across Tech, AI, Health, and more.",
    cta: "See Trending",
    ctaLink: "/ideas",
    badge: "🔥 Trending This Week",
    bg: "from-violet-900 via-purple-800 to-indigo-700",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Collaborate & Validate Together",
    subtitle: "Comment, give feedback, and help fellow founders refine their ideas before building.",
    cta: "Submit Your Idea",
    ctaLink: "/add-idea",
    badge: "💡 Join 12K+ Innovators",
    bg: "from-cyan-900 via-teal-800 to-emerald-700",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
  },
];

const Banner = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="banner-swiper"
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative min-h-[90vh] bg-gradient-to-br ${slide.bg} flex items-center overflow-hidden`}>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute top-10 right-10 w-72 h-72 bg-white opacity-5 rounded-full" />
              <div className="absolute bottom-10 left-10 w-96 h-96 bg-white opacity-5 rounded-full" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
                <div className="max-w-2xl">
                  <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                    {slide.badge}
                  </span>
                  <h1 className="text-5xl sm:text-6xl font-heading font-extrabold text-white leading-tight mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={slide.ctaLink}
                      className="bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 text-base shadow-lg"
                    >
                      {slide.cta} →
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white/15 backdrop-blur hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/30 transition-all duration-200 text-base"
                    >
                      Join Free
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .banner-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .banner-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 28px;
          border-radius: 5px;
        }
        .banner-swiper .swiper-button-next,
        .banner-swiper .swiper-button-prev {
          color: white;
          background: rgba(255,255,255,0.15);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        .banner-swiper .swiper-button-next:after,
        .banner-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};






export default Banner;