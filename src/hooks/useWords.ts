import nlp from "compromise";
import { outMethods } from "node_modules/compromise/types/misc";
import Three from "node_modules/compromise/types/view/three";
import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { ThreadMedia } from "@src/threadsapi/api";
import { useUserDataStore } from "@src/threadsapi/store";

export const EMPTY_THREAD = uuidv4();

interface WordInsight {
	word: string;
	total_likes: number;
	total_views: number;
	type: WordType;
	threads: ThreadMedia[];
	total_count: number;
}

export const useByWord = (data: ThreadMedia[]): WordInsight[] => {
	const userThreadsInsights = useUserDataStore((state) => state.user_threads_insights);

	const lbt = useCallback(
		(thread: ThreadMedia) => {
			return userThreadsInsights[thread.id]?.data?.likes?.values[0].value ?? 0;
		},
		[userThreadsInsights],
	);

	const vbt = useCallback(
		(thread: ThreadMedia) => {
			return userThreadsInsights[thread.id]?.data?.views?.values[0].value ?? 0;
		},
		[userThreadsInsights],
	);

	return useMemo(() => {
		const resp = data.reduce<Record<WordSegment, WordInsight | undefined>>((acc, thread) => {
			if (thread.text) {
				const views = vbt(thread);
				const likes = lbt(thread);
				const list = segmentText(thread.text);
				list.forEach((wordobj) => {
					const word = wordFromSegment(wordobj);
					if (word === " " || word === "") return;
					if (acc[wordobj]) {
						acc[wordobj].total_likes += likes;
						acc[wordobj].total_views += views;
						acc[wordobj].threads.push({ ...thread, text: `[${likes} - ${views}] ${thread.text}` });
						acc[wordobj].total_count += 1;
					} else {
						acc[wordobj] = {
							word: word.toLowerCase(),
							total_likes: likes,
							total_views: views,
							type: typeFromSegment(wordobj),
							threads: [{ ...thread, text: `[${likes} - ${views}] ${thread.text}` }],
							total_count: 1,
						};
					}
				});
			}

			return acc;
		}, {});

		// console.log({ ren: Object.values(resp).length });

		return Object.values(resp).filter((v) => v && v.total_count > 1) as unknown as WordInsight[];
	}, [data, lbt, vbt]);
};

export type WordType = keyof typeof methodMap;

// Define the method map with direct method references

const methodMap = {
	organizations: [(doc: Three) => doc.organizations(), (doc: Three) => doc.nouns().if("apple")],
	places: (doc: Three) => doc.places(),
	people: (doc: Three) => doc.people(),
	phoneNumbers: (doc: Three) => doc.phoneNumbers(),
	honorifics: (doc: Three) => doc.honorifics(),
	hashTags: (doc: Three) => doc.hashTags(),
	atMentions: (doc: Three) => doc.atMentions(),
	urls: (doc: Three) => doc.urls(),
	emoji: (doc: Three) => doc.emoji(),
	numbers: (doc: Three) => doc.numbers(),
	abbreviations: (doc: Three) => doc.abbreviations(),
	contractions: (doc: Three) => doc.contractions(),
	acronyms: (doc: Three) => doc.acronyms(),
	adjectives: (doc: Three) => doc.adjectives(),
	adverbs: (doc: Three) => doc.adverbs(),
	nouns: (doc: Three) => doc.nouns(),
	verbs: (doc: Three) => doc.verbs(),
	conjunctions: (doc: Three) => doc.conjunctions(),
	prepositions: (doc: Three) => doc.prepositions(),
	pronouns: (doc: Three) => doc.pronouns(),
	clauses: (doc: Three) => doc.clauses(),
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
	const doc = nlp(text);

	// Extract segments dynamically
	const segments = forEveryMethod((methods, type) => {
		const items = methods.flatMap((m) => m(doc).out("array") as string[]).map((w) => `${w}_________:___________${type}`);

		return items as WordSegment[];
	});

	return segments;
};
