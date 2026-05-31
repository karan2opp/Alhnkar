import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import img1 from "../assets/img1.jpg"
import img2 from "../assets/img2.jpg"
import img3 from "../assets/img3.jpg"
import img4 from "../assets/img4.jpg"

export default function InfiniteSlider() {
  const images = [
    { id: 1, url: img1 },
    { id: 2, url: img2 },
    { id: 3, url: img3 },
    { id: 4, url: img4 },
  ];

  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const duplicatedImages = [...images, ...images, ...images];

  // Calculate total width (each image + gap)
  const imageWidth = 320; // w-80 = 320px
  const gap = 24; // gap-6 = 24px
  const totalWidth = duplicatedImages.length * (imageWidth + gap);

  return (
    <div className=" overflow-hidden mx-auto w-[80%] p-8">
      <motion.div
        ref={containerRef}
        className="flex gap-6"
        animate={{ x: -totalWidth / 3 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          paused: isPaused
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedImages.map((img, idx) => (
          <motion.div
            key={idx}
            className="flex-shrink-0 w-80 h-64 group cursor-pointer"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-full overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow">
              <img
                src={img.url}
                alt="product"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}