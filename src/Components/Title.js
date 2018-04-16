import React, { Component } from "react";
import styles from "./Title.css";

export class Title extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.left} />
        <h1>{this.props.name}</h1>
        <div className={styles.right} />
      </div>
    );
  }
}
