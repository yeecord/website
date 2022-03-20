const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
	title: 'YEE式機器龍',
	tagline: '沒有了Rythm，你還是可以快速的建立優質的中文Discord伺服器，我們是能夠超越Rythm更好的Discord音樂機器人，使用我讓Discord不再只是聊天平台！',
	url: 'https://yeecord.com',
	baseUrl: '/',
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'https://cdn.yeecord.com/img/logo_128x128.png',
	organizationName: 'Yeecord',
	projectName: 'YEE式機器龍',
	trailingSlash: true,
	
	i18n: {
		defaultLocale: 'zh-Hant',
		locales: ['zh-Hant']
	},
	
	presets: [
		[
			'@docusaurus/preset-classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				sitemap: {
					changefreq: 'daily',
					priority: 0.7
				},
				googleAnalytics: {
					trackingID: 'UA-118349579-3',
					anonymizeIP: false
				},
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					sidebarCollapsed: false,
					sidebarCollapsible: true
				},
				blog: {
					blogTitle: "部落格",
					blogDescription: "YEE式機器龍各種用肝和 ❤️ 製作的部落格",
					blogSidebarTitle: "推薦文章",
					postsPerPage: 5,
					showReadingTime: true,
					feedOptions: {
						type: "all",
						copyright: `YEE式機器龍 © 2019 ~ ${new Date().getFullYear()}`
					}
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],
	
	/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
	themeConfig: ({
		metadata: [
			{ name: "og:image", content: "https://cdn.yeecord.com/img/branding.png"},
			{ name: "twitter:card", content: "summary_large_image"}
		],
		colorMode: {
			defaultMode: "dark",
			disableSwitch: true
		},
		navbar: {
			title: 'YEE式機器龍',
			logo: {
				alt: 'YEE式機器龍 Logo',
				src: 'https://cdn.yeecord.com/img/logo_128x128.png',
			},
			items: [
				{
					type: 'doc',
					docId: 'intro',
					position: 'left',
					label: '使用教學',
				},
				{to: '/docs/faq/', label: '常見問題', position: 'left'},
				{to: '/blog/', label: '部落格', position: 'left'},
				{
					href: "https://yeecord.com/link",
					label: "邀請機器人",
					position: "right",
				},
				{
					href: "https://discord.gg/yeecord",
					label: "Discord",
					position: "right"
				},
				{
					href: 'https://github.com/Gary50613/yeecord-project',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: '連結',
					items: [
						{
							label: '入門',
							to: '/docs/intro/',
						},
						{
							label: '部落格',
							to: '/blog/',
						},
						{
							label: '隱私權聲明',
							to: '/privacy/'
						},
						{
							label: '使用條款',
							to: '/terms/'
						},
					],
				},
				{
					title: '社群',
					items: [
						{
							label: 'Discord',
							href: 'https://discord.gg/yeecord',
						},
					],
				},
				{
					title: '更多',
					items: [
						{
							label: '邀請機器人',
							href: 'https://yeecord.com/link'
						},
						{
							label: 'GitHub',
							href: 'https://github.com/Gary50613/yeecord-project',
						},
						{
							label: "Patreon",
							href: "https://www.patreon.com/yeecord"
						},
						{
							label: "top.gg",
							href: "https://yeecord.com/topgg/"
						}
					],
				},
			],
			copyright: `YEE式機器龍 © 2019 ~ ${new Date().getFullYear()}`,
		},
		prism: {
			defaultLanguage: "zh-tw",
			theme: darkCodeTheme,
			darkTheme: darkCodeTheme,
		},
	}),
});
