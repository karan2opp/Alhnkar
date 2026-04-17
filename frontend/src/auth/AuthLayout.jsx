export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT SIDE (Image Section) */}
      <div className="hidden md:flex relative bg-accent text-bg items-end p-10">

        <img
          src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-serif leading-tight mb-4">
            Where heritage meets the digital stitch.
          </h2>

          <p className="text-sm text-bg/70">
            The Atelier Experience
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (Form Section) */}
      <div className="bg-bg flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}