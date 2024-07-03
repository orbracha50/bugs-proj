import { userService } from "../services/user.service.js"
const { useState, useEffect } = React
export function UserIndex() {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [users])

    function loadUsers() {
        userService.query().then(setUsers)
    }
    if (!users) return
    return <section>
        {users.map((user) => (
            <section key={user._id}>
                <div>{user.fullname}</div>
                <button>x</button>
            </section>

        ))}
    </section>
}