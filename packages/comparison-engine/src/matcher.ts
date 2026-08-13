import { NormalizedResult } from '@compareall/shared-types';

/**
 * Normalizes a string for matching purposes by converting to lowercase, 
 * removing non-alphanumeric characters (except spaces), and trimming.
 */
function normalizeString(str: string): string {
  let s = str.toLowerCase();
  
  // Clean up Swiggy "Ad" prefix (e.g., "AdDomino's Pizza" -> "domino's pizza")
  if (s.startsWith('ad') && s.length > 2) {
     s = s.substring(2);
  }

  // Remove common filler words and symbols
  s = s.replace(/\b(and|or|the|with|a|an|for|in|of)\b/g, '');
  
  // Unify storage/sizes (e.g., "128 gb" -> "128gb")
  s = s.replace(/(\d+)\s*(gb|mb|tb|kg|g|ml|l|cm|mm|inch)\b/g, '$1$2');

  // Remove non-alphanumeric (except spaces)
  s = s.replace(/[^a-z0-9\s]/g, ' ');
  
  return s.trim();
}

/**
 * Tokenizes a string into an array of words.
 */
function tokenize(str: string): string[] {
  return str.split(/\s+/).filter(token => token.length > 0 && token.length > 1);
}

/**
 * Calculates the Jaccard similarity between two sets of tokens.
 * Returns a value between 0 and 1.
 */
function jaccardSimilarity(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 && tokensB.length === 0) return 1;
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersection++;
    }
  }
  
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

/**
 * Calculates a confidence score (0-100) that two results represent the same physical item or service.
 */
export function calculateMatchConfidence(resultA: NormalizedResult, resultB: NormalizedResult): number {
  // 1. Exact ID match (if somehow possible across providers)
  if (resultA.id && resultB.id && resultA.id === resultB.id) return 100;

  let score = 0;

  // 2. Title matching (Base Score)
  const tokensA = tokenize(normalizeString(resultA.title));
  const tokensB = tokenize(normalizeString(resultB.title));
  const titleSimilarity = jaccardSimilarity(tokensA, tokensB);
  
  score += titleSimilarity * 60; // Title accounts for 60% of confidence

  // 3. Category match (Critical)
  if (resultA.category !== resultB.category) {
    return 0; // Different categories cannot be the same item
  } else {
    score += 10;
  }

  // 4. Attribute matching (Brand, Model, Size)
  let attributeMatches = 0;
  let totalAttributes = 0;

  if (resultA.brand && resultB.brand) {
    totalAttributes++;
    if (normalizeString(resultA.brand) === normalizeString(resultB.brand)) attributeMatches++;
  }

  if (resultA.model && resultB.model) {
    totalAttributes++;
    if (normalizeString(resultA.model) === normalizeString(resultB.model)) attributeMatches++;
  }

  if (resultA.size && resultB.size) {
    totalAttributes++;
    if (normalizeString(resultA.size) === normalizeString(resultB.size)) attributeMatches++;
  }

  if (resultA.quantity && resultB.quantity) {
    totalAttributes++;
    if (resultA.quantity === resultB.quantity) attributeMatches++;
  }

  if (totalAttributes > 0) {
    const attributeScore = (attributeMatches / totalAttributes) * 30; // Attributes account for up to 30%
    score += attributeScore;
  } else {
    // If neither have attributes, we heavily rely on title similarity.
    // Boost title score impact if it's very high.
    if (titleSimilarity > 0.8) {
       score += 30;
    } else if (titleSimilarity > 0.6) {
       score += 20;
    }
  }

  return Math.min(Math.round(score), 100);
}

