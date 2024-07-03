import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy).then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bag description'),
        }
        bugService.save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug.data])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        console.log(bugToSave)
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug.data)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug.data._id ? savedBug.data : currBug
                )
                console.log(bugsToUpdate)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => {
            let nextPageIdx
            if (prevFilter.pageIdx !== undefined) nextPageIdx = 0
            return { ...prevFilter, ...filterBy, pageIdx: nextPageIdx }
        })
    }

    function togglePagination() {
        setFilterBy(prevFilter => {
            return { ...prevFilter, pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined }
        })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        // console.log('diff:', diff)
        setFilterBy(prevFilter => {
            let nextPageIdx = prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = Math.round((bugs.length - 1) / 3)
            if (nextPageIdx > ((bugs.length - 1) / 3)) nextPageIdx = Math.round((bugs.length - 1) / 3)
            return { ...prevFilter, pageIdx: nextPageIdx }
        })
    }
    function onChangeSorting({ target }) {
        setFilterBy(prevFilter => {
            return { ...prevFilter, sortBy: target.value }
        })
    }
    function onChangeDir() {
        setFilterBy(prevFilter => {
            return { ...prevFilter, dir: prevFilter.dir === 'up' ? 'down' : 'up' }
        })
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
            </section>
            <section>
                <button onClick={togglePagination} >Toggle Pagination</button>
                <button onClick={() => onChangePage(-1)}>-</button>
                {filterBy.pageIdx + 1 || 'No Pagination'}
                <button onClick={() => onChangePage(1)}>+</button>
                <select onChange={(target) => onChangeSorting(target)} id="cars" name="cars">
                    <option value="Text">Text</option>
                    <option value="Severity">Severity</option>
                    <option value="CreatedAt">Created-at</option>
                </select>
                <label htmlFor="">direction:</label>
                <input onClick={onChangeDir} type="checkBox" />

            </section>
            <main>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}

