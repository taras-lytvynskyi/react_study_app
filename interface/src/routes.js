import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./components/login/login.js";
import Registration from "./components/registration/registration";
import Home from "./components/home/home"
import Classes from "./components/classes/classes"
import CreateClasses from "./components/classes/crate_classes"
import AboutClass from "./components/classes/about_class"
import ConnecteToClass from "./components/connect/connect_to_class"

export const useRoutes = (isAuthenticated) => {
  if(isAuthenticated){
    return(
    <Switch>
      <Route path = "/" exact>
        <Home></Home>
      </Route>
      <Route path = "/classses">
        <Classes></Classes>
      </Route>
      <Route path = "/create_classes">
        <CreateClasses></CreateClasses>
      </Route>
      <Route path="/aboutclass/:id">
          <AboutClass></AboutClass>
      </Route>
      <Route path = "/connect_to_class">
          <ConnecteToClass></ConnecteToClass>
      </Route>
      <Redirect to = "/"></Redirect>
    </Switch>
    )}
  else{
  return (
    <Switch>
      <Route path="/" exact>
        <Login></Login>
      </Route>
      <Route path="/registration" exact>
        <Registration></Registration>
      </Route>
      <Redirect to="/"></Redirect>
    </Switch>
  );
}};