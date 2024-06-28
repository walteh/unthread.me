import nlp from "compromise";
import { outMethods } from "node_modules/compromise/types/misc";
import Three from "node_modules/compromise/types/view/three";
import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { ThreadMedia } from "@src/threadsapi/api";
import { useUserDataStore } from "@src/threadsapi/store";

export const EMPTY_THREAD = uuidv4();

// const emojiRegex = /(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF]|[\uDC00-\uDFFF])/g;
// const hashtagRegex = /^#[\w]+$/g;
// const mentionRegex = /^@[\w]+$/g;
// const urlRegex = /^(https?:\/\/[^\s]+)$/g;
// const numberRegex = /^-?\d+(\.\d+)?$/g;
// const punctuationRegex = /^[.,/#!$%^&*g;:{}=\-_`~()]+$/g;
// const wordRegex = /^[a-zA-Z]+$/g;

// const emojiRegex = er();

// const getWordType = (word: string): WordType => {
// 	if (word === EMPTY_THREAD) {
// 		return "empty";
// 	}

// 	if (emojiRegex.test(word)) {
// 		return "emoji";
// 	} else if (hashtagRegex.test(word)) {
// 		return "hashtag";
// 	} else if (mentionRegex.test(word)) {
// 		return "mention";
// 	} else if (urlRegex.test(word)) {
// 		return "url";
// 	} else if (numberRegex.test(word)) {
// 		return "number";
// 	} else if (punctuationRegex.test(word)) {
// 		return "punctuation";
// 	} else if (wordRegex.test(word)) {
// 		return "word";
// 	} else {
// 		return "other";
// 	}
// };

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
		const resp = data.reduce<Record<string, WordInsight | undefined>>((acc, thread) => {
			const views = vbt(thread);
			const likes = lbt(thread);
			if (!thread.text) {
				if (acc[EMPTY_THREAD]) {
					// @ts-expect-error - we know this is defined
					acc[EMPTY_THREAD].total_likes += likes;
					// @ts-expect-error - we know this is defined
					acc[EMPTY_THREAD].total_views += views;
					// @ts-expect-error - we know this is defined
					acc[EMPTY_THREAD].threads.push(thread);
					// @ts-expect-error - we know this is defined
					acc[EMPTY_THREAD].total_count += 1;
				} else {
					acc[EMPTY_THREAD] = {
						word: EMPTY_THREAD,
						total_likes: likes,
						total_views: views,
						type: "empty",
						threads: [thread],
						total_count: 1,
					};
				}
			} else {
				// const segmenter = new Intl.Segmenter([], { granularity: "word" });
				// const segmentedText = segmenter.segment(thread.text);
				// const list = [...segmentedText].map((s) => s.segment);
				const list = segmentText(thread.text);
				list.forEach((wordobj) => {
					const word = wordobj.word;
					if (word === " " || word === "") return;
					if (acc[word]) {
						acc[word].total_likes += likes;
						acc[word].total_views += views;
						acc[word].threads.push({ ...thread, text: `[${likes} - ${views}] ${thread.text}` });
						acc[word].total_count += 1;
					} else {
						acc[word] = {
							word,
							total_likes: likes,
							total_views: views,
							type: wordobj.type,
							threads: [{ ...thread, text: `[${likes} - ${views}] ${thread.text}` }],
							total_count: 1,
						};
					}
				});
			}

			return acc;
		}, {});

		return Object.values(resp).filter((v) => !!v) as unknown as WordInsight[];
	}, [data, lbt, vbt]);
};

export type WordType = keyof typeof methodMap;

// Define the method map with direct method references

const methodMap = {
	organizations: (doc: Three) => doc.organizations(),
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
	chunks: (doc: Three) => doc.chunks(),
	sentences: (doc: Three) => doc.sentences(),
	empty: () => ({ out: () => [] }),
	// normalize: (doc: Three) => doc.normalize(),
	// terms: (doc: Three) => doc.terms(),
} as const;

export const wordTypes = Object.keys(methodMap) as WordType[];

export interface WordSegment {
	word: string;
	type: WordType;
}

interface exporter {
	out: (format?: outMethods | undefined) => object;
}

const forEveryMethod = (fn: (arg: { method: (value: Three) => exporter; type: WordType }) => WordSegment[]) => {
	let segments: WordSegment[] = [];
	Object.entries(methodMap).forEach(([type, method]) => {
		segments = segments.concat(fn({ method, type: type as WordType }));
	});
	return segments;
};

export const segmentText = (text: string): WordSegment[] => {
	// Use Compromise to process the text
	const doc = nlp(text);

	// Extract segments dynamically
	const segments = forEveryMethod(({ method, type }) => {
		return (method(doc).out("array") as string[]).map((w) => ({ word: w, type })) as WordSegment[];
	});

	// Add punctuation separately
	// const punctuation = (doc.match("[.,\\/#!$%\\^&\\*;:{}=\\-_`~()]").out("array") as string[]).map((w) => ({
	// 	word: w,
	// 	type: "punctuation",
	// })) as WordSegment[];

	// // Combine all segments
	// const entities = [...segments, ...punctuation];

	// Set of predefined entities (dynamically extracted ones)
	// const predefinedEntities = new Set(segments.map((e) => JSON.stringify({ word: e.word.toLowerCase(), type: e.type })));

	// Convert the set back to an array of objects
	// const result = Array.from(predefinedEntities).map((e) => JSON.parse(e));

	return segments;
};
