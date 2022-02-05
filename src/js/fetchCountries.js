export const mypromise = (search) => fetch(`https://restcountries.com/v3/name/${search}?fields=name,capital,population,languages,flags`)
.then(res => {
    if (res.ok){
    return res.json()
}
throw new Error(res.status);
});
