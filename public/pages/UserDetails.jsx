const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM
const { Link, NavLink } = ReactRouterDOM
import { userService } from "../services/user.service.js"

export function UserDetails() {

    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function onBack() {
        navigate('/')
    }

    if (!user) return <div>Loading...</div>
    console.log(user)
    return <section className="user-details">
        {user.isAdmin === true &&<Link to ='/users'> users </Link>}
        <h1>User {user.fullname}</h1>
        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>
        <button onClick={onBack} >Back</button>
    </section>
}