"use strict";

const PERSONALITIES = {
  tech: {
    label: "技术专精者",
    preferredRoute: "tech",
    weights: { route: 18, missingCore: 22, routeAbility: 7, actionFit: 9, immediate: 1, survival: 8, hybrid: 1, randomness: 1 }
  },
  customer: {
    label: "客户专精者",
    preferredRoute: "customer",
    weights: { route: 18, missingCore: 22, routeAbility: 7, actionFit: 9, immediate: 1, survival: 8, hybrid: 1, randomness: 1 }
  },
  manufacturing: {
    label: "制造专精者",
    preferredRoute: "manufacturing",
    weights: { route: 18, missingCore: 22, routeAbility: 7, actionFit: 9, immediate: 1, survival: 8, hybrid: 1, randomness: 1 }
  },
  profit: {
    label: "短期逐利者",
    preferredRoute: null,
    weights: { route: 0, missingCore: 2, routeAbility: 1, actionFit: 0, immediate: 5, survival: 3, hybrid: 0, randomness: 2 }
  },
  cautious: {
    label: "风险厌恶者",
    preferredRoute: null,
    weights: { route: 0, missingCore: 4, routeAbility: 2, actionFit: 1, immediate: 2, survival: 22, hybrid: 2, randomness: 1 }
  },
  hybrid: {
    label: "混合构筑者",
    preferredRoute: null,
    weights: { route: 0, missingCore: 5, routeAbility: 2, actionFit: 2, immediate: 1, survival: 7, hybrid: 18, randomness: 2 }
  },
  beginner: {
    label: "新手玩家",
    preferredRoute: null,
    adaptiveRoute: true,
    openingCommitment: 5,
    weights: { route: 4, missingCore: 6, routeAbility: 2, actionFit: 3, crisisFit: 3, immediate: 3, survival: 3, hybrid: 1, randomness: 11 }
  },
  experienced: {
    label: "熟练玩家",
    preferredRoute: null,
    adaptiveRoute: true,
    openingCommitment: 16,
    weights: { route: 16, missingCore: 22, routeAbility: 7, actionFit: 11, crisisFit: 14, immediate: 1, survival: 10, hybrid: 2, randomness: 3 }
  },
  random: {
    label: "纯随机",
    preferredRoute: null,
    weights: { route: 0, missingCore: 0, routeAbility: 0, actionFit: 0, immediate: 0, survival: 0, hybrid: 0, randomness: 1 }
  }
};

function getPersonality(id) {
  const personality = PERSONALITIES[id];
  if (!personality) throw new Error(`未知人格：${id}`);
  return { id, ...personality, weights: { ...personality.weights } };
}

module.exports = { PERSONALITIES, getPersonality };