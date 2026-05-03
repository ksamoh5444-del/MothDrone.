/**
 * Design philosophy reminder: Swiss International Style adapted for aerospace technical review rooms.
 * Keep builds deterministic and frontend-only; no server-only runtime features are required for this visualizer.
 */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing", "@react-spring/three"],
};

export default nextConfig;
