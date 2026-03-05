const gridEl = document.getElementById("grid");
const emptyEl = document.getElementById("empty"); 

// Fonction qui renvoie la traduction française de l'attribut "région" d'un pays, passé en paramètre
function regionFr(r) {
  return {
    Africa: "Afrique",
    Americas: "Amériques",
    Asia: "Asie",
    Europe: "Europe",
    Oceania: "Océanie"
  }[r] || r
}

// Fonction qui formate un nombre selon la convention française
function fmt(n) {
  return new Intl.NumberFormat("fr-FR").format(n)
}

// Fonction qui renvoie une chaîne de caractères listant les noms des devises d'un pays, passé en paramètre
function getCurrencies(c) {
  if (!c.currencies) return "—";
  return [...new Set(Object.values(c.currencies).map(v => v.name))].join(", ");
}

// Fonction qui affiche la liste des pays dans la grille
function render(list) {
  gridEl.innerHTML = "";
  if (!list.length) {
    emptyEl.style.display = "block";
    emptyEl.textContent = "Aucun résultat.";
    return;
  }
  emptyEl.style.display = "none";
  
  list.forEach(c => createCard(c));
}

// Fonction qui vérifie si la sous-chaîne 'sub' est contenue dans la chaîne 'str', sans tenir compte des majuscules
function contientSousChaine(str, sub) {
  console.log(str, sub);
  return str.toLowerCase().includes(sub.toLowerCase());
}

// Fonction de filtrage de la liste des pays
function filtrage() {
  let list = allCountries;

  // Filtrage en fonction de la chaîne saisie dans le champ de recherche
  if (regionEl.value) list = list.filter(c => c.region === regionEl.value);

  // Filtrage en fonction de la région sélectionnée dans la liste déroulante
  if (qEl.value) list = list.filter(c => contientSousChaine(c.name.common, qEl.value));

  list.sort((a, b) => getName(a).localeCompare(getName(b), "fr"));
  render(list);
}

// Variable globale contenant la liste de tous les pays
let allCountries = [];

/******** A COMPLETER CI-DESSOUS ********/

const url="https://restcountries.com/v3.1/independent?fields=name,capital,population,region,flags,area,curriences,tld,translations"

function createCard(dataPays){
  let template=document.querySelector("#mon-template");
  let clone =document.importNode(template.content,true);

  newContent=clone.firstElementChild.innerHTML
  .replace(/{{src-image}}/g, dataPays.flags.png)
  .replace(/{{alt-image}}/g, dataPays.flags.alt)
  .replace(/{{nom-pays}}/g, dataPays.translations.fra.common)

  clone.firstElementChild.innerHTML=newContent;
  document.getElementById("grid").appendChild(clone);
}

async function init() {              /******** question9 et 10 ********/
  const reponse = await fetch(url)    
  const data = await reponse.json(); 
  console.log(data)
  allCountries = data 
  render(allCountries);
}

init();

document.getElementById("my-input").addEventListener("input", filtrage);
document.getElementById("liste-pays").addEventListener("change", filtrage);
document.getElementById("bouton").addEventListener("click", filtrage);

function reinitialiser() {
  document.getElementById("my-input").value = ""
  document.getElementById("liste-pays").value = ""
  filtrage()
}