import bannerImg from "../assets/banner.png"
export default function ProductBanner() {
  return (
    <section className="px-4 md:px-8 lg:px-12 pt-6">
      <div className="relative rounded-2xl overflow-hidden min-h-[420px] flex items-center">
        <img
          src={bannerImg}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 max-w-xl px-6 md:px-12 text-white">
          <h2 className="text-3xl md:text-6xl font-serif mb-4">
            TRENDING NOW
          </h2>

          <p className="text-base md:text-xl mb-6 leading-relaxed">
            Stay ahead of the curve with our most sought-after pieces.
          </p>

          <button className="bg-bg text-text px-8 py-3 rounded-md text-sm tracking-wide hover:opacity-90 transition">
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
}