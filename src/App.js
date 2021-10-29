import { BrowserRouter, Switch } from "react-router-dom";
import GlobalStyles from "./Styling/GlobalStyles";
import Login from "./Containers/LogIn";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <GlobalStyles />
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Switch>
          <Login />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
