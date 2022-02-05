import Notiflix from 'notiflix';
import {mypromise} from "./js/fetchCountries";
import './css/styles.css';
var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const inputBox = document.querySelector("#search-box");
inputBox.addEventListener('input', debounce(start, DEBOUNCE_DELAY));
const refSearchWindow = document.querySelector('.country-list');


function start(data){
    let searchData = data.target.value.trim();
    if (searchData === ''){
        clearWindowIfSearchEmpty();
        return
    }
    mypromise(searchData).then(res => 
        {
            const length = res.length;
            if (length === 1){
                generateOneMarkup(res);
            return
            }
            if (length > 1 && length <=10){
                generateManyMarkups(res)
                return
            }
            clearWindowIfSearchEmpty();
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
        ).catch(err => 
            {
                Notiflix.Notify.failure('Oops, there is no country with that name')
                clearWindowIfSearchEmpty();
            });
};


function generateManyMarkups(res){
    const markupForOne = res.map(elem => {

    return `<li class="country__item">
    <div class="country-header">
    <img class="flag-pic"
     src="${elem.flags[0]}"
     alt="flag">
    <span class="country-name">${elem.name.official}</span>
    </div>
    </li>`;
}).join("");

refSearchWindow.innerHTML = markupForOne;
}

function generateOneMarkup(res){
    const markupForAll = res.map(elem => {
        let usedLangs = '';
        const pickLangs = Object.values(elem.languages);
        pickLangs.forEach(value => {
            usedLangs += value + " ";
          })
        return `<li class="country__item">
        <div class="country-header">
        <img class="flag-pic"
         src="${elem.flags[0]}"
         alt="flag">
        <span class="country-name">${elem.name.official}</span>
        </div>
        <span class="capital-name">Capital: ${elem.capital}</span>
        <span class="population-count">Population: ${elem.population}</span>
        <span class="languages">Languages: ${usedLangs}</span>
        </li>`;
    }).join("");
    refSearchWindow.innerHTML = markupForAll;
}

function clearWindowIfSearchEmpty(){
    refSearchWindow.innerHTML = "";
}