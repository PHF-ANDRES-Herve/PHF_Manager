export const ListePays = {
	HU: 'Hongrie',
	DK: 'Danemark',
	SE: 'Suède',
	JP: 'Japon',
	FI: 'Finlande',
	NZ: 'Nouvelle-Zélande',
	CZ: 'République Tchèque',
	UK: 'Royaume-Uni',
	IE: 'Irlande',
	EE: 'Estonie',
	AU: 'Australie',
	CA: 'Canada',
	BE: 'Belgique',
	US: 'Etats-Unis',
	AT: 'Autriche',
	SI: 'Slovénie',
	LU: 'Luxembourg',
	ES: 'Espagne',
	NL: 'Hollande',
	DE: 'Allemagne',
	PT: 'Portugal',
	PL: 'Pologne',
	IT: 'Italie',
	ZA: 'Afrique du Sud',
	FR: 'France',
	CH: 'Suisse'
};

export const ListeTypeIndex = {
	CF: 'Taureau confirmé français',
	EF: 'Taureau étranger indexé en France',
	I: 'Taureau Interbull',
	JF: 'Jeune Taureau Français',
	JI: 'Jeune Taureau Interbull',
	JE: 'Jeune Taureau Eurogenomic'
};
export const LibellesString = {
	LGF: 'Longévité',
	FERV: 'Fertilité vaches',
	FERG: 'Fertilité génisses',
	IVIA1: 'Intervalle Velage IA1',
	REPRO: 'Synthèse fertilité',
	MACL: 'Mammites cliniques',
	STMA: 'Santé mamelle',
	FNAI: 'Facilité naissance',
	FVEL: 'Facilité velage',
	VNAI: 'Vitalité naissance',
	VVEL: 'Vitalité velage',
	LAIT: 'Lait',
	TP: 'TP',
	TB: 'TB',
	MP: 'MP',
	MG: 'MG',
	MU: '? INEL',
	INEL: 'INEL',
	CELL: 'Cellules',
	ISU: 'ISU',
	MO: 'Morphologie',
	AA: 'Attache avant',
	AH: 'hauteur attache arrière',
	AJ: 'Angle du jarret',
	AS: 'Aspect',
	CC: 'Capacité corp.',
	EA: 'Ecart avant',
	EC: 'Etat corporel',
	HS: 'Hauteur au sacrum',
	IA: 'Implantation arrière',
	IB: 'Inclinaison du bassin',
	IS: 'Largeur aux ischions',
	LO: 'Locomotion',
	LT: 'Longueur des trayons',
	LP: 'Largeur de poitrine',
	MA: 'Mamelle',
	ME: 'Membres',
	MR: 'Membres arrière vue arr.',
	PI: 'Angle du pied',
	PJ: 'Dist. Plancher Jarret',
	PS: 'Profondeur sillon',
	TE: 'Tempérament',
	TR: 'Vitesse de traite',
	EQ: 'Equilibre (femelle)',
	PC: 'Profondeur de corps'
};

export const familyKeys = ['COPAIP', 'NOBOVIC', 'NOBOVIL', 'NUNATI'];
export const familyLabels = {
	P: 'Père',
	GPP: 'Grand-Père Paternel',
	GMP: 'Grand-Mère Paternel',
	GPM: 'Grand-Père Maternel',
	GMM: 'Grand-Mère Maternel',
	AGPPP: 'Arrière-Grand-Père Paternel',
	AGMMP: 'Arrière-Grand-Mère Paternelle',
	AGPPM: 'Arrière-Grand-Père Paternel',
	AGMPM: 'Arrière-Grand-Mère Paternelle',
	AGPMP: 'Arrière-Grand-Père Paternel',
	AGMPP: 'Arrière-Grand-Mère Paternelle',
	AGPMM: 'Arrière-Grand-Père Paternel',
	AGMMM: 'Arrière-Grand-Mère Paternelle'
};
export const indexLabels = {
	// NF_LAIT: "Nb. filles",
	LAIT: 'Lait',
	TP: 'TP',
	TB: 'TB',
	MP: 'MP',
	MG: 'MG',
	// MU: '? INEL',
	INEL: 'INEL',

	// NF_MO: "Nb. filles",
	MO: 'Morphologie',
	MA: 'Mamelle',
	CC: 'Capacité corp.',
	ME: 'Membres',

	PS: 'Profondeur sillon',
	PJ: 'Dist. Plancher Jarret',
	EQ: 'Equilibre',
	AA: 'Attache avant',
	AH: 'hauteur attache arrière',
	EA: 'Ecart avant',
	IA: 'Implantation arrière',
	LT: 'Longueur des trayons',
	HS: 'Hauteur au sacrum',
	PC: 'Profondeur de corps',
	LP: 'Largeur de poitrine',
	AS: 'Aspect',
	EC: 'Etat corporel',
	IS: 'Largeur aux ischions',
	IB: 'Inclinaison du bassin',
	AJ: 'Angle du jarret',
	PI: 'Angle du pied',
	MR: 'Membres arrière vue arr.',
	LO: 'Locomotion',
	STMA: 'Santé mamelle',
	REPRO: 'Synthèse fertilité',
	LGF: 'Longévité',
	TR: 'Vitesse de traite',
	TE: 'Tempérament',
	CELL: 'Cellules',
	MACL: 'Mammites cliniques',
	FERV: 'Fertilité vaches',
	FERG: 'Fertilité génisses',
	IVIA1: 'Intervalle Velage IA1',
	FNAI: 'Facilité naissance',
	FVEL: 'Facilité velage',
	VNAI: 'Vitalité naissance',
	VVEL: 'Vitalité velage'
	// ISU: "ISU",
};

//TABLEAUX COULEURS (Ligne 534)
export const percentColors1 = [
	{ pct: -1000, color: { r: 255, g: 160, b: 147 } },
	{ pct: -500, color: { r: 251, g: 222, b: 207 } },
	{ pct: 0, color: { r: 253, g: 247, b: 211 } },
	{ pct: 500, color: { r: 235, g: 248, b: 165 } },
	{ pct: 1000, color: { r: 189, g: 234, b: 137 } }
];
export const percentColors2 = [
	{ pct: -1, color: { r: 255, g: 160, b: 147 } },
	{ pct: -0.5, color: { r: 251, g: 222, b: 207 } },
	{ pct: 0, color: { r: 253, g: 247, b: 211 } },
	{ pct: 0.5, color: { r: 235, g: 248, b: 165 } },
	{ pct: 1.0, color: { r: 189, g: 234, b: 137 } }
];
export const percentColors3 = [
	{ pct: -2, color: { r: 255, g: 160, b: 147 } },
	{ pct: -1, color: { r: 251, g: 222, b: 207 } },
	{ pct: 0, color: { r: 253, g: 247, b: 211 } },
	{ pct: 1, color: { r: 235, g: 248, b: 165 } },
	{ pct: 2.0, color: { r: 189, g: 234, b: 137 } }
];
export const percentColors4 = [
	{ pct: 0, color: { r: 255, g: 160, b: 147 } },
	{ pct: 10, color: { r: 251, g: 222, b: 207 } },
	{ pct: 20, color: { r: 253, g: 247, b: 211 } },
	{ pct: 30, color: { r: 235, g: 248, b: 165 } },
	{ pct: 40, color: { r: 189, g: 234, b: 137 } }
];

export const loginCards = [
	{
		id: 1,
		name: "Prim'Holstein France",
		username: 'PHF2',
		email: 'info@primholstein.com',
		address: {
			street: 'Le Montsoreau',
			suite: "Saint Sylvain d'Anjou",
			city: 'Verrieres-en-Anjou',
			zipcode: '49480'
		},
		phone: ' 33 (0)2 41 37 66 66',
		website: 'https://primholstein.com',
		company: {
			name: "Prim'Holstein France",
			catchPhrase: 'Expertise Génétique Independante',
			bs: 'expertise genetique indexation'
		}
	}
];
