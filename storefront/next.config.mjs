/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ltyway.co.uk",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.ltyway.co.uk",
        pathname: "/uploads/**",
      },
    ],
  },
}

export default nextConfig
