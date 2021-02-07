import React, {Component} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import SearchResult from './SearchResult'
import Loader from './Loader'

import {Link} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

// Código terminado. No tiene las mejores prácticas pero funciona. 

// Falta un Loader. 
// Falta onClick en cada SearchResult. Pero se maneja en SearchResult.jsx. 
// Falta onClick en LoadMoreResults. Este sí se tiene que manejar desde acá. 
// Además posiblemente falte la API para mostrar los resultados. 

const SEARCH_BOX_CLOSED_WIDTH = '50px';
const SEARCH_BOX_HEIGHT = '50px';
//const SEARCH_BOX_OPEN_WIDTH = '80vw';
const SEARCH_RESULTS_MIN_HEIGHT = '100px';
const SEARCH_RESULTS_MAX_HEIGHT = '300px';

const Wrapper = styled.div`
  
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${SEARCH_BOX_CLOSED_WIDTH};
    max-width: 500px;
    transition: all 1s;
    display: flex;
    align-items: center;
    justify-content: center;

    & > input {
    position: absolute;
    width: calc(100% - ${SEARCH_BOX_CLOSED_WIDTH} / 2);
    left: 0;
    height: ${SEARCH_BOX_HEIGHT};
    outline: none;
    border: none;
    background: #0a445f;
    color: white;
    font-size: 1.5rem;
    padding: 0 10px;
    opacity: 0;
    transition: all 1s;
    border-radius: 10px;
    box-shadow: black 5px 5px 15px;
    }

    & button {
    position: absolute;
    right: 0;
    width: ${SEARCH_BOX_CLOSED_WIDTH};
    height: ${SEARCH_BOX_HEIGHT};
    background: #0099ff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    transition: all 0.4s;
    border-radius: 10px;
    outline: none;
    border: 0px;
    box-shadow: black 5px 5px 15px;
    }
  

& button:hover {
  background: #00568f;
  transition: all .5s;
}

& > div {
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  top: calc(${SEARCH_BOX_HEIGHT} / 2);
  left: 0;
  background-color: #0F6A95;
  border-radius: 0 0 10px 10px;
  padding: 20px;
  z-index: -1;
  width: 100%;
  transition: all 1s ease 0s;
  min-height: ${SEARCH_RESULTS_MIN_HEIGHT};
  max-height: ${SEARCH_RESULTS_MAX_HEIGHT};
  flex-direction: column;
  box-shadow: black 5px 5px 15px;
}

& > div ul {
  overflow: auto;
  width: 100%;
  & .no-results {
        width: 90%;
        height: 8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        @media screen and (max-width: 640px) {
            height: 6rem;
        }
        & div {
            height: 6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #0099ff;
            border-radius: 15px;
            outline: none;
            border: 0px;
            @media screen and (max-width: 640px) {
                height: 4rem;
            }
            & p {
                font-family: "Racing Sans One", Arial, Helvetica, sans-serif;
                color: white;
                font-size: 2rem;
                margin: 0 2rem 0 2rem;
                @media screen and (max-width: 640px) {
                    font-siZe: 2rem;
                }
                @media screen and (max-width: 400px) {
                    font-siZe: 1.75rem;
                }
            }
        }
    }
}

/*Scrollbar Styles*/
& > div ul::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
& > div ul::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}
& > div ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
`

const LoadMoreResults = styled.li`
    background-color: #093048;
    cursor: pointer;
    width: 95%;
    padding: 10px;
    border-radius: 10px;
    margin: 5px;
    display: flex;
    align-items: center;
    font-family: 'Roboto';
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    & p {
        margin: 0;
        color: white;
        text-align: center;
        font-weight: 800;
    }
    &:hover {
        background-color: #ffffff;
        transition: 0.5s;
        & p {
            color: black;
        }
    }
`

const SegmentedControl = styled.div`
    position: relative;
    background-color: #093048;
    z-index: 5;
    width: 90%;
    max-width: 500px;
    margin-bottom: 10px;
    height: 30px;
    border-radius: 10px;
    display: none;
    & input {
    display: none;
    }
    .background,
    & label {
    width: 50%;
    height: 100%;
    text-align: center;
    display: inline-block;
    padding-top: 10px;
    //margin-right: -3px;
    z-index: 2;
    cursor: pointer;
    //outline: 1px solid green;
    }
    & .background {
    background-color: #0099ff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    }
    & > input.one:checked ~ .background {
    transform: translateX(0);
    transition: transform 0.5s ease-in-out, border-radius 0.5s;
    border-radius: 10px 0 0 10px;
    }
    & > input.two:checked ~ .background {
    transform: translateX(100%);
    transition: transform 0.5s ease-in-out, border-radius 0.5s;
    border-radius: 0 10px 10px 0;
    }
    & input.three:checked ~ .background {
    transform: translateX(241px);
    transition: transform 0.5s ease-in-out;
    }
`

class Searchbox extends Component {
    constructor(props) {
        super(props)

        this.moviesRadioInput = React.createRef();
        this.tvRadioInput = React.createRef();
        this.searchBoxSegmentedControl = React.createRef();
        this.searchBoxInput = React.createRef();
        this.wrapperRef = React.createRef();
        // searchBox. className='search-box'
        // input. searchBox.children[1]
        // button. searchBox.children[2]
        // parent. searchBox.parentElement. 
        // button.firstElementChild. Al ser un button no hace falta.
        // this.searchBoxSegmentedControl.current.children[0, 1, 2, 3]
        // header. searchBox.parentElement.parentElement.parentElement.parentElement
        // wrapper. searchBox.parentElement.
        // searchResults. searchBox.children[0]
        // segmentedControl. searchResults.children[0]
        // El problema es que algunos no están en el Componente.
        // Header y Wrapper son los problemas. 

        this.state = {
            openSearch: false,
            openResults: false,
            resultsData: {},
        }

        this.onClickButton = this.onClickButton.bind(this)
        this.onChangeInput = this.onChangeInput.bind(this)
        this.delayTimer = undefined
        this.doSearch = this.doSearch.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.closeSearchBox = this.closeSearchBox.bind(this);
    }

    doSearch(searchURL) {
        console.log('pre', this.delayTimer)
        clearTimeout(this.delayTimer);
        console.log('post', this.delayTimer)
        this.delayTimer = setTimeout(() => {
            axios.get(searchURL).then(response => {
                this.setState({
                    resultsData: response.data
                })
            })
        }, 1000); // Will do the ajax stuff after 1000 ms, or 1 s
    }

    onClickButton(e) {
        console.log('click in btnnn')
        this.searchBoxInput.current.focus()
        this.setState({
            openSearch: true,
        })
    }

    // Vamos a mostrar 15 resultados. La petición nos entrega responde.data.total_results si este es 16 o más entonces mostrar el Load More
    onChangeInput(e) {
        if(this.searchBoxInput.current.value.length >= 2) {
            this.setState({
                resultsData: {}
            })
            let mediaType
            if(this.moviesRadioInput.current.checked === true) {
                mediaType = 'movie'
            } else {
                mediaType = 'tv'
            }
            const searchValue = this.searchBoxInput.current.value.trim().toLowerCase().replace(/ /g, '+')
            const searchURL = `https://api.themoviedb.org/3/search/${mediaType}?api_key=81d1f6291941e4cbb7818fa6c6be6f85&language=en-US&query=${searchValue}`
            this.doSearch(searchURL)
            this.setState({
                openResults: true,
            })
        } else {
            this.setState({
                openResults: false,
            })
        }
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({
                openSearch: false,
                openResults: false,
            })
        }
    }

    closeSearchBox() {
        this.setState({
            openSearch: false,
            openResults: false,
        })
    }

    componentDidMount() {
        const searchBox = document.getElementsByClassName('search-box')[0];
        const input = searchBox.children[1];
        const button = searchBox.children[2];
        searchBox.parentElement.style.position = 'relative'
        
        document.addEventListener('mousedown', this.handleClickOutside);

        // Close Searchbox if click outside
        /* document.addEventListener('click', (e) => {
            console.log(e.target)
            console.log(this.searchBoxSegmentedControl.current)
            console.log(this.searchBoxSegmentedControl.current.children)
            if (e.target !== button && 
                e.target !== input && 
                e.target !== button.firstElementChild && 
                e.target !== this.searchBoxSegmentedControl.current &&
                e.target !== this.searchBoxSegmentedControl.current.children[0] &&
                e.target !== this.searchBoxSegmentedControl.current.children[1] &&
                e.target !== this.searchBoxSegmentedControl.current.children[2] &&
                e.target !== this.searchBoxSegmentedControl.current.children[3]
                ) {
                this.setState({
                    openSearch: false,
                    openResults: false,
                })
            }
        }); */

        // Assign distance between Searchbox and ScreenLeft
        this.distanceSearchBoxToScreenLeft = searchBox.getBoundingClientRect().left
        window.addEventListener('resize', () => {
            this.setState({
                openSearch: false,
                openResults: false,
            })
            if (this.state.openSearch !== true) {
                this.distanceSearchBoxToScreenLeft = searchBox.getBoundingClientRect().left
            }  
        })
    }

    componentDidUpdate() {
            const searchBox = document.getElementsByClassName('search-box')[0];
            const header = searchBox.parentElement.parentElement.parentElement.parentElement
            const wrapper = searchBox.parentElement
            const searchResults = searchBox.children[0];
            const segmentedControl = searchResults.children[0];
            const input = searchBox.children[1];
            const button = searchBox.children[2];
            const move = () => {
                header.style.position = 'static'
                wrapper.style.position = 'relative'
            }
            if (this.state.openSearch === true) {
                if(window.innerWidth > 625) {
                    // 500 = Searchbox.maxWidth | 625 = 500/0.8
                    //searchBox.style.transform = `translateX(-${this.distanceSearchBoxToScreenLeft+25-window.innerWidth/2+500/2}px)`
                } else {
                    //searchBox.style.transform = `translateX(-${this.distanceSearchBoxToScreenLeft+25-window.innerWidth/2+window.innerWidth*0.8/2}px)`
                }
                header.style.position = 'relative'
                wrapper.style.position = 'static'
                searchBox.style.width = '80vw';
                input.style.opacity = '1';
                searchBox.style.zIndex = '1';
                searchResults.style.display = 'flex';
            } else {
                setTimeout(() => move(), 500)
                searchResults.style.display = 'none';
                searchBox.style.zIndex = 'auto';
                searchBox.style.transform = 'translateX(-50%)'
                searchBox.style.width = '50px';
                input.style.opacity = '0';
                input.value = '';
            }
            if (this.state.openResults === true){
                searchResults.style.opacity = '1';
                searchResults.style.minHeight = '100px';
                searchResults.style.maxHeight = '300px';
                searchResults.style.zIndex = '5';
                segmentedControl.style.display = 'block';
                input.style.borderBottomLeftRadius = '0';
                button.style.borderRadius = '0 10px 0 0';
                button.style.transition = '0.5s';
            } else {
                searchResults.style.opacity = '0';
                searchResults.style.minHeight = '0px';
                searchResults.style.maxHeight = '0px';
                searchResults.style.zIndex = '-1';
                segmentedControl.style.display = 'none';
                input.style.borderBottomLeftRadius = '10px';
                button.style.borderRadius = '10px';
            }
     }

    render() {
        return (
            <Wrapper className="search-box" ref={this.wrapperRef}>
                <div>
                    <SegmentedControl className="segmented-control" ref={this.searchBoxSegmentedControl}>
                        <input className='one' type="radio" id="movies-searchbox" name="mediatype-searchbox" value="movies-searchbox" ref={this.moviesRadioInput} defaultChecked={true} onChange={() => this.onChangeInput()}/>
                        <label className='one' htmlFor="movies-searchbox">Movies</label>
                        <input className='two' type="radio" id="tv-searchbox" name="mediatype-searchbox" value="tv-searchbox" ref={this.tvRadioInput} onChange={() => this.onChangeInput()}/>
                        <label className='two' htmlFor="tv-searchbox">TV Shows</label>
                        <div className='background'></div>
                    </SegmentedControl>
                    <ul>
                        {this.state.resultsData.results === undefined 
                        ? <Loader/> 
                        
                        : this.state.resultsData.results.slice(0, 15).map(e =>
                            <SearchResult
                                title={e.title === undefined ? e.name : e.title}
                                year={e.release_date === undefined ? e.first_air_date === undefined ? '' : e.first_air_date.slice(0,4) : e.release_date.slice(0,4)}
                                link={e.title === undefined ? `/media/tv/${e.id}` : `/media/movie/${e.id}`}
                                key={e.id === undefined ? '' : e.id}
                                propsOnClick={this.closeSearchBox}
                            />
                        )}
                        {this.state.resultsData.total_results === undefined ? '' : this.state.resultsData.total_results >= 16 
                        ? <Link to={`/db/search/${this.moviesRadioInput.current.checked === true ? 'movie' : 'tv'}/${this.searchBoxInput.current.value.trim().toLowerCase().replace(/ /g, '+')}`}>
                            <LoadMoreResults onClick={this.closeSearchBox}><p>Load More ></p></LoadMoreResults>
                        </Link>
                        : ''
                        }
                        {this.state.resultsData.results === undefined ? '' : this.state.resultsData.results.length === 0
                            ? 
                            <div className='no-results'>
                                <div>
                                    <p>No results found</p>
                                </div>
                            </div>
                            : ''
                        }
                    </ul>
                </div>
                <input onChange={this.onChangeInput} ref={this.searchBoxInput} type="text" placeholder="Search by name..."/>
                <button onClick={this.onClickButton}><FontAwesomeIcon icon={faSearch} /></button>
            </Wrapper>
        )
    }
}

export default Searchbox