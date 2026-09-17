"use strict";

const STORAGE_KEY = "silicon-road-prototype-v1";
const STATE_VERSION = 4;
const STAT_NAMES = { cash: "资金", tech: "技术", talent: "人才", market: "市场", reputation: "声誉" };
const VISIBLE_STATS = ["cash", "tech", "talent", "market"];
const TYPE_NAMES = {
  opening: "开局牌",
  order: "订单牌",
  tech: "技术牌",
  person: "人物牌",
  product: "产品牌",
  operation: "经营牌",
  oddity: "怪事牌",
  risk: "风险牌",
  publicity: "宣传牌",
  turning: "时代转折",
  market: "市场牌",
  warning: "危机预告",
  crisis: "危机牌",
  external: "外部事件",
  competitor: "竞争对手",
  supply: "上下游关系",
  personnel: "内部人员",
  governance: "公司治理",
  management: "经营决策"
};

const tagNames = {
  selfStart: "自研起点",
  serviceBusiness: "服务生意",
  enterpriseClients: "企业客户",
  ownProduct: "自主产品",
  governmentContract: "政府合同",
  publicResearch: "公开研究",
  openTech: "开放技术",
  patents: "专利组合",
  shenEmployed: "沈岚在职",
  shenShares: "沈岚持股 8%",
  shenLeft: "沈岚离开",
  consumerElectronics: "消费电子",
  ownFactory: "自有工厂",
  outsourced: "外包生产",
  gameLab: "游戏实验",
  gameBanned: "游戏被禁",
  coffeePrototype: "咖啡机原型",
  normalCoffee: "普通咖啡机",
  challengeGiant: "挑战巨头",
  patentDependence: "专利依赖",
  publicDemo: "公众演示",
  chipShift: "芯片转型",
  delayedShift: "延迟转型",
  exclusiveContract: "独占合同",
  clientDependence: "大客户依赖",
  independentChannel: "独立渠道",
  modernFactory: "现代工厂",
  oldFactory: "老旧工厂",
  stableFoundry: "稳定代工",
  cheapFoundry: "廉价代工",
  pioneerChip: "先锋芯片组",
  shenGone: "沈岚出走",
  shenPartner: "沈岚合作",
  shenRival: "沈岚竞争",
  homeComputer: "家庭电脑",
  missedHome: "错过家庭市场",
  priceWar: "价格战",
  brandDefense: "品牌保卫战",
  lowPower: "低功耗技术",
  highPrice: "高价策略",
  responsibleRecall: "负责召回",
  coveredAccident: "掩盖事故",
  designAutomation: "设计自动化",
  manualDesign: "手工设计",
  inventoryControlled: "库存受控",
  excessInventory: "库存过剩",
  crisisLoan: "危机贷款",
  soldTech: "出售技术",
  researchEmber: "研发火种",
  channelSurvivor: "渠道幸存",
  routeCpu: "挑战者路线",
  routeGpu: "图形计算路线",
  routeFab: "专业制造路线",
  cpuCompatible: "兼容处理器",
  cpuFabless: "轻制造设计公司",
  cpuValue: "价格挑战者",
  cpuContinuity: "兼容升级",
  graphicsCore: "图形核心",
  programmableGraphics: "可编程图形",
  developerEcosystem: "开发者生态",
  parallelCompute: "并行计算",
  neutralFoundry: "中立代工",
  fabCounterCycle: "逆周期扩产",
  yieldCulture: "良率文化",
  customerTrust: "客户信任",
  legacyTrap: "主机利润陷阱",
  selfCannibalize: "主动淘汰旧产品",
  talentExodus: "人才出走",
  technicalPartners: "技术合伙人",
  verticalEmpire: "垂直帝国",
  modularBusiness: "模块化合作",
  committeeCompany: "委员会公司",
  skunkworks: "秘密项目组",
  bubbleDebt: "泡沫债务",
  coreProtected: "危机中保护核心",
  abandonedStrategy: "放弃长期战略",
  rivalShares: "持有竞争对手股份",
  rivalEnemy: "公开竞争关系",
  premiumPosition: "高价定位",
  talentPoaching: "竞争挖角",
  fairHiring: "公平招聘",
  startupPortfolio: "创业公司组合",
  dirtyCompetition: "匿名攻击",
  fairCompetition: "公开竞争",
  dualSupply: "双供应链",
  singleSupplier: "单一供应商",
  reservedCapacity: "预订产能",
  qualityGate: "质量闸门",
  qualityDebt: "质量债务",
  bufferStock: "战略库存",
  leanSupply: "即时采购",
  ethicalSupply: "供应链审计",
  supplyScandal: "供应链丑闻",
  employeeEquity: "员工持股",
  fairPay: "公平薪酬",
  nepotism: "裙带任命",
  meritHiring: "公开招聘",
  honestBooks: "保守财务",
  accountingScandal: "财务丑闻",
  crunchCulture: "通宵文化",
  sustainableTeam: "可持续团队",
  researchFreedom: "自由研究",
  salesLed: "订单驱动研发",
  salesMachine: "高额销售佣金",
  teamBonus: "团队奖金",
  openStandard: "开放标准",
  closedStandard: "封闭接口",
  policyNetwork: "政策网络",
  secureSystems: "安全系统",
  securityDebt: "安全债务",
  privacyTrust: "隐私信任",
  privacyScandal: "隐私丑闻",
  shareholderFirst: "股东优先",
  retainedEarnings: "保留利润",
  moonshot: "长期秘密项目",
  incrementalism: "渐进改良"
};

const cards = window.GAME_CONFIG.cards;
const conditionalCards = window.GAME_CONFIG.conditionalCards;
const companyActionConfig = window.GAME_CONFIG.companyActions;
const managementConfig = window.GAME_CONFIG.management;
const annualConfig = window.GAME_CONFIG.annual;
const balanceConfig = window.GAME_CONFIG.balance;

const routeMilestones = {
  cpu: ["cpuCompatible", "cpuFabless", "cpuValue", "cpuContinuity"],
  gpu: ["graphicsCore", "programmableGraphics", "developerEcosystem", "parallelCompute"],
  fab: ["neutralFoundry", "fabCounterCycle", "yieldCulture", "customerTrust"]
};
const reputationByTag = {
  publicResearch: 3,
  openTech: 2,
  challengeGiant: 2,
  patentDependence: -2,
  responsibleRecall: 5,
  coveredAccident: -8,
  stableFoundry: 2,
  cheapFoundry: -3,
  technicalPartners: 3,
  talentExodus: -5,
  neutralFoundry: 4,
  customerTrust: 7,
  verticalEmpire: -2,
  bubbleDebt: -3,
  coreProtected: 2
};

let state = null;
let showDeveloperValues = false;

const elements = {
  stats: document.querySelector("#stats"),
  landscapeYearSlot: document.querySelector("#landscape-year-slot"),
  startScreen: document.querySelector("#start-screen"),
  gameScreen: document.querySelector("#game-screen"),
  newspaperScreen: document.querySelector("#newspaper-screen"),
  endingScreen: document.querySelector("#ending-screen"),
  startButton: document.querySelector("#start-button"),
  continueButton: document.querySelector("#continue-button"),
  debugValuesButton: document.querySelector("#debug-values-button"),
  recordsButton: document.querySelector("#records-button"),
  recordsDialog: document.querySelector("#records-dialog"),
  closeRecords: document.querySelector("#close-records"),
  recordsContent: document.querySelector("#records-content"),
  yearContext: document.querySelector(".year-context"),
  year: document.querySelector("#year"),
  phaseLabel: document.querySelector("#phase-label"),
  progress: document.querySelector("#progress"),
  yearArrival: document.querySelector("#year-arrival"),
  arrivalYear: document.querySelector("#arrival-year"),
  arrivalNote: document.querySelector("#arrival-note"),
  yearLedger: document.querySelector("#year-ledger"),
  decisionStage: document.querySelector("#decision-stage"),
  eventCard: document.querySelector("#event-card"),
  cardType: document.querySelector("#card-type"),
  cardTitle: document.querySelector("#card-title"),
  cardBody: document.querySelector("#card-body"),
  inlineImpact: document.querySelector("#inline-impact"),
  impactHeadline: document.querySelector("#impact-headline"),
  impactBody: document.querySelector("#impact-body"),
  impactSettlement: document.querySelector("#impact-settlement"),
  choices: document.querySelector("#choices"),
  tutorialOverlay: document.querySelector("#tutorial-overlay"),
  tutorialCopy: document.querySelector("#tutorial-copy"),
  paperDate: document.querySelector("#paper-date"),
  resultMedium: document.querySelector("#result-medium"),
  mediumTitle: document.querySelector("#medium-title"),
  mediumMeta: document.querySelector("#medium-meta"),
  paperSection: document.querySelector("#paper-section"),
  paperHeadline: document.querySelector("#paper-headline"),
  paperBody: document.querySelector("#paper-body"),
  settlement: document.querySelector("#settlement"),
  recordNote: document.querySelector("#record-note"),
  nextHint: document.querySelector("#next-hint")
};

function choice(label, effects, headline, result, add = [], remove = [], requires = null, management = null) {
  return { label, effects, headline, result, add, remove: remove || [], requires, management };
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function annualCardId(kind, year, cardId) {
  return `ANNUAL:${kind}:${year}:${cardId}`;
}

function parseAnnualCardId(cardId) {
  if (!cardId?.startsWith("ANNUAL:")) return null;
  const [, kind, year, contentId] = cardId.split(":");
  return { kind, year: Number(year), contentId };
}

function isFinalAnnualDecision(cardId, year) {
  const nextId = state.sequence[state.index + 1];
  if (!nextId) return false;
  const next = parseAnnualCardId(nextId);
  if (next) return next.kind !== "decision" || next.year !== year;
  if (["CRISIS_SETTLEMENT", "SECOND_CRISIS_SETTLEMENT"].includes(nextId)) return true;
  return getCard(nextId)?.year !== year;
}

function drawAnnualDecisions(year, count, usedCards) {
  const selected = [];
  const selectedCategories = new Set();
  while (selected.length < count) {
    const eligible = Object.entries(annualConfig.decisionCards)
      .filter(([cardId, card]) => !selected.includes(cardId)
        && year >= (card.minYear || annualConfig.startYear)
        && year <= (card.maxYear || annualConfig.endYear));
    let candidates = eligible.filter(([cardId, card]) => !usedCards.has(cardId) && !selectedCategories.has(card.category));
    if (!candidates.length) candidates = eligible.filter(([cardId]) => !usedCards.has(cardId));
    if (!candidates.length) {
      usedCards.clear();
      candidates = eligible.filter(([, card]) => !selectedCategories.has(card.category));
    }
    if (!candidates.length) candidates = eligible;
    const [cardId, card] = candidates[Math.floor(Math.random() * candidates.length)];
    selected.push(cardId);
    selectedCategories.add(card.category);
    usedCards.add(cardId);
  }
  return selected.map((cardId) => annualCardId("decision", year, cardId));
}

function drawExternalEvent(year, usedEvents) {
  let eligible = Object.entries(annualConfig.externalEvents)
    .filter(([eventId, event]) => !usedEvents.has(eventId)
      && year >= (event.minYear || annualConfig.startYear)
      && year <= (event.maxYear || annualConfig.endYear));
  if (!eligible.length) {
    usedEvents.clear();
    eligible = Object.entries(annualConfig.externalEvents)
      .filter(([, event]) => year >= (event.minYear || annualConfig.startYear)
        && year <= (event.maxYear || annualConfig.endYear));
  }
  const [eventId] = eligible[Math.floor(Math.random() * eligible.length)];
  usedEvents.add(eventId);
  return annualCardId("event", year, eventId);
}

function buildFirstEraSequence() {
  const sequence = [];
  const usedCards = new Set();
  const usedEvents = new Set();
  for (let year = annualConfig.startYear; year <= 1982; year += 1) {
    const mandatory = annualConfig.timeline.firstEra[year] || [];
    const decisions = [...mandatory, ...drawAnnualDecisions(year, annualConfig.decisionsPerYear - mandatory.length, usedCards)];
    if (year === 1982) sequence.push(...decisions, "CRISIS_SETTLEMENT");
    else sequence.push(drawExternalEvent(year, usedEvents), ...decisions);
  }
  return sequence;
}

function newState() {
  return {
    stats: { cash: 50, tech: 50, talent: 50, market: 50 },
    reputation: 50,
    tags: [],
    history: [],
    sequence: buildFirstEraSequence(),
    index: 0,
    view: "card",
    pendingResult: null,
    lastAnnualSettlementYear: null,
    annualSettlement: null,
    annualStart: null,
    annualExternalChanges: null,
    marketCondition: null,
    checkpoint: null,
    endingType: null,
    annualMode: true,
    tutorialDismissed: [],
    stateVersion: STATE_VERSION
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasTag(tag) {
  return state.tags.includes(tag);
}

function addTags(tags) {
  tags.forEach((tag) => {
    if (!state.tags.includes(tag)) state.tags.push(tag);
  });
}

function removeTags(tags) {
  state.tags = state.tags.filter((tag) => !tags.includes(tag));
}

function getCard(cardId) {
  const annualCard = parseAnnualCardId(cardId);
  if (annualCard?.kind === "decision") {
    const configuredCard = clone(annualConfig.decisionCards[annualCard.contentId]);
    return { ...configuredCard, year: annualCard.year, type: configuredCard.category };
  }
  if (annualCard?.kind === "event") return getExternalEventCard(annualCard.contentId, annualCard.year);
  if (cardId.startsWith("MANAGEMENT_")) return getManagementCard(cardId);
  if (cardId === "E10") return clone(conditionalCards.E10[hasTag("ownFactory") ? "ownFactory" : "default"]);
  if (cardId === "P02") return clone(conditionalCards.P02[hasTag("shenEmployed") ? "shenEmployed" : "default"]);

  const card = clone(cards[cardId]);
  if (!card) return null;

  if (cardId === "E11" && hasTag("gameLab")) {
    card.choices[0].effects.market += 5;
    card.choices[0].result += " 当年那两个互相射击的方块，如今成了顾客排队购买的理由。";
  }

  if (cardId === "E12" && hasTag("patents")) {
    card.choices[1].effects.cash += 14;
    card.choices[1].effects.market += 5;
    card.choices[1].result = "法庭确认那个字母属于你。律师带着赔偿金回来，并建议公司以后多发明几个字母。";
  }

  if (cardId === "C02" && hasTag("patents")) {
    card.choices[1].effects.cash += 6;
    card.choices[1].result += " 多年的专利文件终于产生了除占柜子之外的用途。";
  }

  if (cardId === "RCPU1" && (hasTag("pioneerChip") || hasTag("designAutomation"))) {
    card.choices[0].effects.tech += 5;
    card.choices[0].result += " 早年的芯片团队让这次挑战少走了两年弯路。";
  }

  if (cardId === "RGPU1" && hasTag("gameLab")) {
    card.choices[0].effects.market += 7;
    card.choices[0].result += " 夜班游戏留下的玩家名单，第一次被财务部门称为市场研究。";
  }

  if (cardId === "RFAB1" && hasTag("stableFoundry")) {
    card.choices[0].effects.market += 5;
    card.choices[0].result += " 多年的代工经验让第一批客户愿意相信你的承诺。";
  }

  if (cardId === "RFAB2" && hasTag("modernFactory")) {
    card.choices[0].effects.cash += 6;
    card.choices[0].result += " 早期升级的厂房替你省下了一部分改造费用。";
  }

  return card;
}

function getExternalEventCard(eventId, year) {
  const event = annualConfig.externalEvents[eventId];
  const outcome = event.variants?.find((variant) => variant.requires.every((tag) => hasTag(tag))) || event.defaultOutcome;
  return {
    year,
    type: "external",
    title: event.title,
    body: event.body,
    choices: [choice(
      "查看公司受到的影响",
      outcome.effects,
      outcome.headline,
      outcome.result,
      outcome.add || [],
      outcome.remove || []
    )]
  };
}

function getManagementCard(cardId) {
  const year = managementConfig.years[cardId];
  const cardNumber = Number(cardId.slice("MANAGEMENT_".length));
  const firstPlanIndex = (cardNumber - 1) % managementConfig.plans.length;
  const plans = clone([
    managementConfig.plans[firstPlanIndex],
    managementConfig.plans[(firstPlanIndex + 1) % managementConfig.plans.length]
  ]);

  return {
    year,
    type: "management",
    title: managementConfig.title,
    body: managementConfig.body,
    choices: plans.map((plan) => choice(
      plan.label,
      { ...plan.effects, cash: -plan.budgetCost },
      plan.headline,
      plan.result,
      [],
      [],
      null,
      {
        actionId: plan.actionId,
        budgetLabel: plan.budgetLabel,
        budgetCost: plan.budgetCost,
        previewEffects: {
          ...plan.previewEffects,
          cash: -plan.budgetCost
        }
      }
    ))
  };
}

function roundStatChange(value) {
  return value < 0 ? -Math.round(Math.abs(value)) : Math.round(value);
}

function rollMarketCondition(reportYear, random = Math.random, range = null) {
  const config = balanceConfig.economy.marketFluctuation;
  const minimum = range?.minimum ?? config.minimum;
  const maximum = range?.maximum ?? config.maximum;
  const stepCount = Math.round((maximum - minimum) / config.step);
  const multiplier = Number((minimum + randomInteger(0, stepCount, random) * config.step).toFixed(2));
  const label = multiplier <= config.downturnMaximum
    ? "低迷行情"
    : multiplier >= config.boomMinimum ? "繁荣行情" : "平稳行情";
  return { year: reportYear, multiplier, label, marketChange: 0 };
}

function marketConditionFor(reportYear) {
  if (state.marketCondition?.year === reportYear && typeof state.marketCondition.multiplier === "number") {
    return state.marketCondition;
  }
  return rollMarketCondition(reportYear);
}

function beginAnnualMarket(reportYear) {
  const annualCard = parseAnnualCardId(state.sequence[state.index]);
  const event = annualCard?.kind === "event" && annualCard.year === reportYear
    ? annualConfig.externalEvents[annualCard.contentId]
    : null;
  const existingCondition = state.marketCondition?.year === reportYear
    && typeof state.marketCondition.multiplier === "number"
    ? state.marketCondition
    : null;
  if (existingCondition) {
    const range = event?.marketMultiplier;
    if (!range || (existingCondition.multiplier >= range.minimum && existingCondition.multiplier <= range.maximum)) return;
    const startingMarket = state.annualStart?.year === reportYear
      ? state.annualStart.stats.market
      : state.stats.market - (existingCondition.marketChange || 0);
    const condition = rollMarketCondition(reportYear, Math.random, range);
    const marketTarget = Math.round(startingMarket * condition.multiplier);
    condition.marketChange = applyEffects({ market: marketTarget - state.stats.market }).market;
    state.marketCondition = condition;
    return;
  }
  const condition = rollMarketCondition(reportYear, Math.random, event?.marketMultiplier);
  const marketTarget = Math.round(state.stats.market * condition.multiplier);
  condition.marketChange = applyEffects({ market: marketTarget - state.stats.market }).market;
  state.marketCondition = condition;
}

function calculateRevenue() {
  const config = balanceConfig.economy.revenue;
  const capabilityRevenue = Math.round(
    ((state.stats.tech + state.stats.market) / config.capabilityDivisor)
    * (state.reputation / config.reputationBaseline)
    * config.capabilityRate
  );
  const total = Math.max(config.minimum, config.base + capabilityRevenue);
  return { total, base: config.base, capabilityRevenue };
}

function calculateOperatingCost() {
  const config = balanceConfig.economy.operatingCost;
  const talentCost = Math.round(state.stats.talent * config.talentRate);
  const total = Math.max(0, config.base + talentCost);
  return { total, base: config.base, talentCost };
}

function calculateAnnualChanges() {
  const config = balanceConfig.economy.annualChange;
  const talentAtSettlement = state.stats.talent;
  const talentPressureMultiplier = config.talentMarketPressureBase
    + state.stats.market / config.talentMarketPressureDivisor;
  const talentChange = -Math.round(config.talentBaseDecay * talentPressureMultiplier);
  const techChange = roundStatChange(
    -config.techBaseDecay
    + (talentAtSettlement ** 2 / config.talentSquaredDivisor)
  );
  return { talentChange, talentAtSettlement, talentPressureMultiplier, techChange };
}

function settleAnnualFinances(reportYear) {
  if (state.lastAnnualSettlementYear === reportYear && state.annualSettlement?.reportYear === reportYear) {
    return state.annualSettlement;
  }

  const condition = marketConditionFor(reportYear);
  const revenue = calculateRevenue();
  const operatingCost = calculateOperatingCost();
  const annualChanges = calculateAnnualChanges();
  const netCash = revenue.total - operatingCost.total;
  const appliedChanges = applyEffects({
    cash: netCash,
    talent: annualChanges.talentChange,
    tech: annualChanges.techChange
  });
  const annualStartStats = state.annualStart?.year === reportYear
    ? state.annualStart.stats
    : {
        cash: state.stats.cash - appliedChanges.cash,
        tech: state.stats.tech - appliedChanges.tech,
        talent: state.stats.talent - appliedChanges.talent,
        market: state.stats.market
      };
  const externalChanges = state.annualExternalChanges?.year === reportYear
    ? state.annualExternalChanges.effects
    : {};
  const conditionChanges = { cash: 0, tech: 0, talent: 0, market: condition.marketChange };
  const operatingChanges = {
    cash: appliedChanges.cash,
    tech: appliedChanges.tech,
    talent: appliedChanges.talent,
    market: 0
  };
  const overallChanges = Object.fromEntries(Object.keys(state.stats).map((key) => [
    key,
    state.stats[key] - annualStartStats[key]
  ]));
  const decisionChanges = Object.fromEntries(Object.keys(state.stats).map((key) => [
    key,
    overallChanges[key] - conditionChanges[key] - (externalChanges[key] || 0) - operatingChanges[key]
  ]));
  const settlement = {
    reportYear,
    condition,
    revenue: revenue.total,
    revenueBreakdown: revenue,
    operatingCost: operatingCost.total,
    operatingCostBreakdown: operatingCost,
    netCash,
    talentChange: appliedChanges.talent,
    techChange: appliedChanges.tech,
    conditionChanges,
    externalChanges,
    decisionChanges,
    operatingChanges,
    overallChanges,
    annualChangeBreakdown: annualChanges
  };
  state.lastAnnualSettlementYear = reportYear;
  state.annualSettlement = settlement;
  state.history.push({
    year: reportYear,
    card: "年度经营结算",
    decision: "收入与支出",
    effects: `${condition.label} ×${condition.multiplier} · 市场 ${condition.marketChange >= 0 ? "+" : ""}${condition.marketChange} · 营业收入 +${revenue.total}（基础 ${revenue.base} / 能力 ${revenue.capabilityRevenue}） · 运营成本 -${operatingCost.total}（基础 ${operatingCost.base} / 人才 ${operatingCost.talentCost}） · 人才 ${appliedChanges.talent >= 0 ? "+" : ""}${appliedChanges.talent} · 技术 ${appliedChanges.tech >= 0 ? "+" : ""}${appliedChanges.tech} · 净现金 ${netCash >= 0 ? "+" : ""}${netCash}`,
    tags: []
  });
  saveState();
  return settlement;
}

function formatEffects(effects) {
  return Object.entries(effects)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${STAT_NAMES[key]} ${value > 0 ? "+" : ""}${value}`)
    .join(" · ");
}

function formatCoreStatChanges(effects) {
  return ["cash", "tech", "talent", "market"]
    .map((key) => `${STAT_NAMES[key]} ${(effects[key] || 0) > 0 ? "+" : ""}${effects[key] || 0}`)
    .join(" · ");
}

function formatDirections(effects) {
  return Object.entries(effects)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${STAT_NAMES[key]} ${value > 0 ? "↑" : "↓"}`)
    .join(" · ");
}

function formatPublicEffects(effects) {
  return Object.entries(effects)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => key === "reputation" && !showDeveloperValues
      ? `${STAT_NAMES[key]} ${value > 0 ? "↑" : "↓"}`
      : `${STAT_NAMES[key]} ${value > 0 ? "+" : ""}${value}`)
    .join(" · ");
}

function choiceEffects(item) {
  const effects = { ...(item.management?.previewEffects || item.effects) };
  const reputationChange = item.add.reduce((total, tag) => total + (reputationByTag[tag] || 0), 0);
  if (reputationChange) effects.reputation = (effects.reputation || 0) + reputationChange;
  return effects;
}

function resolvedChoiceEffects(item) {
  const effects = { ...item.effects };
  const reputationChange = item.add.reduce((total, tag) => total + (reputationByTag[tag] || 0), 0);
  if (reputationChange) effects.reputation = (effects.reputation || 0) + reputationChange;
  return effects;
}

function randomInteger(minimum, maximum, random = Math.random) {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

function resolveActionVariance(actionId, baseEffects, year, random = Math.random) {
  const isCrisis = companyActionConfig.variance.crisisYears.includes(year);
  const [minimum, maximum] = isCrisis
    ? companyActionConfig.variance.crisis
    : companyActionConfig.variance.normal;
  const effects = {};
  const modifiers = {};
  const notes = [];

  Object.entries(baseEffects).forEach(([key, baseValue]) => {
    const modifier = randomInteger(minimum, maximum, random);
    effects[key] = baseValue + modifier;
    modifiers[key] = modifier;
    if (!modifier) return;
    const direction = modifier > 0 ? "positive" : "negative";
    const actionCopy = companyActionConfig.actionVarianceCopy[actionId]?.[key]?.[direction];
    const fallbackCopy = companyActionConfig.defaultVarianceCopy[key]?.[direction] || [];
    const candidates = actionCopy?.length ? actionCopy : fallbackCopy;
    if (candidates.length) notes.push(candidates[Math.floor(random() * candidates.length)]);
  });

  return { effects, modifiers, notes, range: [minimum, maximum] };
}

function applyEffects(effects) {
  const actual = {};
  Object.entries(effects).forEach(([key, amount]) => {
    if (key === "reputation") {
      const before = state.reputation;
      state.reputation = Math.max(0, Math.min(100, before + amount));
      actual[key] = state.reputation - before;
    } else {
      const before = state.stats[key];
      state.stats[key] = Math.max(0, Math.min(100, before + amount));
      actual[key] = state.stats[key] - before;
    }
  });
  return actual;
}

function renderStats() {
  const statKeys = showDeveloperValues ? [...VISIBLE_STATS, "reputation"] : VISIBLE_STATS;
  const isIntro = !elements.startScreen.classList.contains("hidden");
  elements.stats.classList.toggle("developer-stats", showDeveloperValues);
  elements.stats.innerHTML = statKeys.map((key) => {
    const label = STAT_NAMES[key];
    const value = isIntro ? 50 : key === "reputation" ? state?.reputation ?? 50 : state?.stats[key] ?? 50;
    return `<div class="stat"><span class="stat-label">${label}</span><span class="stat-value ${value <= 20 ? "warning" : ""}">${value}</span></div>`;
  }).join("");
}

function showOnly(section) {
  [elements.startScreen, elements.gameScreen, elements.newspaperScreen, elements.endingScreen]
    .forEach((element) => element.classList.add("hidden"));
  section.classList.remove("hidden");
  syncYearContextPosition();
}

const landscapeLayout = window.matchMedia("(min-width: 900px) and (orientation: landscape)");

function syncYearContextPosition() {
  const useLandscapeLayout = window.innerWidth >= 900 && window.innerWidth > window.innerHeight;
  if (useLandscapeLayout) {
    elements.landscapeYearSlot.appendChild(elements.yearContext);
    elements.landscapeYearSlot.classList.toggle("hidden", elements.gameScreen.classList.contains("hidden"));
    return;
  }

  elements.gameScreen.insertBefore(elements.yearContext, elements.decisionStage);
  elements.landscapeYearSlot.classList.add("hidden");
}

function phaseFor(year) {
  if (year < 1972) return "机器比办公室大";
  if (year < 1982) return "芯片开始变小，账单没有";
  if (year < 1983) return "第一次科技寒冬";
  if (year < 2000) return "选择一条未来";
  return "所有网站都价值十亿美元";
}

function renderCard() {
  const cardId = state.sequence[state.index];
  const startsNewYear = state.index % 4 === 0;
  if (cardId === "CRISIS_SETTLEMENT") {
    renderCrisisSettlement();
    return;
  }
  if (cardId === "SECOND_CRISIS_SETTLEMENT") {
    renderSecondCrisisSettlement();
    return;
  }

  const card = getCard(cardId);
  if (!card) {
    showVictory();
    return;
  }

  if (startsNewYear) {
    if (state.annualStart?.year !== card.year) {
      state.annualStart = { year: card.year, stats: clone(state.stats) };
      state.annualExternalChanges = { year: card.year, effects: {} };
    }
    beginAnnualMarket(card.year);
    saveState();
  }

  showOnly(elements.gameScreen);
  renderStats();
  elements.yearArrival.classList.toggle("hidden", !startsNewYear);
  elements.arrivalYear.textContent = card.year;
  elements.arrivalNote.textContent = "年度计划开始";
  elements.yearLedger.classList.add("hidden");
  elements.yearLedger.innerHTML = "";
  elements.year.textContent = card.year;
  elements.phaseLabel.textContent = phaseFor(card.year);
  elements.phaseLabel.classList.toggle("hidden", !startsNewYear);
  elements.progress.textContent = `本年 ${state.index % 4 + 1} / 4`;
  elements.cardType.textContent = TYPE_NAMES[card.type] || "事件牌";
  elements.cardTitle.textContent = card.title;
  elements.cardBody.textContent = card.body;
  document.querySelector(".document-mark").textContent = card.type === "external" ? "通报" : "待决";
  document.querySelector(".signature-line span").textContent = card.type === "external" ? "阅毕归档" : "董事会批示";
  elements.inlineImpact.classList.add("hidden");
  elements.inlineImpact.querySelector(".external-year-link")?.remove();
  hideTutorialOverlay();
  elements.choices.innerHTML = "";
  elements.eventCard.className = `event-card${card.type === "external" ? " external-document" : ""}`;
  elements.eventCard.style.transform = "";
  elements.eventCard.style.opacity = "";

  const options = card.choices;
  if (card.type === "external") {
    renderExternalEventInline(cardId, card, options[0]);
    return;
  }
  elements.choices.className = `choices choice-count-${options.length}`;
  options.forEach((item, choiceIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    const previewEffects = choiceEffects(item);
    let displayedEffects = showDeveloperValues ? formatEffects(previewEffects) : "";
    if (item.management?.actionId && showDeveloperValues) {
      const [minimum, maximum] = companyActionConfig.variance.crisisYears.includes(card.year)
        ? companyActionConfig.variance.crisis
        : companyActionConfig.variance.normal;
      displayedEffects += ` · 随机修正 ${minimum}～+${maximum}`;
    }
    button.innerHTML = `<span class="choice-label">${item.label}</span>${displayedEffects ? `<span class="choice-effects">${displayedEffects}</span>` : ""}`;
    button.addEventListener("mouseenter", () => button.classList.add("is-previewing"));
    button.addEventListener("mouseleave", () => button.classList.remove("is-previewing"));
    button.addEventListener("click", () => commitChoice(cardId, card, choiceIndex, options.length));
    elements.choices.appendChild(button);
  });
  setupCardDrag(cardId, card, options.length);

  state.view = "card";
  state.pendingResult = null;
  saveState();
  showTutorialOverlay();
}

function renderExternalEventInline(cardId, card, selected) {
  let result = state.view === "external-result" && state.pendingResult?.source === cardId
    ? state.pendingResult
    : null;

  if (!result) {
    const effects = applyEffects(resolvedChoiceEffects(selected));
    removeTags(selected.remove);
    addTags(selected.add);
    const newRecords = selected.add.map((tag) => tagNames[tag]).filter(Boolean);
    state.history.push({
      year: card.year,
      card: card.title,
      decision: "外部事件结算",
      effects: formatPublicEffects(effects),
      tags: newRecords
    });
    result = {
      year: card.year,
      headline: selected.headline,
      body: selected.result,
      effects,
      records: newRecords,
      source: cardId
    };
    state.pendingResult = result;
    state.annualExternalChanges = { year: card.year, effects: clone(effects) };
    state.view = "external-result";
    saveState();
  }

  renderStats();
  elements.inlineImpact.classList.remove("hidden");
  elements.impactHeadline.textContent = result.headline;
  elements.impactBody.textContent = result.body;
  const condition = marketConditionFor(card.year);
  const totalMarketChange = condition.marketChange + (result.effects.market || 0);
  const conditionItem = `<span class="delta">当前行情：${condition.label}${showDeveloperValues ? ` ×${condition.multiplier}` : ""}${totalMarketChange ? ` · 市场 ${totalMarketChange > 0 ? "+" : ""}${totalMarketChange}` : ""}</span>`;
  elements.impactSettlement.innerHTML = [conditionItem, ...Object.entries(result.effects)
    .filter(([key, value]) => key !== "market" && value !== 0)
    .map(([key, value]) => `<span class="delta ${value > 0 ? "positive" : "negative"}">${key === "reputation" && !showDeveloperValues ? `${STAT_NAMES[key]} ${value > 0 ? "↑" : "↓"}` : `${STAT_NAMES[key]} ${value > 0 ? "+" : ""}${value}`}</span>`)].join("");
  elements.choices.className = "choices hidden";
  const continueButton = document.createElement("button");
  continueButton.type = "button";
  continueButton.className = "external-year-link";
  continueButton.textContent = `开始 ${card.year} 年经营`;
  continueButton.addEventListener("click", nextStep);
  elements.inlineImpact.appendChild(continueButton);
  setupExternalEventSwipe();
  showTutorialOverlay();
}

function hideTutorialOverlay() {
  elements.tutorialOverlay.classList.add("hidden");
  elements.tutorialOverlay.setAttribute("aria-hidden", "true");
}

function showTutorialOverlay() {
  const messages = {
    0: '<span class="tutorial-directions tutorial-directions-single"><span class="tutorial-action">← <span>向左滑动</span></span></span><span class="tutorial-purpose">翻到下一页</span>',
    1: '<span class="tutorial-directions"><span class="tutorial-action">← <span>向左滑动</span></span><span class="tutorial-or">或</span><span class="tutorial-action"><span>向右滑动</span> →</span></span><span class="tutorial-purpose">做出决定</span>'
  };
  const message = messages[state.index];
  if (!message || state.tutorialDismissed.includes(state.index)) return;
  elements.tutorialCopy.innerHTML = message;
  elements.tutorialOverlay.classList.remove("hidden");
  elements.tutorialOverlay.setAttribute("aria-hidden", "false");
  elements.tutorialOverlay.focus();
}

function dismissTutorialOverlay() {
  if (elements.tutorialOverlay.classList.contains("hidden")) return;
  if (!state.tutorialDismissed.includes(state.index)) {
    state.tutorialDismissed.push(state.index);
    saveState();
  }
  hideTutorialOverlay();
}

function setupExternalEventSwipe() {
  const cardElement = elements.eventCard;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let dragging = false;
  let horizontalDrag = false;

  cardElement.tabIndex = 0;
  cardElement.setAttribute("aria-label", "外部事件。向左滑动或按左方向键开始经营。");
  cardElement.onkeydown = (event) => {
    if (event.key !== "ArrowLeft" || event.target.closest("button")) return;
    event.preventDefault();
    nextStep();
  };

  const resetCard = () => {
    dragging = false;
    horizontalDrag = false;
    offsetX = 0;
    cardElement.classList.remove("is-dragging");
    cardElement.style.transform = "";
    cardElement.style.opacity = "";
  };

  cardElement.onpointerdown = (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    startX = event.clientX;
    startY = event.clientY;
    dragging = true;
    horizontalDrag = false;
    cardElement.setPointerCapture(event.pointerId);
  };
  cardElement.onpointermove = (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!horizontalDrag && Math.abs(deltaX) < 10) return;
    if (!horizontalDrag && Math.abs(deltaY) > Math.abs(deltaX)) {
      resetCard();
      return;
    }
    horizontalDrag = true;
    offsetX = Math.min(0, Math.max(-240, deltaX));
    cardElement.classList.add("is-dragging");
    cardElement.style.transform = `translateX(${offsetX}px) rotate(${offsetX * 0.012}deg)`;
    cardElement.style.opacity = String(1 - Math.abs(offsetX) / 500);
  };
  cardElement.onpointerup = (event) => {
    if (!dragging) return;
    if (cardElement.hasPointerCapture(event.pointerId)) cardElement.releasePointerCapture(event.pointerId);
    if (horizontalDrag && offsetX <= -110) {
      cardElement.classList.remove("is-dragging");
      nextStep();
      return;
    }
    resetCard();
  };
  cardElement.onpointercancel = resetCard;
}

function commitChoice(cardId, card, choiceIndex, choiceCount) {
  if (elements.eventCard.classList.contains("is-flying")) return;
  const direction = choiceCount === 2 ? (choiceIndex === 0 ? -1 : 1) : 0;
  const cardRect = elements.eventCard.getBoundingClientRect();
  const flyingDocument = elements.eventCard.cloneNode(true);
  flyingDocument.removeAttribute("id");
  flyingDocument.className = "event-card flying-document";
  flyingDocument.style.cssText = `left:${cardRect.left}px;top:${cardRect.top}px;width:${cardRect.width}px;height:${cardRect.height}px`;
  document.body.appendChild(flyingDocument);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    flyingDocument.remove();
    resolveChoice(cardId, card, choiceIndex);
    return;
  }
  const animation = flyingDocument.animate([
    { opacity: 1, transform: "translate(0, 0) rotate(-0.45deg)" },
    { opacity: 0, transform: direction ? `translate(${direction * 70}vw, -5vh) rotate(${direction * 16}deg)` : "translate(0, -20vh) rotate(-2deg)" }
  ], { duration: 260, easing: "ease-in", fill: "forwards" });
  animation.finished.then(() => flyingDocument.remove()).catch(() => flyingDocument.remove());
  elements.eventCard.classList.add("is-flying");
  resolveChoice(cardId, card, choiceIndex);
}

function setupCardDrag(cardId, card, choiceCount) {
  const cardElement = elements.eventCard;
  cardElement.removeAttribute("tabindex");
  cardElement.removeAttribute("aria-label");
  cardElement.onkeydown = null;
  cardElement.onpointerdown = null;
  cardElement.onpointermove = null;
  cardElement.onpointerup = null;
  cardElement.onpointercancel = null;
  if (choiceCount !== 2) return;
  let startX = 0;
  let offsetX = 0;
  let dragging = false;

  const resetCard = () => {
    dragging = false;
    offsetX = 0;
    cardElement.classList.remove("is-dragging");
    cardElement.style.transform = "rotate(-0.45deg)";
    [...elements.choices.children].forEach((button) => button.classList.remove("is-previewing"));
  };

  cardElement.onpointerdown = (event) => {
    startX = event.clientX;
    dragging = true;
    cardElement.classList.add("is-dragging");
    cardElement.setPointerCapture(event.pointerId);
  };
  cardElement.onpointermove = (event) => {
    if (!dragging) return;
    offsetX = Math.max(-180, Math.min(180, event.clientX - startX));
    cardElement.style.transform = `translateX(${offsetX}px) rotate(${offsetX * 0.035}deg)`;
    [...elements.choices.children].forEach((button, index) => {
      button.classList.toggle("is-previewing", Math.abs(offsetX) > 35 && index === (offsetX < 0 ? 0 : 1));
    });
  };
  cardElement.onpointerup = (event) => {
    if (!dragging) return;
    cardElement.releasePointerCapture(event.pointerId);
    if (Math.abs(offsetX) >= 110) {
      commitChoice(cardId, card, offsetX < 0 ? 0 : 1, choiceCount);
      return;
    }
    resetCard();
  };
  cardElement.onpointercancel = resetCard;
}

function resolveChoice(cardId, card, choiceIndex) {
  const options = card.choices;
  const selected = options[choiceIndex];
  if (selected.management) {
    resolveManagementChoice(cardId, card, selected);
    return;
  }
  const effects = applyEffects(resolvedChoiceEffects(selected));
  removeTags(selected.remove);
  addTags(selected.add);

  const newRecords = selected.add.map((tag) => tagNames[tag]).filter(Boolean);
  state.history.push({
    year: card.year,
    card: card.title,
    decision: selected.label,
    effects: formatPublicEffects(effects),
    tags: newRecords
  });
  const annualReportPending = isFinalAnnualDecision(cardId, card.year);

  state.pendingResult = {
    year: card.year,
    headline: selected.headline,
    body: selected.result,
    effects,
    records: newRecords,
    source: cardId,
    annualReportPending
  };
  state.view = "result";
  saveState();
  renderResult();
}

function resolveManagementChoice(cardId, card, selected) {
  const variance = resolveActionVariance(
    selected.management.actionId,
    resolvedChoiceEffects(selected),
    card.year
  );
  const effects = applyEffects(variance.effects);
  state.history.push({
    year: card.year,
    card: card.title,
    decision: selected.label,
    effects: formatPublicEffects(effects),
    tags: []
  });
  const annualReportPending = isFinalAnnualDecision(cardId, card.year);
  state.pendingResult = {
    year: card.year,
    headline: selected.headline,
    body: selected.result,
    effects,
    records: [],
    source: cardId,
    annualReportPending,
    financials: {
      budgetLabel: selected.management.budgetLabel,
      budgetCost: selected.management.budgetCost,
      variance: variance.modifiers,
      varianceRange: variance.range,
      varianceNotes: variance.notes
    }
  };
  state.view = "result";
  saveState();
  renderResult();
}

function renderResult() {
  const result = state.pendingResult;
  const isAnnualReport = Boolean(result.annualSettlement);
  elements.resultMedium.getAnimations().forEach((animation) => animation.cancel());
  elements.resultMedium.style.transform = "";
  elements.resultMedium.style.opacity = "";
  showOnly(elements.newspaperScreen);
  renderStats();
  elements.paperDate.textContent = `${result.year} 年`;
  const isCrisis = ["CRISIS_SETTLEMENT", "SECOND_CRISIS_SETTLEMENT"].includes(result.source);
  if (result.year < 1980) {
    elements.resultMedium.className = `newspaper${isAnnualReport ? " annual-report" : ""}`;
    elements.mediumTitle.textContent = isAnnualReport ? `${result.year} 年年报` : "科技工商日报";
    elements.mediumMeta.textContent = isAnnualReport ? "年度经营报告" : "每份 5 分";
    elements.paperSection.textContent = isAnnualReport ? "年度经营 · 状态总览" : isCrisis ? "号外 · 行业危机" : "商业 · 科技";
    elements.nextHint.textContent = isAnnualReport ? `← 滑动进入 ${result.year + 1} 年` : "← 滑动翻到下一页";
  } else if (result.year < 1995) {
    elements.resultMedium.className = `newspaper medium-terminal${isAnnualReport ? " annual-report" : ""}`;
    elements.mediumTitle.textContent = isAnnualReport ? `${result.year} 年年报` : "公司信息终端";
    elements.mediumMeta.textContent = isAnnualReport ? "年度经营报告" : "连接正常";
    elements.paperSection.textContent = isAnnualReport ? "年度经营 · 状态总览" : isCrisis ? "紧急系统通告" : "内部新闻数据库";
    elements.nextHint.textContent = isAnnualReport ? `← 滑动进入 ${result.year + 1} 年` : "← 滑动读取下一条";
  } else {
    elements.resultMedium.className = `newspaper medium-web${isAnnualReport ? " annual-report" : ""}`;
    elements.mediumTitle.textContent = isAnnualReport ? `${result.year} 年年报` : "科技在线";
    elements.mediumMeta.textContent = isAnnualReport ? "年度经营报告" : "56K 在线";
    elements.paperSection.textContent = isAnnualReport ? "年度经营 · 状态总览" : isCrisis ? "突发 · 市场崩盘" : "首页 · 商业科技";
    elements.nextHint.textContent = isAnnualReport ? `← 滑动进入 ${result.year + 1} 年` : "← 滑动查看下一条消息";
  }
  elements.paperHeadline.textContent = result.headline;
  const varianceNotes = showDeveloperValues ? result.financials?.varianceNotes || [] : [];
  elements.paperBody.textContent = [result.body, ...varianceNotes].join(" ");
  const effectItems = Object.entries(result.effects)
    .filter(([key, value]) => key !== "cash" && value !== 0)
    .map(([key, value]) => `<span class="delta ${value > 0 ? "positive" : "negative"}">${key === "reputation" && !showDeveloperValues ? `${STAT_NAMES[key]} ${value > 0 ? "↑" : "↓"}` : `${STAT_NAMES[key]} ${value > 0 ? "+" : ""}${value}`}</span>`);
  const publicTotals = ["cash", "tech", "talent", "market"].map((key) => {
    const value = result.effects[key] || 0;
    return `<span class="delta${value > 0 ? " positive" : value < 0 ? " negative" : ""}">${STAT_NAMES[key]} ${value > 0 ? "+" : ""}${value}</span>`;
  });
  const annualBreakdown = result.annualSettlement?.annualChangeBreakdown || {};
  const talentPressureDetail = Number.isFinite(annualBreakdown.talentPressureMultiplier)
    ? `-round(${balanceConfig.economy.annualChange.talentBaseDecay} × ${annualBreakdown.talentPressureMultiplier.toFixed(2)})`
    : "旧存档未记录计算输入";
  const techChangeDetail = Number.isFinite(annualBreakdown.talentAtSettlement)
    ? `round(-${balanceConfig.economy.annualChange.techBaseDecay} + ${annualBreakdown.talentAtSettlement}² / ${balanceConfig.economy.annualChange.talentSquaredDivisor})`
    : "旧存档未记录计算输入";
  const storedOperatingChanges = result.annualSettlement ? result.annualSettlement.operatingChanges || {
    cash: result.annualSettlement.netCash || 0,
    tech: result.annualSettlement.techChange || 0,
    talent: result.annualSettlement.talentChange || 0,
    market: 0
  } : {};
  const annualOperatingChanges = { ...storedOperatingChanges, market: 0 };
  const annualConditionChanges = result.annualSettlement?.conditionChanges || {
    cash: 0,
    tech: 0,
    talent: 0,
    market: result.annualSettlement?.condition?.marketChange || 0
  };
  const annualExternalChanges = result.annualSettlement?.externalChanges || {};
  const annualDecisionChanges = result.annualSettlement ? result.annualSettlement.decisionChanges || Object.fromEntries(
    ["cash", "tech", "talent", "market"].map((key) => [
      key,
      (result.annualSettlement.overallChanges?.[key] || 0)
        - (annualConditionChanges[key] || 0)
        - (annualExternalChanges[key] || 0)
        - (annualOperatingChanges[key] || 0)
    ])
  ) : {};
  const externalChangeSummary = formatEffects(annualExternalChanges);
  const conditionMarketChange = annualConditionChanges.market || 0;
  const annualItems = result.annualSettlement ? [
    `<span class="delta annual-detail">当前行情：${result.annualSettlement.condition.label}${showDeveloperValues ? ` ×${result.annualSettlement.condition.multiplier}` : ""} · 市场 ${conditionMarketChange > 0 ? "+" : ""}${conditionMarketChange}</span>`,
    ...(externalChangeSummary ? [`<span class="delta annual-detail">外部事件变化：${externalChangeSummary}</span>`] : []),
    `<span class="delta annual-detail">决策变化：${formatCoreStatChanges(annualDecisionChanges)}</span>`,
    `<span class="delta annual-detail">经营变化：${formatCoreStatChanges(annualOperatingChanges)}</span>`,
    `<span class="delta annual-detail">全年变化：${formatCoreStatChanges(result.annualSettlement.overallChanges || {})}</span>`,
    ...(showDeveloperValues ? [
      `<span class="delta annual-detail ${result.annualSettlement.condition.marketChange >= 0 ? "positive" : "negative"}">行情市场变化 ${result.annualSettlement.condition.marketChange >= 0 ? "+" : ""}${result.annualSettlement.condition.marketChange}</span>`,
      `<span class="delta annual-detail positive">营业收入 +${result.annualSettlement.revenue} = 基础 ${result.annualSettlement.revenueBreakdown.base} + 能力 ${result.annualSettlement.revenueBreakdown.capabilityRevenue}</span>`,
      `<span class="delta annual-detail negative">运营成本 -${result.annualSettlement.operatingCost} = 基础 ${result.annualSettlement.operatingCostBreakdown.base} + 人才 ${result.annualSettlement.operatingCostBreakdown.talentCost}</span>`,
      `<span class="delta annual-detail ${result.annualSettlement.netCash >= 0 ? "positive" : "negative"}">年度净现金 ${result.annualSettlement.netCash >= 0 ? "+" : ""}${result.annualSettlement.netCash}</span>`,
      `<span class="delta annual-detail ${result.annualSettlement.talentChange >= 0 ? "positive" : "negative"}">人才年度变化 ${result.annualSettlement.talentChange >= 0 ? "+" : ""}${result.annualSettlement.talentChange} = ${talentPressureDetail}</span>`,
      `<span class="delta annual-detail ${result.annualSettlement.techChange >= 0 ? "positive" : "negative"}">技术年度变化 ${result.annualSettlement.techChange >= 0 ? "+" : ""}${result.annualSettlement.techChange} = ${techChangeDetail}</span>`
    ] : [])
  ] : [];
  if (result.financials) {
    const { budgetLabel, budgetCost, variance } = result.financials;
    const varianceItems = Object.entries(variance || {})
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => `<span class="delta ${value > 0 ? "positive" : "negative"}">${STAT_NAMES[key]}随机修正 ${value > 0 ? "+" : ""}${value}</span>`);
    const developerItems = [
        budgetCost ? `<span class="delta negative">基础${budgetLabel} -${budgetCost}</span>` : `<span class="delta">基础${budgetLabel} 0</span>`,
        ...varianceItems,
        `<span class="delta ${result.effects.cash >= 0 ? "positive" : "negative"}">本次资金 ${result.effects.cash >= 0 ? "+" : ""}${result.effects.cash}</span>`,
        ...effectItems,
        ...annualItems
      ];
    elements.settlement.innerHTML = showDeveloperValues
      ? developerItems.join("")
      : (isAnnualReport ? annualItems : publicTotals).join("");
  } else {
    const resultItems = Object.entries(result.effects)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => `<span class="delta ${value > 0 ? "positive" : "negative"}">${key === "reputation" && !showDeveloperValues ? `${STAT_NAMES[key]} ${value > 0 ? "↑" : "↓"}` : `${STAT_NAMES[key]} ${value > 0 ? "+" : ""}${value}`}</span>`);
    elements.settlement.innerHTML = isAnnualReport ? annualItems.join("") : resultItems.join("");
  }

  if (result.records.length) {
    elements.recordNote.textContent = `公司档案已记录：${result.records.join("、")}`;
    elements.recordNote.classList.remove("hidden");
  } else {
    elements.recordNote.classList.add("hidden");
  }

  if (["C03", "C06"].includes(result.source)) elements.nextHint.textContent = "← 滑动查看危机结果";
  if (result.annualReportPending) elements.nextHint.textContent = `← 滑动查看 ${result.year} 年年报`;
  setupResultSwipe();
}

function showAnnualReport(previousResult) {
  const annualSettlement = settleAnnualFinances(previousResult.year);
  state.pendingResult = {
    year: previousResult.year,
    headline: "全年经营结果",
    body: "本年度的决策、外部环境与日常经营已经全部入账。",
    effects: annualSettlement.overallChanges,
    records: [],
    source: previousResult.source,
    annualSettlement
  };
  state.view = "result";
  saveState();
  renderResult();
}

function setupResultSwipe() {
  const resultElement = elements.resultMedium;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let dragging = false;
  let horizontalDrag = false;

  resultElement.tabIndex = 0;
  resultElement.setAttribute("aria-label", "结算结果。向左滑动或按左方向键继续。");
  resultElement.onkeydown = (event) => {
    if (event.key !== "ArrowLeft" || event.target.closest("button")) return;
    event.preventDefault();
    nextStep();
  };

  const resetResult = () => {
    dragging = false;
    horizontalDrag = false;
    offsetX = 0;
    resultElement.classList.remove("is-dragging");
    resultElement.style.transform = "";
    resultElement.style.opacity = "";
  };

  resultElement.onpointerdown = (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    startX = event.clientX;
    startY = event.clientY;
    offsetX = 0;
    dragging = true;
    horizontalDrag = false;
    resultElement.setPointerCapture(event.pointerId);
  };

  resultElement.onpointermove = (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!horizontalDrag && Math.abs(deltaX) < 10) return;
    if (!horizontalDrag && Math.abs(deltaY) > Math.abs(deltaX)) {
      resetResult();
      return;
    }
    horizontalDrag = true;
    offsetX = Math.min(0, Math.max(-240, deltaX));
    resultElement.classList.add("is-dragging");
    resultElement.style.transform = `translateX(${offsetX}px) rotate(${offsetX * 0.012}deg)`;
    resultElement.style.opacity = String(1 - Math.abs(offsetX) / 500);
  };

  resultElement.onpointerup = (event) => {
    if (!dragging) return;
    if (resultElement.hasPointerCapture(event.pointerId)) resultElement.releasePointerCapture(event.pointerId);
    if (horizontalDrag && offsetX <= -110) {
      resultElement.classList.remove("is-dragging");
      resultElement.animate([
        { opacity: Number(resultElement.style.opacity) || 1, transform: resultElement.style.transform },
        { opacity: 0, transform: "translateX(-75vw) rotate(-8deg)" }
      ], { duration: 220, easing: "ease-in", fill: "forwards" });
      nextStep();
      return;
    }
    resetResult();
  };

  resultElement.onpointercancel = resetResult;
}

function crisisAdjustments() {
  const rules = [
    ["clientDependence", { cash: -10 }, "大客户取消订单"],
    ["exclusiveContract", { market: -8 }, "独占合同限制销售"],
    ["excessInventory", { cash: -12 }, "库存积压"],
    ["oldFactory", { tech: -8, cash: -5 }, "老旧工厂维护"],
    ["modernFactory", { cash: -6, market: 6 }, "现代工厂维持产能"],
    ["inventoryControlled", { cash: 5 }, "提前控制库存"],
    ["stableFoundry", { market: 5 }, "长期代工合同"],
    ["cheapFoundry", { market: -5 }, "廉价代工中断"]
  ];

  const total = { cash: 0, tech: 0, talent: 0, market: 0 };
  const reasons = [];
  rules.forEach(([tag, effects, reason]) => {
    if (!hasTag(tag)) return;
    Object.entries(effects).forEach(([key, value]) => { total[key] += value; });
    reasons.push(`${reason}：${formatEffects(effects)}`);
  });

  return { total, reasons };
}

function renderCrisisSettlement() {
  const { total, reasons } = crisisAdjustments();
  const effects = applyEffects(total);
  state.pendingResult = {
    year: 1982,
    headline: "科技寒冬按时抵达",
    body: reasons.length
      ? `过去的决定开始集中寄账单：${reasons.join("；")}。银行认为这是一次健康的市场调整，因为需要调整的不是银行。`
      : "公司没有留下明显的历史包袱，也没有留下明显的历史优势。银行称这是一种非常普通的危险。",
    effects,
    records: [],
    source: "CRISIS_SETTLEMENT"
  };
  state.view = "result";
  saveState();
  renderResult();
}

function secondCrisisAdjustments() {
  const rules = [
    ["legacyTrap", { tech: -12, market: -6 }, "旧产品利润陷阱"],
    ["talentExodus", { talent: -15, tech: -5 }, "核心人才出走"],
    ["verticalEmpire", { cash: -18, talent: -5 }, "垂直帝国维护成本"],
    ["committeeCompany", { tech: -12, talent: -7 }, "委员会管理"],
    ["bubbleDebt", { cash: -20, market: -10 }, "互联网股票订单蒸发"],
    ["selfCannibalize", { tech: 5 }, "主动淘汰旧产品"],
    ["technicalPartners", { talent: 5 }, "技术合伙人留下"],
    ["modularBusiness", { cash: 5 }, "剥离边缘业务"],
    ["skunkworks", { tech: 5, talent: 3 }, "秘密项目组仍在工作"]
  ];
  const total = { cash: 0, tech: 0, talent: 0, market: 0 };
  const reasons = [];
  rules.forEach(([tag, effects, reason]) => {
    if (!hasTag(tag)) return;
    Object.entries(effects).forEach(([key, value]) => { total[key] += value; });
    reasons.push(`${reason}：${formatEffects(effects)}`);
  });
  const route = currentRoute();
  const routeComplete = routeMilestones[route].every((tag) => hasTag(tag));
  if (routeComplete) {
    const routeReturns = {
      cpu: "兼容处理器形成稳定订单",
      gpu: "图形生态开始产生规模收入",
      fab: "先进产能被客户提前预订"
    };
    total.cash += 24;
    total.market += 10;
    reasons.push(`${routeReturns[route]}：资金 +24 · 市场 +10`);
  }
  return { total, reasons };
}

function renderSecondCrisisSettlement() {
  const { total, reasons } = secondCrisisAdjustments();
  const effects = applyEffects(total);
  state.pendingResult = {
    year: 2001,
    headline: "互联网泡沫找回了重力",
    body: reasons.length
      ? `十五年的战略开始集中结算：${reasons.join("；")}。分析师已经删除了去年那篇“旧规律全部失效”的文章。`
      : "公司既没有明显包袱，也没有真正护城河。市场称这是一种非常公平的危险。",
    effects,
    records: [],
    source: "SECOND_CRISIS_SETTLEMENT"
  };
  state.view = "result";
  saveState();
  renderResult();
}

function nextStep() {
  const source = state.pendingResult?.source;

  if (Object.values(state.stats).some((value) => value <= 0)) {
    showFailure();
    return;
  }

  if (state.pendingResult?.annualReportPending) {
    showAnnualReport(state.pendingResult);
    return;
  }

  if (source === "C03") {
    const lowStats = Object.values(state.stats).filter((value) => value < 15).length;
    if (lowStats >= 2) {
      showFailure("acquired");
      return;
    }
  }

  if (source === "S05") {
    if (!hasTag("routeFab")) {
      state.sequence.splice(state.index + 1, 0, "S06");
      state.index += 1;
      state.view = "card";
      state.pendingResult = null;
      saveState();
      renderCard();
      return;
    }
    buildSecondEra();
    return;
  }

  if (source === "S06") {
    buildSecondEra();
    return;
  }

  if (source === "SECOND_CRISIS_SETTLEMENT") {
    evaluateSecondEra();
    return;
  }

  if (source === "CRISIS_SETTLEMENT") {
    beginSecondEra();
    return;
  }

  state.index += 1;
  state.view = "card";
  state.pendingResult = null;

  if (source === "S03") {
    state.checkpoint = {
      stats: clone(state.stats),
      tags: clone(state.tags),
      history: clone(state.history),
      sequence: clone(state.sequence),
      index: state.index,
      view: "card",
      pendingResult: null,
      reputation: state.reputation,
      lastAnnualSettlementYear: state.lastAnnualSettlementYear,
      annualSettlement: clone(state.annualSettlement),
      annualStart: clone(state.annualStart),
      annualExternalChanges: clone(state.annualExternalChanges),
      marketCondition: clone(state.marketCondition),
      annualMode: true,
      stateVersion: STATE_VERSION,
      year: 1973
    };
  }

  saveState();
  renderCard();
}

function beginSecondEra() {
  state.sequence.push(drawExternalEvent(1983, new Set()), "S05");
  state.index += 1;
  state.view = "card";
  state.pendingResult = null;
  state.checkpoint = {
    stats: clone(state.stats),
    tags: clone(state.tags),
    history: clone(state.history),
    sequence: clone(state.sequence),
    index: state.index,
    view: "card",
    pendingResult: null,
    reputation: state.reputation,
    lastAnnualSettlementYear: state.lastAnnualSettlementYear,
    annualSettlement: clone(state.annualSettlement),
    annualStart: clone(state.annualStart),
    annualExternalChanges: clone(state.annualExternalChanges),
    marketCondition: clone(state.marketCondition),
    annualMode: true,
    stateVersion: STATE_VERSION,
    year: 1983
  };
  saveState();
  renderCard();
}

function currentRoute() {
  if (hasTag("routeCpu")) return "cpu";
  if (hasTag("routeGpu")) return "gpu";
  return "fab";
}

function buildSecondEra() {
  const route = currentRoute();
  const usedCards = new Set();
  const usedEvents = new Set(state.sequence
    .map(parseAnnualCardId)
    .filter((card) => card?.kind === "event")
    .map((card) => card.contentId));
  state.sequence.push(...drawAnnualDecisions(1983, annualConfig.decisionsPerYear - 1, usedCards));
  for (let year = 1984; year <= annualConfig.endYear; year += 1) {
    const shared = annualConfig.timeline.secondEra[year] || [];
    const routeCardsForYear = annualConfig.timeline.routes[route][year] || [];
    const mandatory = [...shared, ...routeCardsForYear];
    const decisions = [...mandatory, ...drawAnnualDecisions(year, annualConfig.decisionsPerYear - mandatory.length, usedCards)];
    if (year === 2001) state.sequence.push(...decisions, "SECOND_CRISIS_SETTLEMENT");
    else state.sequence.push(drawExternalEvent(year, usedEvents), ...decisions);
  }
  state.index += 1;
  state.view = "card";
  state.pendingResult = null;
  saveState();
  renderCard();
}

function evaluateSecondEra() {
  if (Object.values(state.stats).some((value) => value <= 0)) {
    showFailure();
    return;
  }

  const route = currentRoute();
  const completedMilestones = routeMilestones[route].filter((tag) => hasTag(tag)).length;
  const remainedIndependent = hasTag("coreProtected") && !hasTag("committeeCompany") && !hasTag("abandonedStrategy");
  const healthyStats = Object.entries(balanceConfig.victory.minimumStats)
    .every(([key, minimum]) => state.stats[key] >= minimum);
  const trustedCompany = state.reputation >= balanceConfig.victory.minimumReputation;
  const resilience = balanceConfig.victory.resilienceTags.filter((tag) => hasTag(tag)).length;
  const resilientOrganization = resilience >= balanceConfig.victory.minimumResilience;
  if (completedMilestones === routeMilestones[route].length && remainedIndependent && healthyStats && trustedCompany && resilientOrganization) {
    showRouteVictory(route);
  } else if (completedMilestones === routeMilestones[route].length && remainedIndependent) {
    showFailure("operating-foundation");
  } else {
    showFailure(`strategy-${route}`);
  }
}

function failureDetails(forcedType) {
  if (forcedType === "acquired") {
    return {
      label: "被收购",
      title: "公司活了下来，\n只是不再属于你。",
      copy: "董事会接受了竞争对手的收购。对方承诺保留公司名称，直到新招牌送到为止。"
    };
  }

  const strategicFailures = {
    "operating-foundation": {
      label: "赢得技术，输掉公司",
      title: "路线图终于走通了。\n公司却没能一起抵达。",
      copy: "核心技术已经成熟，但现金、人才、市场、声誉或组织韧性仍有短板。正确的产品路线不能替公司支付每一张账单。"
    },
    "strategy-cpu": {
      label: "挑战者失速",
      title: "你每个季度都做对了。\n只有时代选错了。",
      copy: "公司在兼容、高端、低价和自有体系之间反复转向。行业巨头没有击败你；路线图先完成了这项工作。"
    },
    "strategy-gpu": {
      label: "漂亮的玩具",
      title: "你做出了最漂亮的画面。\n然后被留在了画面里。",
      copy: "公司赢得了每一代游戏评测，却没有建立开发者生态，也没有让图形芯片学会更多事情。下一代产品发布时，上一代公司已经不在了。"
    },
    "strategy-fab": {
      label: "昂贵的工厂",
      title: "工厂可以制造任何芯片。\n除了自己的订单。",
      copy: "你既想替客户生产，也忍不住和客户竞争。最后，厂房仍然灯火通明，只是里面没有客户的设计图。"
    }
  };
  if (strategicFailures[forcedType]) return strategicFailures[forcedType];

  const failedKey = Object.keys(state.stats).find((key) => state.stats[key] <= 0) || "cash";
  const strongestKey = Object.keys(state.stats)
    .filter((key) => key !== failedKey)
    .sort((left, right) => state.stats[right] - state.stats[left])[0];
  const titles = {
    cash: {
      tech: "你造出了未来。\n可惜银行只接受现金。",
      talent: "你招到了全行业最好的人。\n最后没人领到工资。",
      market: "全世界都在等待你的下一件产品。\n银行没有等。"
    },
    tech: {
      cash: "公司赚到了足够的钱。\n只是不再知道自己为什么存在。",
      talent: "办公室里坐满了天才。\n他们正在维护十二年前的产品。",
      market: "顾客仍在排队购买。\n因为他们不知道你已经停止研发。"
    },
    talent: {
      cash: "公司账上还有很多钱。\n现在终于不用发工资了。",
      tech: "你完成了最先进的技术。\n也完成了最后一名工程师的离职手续。",
      market: "订单已经排到了明年。\n员工没有。"
    },
    market: {
      cash: "公司拥有足够再活十年的现金。\n顾客决定一分钟也不等。",
      tech: "你的技术领先世界二十年。\n公司提前二十年消失。",
      talent: "团队已经准备好改变世界。\n世界取消了订单。"
    }
  };
  const details = {
    cash: ["资金耗尽", "银行接管了公司。三天后，他们看懂了库存报表，开始寻找下一家银行。"],
    tech: ["技术归零", "公司发布了史上最稳定的产品，因为它已经十二年没有发生任何变化。"],
    talent: ["人才归零", "最后一名工程师离职时带走了门禁卡。现在连你也进不去了。"],
    market: ["市场归零", "调查显示，消费者仍然信任你的品牌。其中 94% 的人认为公司早已倒闭。"]
  }[failedKey];

  return { label: details[0], title: titles[failedKey][strongestKey], copy: details[1] };
}

function showFailure(forcedType) {
  const endingType = forcedType || state.endingType;
  const ending = failureDetails(endingType);
  showOnly(elements.endingScreen);
  renderStats();
  elements.endingScreen.classList.add("failure-ending");
  elements.endingScreen.innerHTML = `
    <p class="obituary-title">公司讣告</p>
    <p class="ending-unlocked">失败结局已获得 · ${ending.label}</p>
    <h2>${ending.title}</h2>
    <p class="ending-copy">${ending.copy}</p>
    <div class="ending-actions">
      ${state.checkpoint ? `<button id="rewind-button" class="primary-button" type="button">回到 ${state.checkpoint.year || 1973} 年</button>` : ""}
      <button id="restart-button" class="secondary-button" type="button">从 1960 年重来</button>
    </div>`;
  state.view = "ending";
  state.endingType = endingType;
  saveState();

  document.querySelector("#rewind-button")?.addEventListener("click", rewindToCheckpoint);
  document.querySelector("#restart-button").addEventListener("click", startNewGame);
}

function showVictory() {
  showOnly(elements.endingScreen);
  renderStats();
  elements.endingScreen.classList.remove("failure-ending");
  const notes = [];
  if (hasTag("homeComputer")) notes.push("你们早年的家庭电脑突然被称为“领先布局”。");
  if (hasTag("missedHome")) notes.push("董事会一致认为，现在进入家庭电脑市场也不算太晚。");
  if (hasTag("shenGone") || hasTag("shenLeft")) notes.push("街角新公司的招牌比上次见面时大了许多。");
  if (hasTag("coffeePrototype")) notes.push("仓库清点发现，那台咖啡机仍然插着电。");

  elements.endingScreen.innerHTML = `
    <p class="kicker">1983 · 第一次危机结束</p>
    <h2>桌面上的新世界</h2>
    <p class="ending-copy">公司活了下来。仓库空了一半，办公室也空了一部分，但商店开始出售普通人可以买回家的电脑。\n\n${notes.join("\n")}</p>
    <div class="ending-actions">
      <button id="restart-button" class="primary-button" type="button">换一条路线重玩</button>
      ${state.checkpoint ? `<button id="rewind-button" class="secondary-button" type="button">回到 ${state.checkpoint.year || 1973} 年</button>` : ""}
    </div>`;
  state.view = "victory";
  state.endingType = null;
  saveState();

  document.querySelector("#restart-button").addEventListener("click", startNewGame);
  document.querySelector("#rewind-button")?.addEventListener("click", rewindToCheckpoint);
}

function showRouteVictory(route) {
  const endings = {
    cpu: {
      label: "成功结局 · 永远的挑战者",
      title: "巨人制定了标准。\n你让标准不再只属于巨人。",
      copy: "你用兼容、价格和持续迭代撕开了处理器市场。每次行业宣布挑战已经结束，你都会带着下一枚芯片回来。"
    },
    gpu: {
      label: "成功结局 · 平行世界",
      title: "他们以为你在制造游戏画面。\n你在训练未来。",
      copy: "可编程图形、开发者工具和并行计算终于连成一条路。那枚曾被称为玩具的芯片，开始处理世界上最严肃的问题。"
    },
    fab: {
      label: "成功结局 · 看不见的工厂",
      title: "所有人都想成为科技明星。\n你选择替明星制造舞台。",
      copy: "中立、良率、逆周期投资和客户信任让公司成为行业背后的基础。消费者不知道你的名字，但他们买到的每件东西都知道。"
    }
  };
  const ending = endings[route];
  showOnly(elements.endingScreen);
  renderStats();
  elements.endingScreen.classList.remove("failure-ending");
  elements.endingScreen.innerHTML = `
    <p class="kicker">2001 · ${ending.label}</p>
    <h2>${ending.title}</h2>
    <p class="ending-copy">${ending.copy}</p>
    <div class="ending-actions">
      <button id="restart-button" class="primary-button" type="button">换一条路线重玩</button>
      <button id="rewind-button" class="secondary-button" type="button">回到 1983 年</button>
    </div>`;
  state.view = "route-victory";
  state.endingType = route;
  saveState();
  document.querySelector("#restart-button").addEventListener("click", startNewGame);
  document.querySelector("#rewind-button").addEventListener("click", rewindToCheckpoint);
}

function rewindToCheckpoint() {
  if (!state.checkpoint) return;
  const checkpoint = clone(state.checkpoint);
  state = { ...checkpoint, checkpoint: clone(checkpoint) };
  saveState();
  renderCard();
}

function renderRecords() {
  const tags = state?.tags || [];
  const history = state?.history || [];
  elements.recordsContent.innerHTML = `
    <section class="record-section">
      <h3>长期记录</h3>
      ${tags.length
        ? `<ul class="tag-list">${tags.map((tag) => `<li>${tagNames[tag] || tag}</li>`).join("")}</ul>`
        : '<p class="empty-note">公司还没有留下值得归档的决定。</p>'}
    </section>
    <section class="record-section">
      <h3>决策历史</h3>
      ${history.length
        ? `<ol class="history-list">${[...history].reverse().map((item) => `<li><strong>${item.year} · ${item.card}</strong><br>${item.decision}｜${item.effects || "无数值变化"}</li>`).join("")}</ol>`
        : '<p class="empty-note">档案柜是空的，至少目前如此。</p>'}
    </section>`;
}

function startNewGame() {
  state = newState();
  saveState();
  renderCard();
}

function continueGame() {
  const saved = loadState();
  if (!saved) return;
  state = saved;
  if (state.view === "result") renderResult();
  else if (state.view === "ending") showFailure(state.endingType);
  else if (state.view === "victory") showVictory();
  else if (state.view === "route-victory") showRouteVictory(state.endingType);
  else renderCard();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && (!saved.annualMode || saved.stateVersion !== STATE_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (saved && typeof saved.reputation !== "number") saved.reputation = 50;
    if (saved && !Array.isArray(saved.tutorialDismissed)) saved.tutorialDismissed = [];
    if (saved?.checkpoint && typeof saved.checkpoint.reputation !== "number") saved.checkpoint.reputation = 50;
    const legacyMultipliers = { downturn: 0.5, normal: 1, boom: 1.5 };
    if (saved?.marketCondition?.key && typeof saved.marketCondition.multiplier !== "number") {
      saved.marketCondition.multiplier = legacyMultipliers[saved.marketCondition.key] || 1;
      saved.marketCondition.marketChange = 0;
    }
    if (saved?.annualSettlement?.condition?.key && typeof saved.annualSettlement.condition.multiplier !== "number") {
      saved.annualSettlement.condition.multiplier = legacyMultipliers[saved.annualSettlement.condition.key] || 1;
      saved.annualSettlement.condition.marketChange = 0;
    }
    return saved;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

elements.startButton.addEventListener("click", startNewGame);
elements.continueButton.addEventListener("click", continueGame);
elements.tutorialOverlay.addEventListener("click", dismissTutorialOverlay);
elements.tutorialOverlay.addEventListener("keydown", (event) => {
  if (!["Enter", " ", "Escape"].includes(event.key)) return;
  event.preventDefault();
  dismissTutorialOverlay();
});
elements.debugValuesButton.addEventListener("click", () => {
  showDeveloperValues = !showDeveloperValues;
  elements.debugValuesButton.textContent = `开发者数值：${showDeveloperValues ? "开" : "关"}`;
  elements.debugValuesButton.setAttribute("aria-pressed", String(showDeveloperValues));
  renderStats();
  if (state?.view === "card") renderCard();
  if (state?.view === "result") renderResult();
});
elements.recordsButton.addEventListener("click", () => {
  renderRecords();
  elements.recordsDialog.showModal();
});
elements.closeRecords.addEventListener("click", () => elements.recordsDialog.close());
elements.recordsDialog.addEventListener("click", (event) => {
  if (event.target === elements.recordsDialog) elements.recordsDialog.close();
});
landscapeLayout.addEventListener("change", syncYearContextPosition);
window.addEventListener("resize", syncYearContextPosition);

state = loadState();
syncYearContextPosition();
renderStats();
if (state) elements.continueButton.classList.remove("hidden");
