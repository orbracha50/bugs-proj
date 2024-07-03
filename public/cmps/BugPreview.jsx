

export function BugPreview({ bug }) {
    console.log(bug)
    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <h1>owner: {bug.creator.fullname}</h1>
    </article>
}