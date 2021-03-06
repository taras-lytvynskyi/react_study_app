import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./components/login/login.js";
import Registration from "./components/registration/registration";
import Home from "./components/home/home"
import Classes from "./components/classes/classes"
import Forgot from "./components/login/forgot"
import Test from "./components/test/test"
import BuyingPage from "./components/pro/buying_page"
import CreateClasses from "./components/classes/crate_classes"
import AboutClass from "./components/classes/about_class"
import ConnecteToClass from "./components/connect/connect_to_class"
import Profile from "./components/user/profile"
import ProfileEditor from "./components/user/profile_editor"
import AboutTasks from './components/tasks/tasks'

export const useRoutes = (isAuthenticated) => {
  if(isAuthenticated){
    return(
    <Switch>
      <Route path = "/" exact>
        <Home></Home>
      </Route>
      <Route path = "/classses">
        <CreateClasses></CreateClasses>
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
      <Route path = "/profile">
          <Profile></Profile>
      </Route>
      <Route path = "/user_edit">
          <ProfileEditor></ProfileEditor>
      </Route>
      <Route path="/abouttask/:id">
          <AboutTasks></AboutTasks>
      </Route>
      <Route path = "/buying">
        <BuyingPage></BuyingPage>
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
      <Route path ="/test">
        <Test></Test>
      </Route>
      <Route path = "/forgot">
        <Forgot></Forgot>
      </Route>
      <Redirect to="/"></Redirect>
    </Switch>
  );
}};