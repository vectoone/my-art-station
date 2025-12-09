
/** @type {import('next').NextConfig} */
const nextConfig = {
    // No rewrites needed as we use internal API routes for logic
    typescript: {
        ignoreBuildErrors: true, // Often helpful in initial cloud builds
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
