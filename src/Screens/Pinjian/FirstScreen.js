import React, { Component } from "react";
import styles from "./FirstScreen.css";
import { Image } from "~/Components/UIKit";

const problems = [
  { p1: "商品成色定义参差不齐，", p2: "卖家虚假包装" },
  { p1: "卖家供货渠道信誉无法保障，", p2: "价格不透明" },
  { p1: "保真力度不强，", p2: "假货问题得不到妥善解决" },
  { p1: "售后服务缺失，", p2: "卖家发货物流效率低" }
];

export default class PinjianFirstScreen extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div
          className={styles.titleImage}
          style={{ backgroundImage: `url(${Image.TeamTitle})` }}
        >
          <h1>为什么“想享”敢于承诺保证真品呢？</h1>
        </div>
        <div className={styles.problemWrapper}>
          <p>传统C2C模式的闲置奢侈品平台，可能会出现以下问题：</p>
          <div className={styles.problems}>
            {problems.map((p, index) => {
              return (
                <div key={index} className={styles.problem}>
                  <h3>{`0${index + 1}`}</h3>
                  <div>
                    <p>{p.p1}</p>
                    <p>{p.p2}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
