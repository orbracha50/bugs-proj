const { useState } = React

const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignUp.jsx'

export function AppHeader() {
	const navigate = useNavigate()
	const [user, setUser] = useState(userService.getLoggedinUser())

	function onLogout() {
		userService.logout()
            .then(() => onSetUser(null))
            .catch(err => showErrorMsg('OOPs try again'))
	}

	function onSetUser(user) {
		setUser(user)
		navigate('/')
	}


    return (
        <header className='container'>
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            {user ? (
				<section>
					<Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
					<button onClick={onLogout}>Logout</button>
				</section>
			) : (
				<section>
					<LoginSignup onSetUser={onSetUser} />
				</section>
			)}
            <h1>Bugs are Forever</h1>
        </header>
    )
}
