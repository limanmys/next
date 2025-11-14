/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  allowedDevOrigins: ["*", "liman.io", "*.liman.io", "10.0.0.10"]
}

export default nextConfig
