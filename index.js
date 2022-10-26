let arrayLength = 16

let array = new Array(arrayLength).fill(0).map((el, index) => el = index+1)
let sortedArray = new Array(arrayLength).fill(0).map((el, index) => el = index+1)
let matrix = []

let diceClassName = ''
let turns = 0
let seconds = 0
let isPlaying = false
let resultsList = []
let volume = false

if(localStorage.getItem('results')) {
    resultsList = JSON.parse(localStorage.getItem('results'))
}

function createContainer() {
    let container = document.createElement('div')
    container.className = 'main-container'
    document.body.append(container)
}

let mainContainer = document.getElementsByClassName('main-container')

createContainer()

function createField() {
    let field = document.createElement('div')
    field.className = 'field blocked'
    for(let i = 0; i< array.length; i++) {
        field.append(createDice(array[i]))
    }
    [...mainContainer][0].append(field)
    randomArray(array)
}

createPanel()
createField()

let field = Array.from(document.getElementsByClassName('field'))

function createDice(num) {
    let dice = document.createElement('button')
    diceClassName = `dice dice-${array.length}`
    dice.className = `dice dice-${array.length}`
    dice.id = num
    dice.textContent = num
    return dice
}

let nodes = Array.from(document.getElementsByClassName(diceClassName))

function createPanel() {
    let panel = document.createElement('div')
    panel.className = 'control-panel'
    panel.innerHTML = `     <div class="control-buttons-container">
                                <button class="control__button start-and-shuffle">Shuffle and start</button>
                                <button class="control__button save">Save</button>
                                <button class="control__button load">Load</button>
                                <button class="control__button results">Results</button>
                                <button class="control__button sound">Sound</button>
                            </div>
                            <div class="info-panel">
                                <div class="timer">Time: 00:00</div>
                                <div class="turns">Turns: 0</div>
                            </div>`
    document.body.prepend(panel)
}

function createDiffPanel() {
    let diffPanel = document.createElement('div')
    diffPanel.className = 'diff-panel'
    diffPanel.innerHTML = `<button class="diff diff-3">3x3</button>
                        <button class="diff diff-4">4x4</button>
                        <button class="diff diff-5">5x5</button>
                        <button class="diff diff-6">6x6</button>
                        <button class="diff diff-7">7x7</button>
                        <button class="diff diff-8">8x8</button>`
    document.body.append(diffPanel)
}

createDiffPanel()

let difficulty = Array.from(document.getElementsByClassName('diff'))

difficulty.forEach(el => el.addEventListener('click', (e)=> {
    if(e.target.closest('.diff-3')) {
        changeDiff(9)
    }
    if(e.target.closest('.diff-4')) {
        changeDiff(16)
    }
    if(e.target.closest('.diff-5')) {
        changeDiff(25)
    }
    if(e.target.closest('.diff-6')) {
        changeDiff(36)
    }
    if(e.target.closest('.diff-7')) {
        changeDiff(49)
    }
    if(e.target.closest('.diff-8')) {
        changeDiff(64)
    }
}))

function changeDiff(num){
    clearInterval(myInterval)
    turns = 0
    updateTurns()
    arrayLength = num;
    array = new Array(arrayLength).fill(0).map((el, index) => el = index+1);
    sortedArray = new Array(arrayLength).fill(0).map((el, index) => el = index+1);
    matrix = [];
    [...document.getElementsByClassName('field')][0].remove();
    createField()
    nodes = Array.from(document.getElementsByClassName(diceClassName))
    field = Array.from(document.getElementsByClassName('field'))
    createMatrix(array)
    field[0].addEventListener('mousedown', moveDices)
}


function loadGame(){
    console.log(localStorage);
    if(localStorage.getItem('savedGame')) {
        clearInterval(myInterval)
        turns = JSON.parse(localStorage.getItem('turns'))
        updateTurns()
        arrayLength = JSON.parse(localStorage.getItem('ArrayLength'));
        matrix = JSON.parse(localStorage.getItem('savedGame'))
        seconds = JSON.parse(localStorage.getItem('time'))
        console.log(arrayLength);
        array = new Array(arrayLength).fill(0).map((el, index) => el = index+1);
        sortedArray = new Array(arrayLength).fill(0).map((el, index) => el = index+1);
        [...document.getElementsByClassName('field')][0].remove();
        createField()
        nodes = Array.from(document.getElementsByClassName(diceClassName))
        field = Array.from(document.getElementsByClassName('field'))
        setDicePosition(matrix)
        field[0].addEventListener('mousedown', moveDices)
        field[0].classList.remove('blocked')
        console.log(true);
        stopwatch()
    } else {
        cPanel[0].classList.add('blocked')
        createNotification(false)
    }
}

field[0].addEventListener('mousedown', moveDices)

let manage = Array.from(document.getElementsByClassName('control-panel')) 

manage[0].addEventListener('click', (item)=> {
    if(item.target.closest('.start-and-shuffle')) {
        matrix = []
        randomArray(array)
        createMatrix(array)
        nodes.forEach(el => el.classList.add('animation'))
        setTimeout(() => {
            remover(nodes)
        }, 200);
        turns = 0
        isPlaying = true
        updateTurns()
        clearInterval(myInterval)
        seconds = 0
        stopwatch()
        field[0].classList.remove('blocked')
    }
    if(item.target.closest('.save')) {
        saveMatrixToLs(matrix)
    }
    if(item.target.closest('.load')) {
        isPlaying = true
        loadGame()
    }
    if(item.target.closest('.results')) {
        showResults(resultsList)
    }
    if(item.target.closest('.sound')) {
        mute(volume)
    }
})

function saveMatrixToLs(ar) {
    localStorage.setItem('savedGame', JSON.stringify(ar))
    localStorage.setItem('time', seconds)
    localStorage.setItem('turns', turns)
    localStorage.setItem('ArrayLength', arrayLength)
    console.log(localStorage);
}

function updateTurns() {
    Array.from(document.getElementsByClassName('turns'))[0].innerHTML = `Turns: ${turns}`
}

let myInterval

function stopwatch() {
    if(isPlaying){
        myInterval = setInterval(()=>{
            seconds++
            Array.from(document.getElementsByClassName('timer'))[0].innerHTML = `Time: ${calcDuration(seconds)}`
        }, 1000);
    }
}


function calcDuration(num) { 
    let sec = parseInt(num % 60);
    let min = Math.floor(num / 60);
    return `${min.toString().padStart(2, 0)}:${sec.toString().padStart(2, 0)}` || '00:00'
}

function createMatrix(arr) {
    let step = Math.sqrt(arr.length)
    for(let i = 0; i < arr.length; i += step) {
        matrix.push(arr.slice(i, i + step))
    }
    setDicePosition(matrix)
}
createMatrix(array)

function setDicePosition(matrix) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            const item = matrix[y][x]
            const node = nodes[item - 1]
            setDiceStyle(node, x, y)
        }
    }
    nodes[nodes.length-1].classList.add('hidden')
}

function setDiceStyle(node, x, y) {
    node.style.transform = `translate3D(${x * 100}%, ${y * 100}%, 0)`
}

function randomArray(arr) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

let droppable = true
let shiftX
let shiftY
let target

function moveDices(e) {
    shiftX = e.clientX - e.target.getBoundingClientRect().left
    shiftY = e.clientY - e.target.getBoundingClientRect().top
    let elemBelow
    target = e.target
    target.classList.add('animation')
    let number = +e.target.id
    let blank = array.length
    let moveCoords
    let isMoveValid
    const buttonCoords = findCoords(number, matrix)
    const blankCoords = findCoords(blank, matrix)
    const isValid = isValidForSwap(buttonCoords, blankCoords);
    
    function onMouseMovee(event) {
        target.classList.remove('animation')
        target.style.zIndex = 1000
        target.hidden = true
        elemBelow = +document.elementFromPoint(event.clientX, event.clientY).id;
        target.hidden = false
        moveAt(event.layerX, event.layerY, shiftX, shiftY, target);
        moveCoords = findCoords(elemBelow, matrix)
        droppable = false
        if(moveCoords) {
            isMoveValid = isValidForMove(moveCoords, blankCoords, number, blank);
        }
        // if(event.layerX < 0 || event.layerY <= 0 || event.layerX > field[0].offsetWidth || event.layerY > field[0].offsetWidth || elemBelow2) {
        // // if(elemBelow2) {
        //     event.target.classList.add('animation')
        //     // field[0].removeEventListener('mousemove', onMouseMove)
        //     field[0].removeEventListener('mousemove', onMouseMove)
        //     field[0].onmouseup = null
        //     target.onmouseup = null
        //     setDicePosition(matrix)
        //     setTimeout(() => {
            //         remover(nodes)
            //     }, 200);
            // }
        }
        
        if(number !== 0 && isValid) {
            field[0].addEventListener('mousemove', onMouseMovee )
            document.addEventListener('mousemove', removeListeners)
    }

    function removeListeners(e) {
        target.hidden = true
        let elemBelow2 = document.elementFromPoint(e.clientX, e.clientY) === document.body;
        target.hidden = false
    
        if(elemBelow2) {
            field[0].removeEventListener('mousemove', onMouseMovee)
            target.onmouseup = null
            field[0].onmouseup = null
            document.removeEventListener('mousemove', removeListeners)
            setDicePosition(matrix)
            droppable = true
            remover(nodes)

        }
    }

    target.onmouseup = function(ev) {
        field[0].removeEventListener('mousemove', onMouseMovee)
        if(number !== 0 && isMoveValid) {
            diceSwap(buttonCoords, blankCoords, matrix)
            setDicePosition(matrix)
            turns++
            updateTurns()
        }
        target.classList.add('animation')
        setDicePosition(matrix)
        if(number !== 0 && isValid && droppable) {
            diceSwap(buttonCoords, blankCoords, matrix)
            setDicePosition(matrix)
            turns++
            updateTurns()
        }
        droppable = true
        target.onmouseup = null
        document.removeEventListener('mousemove', removeListeners)
        setTimeout(() => {
            remover(nodes)
        }, 200);
    }
    field[0].onmouseup = function(){
        setTimeout(() => {
            remover(nodes)
        }, 200); 
        target.onmouseup = null
        field[0].onmouseup = null
    }
}

function findCoords(num, matrix) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            if(matrix[y][x] === num) {
                return {x, y} 
            }
        }
    }
}

function isValidForSwap(coords1, coords2) {
    const diffX = Math.abs(coords1.x - coords2.x)
    const diffY = Math.abs(coords1.y - coords2.y)
    return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y)
    // return true
}

function isValidForMove(coords1, coords2) {
    return coords1.x === coords2.x && coords1.y ===coords2.y
}

let cPanel = Array.from(document.getElementsByClassName('control-panel'))

function diceSwap(coords1, coords2, matrix) {
    let temp = matrix[coords1.y][coords1.x]
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x]
    matrix[coords2.y][coords2.x] = temp
    playAudio()

    if(isWon(matrix)) {
        cPanel[0].classList.add('blocked')
        createNotification(true)
        let today = new Date().toLocaleDateString()
        let result = {
            date: today,
            turns: turns + 1,
            seconds: calcDuration(seconds),
            length: arrayLength,
        }
        resultsList.push(result)
        localStorage.setItem('results', JSON.stringify(resultsList))
    }
}

function isWon(matrix) {
    let flatMatrix = matrix.flat()
    for(let i = 0; i < sortedArray.length; i++) {
        if(flatMatrix[i] !== sortedArray[i]) {
            return false
        }
    }
    return true
}

function showResults(list) {
    if(list.length) {
        let temp = list.sort((a, b) => a.turns - b.turns)
        createScoreBoard(temp)
    } else {
        createScoreBoard(0)
    }
}

function createScoreBoard(arr) {
    let div = document.createElement('div')
    div.className = "scoreboard"
    if(arr) {
        for(let i = 0; i < arr.length; i++) {
            div.append(createScoreString(arr[i], i+1))
        }
    } else {
        div.append(createScoreString(0, 0))
    }
    div.addEventListener('click', ()=> {
        div.remove()
    })
    document.body.append(div)
}

function createScoreString(item, index) {
    let rString = document.createElement('p')
    if(item) {
        rString.className = 'result-string'
        rString.textContent = `${index}.  Turns: ${item.turns}. Time: ${item.seconds}. Mode: ${Math.sqrt(item.length)}x${Math.sqrt(item.length)}. Date: ${item.date}`
    } else {
        rString.className = 'result-string-empty'
        rString.textContent = `The list of games is empty`
    }
    return rString
}

function createNotification(bool) {
    let notice = document.createElement('p')
    notice.className = 'main-notification'
    if(bool) {
        notice.textContent = `Hooray! You solved the puzzle in ${calcDuration(seconds)} and ${turns+1} moves!`;
    } else {
        notice.textContent = `You don't have a saved game`;
    }
    [...mainContainer][0].append(notice)
    clearInterval(myInterval)
    field[0].classList.add('blocked')
    setTimeout(()=>{
        [...mainContainer][0].lastChild.remove()
        cPanel[0].classList.remove('blocked')
    }, 3000)
}

function moveAt(pageX, pageY, sx, sy, el) {
    let x = 100 / (field[0].offsetWidth / Math.sqrt(array.length)) * (pageX-sx)
    let y = 100 / (field[0].offsetWidth / Math.sqrt(array.length)) * (pageY-sy)
    el.style.transform = `translate3d(${x}%, ${y}%, 0)`
}

function remover(list) {
    list.forEach(item => {
        item.style.zIndex = 1
        item.classList.remove('animation')
    })
}

// document.addEventListener('mousemove', (ev)=> {
//     if(ev.target === document.body) {
//         remover(nodes)
//         field[0].removeEventListener('mousemove', onMouseMove)
//         field[0].onmouseup = null
//         target.onmouseup = null
//     }
//     // console.log(ev.target === document.body);
// })


const audio = new Audio()
audio.src = './assets/quick-swhooshing-noise-80898.mp3'
audio.volume = 0.1

function playAudio() {
    audio.currentTime = 0;
    audio.play()
}

function mute(boolean) {
    if(boolean) {
        audio.volume = 0.1
        volume = false
    } else {
        audio.volume = 0
        volume = true
    }
}
