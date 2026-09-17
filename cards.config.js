"use strict";

(function () {
  function choice(
    label,
    effects,
    headline,
    result,
    add = [],
    remove = [],
    requires = null,
    management = null,
  ) {
    return { label, effects, headline, result, add, remove: remove || [], requires, management };
  }

  const cards = {
    S01: {
      year: 1960,
      type: "opening",
      title: "机器与办公室",
      body: "你租到了一间办公室，也买到一台二手计算机。好消息是机器能够正常启动，坏消息是办公室不能同时容纳机器和全部员工。",
      choices: [
        choice(
          "拆掉会议室",
          { cash: -3, talent: 3 },
          "本市新公司取消全部会议",
          "公司声称这是为了提高效率。真实原因是计算机已经坐在了会议室的位置上。",
          ["selfStart"],
        ),
        choice(
          "把机器租出去",
          { cash: 5, tech: -5, market: 1 },
          "昂贵机器开始按小时工作",
          "附近三所大学排队租用你的计算机。你的员工也在排队，但他们需要付费。",
          ["serviceBusiness"],
        ),
      ],
    },
    S02: {
      year: 1961,
      type: "opening",
      title: "先赚钱，还是先研发？",
      body: "附近工厂愿意付费，让你的计算机替他们计算工资；工程师则想拿这笔钱制造一台更小的机器。公司的预算只够选择一个项目。",
      choices: [
        choice(
          "替工厂计算工资",
          { cash: 4, market: 2, tech: -5 },
          "计算机现可代算工资",
          "第一个客户收到工资表后十分满意。只有一名员工被计算成了一把椅子。",
          ["enterpriseClients"],
        ),
        choice(
          "研发小型计算机",
          { cash: -20, tech: 20, talent: 4 },
          "小公司宣布制造更小的计算机",
          "记者询问它能小到什么程度。你指了指另一间稍小的房间。",
          ["ownProduct"],
        ),
      ],
    },
    E01: {
      year: 1963,
      type: "order",
      title: "天气计算合同",
      body: "一个政府部门希望租用你的机器预测天气。他们愿意提前付款，但合同最后十二页只有“保密”两个字。",
      choices: [
        choice(
          "签字，不问天气",
          { cash: 6, market: 2, tech: -7 },
          "本地公司协助改善天气预报",
          "明天可能下雨，也可能不会。合同确定会按时付款。",
          ["governmentContract"],
        ),
        choice(
          "拒绝保密项目",
          { cash: -10, tech: 6, talent: 5 },
          "小公司坚持公开研究",
          "大学研究员开始主动联系你。银行也主动联系你，询问为什么拒绝一笔真钱。",
          ["publicResearch"],
        ),
      ],
    },
    E02: {
      year: 1964,
      type: "tech",
      title: "论文还是专利",
      body: "团队找到一种减少机器发热的方法。研究员想立刻发表，律师建议先申请专利，然后再假装这是为了全人类。",
      choices: [
        choice(
          "公开发表",
          { tech: 3, talent: 5, market: -7 },
          "散热方法免费公开",
          "同行称赞你的理想主义，并立即把方法装进了他们的产品。",
          ["openTech"],
        ),
        choice(
          "申请专利",
          { cash: -13, reputation: 7, market: 7 },
          "公司为冷空气申请产权",
          "律师解释说，你并没有拥有冷空气，只拥有一种让冷空气收费的办法。",
          ["patents"],
        ),
      ],
    },
    P01: {
      year: 1965,
      type: "person",
      title: "天才候选人",
      body: "电路设计师沈岚来面试。她只看了十分钟图纸，就指出三个错误，其中一个已经被公司当作功能宣传了两年。她要求 8% 股份和独立项目权。",
      choices: [
        choice(
          "给她 8% 股份",
          { cash: -12, reputation: 2, talent: 8 },
          "年轻工程师加入小型科技公司",
          "沈岚上班第一天扔掉了半年设计稿。项目进度因此提前了三个月。",
          ["shenShares", "shenEmployed"],
        ),
        choice(
          "我们只发工资",
          { cash: 6, talent: -4, market: 5, reputation: -10 },
          "设计师拒绝优厚职位",
          "公司强调双方友好分手。她在街对面租了一间办公室。",
          ["shenLeft"],
        ),
      ],
    },
    E03: {
      year: 1966,
      type: "product",
      title: "袖珍计算器",
      body: "一家文具公司想把计算机缩小到能放在桌上的程度。销售部门认为没人会花钱购买一台不能占满房间的机器。",
      choices: [
        choice(
          "接下订单",
          { cash: -30, tech: 10, market: 11, reputation: 10 },
          "计算机首次无需单独缴纳房租",
          "样机可以完成四种运算。市场部建议不要告诉顾客第五种会冒烟。",
          ["consumerElectronics"],
        ),
        choice(
          "服务大客户更稳妥",
          { cash: 7, tech: -4, market: -2 },
          "公司重申大型机器更可靠",
          "主要客户对此表示赞同。他们的采购部门刚刚扩建了一栋楼。",
          ["enterpriseClients"],
        ),
      ],
    },
    E04: {
      year: 1967,
      type: "operation",
      title: "廉价工厂",
      body: "城外有一家倒闭的收音机工厂出售。设备已经过时，屋顶正在漏水，但价格只比修好屋顶贵一点。",
      choices: [
        choice(
          "买下工厂",
          { cash: -18, tech: 4, talent: 6, market: 5 },
          "科技公司进军制造业",
          "公司获得了自己的生产线，以及六百把印着上一家公司名称的椅子。",
          ["ownFactory"],
        ),
        choice(
          "继续委托生产",
          { cash: 4, tech: -4, market: 1 },
          "轻资产成为新经营哲学",
          "你把“买不起工厂”重新命名为“专注核心业务”。记者认真记了下来。",
          ["outsourced"],
        ),
      ],
    },
    E05: {
      year: 1968,
      type: "oddity",
      title: "夜班游戏",
      body: "值夜班的实习生偷偷用公司机器制作游戏。画面里有两个方块互相射击，已经吸引了全部夜班员工和一名保安。",
      choices: [
        choice(
          "下班后可以玩",
          { cash: -6, tech: 2, talent: 5 },
          "计算机学会浪费时间",
          "管理层担心生产力下降。夜班员工首次主动要求加班。",
          ["gameLab"],
        ),
        choice(
          "立刻删除",
          { cash: 3, talent: -7, market: 2 },
          "公司清除无关程序",
          "管理层恢复了生产秩序。保安提交了辞职信，并询问能否带走一份游戏磁带。",
          ["gameBanned"],
        ),
      ],
    },
    E06: {
      year: 1969,
      type: "oddity",
      title: "自动咖啡机",
      body: "一名技术员想让咖啡机根据员工表情自动调整浓度。原型目前只能识别“疲惫”和“非常疲惫”。",
      choices: [
        choice(
          "拨一笔小预算",
          { cash: -5, tech: 1, talent: 2 },
          "公司研究自动化饮料设备",
          "第一杯咖啡浓得溶解了勺子。技术员认为方向完全正确。",
          ["coffeePrototype"],
        ),
        choice(
          "咖啡不需要思考",
          { cash: 3, talent: -2 },
          "自动化项目遭到否决",
          "咖啡机恢复普通工作。它对此没有发表意见，因为它暂时还不能。",
          ["normalCoffee"],
        ),
      ],
    },
    E07: {
      year: 1970,
      type: "risk",
      title: "律师的来信",
      body: "一家大公司声称你的产品侵犯了他们的专利。律师看完文件后表示胜算很大，收费也恰好很大。",
      choices: [
        choice(
          "打官司",
          { cash: -12, tech: 3, market: 6 },
          "小公司拒绝向行业巨头低头",
          "公众开始支持你。律师开始支持购买第二辆汽车。",
          ["challengeGiant"],
        ),
        choice(
          "支付授权费",
          { cash: -7, market: -3, talent: 2 },
          "双方达成友好授权协议",
          "协议非常友好，尤其是对收到钱的一方。",
          ["patentDependence"],
        ),
      ],
    },
    E08: {
      year: 1971,
      type: "publicity",
      title: "会唱歌的机器",
      body: "工程师发现计算机能够合成一句走调的歌。展示会还有两周，原定展示的工资系统非常准确，也非常无聊。",
      choices: [
        choice(
          "让机器唱歌",
          { cash: -16, tech: 5, market: 12 },
          "计算机首次公开演唱",
          "观众起立鼓掌。音乐评论家要求它不要发行唱片。",
          ["publicDemo"],
        ),
        choice(
          "展示工资系统",
          { cash: 5, market: 2, talent: -6 },
          "新系统三分钟算完全厂工资",
          "企业客户立即下单。普通读者翻到了体育版。",
          ["enterpriseClients"],
        ),
      ],
    },
    S03: {
      year: 1972,
      type: "turning",
      title: "一枚小小的芯片",
      body: "供应商送来一种新芯片。它昂贵、脆弱，而且小到很容易被财务人员误认为不值钱。工程师认为它迟早会改变所有机器。",
      choices: [
        choice(
          "重做产品线",
          { cash: -15, tech: 16, talent: 4, market: -4 },
          "公司押注微型芯片",
          "旧产品部门称这是集体失智。新产品部门借走了他们的示波器。",
          ["chipShift"],
        ),
        choice(
          "等价格降下来",
          { cash: 6, tech: -8, market: 3 },
          "成熟技术仍是可靠选择",
          "公司避免了一次昂贵冒险。竞争对手感谢你替市场保持冷静。",
          ["delayedShift"],
        ),
      ],
    },
    E09: {
      year: 1973,
      type: "order",
      title: "蓝色巨人的订单",
      body: "一家规模大到标志只需要一种颜色的公司发来订单。他们愿意买下未来五年的全部产量，但要求你不得向其他客户出售同类产品。",
      choices: [
        choice(
          "签独占合同",
          { cash: 12, market: 5, tech: -16 },
          "小公司获得史上最大订单",
          "庆功酒会十分成功。合同的自动续约条款更加成功。",
          ["exclusiveContract", "clientDependence"],
        ),
        choice(
          "保持独立销售",
          { cash: -12, tech: 5, market: 8 },
          "公司拒绝行业巨头独占要求",
          "你保住了产品自由。财务部门开始自由地更新求职简历。",
          ["independentChannel"],
        ),
      ],
    },
    E11: {
      year: 1976,
      type: "product",
      title: "家庭电脑",
      body: "产品经理提议制造一台普通家庭也买得起的电脑。财务部门询问普通家庭为什么需要电脑，产品经理回答：“买了以后再想。”",
      choices: [
        choice(
          "进入家庭市场",
          { cash: -20, tech: 5, market: 16 },
          "电脑准备进入普通家庭",
          "首批顾客用它记账、学习和玩游戏。广告只提到了前两项。",
          ["homeComputer"],
        ),
        choice(
          "家庭不需要电脑",
          { cash: 10, tech: -4, market: -6 },
          "公司继续专注专业客户",
          "董事会认为家庭电脑只是玩具。孩子们第一次觉得董事会可能说得对。",
          ["missedHome"],
        ),
      ],
    },
    E12: {
      year: 1977,
      type: "market",
      title: "仿冒产品",
      body: "市场上出现了一款几乎一模一样的产品，名称只比你的少一个字母。包装上印着“完全兼容，部分合法”。",
      choices: [
        choice(
          "降价竞争",
          { cash: -8, market: 10, talent: -2 },
          "科技产品价格大幅下降",
          "消费者欢呼，公司会计也发出了声音，但无法确定是不是欢呼。",
          ["priceWar"],
        ),
        choice(
          "起诉对方",
          { cash: -10, market: 5, tech: 2 },
          "两家公司争夺一个字母",
          "法庭将决定那个字母究竟属于谁。语言学家拒绝对此负责。",
          ["brandDefense"],
        ),
      ],
    },
    E13: {
      year: 1978,
      type: "operation",
      title: "石油涨价",
      body: "能源价格突然上涨，工厂和机房的账单同时翻倍。财务部门建议员工少呼吸一点，工程师建议制造更省电的机器。",
      choices: [
        choice(
          "研发低功耗产品",
          { cash: -15, tech: 12, market: 4 },
          "公司推出节能计算设备",
          "新机器耗电减少三成。市场部把拔掉演示机电源的部分剪掉了。",
          ["lowPower"],
        ),
        choice(
          "把成本转给客户",
          { cash: 8, market: -10, talent: -2 },
          "科技产品宣布全面涨价",
          "公司表示这是为了保证服务质量。客户表示他们正在比较别家的服务质量。",
          ["highPrice"],
        ),
      ],
    },
    E14: {
      year: 1979,
      type: "risk",
      title: "产品会冒烟",
      body: "新产品在长时间运行后会冒烟。工程师说只有极少数机器会发生，仓库主管提醒他仓库里全是机器。",
      choices: [
        choice(
          "全部召回",
          { cash: -14, market: 4, talent: 3 },
          "公司主动召回过热设备",
          "消费者赞赏公司的负责态度。财务部门开始讨论不负责是否更便宜。",
          ["responsibleRecall"],
        ),
        choice(
          "称其为散热特性",
          { cash: 6, market: -12, tech: -4 },
          "公司否认产品存在起火风险",
          "声明发布时，背景中的灭火器被工作人员缓慢移出了镜头。",
          ["coveredAccident"],
        ),
      ],
    },
    E15: {
      year: 1980,
      type: "tech",
      title: "复制机器的机器",
      body: "工程师提出用计算机辅助设计下一代计算机。财务部门担心机器一旦学会这件事，就会要求进入研发预算会议。",
      choices: [
        choice(
          "投资设计工具",
          { cash: -18, tech: 14, talent: 5 },
          "计算机开始参与设计计算机",
          "第一版工具节省了两周工作，又花三周修复它自己造成的问题。",
          ["designAutomation"],
        ),
        choice(
          "图纸和尺子够用",
          { cash: 7, tech: -7, talent: -3 },
          "传统设计方法仍受信任",
          "工程师获得了一批新尺子。它们准确测量出了公司与未来的距离。",
          ["manualDesign"],
        ),
      ],
    },
    E16: {
      year: 1981,
      type: "warning",
      title: "仓库预警",
      body: "销售增长正在放缓，但工厂仍按旧计划生产。仓库主管请求削减产量，销售部门认为停止增长会伤害增长数字。",
      choices: [
        choice(
          "提前减产",
          { cash: -4, market: -3, talent: 3 },
          "公司谨慎调整生产计划",
          "投资者不喜欢“谨慎”这个词。仓库终于能重新看见地面。",
          ["inventoryControlled"],
        ),
        choice(
          "继续全速生产",
          { cash: 8, market: 2, talent: -9 },
          "公司对未来需求充满信心",
          "生产线昼夜不停。未来尚未确认是否需要这么多产品。",
          ["excessInventory"],
        ),
      ],
    },
    C01: {
      year: 1982,
      type: "crisis",
      title: "订单消失了",
      body: "一周之内，三家客户取消订单，第四家客户取消了公司。仓库里堆满了去年还被称为“供不应求”的产品。",
      choices: [
        choice(
          "全线降价清仓",
          { cash: 10, market: 5, tech: -14 },
          "电子产品价格跌至历史低点",
          "库存终于开始减少。早期客户要求退还他们为“稀缺性”支付的费用。",
        ),
        choice(
          "停止生产，保住价格",
          { cash: -8, market: -5, talent: 5 },
          "公司暂停多条生产线",
          "产品价格暂时稳定。工厂安静得终于能听见财务部门叹气。",
        ),
      ],
    },
    C02: {
      year: 1982,
      type: "crisis",
      title: "银行的雨伞",
      body: "银行愿意提供紧急贷款。利率写在合同第七码小字里，银行代表说那只是排版问题。",
      choices: [
        choice(
          "接受贷款",
          { cash: 18, market: -8, reputation: -9 },
          "银行向科技公司提供信心",
          "公司获得了两年喘息时间。银行获得了公司大楼在内的若干信心抵押品。",
          ["crisisLoan"],
        ),
        choice(
          "出售一项技术",
          { cash: 11, tech: -12, market: 2 },
          "公司出售部分技术资产",
          "买家称这是一项过时技术，并在付款后立刻宣布它代表未来。",
          ["soldTech"],
        ),
      ],
    },
    C03: {
      year: 1982,
      type: "crisis",
      title: "最后一轮裁决",
      body: "危机还没有结束。你只能保住研发团队或销售渠道。",
      choices: [
        choice(
          "保住研发团队",
          { cash: -8, tech: 8, talent: 7, market: -10 },
          "公司收缩销售，保留研发部门",
          "下一代产品仍会完成。至于卖给谁，这是下一代销售部门的问题。",
          ["researchEmber"],
        ),
        choice(
          "保住销售渠道",
          { cash: 5, tech: -10, talent: -6, market: 9 },
          "公司集中资源服务现有客户",
          "订单重新流入。研发室的白板被搬去记录销售目标。",
          ["channelSurvivor"],
        ),
      ],
    },
    S05: {
      year: 1983,
      type: "turning",
      title: "下一台电脑属于谁？",
      body: "科技寒冬刚刚结束，三份计划同时摆上桌面：制造能挑战行业巨头的处理器、为电子游戏开发图形芯片，或者放弃自有品牌，专门替其他公司制造芯片。公司的钱只够认真相信一个未来。",
      choices: [
        choice(
          "继续打造自有产品",
          {},
          "公司决定继续经营自有产品",
          "品牌活了下来。至于下一枚芯片要争夺办公室还是客厅，董事会还要再吵一轮。",
        ),
        choice(
          "只替别人造芯片",
          { cash: -8, tech: 5, market: 4 },
          "公司放弃品牌转做专业制造",
          "消费者很快忘记了你的名字。竞争对手开始把设计图寄给你。",
          ["routeFab"],
        ),
      ],
    },
    S06: {
      year: 1983,
      type: "turning",
      title: "芯片要在哪里发光？",
      body: "自有产品路线已经确定，但资源只够攻下一块阵地：进入办公室挑战处理器标准，或者进入客厅押注更逼真的电子游戏画面。",
      choices: [
        choice(
          "挑战处理器巨头",
          { cash: -8, tech: 8, market: -4 },
          "幸存公司挑战处理器标准",
          "同行认为你很勇敢。银行使用了另一个以“鲁”开头的词。",
          ["routeCpu"],
        ),
        choice(
          "押注图形计算",
          { cash: -8, tech: 10, market: -6 },
          "公司重金投资电子游戏画面",
          "投资者询问更漂亮的游戏如何改变世界。工程师回答：先改变显卡价格。",
          ["routeGpu"],
        ),
      ],
    },
  };

  Object.assign(cards, {
    G01: {
      year: 1984,
      type: "operation",
      title: "主机仍然很赚钱",
      body: "旧式大型计算机贡献了公司大部分利润。销售部门建议继续涨维护费，年轻工程师却说，小电脑迟早会吃掉它。董事会认为被自己的产品吃掉很不体面。",
      choices: [
        choice(
          "守住利润中心",
          { cash: 16, market: 1, tech: -16 },
          "大型计算机利润再创新高",
          "公司度过了极其成功的一年。未来也因此被礼貌地推迟了一年。",
          ["legacyTrap"],
        ),
        choice(
          "主动淘汰旧产品",
          { cash: -14, tech: 10, market: -5 },
          "公司亲手终结明星产品",
          "分析师一致认为这是愚蠢行为。他们将在十年后把它写成经典案例。",
          ["selfCannibalize"],
        ),
      ],
    },
    RCPU1: {
      year: 1985,
      type: "tech",
      title: "和巨人说同一种语言",
      body: "工程师可以制造一种兼容主流软件、但更便宜的处理器。法务提醒你：兼容的意思，是产品能运行，律师也能运行。",
      choices: [
        choice(
          "兼容并做得更便宜",
          { cash: -13, tech: 9, market: 5 },
          "挑战者推出兼容处理器",
          "它运行了巨人的软件，也运行了巨人的法务部门。",
          ["cpuCompatible"],
        ),
        choice(
          "打造高端专用机器",
          { cash: -12, tech: 5, market: 8 },
          "公司发布豪华工作站",
          "它速度快、利润高，售价足以让普通顾客保持安全距离。",
          ["verticalEmpire"],
        ),
      ],
    },
    RGPU1: {
      year: 1985,
      type: "product",
      title: "给游戏画更多三角形",
      body: "电子游戏公司想要一枚专门处理画面的芯片。企业客户认为彩色爆炸不是严肃计算，除非发生在季度报表里。",
      choices: [
        choice(
          "成立图形芯片组",
          { cash: -12, tech: 10, market: 3 },
          "公司押注电子游戏画面",
          "投资者没有看懂产品，但他们的孩子要求再买一台。",
          ["graphicsCore"],
        ),
        choice(
          "专注办公加速",
          { cash: -8, tech: 3, market: 6 },
          "公司优化电子表格性能",
          "新芯片让表格快了两倍。办公室并没有因此提前下班。",
          ["legacyTrap"],
        ),
      ],
    },
    RFAB1: {
      year: 1985,
      type: "operation",
      title: "不和客户抢生意",
      body: "几家小型芯片公司希望你替他们生产，但要求你承诺永远不做同类产品。自己卖芯片利润更高，替别人制造则可能让所有人都成为客户。",
      choices: [
        choice(
          "只制造，不竞争",
          { cash: -13, tech: 6, market: 8 },
          "公司宣布成为中立制造伙伴",
          "你放弃了抢客户的市场。于是客户把整个市场带到了你门口。",
          ["neutralFoundry"],
        ),
        choice(
          "推出自有明星芯片",
          { cash: -13, tech: 5, market: 9 },
          "制造商进军自有品牌",
          "新产品利润丰厚。三位客户同时开始寻找新的制造商。",
          ["verticalEmpire"],
        ),
      ],
    },
    G02: {
      year: 1987,
      type: "person",
      title: "八个叛徒",
      body: "八名核心工程师要求股票和独立研发权。他们说没有这些条件就集体离职。财务部门计算后发现，拒绝他们是本季度最便宜的方案。",
      choices: [
        choice(
          "让技术人员成为合伙人",
          { cash: -16, talent: 12, tech: 5 },
          "核心工程师获得公司股份",
          "公司暂时失去了一部分所有权，保住了知道产品如何工作的全部人。",
          ["technicalPartners"],
        ),
        choice(
          "没人能绑架公司",
          { cash: 12, talent: -14, market: 3 },
          "公司拒绝工程师集体要求",
          "董事会捍卫了管理权。八名工程师在同一天下午注册了七家公司。",
          ["talentExodus"],
        ),
      ],
    },
    RCPU2: {
      year: 1989,
      type: "operation",
      title: "工厂还是设计图",
      body: "新一代工厂会吞掉五年利润。另一家公司愿意替你生产，让你把钱留给设计，但董事会担心没有烟囱的科技公司看起来不够伟大。",
      choices: [
        choice(
          "专注设计，委托生产",
          { cash: -7, tech: 11, market: -3 },
          "处理器公司出售制造部门",
          "媒体称你失去了工业灵魂。工程师发现灵魂原来每年需要折旧。",
          ["cpuFabless"],
        ),
        choice(
          "建造自己的超级工厂",
          { cash: -20, tech: 6, market: 10 },
          "公司兴建先进芯片工厂",
          "新工厂非常壮观。贷款合同也有相似的厚度。",
          ["verticalEmpire"],
        ),
      ],
    },
    RGPU2: {
      year: 1989,
      type: "tech",
      title: "让芯片听程序员的",
      body: "团队提出让图形芯片执行可修改的程序。这样会推迟产品，而且程序员可能用它做你从没批准过的事情。固定功能更便宜，也更容易写进广告。",
      choices: [
        choice(
          "改成可编程架构",
          { cash: -17, tech: 13, talent: 5 },
          "图形芯片首次允许自由编程",
          "第一批程序员用它画出了更真实的水。第二批开始问它能不能算别的。",
          ["programmableGraphics"],
        ),
        choice(
          "固定功能已经够快",
          { cash: 8, tech: -8, market: 1 },
          "公司刷新图形性能纪录",
          "产品赢下了所有当年的评测。遗憾的是，年份也写在包装盒上。",
          ["legacyTrap"],
        ),
      ],
    },
    RFAB2: {
      year: 1989,
      type: "operation",
      title: "衰退期的新工厂",
      body: "芯片需求正在下滑，同行纷纷取消扩建。设备厂商愿意打折出售最新机器。财务部门说，在没人需要芯片时扩产，听起来像一种昂贵的精神疾病。",
      choices: [
        choice(
          "逆周期扩建",
          { cash: -12, tech: 12, market: -4 },
          "公司在行业低谷扩建工厂",
          "所有人都在缩减产能时，你买下了他们不要的设备。银行开始每天打电话关心你的健康。",
          ["fabCounterCycle"],
        ),
        choice(
          "等订单回来再投资",
          { cash: 8, tech: -10, market: 3 },
          "公司暂停高风险扩建",
          "资产负债表变得非常漂亮。新工厂的交货期也变成了四年。",
          ["legacyTrap"],
        ),
      ],
    },
    G03: {
      year: 1991,
      type: "operation",
      title: "什么都自己做",
      body: "公司已经同时制造芯片、电脑、系统和软件。高管建议再收购一家显示器公司，实现从沙子到屏幕的伟大闭环。",
      choices: [
        choice(
          "建立完整科技帝国",
          { cash: 8, market: 8, talent: -15 },
          "公司完成全产业链布局",
          "从螺丝到操作系统都由你负责。包括所有螺丝和操作系统的错误。",
          ["verticalEmpire"],
        ),
        choice(
          "出售边缘业务",
          { cash: 4, tech: 2, market: -5 },
          "科技公司拆分非核心部门",
          "公司规模缩小了，会议数量也奇迹般地下降了。",
          ["modularBusiness"],
        ),
      ],
    },
    RCPU3: {
      year: 1993,
      type: "market",
      title: "巨人的价格战",
      body: "行业巨头开始降价，试图让你的处理器失去生存空间。顾问建议退出低价市场，改卖利润更高的豪华型号。",
      choices: [
        choice(
          "继续做平价挑战者",
          { cash: -15, market: 13, talent: 3 },
          "处理器价格战全面爆发",
          "每卖出一枚芯片，你都更接近市场，也更接近银行经理。",
          ["cpuValue"],
        ),
        choice(
          "转向高利润旗舰",
          { cash: 4, tech: 4, market: -7 },
          "公司退出大众处理器市场",
          "利润率恢复了。消费者也恢复了只记得巨头名字的习惯。",
          ["legacyTrap"],
        ),
      ],
    },
    RGPU3: {
      year: 1993,
      type: "market",
      title: "免费送出开发工具",
      body: "没有足够多的游戏支持你的芯片。团队建议免费提供开发工具并帮助工作室适配；销售部门认为把东西免费送人不是一种成熟的收费模式。",
      choices: [
        choice(
          "培养开发者生态",
          { cash: -17, talent: 7, market: 11 },
          "公司向游戏开发者免费开放工具",
          "工具没有直接收入，却让越来越多的新游戏只在你的芯片上跑得顺畅。",
          ["developerEcosystem"],
        ),
        choice(
          "按项目收授权费",
          { cash: 6, market: -8, tech: 3 },
          "图形工具开始贡献利润",
          "每位开发者都按时付费。其中一些甚至继续开发。",
          ["legacyTrap"],
        ),
      ],
    },
    RFAB3: {
      year: 1993,
      type: "tech",
      title: "一片晶圆，半数废品",
      body: "新工艺良率低得惊人。工程团队要求停线三个月查清每个缺陷，销售部门建议把能工作的部分切下来，剩余部分称为限量版。",
      choices: [
        choice(
          "停线追查每个缺陷",
          { cash: -14, tech: 12, talent: 7, market: -4 },
          "工厂暂停交付改善良率",
          "客户很不高兴。三个月后，他们收到的芯片第一次全部能用。",
          ["yieldCulture"],
        ),
        choice(
          "先把合格品卖出去",
          { cash: 8, market: 3, tech: -10 },
          "芯片厂维持创纪录出货",
          "季度数字保住了。报废箱也获得了自己的仓库。",
          ["legacyTrap"],
        ),
      ],
    },
    G04: {
      year: 1996,
      type: "operation",
      title: "委员会保证不会犯错",
      body: "公司规模扩大后，高管建议所有新项目先通过七个委员会。流程能避免浪费，也能确保任何失败都找不到具体负责人。",
      choices: [
        choice(
          "交给委员会审批",
          { cash: 11, market: 6, tech: -9, talent: -7 },
          "公司启用全新项目管理制度",
          "从此没有项目未经讨论就失败。大部分项目在讨论阶段完成了失败。",
          ["committeeCompany"],
        ),
        choice(
          "保留秘密项目组",
          { cash: -16, tech: 9, talent: 8 },
          "小型团队获得独立研发权",
          "他们没有提交周报，因此只好提交了产品。",
          ["skunkworks"],
        ),
      ],
    },
    RCPU4: {
      year: 1998,
      type: "tech",
      title: "新架构要不要忘记过去",
      body: "全新处理器可以更快，但旧软件无法直接运行。保留兼容会让设计复杂得像一栋不断加盖的老楼，却能让客户继续住在里面。",
      choices: [
        choice(
          "背着兼容性前进",
          { cash: -18, tech: 10, market: 9 },
          "新处理器继续支持旧软件",
          "工程师诅咒这项决定，客户甚至没有注意到它。这通常意味着成功。",
          ["cpuContinuity"],
        ),
        choice(
          "彻底抛弃旧架构",
          { cash: 1, tech: 14, market: -14 },
          "公司发布纯净的新处理器架构",
          "技术评论家称它优雅得像艺术品。顾客也像参观艺术品一样只看不买。",
          ["legacyTrap"],
        ),
      ],
    },
    RGPU4: {
      year: 1998,
      type: "tech",
      title: "显卡不只会画画",
      body: "研究员发现，大量图形核心可以同时处理普通计算。这个市场目前几乎不存在。继续提高游戏帧率，则能立刻写进包装盒。",
      choices: [
        choice(
          "投资并行计算",
          { cash: -16, tech: 15, talent: 5, market: -3 },
          "图形芯片开始尝试通用计算",
          "它算出的第一项成果，是这个项目短期内不会赚钱。",
          ["parallelCompute"],
        ),
        choice(
          "让游戏再快一点",
          { cash: -15, tech: 6, market: 10 },
          "新显卡刷新游戏速度纪录",
          "玩家非常满意，直到六个月后出现了下一张显卡。",
          ["legacyTrap"],
        ),
      ],
    },
    RFAB4: {
      year: 1998,
      type: "risk",
      title: "客户的设计图",
      body: "大客户的新芯片设计出现在你的生产线上。自家团队说，借鉴其中一小部分就能省下两年研发。合同只用了四十七页说明为什么不可以。",
      choices: [
        choice(
          "封存图纸，只负责制造",
          { cash: -15, market: 12, talent: 4 },
          "代工厂重申客户机密承诺",
          "你没有得到那项设计，却得到了所有客户最难购买的东西：信任。",
          ["customerTrust"],
        ),
        choice(
          "吸收设计推出自有芯片",
          { cash: -1, tech: 12, market: -10 },
          "制造商发布惊人相似的新芯片",
          "产品研发速度震惊行业。客户迁移速度更快。",
          ["verticalEmpire"],
        ),
      ],
    },
    C04: {
      year: 2000,
      type: "crisis",
      title: "互联网公司愿意付任何价格",
      body: "一家没有收入的网站公司要包下未来三年的产能，并用即将上市的股票付款。所有分析师都说互联网已经取消了旧经济规律。",
      choices: [
        choice(
          "接受股票和超级订单",
          { cash: 12, market: 8, tech: -9, reputation: -10 },
          "科技公司押注互联网超级客户",
          "合同价值每天都在上涨，至少在证券交易所开门的时候。",
          ["bubbleDebt"],
        ),
        choice(
          "只收现金，限制订单",
          { cash: -5, market: -7, talent: 3 },
          "公司拒绝互联网天价订单",
          "投资者称你缺乏想象力。财务部门第一次把这当作赞美。",
          ["coreProtected"],
        ),
      ],
    },
    C05: {
      year: 2001,
      type: "crisis",
      title: "访问量不能支付工资",
      body: "泡沫破裂，客户一夜之间消失。董事会要求立即砍掉所有暂时不赚钱的项目，而这些项目恰好包括你过去十五年的战略。",
      choices: [
        choice(
          "保护核心路线",
          { cash: -10, talent: 8, tech: 5, market: -6 },
          "公司在崩盘中保留核心团队",
          "办公楼卖掉了一层。关键项目搬到剩下那层继续烧钱。",
          ["coreProtected"],
        ),
        choice(
          "全面削减研发",
          { cash: 18, tech: -13, talent: -10, market: 3 },
          "公司以强力重组应对危机",
          "季度亏损消失了。负责下一季度产品的人也消失了。",
          ["committeeCompany"],
        ),
      ],
    },
    C06: {
      year: 2001,
      type: "crisis",
      title: "第二次生存审判",
      body: "银行、客户和员工都在等待答案。二十年前选择的道路，现在必须证明它不是一场持续时间特别长的误会。",
      choices: [
        choice(
          "抵押一切，坚持到底",
          { cash: -10, tech: 5, talent: 5 },
          "公司拒绝放弃长期战略",
          "你把剩余资产押在同一条路上。银行终于确认，你不是临时冲动。",
          ["coreProtected"],
        ),
        choice(
          "转型成综合服务公司",
          { cash: 5, market: 6, tech: -10 },
          "公司放弃原有战略寻求稳定",
          "公司成功避免了立即死亡，并开始漫长地练习消失。",
          ["legacyTrap", "abandonedStrategy"],
        ),
      ],
    },
  });

  const conditionalCards = {
    E10: {
      ownFactory: {
        year: 1974,
        type: "operation",
        title: "工厂需要升级",
        body: "工厂主管说生产线已经跟不上新芯片。升级费用很高，不升级的成本暂时看不见，所以董事会更喜欢后者。",
        choices: [
          choice(
            "全面升级",
            { cash: -19, tech: 8, talent: 4, market: 8 },
            "本地工厂完成现代化改造",
            "新设备使产量翻倍。旧设备被搬到门口，成为“公司历史展览”。",
            ["modernFactory"],
            ["ownFactory"],
          ),
          choice(
            "再用几年",
            { cash: 8, tech: -6, market: -4 },
            "老设备继续创造价值",
            "财务部门称它们经受住了时间考验。工厂主管称时间显然赢了。",
            ["oldFactory"],
            ["ownFactory"],
          ),
        ],
      },
      default: {
        year: 1974,
        type: "operation",
        title: "代工厂涨价",
        body: "代工厂宣布涨价，并提醒你双方一直是“平等伙伴”。他们负责生产，你负责平等地接受新价格。",
        choices: [
          choice(
            "签长期合同",
            { cash: -8, market: 8, tech: -2 },
            "公司锁定长期产能",
            "未来三年供应得到保障。合同没有讨论第四年，因为那会破坏气氛。",
            ["stableFoundry"],
            ["outsourced"],
          ),
          choice(
            "寻找更便宜的工厂",
            { cash: 5, market: -6, talent: -3 },
            "公司重组供应网络",
            "价格确实降低了。新工厂的位置需要在另一张地图上查看。",
            ["cheapFoundry"],
            ["outsourced"],
          ),
        ],
      },
    },
    P02: {
      shenEmployed: {
        year: 1975,
        type: "person",
        title: "沈岚的第二张牌",
        body: "沈岚要求成立独立芯片团队。她需要一整年预算，并承诺产品完成后会比现在所有机器都快。她拒绝承诺具体是哪一年完成。",
        choices: [
          choice(
            "成立独立团队",
            { cash: -20, tech: 15, talent: 6 },
            "公司成立秘密芯片部门",
            "部门并不秘密。全公司都能听见他们争论。",
            ["pioneerChip"],
          ),
          choice(
            "先服务现有订单",
            { cash: 9, tech: -6, talent: -8 },
            "公司优先保障客户交付",
            "客户对决定表示满意。沈岚没有发表评论，只清空了办公室抽屉。",
            ["shenGone"],
            ["shenEmployed"],
          ),
        ],
      },
      default: {
        year: 1975,
        type: "person",
        title: "街对面的新公司",
        body: "沈岚带着自己的公司回来。她的新芯片更快、更便宜，并且宣传册第一页写着：“我们只发股份。”",
        choices: [
          choice(
            "投资她的公司",
            { cash: -12, tech: 8, market: 5 },
            "昔日求职者成为合作伙伴",
            "双方表示从未有过矛盾。旧面试记录在当天神秘失踪。",
            ["shenPartner"],
          ),
          choice(
            "推出竞争产品",
            { cash: -8, tech: 10, talent: -5, market: 3 },
            "两家公司正面竞争",
            "你们的产品按时发布，性能也十分接近对方上一代产品。",
            ["shenRival"],
          ),
        ],
      },
    },
  };

  const companyActions = {
    variance: { normal: [-5, 5], crisis: [-7, 3], crisisYears: [1982, 2000, 2001] },
    actions: {
      takeOrder: { label: "接普通订单", effects: { cash: 10, talent: -4, market: 2 } },
      research: { label: "加大研发", effects: { cash: -8, tech: 9 } },
      developProduct: { label: "开发产品", effects: { cash: -10, tech: 6, market: 7 } },
      upgradeEquipment: { label: "升级仪器", effects: { cash: -14 } },
      hireJunior: { label: "招募初级人才", effects: { cash: -6, talent: 8 } },
      hireSenior: { label: "招募高级人才", effects: { cash: -10, talent: 12 } },
      trainTeam: { label: "培训团队", effects: { cash: -6, talent: 6, tech: 3 } },
      expandMarket: { label: "扩张市场", effects: { cash: -7, market: 10 } },
      holdCash: { label: "保留现金", effects: { cash: 5, tech: -3 } },
    },
    defaultVarianceCopy: {
      cash: {
        positive: [
          "银行突然降低了利息，并坚持这与季度目标毫无关系。",
          "一笔被财务部追到失去尊严的旧账终于到账。",
        ],
        negative: [
          "预算发现了几项此前羞于露面的费用。",
          "银行重新评估风险后，决定主要评估你的承受能力。",
        ],
      },
      tech: {
        positive: [
          "工程师意外解决了一个原本准备留给下一任工程师的问题。",
          "实验设备短暂服从了说明书，研发因此超出预期。",
        ],
        negative: [
          "原型机证明了失败也可以稳定复现。",
          "团队花了一周确认问题不是电源，最后发现问题包括电源。",
        ],
      },
      talent: {
        positive: [
          "项目吸引来几名熟手，他们还没来得及阅读加班制度。",
          "团队意外留下了本来已经写好辞职信的人。",
        ],
        negative: [
          "交付压力让几名员工更新了简历，并成功通过了内部网络。",
          "管理层称这是人才结构优化，离开的人称这是门。",
        ],
      },
      market: {
        positive: [
          "市场反馈比预期更热烈，销售部立即声称早有预料。",
          "客户主动推荐了产品，市场部正在申请把这算作自己的工作。",
        ],
        negative: [
          "市场反馈低于预期，顾客一致认为产品很适合其他顾客。",
          "宣传触达了所有人，购买按钮除外。",
        ],
      },
      reputation: {
        positive: ["公众把一次正常履约视为行业奇迹。", "记者罕见地读完了公司的第二段声明。"],
        negative: [
          "公关稿成功回答了一个没人问的问题。",
          "公司解释得越详细，外界越确定事情不简单。",
        ],
      },
    },
    actionVarianceCopy: {
      takeOrder: {
        cash: {
          positive: ["客户回款比预期更快。财务部短暂相信了人性。"],
          negative: ["客户的现金流也很紧张，于是把你的发票列入了长期规划。"],
        },
        talent: {
          positive: ["客户项目吸引来几名熟手，他们误以为交付日期只是建议。"],
          negative: ["交付压力赶走了几名员工，客户称这证明项目富有挑战性。"],
        },
        market: {
          positive: ["客户的推荐带来了新订单，销售部迅速补签了功劳。"],
          negative: ["客户给出了诚实反馈，市场部希望下次改用匿名问卷。"],
        },
      },
    },
  };

  const management = {
    years: {
      MANAGEMENT_1: 1967,
      MANAGEMENT_2: 1971,
      MANAGEMENT_3: 1977,
      MANAGEMENT_4: 1981,
      MANAGEMENT_5: 1989,
      MANAGEMENT_6: 1998,
    },
    title: "这一期的钱花在哪里？",
    body: "年度收入和固定成本已经入账。剩余预算只能重点支持一项工作，财务部门建议至少让其中一项看起来像计划。",
    plans: [
      {
        actionId: "research",
        label: "加大研发投入",
        budgetLabel: "研发预算",
        budgetCost: 9,
        previewEffects: { tech: 6, talent: 2, reputation: 1 },
        effects: { tech: 6, talent: 2, reputation: 1 },
        headline: "公司批准新一轮研发预算",
        result: "工程师获得了更多设备和更少借口。财务部门获得了一份更长的报销单。",
      },
      {
        actionId: "expandMarket",
        label: "扩张市场渠道",
        budgetLabel: "市场扩张",
        budgetCost: 7,
        previewEffects: { market: 7, reputation: 3 },
        effects: { market: 7, reputation: 3 },
        headline: "公司开始扩大销售网络",
        result: "更多顾客听说了公司。其中一部分甚至听说了公司的产品。",
      },
      {
        actionId: "holdCash",
        label: "保留现金过冬",
        budgetLabel: "专项投入",
        budgetCost: 0,
        previewEffects: { tech: -2, reputation: -1 },
        effects: { tech: -2, reputation: -1 },
        headline: "公司宣布执行稳健预算",
        result: "账上的钱没有减少。未来没有立刻抗议，只是往后退了一小步。",
      },
    ],
  };

  const annual = {
    startYear: 1960,
    endYear: 2001,
    decisionsPerYear: 3,
    timeline: {
      firstEra: {
        1960: ["S01"],
        1961: ["S02"],
        1963: ["E01"],
        1964: ["E02"],
        1965: ["P01"],
        1966: ["E03"],
        1967: ["E04", "MANAGEMENT_1"],
        1968: ["E05"],
        1969: ["E06"],
        1970: ["E07"],
        1971: ["E08", "MANAGEMENT_2"],
        1972: ["S03"],
        1973: ["E09"],
        1974: ["E10"],
        1975: ["P02"],
        1976: ["E11"],
        1977: ["E12", "MANAGEMENT_3"],
        1978: ["E13"],
        1979: ["E14"],
        1980: ["E15"],
        1981: ["E16", "MANAGEMENT_4"],
        1982: ["C01", "C02", "C03"],
      },
      secondEra: {
        1984: ["G01"],
        1987: ["G02"],
        1989: ["MANAGEMENT_5"],
        1991: ["G03"],
        1996: ["G04"],
        1998: ["MANAGEMENT_6"],
        2000: ["C04"],
        2001: ["C05", "C06"],
      },
      routes: {
        cpu: { 1985: ["RCPU1"], 1989: ["RCPU2"], 1993: ["RCPU3"], 1998: ["RCPU4"] },
        gpu: { 1985: ["RGPU1"], 1989: ["RGPU2"], 1993: ["RGPU3"], 1998: ["RGPU4"] },
        fab: { 1985: ["RFAB1"], 1989: ["RFAB2"], 1993: ["RFAB3"], 1998: ["RFAB4"] },
      },
    },
    decisionCards: {
      COMP_01: {
        category: "competitor",
        title: "买一点敌人的未来",
        body: "街对面的公司准备融资。财务总监建议买入股份，至少这样他们成功时你可以用分红擦眼泪。",
        choices: [
          choice(
            "买入少量股份",
            { cash: -6, market: 2 },
            "公司成为竞争对手的小股东",
            "双方仍在互相攻击，只是现在其中一部分攻击会计入投资收益。",
            ["rivalShares"],
          ),
          choice(
            "公开宣布正面竞争",
            { tech: 2, market: 2, reputation: -3 },
            "两家公司正式开战",
            "市场终于知道谁是敌人。遗憾的是，市场仍没记住谁是你。",
            ["rivalEnemy"],
          ),
        ],
      },
      COMP_02: {
        category: "competitor",
        title: "对手突然降价",
        body: "竞争对手把价格降到接近成本。销售部建议跟进，财务部建议先确认“接近”的方向。",
        choices: [
          choice(
            "同步降价",
            { cash: -5, market: 6 },
            "行业价格战升级",
            "每卖一台都能获得一位顾客，并失去一点继续卖下一台的能力。",
          ),
          choice(
            "维持价格",
            { cash: 3, market: -4, reputation: 1 },
            "公司拒绝加入价格战",
            "利润率保住了。顾客也保住了去别家购物的权利。",
            ["premiumPosition"],
          ),
        ],
      },
      COMP_03: {
        category: "competitor",
        title: "对面的工程师想跳槽",
        body: "竞争对手的架构师递来简历，要求高薪和一间没有录音设备的办公室。法务说第二项尤其可疑。",
        choices: [
          choice(
            "高薪挖来",
            { cash: -8, tech: 6, talent: 4, reputation: -1 },
            "竞争对手核心工程师转投本公司",
            "他带来了丰富经验，以及一只绝不打开的旧公文包。",
            ["talentPoaching"],
          ),
          choice(
            "拒绝行业挖角",
            { talent: 2, reputation: 2, tech: -3 },
            "公司承诺不参与恶性挖角",
            "全行业为职业道德鼓掌，然后继续在晚餐时交换名片。",
            ["fairHiring"],
          ),
        ],
      },
      COMP_04: {
        category: "competitor",
        title: "共同标准委员会",
        body: "五家竞争对手邀请你制定行业标准。标准将免费开放，委员会午餐则按豪华标准收费。",
        choices: [
          choice(
            "加入开放标准",
            { cash: -9, tech: 3, market: 5, reputation: 2 },
            "公司加入开放标准联盟",
            "大家终于使用同一种接口，只保留了十二种互不兼容的解释。",
            ["openStandard"],
          ),
          choice(
            "坚持自有接口",
            { cash: 4, tech: 2, market: -5 },
            "公司拒绝统一行业接口",
            "你的接口更先进、更漂亮，也更适合独自插在桌上。",
            ["closedStandard"],
          ),
        ],
      },
      COMP_05: {
        category: "competitor",
        title: "收购一间快死的公司",
        body: "一家创业公司只剩三个月现金、两项专利和一台很贵的咖啡机。投行称这是一套完整资产组合。",
        choices: [
          choice(
            "低价收购",
            { cash: -8, tech: 5, talent: 3 },
            "公司完成逆势收购",
            "你买下了专利、团队和咖啡机。三者中只有咖啡机附带保修。",
            ["startupPortfolio"],
          ),
          choice(
            "等它自然倒闭",
            { cash: 2, reputation: -1 },
            "公司放弃收购机会",
            "三个月后专利被巨头买走，咖啡机进入了破产拍卖。",
          ),
        ],
      },
      COMP_06: {
        category: "competitor",
        minYear: 1970,
        title: "匿名报告非常实名",
        body: "公关主管建议向记者透露对手产品的缺陷。文件作者栏里还留着你的名字，但他认为记者不会看属性。",
        choices: [
          choice(
            "把材料交给记者",
            { market: 5, reputation: -6 },
            "竞争对手陷入质量丑闻",
            "报道非常成功。记者下一篇文章开始调查材料是谁提供的。",
            ["dirtyCompetition"],
          ),
          choice(
            "公开做对比测试",
            { cash: -7, tech: 2, market: 3, reputation: 3 },
            "公司发布公开产品测试",
            "结果没有标题那么刺激，却经得起记者把页面翻到第二页。",
            ["fairCompetition"],
          ),
        ],
      },

      SUP_01: {
        category: "supply",
        title: "第二家供应商",
        body: "采购部建议为关键零件准备第二家供应商。价格会更高，但“所有鸡蛋”终于不必参加同一次停电。",
        choices: [
          choice(
            "建立双供应链",
            { cash: -5, market: 2 },
            "公司建立备用供应链",
            "仓库多了两套表格，世界少了一个掐住你脖子的开关。",
            ["dualSupply"],
          ),
          choice(
            "集中给最低价厂商",
            { cash: 3, market: -2 },
            "公司集中采购降低成本",
            "采购成本创下新低。风险也实现了前所未有的集中管理。",
            ["singleSupplier"],
          ),
        ],
      },
      SUP_02: {
        category: "supply",
        title: "提前预订产能",
        body: "晶圆厂愿意锁定明年产能，但要现在付款。销售预测很乐观，因为预测部门不负责付款。",
        choices: [
          choice(
            "预付产能",
            { cash: -7, market: 5 },
            "公司提前锁定产能",
            "明年的生产有了保障。今年的现金开始体验失业。",
            ["reservedCapacity"],
          ),
          choice(
            "到时候再下单",
            { cash: 3, market: -2 },
            "公司拒绝提前支付产能",
            "资产负债表非常轻盈，轻盈到一阵缺货就能把它吹走。",
          ),
        ],
      },
      SUP_03: {
        category: "supply",
        title: "抽检还是相信握手",
        body: "新供应商保证良品率达到九成，并用力握了你的手。质量主管认为握力不是国际计量单位。",
        choices: [
          choice(
            "增加质量抽检",
            { cash: -4, tech: 2, reputation: 3 },
            "公司强化来料检验",
            "不合格零件被提前发现。供应商称这破坏了双方互相信任的传统。",
            ["qualityGate"],
          ),
          choice(
            "先按时出货",
            { cash: 3, market: 2, reputation: -4 },
            "公司缩短质量检查",
            "产品准时离开工厂，部分产品甚至靠自己的力量离开。",
            ["qualityDebt"],
          ),
        ],
      },
      SUP_04: {
        category: "supply",
        title: "供应商要求独家",
        body: "关键材料厂愿意降价，条件是未来五年只向它采购。合同附送一支钢笔，可能方便你签下自己的脖子。",
        choices: [
          choice(
            "签独家采购",
            { cash: 5, market: 2, reputation: -6 },
            "公司签署独家采购协议",
            "成本下降了，供应商的电话号码也变得更有分量。",
            ["singleSupplier"],
          ),
          choice(
            "保留议价空间",
            { cash: -4, reputation: 2 },
            "公司维持多家供应商",
            "采购员需要多打几通电话，公司则不必只等一通电话。",
            ["dualSupply"],
          ),
        ],
      },
      SUP_05: {
        category: "supply",
        title: "仓库里的安全感",
        body: "运营主管想囤积半年零件。财务总监说库存不是安全感，只是穿着纸箱的现金。",
        choices: [
          choice(
            "建立战略库存",
            { cash: -6, market: 3 },
            "公司增加关键零件库存",
            "仓库塞满了未来。消防通道塞满了现在。",
            ["bufferStock"],
          ),
          choice(
            "维持即时采购",
            { cash: 4, market: -3 },
            "公司压缩库存水平",
            "零件到厂五分钟后上线。任何迟到六分钟的卡车都将成为战略事件。",
            ["leanSupply"],
          ),
        ],
      },
      SUP_06: {
        category: "supply",
        minYear: 1970,
        title: "供应商的夜班",
        body: "调查发现供应商让员工连续工作十六小时。对方解释说，那是两个非常接近的八小时班次。",
        choices: [
          choice(
            "暂停合作并审计",
            { cash: -6, market: -2, reputation: 6 },
            "公司调查供应链劳动问题",
            "订单晚了，声明也晚了，但至少工人终于准时下班。",
            ["ethicalSupply"],
          ),
          choice(
            "要求对方改善措辞",
            { cash: 5, market: 2, reputation: -7 },
            "供应商更新员工手册",
            "十六小时工作制被改名为“双倍成长机会”。",
            ["supplyScandal"],
          ),
        ],
      },

      PEO_01: {
        category: "personnel",
        title: "股票还是工资",
        body: "核心员工要求加薪。财务部提出发股票，因为未来的钱在今天的账上看起来格外便宜。",
        choices: [
          choice(
            "授予员工期权",
            { cash: -7, talent: 6, reputation: 2 },
            "员工获得公司期权",
            "大家开始关心长期价值，也开始频繁询问公司到底值多少钱。",
            ["employeeEquity"],
          ),
          choice(
            "直接提高工资",
            { cash: -6, talent: 4 },
            "公司上调核心员工薪资",
            "员工获得了可以实际购买午餐的回报，士气明显改善。",
            ["fairPay"],
          ),
        ],
      },
      PEO_02: {
        category: "personnel",
        title: "吹哨人的文件袋",
        body: "一名会计发现销售部门提前确认收入。他带来一袋证据，并强调这不是辞职信，暂时不是。",
        choices: [
          choice(
            "公开更正报表",
            { cash: -5, market: -3, reputation: 7 },
            "公司主动更正财务报表",
            "股价跌了，可信度涨了。董事会正在研究后者能否支付账单。",
            ["honestBooks"],
          ),
          choice(
            "把他调去地下室",
            { cash: 5, talent: -4, reputation: -8 },
            "公司否认财务记录异常",
            "报表恢复平静。地下室多了一张办公桌和一家报社的电话号码。",
            ["accountingScandal"],
          ),
        ],
      },
      PEO_03: {
        category: "personnel",
        title: "董事长的外甥",
        body: "董事长推荐外甥负责新部门。简历的核心优势是姓氏与董事长完全兼容。",
        choices: [
          choice(
            "安排一个顾问职位",
            { cash: -3, talent: -3, reputation: -2 },
            "董事长亲属加入公司",
            "他没有管理实权，只管理所有需要董事长签字的项目。",
            ["nepotism"],
          ),
          choice(
            "坚持公开招聘",
            { talent: 4, reputation: 3, cash: -6 },
            "公司拒绝裙带任命",
            "董事长尊重制度，并在接下来三次会议中尊重地反对你。",
            ["meritHiring"],
          ),
        ],
      },
      PEO_04: {
        category: "personnel",
        minYear: 1965,
        title: "自愿通宵计划",
        body: "项目延期，经理建议连续加班两周，并强调参加完全自愿，不参加的名单也完全自愿保存。",
        choices: [
          choice(
            "启动冲刺",
            { tech: 6, talent: -7, reputation: -2 },
            "研发团队连续通宵",
            "项目赶上了进度。几名工程师也赶上了更新简历的进度。",
            ["crunchCulture"],
          ),
          choice(
            "推迟发布日期",
            { cash: -4, market: -3, talent: 5, reputation: 2 },
            "公司推迟产品发布",
            "客户很失望，员工很清醒，这两种情绪第一次同时出现在办公室。",
            ["sustainableTeam"],
          ),
        ],
      },
      PEO_05: {
        category: "personnel",
        title: "工程师的自由星期五",
        body: "研发团队希望每周留一天研究没有客户、没有预算、也没有确定用途的东西。财务部只认可最后一项。",
        choices: [
          choice(
            "允许自由研究",
            { cash: -10, tech: 6, talent: 5 },
            "公司设立自由研究日",
            "第一批成果毫无用处。第二批成果让第一批突然显得像长期规划。",
            ["researchFreedom"],
          ),
          choice(
            "所有项目必须有客户",
            { cash: 5, tech: -3, talent: -4, market: 2 },
            "研发项目全面绑定订单",
            "每项研究都有客户。没有客户的未来也被顺利取消。",
            ["salesLed"],
          ),
        ],
      },
      PEO_06: {
        category: "personnel",
        title: "销售冠军的奖金",
        body: "销售冠军要求把奖金翻倍，并指出公司一半订单都有他的签名。法务确认另一半也很像他的字迹。",
        choices: [
          choice(
            "批准高额佣金",
            { cash: -9, market: 6, talent: +3 },
            "公司提高销售佣金",
            "订单增长了，销售费用也以同样坚定的速度追了上去。",
            ["salesMachine"],
          ),
          choice(
            "为销售团队发奖金",
            { cash: -5, market: -4, talent: 3, reputation: 2 },
            "销售奖金改为团队分配",
            "冠军很生气，团队第一次发现自己也是冠军的一部分。",
            ["teamBonus"],
          ),
        ],
      },

      GOV_01: {
        category: "governance",
        title: "把明年的订单放进今年",
        body: "财务主管说，只要客户口头答应，收入就可以提前确认。审计师说这取决于“口头”有多大声。",
        choices: [
          choice(
            "坚持收到钱再入账",
            { cash: -2, market: -2, reputation: 5 },
            "公司采用保守收入确认",
            "季度数字变难看了，下一季度却第一次不需要向过去借钱。",
            ["honestBooks"],
          ),
          choice(
            "提前确认增长",
            { cash: 4, market: 4, reputation: -7 },
            "公司公布超预期增长",
            "增长准确地超出了现实可以提供的范围。",
            ["accountingScandal"],
          ),
        ],
      },
      GOV_02: {
        category: "governance",
        minYear: 1968,
        title: "游说预算",
        body: "顾问表示，一小笔政策沟通费能让监管者更理解技术。账单显示，理解通常按小时收费。",
        choices: [
          choice(
            "建立政策团队",
            { cash: -5, market: 3 },
            "公司加强政策沟通",
            "监管者开始理解你的业务，至少理解到足以提出更具体的问题。",
            ["policyNetwork"],
          ),
          choice(
            "远离政治",
            { cash: 1, reputation: 2, market: -2 },
            "公司拒绝游说支出",
            "公司保持清白，也保持了在听证会最后一排的位置。",
          ),
        ],
      },
      GOV_03: {
        category: "governance",
        minYear: 1970,
        title: "安全预算看不见",
        body: "安全主管要求更新门禁和备份系统。董事会问，既然事故还没发生，为什么要为它付款。",
        choices: [
          choice(
            "升级安全系统",
            { cash: -5, tech: 2, reputation: 3 },
            "公司强化信息安全",
            "新系统成功阻止了所有已知风险，并创造了三种新的登录问题。",
            ["secureSystems"],
          ),
          choice(
            "事故发生后再处理",
            { cash: 4, reputation: -3 },
            "公司推迟安全升级",
            "本季度没有事故。安全部门把这句话打印出来，准备贴在事故报告首页。",
            ["securityDebt"],
          ),
        ],
      },
      GOV_04: {
        category: "governance",
        minYear: 1980,
        title: "客户资料也能赚钱",
        body: "市场部发现客户名单可以卖给广告商。客户协议没有禁止，因为写协议时没人想到公司会这么有创意。",
        choices: [
          choice(
            "拒绝出售资料",
            { cash: -7, reputation: 6, market: 2 },
            "公司承诺保护客户资料",
            "你放弃了一笔快钱，客户则第一次认真读完了隐私声明。",
            ["privacyTrust"],
          ),
          choice(
            "匿名后出售",
            { cash: 6, market: 3, reputation: -8 },
            "公司开辟数据收入",
            "所有姓名都被删除，只留下地址、职业、生日和足够猜出姓名的其余信息。",
            ["privacyScandal"],
          ),
        ],
      },
      GOV_05: {
        category: "governance",
        title: "第一次分红",
        body: "股东要求公司开始分红。研发主管说钱应该投入未来，股东回答他们也计划活到未来。",
        choices: [
          choice(
            "发放股东分红",
            { cash: -6, market: 4, tech: -2 },
            "公司宣布首次分红",
            "股东终于分享了成功。研发部门分享了削减后的设备目录。",
            ["shareholderFirst"],
          ),
          choice(
            "保留全部利润",
            { cash: 0, tech: 3, market: -2 },
            "公司继续保留利润",
            "股东被要求相信长期价值，这是一种没有到期日的支付方式。",
            ["retainedEarnings"],
          ),
        ],
      },
      GOV_06: {
        category: "governance",
        minYear: 1970,
        title: "一个没有客户的豪赌",
        body: "研究员提出一项十年后可能改变行业的计划。目前唯一明确的交付物是一张非常漂亮的路线图。",
        choices: [
          choice(
            "批准秘密项目",
            { cash: -10, tech: 8, talent: 3 },
            "公司启动长期研究项目",
            "项目没有客户、收入或截止日期，因此完全符合未来的定义。",
            ["moonshot"],
          ),
          choice(
            "把预算投给现有产品",
            { cash: 2, market: 4, tech: -5 },
            "公司集中改良畅销产品",
            "今年的产品更好卖了。十年后的产品尚未提出异议。",
            ["incrementalism"],
          ),
        ],
      },
    },
    externalEvents: {
      EXT_PC: {
        minYear: 1975,
        title: "个人电脑突然成为个人问题",
        body: "一家同行发布了普通人买得起的个人电脑。商店门口开始排队，董事会开始争论普通人为什么突然需要个人电脑。",
        defaultOutcome: {
          effects: { market: -6, reputation: -3 },
          headline: "个人电脑改写市场",
          result: "新市场出现了，而你的公司在新闻照片的背景里贡献了一块非常稳定的墙。",
        },
        variants: [
          {
            requires: ["rivalShares"],
            effects: { cash: 9, market: 3 },
            headline: "竞争对手的成功寄来支票",
            result: "那家公司卖出了成千上万台电脑。你持有的股份终于证明，承认别人聪明也可以盈利。",
          },
          {
            requires: ["rivalEnemy"],
            effects: { market: -11, reputation: -7 },
            headline: "竞争对手定义个人电脑",
            result: "消费者记住了对手的名字，也记住你曾公开说这种产品没有市场。",
          },
        ],
      },
      EXT_RATE_CUT: {
        title: "中央银行降低利率",
        body: "政府宣布降低利率以刺激投资。银行经理笑得比政策发布会上的任何人都真诚。",
        defaultOutcome: {
          effects: { cash: 6, market: 2 },
          headline: "廉价资金进入科技行业",
          result: "借钱突然变得容易。还钱仍保留了传统难度。",
        },
        variants: [
          {
            requires: ["crisisLoan"],
            effects: { cash: 10, reputation: 1 },
            headline: "旧贷款获得喘息",
            result: "利息账单变薄了。银行称这是对长期客户的奖励，仿佛政策是它亲自制定的。",
          },
        ],
      },
      EXT_RATE_HIKE: {
        minYear: 1968,
        title: "利率开始爬楼梯",
        body: "通胀迫使政府提高利率。银行表示这是为了经济健康，并为你的贷款准备了病危通知。",
        defaultOutcome: {
          effects: { cash: -6, market: -2 },
          headline: "高利率冻结投资",
          result: "资本变得昂贵，顾问把“扩张”从演示文稿里换成了“纪律”。",
        },
        variants: [
          {
            requires: ["retainedEarnings"],
            effects: { cash: -2, reputation: 2 },
            headline: "现金储备缓冲加息",
            result: "别人向银行解释未来时，你用过去留下的钱支付了现在。",
          },
        ],
      },
      EXT_GAME_RULES: {
        minYear: 1975,
        title: "未成年人被要求停止拯救世界",
        body: "政府限制未成年人游戏时间。政策发布时，记者发现负责官员的最高分仍排在全国前十。",
        defaultOutcome: {
          effects: { market: -2 },
          headline: "电子游戏市场面临限制",
          result: "孩子们减少了游戏时间，并把节省出的时间用于研究如何绕过限制。",
        },
        variants: [
          {
            requires: ["gameLab"],
            effects: { market: -9, reputation: -3 },
            headline: "游戏业务遭遇监管重击",
            result: "公司的增长曲线被强制下线。家长表示满意，孩子们开始学习修改系统时钟。",
          },
          {
            requires: ["developerEcosystem"],
            effects: { cash: -4, market: -5 },
            headline: "开发者生态失去年轻用户",
            result: "开发者开始转向办公软件，其中第一款产品是伪装成电子表格的游戏。",
          },
        ],
      },
      EXT_SHORTAGE: {
        minYear: 1970,
        title: "全世界突然缺少同一颗零件",
        body: "一家上游工厂停产，所有企业同时发现自己的供应链原来是一条单行道。",
        defaultOutcome: {
          effects: { cash: -4, market: -4 },
          headline: "关键零件全球短缺",
          result: "采购员开始用外交辞令争夺纸箱，外交官则开始学习零件编号。",
        },
        variants: [
          {
            requires: ["dualSupply"],
            effects: { cash: -2, market: 3, reputation: 3 },
            headline: "备用供应链开始工作",
            result: "第二家供应商终于证明，它过去收取的高价不是纯粹的个人爱好。",
          },
          {
            requires: ["singleSupplier"],
            effects: { cash: -9, market: -8 },
            headline: "单一供应链停止呼吸",
            result: "那位曾经给你最低报价的供应商，现在给了你最高优先级名单的最后一位。",
          },
        ],
      },
      EXT_ANTITRUST: {
        minYear: 1970,
        title: "政府发现市场里只有一个人",
        body: "监管机构开始调查行业巨头。巨头表示竞争非常充分，并提交了一份由自己所有竞争对手共同消失的名单。",
        defaultOutcome: {
          effects: { market: 3, reputation: 1 },
          headline: "反垄断调查打开市场缝隙",
          result: "巨头忙着向政府证明自己并不巨大，小公司趁机从它脚边经过。",
        },
        variants: [
          {
            requires: ["challengeGiant"],
            effects: { market: 8, reputation: 4 },
            headline: "挑战者成为监管样板",
            result: "听证会反复提到你的名字。第一次，这不是因为专利诉讼。",
          },
          {
            requires: ["exclusiveContract"],
            effects: { cash: -5, reputation: -5 },
            headline: "独占合同进入调查文件",
            result: "合同第七码的小字被放大到墙上，终于获得了它一直渴望的关注。",
          },
        ],
      },
      EXT_UNIVERSITY: {
        title: "大学公布免费研究成果",
        body: "大学团队公开了一项基础技术。教授说知识属于全人类，技术转移办公室说工作日除外。",
        defaultOutcome: {
          effects: { tech: 4 },
          headline: "公开研究推动行业进步",
          result: "所有公司都得到了一点技术。律师开始研究如何让这一点彼此不同。",
        },
        variants: [
          {
            requires: ["publicResearch"],
            effects: { tech: 8, talent: 4, reputation: 3 },
            headline: "长期学术合作结出成果",
            result: "研究员直接把成果带进你的实验室，因为他们还记得谁曾允许论文公开。",
          },
          {
            requires: ["closedStandard"],
            effects: { tech: 2, market: -3 },
            headline: "封闭体系难以吸收新成果",
            result: "技术是免费的，把它接进自有接口的费用则足够再办一所大学。",
          },
        ],
      },
      EXT_EXPORT: {
        minYear: 1980,
        title: "出口许可证长出牙齿",
        body: "政府突然限制先进技术出口。新表格共有九十七页，其中九十六页用于解释为什么还需要另一张表。",
        defaultOutcome: {
          effects: { cash: -4, market: -5 },
          headline: "出口限制压缩海外订单",
          result: "货物停在港口，文件继续顺利跨越各个部门。",
        },
        variants: [
          {
            requires: ["governmentContract"],
            effects: { cash: 2, market: -3 },
            headline: "政府订单部分填补缺口",
            result: "海外客户消失后，政府买下了一部分产品，并要求它们不要离开国内仓库。",
          },
          {
            requires: ["policyNetwork"],
            effects: { cash: -1, market: -2, reputation: 2 },
            headline: "政策团队争取到过渡期",
            result: "公司获得六个月缓冲。顾问获得了十二个月续约。",
          },
        ],
      },
      EXT_RECESSION: {
        title: "经济学家确认衰退已经发生",
        body: "消费者削减开支，企业冻结采购。经济学家解释，这个结论在数据里早已很明显，只是数据晚到了半年。",
        marketMultiplier: { minimum: 0.5, maximum: 0.9 },
        defaultOutcome: {
          effects: { cash: -5, market: -6 },
          headline: "衰退压低科技需求",
          result: "订单簿开始减肥，而且没有设定目标体重。",
        },
        variants: [
          {
            requires: ["enterpriseClients"],
            effects: { cash: -2, market: -3 },
            headline: "长期客户减缓下滑",
            result: "大客户仍然采购，只是每次签字前都要召开一次讨论是否继续开会的会议。",
          },
        ],
      },
      EXT_BOOM: {
        title: "企业突然相信计算机能解决一切",
        body: "各行业争相购买设备，连一家铅笔厂都宣布进入数字化时代，并订购了足够计算铅笔数量的机器。",
        marketMultiplier: { minimum: 1.1, maximum: 1.5 },
        defaultOutcome: {
          effects: { cash: 6, market: 6 },
          headline: "科技采购热潮席卷市场",
          result: "订单从门缝涌入。销售部建议先不要提醒客户，部分问题其实用纸也能解决。",
        },
        variants: [
          {
            requires: ["reservedCapacity"],
            effects: { cash: 10, market: 8 },
            headline: "预订产能变成现货优势",
            result: "竞争对手等待交货时，你开始交货。财务部撤回了对预付款的全部历史意见。",
          },
        ],
      },
      EXT_LABOR: {
        minYear: 1965,
        title: "政府规定一天仍然只有二十四小时",
        body: "新劳动法规限制连续工作时间。部分经理对此震惊，他们原以为一天可以通过绩效考核延长。",
        defaultOutcome: {
          effects: { cash: -3, talent: 2 },
          headline: "新劳动法规提高用工成本",
          result: "加班减少了，工资单增加了，员工第一次在太阳仍存在时看见停车场。",
        },
        variants: [
          {
            requires: ["crunchCulture"],
            effects: { cash: -7, talent: -5, reputation: -5 },
            headline: "通宵文化遭到调查",
            result: "检查员发现办公室里有床。公司解释那是符合人体工学的加长椅。",
          },
          {
            requires: ["sustainableTeam"],
            effects: { cash: -2, talent: 5, reputation: 3 },
            headline: "稳健团队轻松适应新规",
            result: "竞争对手忙着关闭夜班时，你的员工准时下班，并在第二天准时回来。",
          },
        ],
      },
      EXT_ENERGY: {
        minYear: 1970,
        title: "能源价格突然学会增长",
        body: "燃料危机推高电价。工厂经理建议关闭走廊灯，财务总监询问能否顺便关闭研发楼。",
        defaultOutcome: {
          effects: { cash: -5 },
          headline: "能源成本冲击科技制造",
          result: "每台机器仍然正常运转，只是电表跑得比它们都快。",
        },
        variants: [
          {
            requires: ["lowPower"],
            effects: { cash: 2, market: 5, reputation: 2 },
            headline: "低功耗产品迎来订单",
            result: "客户突然发现节能很重要，并坚持这一直是他们采购时的首要标准。",
          },
          {
            requires: ["ownFactory"],
            effects: { cash: -9, market: -2 },
            headline: "自有工厂吞下高价能源",
            result: "烟囱仍象征工业实力，账单则象征工业实力需要插电。",
          },
        ],
      },
      EXT_CURRENCY: {
        minYear: 1965,
        title: "汇率在夜里换了方向",
        body: "本国货币突然贬值。出口商开香槟，进口商检查香槟是不是也需要外汇。",
        defaultOutcome: {
          effects: { cash: 2, market: 2 },
          headline: "汇率变化重写成本",
          result: "海外客户觉得你便宜了，本地供应商觉得所有东西都贵了。两边都认为这是你的决定。",
        },
        variants: [
          {
            requires: ["outsourced"],
            effects: { cash: -7, market: -2 },
            headline: "海外代工成本急升",
            result: "轻资产仍然很轻，因为现金正在快速离开资产负债表。",
          },
          {
            requires: ["ownFactory"],
            effects: { cash: 5, market: 4 },
            headline: "本地制造获得价格优势",
            result: "那座曾被嫌弃的工厂突然被分析师称为战略纵深。屋顶仍然漏水。",
          },
        ],
      },
      EXT_PATENT: {
        minYear: 1965,
        title: "专利法院扩大保护范围",
        body: "法院裁定技术外观、内部和律师描述都可能受到保护。律师事务所宣布这是创新的胜利。",
        defaultOutcome: {
          effects: { tech: -2, cash: -2 },
          headline: "行业进入专利紧张期",
          result: "工程师每画一条线，律师就画一个可能需要付费的圆。",
        },
        variants: [
          {
            requires: ["patents"],
            effects: { cash: 8, market: 3 },
            headline: "专利组合开始收取过路费",
            result: "几份旧文件突然开始赚钱。档案柜第一次被列为生产设备。",
          },
          {
            requires: ["openTech"],
            effects: { reputation: 4, market: 2 },
            headline: "开放技术获得公众支持",
            result: "你没有从诉讼中赚钱，却成为所有不想付律师费公司的朋友。",
          },
        ],
      },
      EXT_RECALL: {
        minYear: 1975,
        title: "全行业开始检查灭火器",
        body: "另一家公司的设备起火，引发全面安全审查。记者正在寻找任何曾经把烟雾称为功能的人。",
        defaultOutcome: {
          effects: { cash: -3, reputation: -2 },
          headline: "安全审查波及整个行业",
          result: "检查员没有发现火，但发现了足够多的表格问题来维持职业尊严。",
        },
        variants: [
          {
            requires: ["responsibleRecall"],
            effects: { market: 5, reputation: 7 },
            headline: "旧日召回成为信任证明",
            result: "消费者记得你曾经主动承认错误。公关部遗憾地发现，诚实居然需要多年才能变现。",
          },
          {
            requires: ["coveredAccident"],
            effects: { cash: -10, market: -10, reputation: -12 },
            headline: "被掩盖的事故重新冒烟",
            result: "记者找到了旧声明，也找到了声明照片里被移出镜头的灭火器。",
          },
        ],
      },
      EXT_NETWORK: {
        minYear: 1980,
        title: "公共网络开始铺设",
        body: "政府与大学建立新的数据网络。没人能准确解释普通人会拿它做什么，因此项目获得了充分想象空间。",
        defaultOutcome: {
          effects: { tech: 3, market: 3 },
          headline: "网络建设创造新需求",
          result: "计算机开始互相说话。它们首先交换了关于用户操作错误的看法。",
        },
        variants: [
          {
            requires: ["openStandard"],
            effects: { tech: 6, market: 7, reputation: 2 },
            headline: "开放接口接入公共网络",
            result: "你的设备顺利连接所有节点，包括三个本来没人知道存在的节点。",
          },
          {
            requires: ["closedStandard"],
            effects: { cash: -4, market: -5 },
            headline: "自有接口被留在网络外",
            result: "公司的设备非常安全，因为公共网络完全不知道如何找到它们。",
          },
        ],
      },
    },
  };

  const balance = {
    economy: {
      revenue: {
        base: 4,
        capabilityDivisor: 2,
        capabilityRate: 0.6,
        reputationBaseline: 50,
        minimum: 2,
      },
      operatingCost: {
        base: 5,
        talentRate: 0.8,
      },
      marketFluctuation: {
        minimum: 0.5,
        maximum: 1.5,
        step: 0.1,
        downturnMaximum: 0.9,
        boomMinimum: 1.1,
      },
      annualChange: {
        talentBaseDecay: 5,
        talentMarketPressureBase: 0.5,
        talentMarketPressureDivisor: 100,
        techBaseDecay: 10,
        talentSquaredDivisor: 250,
      },
    },
    victory: {
      minimumStats: { cash: 30, tech: 70, talent: 55, market: 55 },
      minimumReputation: 55,
      resilienceTags: ["selfCannibalize", "technicalPartners", "modularBusiness", "skunkworks"],
      minimumResilience: 3,
    },
  };

  window.GAME_CONFIG = { cards, conditionalCards, companyActions, management, annual, balance };
})();
