"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { getPersonality } = require("./personalities");

const RESOURCE_KEYS = ["cash", "tech", "talent", "market"];
const GROWTH_LEVELS = [0, 2, 4, 7, 11];
const ROUTES = ["tech", "customer", "manufacturing"];

function loadConfig(configPath = path.join(__dirname, "..", "cards.config.js")) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(configPath, "utf8"), sandbox, { filename: configPath });
  return sandbox.window.SILICON_CONFIG;
}

function seededValue(seed) {
  let value = seed >>> 0;
  value += 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

function createRandom(seed) {
  let offset = 0;
  return () => seededValue(seed + offset++ * 977);
}

function createState(config, seed) {
  const firstEvent = Math.floor(seededValue(seed) * config.marketEvents.length);
  return {
    seed,
    round: 1,
    resources: { cash: 8, tech: 8, talent: 8, market: 8 },
    abilities: ["officeLease"],
    route: null,
    engine: {
      knowledgeLevel: 0,
      knowledge: 0,
      bestPublication: 0,
      clientLevel: 0,
      clientValue: 0,
      pendingContracts: 0,
      bestDeliveryStreak: 0,
      inventoryLevel: 0,
      inventory: 0,
      inventoryMatched: false,
      bestShipment: 0
    },
    eventIds: [
      config.marketEvents[firstEvent].id,
      config.marketEvents[(firstEvent + 1) % config.marketEvents.length].id
    ],
    rescueUsed: false,
    ending: null,
    elapsedSeconds: 0
  };
}

function clamp(value) {
  return Math.max(0, Math.min(20, value));
}

function simulateGame(config, options = {}) {
  const seed = options.seed ?? Math.floor(Math.random() * 900000) + 100000;
  const personality = getPersonality(options.personality ?? options.strategy ?? "random");
  const timeProfile = options.timeProfile ?? DEFAULT_TIME_PROFILE;
  const random = createRandom(seed + personality.id.length * 1009);
  const state = createState(config, seed);

  const hasAbility = (id) => state.abilities.includes(id);
  const hasBuild = (route) => config.builds[route].core.every(hasAbility);
  const buildProgress = (route) => config.builds[route].core.filter(hasAbility).length;
  const dominantRoute = () => state.route || [...ROUTES].sort((a, b) => buildProgress(b) - buildProgress(a))[0];
  const cardById = (id) => [
    ...Object.values(config.openings),
    ...Object.values(config.routeCards).flat(),
    ...Object.values(config.actionCards),
    ...config.commonCards
  ].find((card) => card.id === id);
  const shuffle = (items, salt) => [...items]
    .map((item, index) => ({ item, score: seededValue(seed + salt * 101 + index * 977) }))
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item);
  const eventForRound = (round) => {
    const eventId = round === 4 ? state.eventIds[0] : round === 6 ? state.eventIds[1] : null;
    return config.marketEvents.find((event) => event.id === eventId);
  };

  function opportunitiesForRound() {
    if (state.round === 1) return shuffle(Object.values(config.openings), 1);
    const route = dominantRoute();
    if (state.round === 2) {
      const alternative = Object.values(config.openings).find((card) => card.route !== route);
      return shuffle([config.routeCards[route][0], alternative, cardById("reserve")], 2);
    }
    if (state.round === 3) {
      const hybrid = config.commonCards.find((card) => card.routes.includes(route) && card.routes.length > 1);
      return shuffle([config.routeCards[route][1], hybrid, cardById("people")], 3);
    }
    const routeCard = config.actionCards[route];
    const pool = shuffle(config.commonCards.filter((card) => card.id !== routeCard.id), state.round);
    return shuffle([routeCard, ...pool.slice(0, 2)], state.round + 20);
  }

  function applyResourceEffects(effects) {
    Object.entries(effects).forEach(([key, amount]) => {
      state.resources[key] = clamp(state.resources[key] + amount);
    });
  }

  function advanceLevel(key) {
    state.engine[key] = Math.min(4, state.engine[key] + 1);
    return GROWTH_LEVELS[state.engine[key]];
  }

  function addAbility(id) {
    if (!id || hasAbility(id)) return;
    if (state.abilities.length < 6) {
      state.abilities.push(id);
      return;
    }
    const protectedAbilities = personality.preferredRoute ? config.builds[personality.preferredRoute].core : [];
    const replaceIndex = state.abilities.findIndex((ability) => !protectedAbilities.includes(ability));
    const index = replaceIndex >= 0 ? replaceIndex : 0;
    const removed = state.abilities[index];
    state.abilities[index] = id;
    if (removed === "officeLease") applyResourceEffects({ cash: -1 });
    if (config.builds.tech.core.includes(removed)) {
      state.engine.knowledge = Math.floor(state.engine.knowledge / 2);
    }
    if (config.builds.customer.core.includes(removed)) {
      state.engine.clientLevel = 0;
      state.engine.clientValue = 0;
      state.engine.pendingContracts = 0;
    }
    if (config.builds.manufacturing.core.includes(removed)) {
      state.engine.inventory = Math.floor(state.engine.inventory / 2);
      state.engine.inventoryLevel = 0;
    }
    addInteractionTime("replacement", 0);
  }

  function processEngine(action) {
    if (action === "research" && hasAbility("researchTeam")) {
      const gain = hasAbility("advancedLab") ? advanceLevel("knowledgeLevel") : 2;
      state.engine.knowledge = Math.min(20, state.engine.knowledge + gain);
    }
    if (action === "publish" && hasAbility("ownProduct")) {
      const quality = Math.max(2, state.engine.knowledge);
      const retained = hasAbility("techLicense") ? Math.floor(state.engine.knowledge / 2) : 0;
      applyResourceEffects({
        cash: Math.max(1, Math.floor(quality / 2)),
        market: hasAbility("techLicense") ? Math.max(1, Math.floor(quality / 4)) : Math.max(1, Math.floor(quality / 2))
      });
      state.engine.bestPublication = Math.max(state.engine.bestPublication, quality);
      state.engine.knowledge = retained;
    }
    if (action === "contract" && hasAbility("enterpriseClients")) {
      state.engine.pendingContracts += 1;
      if (state.engine.clientLevel === 0) {
        state.engine.clientLevel = 1;
        state.engine.clientValue = 2;
      }
    }
    if (action === "deliver" && hasAbility("enterpriseClients")) {
      const deliveryCapacity = hasAbility("humaneSchedule") ? 2 : 1;
      const talentCost = Math.max(0, state.engine.pendingContracts - deliveryCapacity);
      if (state.engine.pendingContracts > 0 || hasAbility("longContract")) {
        applyResourceEffects({ talent: -talentCost });
        const value = hasAbility("salesNetwork") ? advanceLevel("clientLevel") : 2;
        state.engine.clientValue = value;
        state.engine.bestDeliveryStreak = Math.max(state.engine.bestDeliveryStreak, state.engine.clientLevel);
        state.engine.pendingContracts = Math.max(0, state.engine.pendingContracts - 1);
        applyResourceEffects({ cash: hasAbility("longContract") ? Math.max(1, Math.floor(value / 2)) : 1 });
        if (hasAbility("jointDevelopment")) {
          applyResourceEffects({ talent: -1 });
          state.engine.knowledge = Math.min(20, state.engine.knowledge + (hasAbility("researchTeam") ? 2 : 1));
        }
      } else {
        state.engine.clientLevel = 0;
        state.engine.clientValue = 0;
        applyResourceEffects({ market: -3 });
      }
    }
    if (action === "produce" && hasAbility("productionBase") && state.resources.cash > 0) {
      const amount = hasAbility("processControl") ? advanceLevel("inventoryLevel") : 2;
      state.engine.inventory = Math.min(20, state.engine.inventory + amount);
    }
    if (action === "ship" && hasAbility("strategicStock") && state.engine.inventory > 0) {
      const demand = eventForRound(state.round)?.demand || 1;
      const matched = demand >= 1 || hasAbility("flexibleLine");
      const revenue = matched ? Math.ceil(state.engine.inventory * demand) : Math.floor(state.engine.inventory / 2);
      applyResourceEffects({ cash: revenue, market: matched ? 2 : -1 });
      state.engine.bestShipment = Math.max(state.engine.bestShipment, revenue);
      state.engine.inventoryMatched = matched;
      state.engine.inventory = 0;
      state.engine.inventoryLevel = 0;
    }
  }

  function maybeRescue() {
    const failedKey = RESOURCE_KEYS.find((key) => state.resources[key] <= 0);
    if (!failedKey) return false;
    if (state.rescueUsed || !state.abilities.length) return true;
    state.abilities.shift();
    state.resources[failedKey] = 1;
    state.rescueUsed = true;
    return false;
  }

  function preferredActions(route) {
    if (!route) return [];
    return {
      tech: state.engine.knowledge >= 7 && hasAbility("ownProduct") ? ["publish"] : ["research"],
      customer: state.engine.pendingContracts > 0 || hasAbility("longContract") ? ["deliver"] : ["contract"],
      manufacturing: state.engine.inventory >= 7 && hasAbility("strategicStock") ? ["ship"] : ["produce"]
    }[route];
  }

  function choiceFeatures(choice) {
    const route = personality.preferredRoute || (personality.adaptiveRoute && state.route);
    const ability = config.abilities[choice.add];
    const immediate = Object.values(choice.effects).reduce((sum, amount) => sum + amount, 0);
    const projected = Object.fromEntries(RESOURCE_KEYS.map((key) => [key, state.resources[key] + (choice.effects[key] || 0)]));
    const lowestProjectedResource = Math.min(...Object.values(projected));
    const projectedFatal = lowestProjectedResource <= 0;
    const crisisDeficit = route === "customer"
      ? Math.max(0, 6 - projected.talent)
      : route === "tech"
        ? Math.max(0, 4 - projected.talent) + Math.max(0, 3 - projected.cash)
        : route === "manufacturing" ? Math.max(0, 3 - projected.cash) : Math.max(0, 3 - lowestProjectedResource);
    const crisisFit = state.round < 5 ? 0 : route === "customer"
      ? choice.action === "deliver" ? 1 : choice.action === "contract" ? -1 : 0
      : route === "tech"
        ? state.engine.knowledge >= 7 && choice.action === "publish" ? 1 : 0
        : route === "manufacturing" && state.engine.inventory >= 7 && choice.action === "ship" ? 1 : 0;
    return {
      route: route && ability?.build === route ? 1 : 0,
      missingCore: route && config.builds[route].core.includes(choice.add) && !hasAbility(choice.add) ? 1 : 0,
      routeAbility: route && ability?.build === route ? 1 : 0,
      actionFit: preferredActions(route).includes(choice.action) ? 1 : 0,
      crisisFit,
      immediate,
      survival: projectedFatal ? -10 : -crisisDeficit,
      hybrid: ability?.build === "hybrid" ? 1 : 0,
      randomness: random()
    };
  }

  function weightedScore(features) {
    return Object.entries(personality.weights).reduce((score, [feature, weight]) => score + (features[feature] || 0) * weight, 0);
  }

  function choiceScore(choice) {
    return weightedScore(choiceFeatures(choice));
  }

  function opportunityScore(card) {
    const preferredRoute = personality.preferredRoute || (personality.adaptiveRoute && state.route);
    const openingCommitment = state.round === 1 && personality.adaptiveRoute
      ? (seed % ROUTES.length === ROUTES.indexOf(card.route) ? personality.openingCommitment || 0 : 0)
      : 0;
    const routeAffinity = preferredRoute && card.route === preferredRoute
      ? personality.weights.route
      : 0;
    return openingCommitment + routeAffinity + Math.max(...card.choices.map(choiceScore));
  }

  function textLength(value) {
    return String(value || "").replace(/\s/g, "").length;
  }

  function jitter(seconds) {
    return seconds * (0.78 + random() * 0.44);
  }

  function addInteractionTime(kind, characters) {
    const reading = characters / timeProfile.readingCharactersPerSecond;
    state.elapsedSeconds += jitter(reading + timeProfile[kind]) + timeProfile.clickSeconds;
  }

  for (state.round = 1; state.round <= 6 && !state.ending; state.round += 1) {
    const opportunities = opportunitiesForRound();
    addInteractionTime("opportunityThinkingSeconds", opportunities.reduce((sum, card) => sum + textLength(card.title) + textLength(card.summary), 0));
    const card = [...opportunities].sort((left, right) => opportunityScore(right) - opportunityScore(left))[0];
    addInteractionTime("decisionThinkingSeconds", textLength(card.summary) + card.choices.reduce((sum, choice) => sum + textLength(choice.label) + textLength(choice.note), 0));
    const choice = [...card.choices].sort((left, right) => choiceScore(right) - choiceScore(left))[0];
    addAbility(choice.add);
    if (!state.route && choice.add) {
      const build = config.abilities[choice.add]?.build;
      if (config.builds[build]) state.route = build;
    }
    applyResourceEffects(choice.effects);
    processEngine(choice.action);
    addInteractionTime("resultSeconds", textLength(choice.headline) + textLength(choice.result));
    if (maybeRescue()) state.ending = { type: "failure", route: dominantRoute() };
  }

  if (!state.ending) {
    const route = dominantRoute();
    const cashCost = hasAbility("cashReserve") ? 1 : 3;
    const marketLoss = hasAbility("diverseMarket") ? 2 : 4;
    const checks = {
      tech: { business: state.engine.bestPublication >= 7 || hasAbility("techLicense"), survival: state.resources.cash >= cashCost && state.resources.talent >= 4 },
      customer: { business: state.engine.clientValue >= 7 || hasAbility("humaneSchedule"), survival: state.resources.talent >= 6 && state.engine.pendingContracts === 0 },
      manufacturing: { business: state.engine.bestShipment >= 7 || hasAbility("flexibleLine"), survival: state.resources.cash >= 3 }
    };
    const evaluation = checks[route];
    addInteractionTime("crisisThinkingSeconds", 108);
    const protect = evaluation.business && evaluation.survival;
    if (protect) {
      applyResourceEffects({ cash: -cashCost, market: -marketLoss });
    } else {
      state.abilities.pop();
      applyResourceEffects({ cash: -1, market: -1 });
    }
    const failed = maybeRescue();
    const achievement = route === "tech"
      ? state.engine.bestPublication >= 7
      : route === "customer" ? state.engine.bestDeliveryStreak >= 3 : state.engine.bestShipment >= 7;
    state.ending = {
      type: failed ? "failure" : protect && hasBuild(route) && achievement ? "breakout" : "survivor",
      route
    };
    addInteractionTime("endingSeconds", 110);
  }

  return {
    seed,
    personality: personality.id,
    ending: state.ending.type,
    route: state.ending.route,
    seconds: state.elapsedSeconds,
    resources: { ...state.resources },
    abilities: [...state.abilities],
    engine: { ...state.engine }
  };
}

function runBatch(config, options = {}) {
  const runs = options.runs ?? 1000;
  const personality = options.personality ?? options.strategy ?? "random";
  const baseSeed = options.seed ?? 100000;
  const games = Array.from({ length: runs }, (_, index) => simulateGame(config, {
    personality,
    seed: baseSeed + index,
    timeProfile: options.timeProfile
  }));
  const counts = { breakout: 0, survivor: 0, failure: 0 };
  games.forEach((game) => counts[game.ending] += 1);
  const durations = games.map((game) => game.seconds).sort((a, b) => a - b);
  const percentile = (ratio) => durations[Math.min(durations.length - 1, Math.floor(durations.length * ratio))];
  return {
    personality,
    runs,
    counts,
    rates: Object.fromEntries(Object.entries(counts).map(([key, count]) => [key, count / runs])),
    duration: {
      averageSeconds: durations.reduce((sum, value) => sum + value, 0) / runs,
      medianSeconds: percentile(0.5),
      p10Seconds: percentile(0.1),
      p90Seconds: percentile(0.9)
    }
  };
}

const DEFAULT_TIME_PROFILE = {
  readingCharactersPerSecond: 5,
  opportunityThinkingSeconds: 5,
  decisionThinkingSeconds: 8,
  resultSeconds: 3,
  replacement: 6,
  crisisThinkingSeconds: 10,
  endingSeconds: 5,
  clickSeconds: 0.8
};

module.exports = { DEFAULT_TIME_PROFILE, loadConfig, runBatch, simulateGame };