import { combineReducers } from "redux";
import { HomePageReducer } from "./HomePageReducer";
import { SettingsPageReducer } from "./SettingsPageReducer";

const rootReducer = combineReducers({
    homePage: HomePageReducer,
    settingsPage: SettingsPageReducer
});

export default rootReducer;
