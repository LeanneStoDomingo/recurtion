import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import { Login, Signup, Dashboard } from './pages'

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/signup' component={Signup} />
            </Switch>
        </Router>
    );
}

export default App;
