"use strict";

window.SILICON_CONFIG = {
  builds: {
    tech: {
      name: "技术先锋",
      accent: "#b33a2b",
      core: ["researchTeam", "advancedLab", "ownProduct"],
      verbs: "研究 / 发布",
      risk: "知识不会替你付房租"
    },
    customer: {
      name: "客户机器",
      accent: "#21656b",
      core: ["enterpriseClients", "salesNetwork", "longContract"],
      verbs: "接单 / 交付",
      risk: "合同不会替员工睡觉"
    },
    manufacturing: {
      name: "韧性制造",
      accent: "#69702f",
      core: ["productionBase", "processControl", "strategicStock"],
      verbs: "生产 / 出货",
      risk: "卖不掉的库存仍然非常具体"
    }
  },
  abilities: {
    officeLease: { name: "办公室租约", kind: "初始负担", build: "burden", description: "占用一个能力槽；拆除时支付 1 资金违约金。" },
    researchTeam: { name: "自研团队", kind: "核心·基础", build: "tech", description: "研究开始积累未发布知识。" },
    advancedLab: { name: "先进实验室", kind: "核心·引擎", build: "tech", description: "连续研究使知识加速增长。" },
    ownProduct: { name: "自主产品", kind: "核心·兑现", build: "tech", description: "可以发布并把知识转成收入。" },
    enterpriseClients: { name: "企业客户", kind: "核心·基础", build: "customer", description: "可以签署持续占用团队的合同。" },
    salesNetwork: { name: "销售网络", kind: "核心·引擎", build: "customer", description: "连续交付提高客户网络价值。" },
    longContract: { name: "长期合同", kind: "核心·兑现", build: "customer", description: "履约中的客户每回合提供现金。" },
    productionBase: { name: "自有产线", kind: "核心·基础", build: "manufacturing", description: "可以花现金批量生产。" },
    processControl: { name: "流程控制", kind: "核心·引擎", build: "manufacturing", description: "连续生产提高批量并降低单位成本。" },
    strategicStock: { name: "战略库存", kind: "核心·兑现", build: "manufacturing", description: "可以等待窗口统一出货。" },
    techLicense: { name: "技术授权", kind: "跨路线", build: "hybrid", description: "发布时保留一半知识，市场收益减半。" },
    jointDevelopment: { name: "联合开发", kind: "跨路线", build: "hybrid", description: "交付后推进一级研究，额外消耗人才。" },
    flexibleLine: { name: "柔性产线", kind: "跨路线", build: "hybrid", description: "市场变化时可以让库存匹配需求。" },
    cashReserve: { name: "现金储备", kind: "防御", build: "defense", description: "最终危机的资金支付减少 2。" },
    humaneSchedule: { name: "可持续团队", kind: "防御", build: "defense", description: "第一次交付人才消耗被抵消。" },
    diverseMarket: { name: "多元市场", kind: "防御", build: "defense", description: "最终危机的市场损失减少 2。" }
  },
  openings: {
    tech: {
      id: "open-tech", title: "把工资烧成论文", route: "tech", category: "创业方向",
      summary: "组建自研团队。暂时没有产品，但已经有了七种咖啡冲法。",
      body: "工程师建议把第一笔钱投入研究。财务问产品在哪里，工程师指了指黑板。",
      choices: [
        { label: "允许自由研究", note: "长期能力 / 现金压力", effects: { cash: -1, tech: 2 }, add: "researchTeam", action: "research", headline: "实验室先于盈利成立", result: "公司还没有客户，但已经可以严谨地解释为什么没有客户。" },
        { label: "先做收费咨询", note: "短期现金 / 放慢研发", effects: { cash: 3, tech: -1 }, add: "enterpriseClients", action: "contract", headline: "第一张发票比第一篇论文更早发表", result: "工程师称之为暂时妥协，财务称之为星期五。" }
      ]
    },
    customer: {
      id: "open-customer", title: "先找到愿意付款的人", route: "customer", category: "创业方向",
      summary: "寻找企业客户。客户确实有问题，而且愿意让你也拥有这些问题。",
      body: "附近工厂愿意把工资计算外包给你，条件是每次算错都由你解释。",
      choices: [
        { label: "签下第一份合同", note: "建立客户 / 占用人才", effects: { cash: 2, talent: -1, market: 1 }, add: "enterpriseClients", action: "contract", headline: "公司拥有了客户，也拥有了截止日期", result: "销售带回一张合同。工程师发现合同的主要功能是缩短周末。" },
        { label: "只出售标准服务", note: "稳健现金 / 不作承诺", effects: { cash: 3, market: -1 }, add: "cashReserve", headline: "公司拒绝成为客户的家属", result: "钱到账了，关系没有。双方都觉得这很现代。" }
      ]
    },
    manufacturing: {
      id: "open-manufacturing", title: "买下漏雨的工厂", route: "manufacturing", category: "创业方向",
      summary: "建立自有产线。屋顶漏水，但机器只在晴天折旧。",
      body: "城外的收音机厂正在出售，设备、工人和屋顶上的洞打包计价。",
      choices: [
        { label: "买下整条产线", note: "获得产能 / 大量现金", effects: { cash: -2, talent: 1 }, add: "productionBase", action: "produce", headline: "公司拥有了比办公室更大的账单", result: "工厂重新开灯。电表对此表达了强烈支持。" },
        { label: "找合作厂代工", note: "保留现金 / 市场受限", effects: { cash: -1, market: 1 }, add: "enterpriseClients", action: "contract", headline: "资产很轻，电话很重", result: "你没有买工厂，只买下了每天催工厂的权利。" }
      ]
    }
  },
  routeCards: {
    tech: [
      { id: "tech-engine", title: "示波器比汽车贵", category: "引擎机会", summary: "先进实验室能加速知识，但不会加速回款。", body: "实验室有一批退役仪器。卖家保证它们仍能测量，只是不保证测量的是这个宇宙。", choices: [
        { label: "买下整套仪器", note: "研究加速 / 现金下降", effects: { cash: -1, tech: 1 }, add: "advancedLab", action: "research", headline: "波形开始服从公司管理", result: "仪器亮了起来，财务的脸暗了下去。" },
        { label: "与大学共用设备", note: "节省现金 / 放弃速度", effects: { cash: -1, talent: 2 }, add: "jointDevelopment", headline: "研究日程由课程表决定", result: "成本降低了。每逢考试周，创新也会礼貌暂停。" }
      ]},
      { id: "tech-payoff", title: "把原型装进一个盒子", category: "兑现机会", summary: "自主产品允许发布知识。发布会把研究变成收入，也把缺陷变成售后。", body: "工程师说原型已经能连续运行八小时。销售问是否包括运输时间。", choices: [
        { label: "现在发布第一代产品", note: "立即兑现 / 知识清零", effects: { market: 1 }, add: "ownProduct", action: "publish", headline: "第一代产品赶在第二次延期前上市", result: "产品卖出去了。说明书诚实地建议用户靠近维修点。" },
        { label: "继续打磨核心技术", note: "更高上限 / 继续烧钱", effects: { cash: -2, tech: 2 }, add: "techLicense", action: "research", headline: "发布会改成技术研讨会", result: "没有产品上市，但竞争对手开始认真阅读你的专利。" }
      ]}
    ],
    customer: [
      { id: "customer-engine", title: "让客户介绍客户", category: "引擎机会", summary: "销售网络奖励连续交付，一次违约也会被整个行业转发。", body: "销售主管建议建立推荐制度。每介绍一位客户，就奖励一支印有公司电话号码的钢笔。", choices: [
        { label: "建立销售网络", note: "扩大渠道 / 暂不接新单", effects: { cash: -1, market: 2 }, add: "salesNetwork", action: "route", headline: "客户开始繁殖", result: "第一位客户介绍了第二位客户，并把所有抱怨也一并转交。" },
        { label: "控制客户数量", note: "保护团队 / 增长变慢", effects: { talent: 2, market: -1 }, add: "humaneSchedule", action: "repair", headline: "公司发明了下班", result: "员工第一次在天黑前离开办公室，保安一度以为是集体辞职。" }
      ]},
      { id: "customer-payoff", title: "五年独家合同", category: "兑现机会", summary: "长期合同提供稳定收入，也会把未来五年提前塞进本周。", body: "大客户愿意签五年合同，唯一的小字是：你不能再服务他们的竞争对手。小字共十四页。", choices: [
        { label: "签下独家合同", note: "稳定现金 / 交付压力", effects: { cash: 1, talent: -1 }, add: "longContract", action: "deliver", headline: "未来五年的收入和加班同时到账", result: "银行终于愿意微笑，员工开始研究银行的招聘网站。" },
        { label: "保持客户多元", note: "降低依赖 / 少赚现金", effects: { market: 2, cash: -1 }, add: "diverseMarket", action: "deliver", headline: "公司拒绝把命运写进一份合同", result: "客户不太满意，其他客户因此更满意。" }
      ]}
    ],
    manufacturing: [
      { id: "manufacturing-engine", title: "每颗螺丝都要有流程", category: "引擎机会", summary: "流程控制让连续生产越来越便宜，也让错误更有规模。", body: "工厂主管提交了四百页流程手册。最后一页规定如何申请阅读前三百九十九页。", choices: [
        { label: "推行流程控制", note: "批量效率 / 初期成本", effects: { cash: -1, tech: 1 }, add: "processControl", action: "produce", headline: "工厂开始稳定地重复同一件事", result: "良率提高了。错误也被标准化，方便财务统一归档。" },
        { label: "保留灵活手工作业", note: "适应变化 / 人才成本", effects: { talent: -1, tech: 2 }, add: "flexibleLine", action: "produce", headline: "每台机器都有自己的性格", result: "产线可以快速改型，前提是那位唯一会改的人没有请假。" }
      ]},
      { id: "manufacturing-payoff", title: "仓库里放什么", category: "兑现机会", summary: "战略库存等待市场窗口。仓库管理员则等待有人承认这些东西值钱。", body: "行业预计明年可能短缺，也可能过剩。分析师确认这两种预测至少有一种正确。", choices: [
        { label: "提前建立战略库存", note: "等待高价 / 锁死现金", effects: { cash: -1 }, add: "strategicStock", action: "produce", headline: "仓库成为公司最大的产品", result: "货架装满了。销售表示，接下来只差一个愿意买东西的时代。" },
        { label: "改建柔性产线", note: "降低峰值 / 应对变化", effects: { cash: -1, talent: -1 }, add: "flexibleLine", action: "produce", headline: "产线学会了改变主意", result: "工厂可以快速切换产品，工人则需要更慢地恢复睡眠。" }
      ]}
    ]
  },
  actionCards: {
    tech: {
      id: "operate-tech", title: "下一代产品还差一点", category: "技术运营", routes: ["tech"],
      summary: "继续研究提高发布质量，立即发布则把现有知识变成现金与市场。",
      body: "工程师说再研究一个季度就会突破。财务指出，上个季度他们也使用了完全相同的句子。",
      choices: [
        { label: "继续研究", note: "知识加速 / 资金 -1", effects: { cash: -1, tech: 1 }, add: null, action: "research", headline: "发布会再次推迟", result: "产品没有上市，但它在内部路线图上的颜色更鲜艳了。" },
        { label: "发布现有成果", note: "兑现全部知识 / 知识归零", effects: { market: 1 }, add: null, action: "publish", headline: "新产品离开实验室", result: "销售拿到了产品，工程师拿到了缺陷清单。双方终于共享同一份文档。" }
      ]
    },
    customer: {
      id: "operate-customer", title: "电话又响了", category: "客户运营", routes: ["customer"],
      summary: "接新单扩大未来收入；交付现有合同维持连击并降低违约风险。",
      body: "新客户想立刻签约，老客户想按时交付。销售认为两件事都该由工程师同时完成。",
      choices: [
        { label: "再接一份合同", note: "现金 +2 / 待交付 +1 / 人才 -1", effects: { cash: 2, talent: -1 }, add: null, action: "contract", headline: "销售再次赢得未来", result: "合同签好了。交付日期被谨慎地放在日历没有空白的位置。" },
        { label: "履行现有合同", note: "维持连击 / 放弃新订单", effects: { tech: -1 }, add: null, action: "deliver", headline: "客户收到了承诺中的东西", result: "项目按时完成。销售部门短暂地停止承诺更多项目，以示庆祝。" }
      ]
    },
    manufacturing: {
      id: "operate-manufacturing", title: "仓库与市场互相等待", category: "制造运营", routes: ["manufacturing"],
      summary: "继续生产扩大批量；现在出货则按本回合需求兑现全部库存。",
      body: "工厂希望继续生产，销售希望立即出货。仓库希望两边至少有一个人看过库存表。",
      choices: [
        { label: "继续批量生产", note: "库存加速 / 资金 -1", effects: { cash: -1 }, add: null, action: "produce", headline: "生产纪录继续刷新", result: "机器没有停。需求是否存在，被安排在下一次会议讨论。" },
        { label: "按当前需求出货", note: "兑现全部库存 / 批量归零", effects: { market: 1 }, add: null, action: "ship", headline: "仓库终于看见了地面", result: "产品离开仓库。财务开始计算这究竟是销售还是搬家。" }
      ]
    }
  },
  commonCards: [
    { id: "license", title: "把技术租给客户", category: "跨路线", routes: ["tech", "customer"], summary: "把研究变成授权收入，但产品市场会缩水。", body: "一家客户希望购买技术授权。他们保证不会成为竞争对手，只会成为拥有你技术的竞争对手。", choices: [
      { label: "签署授权协议", note: "知识留存 / 产品让利", effects: { cash: 2, market: -1 }, add: "techLicense", action: "publish", headline: "知识开始按季度收费", result: "专利第一次学会了付房租。" },
      { label: "坚持自主产品", note: "保留市场 / 继续烧钱", effects: { cash: -2, tech: 2 }, add: "ownProduct", action: "research", headline: "公司拒绝出售未来", result: "未来对此没有表示感谢，财务也没有。" }
    ]},
    { id: "joint", title: "让客户参与研发", category: "跨路线", routes: ["customer", "tech"], summary: "交付可以推进研究，但客户也会参与定义真理。", body: "最大客户愿意派工程师共同开发。合同说成果属于双方，争议属于你。", choices: [
      { label: "联合开发", note: "交付推动研究 / 人才消耗", effects: { talent: -2, cash: 1 }, add: "jointDevelopment", action: "deliver", headline: "客户进入实验室", result: "研发获得了需求，需求获得了每天三次会议。" },
      { label: "保持研发独立", note: "技术自主 / 失去订单", effects: { tech: 2, market: -2 }, add: "researchTeam", action: "research", headline: "工程师保住了白板", result: "客户离开了会议室，顺手带走了采购预算。" }
    ]},
    { id: "flex", title: "为下一代产品改线", category: "跨路线", routes: ["manufacturing", "tech"], summary: "柔性产线能适应技术换代，但每次改变都要有人熬夜。", body: "新设计和旧产线彼此无法理解。工程师建议重写流程，工厂建议重写工程师。", choices: [
      { label: "改造成柔性产线", note: "库存适应 / 人才成本", effects: { cash: -2, talent: -1 }, add: "flexibleLine", action: "produce", headline: "工厂获得改变主意的能力", result: "产线成功改型。工人也成功忘记今天是星期几。" },
      { label: "继续生产旧型号", note: "扩大库存 / 换代风险", effects: { cash: -1, market: 1 }, add: "strategicStock", action: "produce", headline: "旧产品继续高速下线", result: "生产纪录每天刷新，需求纪录保持沉默。" }
    ]},
    { id: "reserve", title: "把钱留在银行", category: "防御机会", routes: ["defense"], summary: "现金不会增长，但在危机里仍然保持现金的传统用途。", body: "财务建议本季度什么也别发明。工程师认为这是针对个人。", choices: [
      { label: "建立现金储备", note: "危机防御 / 放弃增长", effects: { cash: 3, tech: -1 }, add: "cashReserve", action: "repair", headline: "公司成功投资于没有行动", result: "银行余额上升。新闻稿将此称为战略耐心。" },
      { label: "继续投入增长", note: "推进主路线 / 现金风险", effects: { cash: -2, tech: 2 }, add: null, action: "route", headline: "预算再次被未来借走", result: "未来承诺稍后归还，并拒绝提供日期。" }
    ]},
    { id: "people", title: "禁止英雄式加班", category: "防御机会", routes: ["defense", "customer"], summary: "保护交付能力，但会失去一次冲刺机会。", body: "团队连续工作六周。人力部门建议举办健康讲座，工程师建议先允许他们回家。", choices: [
      { label: "恢复可持续排期", note: "保护人才 / 放慢交付", effects: { talent: 3, cash: -1 }, add: "humaneSchedule", action: "repair", headline: "员工重新认识了家人", result: "进度慢了一点，辞职信也慢了很多。" },
      { label: "再冲刺一个季度", note: "即时现金 / 致命人才风险", effects: { cash: 4, talent: -4 }, add: null, action: "deliver", headline: "公司完成了季度目标", result: "季度目标活了下来。部分完成它的人没有。" }
    ]},
    { id: "markets", title: "拒绝唯一的大客户", category: "防御机会", routes: ["defense", "customer"], summary: "降低单一客户风险，也放弃最容易的钱。", body: "一家公司愿意买下全部产能，条件是你以后只听见他们的电话铃声。", choices: [
      { label: "保持市场多元", note: "危机防御 / 少赚现金", effects: { market: 3, cash: -1 }, add: "diverseMarket", action: "repair", headline: "公司保留了拒绝客户的权利", result: "销售第一次把不签合同写进了业绩报告。" },
      { label: "接受全部订单", note: "大量现金 / 单点风险", effects: { cash: 4, talent: -2 }, add: "longContract", action: "contract", headline: "订单填满了未来", result: "工厂不再担心没有工作，只担心什么时候工作完。" }
    ]}
  ],
  marketEvents: [
    { id: "shortage", name: "芯片短缺", preview: "下回合：短缺正在逼近", description: "买家开始抢购。库存可高价出货，未发布产品也面临提前上市压力。", demand: 2 },
    { id: "price-war", name: "价格竞争", preview: "下回合：同行准备降价", description: "现金机会变得诱人，库存折价，长期合同暂时更值钱。", demand: 0.5 }
  ]
};
