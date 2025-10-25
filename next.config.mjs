/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    basePath: "/demo",
    webpack: (config) => {
        config.module.rules.push({
            test: /\.txt$/,
            use: 'raw-loader',
        });
        return config;
    },
};

export default nextConfig;
