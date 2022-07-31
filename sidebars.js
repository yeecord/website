/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
	yeecordSidebar: [
		'index',
		'migrate-to-v4',
		{
			type: 'category',
			label: '指令',
			link: { type: 'doc', id: 'commands/index' },
			items: [
				'commands/index',
				'commands/list',
				{
					type: 'category',
					label: '指令參照',
					link: { type: 'generated-index' },
					items: [
						'commands/reference/general',
						'commands/reference/extra'
					]
				}
			]
		},
		{
			type: 'category',
			label: "RPG系統全攻略",
			link: { type: 'doc', id: 'rpg/index' },
			items: [
				'rpg/index',
				'rpg/jobs',
				'rpg/shop',
				'rpg/make'
			]
		},
		'role',
		'poll',
		'dvc',
		'join-message',
		'ticket',
		'faq',
		'chat',
		'credit',
		'copyright'
	]
};
