import heroimg from "../assets/heroimg.png";

export default function Hero() {
  return (
    <section className="bg-bg text-text text-center py-16 px-4">

      {/* Tagline */}
      <p className="text-xs tracking-[0.3em] text-primary/70 mb-4">
        THE DIGITAL ATELIER
      </p>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-serif text-accent mb-6">
        ALHANKAR
      </h1>

      {/* Image */}
      <div className="flex justify-center mb-6">
        <img
          src={heroimg}
          alt="hero"
          className="w-full max-w-3xl rounded shadow-md"
        />
      </div>

      {/* Description */}
      <p className="text-sm text-text/70 max-w-md mx-auto mb-6">
        A revival of heritage through thread and time. Crafting modern
        silhouettes with ancient artisanal precision.
      </p>

      {/* Button */}
      <button className="bg-accent text-bg px-6 py-2 text-sm tracking-wide hover:opacity-90 transition">
        EXPLORE THE COLLECTION
      </button>
    </section>
  );
}