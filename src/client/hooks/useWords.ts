import nlp from "compromise";
import { outMethods } from "node_modules/compromise/types/misc";
import Three from "node_modules/compromise/types/view/three";
import { useMemo } from "react";

import { ThreadMedia } from "@src/threadsapi/types";

import useThreadInfoCallbacks from "./useThreadInfoCallbacks";

interface WordInsightStats {
	total_likes: number;
	total_views: number;
	total_count: number;
	average_likes: number;
	average_views: number;
}

export type MetricKey = keyof WordInsightStats;

interface WordInsight {
	word: string;
	type: WordType;
	threads: ThreadMedia[];
	stats: WordInsightStats;
}

export const extractMetics = (data: WordInsight, key: MetricKey): number => {
	return data.stats[key];
};

export const useByWord = (data: ThreadMedia[]): WordInsight[] => {
	const [getLikes, getViews] = useThreadInfoCallbacks();
	return useMemo(() => {
		const resp = data.reduce<Record<WordSegment, WordInsight | undefined>>((acc, thread) => {
			if (thread.text) {
				const views = getViews(thread);
				const likes = getLikes(thread);
				const list = segmentText(thread.text);
				list.forEach((wordobj) => {
					const word = wordFromSegment(wordobj);
					if (word === " " || word === "") return;
					if (acc[wordobj]) {
						acc[wordobj].stats.total_likes += likes;
						acc[wordobj].stats.total_views += views;
						acc[wordobj].threads.push({ ...thread, text: `[${likes} - ${views}] ${thread.text}` });
						acc[wordobj].stats.total_count += 1;
					} else {
						acc[wordobj] = {
							word: word.toLowerCase(),
							stats: {
								total_likes: likes,
								total_views: views,
								total_count: 1,
								average_likes: 0,
								average_views: 0,
							},
							type: typeFromSegment(wordobj),
							threads: [{ ...thread, text: `[${likes} - ${views}] ${thread.text}` }],
						};
					}
				});
			}

			return acc;
		}, {});

		// console.log({ ren: Object.values(resp).length });

		return Object.values(resp)
			.filter((x) => !!x)
			.filter((x) => x.stats.total_views > 0)
			.map((word) => ({
				...word,
				stats: {
					...word.stats,
					average_likes: word.stats.total_likes / word.stats.total_count,
					average_views: word.stats.total_views / word.stats.total_count,
				},
			}));
	}, [data, getViews, getLikes]);
};

export type WordType = Lowercase<keyof typeof methodMap>;

// Define the method map with direct method references

const methodMap = {
	organizations: [(doc: Three) => doc.organizations()],
	places: (doc: Three) => doc.places(),
	people: (doc: Three) => doc.people(),
	phonenumbers: (doc: Three) => doc.phoneNumbers(),
	honorifics: (doc: Three) => doc.honorifics(),
	hashtags: (doc: Three) => doc.hashTags(),
	mentions: (doc: Three) => doc.atMentions(),
	urls: (doc: Three) => doc.urls(),
	emoji: (doc: Three) => doc.emoji(),
	numbers: (doc: Three) => doc.numbers(),
	abbreviations: (doc: Three) => doc.abbreviations(),
	contractions: (doc: Three) => doc.contractions(),
	acronyms: (doc: Three) => doc.acronyms(),
	adjectives: (doc: Three) => doc.adjectives(),
	emoticons: (doc: Three) => doc.emoticons(),
	money: (doc: Three) => doc.money(),
	hyphenated: (doc: Three) => doc.hyphenated(),
	emails: (doc: Three) => doc.emails(),
	fractions: (doc: Three) => doc.fractions(),
	quotations: (doc: Three) => doc.quotations(),
	possessives: (doc: Three) => doc.possessives(),
	adverbs: (doc: Three) => doc.adverbs(),
	nouns: (doc: Three) => doc.nouns(),
	verbs: (doc: Three) => doc.verbs(),
	conjunctions: (doc: Three) => doc.conjunctions(),
	prepositions: (doc: Three) => doc.prepositions(),
	pronouns: (doc: Three) => doc.pronouns(),
	// clauses: (doc: Three) => doc.clauses(),
	// sentences: (doc: Three) => doc.sentences(),

	// normalize: (doc: Three) => doc.normalize(),
	// terms: (doc: Three) => doc.terms(),
} as const;

export const wordTypes = Object.keys(methodMap) as WordType[];

type WordSegment = `${string}_________:___________${WordType}`;

const wordFromSegment = (segment: WordSegment): string => {
	return segment.split("_________:___________")[0];
};

const typeFromSegment = (segment: WordSegment): WordType => {
	return segment.split("_________:___________")[1] as WordType;
};

interface exporter {
	out: (format?: outMethods | undefined) => object;
}

const forEveryMethod = (fn: (arg: ((value: Three) => exporter)[], type: WordType) => WordSegment[]) => {
	return Object.entries(methodMap).flatMap(([type, method]) => {
		return fn([method].flat(), type as WordType);
	});
};

export const segmentText = (text: string): WordSegment[] => {
	// Use Compromise to process the text

	let texttrimmedpunc = nlp(text).normalize().out("text") as string;

	// remove quotes
	texttrimmedpunc = texttrimmedpunc.replace(/[‟‟″"˝´‟″„”“]+/g, "");

	const doc = nlp(texttrimmedpunc);

	// Extract segments dynamically
	const segments = forEveryMethod((methods, type) => {
		const items = methods.flatMap((m) => m(doc).out("array") as string[]).map((w) => `${w}_________:___________${type}`.toLowerCase());

		return items as WordSegment[];
	});

	return segments;
};
