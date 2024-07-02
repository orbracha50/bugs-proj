import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { title, minSev } = filterByToEdit

    return (
        <section className="bugs-filter">
            <h2>Filter Our bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">title</label>
                <input value={title} onChange={handleChange} name="title" type="text" id="title" />

                <label htmlFor="minSpeed">Min sevetity</label>
                <input value={minSev || ''} onChange={handleChange} name="minSev" type="number" id="minSev" />

                <button>Submit</button>
            </form>
        </section>
    )
}