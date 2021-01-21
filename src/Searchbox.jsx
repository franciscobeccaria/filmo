import React, {Component} from 'react'
import styled from 'styled-components'
import SearchResult from './SearchResult'

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

    & input {
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

class Searchbox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            openSearch: false,
            openResults: false,
        }

        this.onClickButton = this.onClickButton.bind(this)
        this.onChangeInput = this.onChangeInput.bind(this)
    }

    onClickButton(e) {
        this.setState({
            openSearch: true,
        })
    }

    onChangeInput(e) {
        if(e.target.value !== '') {
            this.setState({
                openResults: true,
            })
        } else {
            this.setState({
                openResults: false,
            })
        }
    }

    componentDidMount() {
        const searchBox = document.getElementsByClassName('search-box')[0];
        const input = searchBox.children[1];
        const button = searchBox.children[2];
        searchBox.parentElement.style.position = 'relative'
        
        // Close Searchbox
        document.addEventListener('click', (e) => {
            if (e.target !== button && e.target !== input && e.target !== button.firstElementChild) {
                this.setState({
                    openSearch: false,
                    openResults: false,
                })
            }
        });

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
            const searchResults = searchBox.children[0];
            const input = searchBox.children[1];
            const button = searchBox.children[2];
            if (this.state.openSearch === true) {
                if(window.innerWidth > 625) {
                    // 500 = Searchbox.maxWidth | 625 = 500/0.8
                    searchBox.style.transform = `translateX(-${this.distanceSearchBoxToScreenLeft+25-window.innerWidth/2+500/2}px)`
                } else {
                    searchBox.style.transform = `translateX(-${this.distanceSearchBoxToScreenLeft+25-window.innerWidth/2+window.innerWidth*0.8/2}px)`
                }
                searchBox.style.width = '80vw';
                input.style.opacity = '1';
                searchBox.style.zIndex = '1';
                searchResults.style.display = 'flex';
            } else {
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
                input.style.borderBottomLeftRadius = '0';
                button.style.borderRadius = '0 10px 0 0';
                button.style.transition = '0.5s';
            } else {
                searchResults.style.opacity = '0';
                searchResults.style.minHeight = '0px';
                searchResults.style.maxHeight = '0px';
                searchResults.style.zIndex = '-1';
                input.style.borderBottomLeftRadius = '10px';
                button.style.borderRadius = '10px';
            }
     }

    render() {
        return (
            <Wrapper className="search-box">
                <div>
                    <ul>
                        <SearchResult title="Soul" />
                        <SearchResult title="Star Wars"/>
                        <SearchResult title="Fast and Furious"/>
                        <SearchResult title="San Francisco, California"/>
                        <SearchResult title="Startrek"/>
                        <SearchResult title="The Simpsons"/>
                        <SearchResult title="Modern Family"/>
                        <SearchResult title="The Good Place"/>
                        <SearchResult title="Time"/>
                        <LoadMoreResults><p>Load More ></p></LoadMoreResults>
                    </ul>
                </div>
                <input onChange={this.onChangeInput} type="text" placeholder="Search city by name..."/>
                <button onClick={this.onClickButton}><FontAwesomeIcon icon={faSearch} /></button>
            </Wrapper>
        )
    }
}

export default Searchbox