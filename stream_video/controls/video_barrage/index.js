/**
 * 功能描述：
 * 创建日期：2023 年 12 月 30 日
 */

// 使用严格模式
'use strict';

/**
 * 所有的弹幕数据
 * @type {[{text: string, time: number, color: string}]}
 */
let barrageArr = [
    {"time": 327, "text": "你知道吗？梦里的羊其实是数不完的！", "color": "#87CEEB"},
    {"time": 890, "text": "如果一切都顺利，那你可能在做梦！", "color": "#FFD700"},
    {"time": 512, "text": "为什么月亮总是那么迷人？因为它有一整套的光辉计划！", "color": "#98FB98"},
    {"time": 45, "text": "时间就像是个调皮的孩子，永远不按规矩行事！", "color": "#FF6347"},
    {"time": 1032, "text": "想要一天变聪明？试试看多吃点蓝莓！", "color": "#DA70D6"},
    {"time": 721, "text": "别忘了微笑，因为你不知道谁会因为你的微笑而开心一整天！", "color": "#00FA9A"},
    {"time": 288, "text": "如果代码有味道，那一定是咖啡味！", "color": "#FFA07A"},
    {"time": 975, "text": "记住，生活不是等待风暴过去，而是学会在雨中跳舞！", "color": "#40E0D0"},
    {"time": 654, "text": "想象力是一个无限的宇宙，你愿意探索吗？", "color": "#8A2BE2"},
    {"time": 1198, "text": "如果你看到了这条消息，说明你活得很有耐心！", "color": "#FF4500"},
    {"time": 327, "text": "你知道吗？梦里的羊其实是数不完的！", "color": "#87CEEB"},
    {"time": 890, "text": "如果一切都顺利，那你可能在做梦！", "color": "#FFD700"},
    {"time": 512, "text": "为什么月亮总是那么迷人？因为它有一整套的光辉计划！", "color": "#98FB98"},
    {"time": 45, "text": "时间就像是个调皮的孩子，永远不按规矩行事！", "color": "#FF6347"},
    {"time": 1032, "text": "想要一天变聪明？试试看多吃点蓝莓！", "color": "#DA70D6"},
    {"time": 721, "text": "别忘了微笑，因为你不知道谁会因为你的微笑而开心一整天！", "color": "#00FA9A"},
    {"time": 288, "text": "如果代码有味道，那一定是咖啡味！", "color": "#FFA07A"},
    {"time": 975, "text": "记住，生活不是等待风暴过去，而是学会在雨中跳舞！", "color": "#40E0D0"},
    {"time": 654, "text": "想象力是一个无限的宇宙，你愿意探索吗？", "color": "#8A2BE2"},
    {"time": 1198, "text": "如果你看到了这条消息，说明你活得很有耐心！", "color": "#FF4500"},
    {"time": 327, "text": "你知道吗？梦里的羊其实是数不完的！", "color": "#87CEEB"},
    {"time": 890, "text": "如果一切都顺利，那你可能在做梦！", "color": "#FFD700"},
    {"time": 512, "text": "为什么月亮总是那么迷人？因为它有一整套的光辉计划！", "color": "#98FB98"},
    {"time": 45, "text": "时间就像是个调皮的孩子，永远不按规矩行事！", "color": "#FF6347"},
    {"time": 1032, "text": "想要一天变聪明？试试看多吃点蓝莓！", "color": "#DA70D6"},
    {"time": 721, "text": "别忘了微笑，因为你不知道谁会因为你的微笑而开心一整天！", "color": "#00FA9A"},
    {"time": 288, "text": "如果代码有味道，那一定是咖啡味！", "color": "#FFA07A"},
    {"time": 975, "text": "记住，生活不是等待风暴过去，而是学会在雨中跳舞！", "color": "#40E0D0"},
    {"time": 654, "text": "想象力是一个无限的宇宙，你愿意探索吗？", "color": "#8A2BE2"},
    {"time": 1198, "text": "如果你看到了这条消息，说明你活得很有耐心！", "color": "#FF4500"},
    {"time": 789, "text": "别问我为什么起床晚，问就是懒！", "color": "#32CD32"},
    {"time": 235, "text": "人生就像一杯奶茶，加点糖会更甜！", "color": "#FF1493"},
    {"time": 110, "text": "有时候，忘记是一种幸福。", "color": "#FFA500"},
    {"time": 566, "text": "别让今天的忧虑抢走明天的幸福。", "color": "#4169E1"},
    {"time": 327, "text": "你知道吗？梦里的羊其实是数不完的！", "color": "#87CEEB"},
    {"time": 890, "text": "如果一切都顺利，那你可能在做梦！", "color": "#FFD700"},
    {"time": 512, "text": "为什么月亮总是那么迷人？因为它有一整套的光辉计划！", "color": "#98FB98"},
    {"time": 45, "text": "时间就像是个调皮的孩子，永远不按规矩行事！", "color": "#FF6347"},
    {"time": 1032, "text": "想要一天变聪明？试试看多吃点蓝莓！", "color": "#DA70D6"},
    {"time": 721, "text": "别忘了微笑，因为你不知道谁会因为你的微笑而开心一整天！", "color": "#00FA9A"},
    {"time": 288, "text": "如果代码有味道，那一定是咖啡味！", "color": "#FFA07A"},
    {"time": 975, "text": "记住，生活不是等待风暴过去，而是学会在雨中跳舞！", "color": "#40E0D0"},
    {"time": 654, "text": "想象力是一个无限的宇宙，你愿意探索吗？", "color": "#8A2BE2"},
    {"time": 1198, "text": "如果你看到了这条消息，说明你活得很有耐心！", "color": "#FF4500"},
    {"time": 789, "text": "别问我为什么起床晚，问就是懒！", "color": "#32CD32"},
    {"time": 235, "text": "人生就像一杯奶茶，加点糖会更甜！", "color": "#FF1493"},
    {"time": 110, "text": "有时候，忘记是一种幸福。", "color": "#FFA500"},
    {"time": 566, "text": "别让今天的忧虑抢走明天的幸福。", "color": "#4169E1"},
    {"time": 943, "text": "如果你的披萨是正方形的，你为什么还要买圆形的盒子呢？", "color": "#FF6347"},
    {"time": 378, "text": "告诉我你的星座，我告诉你你最喜欢的冰淇淋口味！", "color": "#FFD700"},
    {"time": 802, "text": "快乐是一种心态，不是一种境遇。", "color": "#FF69B4"},
    {"time": 327, "text": "你知道吗？梦里的羊其实是数不完的！", "color": "#87CEEB"},
    {"time": 890, "text": "如果一切都顺利，那你可能在做梦！", "color": "#FFD700"},
    {"time": 512, "text": "为什么月亮总是那么迷人？因为它有一整套的光辉计划！", "color": "#98FB98"},
    {"time": 45, "text": "时间就像是个调皮的孩子，永远不按规矩行事！", "color": "#FF6347"},
    {"time": 1032, "text": "想要一天变聪明？试试看多吃点蓝莓！", "color": "#DA70D6"},
    {"time": 721, "text": "别忘了微笑，因为你不知道谁会因为你的微笑而开心一整天！", "color": "#00FA9A"},
    {"time": 288, "text": "如果代码有味道，那一定是咖啡味！", "color": "#FFA07A"},
    {"time": 975, "text": "记住，生活不是等待风暴过去，而是学会在雨中跳舞！", "color": "#40E0D0"},
    {"time": 654, "text": "想象力是一个无限的宇宙，你愿意探索吗？", "color": "#8A2BE2"},
    {"time": 1198, "text": "如果你看到了这条消息，说明你活得很有耐心！", "color": "#FF4500"},
    {"time": 789, "text": "别问我为什么起床晚，问就是懒！", "color": "#32CD32"},
    {"time": 235, "text": "人生就像一杯奶茶，加点糖会更甜！", "color": "#FF1493"},
    {"time": 110, "text": "有时候，忘记是一种幸福。", "color": "#FFA500"},
    {"time": 566, "text": "别让今天的忧虑抢走明天的幸福。", "color": "#4169E1"},
    {"time": 943, "text": "如果你的披萨是正方形的，你为什么还要买圆形的盒子呢？", "color": "#FF6347"},
    {"time": 378, "text": "告诉我你的星座，我告诉你你最喜欢的冰淇淋口味！", "color": "#FFD700"},
    {"time": 802, "text": "快乐是一种心态，不是一种境遇。", "color": "#FF69B4"},
    {"time": 654, "text": "喜欢看书的人，总是有一颗不安分的心。", "color": "#20B2AA"},
    {"time": 401, "text": "在有限的人生里，别让自己成为限制自己的人。", "color": "#6A5ACD"},
    {"time": 1125, "text": "不要轻易放弃，也不要轻易妥协。", "color": "#FF6347"},
    {"time": 917, "text": "生活就像一杯咖啡，苦中带甜才是精彩！", "color": "#8B4513"},
    {"time": 348, "text": "为什么不尝试一下逆袭呢？逆袭的感觉真是太棒了！", "color": "#FF4500"},
    {"time": 673, "text": "记住，成功的背后往往有着无数的努力和坚持！", "color": "#FF69B4"},
    {"time": 1042, "text": "有时候，不经意的微笑能够改变整个世界。", "color": "#20B2AA"},
    {"time": 521, "text": "生活不仅有眼前的苟且，还有远方的苦难。", "color": "#556B2F"},
    {"time": 888, "text": "相信自己，你比想象中更强大。", "color": "#FFA07A"},
    {"time": 432, "text": "如果有一天地球不再转动，我会为你停留在原地。", "color": "#4169E1"},
    {"time": 1157, "text": "人生就像一本书，你的选择决定了故事的走向。", "color": "#FF6347"},
    {"time": 777, "text": "成功的路上，没有捷径可走，只有脚下的每一步。", "color": "#008B8B"},
    {"time": 287, "text": "不管遇到什么困难，微笑都是最好的解药。", "color": "#DC143C"},
    {"time": 943, "text": "每一次的努力，都是为了更好的明天。", "color": "#4B0082"},
    {"time": 610, "text": "天空之所以如此美丽，是因为有了五彩斑斓的云朵。", "color": "#00FF7F"},
    {"time": 201, "text": "宁愿笑着流泪，也不哭着说后悔。", "color": "#9932CC"},
    {"time": 135, "text": "坚持不懈，直到成功成为唯一选择。", "color": "#FFD700"},
    {"time": 888, "text": "生活不会辜负努力的人，加油！", "color": "#228B22"},
    {"time": 540, "text": "有梦想就要追逐，没有梦想的人生如同寒冬。", "color": "#FF4500"},
    {"time": 1123, "text": "做一个乐观的人，快乐会悄悄而来。", "color": "#8B008B"},
    {"time": 480, "text": "用心去感受生活的美好，你会发现幸福无处不在。", "color": "#00BFFF"},
    {"time": 921, "text": "每一次的挫折，都是成长的一部分。", "color": "#8A2BE2"},
    {"time": 753, "text": "勇敢追逐梦想，生活会因此而精彩！", "color": "#4682B4"},
    {"time": 289, "text": "用心体验每一个瞬间，生活会更加美好。", "color": "#FF6347"},
    {"time": 1066, "text": "相信自己，你比想象中更坚强。", "color": "#2E8B57"},
    {"time": 599, "text": "微笑是最短距离，连接人心的桥梁。", "color": "#FFD700"},
    {"time": 432, "text": "每一天都是一个新的开始，抓住机会迎接新的挑战。", "color": "#9932CC"},
    {"time": 837, "text": "人生犹如旅途，美好不在终点而在沿途的风景。", "color": "#20B2AA"},
    {"time": 317, "text": "相信自己的选择，走过的每一步都是成长。", "color": "#FF4500"},
    {"time": 1148, "text": "阳光洒在心间，幸福自然而来。", "color": "#FF8C00"},
    {"time": 678, "text": "心怀感恩，发现生活中的点滴幸福。", "color": "#8B4513"},
    {"time": 513, "text": "用心感受生命的美好，每一天都是奇迹。", "color": "#008080"},
    {"time": 975, "text": "成功的背后是不断努力的付出和坚持。", "color": "#4B0082"},
    {"time": 356, "text": "勇敢前行，生活会给你惊喜。", "color": "#228B22"},
    {"time": 1191, "text": "用爱和善待他人，创造美好的人生。", "color": "#800080"},
    {"time": 814, "text": "享受生活，感受其中的每一个温馨瞬间。", "color": "#FF6347"},
    {"time": 421, "text": "梦想是前行的动力，坚持是成功的秘诀。", "color": "#4169E1"},
    {"time": 1052, "text": "相信自己的能力，你将创造奇迹。", "color": "#008B8B"},
    {"time": 643, "text": "微笑是心灵的窗户，让阳光照进来。", "color": "#FF4500"},
    {"time": 479, "text": "用心感受生活的美好，幸福近在咫尺。", "color": "#9932CC"},
    {"time": 862, "text": "成功离不开坚持，努力铸就辉煌。", "color": "#FFD700"},
    {"time": 771, "text": "生活有时如同弹簧，拉得越紧，反弹得越高！", "color": "#32CD32"},
    {"time": 308, "text": "用心对待每一个瞬间，人生会更加精彩。", "color": "#800000"},
    {"time": 1072, "text": "相信自己，你就已经迈出成功的第一步。", "color": "#4B0082"},
    {"time": 619, "text": "微笑是心灵的阳光，让生活更加明媚。", "color": "#00FA9A"},
    {"time": 454, "text": "每一天都是一个奇迹，珍惜当下的美好。", "color": "#FF4500"},
    {"time": 869, "text": "心怀感恩，发现生活中的无数温馨瞬间。", "color": "#FFD700"},
    {"time": 359, "text": "用真心对待生活，生活会回报你丰富的果实。", "color": "#483D8B"},
    {"time": 1181, "text": "阳光总在风雨后，坚持总会迎来成功。", "color": "#2E8B57"},
    {"time": 701, "text": "热爱生活，发现生命中的无尽可能。", "color": "#9932CC"},
    {"time": 536, "text": "积极向前，你会发现生活充满惊喜。", "color": "#008B8B"},
    {"time": 983, "text": "用善良的心待人，收获美好的人生。", "color": "#FF6347"},
    {"time": 397, "text": "梦想是奋斗的方向，坚持是成功的秘诀。", "color": "#FF8C00"},
    {"time": 1108, "text": "勇敢面对每一个挑战，成功就在前方。", "color": "#483D8B"},
    {"time": 822, "text": "发现生活的美好，享受每一个瞬间。", "color": "#228B22"},
    {"time": 429, "text": "追逐梦想的路上，你会发现更广阔的天空。", "color": "#9932CC"},
    {"time": 1060, "text": "相信自己的力量，你将创造不可思议。", "color": "#FF4500"},
    {"time": 671, "text": "微笑是人生最美的风景，让它成为习惯。", "color": "#00BFFF"},
    {"time": 508, "text": "生活如诗，用心品味其中的美好。", "color": "#FF6347"},
    {"time": 927, "text": "坚持不懈，奋斗的人生更有价值。", "color": "#008B8B"},
    {"time": 804, "text": "生活就像一杯咖啡，苦中带甜才是精彩！", "color": "#A0522D"},
    {"time": 338, "text": "为什么不尝试一下逆袭呢？逆袭的感觉真是太棒了！", "color": "#556B2F"},
    {"time": 663, "text": "记住，成功的背后往往有着无数的努力和坚持！", "color": "#32CD32"},
    {"time": 1032, "text": "有时候，不经意的微笑能够改变整个世界。", "color": "#800000"},
    {"time": 511, "text": "生活不仅有眼前的苟且，还有远方的苦难。", "color": "#FF8C00"},
    {"time": 878, "text": "相信自己，你比想象中更强大。", "color": "#20B2AA"},
    {"time": 413, "text": "如果有一天地球不再转动，我会为你停留在原地。", "color": "#2E8B57"},
    {"time": 1147, "text": "人生就像一本书，你的选择决定了故事的走向。", "color": "#FF4500"},
    {"time": 767, "text": "成功的路上，没有捷径可走，只有脚下的每一步。", "color": "#8A2BE2"},
    {"time": 277, "text": "不管遇到什么困难，微笑都是最好的解药。", "color": "#FF6347"},
    {"time": 943, "text": "每一次的努力，都是为了更好的明天。", "color": "#228B22"},
    {"time": 610, "text": "天空之所以如此美丽，是因为有了五彩斑斓的云朵。", "color": "#FF6347"},
    {"time": 201, "text": "宁愿笑着流泪，也不哭着说后悔。", "color": "#008B8B"},
    {"time": 135, "text": "坚持不懈，直到成功成为唯一选择。", "color": "#9932CC"},
    {"time": 888, "text": "生活不会辜负努力的人，加油！", "color": "#32CD32"},
    {"time": 540, "text": "有梦想就要追逐，没有梦想的人生如同寒冬。", "color": "#FF4500"},
    {"time": 1123, "text": "做一个乐观的人，快乐会悄悄而来。", "color": "#8B008B"},
    {"time": 480, "text": "用心去感受生活的美好，你会发现幸福无处不在。", "color": "#00BFFF"},
    {"time": 921, "text": "每一次的挫折，都是成长的一部分。", "color": "#8A2BE2"},

    {text: '美的让人窒息 ', time: 184, color: '#2196F3'},
    {text: '这可以去拍科幻大片了，敌人还有5秒到达战场 ', time: 68, color: '#2196F3',},
    {text: '这得多少炸蛹啊。。口水 ', time: 147, color: '#E91E63'},
    {text: '你瞅啥，瞅你咋地 ', time: 136, color: '#673AB7'},
    {text: '雪的反光好美 ', time: 148, color: '#2196F3'},
    {text: '好美 ', time: 94, color: '#E91E63'},
    {text: '美得不像话 ', time: 191, color: '#673AB7'},
    {text: '好美 ', time: 20, color: '#673AB7'},
    {text: '我是一只小小小小鸟 ', time: 199, color: '#2196F3'},
    {text: '几十亿 ', time: 109, color: '#2196F3'},
    {text: '不怕摔死 ', time: 167, color: '#2196F3'},
    {text: '这不是狸猫吗 ', time: 135, color: '#673AB7'},
    {text: '这真甩不死？ ', time: 197, color: ''},
    {text: '这玩意巨好吃 ', time: 76, color: ''},
    {text: '这什么树 ', time: 207, color: '#2196F3'},
    {text: '美 ', time: 26, color: '#E91E63'},
    {text: '不会摔死？ ', time: 230, color: '#E91E63'},
    {text: '他妈怎么上去的 ', time: 183, color: ''},
    {text: '我以为是瓶子树 ', time: 21, color: ''},
    {text: '这树我在QQ农场偷过233 ', time: 85, color: ''},
    {text: '历害,香蕉自己剥 ', time: 79, color: '#2196F3'},
    {text: '这是已经吃腻了吗。。。。。。。。 ', time: 187, color: ''},
    {text: '你们被人类偷拍了 ', time: 106, color: '#673AB7'},
    {text: '美得太放肆 ', time: 228, color: ''},
    {text: '快到碗里来 ', time: 108, color: ''},
    {text: '又被对面打野抓了 ', time: 10, color: '#673AB7'},
    {text: '那是下面没有石头 ', time: 230, color: '#673AB7'},
    {text: '不会摔死吗 ', time: 27, color: '#673AB7'},
    {text: '还弹起来了 ', time: 9, color: ''},
    {text: '简直了。这种感觉简直奇妙！ ', time: 146, color: ''},
    {text: '猛虎形态 ', time: 154, color: '#673AB7'},
    {text: '我还以为是香蕉呢 ', time: 44, color: '#E91E63'},
    {text: '这一段端午节的时候在家看了 ', time: 37, color: ''},
    {text: '摔不死的下面有树叶 ', time: 64, color: '#E91E63'},
    {
        text: '知了背部的肉炒起来很好吃的，小时候一到夏天就去抓（我还是个女生） ',
        time: 41,
        color: '',
    },
    {text: 'draco ', time: 176, color: ''},
    {text: '萌！ ', time: 218, color: '#E91E63'},
    {text: '大的让人惊叹 ', time: 139, color: '#673AB7'},
    {text: '，这个树在第一集里出现过 ', time: 132, color: '#2196F3'},
    {text: '这应该是猞猁吧 ', time: 31, color: '#673AB7'},
    {text: '怎么办，我好慌 ', time: 239, color: ''},
    {text: '飞 ', time: 207, color: '#2196F3'},
    {text: '万物守恒 ', time: 132, color: '#673AB7'},
    {text: '层林尽染 ', time: 222, color: '#2196F3'},
    {text: '怎么感觉这段看过 ', time: 94, color: ''},
    {text: '哈哈哈哈 ', time: 219, color: '#2196F3'},
    {text: '边吃边看- - ', time: 182, color: ''},
    {text: '要镇定= = ', time: 229, color: '#E91E63'},
    {text: '野生瞄 ', time: 46, color: '#E91E63'},
    {text: '肚子也能吃 ', time: 107, color: '#673AB7'},
    {text: '单身狗躺枪 ', time: 82, color: ''},
    {text: '哈哈 ', time: 39, color: '#E91E63'},
    {text: '???????? ', time: 216, color: ''},
    {text: '自挂东南枝23333 ', time: 230, color: ''},
    {text: '(≧^.^≦)喵~ ', time: 20, color: ''},
    {text: '刚睡醒时的我2333 ', time: 146, color: '#673AB7'},
    {text: '黄叽的宠物原型吗0.0 ', time: 111, color: '#2196F3'},
    {text: '可爱 想养 ', time: 130, color: ''},
    {text: '这在我们小时候经常油炸炒来吃 ', time: 50, color: '#673AB7'},
    {text: '这花开的真是大树身 少女芯啊 ', time: 87, color: '#673AB7'},
    {text: '对啊 ', time: 69, color: ''},
    {text: '我也这么觉得 ', time: 60, color: ''},
    {text: '马蛋不是给你准备的 ', time: 121, color: '#2196F3'},
    {text: '偷蛋贼 ', time: 151, color: '#2196F3'},
    {text: '233真的是摔啊 ', time: 1, color: '#2196F3'},
    {text: '人的脊椎也很脆弱吧， ', time: 29, color: '#673AB7'},
    {text: '猞猁尾巴很短的 这个尾巴长 ', time: 4, color: ''},
    {text: '直接把一只田鼠吃下去了？？？ ', time: 180, color: ''},
    {text: '该怎么上去？ ', time: 128, color: ''},
    {text: '30公分是多少厘米啊？？ ', time: 243, color: ''},
    {text: '17年蝉 ', time: 11, color: '#2196F3'},
    {text: '不知道的还以为是香蕉呢 ', time: 35, color: '#2196F3'},
    {
        text: '听说狼这家伙是个二愣子，非常凶猛，怼的很 ',
        time: 239,
        color: '#E91E63',
    },
    {text: '松鼠：真是日了狗了 ', time: 74, color: ''},
    {text: '第一集是序篇 ', time: 140, color: ''},
    {text: '希望能永远这样 ', time: 180, color: ''},
    {text: '好美 ', time: 208, color: ''},
    {text: '好多 ', time: 107, color: '#E91E63'},
    {text: '不应该每年都有17年前的 ', time: 101, color: ''},
    {text: '其他动物：真是活久见 ', time: 225, color: ''},
    {text: '可爱炸了啊啊啊啊啊啊 ', time: 207, color: ''},
    {
        text: '感觉动物界雄性都适合搞基，雌的好丑，为什么还要追求 ',
        time: 128,
        color: '',
    },
    {text: '所以自然不能破坏，若果没有叶子下来全死 ', time: 106, color: ''},
    {text: '蝉？ ', time: 46, color: ''},
    {text: '猜到了 ', time: 69, color: '#673AB7'},
    {text: '我 ', time: 103, color: ''},
    {text: '就知道吃，现在很多地方都听不到蝉鸣了 ', time: 237, color: ''},
    {
        text: '17年才从土里出来，全部给人吃了，本来很多以他们为生的都饿死了 ',
        time: 226,
        color: '#673AB7',
    },
    {text: '像神话 ', time: 161, color: ''},
    {text: '有猫叫 ', time: 143, color: '#E91E63'},
    {text: '这是第一次出现 ', time: 72, color: ''},
    {text: '这么多天敌 几十亿还真不够， ', time: 212, color: '#2196F3'},
    {text: '呀咩咯呀咩咯 啊 ', time: 130, color: ''},
    {text: '我们叫姐喽龟 ', time: 200, color: '#2196F3'},
    {text: '猴面包树 ', time: 22, color: '#2196F3'},
    {text: '雪豹的时候你也是这么说的=。= ', time: 34, color: '#2196F3'},
    {text: '坚强地吃下去 ', time: 161, color: ''},
    {text: '又吃冷冻食品 ', time: 238, color: '#2196F3'},
    {text: '这拍的。。太好了吧 ', time: 236, color: ''},
    {text: '拍得太好了 ', time: 192, color: '#2196F3'},
    {text: '卧槽，发财了 ', time: 82, color: ''},
    {text: 'wolverine233333333狼叔是你吗 ', time: 238, color: '#E91E63'},
    {text: '大自然的神奇！ ', time: 223, color: '#2196F3'},
    {text: '30厘米 ', time: 9, color: ''},
    {text: '大家都同意 ', time: 165, color: ''},
    {text: '好美 ', time: 54, color: ''},
    {text: '我家外面蝉叫的正欢 ', time: 158, color: '#2196F3'},
    {text: '卧槽，单身狗被虐还要被吃？？？ ', time: 63, color: ''},
    {text: '说摔死的可以去看另一个纪录片 ', time: 241, color: '#2196F3'},
    {text: '同时出土可以减少被吃的数量 ', time: 1, color: '#673AB7'},
    {text: '鸡皮疙瘩 ', time: 123, color: ''},
    {text: '为什么要抢？雌性不够吗 ', time: 205, color: ''},
    {text: '太美了 ', time: 194, color: '#673AB7'},
    {text: '难不成还要嚼一嚼(ಡωಡ) ', time: 130, color: ''},
    {text: '还以为是两个人哈哈哈 ', time: 192, color: ''},
    {text: '好直啊 ', time: 54, color: '#2196F3'},
    {text: '听英文讲的就是30厘米，可能是翻译的不同吧 ', time: 184, color: ''},
    {
        text: '小时候还能听到蝉鸣，现在城市里已经好多年没听到了 ',
        time: 96,
        color: '#673AB7',
    },
    {text: '打开了包皮 ', time: 36, color: ''},
    {text: '鸮:你瞅啥 ', time: 161, color: ''},
    {text: '30厘米 ', time: 16, color: '#2196F3'},
    {text: '那棵树肯定很痒 ', time: 216, color: ''},
    {text: '流口水了卧槽。 ', time: 156, color: '#2196F3'},
    {text: '流口水了卧槽 ', time: 165, color: '#E91E63'},
    {text: '这么可爱 ', time: 109, color: '#E91E63'},
    {text: '哈哈哈哈哈哈哈 嗷 ', time: 165, color: '#673AB7'},
    {text: '方便面 ', time: 37, color: ''},
    {text: '小毛 ', time: 77, color: ''},
    {text: '花都被你给抖没了 ', time: 50, color: '#2196F3'},
    {text: '狐猴:你是什么东西？ ', time: 110, color: ''},
    {text: '又白又嫩 ', time: 90, color: ''},
    {text: 'OMG???? ', time: 90, color: '#2196F3'},
    {text: '密恐福利…… ', time: 183, color: ''},
    {text: '呃，开之前像香蕉，开之后里边像豆芽 ', time: 25, color: '#673AB7'},
    {text: '这玩意儿比雪豹还少 ', time: 60, color: '#E91E63'},
    {text: '233 ', time: 126, color: ''},
    {text: '松子真的很美味 ', time: 37, color: ''},
    {text: '这小眼神很忧伤 哈哈哈 ', time: 62, color: ''},
    {text: '哇哇哇好梦幻 ', time: 161, color: '#673AB7'},
    {text: '猞猁！ ', time: 50, color: ''},
    {
        text: '毛茸茸的可爱 ',
        time: 12,
        color: '#673AB7',
    },
    {
        text: '巨木森林的根得扎得多深呐… ',
        time: 12,
    },
    {
        text: '谢谢你们拍摄这么好的作品 ',
        time: 12,
    },
    {
        text: '你知道高中好不容易午休一次还有蝉鸣的痛苦吗 ',
        time: 12,
    },
    {
        text: '好高啊 ',
        time: 12,
    },
    {
        text: '2019-8-31 ',
        time: 12,
        color: '#673AB7',
    },
    {
        text: '呃，开之前像香蕉，开之后里边像豆芽 ',
        time: 13,
        color: '#673AB7',
    },
    {
        text: '哇哇哇好梦幻 ',
        time: 13,
        color: '#673AB7',
    },
    {
        text: '动物界以繁殖为目的的 ',
        time: 13,
        color: '#E91E63',
    },
    {
        text: '爬树还好者？ ',
        time: 13,
        color: '#E91E63',
    },
    {
        text: '狐猴:你是什么东西？ ',
        time: 14,
    },
    {
        text: '大王好帅！ ',
        time: 14,
        color: '#673AB7',
    },
    {
        text: '…… ',
        time: 14,
    },
    {
        text: '那棵树肯定很痒 ',
        time: 15,
    },
    {
        text: '流口水了卧槽。 ',
        time: 15,
        color: '#2196F3',
    },
    {
        text: '密恐福利…… ',
        time: 15,
    },
    {
        text: '这小眼神很忧伤 哈哈哈 ',
        time: 15,
    },
    {
        text: '野鸭子都会飞的 ',
        time: 15,
        color: '#E91E63',
    },
    {
        text: '有些是三年的 ',
        time: 15,
        color: '#673AB7',
    },
    {
        text: '因为要好好表现 才能吸引雌性阿 ',
        time: 15,
    },
    {
        text: '炸着吃嘎嘣脆！ ',
        time: 15,
    },
    {
        text: '你们不要再打啦！ ',
        time: 15,
        color: '#673AB7',
    },
    {
        text: '30厘米 ',
        time: 16,
        color: '#2196F3',
    },
    {
        text: '30厘米 ',
        time: 16,
        color: '#2196F3',
    },
    {
        text: '流口水了卧槽 ',
        time: 16,
        color: '#E91E63',
    },
    {
        text: 'OMG???? ',
        time: 16,
        color: '#2196F3',
    },
    {
        text: '猞猁！ ',
        time: 16,
    },
    {
        text: '嘎嘣脆 ',
        time: 16,
    },
    {
        text: '黄水仙 ',
        time: 16,
    },
    {
        text: 'and edible… ',
        time: 16,
        color: '#E91E63',
    },
    {
        text: '好想一口吃掉 ',
        time: 16,
    },
    {
        text: '层林尽染 ',
        time: 16,
        color: '#2196F3',
    },
    {
        text: '好想吃哦 ',
        time: 16,
    },
    {
        text: '这么可爱 ',
        time: 17,
        color: '#E91E63',
    },
    {
        text: '哈哈哈哈哈哈哈 嗷 ',
        time: 17,
        color: '#673AB7',
    },
    {
        text: '又白又嫩 ',
        time: 17,
    },
    {
        text: '蝉都是质数出现的避免其他生物吃光 ',
        time: 17,
    },
    {
        text: '猴面包树:哈哈哈劳资早就料到了 ',
        time: 17,
    },
    {
        text: '突然觉得蝉好伟大 ',
        time: 17,
    },
    {
        text: '呆萌 ',
        time: 17,
    },
    {
        text: '花都被你给抖没了 ',
        time: 18,
        color: '#2196F3',
    },
    {
        text: '你追女朋友不表现阿。自己送上门的？ ',
        time: 18,
        color: '#2196F3',
    },
    {
        text: '哇，猴面包树！ ',
        time: 18,
    },
    {text: '嗷一声奶奶的可爱猫奴一脸满足 ', time: 129, color: '#673AB7'},
    {text: '因为雌的要带孩子花花的吸引猎人 ', time: 42, color: '#E91E63'},
    {text: '动物界以繁殖为目的的 ', time: 190, color: '#E91E63'},
    {text: '野鸭子都会飞的 ', time: 204, color: '#E91E63'},
    {text: '有些是三年的 ', time: 150, color: '#673AB7'},
    {text: '蝉都是质数出现的避免其他生物吃光 ', time: 238, color: ''},
    {text: '因为要好好表现 才能吸引雌性阿 ', time: 68, color: ''},
    {text: '你追女朋友不表现阿。自己送上门的？ ', time: 98, color: '#2196F3'},
    {text: '毛茸茸的可爱 ', time: 110, color: '#673AB7'},
    {text: '猴面包树:哈哈哈劳资早就料到了 ', time: 213, color: ''},
    {text: '小王子里有讲到猴面包树 ', time: 72, color: ''},
    {text: '炸着吃嘎嘣脆！ ', time: 208, color: ''},
    {text: '大王好帅！ ', time: 75, color: '#673AB7'},
    {text: '…… ', time: 186, color: ''},
    {text: '爬树还好者？ ', time: 236, color: '#E91E63'},
    {text: '巨木森林的根得扎得多深呐… ', time: 195, color: ''},
    {text: '很喜欢这样的景色 ', time: 31, color: ''},
    {text: '30厘米 ', time: 178, color: ''},
    {text: '嘎嘣脆 ', time: 145, color: ''},
    {text: '黄水仙 ', time: 106, color: ''},
    {text: 'and edible… ', time: 159, color: '#E91E63'},
    {text: '谢谢你们拍摄这么好的作品 ', time: 12, color: ''},
    {text: '好想一口吃掉 ', time: 106, color: ''},
    {text: '层林尽染 ', time: 58, color: '#2196F3'},
    {text: 'Therules are simple! ', time: 19, color: ''},
    {text: '美 ', time: 50, color: ''},
    {text: '像香蕉 ', time: 237, color: '#E91E63'},
    {text: '弱者就要被淘汰，优胜劣汰 ', time: 74, color: '#2196F3'},
    {text: '我最怕这个… ', time: 235, color: '#2196F3'},
    {text: '羞羞羞 ', time: 209, color: ''},
    {text: '哇 ', time: 75, color: ''},
    {text: '哇哦 ', time: 212, color: '#E91E63'},
    {text: '哇哦 ', time: 141, color: ''},
    {text: '额，想起了异形里的抱脸虫 ', time: 121, color: '#673AB7'},
    {text: '不追求难道要坐等灭绝吗。。。 ', time: 8, color: ''},
    {text: '吐了 ', time: 124, color: '#673AB7'},
    {text: '哇，三十层 ', time: 166, color: ''},
    {text: '可怜 ', time: 57, color: '#673AB7'},
    {text: '哈哈哈，这吊姿 ', time: 244, color: ''},
    {text: '小鹿好萌 ', time: 156, color: ''},
    {text: '哎呀，下来了 ', time: 24, color: '#E91E63'},
    {text: '爪子毛茸茸的 ', time: 8, color: '#E91E63'},
    {text: '哇(⊙o⊙)哇 ', time: 111, color: '#2196F3'},
    {text: '没开前，好像香蕉 ', time: 24, color: '#673AB7'},
    {text: '花蜜都抖掉了 ', time: 202, color: ''},
    {text: '哈哈哈 ', time: 165, color: ''},
    {text: '揉脸好萌 ', time: 79, color: '#673AB7'},
    {text: '真有幸能看到这种画面 ', time: 37, color: '#E91E63'},
    {text: '眨巴眼睛的小可爱 ', time: 137, color: '#E91E63'},
    {
        text: '你知道高中好不容易午休一次还有蝉鸣的痛苦吗 ',
        time: 12,
        color: '',
    },
    {text: '尾巴好可爱啊 ', time: 23, color: ''},
    {
        text: '突然想起《里约大冒险》里面的情节了 ',
        time: 176,
        color: '#E91E63',
    },
    {
        text: '可怜的蝉，被人类、其他动物一致认为很好吃。。。 ',
        time: 198,
        color: '',
    },
    {text: '突然觉得蝉好伟大 ', time: 17, color: ''},
    {text: '蝉鸣的夏季，我想遇见你。 ', time: 37, color: '#673AB7'},
    {text: 'Winter is coming ', time: 25, color: ''},
    {text: '又有点心，又有肉吃，这生活美滋滋 ', time: 213, color: ''},
    {text: '猞猁。。。 ', time: 100, color: '#2196F3'},
    {text: '想找个女人真难。。。 ', time: 212, color: '#2196F3'},
    {text: '30厘米 ', time: 56, color: ''},
    {text: '这个好吃。。。 ', time: 174, color: ''},
    {text: '撑的吃不下了。。。 ', time: 21, color: ''},
    {text: '蝉蜕，中药啊 ', time: 219, color: '#2196F3'},
    {text: '为了血统的纯洁性。。。 ', time: 213, color: ''},
    {text: '鹫都好丑。。。 ', time: 89, color: '#673AB7'},
    {text: '看见爪子缩了进去。。。 ', time: 124, color: '#2196F3'},
    {text: '蕨苔 ', time: 174, color: ''},
    {text: '好美。。。。 ', time: 181, color: ''},
    {text: '面包树？ ', time: 72, color: ''},
    {text: '富含淀粉，所以叫面包树 ', time: 230, color: '#E91E63'},
    {text: '鸳鸯戏水就是这么来的 ', time: 7, color: ''},
    {text: '堪比大片 ', time: 23, color: '#2196F3'},
    {text: '脸长得像老虎 ', time: 63, color: ''},
    {
        text: '存在一个最大速度，不会无限加速的，而且地下还有缓冲 ',
        time: 21,
        color: '#673AB7',
    },
    {text: '好久沒見到老虎了啊…… ', time: 6, color: '#2196F3'},
    {text: '这绳子是怎么挂上去的？ ', time: 179, color: '#2196F3'},
    {
        text: '雄性进化这么好看还不是为了追求雌性 ',
        time: 159,
        color: '#2196F3',
    },
    {text: '前面说以吃蝉为生的是要十七年吃一顿嘛？ ', time: 46, color: ''},
    {text: '十七年蝉 ', time: 187, color: '#E91E63'},
    {text: '配乐到位 ', time: 214, color: '#673AB7'},
    {text: '感觉好痴汉 ', time: 127, color: ''},
    {text: '隔着屏幕我都感觉到它在问我瞅啥 ', time: 203, color: '#2196F3'},
    {text: '伽.....伽椰子？？？！！！！！ ', time: 223, color: '#2196F3'},
    {text: '我的妈，好灵活 ', time: 40, color: ''},
    {text: '滑稽 ', time: 107, color: ''},
    {text: '我也希望永远这样 ', time: 100, color: '#2196F3'},
    {text: '开发你妹 ', time: 241, color: ''},
    {text: '好萌 ', time: 179, color: ''},
    {text: '噗，，，倒挂 ', time: 177, color: '#2196F3'},
    {text: '好壮观 ', time: 52, color: ''},
    {text: '我快被蝉感动到了 ', time: 116, color: '#2196F3'},
    {text: '好像我起床气声音 ', time: 33, color: '#673AB7'},
    {text: '这个加了最 ', time: 48, color: ''},
    {text: '超快 ', time: 113, color: '#2196F3'},
    {text: '好可爱啊 ', time: 112, color: ''},
    {text: '大自然真壮观 ', time: 32, color: ''},
    {text: '好高啊 ', time: 12, color: ''},
    {text: 'bgm配的真好 ', time: 167, color: ''},
    {text: '好可爱 ', time: 119, color: ''},
    {text: '芒果松，可以吃吗？ ', time: 39, color: ''},
    {text: '好可爱 ', time: 211, color: ''},
    {text: '超可爱啊，毛茸茸的 ', time: 131, color: ''},
    {text: '哇塞 ', time: 91, color: ''},
    {text: '前面说黄鸡宠物的别跑 ', time: 6, color: ''},
    {text: '吸吸吸吸吸吸吸吸大猫 ', time: 213, color: '#673AB7'},
    {text: '吸吸吸吸吸吸吸吸大猫', time: 173, color: '#2196F3'},
    {text: '驼鹿吧这只 ', time: 104, color: '#673AB7'},
    {text: '是脱落酸，信我 ', time: 71, color: '#2196F3'},
    {text: '这是纺锤树 ', time: 157, color: '#2196F3'},
    {text: '太高了吧，好想爬 ', time: 44, color: ''},
    {text: '最小的猫…… ', time: 123, color: '#2196F3'},
    {text: '伟大的脱落酸 ', time: 58, color: ''},
    {text: '碰到贝爷。。。 ', time: 4, color: ''},
    {text: '你们不要再打啦！ ', time: 15, color: '#673AB7'},
    {text: '前方高能 ', time: 104, color: '#E91E63'},
    {text: '19.8.11 ', time: 150, color: '#E91E63'},
    {text: '蕨类植物 ', time: 147, color: '#2196F3'},
    {text: '扑棱蛾子 ', time: 165, color: '#E91E63'},
    {text: '19.8.11 ', time: 140, color: ''},
    {
        text: '这种林子里，虫子如蚊子等多的一逼，乌云般蚊子你自己体会一下 ',
        time: 190,
        color: '#E91E63',
    },
    {text: 'b_box ', time: 127, color: '#2196F3'},
    {text: '拿它们的壳做手办哈哈哈 ', time: 112, color: '#673AB7'},
    {text: '长尾叶猴 ', time: 198, color: '#673AB7'},
    {text: '不是季节性森林吗？？？ ', time: 70, color: ''},
    {text: '信仰之跃 ', time: 66, color: '#E91E63'},
    {text: '嘲讽 ', time: 146, color: '#E91E63'},
    {text: '信仰之跃 ', time: 45, color: '#673AB7'},
    {text: '啪 ', time: 34, color: ''},
    {text: '开始叫了。。 ', time: 173, color: '#673AB7'},
    {text: '团灭。 ', time: 161, color: '#2196F3'},
    {text: '黑恶势力登场 ', time: 94, color: '#E91E63'},
    {text: '请保护自然 ', time: 127, color: '#2196F3'},
    {text: '饥荒里的鸡哈哈哈 ', time: 153, color: '#2196F3'},
    {text: '下集见 ', time: 58, color: '#673AB7'},
    {text: '魇兽的原型？？ ', time: 53, color: ''},
    {text: '我想开了 ', time: 68, color: '#2196F3'},
    {text: '单鸣哈哈等我 ', time: 196, color: '#673AB7'},
    {text: '发财了一只两块 ', time: 33, color: '#E91E63'},
    {text: '保鲜肉哈 ', time: 135, color: '#2196F3'},
    {text: '2019，0815，夜不能寐 ', time: 39, color: '#673AB7'},
    {text: '真美 ', time: 131, color: '#2196F3'},
    {text: '绿鸟 ', time: 185, color: ''},
    {text: '跳得跟飞一样 ', time: 193, color: '#E91E63'},
    {text: '哎呀妈呀 ', time: 57, color: ''},
    {text: '为啥17年… ', time: 21, color: '#673AB7'},
    {text: '层林尽染 ', time: 181, color: '#2196F3'},
    {text: '我也感觉红色的字幕是中译英 ', time: 93, color: '#2196F3'},
    {text: '开花 ', time: 59, color: '#673AB7'},
    {text: '吃个饭恼羞成怒了 ', time: 152, color: ''},
    {text: '口技 ', time: 0, color: ''},
    {text: '嘤嘤嘤，人家也要爬这种树 ', time: 96, color: ''},
    {text: '落叶这一幕，是梁思成与林徽因里面的！ ', time: 7, color: ''},
    {text: '可爱捏，刚睡醒 ', time: 181, color: '#2196F3'},
    {text: '我快看完了 ', time: 120, color: '#673AB7'},
    {text: '终于要看完了 ', time: 106, color: '#673AB7'},
    {text: '雪吸音 ', time: 58, color: ''},
    {text: '好灵活啊 ', time: 3, color: ''},
    {text: '鸡你太美 ', time: 191, color: '#2196F3'},
    {text: '鸡你太美2333 ', time: 125, color: '#673AB7'},
    {text: '引擎发动的声音 ', time: 146, color: '#E91E63'},
    {text: '巨人呢 ', time: 157, color: ''},
    {
        text: '与我无瓜，我不是翻译的那个红色，而且我是男的 ',
        time: 60,
        color: '',
    },
    {text: '不缺 ', time: 65, color: '#2196F3'},
    {text: '我家才18层…… ', time: 24, color: ''},
    {text: '大粗长 ', time: 197, color: ''},
    {text: '分阶段摔可还行，哈哈哈哈哈哈哈 ', time: 49, color: '#673AB7'},
    {text: '阿 ', time: 60, color: ''},
    {
        text: '喜欢看蛇推荐看奥斯丁·斯蒂文斯的视频 ',
        time: 142,
        color: '#2196F3',
    },
    {text: '来啰 ', time: 176, color: '#2196F3'},
    {text: '有 ', time: 148, color: '#E91E63'},
    {text: '大喵 ', time: 117, color: ''},
    {text: '北极平头哥 ', time: 40, color: ''},
    {text: '第二季见！ ', time: 108, color: '#2196F3'},
    {text: '牛逼 ', time: 138, color: ''},
    {text: '超好吃，一只营养等于一个鸡蛋 ', time: 108, color: ''},
    {text: '女孩子可以养一只 ', time: 1, color: ''},
    {text: '深海见 ', time: 124, color: '#E91E63'},
    {text: '深海见 ', time: 88, color: '#673AB7'},
    {text: 'hhhh这叫声怎么跟敲梆子似的 ', time: 39, color: ''},
    {text: '明显一只个头大一些 ', time: 65, color: '#673AB7'},
    {text: '口技了得 ', time: 7, color: ''},
    {text: '偷蛋贼 ', time: 91, color: '#2196F3'},
    {text: '同是小可爱何苦为难小可爱 ', time: 38, color: '#E91E63'},
    {text: '好想吃哦 ', time: 16, color: ''},
    {text: '小时候一抓一大碗，现在饭店卖到几块钱一只 ', time: 111, color: ''},
    {text: '松鼠都吃它 ', time: 45, color: ''},
    {text: '这也太可怜了吧233333，就是因为它太好吃了 ', time: 56, color: ''},
    {text: '吃饱了都不想吃了 ', time: 32, color: '#673AB7'},
    {text: '不会被吃灭绝了吧 ', time: 152, color: '#673AB7'},
    {text: '呆萌 ', time: 17, color: ''},
    {
        text: '头先着地的话会不会把脑袋插进叶子堆里去哈哈哈哈 ',
        time: 55,
        color: '',
    },
    {text: '像蟑螂 ', time: 48, color: ''},
    {
        text: '这是我看过的纪录片中最好看的，画面，剪辑还有解说都超喜欢 ',
        time: 60,
        color: '',
    },
    {text: '喊一声就完了 ', time: 121, color: '#2196F3'},
    {text: '起来加班了 ', time: 178, color: '#673AB7'},
    {text: '面包树来了哈哈哈 ', time: 198, color: ''},
    {text: '20190823唉上学去了 ', time: 85, color: '#673AB7'},
    {text: '然而这样美丽的雨林被火烧了三周都无人问津 ', time: 98, color: ''},
    {
        text: '美丽的雨林啊 如果以后没有人类的存在 请以后也要这样绚丽 ',
        time: 126,
        color: '#2196F3',
    },
    {text: '19.8.23，前面那个别走 ', time: 78, color: ''},
    {text: '小福腻 ', time: 25, color: ''},
    {text: '掉树根上就嗝屁了 ', time: 169, color: ''},
    {text: '鳄势力 ', time: 72, color: ''},
    {text: '更吹落，星如雨 ', time: 153, color: ''},
    {text: '温带落叶阔叶林 ', time: 38, color: '#E91E63'},
    {text: '跟小鸭子一样 ', time: 129, color: ''},
    {text: '像不像刚刚走路的你 ', time: 173, color: '#E91E63'},
    {text: '鸡也开屏？ ', time: 22, color: '#673AB7'},
    {
        text: '下一个十七年也许它们不会有机会醒过来了 ',
        time: 115,
        color: '#2196F3',
    },
    {text: '美团外卖 ', time: 156, color: ''},
    {text: '我喜欢这里 ', time: 112, color: '#E91E63'},
    {text: '您的好友林鸮已下线 ', time: 57, color: ''},
    {text: '共同进化 ', time: 24, color: '#2196F3'},
    {text: '嗷 抓不到qwq ', time: 154, color: ''},
    {text: '求偶专用翼帆 ', time: 179, color: '#E91E63'},
    {text: '说想住的还抱有这个想法吗(╹ૅ×╹ૅ) ', time: 109, color: ''},
    {text: '嗝儿~ ', time: 62, color: ''},
    {text: '哇，猴面包树！ ', time: 18, color: ''},
    {text: '哇 大猫 ', time: 6, color: '#2196F3'},
    {text: '哇 ', time: 154, color: '#673AB7'},
    {text: '傻袍子 ', time: 0, color: '#2196F3'},
    {text: '美式的你仿佛在逗我 ', time: 26, color: ''},
    {text: '爬树干嘛 ', time: 20, color: ''},
    {
        text: '栖息地被破坏就容易灭绝，，长啥样的都可能灭绝 ',
        time: 31,
        color: '',
    },
    {text: '猞猁！ ', time: 72, color: '#E91E63'},
    {text: '什么叫像啊，林鸮本来就是猫头鹰 ', time: 95, color: '#E91E63'},
    {text: '好可爱 ', time: 157, color: ''},
    {text: '你瞅啥瞅你咋的 ', time: 25, color: '#673AB7'},
    {text: '烤蝉超好吃的！！！ ', time: 172, color: ''},
    {text: '大脑斧 ', time: 142, color: ''},
    {text: '大家好。 ', time: 160, color: '#673AB7'},
    {text: '2019。8。 26 ', time: 56, color: '#E91E63'},
    {text: '呦呦鹿鸣食野之苹 ', time: 143, color: '#E91E63'},
    {text: '呦呦鹿鸣，食野之苹 ', time: 160, color: ''},
    {text: '另外4个小伙伴你们好~~ ', time: 132, color: ''},
    {text: '扎嘴了。。 ', time: 141, color: '#E91E63'},
    {text: '层林尽染 ', time: 169, color: ''},
    {text: '卧槽。。 ', time: 152, color: ''},
    {text: '哈哈哈 ', time: 62, color: ''},
    {text: '鹿：再来一些 ', time: 127, color: '#673AB7'},
    {text: '真正的黑恶势力 ', time: 1, color: '#2196F3'},
    {text: '深海 ', time: 156, color: '#673AB7'},
    {text: '开学前一天的我 ', time: 2, color: '#E91E63'},
    {text: '自由之翼 ', time: 113, color: ''},
    {text: '海狮还会吃企鹅... ', time: 150, color: '#673AB7'},
    {text: '迪亚特洛夫事件 ', time: 164, color: ''},
    {text: '大家吃的都好香 ', time: 179, color: ''},
    {
        text:
            '远东豹是不是都不到一百只啊？一只小宝宝的生死几乎承担了半个种群的存续 ',
        time: 180,
        color: '',
    },
    {text: '蕉迟但到23333333 ', time: 38, color: '#2196F3'},
    {text: '猴面包树这么光滑，鼠狐猴是怎么爬上去的呢 ', time: 158, color: ''},
    {text: '好可爱 ', time: 106, color: ''},
    {text: '啊啊啊啊啊啊啊啊啊啊啊 ', time: 4, color: '#673AB7'},
    {text: '2019-8-31 ', time: 12, color: '#673AB7'},
    {text: '托福阅读里有这个哎 ', time: 139, color: ''},
    {text: '讲道理，为什么你的脸圆圆的 ', time: 49, color: '#2196F3'},
    {text: '像鸭子 ', time: 48, color: '#2196F3'},
    {text: '这是正常的生物链，不要说什么灾难 ', time: 179, color: '#673AB7'},
    {text: '好可爱啊 ', time: 122, color: '#673AB7'},
    {text: '啊啊啊小可爱 ', time: 144, color: ''},
    {text: '我裂开了 ', time: 158, color: '#2196F3'},
    {text: '裂开 ', time: 22, color: ''},
    {text: '发光的那个只是反光 ', time: 52, color: ''},
    {text: '盲猜有北极熊 ', time: 93, color: '#673AB7'},
    {text: '看蛇 ', time: 106, color: '#E91E63'},
    {text: '有蛇吗 ', time: 198, color: '#2196F3'},
    {text: '不看人，要看蛇 ', time: 131, color: ''},
    {text: '辅助别浪 ', time: 85, color: ''},
    {
        text: '长得好像蟑螂 为啥这么多人怕蟑螂而不怕这个啊？ ',
        time: 122,
        color: '',
    },
    {text: '怎么，吃虫的还有优越感了？ ', time: 43, color: '#2196F3'},
    {text: 'slender 。。 ', time: 180, color: '#2196F3'},
    {text: 'rut。。 ', time: 171, color: '#673AB7'},
    {text: 'carcass。。 ', time: 5, color: '#E91E63'},
    {text: 'rouse from 。。 ', time: 179, color: ''},
    {text: '说得好 ', time: 50, color: ''},
    {text: '冰雪奇缘里的景色么？ ', time: 79, color: ''},
    {text: '最喜欢雪景了 ', time: 70, color: ''},
    {text: '鼓掌 ', time: 74, color: '#2196F3'},
    {text: '我要被萌死 ', time: 177, color: ''},
    {text: '非主流发型 ', time: 4, color: ''},
    {text: '你 ', time: 1, color: '#673AB7'},
    {text: '前面北美有树的牛逼 ', time: 96, color: ''},
    {text: '好好看吖 ', time: 185, color: '#2196F3'},
    {text: '何似在人间 ', time: 135, color: ''},
    {text: '我毛已炸 ', time: 49, color: '#2196F3'},
    {text: '大饼脸233 ', time: 97, color: ''},
    {text: '哈哈哈哈哈疯了 ', time: 36, color: ''},
    {text: '所以谁赢了？ ', time: 57, color: ''},
    {text: '始 ', time: 56, color: ''},
    {text: '变 ', time: 20, color: ''},
    {text: '变色成功 ', time: 144, color: ''},
    {text: '开 ', time: 187, color: ''},
    {text: '凶凶的挺好的呀 ', time: 66, color: ''},
    {text: '好胖吖 ', time: 82, color: '#2196F3'},
    {text: '妈妈你看那个肉是热的 ', time: 97, color: ''},
    {text: '这是沸羊羊的干爹（手动滑稽） ', time: 50, color: ''},
    {text: '哇塞 ', time: 127, color: '#2196F3'},
    {text: '还真是什么都心疼啊 ', time: 74, color: ''},
    {text: '指导这是自然 但是心理还是不太舒服 ', time: 141, color: '#2196F3'},
    {text: '对呀你咬我呀 ', time: 30, color: '#2196F3'},
    {text: '硬传播 ', time: 76, color: ''},
    {text: 'Primate灵长类动物 ', time: 169, color: ''},
    {text: '啊啊啊啊啊疯了 ', time: 61, color: ''},
    {text: 'stalking 跟踪 hare野兔', time: 25, color: '#2196F3'},
].sort((a, b) => a.time - b.time);

/**
 * 在轨的弹幕 DOM 数组, 保存着每个轨道的最后一个弹幕 DOM
 * @type {[HTMLElement]}
 */
let onTrackBarrageDOMArr;
/**
 * 弹幕轨道数量
 * @type {number}
 */
let barrageTrackCount;
/**
 * 所有弹幕轨道的高度
 * @type {number}
 */
let barrageAllTrackHeight;
/**
 * 单个弹幕轨道的高度
 * @type {number}
 */
let barrageSingleTrackHeight;
/**
 * 每个弹幕轨道的当前弹幕的宽度数组
 * @type {[number]}
 */
let currentBarrageTextWidthArr;
/**
 * 每个弹幕轨道的下一个弹幕的宽度数组
 * @type {[number]}
 */
let nextBarrageTextWidthArr;
/**
 * 每个弹幕轨道的当前弹幕的 X 轴坐标数组
 * @type {[number]}
 */
let barrageMinTranslateXArr;
/**
 * 可以添加弹幕的轨道的数组, 数组索引对应着轨道的索引
 * @type {[boolean]}
 */
let addableBarrageTrackArr

/**
 * 范围左索引, 由于是查找一定范围内的弹幕, 然后在这个范围内取得弹幕, 所以需要确定这个范围的左部索引
 * @type {number}
 */
let leftRangeBarrageIndex = 0;
/**
 * 范围右索引, 由于是查找一定范围内的弹幕, 然后在这个范围内取得弹幕, 所以需要确定这个范围的右部索引
 * @type {number}
 */
let rightRangeBarrageIndex = 0;
/**
 * 获取弹幕的时间间隔, 单位是秒(s). 每隔这个时间间隔, 可获取弹幕的范围就会更新
 * @type {number}
 */
let gainBarrageInterval = 1;
/**
 * 已经出现过的弹幕索引, 由于生成的弹幕索引是在指定范围内的随机值,
 * 所以需要记录已经出现过的弹幕索引, 避免弹幕重复出现
 * @type {Set<number>}
 */
let appearedBarrageIndexSet = new Set();

/**
 * 生成弹幕记录的当前时间, 主要用于比较
 * @type {number}
 */
let generateBarrageNowTime;
/**
 * 用户输入的弹幕
 * @type {[Object]}
 */
let inputBarrageArr = [];

let barrageIndex = 0;
let openBarrage = true;
let barrageItemTopDownMargin = 4;
let barrageItemLeftRightMargin = 50;

let barrageFontSize = 16;
let barrageRollSpeed = 80;
let barrageAreaRatio = 0.5;
let barrageOpacity = 1;
let barrageFontFamily = "微软雅黑";
let barrageBold = true;

// 注意: 带 base 的是按比例计算时的基数, 可能是最小值, 也可能是最大值
const barrageOpacityBase = 1;
const barrageMinOpacity = 0.1;

const barrageFontSizeBase = 16;
const barrageFontSizeMinRatio = 0.5;
const barrageFontSizeMaxRatio = 1.7;
const barrageMinFontSize = barrageFontSizeBase * barrageFontSizeMinRatio;
const barrageMaxFontSize = barrageFontSizeBase * barrageFontSizeMaxRatio;

const barrageRollSpeedBase = 80;
const barrageRollMaxSpeed = 200;

const barrageAreaMinRatio = 0.25;
const barrageAreaMaxRatio = 1;

const barrageScheduleRemoveDelay = 3;
const fontSizeNormal = 400;
const fontSizeBold = 700;

const rollPropertyName = "roll";
const barragePositionPropertyName = "position";
const closeBarrageClassName = "close-barrage";
const BARRAGE_POSITION = {
    roll: 0,
    top: 1,
    bottom: 2
};

const barrageControl = document.querySelector(".barrage-control");
const barrageItem = document.querySelector('.barrage-item');
const barrageList = document.querySelector('.barrage-list');
const openCloseIcon = document.querySelector(".open-close-icon");
const closeBarrageIcon = document.querySelector(".close-barrage-icon");
const openBarrageIcon = document.querySelector(".open-barrage-icon");

function setBarrageBold(bold) {
    barrageBold = bold;
}

function getBarrageBold() {
    return barrageBold;
}

function getBarrageFontFamily() {
    return barrageFontFamily;
}

function setBarrageFontFamily(fontFamily) {
    barrageFontFamily = fontFamily;
}

/**
 * 定期添加弹幕, 不过是否能添加弹幕还有其他的条件
 */
function scheduleAddBarrage() {
    if (pause || !openBarrage) {
        return;
    }

    window.requestAnimationFrame(() => {
        // 这里添加 !openBarrage 是双重检查, 保证关闭弹幕后一定不会添加弹幕
        if (!openBarrage) return;

        if (!generateBarrageNowTime) {
            generateBarrageNowTime = performance.now();
            window.locateBarrageByVideoTime();
            window.scheduleAddBarrage();
            return;
        }

        let last = performance.now();
        if (last - generateBarrageNowTime > gainBarrageInterval * 1000) {
            generateBarrageNowTime = last;
            window.locateBarrageByVideoTime();
        }

        let addableTrackIndexArr = window.checkAllBarrageTrackAddable();
        let noInputAddable = addableTrackIndexArr.length > 0 && leftRangeBarrageIndex >= 0 && rightRangeBarrageIndex >= 0;
        let inputAddable = addableTrackIndexArr.length > 0 && inputBarrageArr.length > 0;
        if (noInputAddable || inputAddable) {
            window.addBarrageToScreen(addableTrackIndexArr);
        }
        window.scheduleAddBarrage();
    });
}

function locateBarrageByVideoTime() {
    let videoTime = Math.round(video.currentTime);

    appearedBarrageIndexSet = new Set();
    leftRangeBarrageIndex = window.binarySearchBarrage(videoTime);
    rightRangeBarrageIndex = window.binarySearchBarrage(videoTime + gainBarrageInterval);
    rightRangeBarrageIndex === INVALID_NUMBER && (rightRangeBarrageIndex = leftRangeBarrageIndex);
}

/**
 * 使用二分法搜索弹幕时间进而快速确定要展示的弹幕索引
 * @param time {number} 时间
 * @return {number} 弹幕索引
 */
function binarySearchBarrage(time) {
    let arr = barrageArr;
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        // 位运算得到的数字必定为整数, 使用除法则不一定
        let mid = left - ((left - right) >> 1);
        if (arr[mid].time === time) {
            while (0 < mid && arr[mid].time === time) {
                mid--;
            }
            return mid;
        } else if (arr[mid].time < time) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return INVALID_NUMBER;
}

/**
 * 检查所有的弹幕轨道, 查看是否有可以添加的轨道
 * @return {number[]} 返回可以添加的弹幕轨道索引
 */
function checkAllBarrageTrackAddable() {
    let addableIndexArr = [];
    for (let index = 0, length = onTrackBarrageDOMArr.length; index < length; index++) {
        let barrageItemDOM = onTrackBarrageDOMArr[index];
        if (window.checkSingleBarrageTrackAddable(barrageItemDOM, index)) {
            addableIndexArr.push(index);
        }
    }
    return addableIndexArr;
}

/**
 * 检查单个轨道是否可以添加弹幕, 要根据在轨的弹幕的信息来判断是否可以添加新的弹幕
 * @param barrageItemDOM {HTMLElement} 在轨弹幕元素
 * @param index {number} 轨道索引
 * @return {boolean} 返回 true 表示可以添加弹幕, 反之不可以添加
 */
function checkSingleBarrageTrackAddable(barrageItemDOM, index) {
    // 如果没有在轨元素, 表示该轨道可以添加弹幕
    if (!barrageItemDOM) {
        addableBarrageTrackArr[index] = true;
        return true;
    }

    // 如果该条弹幕轨道不能添加弹幕, 就将这条轨道设置为可添加弹幕, 并计算和记录 minTranslateX 到 barrageMinTranslateXArr 中
    if (!addableBarrageTrackArr[index]) {
        addableBarrageTrackArr[index] = true;
        currentBarrageTextWidthArr[index] = nextBarrageTextWidthArr[index];

        // 计算并记录当前弹幕的 minTranslateX 值, 当弹幕的 translateX 小于 minTranslateX 时, 在该弹幕轨道就会添加新的弹幕
        barrageMinTranslateXArr[index] = videoBoxWidth - currentBarrageTextWidthArr[index] - barrageItemLeftRightMargin;
    }
    // 实时计算当前弹幕的 translateX 值
    let translateX = getComputedStyle(onTrackBarrageDOMArr[index]).transform.split(", ")[4];
    return translateX < barrageMinTranslateXArr[index];
}

/**
 * 添加弹幕到屏幕上
 * @param addableTrackIndexArr {[number]} 可以添加弹幕的弹幕轨道索引数组
 */
function addBarrageToScreen(addableTrackIndexArr) {
    let leftIndex = leftRangeBarrageIndex;
    let rightIndex = rightRangeBarrageIndex;
    let appearedSet = appearedBarrageIndexSet;
    let inputBarrageArray = inputBarrageArr;

    addableTrackIndexArr.forEach((addableTrackIndex) => {
        /**
         * 克隆的 Node 必是 HTMLElement 类型的元素
         * @type {HTMLElement}
         */
        let barrageItemClone = barrageItem.cloneNode(true);
        let nextBarrageIndex = leftIndex + (Math.random() * (rightIndex - leftIndex) >> 0);
        if (appearedSet.has(nextBarrageIndex)) {
            return;
        }
        appearedSet.add(nextBarrageIndex);
        barrageIndex = nextBarrageIndex;

        let barrage;
        if (inputBarrageArray.length > 0) {
            barrage = inputBarrageArray.shift();
        } else {
            barrage = barrageArr[nextBarrageIndex];
        }

        let randomLeft = Math.random() * barrageItemLeftRightMargin;
        let offsetLeft = videoBoxWidth + randomLeft;

        // 计算要添加的弹幕的宽度
        let nextBarrageTextLength = window.calcLengthByHalfAndFullWidth(barrage.text);
        nextBarrageTextWidthArr[addableTrackIndex] = (barrageFontSize >> 1) * nextBarrageTextLength;

        // 弹幕滚动时间
        let rollDuration = (nextBarrageTextWidthArr[addableTrackIndex] + offsetLeft) / barrageRollSpeed;

        // 设置该条轨道不能添加弹幕
        addableBarrageTrackArr[addableTrackIndex] = false;

        // 动画结束后
        let animationend = () => {
            barrageItemClone.remove();
            barrageItemClone.removeEventListener("animationend", animationend);
        };

        // 是否是本人
        if (barrage.me) {
            barrageItemClone.classList.add(ME_CLASS_NAME);
        }

        // 根据弹幕的位置来展示弹幕
        if (barrage[barragePositionPropertyName]) {
            for (let key in BARRAGE_POSITION) {
                // 弹幕指定了位置但又不是滚动
                if (barrage[barragePositionPropertyName] === BARRAGE_POSITION[key] && BARRAGE_POSITION[key] !== BARRAGE_POSITION[rollPropertyName]) {
                    rollDuration = barrageScheduleRemoveDelay;
                    barrageItemClone.classList.add(key);
                    break;
                }
            }
        }

        barrageList.appendChild(barrageItemClone);
        barrageItemClone.addEventListener("animationend", animationend);

        // 在弹幕轨道上加上该弹幕元素
        onTrackBarrageDOMArr[addableTrackIndex] = barrageItemClone;

        let barrageItemCloneStyle = barrageItemClone.style;
        barrageItemClone.innerText = barrage.text;
        barrageItemCloneStyle.setProperty("--top", `${barrageSingleTrackHeight * addableTrackIndex}px`);
        barrageItemCloneStyle.setProperty("--color", barrage.color);
        barrageItemCloneStyle.setProperty("--offset", `${offsetLeft}px`);
        barrageItemCloneStyle.setProperty("--font-size", `${barrageFontSize}px`);
        barrageItemCloneStyle.setProperty("--opacity", `${barrageOpacity}`);
        barrageItemCloneStyle.setProperty("--duration", `${rollDuration}s`);
        barrageItemCloneStyle.setProperty("--font-weight", `${barrageBold ? fontSizeBold : fontSizeNormal}`);
        barrageItemCloneStyle.setProperty("--font-family", `${barrageFontFamily}, sans-serif, serif`);
    });
}

/**
 * 添加弹幕到弹幕数组
 * @param barrage {Object} 弹幕对象
 */
function addBarrageToBarrageArr(barrage) {
    barrageArr.splice(barrageIndex, 0, barrage);
    inputBarrageArr.push(barrage);
}

/**
 * 设置弹幕的字体大小, 不会清空弹幕
 * @param fontSize {number} 字体大小
 */
function setBarrageFontSize(fontSize) {
    if (typeof fontSize === "number" && barrageMinFontSize <= fontSize && fontSize <= barrageMaxFontSize) {
        barrageFontSize = fontSize;
        window.flushParams();
    }
}

/**
 * 设置弹幕的透明度
 * @param opacity {number} 透明度
 */
function setBarrageOpacity(opacity) {
    if (typeof opacity === "number" && barrageMinOpacity <= opacity && opacity <= barrageOpacityBase) {
        barrageOpacity = opacity;
    }
}

/**
 * 设置弹幕的展示区域, 不会清空弹幕
 * @param ratio {number} 占 videoBox 的高度比例
 */
function setBarrageAreaRatio(ratio) {
    if (typeof ratio === "number" && barrageAreaMinRatio <= ratio && ratio <= barrageAreaMaxRatio) {
        barrageAreaRatio = ratio;
        window.flushParams();
    }
}

/**
 * 设置弹幕的速度, 设置弹幕速度后会清空所有的弹幕
 * @param speed {number} 弹幕速度
 */
function setBarrageSpeed(speed) {
    if (typeof speed === "number" && barrageRollSpeedBase <= speed && speed <= barrageRollMaxSpeed) {
        barrageRollSpeed = speed;
        window.flushBarrage();
    }
}

/**
 * 刷新弹幕
 */
function flushBarrage() {
    window.flushParams();
    window.clearBarrageList();
}

/**
 * 刷新大木有关的参数
 */
function flushParams() {
    barrageSingleTrackHeight = barrageFontSize + barrageItemTopDownMargin;
    barrageAllTrackHeight = videoBoxHeight * barrageAreaRatio;
    barrageTrackCount = Math.ceil(barrageAllTrackHeight / barrageSingleTrackHeight);
    onTrackBarrageDOMArr = new Array(barrageTrackCount);
    currentBarrageTextWidthArr = new Array(barrageTrackCount);
    nextBarrageTextWidthArr = new Array(barrageTrackCount);
    barrageMinTranslateXArr = new Array(barrageTrackCount);
    addableBarrageTrackArr = new Array(barrageTrackCount).fill(false);
}

/**
 * 清空屏幕上的所有弹幕
 */
function clearBarrageList() {
    barrageList.innerHTML = "";
}

/**
 * 打开弹幕
 */
function openBarrageHandler() {
    openBarrage = true;
    openCloseIcon.classList.toggle(closeBarrageClassName);
    window.scheduleAddBarrage();
}

/**
 * 关闭弹幕
 */
function closeBarrageHandler() {
    openBarrage = false;
    openCloseIcon.classList.toggle(closeBarrageClassName);
    window.flushBarrage();
}

/**
 * 弹幕中间空间根据屏幕宽度来判断是否可见
 */
function barrageControlVisibleFitWidth() {
    if (videoBoxWidth > 800) {
        barrageControl.classList.remove(HIDDEN_CLASS_NAME);
    } else {
        barrageControl.classList.add(HIDDEN_CLASS_NAME);
    }
}

/**
 * 弹幕模块初始化
 */
function barrageModuleInitial() {
    window.flushBarrage();

    videoBoxResizeCallbackArr.push(window.flushBarrage);
    videoBoxResizeCallbackArr.push(window.barrageControlVisibleFitWidth);
    playVideoCallbackArr.push(window.scheduleAddBarrage);

    barrageItem.remove();
}

closeBarrageIcon.addEventListener("click", window.openBarrageHandler);
openBarrageIcon.addEventListener("click", window.closeBarrageHandler);
video.addEventListener("loadeddata", window.barrageModuleInitial);
