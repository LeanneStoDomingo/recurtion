import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import { Login, Signup, Dashboard, Home, ForgotPassword, ResetPassword } from './pages'
import { ProtectedRoute, RedirectRoute } from './utils';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <ProtectedRoute exact path='/dashboard' component={Dashboard} />
                <RedirectRoute exact path='/login' component={Login} />
                <RedirectRoute exact path='/signup' component={Signup} />
                <RedirectRoute exact path='/forgot-password' component={ForgotPassword} />
                <ProtectedRoute exact path='/reset-password/:token' component={ResetPassword} />
            </Switch>
        </Router>
    );
}

export default App;
