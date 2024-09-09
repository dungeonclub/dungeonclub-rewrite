import type { Prisma } from '@prisma/client';

export const SelectAsset = {
	id: true,
	mimeType: true,
	path: true
} satisfies Prisma.AssetSelect;
export type AssetSnippet = Prisma.AssetGetPayload<{
	select: typeof SelectAsset;
}>;

export const SelectTokenTemplate = {
	id: true,
	avatarId: true,
	avatar: {
		select: SelectAsset
	},
	name: true,
	size: true,
	initiativeModifier: true
} satisfies Prisma.TokenTemplateSelect;
export type TokenTemplateSnippet = Prisma.TokenTemplateGetPayload<{
	select: typeof SelectTokenTemplate;
}>;

export const SelectPlayerCharacter = {
	id: true,
	tokenTemplate: {
		select: SelectTokenTemplate
	}
} satisfies Prisma.PlayerCharacterSelect;
export type PlayerCharacterSnippet = Prisma.PlayerCharacterGetPayload<{
	select: typeof SelectPlayerCharacter;
}>;

export const SelectInitiativeOrder = {
	entries: {
		select: {
			token: {
				select: {
					id: true,
					initiativeModifier: true,
					template: {
						select: {
							initiativeModifier: true
						}
					}
				}
			},
			roll: true
		}
	}
} satisfies Prisma.InitiativeOrderSelect;
export type InitiativeOrderSnippet = Prisma.InitiativeOrderGetPayload<{
	select: typeof SelectInitiativeOrder;
}>;

export const SelectToken = {
	id: true,
	templateId: true,
	invisible: true,
	conditions: true,
	name: true,
	avatarId: true,
	avatar: {
		select: SelectAsset
	},
	x: true,
	y: true,
	size: true,
	initiativeModifier: true
} satisfies Prisma.TokenSelect;
export type TokenSnippet = Prisma.TokenGetPayload<{ select: typeof SelectToken }>;

export type TokenPropertiesWithAsset = Omit<
	Prisma.TokenTemplateGetPayload<{
		include: {
			avatar: { select: typeof SelectAsset };
		};
	}>,
	'id' | 'campaignId'
>;
export type TokenProperties = Omit<TokenPropertiesWithAsset, 'avatar'>;
export type OverridableTokenProperty = keyof TokenProperties;

export type TokenPropertiesOrNull = {
	[K in OverridableTokenProperty]: TokenProperties[K] | null;
};

export const SelectTokenProperties = {
	name: true,
	size: true,
	avatarId: true,
	initiativeModifier: true
} satisfies Record<
	OverridableTokenProperty,
	true
> satisfies Prisma.TokenSelect satisfies Prisma.TokenTemplateSelect;

export const SelectBoardPreview = {
	id: true,
	name: true,
	mapImage: {
		select: SelectAsset
	}
} satisfies Prisma.BoardSelect;
export type BoardPreviewSnippet = Prisma.BoardGetPayload<{ select: typeof SelectBoardPreview }>;

export const SelectBoard = {
	...SelectBoardPreview,
	gridCellsPerRow: true,
	gridPaddingTop: true,
	gridPaddingBottom: true,
	gridPaddingLeft: true,
	gridPaddingRight: true,
	gridType: true,
	initiativeOrder: {
		include: SelectInitiativeOrder
	},
	tokens: {
		select: SelectToken
	}
} satisfies Prisma.BoardSelect;
export type BoardSnippet = Prisma.BoardGetPayload<{ select: typeof SelectBoard }>;

export const SelectCampaignCard = {
	id: true,
	name: true,
	createdAt: true,
	playerCharacters: {
		select: SelectPlayerCharacter
	}
} satisfies Prisma.CampaignSelect;
export type CampaignCardSnippet = Prisma.CampaignGetPayload<{ select: typeof SelectCampaignCard }>;

export const SelectCampaign = {
	...SelectCampaignCard,
	audioEffectInside: true,
	audioSfxCrowd: true,
	audioSfxWeather: true,
	boards: {
		select: SelectBoardPreview
	},
	boardIdsOrdered: true,
	selectedBoardId: true,
	templates: {
		select: SelectTokenTemplate
	}
} satisfies Prisma.CampaignSelect;
export type CampaignSnippet = Prisma.CampaignGetPayload<{ select: typeof SelectCampaign }> & {
	selectedBoard?: BoardSnippet;
};

export const SelectAccount = {
	emailHash: true,
	tokenInfo: {
		select: { id: true }
	},
	campaigns: {
		select: SelectCampaignCard
	},
	campaignIdsOrdered: true
} satisfies Prisma.AccountSelect;
export type AccountSnippet = {
	accessToken: string;
	campaigns: CampaignCardSnippet[];
};
