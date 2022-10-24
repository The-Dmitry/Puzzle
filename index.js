
let array = new Array(16).fill(0).map((el, index) => el = index+1)
let matrix = []

let diceClassName = ''

function createField() {
    let field = document.createElement('div')
    field.className = 'field'
    for(let i = 0; i< array.length; i++) {
        field.append(createDice(array[i]))
    }
    document.body.append(field)
    createShuffleBtn()
    randomArray(array)
}

createField()

function createDice(num) {
    let dice = document.createElement('button')
    diceClassName = `dice dice-${array.length}`
    dice.className = `dice dice-${array.length}`
    dice.id = num
    dice.textContent = num
    return dice
}

let nodes = Array.from(document.getElementsByClassName(diceClassName))

function createShuffleBtn() {
    let btn = document.createElement('button')
    btn.textContent = 'Shuffle'
    btn.addEventListener('click', ()=> {
        matrix = []
        randomArray(array)
        createMatrix(array)
        nodes.forEach(el => el.classList.add('animation'))
        setTimeout(() => {
            remover(nodes)
        }, 200);
    })
    document.body.append(btn)
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

let field = Array.from(document.getElementsByClassName('field'))

let droppable = true

let shiftX
let shiftY

field[0].addEventListener('mousedown', (e)=> {
    console.log(e);
    shiftX = e.clientX - e.target.getBoundingClientRect().left
    shiftY = e.clientY - e.target.getBoundingClientRect().top
    let target = e.target
    let elemBelow
    target.classList.add('animation')
    target.style.zIndex = 1000
    
    let number = +e.target.id
    let blank = array.length
    let moveCoords
    let isMoveValid
    const buttonCoords = findCoords(number, matrix)
    const blankCoords = findCoords(blank, matrix)
    const isValid = isValidForSwap(buttonCoords, blankCoords);
    
    function onMouseMove(event) {
        event.target.classList.remove('animation')
        event.target.hidden = true
        elemBelow = +document.elementFromPoint(event.clientX, event.clientY).id;
        event.target.hidden = false
        moveAt(event.layerX, event.layerY, shiftX, shiftY, event.target);
        moveCoords = findCoords(elemBelow, matrix)
        droppable = false
        if(moveCoords) {
            isMoveValid = isValidForMove(moveCoords, blankCoords, number, blank);
        }
        if(event.layerX < 0 || event.layerY <= 0 || event.layerX > field[0].offsetWidth || event.layerY > field[0].offsetWidth) {
            event.target.classList.add('animation')
            field[0].removeEventListener('mousemove', onMouseMove)
            setDicePosition(matrix)
            setTimeout(() => {
                remover(nodes)
            }, 200);
        }
    }

    if(number !== 0 && isValid) {
        field[0].addEventListener('mousemove', onMouseMove )
    }

    target.onmouseup = function(ev) {
        if(number !== 0 && isMoveValid) {
            diceSwap(buttonCoords, blankCoords, matrix)
            setDicePosition(matrix)
        }

        target.classList.add('animation')
        setDicePosition(matrix)
        field[0].removeEventListener('mousemove', onMouseMove)
        if(number !== 0 && isValid && droppable) {
            diceSwap(buttonCoords, blankCoords, matrix)
            setDicePosition(matrix)
        }
        droppable = true
        target.onmouseup = null
        // target.classList.remove('animation')
        setTimeout(() => {
            remover(nodes)
        }, 200);
    }
})



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

function isValidForMove(coords1, coords2, below, upper) {
    return coords1.x === coords2.x && coords1.y ===coords2.y
}

function diceSwap(coords1, coords2, matrix) {
    let temp = matrix[coords1.y][coords1.x]
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x]
    matrix[coords2.y][coords2.x] = temp
}


function moveAt(pageX, pageY, sx, sy, el) {
    let x = 100 / (field[0].offsetWidth / Math.sqrt(array.length)) * (pageX-sx)
    let y = 100 / (field[0].offsetWidth / Math.sqrt(array.length)) * (pageY-sy)
    el.style.transform = `translate3d(${x}%, ${y}%, 0)`
}

  console.log(droppable);

  function remover(list) {
    list.forEach(item => {
        item.style.zIndex = 1
        item.classList.remove('animation')
    })
  }

//   document.addEventListener('mouseup', ()=> {
//     remover(nodes)
//   })


alert('Не думал, что когда-нибудь окажусь в этой ситуации, но судьба подкинула труностей непреодолимого характера, из-за чего сделать к дедлайну таск - я не успел. \n Закинул функицонал, который успел накидать на коленке. Если будет возможность и желание проверить немного позже , буду весьма признателен. Спасибо.')
