import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Admin from './pages/Admin';
import Menu from './pages/Menu';
import OrderList from './pages/OrderList';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/menu" component={Menu} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/orders" component={OrderList} />
      </Switch>
    </Router>
  );
}

export default App;