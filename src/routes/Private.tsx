import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import routes from "../constants/routes";

import List from "../pages/List";
import AddUser from "../pages/AddUser";

import Header from "../components/Header";

export default function Private() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path={routes.HOME} component={List} />
        <Route path={routes.ADD_USER} component={AddUser} />
        <Redirect from="*" to={routes.HOME} />
      </Switch>
    </Router>
  );
}
