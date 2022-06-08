let selectInput = document.getElementById('classes_d')
const apiClasses = 'https://api.dofusdb.fr/breeds?_id='
var i = 0
var f = 0
class Spell {
    constructor (name, cooldown){
        this.name = name 
        this.cooldown = cooldown
    }
}

selectInput.addEventListener('change', () => {
    let input = selectInput.options[selectInput.selectedIndex].value
    if(input === '#')return;
    let divAppend = document.querySelector('.selectedClasses')
    let newApi = apiClasses + input
    fetch(newApi).then(response => response.json()).then(res => {
        // building the character div  
        if(divAppend.childElementCount >= 3){
            alert("T'as que 3 adversaires !")
            return;
        }else{
            i = i + 1
            let template = document.getElementById('template_class')
            let clone = document.importNode(template.content, true)
            let class_name = clone.querySelector('.class_name')
            let spells = getSpells(res.data[0].breedSpellsId)
            let input = clone.querySelector('.spell_research')
            let resSelect = clone.querySelector('.search_result')
            resSelect.classList.add('id_search_'+i)
            input.classList.add('id_'+i)
            class_name.textContent = res.data[0].shortName.fr
            input.addEventListener('input',() => {
                if(input.classList.contains('id_1')){
                    getSelectInput(1,spells)
                }else if (input.classList.contains('id_2')){
                    getSelectInput(2,spells)
                }else if (input.classList.contains('id_3')){
                    getSelectInput(3,spells)
                }
            })
            
            divAppend.appendChild(clone)
        }
    })
})
/**
 * get the right select input & text input to permit search
 * @param {*} spells 
 * @returns 
 */
function getSelectInput(id,spells){
    let input = document.querySelector('.id_'+id).value.toLowerCase()
    let select = document.querySelector('.id_search_'+id)
    printSearch(getSearchBar(spells,input),select) 
}

/**
 * @param {JSON} spells - JSON 
 * @returns 
 */
function getSpells(spells){
    const getSpells = "https://api.dofusdb.fr/spell-variants/?spellIds="
    const getCooldowns = "https://api.dofusdb.fr/spell-levels?spellId="
    let spellsClean = new Array();
    spells.forEach( spell => {
        fetch(getSpells+spell).then(response => response.json()).then(res => {
            let spellsVar = res.data[0].spells
            for(let i = 0; i < spellsVar.length; i++){  
                let spellGrade = getGradeSpell(spellsVar[i])
                let spellObject = new Spell() 
                spellObject.name = spellsVar[i].name.fr
                fetch(getCooldowns+spellsVar[i].id+"&grade="+spellGrade).then(response => response.json()).then(result => {
                    let cdSpell = result.data[0].minCastInterval
                    spellObject.cooldown  = cdSpell
                })
                spellsClean.push(spellObject)
            }
            
        })
    })

    return spellsClean;
}

/**
 * 
 * @param {Array} spells 
 * @param {String} input_value
 * @returns 
 */
function getSearchBar(spells, value){
    let tab2 = []
    if (value.length > 0){
        spells.forEach(spell => {
            if(spell.name.toLowerCase().includes(value)){
                tab2.push(spell);
            }
        })
    }else{
        tab2 = spells;
    }
    return tab2;
}

/**
 * Sending data into options template
 * @param {*} spells Array of spells 
 * @param {*} select HTML Element <select>
 */
function printSearch(spells, select){
    if(select.childElementCount > 1){
        while(select.firstChild && select.firstChild.value != '#'){
            select.removeChild(select.lastChild)
        }
    }
    let optBase = document.createElement('option')
    optBase.value = "#"
    optBase.textContent = "Sorts : "
    select.appendChild(optBase)
    spells.forEach((spell) => {
        let opt = document.createElement('option')
        opt.classList.add('spell_list')
        opt.textContent = spell.name
        opt.value = spell.name
        opt.id = spell.cooldown
        select.appendChild(opt)
    })
    
    printArray(select)
}
/**
 * print a template into the tbody (tr -> td)
 * @param {HTMLElement} select Select HTML Element
 */
function printArray(select){
    
    select.addEventListener('change', (event)=> {   
        let spell = select.options[select.selectedIndex].value
        if(spell === '#') return;
        let spellCd = select.options[select.selectedIndex].id
        let tab = document.querySelector('.tab')
        let template = document.getElementById('template_tab')
        let clone = template.content.cloneNode(true)
        let tr = clone.querySelector('tr')
        let td = clone.querySelectorAll('td')
        let inputTurn = document.createElement('input')
        let tab_spell = document.getElementById("tab_body")
        tr.id = 'row_'+f
        inputTurn.type = 'number'
        inputTurn.id = 'input_turn_'+f
        td[0].textContent = spell
        td[1].appendChild(inputTurn)
        // deleting row
        td[4].addEventListener('click', ()=> {
            if(confirm()){
                while(tr.firstChild){
                    tr.removeChild(tr.lastChild)
                }
            }
        })
        // Event listener about the input of the turn by the user
        inputTurn.addEventListener('input',(event) => {
            td[3].innerHTML = +event.srcElement.value + +select.options[select.selectedIndex].id
            if(event.data === null){
                td[3].textContent =''
            }if(spellCd = 0){
                td[3].textContent = '0'
            }
        })
        f++
        tab_spell.appendChild(clone)
        tab.style.display = 'block'
    })

}

function getGradeSpell(spell){
    return spell.spellLevels.length
}

function printStart(spells,select){
    console.log(spells[1])
    for(let i = 0 ; i < spells.length; i++){
        console.log(spells[i])
    }
}