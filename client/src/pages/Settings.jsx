import CustomButton from "../components/CustomButton"
import SettingsBox from "../components/SettingsBox"
import './Settings.css'

function Settings() {
    return (
        <div>
            <SettingsBox/>
            <CustomButton back={true} absolute={true} text={"Back"}/>
        </div>
    );
}

export default Settings