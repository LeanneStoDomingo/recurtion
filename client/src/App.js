import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import { Login, Signup, Dashboard, Home, ForgotPassword } from './pages'

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/forgot-password' component={ForgotPassword} />
            </Switch>
        </Router>
    );
}

export default App;
