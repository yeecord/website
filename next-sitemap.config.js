/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://yeecord.com",
  generateRobotsTxt: true,
  exclude: ["/blog/tags/*"],
  outDir: "./out",
};
