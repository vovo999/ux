const withPlugins = require('next-compose-plugins');

const remarkPlugins = [
  require('remark-autolink-headings'),
  require('remark-emoji'),
  require('remark-images'),
  require('remark-slug'),
  require('remark-unwrap-images'),
];

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
  },
});

module.exports = withPlugins([withMDX], {
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    jsconfigPaths: true,
  },
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/' },
      '/getting-started': { page: '/' },
    };
  },
});
