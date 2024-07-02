import { utilService } from "./util.service.js"
import fs from 'fs'
const bugs = utilService.readJsonFile('data/bug.json')
const PAGE_SIZE = 3
export const bugService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy = {}) {
    console.log(filterBy)
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.minSev) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSev)
            }
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE // 0 , 3
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            if (filterBy.sortBy) {
                if (filterBy.sortBy === 'Severity') {
                    bugs.sort((a, b) => a.severity - b.severity)
                }
                if (filterBy.sortBy === 'Text') {
                    bugs.sort((a, b) => a.title.localeCompare(b.title))
                }
                if (filterBy.sortBy === 'CreatedAt') {
                    bugs.sort((a, b) => a.createdAt - b.createdAt)
                }
            }
            if (filterBy.dir === 'up') {
                console.log('hi')
                bugs = bugs.reverse()
            }
            if (filterBy.dir === 'down') {
                console.log('hi')
                bugs = bugs.reverse()
            }
            return bugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    console.log(bugs)
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile().then(() => `car (${bugId}) removed!`)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}
function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}