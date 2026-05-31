import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";

export default function Footer() {

  return (
    <footer className="bg-sidebar text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h2 className="font-serif text-3xl text-primary">
              Alhnkar
            </h2>

            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Crafted for those who appreciate
              timeless elegance, premium fabrics,
              and modern silhouettes.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-primary mb-5">
              Shop
            </h3>

            <ul className="space-y-3 text-white/70">
              <li>
                <a
                  href="/category?type=men"
                  className="hover:text-primary transition"
                >
                  Men
                </a>
              </li>

              <li>
                <a
                  href="/category?type=women"
                  className="hover:text-primary transition"
                >
                  Women
                </a>
              </li>

              <li>
                <a
                  href="/category"
                  className="hover:text-primary transition"
                >
                  New Arrivals
                </a>
              </li>

              <li>
                <a
                  href="/category"
                  className="hover:text-primary transition"
                >
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-primary mb-5">
              Support
            </h3>

            <ul className="space-y-3 text-white/70">
              <li>
                <a
                  href="/profile"
                  className="hover:text-primary transition"
                >
                  My Account
                </a>
              </li>

              <li>
                <a
                  href="/my-orders"
                  className="hover:text-primary transition"
                >
                  Track Order
                </a>
              </li>

              <li>
                <a
                  href="/faq"
                  className="hover:text-primary transition"
                >
                  FAQ
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="hover:text-primary transition"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-primary mb-5">
              Stay Updated
            </h3>

            <p className="text-white/70 text-sm mb-4">
              Get exclusive offers, new launches,
              and style inspiration.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="
                  flex-1
                  px-4
                  py-3
                  bg-white
                  text-text
                  rounded-l-xl
                  outline-none
                "
              />

              <button
                className="
                  px-5
                  bg-primary
                  text-black
                  rounded-r-xl
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Alhnkar.
            All rights reserved.
          </p>

         <div className="flex items-center gap-5">
  <a
    href="#"
    className="hover:text-primary transition text-xl"
  >
    <FaInstagram />
  </a>

  <a
    href="#"
    className="hover:text-primary transition text-xl"
  >
    <FaFacebook />
  </a>

  <a
    href="#"
    className="hover:text-primary transition text-xl"
  >
    <FaXTwitter />
  </a>

  <a
    href="mailto:support@alhnkar.com"
    className="hover:text-primary transition text-xl"
  >
    <FaEnvelope />
  </a>
</div>
        </div>
      </div>
    </footer>
  );
}