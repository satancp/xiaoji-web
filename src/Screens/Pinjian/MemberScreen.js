import React, { Component } from "react";
import styles from "./MemberScreen.css";
import { Image } from "~/Components/UIKit";

const members = [
  {
    titles: ["周东明", "想享副总裁 - 首席品鉴师"],
    contents: [
      "上海市认证中心奢侈品箱包皮具&珠宝手表专家；",
      "八十年代开始从事奢侈品鉴定与贩卖工作，长达10年辅助国家海关缉私局、公检法机构进行奢侈品鉴定评估工作；",
      "留日3年在新宿从事学习奢侈品鉴定与采购，获得大量中古货品以及各类手表珠宝的专业知识；",
      "归国后，回到上海专注从事各类奢侈品有关的活动，鉴定范围涉及国际一线奢侈品牌、全球顶级设计师品牌等，经手鉴定奢侈品每月1000件以上；",
      "1998年取得典当师资格证书；",
      "回国之初创立了恒生典当行，专业从事各类钟表，珠宝等名贵物品的品鉴与抵押；",
      "20世纪后又创立了成诚典当行，开创了国内典当行抵押奢侈品类箱包的先河；",
      "至今从事奢侈品鉴定评估行业已经40年，通过不懈研究与探索，成为国内首屈一指的奢侈品专家；"
    ]
  },
  {
    titles: ["李世伟", "想享特聘资深鉴定师"],
    contents: [
      "中检集团上海奢侈品鉴定培训专业特约讲师；",
      "元老级鉴定师；",
      "上海市认证中心奢侈品专家；",
      "最早从事奢侈品鉴定培训教育，具备15年扎实理论基础和大量实战经验的权威；",
      "上海著名大质屋实体店创办人，鉴定领域涉及奢侈品箱包、腕表、贵金属、钻石4大类；",
      "从业15年上海奢侈品鉴定行业；身经百战，见多识广，对奢侈品鉴定有自己的一套独特理论加极强的实践经验；",
      "眼光独到判断准确，15年潜心研究积累沉淀鉴定功力炉火纯青，擅长解决各类疑难杂症，专职鉴定各种奢侈品，擅长饰品眼镜，玉器宝石辨别，是公认踏实稳重的老师傅；",
      "15年来经手鉴定奢侈品已打30000件以上；"
    ]
  },
  {
    titles: ["傅春龄", "想享特聘资深鉴定师"],
    contents: [
      "上海顶级资深奢侈品鉴定师之一；",
      "从事奢侈品行业已达40余年，奢侈品行业元老级人物；",
      "1975年在上海亨得利钟表门店工作，专业从事各种奢侈品鉴定，尤其以钟表鉴定见长；",
      "积累了10年专业经验后转至百富勤集团，对各国各个时代的手表如数家珍，拥有能够轻松的辨别奢侈品手表的能力；",
      "曾任职于飞洲国际，年鉴5000件以上的经手商品；",
      "40年来对奢侈品的鉴定与判断，拥有了极精确的鉴定功力与快速的辨别真伪能力，对奢侈品鉴定总结出一套自己的独特理论与经验；",
      "对于奢侈品鉴定有自己独到的眼光，擅长解决各种疑难杂症，是行业内公认的最具权威性的专家；"
    ]
  },
  {
    titles: ["唐凤文", "想享特聘资深鉴定师"],
    contents: [
      "上海市认证中心奢侈品专家；",
      "GIA美国宝石学院持照钻石鉴定评估师；",
      "豫园紫禁城尚艺堂创始人及店主；",
      "受北京大学及成都地质学院专业培训学习及进修2年，对各类矿石宝石有学术性造诣；",
      "1990年赴日本留学、工作，对日本的中古店铺及日本中古文化市场有深入了解；",
      "积累了10年对珠宝首饰手表等奢侈品的鉴赏知识和经验；",
      "2003年归国后，创办了上海豫园紫禁城尚艺堂，专注于奢侈品箱包服饰领域鉴定评估工作；",
      "至今长达15年的奢侈品鉴定实战经验，帮助了500多名同业人员解决鉴赏疑难杂症，被认为是业界资深的鉴定师之一; "
    ]
  },
  {
    titles: ["桃子", "想享特聘资深鉴定师"],
    contents: [
      "上海市认证中心奢侈品箱包&服饰类专家；",
      "玫瑰坊资深店主之一；",
      "10余年奢侈品行业从业经验，对国内外各大品牌最新动态与商品了如指掌；",
      "每日面对30件以上奢侈品货品，从箱包到手表，珠宝等，以提出独到的鉴定方式与见解见长；",
      "曾任职于飞洲国际，年鉴5000件以上的经手商品；",
      "每月有近10家奢侈品门店提出疑难困惑，都能及时给出最专业的意见；",
      "10年来长期的经验口碑以及对于新品最准确的把控了解，能够从最细微的细节中判断货品的真伪，是行业内公认的鉴定大师，也是当代上海最值得信任的奢侈品鉴定师之一；",
      "每年为消费者挽回损失数万元；"
    ]
  },
  {
    titles: ["吴轶昊", "想享鉴定师"],
    contents: [
      "上海市认证中心奢侈品专家；",
      "上海最年轻的奢侈品品鉴专家之一，对于千禧年后的时尚奢侈品变迁了如指掌；",
      "接触新时代的时尚潮流奢侈品行业已10年有余；",
      "2010 年赴美攻读硕士学位，期间取得美国波士顿学院 时尚买手 硕士学位；",
      "留学美国7年的时间里，接触了各大奢侈品品牌公司，每年应邀参与10次以上大牌发布会；",
      "每年与各大品牌：香奈儿、LV、Prada等的首席设计师都有过多次深入的交流与探讨；",
      "每月满足50个以上私人客户的品鉴工作；",
      "对于品鉴与流行趋势有着自己独到的看法与见解；"
    ]
  },
  {
    titles: ["阮明俍", "想享鉴定师"],
    contents: [
      "上海新一代艺术品鉴定师；",
      "2010年起在博物馆、文物商店等多个国家单位从事古代艺术品鉴赏工作；",
      "2012年取得鉴定行业从业资格证书；",
      "深耕实操奢侈品交易近5年，涉及现代艺术奢侈品多方面的鉴赏养护工作；",
      "深耕奢侈品交易5余年，丰富的实战经验和精益求精的性格深受消费者认可；"
    ]
  }
];

const Member = ({ item }) => (
  <div className={styles.member}>
    <div className={styles.memberTitle}>
      <h3>{item.titles[0]}</h3>
      <p>{item.titles[1]}</p>
    </div>
    <div className={styles.content}>
      {item.contents.map((c, i) => <p key={i}>{c}</p>)}
    </div>
  </div>
);

export default class PinjianMemberScreen extends Component {
  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>资深团队保障</h1>
        <h2 className={styles.subTitle}>“想享”资深权威鉴定团队：</h2>
        <div className={styles.introWrapper}>
          <div className={styles.introCell}>
            <div className={styles.cellTitle}>
              <h3>40</h3>
              <p>余年</p>
            </div>
            <p>奢侈品鉴定经验</p>
          </div>
          <div className={styles.divider} />

          <div className={styles.introCell}>
            <div className={styles.cellTitle}>
              <h3>20</h3>
              <p>余年</p>
            </div>
            <p>典当行鉴定背景</p>
          </div>
          <div className={styles.divider} />

          <div className={styles.introCell}>
            <div className={styles.cellTitle}>
              <h3>10</h3>
              <p>余年</p>
            </div>
            <p>海关鉴定背景</p>
          </div>
          <div className={styles.divider} />

          <div className={styles.introCell}>
            <img src={Image.Identity} alt="Identity" />
            <p>
              中检集团奢侈品<br />鉴定培训特约讲师
            </p>
          </div>
          <div className={styles.divider} />

          <div className={styles.introCellSpec}>
            <h3>ちゅうこひん</h3>
            <p>多年日本中古业界鉴定背景</p>
          </div>
        </div>
        <p className={styles.desc}>
          每一个包包，经过7道严苛鉴定，我们的承诺，让你放心交易。
        </p>
        <h2 className={styles.subTitle}>团队成员</h2>
        <div className={styles.memberWrapper}>
          {members.map((m, i) => <Member key={i} item={m} />)}
        </div>
      </div>
    );
  }
}
