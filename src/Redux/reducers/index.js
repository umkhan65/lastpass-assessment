import { combineReducers } from "redux";
import encryptionReducer from "./encryptionReducer";

const rootReducer = combineReducers({
  encryption: encryptionReducer,
});

export default rootReducer;
