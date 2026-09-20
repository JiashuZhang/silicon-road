"use strict";

const CONFIG = window.SILICON_CONFIG;
const STORAGE_KEY = "silicon-road-flywheel-v1";
const RESOURCE_NAMES = { cash: "资金", tech: "技术", talent: "人才", market: "市场" };
const RESOURCE_KEYS = Object.keys(RESOURCE_NAMES);
const GROWTH_LEVELS = [0, 2, 4, 7, 11];

const elements = Object.fromEntries([
  "hud", "resources", "round-label", "crisis-countdown", "engine-panel", "ability-slots",
  "start-screen", "start-button", "continue-button", "decision-screen", "event-card", "swipe-left", "swipe-right",
  "card-type", "card-title", "card-body", "card-context", "choices", "result-screen",
  "result-kicker", "result-title", "result-deltas", "result-engine", "next-button",
  "replacement-screen", "replacement-copy", "replacement-grid", "ending-screen", "records-button",
  "records-dialog", "records-content", "close-records"
].map((id) => [id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), document.getElementById(id)]));

let state = null;
let resultTimer = null;

function newState(seed = Math.floor(Math.random() * 900000) + 100000) {
  return {
    version: 3,
    seed,
    round: 1,
    view: "opportunity",
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
    eventIds: chooseEvents(seed),
    selectedCardId: null,
    pendingResolution: null,
    history: [],
    rescueUsed: false,
    ending: null
  };
}

function seededValue(seed) {
  let value = seed >>> 0;
  value += 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

function chooseEvents(seed) {
  const first = Math.floor(seededValue(seed) * CONFIG.marketEvents.length);
  return [CONFIG.marketEvents[first].id, CONFIG.marketEvents[(first + 1) % CONFIG.marketEvents.length].id];
}

function eventForRound(round) {
  if (round === 4) return CONFIG.marketEvents.find((event) => event.id === state.eventIds[0]);
  if (round === 6) return CONFIG.marketEvents.find((event) => event.id === state.eventIds[1]);
  return null;
}

function upcomingEvent() {
  if (state.round <= 3) return eventForRound(4);
  if (state.round <= 5) return eventForRound(6);
  return null;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  elements.continueButton.classList.remove("hidden");
}

function hasAbility(id) {
  return state.abilities.includes(id);
}

function hasBuild(buildId) {
  return CONFIG.builds[buildId].core.every(hasAbility);
}

function buildProgress(buildId) {
  return CONFIG.builds[buildId].core.filter(hasAbility).length;
}

function dominantRoute() {
  if (state.route) return state.route;
  return Object.keys(CONFIG.builds).sort((left, right) => buildProgress(right) - buildProgress(left))[0];
}

function showScreen(screen) {
  [elements.startScreen, elements.decisionScreen, elements.replacementScreen, elements.endingScreen]
    .forEach((candidate) => candidate.classList.toggle("hidden", candidate !== screen));
  elements.hud.classList.toggle("hidden", screen === elements.startScreen);
}

function renderHud() {
  elements.roundLabel.textContent = state.round <= 6 ? `经营回合 ${state.round} / 7` : "最终危机";
  elements.crisisCountdown.textContent = state.round <= 6 ? `${7 - state.round} 回合` : "已经到来";
  elements.resources.innerHTML = RESOURCE_KEYS.map((key) => `
    <div class="resource ${state.resources[key] <= 3 ? "danger" : ""}">
      <span>${RESOURCE_NAMES[key]}</span><strong>${state.resources[key]}</strong>
    </div>`).join("");

  const route = dominantRoute();
  const build = CONFIG.builds[route];
  const statuses = {
    tech: `未发布知识 ${state.engine.knowledge} · 最佳发布 ${state.engine.bestPublication}`,
    customer: `客户价值 ${state.engine.clientValue} · 待交付 ${state.engine.pendingContracts}`,
    manufacturing: `库存 ${state.engine.inventory} · ${state.engine.inventoryMatched ? "匹配需求" : "等待窗口"}`
  };
  elements.enginePanel.style.setProperty("--build-accent", build.accent);
  elements.enginePanel.classList.toggle("uncommitted", !state.route);
  elements.abilitySlots.classList.toggle("uncommitted", !state.route);
  const engineValues = {
    tech: state.engine.knowledge,
    customer: state.engine.clientValue,
    manufacturing: state.engine.inventory
  };
  const engineLabels = { tech: "知识蓄力", customer: "客户连击", manufacturing: "库存规模" };
  const engineValue = engineValues[route];
  elements.enginePanel.innerHTML = state.route ? `
    <div class="engine-heading"><small>${build.name}</small><strong>${statuses[route]}</strong>
      <div class="engine-gauge" aria-label="${engineLabels[route]} ${engineValue} / 11"><i style="width:${Math.min(100, engineValue / 11 * 100)}%"></i></div>
    </div>
    <div class="build-track">${build.core.filter(hasAbility).map((id) => {
      const ability = CONFIG.abilities[id];
      return `<div class="build-node acquired"><span>✓</span><strong>${ability.name}</strong></div>`;
    }).join("")}</div>` : "";

  elements.abilitySlots.innerHTML = Array.from({ length: 6 }, (_, index) => {
    const ability = CONFIG.abilities[state.abilities[index]];
    return ability
      ? `<div class="ability-slot filled" tabindex="0" aria-label="${ability.name}：${ability.description}"><span>${ability.name.slice(0, 2)}</span><div class="ability-tooltip"><strong>${ability.name}</strong><small>${ability.description}</small></div></div>`
      : `<div class="ability-slot" aria-label="空能力槽"><span>+</span></div>`;
  }).join("");
}

function effectSummary(effects) {
  return RESOURCE_KEYS
    .filter((key) => effects[key])
    .map((key) => `${RESOURCE_NAMES[key]} ${effects[key] > 0 ? "+" : ""}${effects[key]}`)
    .join(" · ");
}

function cardById(id) {
  const allCards = [
    ...Object.values(CONFIG.openings),
    ...Object.values(CONFIG.routeCards).flat(),
    ...Object.values(CONFIG.actionCards),
    ...CONFIG.commonCards
  ];
  return allCards.find((card) => card.id === id);
}

function deterministicShuffle(items, salt) {
  return [...items]
    .map((item, index) => ({ item, score: seededValue(state.seed + salt * 101 + index * 977) }))
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item);
}

function opportunitiesForRound() {
  if (state.round === 1) return deterministicShuffle(Object.values(CONFIG.openings), 1);
  const route = dominantRoute();
  if (state.round === 2) {
    const alternative = Object.values(CONFIG.openings).find((card) => card.route !== route);
    return deterministicShuffle([CONFIG.routeCards[route][0], alternative, cardById("reserve")], 2);
  }
  if (state.round === 3) {
    const hybrid = CONFIG.commonCards.find((card) => card.routes.includes(route) && card.routes.length > 1);
    return deterministicShuffle([CONFIG.routeCards[route][1], hybrid, cardById("people")], 3);
  }
  const routeCard = CONFIG.actionCards[route];
  const pool = deterministicShuffle(CONFIG.commonCards.filter((card) => card.id !== routeCard.id), state.round);
  return deterministicShuffle([routeCard, ...pool.slice(0, 2)], state.round + 20);
}

function renderOpportunity() {
  state.selectedCardId = opportunitiesForRound()[0].id;
  state.view = "decision";
  save();
  renderDecision();
}

function projectedEffect(choice, key) {
  let amount = choice.effects[key] || 0;
  const willHave = (abilityId) => hasAbility(abilityId) || choice.add === abilityId;
  if (key === "talent" && choice.action === "deliver" && willHave("enterpriseClients")) {
    const canDeliver = state.engine.pendingContracts > 0 || willHave("longContract");
    if (canDeliver) {
      const deliveryCapacity = willHave("humaneSchedule") ? 2 : 1;
      amount -= Math.max(0, state.engine.pendingContracts - deliveryCapacity);
      if (willHave("jointDevelopment")) amount -= 1;
    }
  }
  return amount;
}

function isFatal(choice) {
  return RESOURCE_KEYS.some((key) => state.resources[key] + projectedEffect(choice, key) <= 0);
}

function renderDecision() {
  const card = cardById(state.selectedCardId);
  const event = eventForRound(state.round);
  const preview = upcomingEvent();
  showScreen(elements.decisionScreen);
  renderHud();
  elements.cardType.textContent = event ? `${event.name} · 回合 ${state.round}` : `${card.category} · 回合 ${state.round}`;
  elements.cardTitle.textContent = card.title;
  elements.cardBody.textContent = card.body;
  elements.cardContext.textContent = event ? `${event.description} ${card.summary}` : preview ? `${card.summary} 下回合：${preview.name}。` : card.summary;
  elements.swipeLeft.textContent = card.choices[0].label;
  elements.swipeRight.textContent = card.choices[1].label;
  resetSwipeCard();
  elements.choices.innerHTML = card.choices.map((choice, index) => `
    <button class="choice-button ${index === 0 ? "choice-left" : "choice-right"} ${isFatal(choice) ? "fatal" : ""}" type="button" data-index="${index}">
      <b>${index === 0 ? "←" : "→"}</b>
      <strong>${choice.label}</strong>
      <small>${effectSummary(choice.effects) || "改变公司状态"}${choice.add ? ` · 获得 ${CONFIG.abilities[choice.add].name}` : ""}</small>
      <span>${choice.note}</span>
      ${isFatal(choice) ? `<em>致命风险：这项决定可能让公司立即倒闭</em>` : ""}
    </button>`).join("");
  elements.choices.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => resolveChoice(Number(button.dataset.index)));
  });
  bindSwipeChoices();
}

function resetSwipeCard() {
  elements.eventCard.style.transform = "";
  elements.eventCard.classList.remove("swiping-left", "swiping-right");
}

function clearSwipeChoices() {
  elements.eventCard.onpointerdown = null;
  elements.eventCard.onpointermove = null;
  elements.eventCard.onpointerup = null;
  elements.eventCard.onpointercancel = null;
  elements.eventCard.onkeydown = null;
  resetSwipeCard();
}

function bindSwipeChoices() {
  let startX = null;
  let offset = 0;
  elements.eventCard.onpointerdown = (event) => {
    if (event.target.closest("details")) return;
    startX = event.clientX;
    offset = 0;
    elements.eventCard.setPointerCapture(event.pointerId);
  };
  elements.eventCard.onpointermove = (event) => {
    if (startX === null) return;
    offset = Math.max(-180, Math.min(180, event.clientX - startX));
    elements.eventCard.style.transform = `translateX(${offset}px) rotate(${offset / 35}deg)`;
    elements.eventCard.classList.toggle("swiping-left", offset < -24);
    elements.eventCard.classList.toggle("swiping-right", offset > 24);
  };
  elements.eventCard.onpointerup = () => {
    startX = null;
    if (Math.abs(offset) >= 90) {
      resolveChoice(offset < 0 ? 0 : 1);
      return;
    }
    resetSwipeCard();
  };
  elements.eventCard.onpointercancel = () => { startX = null; resetSwipeCard(); };
  elements.eventCard.onkeydown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    resolveChoice(event.key === "ArrowLeft" ? 0 : 1);
  };
}

function clamp(value) {
  return Math.max(0, Math.min(20, value));
}

function applyResourceEffects(effects) {
  const actual = {};
  Object.entries(effects).forEach(([key, amount]) => {
    const before = state.resources[key];
    state.resources[key] = clamp(before + amount);
    actual[key] = state.resources[key] - before;
  });
  return actual;
}

function addAbility(id) {
  if (!id || hasAbility(id)) return null;
  if (state.abilities.length < 6) {
    state.abilities.push(id);
    return id;
  }
  return id;
}

function advanceLevel(key) {
  state.engine[key] = Math.min(4, state.engine[key] + 1);
  return GROWTH_LEVELS[state.engine[key]];
}

function processEngine(action) {
  const notes = [];
  if (action === "research" && hasAbility("researchTeam")) {
    const gain = hasAbility("advancedLab") ? advanceLevel("knowledgeLevel") : 2;
    state.engine.knowledge = Math.min(20, state.engine.knowledge + gain);
    notes.push(`研究积累 ${gain} 点知识，当前未发布知识 ${state.engine.knowledge}。`);
  }
  if (action === "publish" && hasAbility("ownProduct")) {
    const quality = Math.max(2, state.engine.knowledge);
    const retained = hasAbility("techLicense") ? Math.floor(state.engine.knowledge / 2) : 0;
    const cashGain = Math.max(1, Math.floor(quality / 2));
    const marketGain = hasAbility("techLicense") ? Math.max(1, Math.floor(quality / 4)) : Math.max(1, Math.floor(quality / 2));
    applyResourceEffects({ cash: cashGain, market: marketGain });
    state.engine.bestPublication = Math.max(state.engine.bestPublication, quality);
    state.engine.knowledge = retained;
    notes.push(`产品以质量 ${quality} 发布，带来资金 ${cashGain}、市场 ${marketGain}${retained ? `，授权保留知识 ${retained}` : ""}。`);
  }
  if (action === "contract" && hasAbility("enterpriseClients")) {
    state.engine.pendingContracts += 1;
    if (state.engine.clientLevel === 0) {
      state.engine.clientLevel = 1;
      state.engine.clientValue = 2;
    }
    notes.push(`新增 1 份待交付合同，客户基础价值 ${state.engine.clientValue}，当前待交付 ${state.engine.pendingContracts}。`);
  }
  if (action === "deliver" && hasAbility("enterpriseClients")) {
    const deliveryCapacity = hasAbility("humaneSchedule") ? 2 : 1;
    const talentCost = Math.max(0, state.engine.pendingContracts - deliveryCapacity);
    const canDeliver = state.engine.pendingContracts > 0 || hasAbility("longContract");
    if (canDeliver) {
      applyResourceEffects({ talent: -talentCost });
      const value = hasAbility("salesNetwork") ? advanceLevel("clientLevel") : 2;
      state.engine.clientValue = value;
      state.engine.bestDeliveryStreak = Math.max(state.engine.bestDeliveryStreak, state.engine.clientLevel);
      state.engine.pendingContracts = Math.max(0, state.engine.pendingContracts - 1);
      const cashGain = hasAbility("longContract") ? Math.max(1, Math.floor(value / 2)) : 1;
      applyResourceEffects({ cash: cashGain });
      notes.push(`交付成功，客户网络价值 ${value}，收入 ${cashGain}，人才消耗 ${talentCost}。`);
      if (hasAbility("jointDevelopment")) {
        applyResourceEffects({ talent: -1 });
        const knowledgeGain = hasAbility("researchTeam") ? 2 : 1;
        state.engine.knowledge = Math.min(20, state.engine.knowledge + knowledgeGain);
        notes.push(`联合开发额外推进 ${knowledgeGain} 点知识，并消耗 1 人才。`);
      }
    } else {
      state.engine.clientLevel = 0;
      state.engine.clientValue = 0;
      applyResourceEffects({ market: -3 });
      notes.push("团队无法交付，客户连击归零，市场损失 3。");
    }
  }
  if (action === "produce" && hasAbility("productionBase")) {
    if (state.resources.cash > 0) {
      const amount = hasAbility("processControl") ? advanceLevel("inventoryLevel") : 2;
      state.engine.inventory = Math.min(20, state.engine.inventory + amount);
      notes.push(`生产 ${amount} 批库存，当前库存 ${state.engine.inventory}。`);
    }
  }
  if (action === "ship" && hasAbility("strategicStock") && state.engine.inventory > 0) {
    const event = eventForRound(state.round);
    const demand = event?.demand || 1;
    const matched = demand >= 1 || hasAbility("flexibleLine");
    const revenue = matched ? Math.ceil(state.engine.inventory * demand) : Math.floor(state.engine.inventory / 2);
    applyResourceEffects({ cash: revenue, market: matched ? 2 : -1 });
    state.engine.bestShipment = Math.max(state.engine.bestShipment, revenue);
    state.engine.inventoryMatched = matched;
    notes.push(`库存出货获得资金 ${revenue}${matched ? "，需求匹配" : "，需求不足导致折价"}。`);
    state.engine.inventory = 0;
    state.engine.inventoryLevel = 0;
  }
  return notes;
}

function routeFromAbility(id) {
  const build = CONFIG.abilities[id]?.build;
  return CONFIG.builds[build] ? build : null;
}

function resolveChoice(index) {
  const card = cardById(state.selectedCardId);
  const choice = card.choices[index];
  const before = { ...state.resources };
  const added = addAbility(choice.add);
  if (!state.route && added) state.route = routeFromAbility(added);
  const actual = applyResourceEffects(choice.effects);
  const engineNotes = processEngine(choice.action);
  const resolution = { card, choice, before, actual, added, engineNotes };

  if (added && state.abilities.length === 6 && !state.abilities.includes(added)) {
    state.pendingResolution = resolution;
    renderReplacement(added);
    return;
  }
  finalizeResolution(resolution);
}

function renderReplacement(newAbilityId) {
  state.view = "replacement";
  save();
  showScreen(elements.replacementScreen);
  renderHud();
  const newAbility = CONFIG.abilities[newAbilityId];
  elements.replacementCopy.textContent = `要安装“${newAbility.name}”，必须拆除一项旧能力。知识可能流失，合同可能违约，库存也不会因为董事会投票而停止折旧。`;
  elements.replacementGrid.innerHTML = state.abilities.map((id) => {
    const ability = CONFIG.abilities[id];
    return `<button type="button" data-ability="${id}"><small>${ability.kind}</small><strong>拆除 ${ability.name}</strong><span>${ability.description}</span></button>`;
  }).join("");
  elements.replacementGrid.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => replaceAbility(button.dataset.ability, newAbilityId));
  });
}

function replaceAbility(oldId, newId) {
  state.abilities[state.abilities.indexOf(oldId)] = newId;
  const losses = [];
  if (oldId === "officeLease") {
    applyResourceEffects({ cash: -1 });
    losses.push("支付 1 资金解约金");
  }
  if (CONFIG.builds.tech.core.includes(oldId)) {
    state.engine.knowledge = Math.floor(state.engine.knowledge / 2);
    losses.push("未发布知识损失一半");
  }
  if (CONFIG.builds.customer.core.includes(oldId)) {
    state.engine.clientLevel = 0;
    state.engine.clientValue = 0;
    state.engine.pendingContracts = 0;
    losses.push("客户连击与待交付合同清空");
  }
  if (CONFIG.builds.manufacturing.core.includes(oldId)) {
    state.engine.inventory = Math.floor(state.engine.inventory / 2);
    state.engine.inventoryLevel = 0;
    losses.push("库存减半，批量等级归零");
  }
  const resolution = state.pendingResolution;
  resolution.replacement = `拆除“${CONFIG.abilities[oldId].name}”：${losses.join("；") || "没有额外损失"}。`;
  state.pendingResolution = null;
  finalizeResolution(resolution);
}

function maybeRescue() {
  const failedKey = RESOURCE_KEYS.find((key) => state.resources[key] <= 0);
  if (!failedKey) return null;
  if (state.rescueUsed || !state.abilities.length) return { failed: true, key: failedKey };
  const sacrificed = state.abilities.shift();
  state.resources[failedKey] = 1;
  state.rescueUsed = true;
  return { failed: false, key: failedKey, sacrificed };
}

function finalizeResolution(resolution) {
  const rescue = maybeRescue();
  state.history.push({
    round: state.round,
    card: resolution.card.title,
    choice: resolution.choice.label,
    effects: RESOURCE_KEYS.reduce((output, key) => ({ ...output, [key]: state.resources[key] - resolution.before[key] }), {}),
    ability: resolution.added,
    rescue
  });
  if (rescue?.failed) {
    state.ending = { type: "failure", reason: `${RESOURCE_NAMES[rescue.key]}归零` };
    save();
    renderEnding();
    return;
  }
  state.pendingResolution = resolution;
  settleRound();
  showResultToast(resolution);
}

function showResultToast(resolution) {
  clearTimeout(resultTimer);
  elements.resultKicker.textContent = resolution.added ? `能力入槽 · ${CONFIG.abilities[resolution.added].name}` : "经营结果";
  elements.resultTitle.textContent = resolution.choice.headline;
  elements.resultDeltas.innerHTML = RESOURCE_KEYS.filter((key) => state.resources[key] !== resolution.before[key]).map((key) => {
    const delta = state.resources[key] - resolution.before[key];
    return `<span class="${delta > 0 ? "positive" : delta < 0 ? "negative" : ""}">${RESOURCE_NAMES[key]} ${delta > 0 ? "+" : ""}${delta}</span>`;
  }).join("");
  elements.resultEngine.textContent = [...resolution.engineNotes, resolution.replacement].filter(Boolean).join(" ");
  elements.resultEngine.classList.toggle("hidden", !elements.resultEngine.textContent);
  elements.resultScreen.classList.remove("hidden");
  resultTimer = setTimeout(hideResultToast, 3200);
}

function hideResultToast() {
  clearTimeout(resultTimer);
  elements.resultScreen.classList.add("hidden");
}

function settleRound() {
  if (state.round >= 6) {
    state.round = 7;
    state.pendingResolution = null;
    renderCrisis();
    return;
  }
  state.round += 1;
  state.pendingResolution = null;
  renderOpportunity();
}

function crisisEvaluation(route) {
  const cashCost = hasAbility("cashReserve") ? 1 : 3;
  const marketLoss = hasAbility("diverseMarket") ? 2 : 4;
  const checks = {
    tech: {
      business: state.engine.bestPublication >= 7 || hasAbility("techLicense"),
      survival: state.resources.cash >= cashCost && state.resources.talent >= 4,
      detail: `已发布质量 ${state.engine.bestPublication}；需支付资金 ${cashCost}，人才至少 4。`
    },
    customer: {
      business: state.engine.clientValue >= 7 || hasAbility("humaneSchedule"),
      survival: state.resources.talent >= 6 && state.engine.pendingContracts === 0,
      detail: `客户网络价值 ${state.engine.clientValue}；需人才至少 6，且没有待交付合同。`
    },
    manufacturing: {
      business: state.engine.bestShipment >= 7 || hasAbility("flexibleLine"),
      survival: state.resources.cash >= 3,
      detail: `最佳出货收入 ${state.engine.bestShipment}；危机前资金需至少 3。`
    }
  };
  return { ...checks[route], cashCost, marketLoss };
}

function renderCrisis() {
  state.view = "crisis";
  save();
  showScreen(elements.decisionScreen);
  renderHud();
  clearSwipeChoices();
  elements.swipeLeft.textContent = "";
  elements.swipeRight.textContent = "";
  const route = dominantRoute();
  const evaluation = crisisEvaluation(route);
  elements.cardType.textContent = "最终危机 · 订单冻结";
  elements.cardTitle.textContent = "银行重新阅读了你的商业计划";
  elements.cardBody.textContent = "客户冻结订单，银行冻结贷款。唯一没有冻结的是工资日。完整 Build 只能回答你靠什么活，不能回答你还能活多久。";
  elements.cardContext.textContent = `${CONFIG.builds[route].name}业务条件：${evaluation.business ? "已满足" : "未满足"}。生存条件：${evaluation.survival ? "已满足" : "未满足"}。${evaluation.detail}`;
  elements.choices.innerHTML = `
    <button class="choice-button" type="button" data-crisis="protect"><strong>保护核心业务</strong><span>支付资金 ${evaluation.cashCost}，承受市场损失 ${evaluation.marketLoss}</span></button>
    <button class="choice-button" type="button" data-crisis="cut"><strong>收缩公司求生</strong><span>拆除一项能力，减少损失，但放弃爆发结局</span></button>`;
  elements.choices.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => resolveCrisis(button.dataset.crisis)));
}

function resolveCrisis(mode) {
  const route = dominantRoute();
  const evaluation = crisisEvaluation(route);
  let outcome;
  if (mode === "cut") {
    const sacrificed = state.abilities.pop();
    applyResourceEffects({ cash: -1, market: -1 });
    outcome = { full: false, cut: true, body: `公司拆除了“${CONFIG.abilities[sacrificed]?.name || "最后一项能力"}”。规模缩小了，讣告暂缓刊登。` };
  } else {
    applyResourceEffects({ cash: -evaluation.cashCost, market: -evaluation.marketLoss });
    const full = evaluation.business && evaluation.survival;
    if (!full) applyResourceEffects({ talent: -3, tech: -2 });
    outcome = {
      full,
      cut: false,
      body: full
        ? `${CONFIG.builds[route].name}同时满足业务与生存条件，公司完整穿过订单冻结。`
        : `公司只有一半答案。银行完整地拒绝了另一半。`
    };
  }
  const rescue = maybeRescue();
  const routeAchievement = route === "tech"
    ? state.engine.bestPublication >= 7
    : route === "customer" ? state.engine.bestDeliveryStreak >= 3 : state.engine.bestShipment >= 7;
  const failed = rescue?.failed;
  state.ending = {
    type: failed ? "failure" : outcome.full && hasBuild(route) && routeAchievement ? "breakout" : "survivor",
    route,
    outcome,
    rescue,
    reason: failed ? `${RESOURCE_NAMES[rescue.key]}归零` : null
  };
  state.history.push({ round: 7, card: "订单冻结", choice: mode === "cut" ? "收缩公司求生" : "保护核心业务", effects: {}, ability: null, rescue });
  save();
  renderEnding();
}

function renderEnding() {
  state.view = "ending";
  save();
  showScreen(elements.endingScreen);
  renderHud();
  const ending = state.ending;
  const route = CONFIG.builds[ending.route || dominantRoute()];
  const titles = { breakout: `${route.name}穿过了寒冬`, survivor: "公司活着，飞轮散了", failure: "公司成为一段行业经验" };
  const bodies = {
    breakout: `你的增长引擎不仅完整，而且在危机前证明过自己。董事会宣布战略正确，并迅速删掉了所有曾经反对它的会议记录。`,
    survivor: ending.outcome?.body || "公司没有倒闭，但也没有带着完整引擎离开危机。活着是一种成绩，只是不适合印在招股书封面。",
    failure: `${ending.reason}。公司停止经营，剩余资产包括六把椅子、三份战略报告和一条非常清晰的教训。`
  };
  const achievements = `知识最高发布 ${state.engine.bestPublication} · 最长交付连击 ${state.engine.bestDeliveryStreak} · 最大出货收入 ${state.engine.bestShipment}`;
  elements.endingScreen.innerHTML = `
    <div class="ending-badge">${ending.type === "breakout" ? "BUILD 爆发" : ending.type === "survivor" ? "勉强幸存" : "公司倒闭"}</div>
    <h2>${titles[ending.type]}</h2>
    <p>${bodies[ending.type]}</p>
    <div class="ending-summary">
      <div><small>公司形态</small><strong>${route.name} · ${route.verbs}</strong></div>
      <div><small>路线成绩</small><strong>${achievements}</strong></div>
      <div><small>市场种子</small><strong>${state.seed}</strong></div>
    </div>
    <h3>关键决策</h3>
    <ol>${state.history.slice(-4).map((item) => `<li>回合 ${item.round} · ${item.card}：${item.choice}</li>`).join("")}</ol>
    <div class="ending-actions">
      <button id="retry-seed" class="primary-button" type="button">相同市场重试</button>
      <button id="new-seed" class="secondary-button" type="button">生成新市场</button>
    </div>`;
  document.getElementById("retry-seed").addEventListener("click", () => startGame(state.seed));
  document.getElementById("new-seed").addEventListener("click", () => startGame());
}

function renderRecords() {
  elements.recordsContent.innerHTML = `
    <p>市场种子：${state?.seed || "尚未成立"}</p>
    <h3>能力</h3>
    ${state?.abilities.length ? `<ul>${state.abilities.map((id) => `<li><strong>${CONFIG.abilities[id].name}</strong>：${CONFIG.abilities[id].description}</li>`).join("")}</ul>` : "<p>空。很适合存放愿景。</p>"}
    <h3>决策记录</h3>
    ${state?.history.length ? `<ol>${state.history.map((item) => `<li>回合 ${item.round} · ${item.card}：${item.choice}</li>`).join("")}</ol>` : "<p>尚无记录。</p>"}`;
}

function startGame(seed) {
  state = newState(seed);
  save();
  renderOpportunity();
}

function isValidSave(saved) {
  const views = ["opportunity", "decision", "replacement", "crisis", "ending"];
  if (!saved || saved.version !== 3 || !views.includes(saved.view)) return false;
  if (saved.view === "decision" && !cardById(saved.selectedCardId)) return false;
  if (saved.view === "replacement" && !saved.pendingResolution?.choice) return false;
  if (saved.view === "replacement" && !CONFIG.abilities[saved.pendingResolution.added]) return false;
  return saved.view !== "ending" || Boolean(saved.ending);
}

function resumeGame() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!isValidSave(saved)) return startGame();
  state = saved;
  if (state.view === "opportunity") renderOpportunity();
  else if (state.view === "decision") renderDecision();
  else if (state.view === "replacement") renderReplacement(state.pendingResolution?.added);
  else if (state.view === "crisis") renderCrisis();
  else renderEnding();
}

elements.startButton.addEventListener("click", () => startGame());
elements.continueButton.addEventListener("click", resumeGame);
elements.nextButton.addEventListener("click", hideResultToast);
elements.recordsButton.addEventListener("click", () => { renderRecords(); elements.recordsDialog.showModal(); });
elements.closeRecords.addEventListener("click", () => elements.recordsDialog.close());

if (localStorage.getItem(STORAGE_KEY)) elements.continueButton.classList.remove("hidden");
