const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
	title: 'YEE式機器龍',
	tagline: '沒有了Rythm，你還是可以快速的建立優質的中文 Discord 伺服器。',
	url: 'https://docs.yeecord.co',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/logo.png',
	organizationName: 'Gary50613',
	projectName: 'Yeecord',
	
	presets: [
		[
			'@docusaurus/preset-classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					sidebarCollapsed: false,
					sidebarCollapsible: true
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],
	
	/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
	themeConfig: ({
		colorMode: {
			defaultMode: "dark",
			disableSwitch: true
		},
		navbar: {
			title: 'YEE式機器龍',
			logo: {
				alt: 'YEE式機器龍 Logo',
				src: './img/logo.png',
			},
			items: [
				{
					type: 'doc',
					docId: 'intro',
					position: 'left',
					label: '使用教學',
				},
				{to: '/blog', label: '部落格', position: 'left'},
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
							to: '/docs/intro',
						},
						{
							label: '部落格',
							to: '/blog',
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
							href: 'https://invite.yeecord.co/'
						},
						{
							label: 'GitHub',
							href: 'https://github.com/Gary50613/yeecord-project',
						},
						{
							label: "Patreon",
							href: "https://www.patreon.com/yeecord"
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
