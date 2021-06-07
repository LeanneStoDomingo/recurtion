import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import { Login, Signup, Dashboard, Home, ForgotPassword, ResetPassword } from './pages'

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/forgot-password' component={ForgotPassword} />
                <Route exact path='/reset-password/:token' component={ResetPassword} />
            </Switch>
        </Router>
    );
}

export default App;
