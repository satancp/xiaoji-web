import React, { Component } from "react";
import TeamFirstScreen from "~/Screens/Pinjian/FirstScreen";
import TeamIntroScreen from "~/Screens/Pinjian/IntroScreen";
import TeamMemberScreen from "~/Screens/Pinjian/MemberScreen";
import { Footer } from "~/Components/Footer";
import styles from "./PinjianPage.css";
import Particle from "~/Components/Particle";

export default class PinjianPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div>
          <Particle />
          <TeamFirstScreen />
          <TeamIntroScreen />
          <TeamMemberScreen />
          <Footer />
        </div>
      </div>
    );
  }
}
