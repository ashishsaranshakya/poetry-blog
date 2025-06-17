function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

// 1. Jaccard Similarity (unique word overlap)
export function jaccardSimilarity(poemA, poemB) {
  const setA = new Set(tokenize(poemA));
  const setB = new Set(tokenize(poemB));
  if (!setA.size || !setB.size) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// 2. Cosine Similarity (Bag-of-Words)
export function cosineSimilarity(poemA, poemB) {
  const tokensA = tokenize(poemA);
  const tokensB = tokenize(poemB);
  const allWords = Array.from(new Set([...tokensA, ...tokensB]));
  const freqA = allWords.map(word => tokensA.filter(w => w === word).length);
  const freqB = allWords.map(word => tokensB.filter(w => w === word).length);
  const dot = freqA.reduce((sum, a, i) => sum + a * freqB[i], 0);
  const magA = Math.sqrt(freqA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(freqB.reduce((sum, b) => sum + b * b, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}

// 3. TF-IDF Cosine Similarity
export function tfidfCosineSimilarity(poemA, poemB, allPoems) {
  const tokensA = tokenize(poemA);
  const tokensB = tokenize(poemB);
  const allWords = Array.from(new Set([...tokensA, ...tokensB]));
  const docCount = allPoems.length;
  function tf(word, tokens) {
    return tokens.filter(w => w === word).length / tokens.length;
  }
  function idf(word) {
    const containing = allPoems.filter(poem => tokenize(poem).includes(word)).length;
    return Math.log((docCount + 1) / (containing + 1)) + 1;
  }
  const tfidfA = allWords.map(word => tf(word, tokensA) * idf(word));
  const tfidfB = allWords.map(word => tf(word, tokensB) * idf(word));
  const dot = tfidfA.reduce((sum, a, i) => sum + a * tfidfB[i], 0);
  const magA = Math.sqrt(tfidfA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(tfidfB.reduce((sum, b) => sum + b * b, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}

// 4. N-gram Overlap (default: bigrams)
export function ngramOverlap(poemA, poemB, n = 2) {
  function ngrams(tokens, n) {
    return new Set(tokens.slice(0, tokens.length - n + 1).map((_, i) => tokens.slice(i, i + n).join(' ')));
  }
  const tokensA = tokenize(poemA);
  const tokensB = tokenize(poemB);
  const ngramsA = ngrams(tokensA, n);
  const ngramsB = ngrams(tokensB, n);
  if (!ngramsA.size || !ngramsB.size) return 0;
  const intersection = new Set([...ngramsA].filter(x => ngramsB.has(x)));
  const union = new Set([...ngramsA, ...ngramsB]);
  return intersection.size / union.size;
}

// method: 'jaccard' | 'cosine' | 'tfidf' | 'ngram'
export function getSimilarityScore(poemA, poemB, method = 'jaccard', options = {}) {
  if (method === 'jaccard') {
    return jaccardSimilarity(poemA, poemB);
  } else if (method === 'cosine') {
    return cosineSimilarity(poemA, poemB);
  } else if (method === 'tfidf') {
    return tfidfCosineSimilarity(poemA, poemB, options.allPoems || []);
  } else if (method === 'ngram') {
    return ngramOverlap(poemA, poemB, options.n || 2);
  }
  return 0;
}

function poemToText(poem) {
  return (poem?.content || []).join(' ');
}

export function getRelatedPoems(poem, poems, SIMILARITY_METHOD = 'jaccard') {
  const allPoemTexts = poems.map(poemToText);

  const currentPoemText = poemToText(poem);
  const currentThemes = new Set(poem.themes || []);
  return poems
    .filter(p => p.id !== poem.id)
    .map(p => {
      const otherPoemText = poemToText(p);
      const contentScore = getSimilarityScore(
        currentPoemText,
        otherPoemText,
        SIMILARITY_METHOD,
        {
          allPoems: allPoemTexts,
          n: 2
        }
      );
      let themeScore = 0;
      if (poem.themes && p.themes) {
        const sharedThemes = p.themes.filter(theme => currentThemes.has(theme));
        themeScore = sharedThemes.length * 0.1;
      }
      return { ...p, _similarity: contentScore + themeScore, themeScore, contentScore };
    })
    .filter(p => p._similarity > 0)
    .sort((a, b) => b._similarity - a._similarity)
    .slice(0, 4);
}