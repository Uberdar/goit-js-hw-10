import Notiflix from 'notiflix';
import {mypromise} from "./js/fetchCountries";
import './css/styles.css';
var debounce = require('lodash.debounce');
const MSG_MANY = 'Too many matches found. Please enter a more specific name.';
const MSG_FAIL = 'Oops, there is no country with that name';
const DEBOUNCE_DELAY = 300;
const inputBox = document.querySelector("#search-box");
inputBox.addEventListener('input', debounce(start, DEBOUNCE_DELAY));
const refSearchWindow = document.querySelector('.country-list');


function start(data){
    let searchData = data.target.value.trim();
    if (!searchData){
        updateMarkup();
        return
    }
    mypromise(searchData).then(res => 
        {
            const length = res.length;
            if (length === 1){
               const markVar = generateOneMarkup(res);
               updateMarkup(markVar);
            return
            }
            if (length > 1 && length <=10){
                const markVar = generateManyMarkups(res)
                updateMarkup(markVar);
                return
            }
            updateMarkup();
            showMsgUser('info',MSG_MANY);
        }
        ).catch(err => 
            {
                showMsgUser('failure',MSG_FAIL);
                updateMarkup();
            });
};


function generateManyMarkups(res = []){
    return res.map(({flags, name:{official}}) => {
    return `<li class="country__item">
    <div class="country-header">
    <img class="flag-pic"
     src="${flags[0]}"
     alt="flag">
    <span class="country-name">${official}</span>
    </div>
    </li>`;
}).join("");
}

function generateOneMarkup(res = []){
    return res.map(({flags, name:{official}, capital,population,languages}) => {
        const pickLangs = Object.values(languages);
        return `<li class="country__item">
        <div class="country-header">
        <img class="flag-pic"
         src="${flags[0]}"
         alt="flag">
        <span class="country-name">${official}</span>
        </div>
        <span class="capital-name">Capital: ${capital}</span>
        <span class="population-count">Population: ${population}</span>
        <span class="languages">Languages: ${pickLangs.join(', ')}</span>
        </li>`;
    }).join("");

}

function updateMarkup(markForAll = ''){
    refSearchWindow.innerHTML = markForAll;
}

function showMsgUser(method = 'info',msg = ''){
    Notiflix.Notify[method](msg);
}