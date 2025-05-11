import Gameboard from "../assets/images/backgrounds/Game-board.png";
import CustomButton from "../components/CustomButton";

import "./Rules.css";

/* displays the game instructions in two sections with a floating "Back" button*/
function Rules() {
  return (
    <div
      className="rules-container"
      style={{
        backgroundImage: `url(${Gameboard})`
      }}
    >
      {/* back button. used to navigate to previous page and places button in top left*/}
      <CustomButton back={true} absolute={true} text={"Back"} />
    </div>
  );
}

export default Rules;
