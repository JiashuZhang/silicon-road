"use strict";

const { loadConfig, runBatch } = require("./simulator");
const { PERSONALITIES } = require("./personalities");

const DEFAULT_PERSONALITIES = ["beginner", "experienced", "tech", "customer", "manufacturing", "profit", "cautious", "hybrid", "random"];
const PERSONALITY_IDS = Object.keys(PERSONALITIES);
const args = process.argv.slice(2);

function argument(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function duration(seconds) {
  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  return `${minutes}分${(roundedSeconds % 60).toString().padStart(2, "0")}秒`;
}

const runs = Number(argument("--runs", "1000"));
const requestedPersonality = argument("--personality", argument("--strategy", "all"));
const seed = Number(argument("--seed", "100000"));

if (!Number.isInteger(runs) || runs <= 0) throw new Error("--runs 必须是正整数");
if (requestedPersonality !== "all" && !PERSONALITY_IDS.includes(requestedPersonality)) {
  throw new Error(`--personality 必须是 all 或 ${PERSONALITY_IDS.join(", ")}`);
}

const config = loadConfig();
const personalities = requestedPersonality === "all" ? DEFAULT_PERSONALITIES : [requestedPersonality];

console.log(`硅之路机器人灰盒报告 · 每种人格 ${runs} 局 · 起始种子 ${seed}`);
console.log("胜利按“Build 爆发”计算；幸存与倒闭单独列出。时长为真人行为模型估算，不是程序运行耗时。\n");

for (const personality of personalities) {
  const result = runBatch(config, { runs, personality, seed });
  console.log(PERSONALITIES[personality].label);
  console.log(`  爆发率 ${percent(result.rates.breakout)} · 幸存率 ${percent(result.rates.survivor)} · 倒闭率 ${percent(result.rates.failure)}`);
  console.log(`  平均时长 ${duration(result.duration.averageSeconds)} · 中位 ${duration(result.duration.medianSeconds)} · 80% 区间 ${duration(result.duration.p10Seconds)}–${duration(result.duration.p90Seconds)}`);
}