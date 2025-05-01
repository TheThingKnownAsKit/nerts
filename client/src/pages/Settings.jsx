import CustomButton from "../components/CustomButton";
import SettingsBox from "../components/SettingsBox";
import "./Settings.css";

/**
 * settings page component
 * renders the settings panel along with a floating "Back" button
 */
function Settings() {
  return (
    <div>
      {/* main settings panel where users can adjust color, volume, toggles */}
      <SettingsBox />
      {/* redirecting to previous page and overlays button on top */}
      <CustomButton back={true} absolute={true} text={"Back"} />
    </div>
  );
}

export default Settings;
