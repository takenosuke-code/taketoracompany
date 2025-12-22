/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'raemfaxgstoezqgbtdry.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable static exports for better performance
  // You can remove this if you need server-side features
}

module.exports = nextConfig
