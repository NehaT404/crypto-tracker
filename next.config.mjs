/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'coin-images.coingecko.com',
                port: '',
                pathname: '/**', // Allow all paths under this domain
            },
        ],
    },
};

export default nextConfig;
