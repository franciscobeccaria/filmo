import React from 'react'

const Header = () => (
    <header>
        <div>
            <h1>MovieSearcher</h1>
        </div>
        <nav>
            <ul>
                <li>
                    <Searcher/>
                </li>
                <li>Login</li>
                <li>My Lists</li>
                <li>My User</li>
            </ul>
        </nav>
    </header>
)

export default Header