import React, { Component } from "react";
import styles from "./IntroScreen.css";
import { Image } from "~/Components/UIKit";
import classNames from "classnames";

const introLeft = classNames(styles.intro, styles.introLeft);

const intros = [
  {
    watermark: "self-support",
    titles: ["品牌自营保障", "品牌担保，竞拍无忧"],
    contents: [
      "“想享”的买手团队只选择可信赖的渠道进行商品的收买。",
      "“想享”统一平台所有商品的标准，由大数据分析精准定价。"
    ],
    pos: "right"
  },
  {
    watermark: "authentic",
    titles: ["100%正品保障", "假一赔三，负责到底"],
    contents: [
      "所有商品必须经过“想享”权威鉴定团队严格鉴定通过后才会收买和入库",
      "“想享”接受中检集团第三方二次鉴定结果，“想享”承诺无条件假一赔三"
    ],
    pos: "left"
  },
  {
    watermark: "service",
    titles: ["服务体验保障", "专属服务，尊贵体验"],
    contents: [
      "“想享”所有商品都在自营的仓库，24小时顺丰发货。",
      "“想享”提供7*24小时专属客服一对一售后服务，有问必答。"
    ],
    pos: "right"
  }
];

const Intro = ({ item }) => (
  <div className={item.pos === "right" ? styles.intro : introLeft}>
    <div className={styles.watermark}>{item.watermark}</div>
    <div className={styles.title}>
      <h3>{item.titles[0]}</h3>
      <p>{item.titles[1]}</p>
    </div>
    <div className={styles.content}>
      {item.contents.map((c, i) => <p key={i}>{c}</p>)}
    </div>
  </div>
);

export default class PinjianIntroScreen extends Component {
  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>“想享”品牌保障</h1>
        <div className={styles.introWrapper}>
          <img
            className={styles.img1}
            src={Image.Team1}
            width={385}
            alt="Team"
          />
          <img
            className={styles.img1_1}
            src={Image.Team1_1}
            width={69}
            alt="Team"
          />
          <img
            className={styles.img2}
            src={Image.Team2}
            width={128}
            alt="Team"
          />
          <img
            className={styles.img2_2}
            src={Image.Team2_2}
            width={320}
            alt="Team"
          />
          <img
            className={styles.img3}
            src={Image.Team3}
            width={364}
            alt="Team"
          />
          <img
            className={styles.img4}
            src={Image.Team4}
            width={188}
            alt="Team"
          />
          {intros.map((item, i) => <Intro key={i} item={item} />)}
        </div>
      </div>
    );
  }
}
