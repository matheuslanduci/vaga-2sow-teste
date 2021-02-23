import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import routes from "../constants/routes";

import Login from "../pages/Login";

export default function Public() {
  return (
    <Router>
      <Switch>
        <Route exact path={routes.HOME} component={Login} />
        <Redirect from="*" to={routes.HOME} />
      </Switch>
    </Router>
  );
}
