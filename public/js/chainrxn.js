const board = document.querySelectorAll(".gridx");
const contain1 = document.querySelector('.contain1');
const contain2 = document.querySelector('.contain2');
const scoreVal = document.querySelectorAll('.scoreVal');
const playerText = document.querySelector('.playerText');
const finalResult = document.querySelector('.finalResult');
const playerSphere = document.querySelector('.containLeft .ballOfSphere3');
scoreVal.forEach(sv => sv.textContent = '00');
playerText.textContent = 'red';

const q = new Queue(); // for BFS
const gridSize = 8;
let totalClicks = 0;
let intervalID = null;
const noOf = {
    red: 0,
    green: 0,
    incr: (member, value) => {
        noOf[member] += value;
        if (member === 'red') scoreVal[0].textContent = noOf.red;
        else scoreVal[1].textContent = noOf.green;
    }
}

let color = 'red';

const alterColor = () => {
    const currColor = color;
    if (color === 'red') color = 'green';
    else color = 'red';

    playerText.textContent = color;
    playerSphere.classList.remove(currColor);
    playerSphere.classList.add(color);

    board.forEach(col => {
        if (col.dataset.value === '0')
            changeBorderColor(col, ['green', 'red', 'black'], color);
        else
            changeBorderColor(col, ['green', 'red', 'black'], col.dataset.backgroundColor === color ? col.dataset.backgroundColor : 'black');
    })
}

function changeBorderColor(col, deleteColors, addColor) {
    deleteColors.forEach(deleteColor => {
        if (col.classList.contains(`${deleteColor}Border`)) col.classList.remove(`${deleteColor}Border`);
    })
    if (!col.classList.contains(`${addColor}Border`)) col.classList.add(`${addColor}Border`);
}

function appendXSpheres(x, node, colorOfSphere) {
    node.replaceChildren();

    while (x--) {
        addSphere(colorOfSphere, node);
    }
}

async function takeSS(div) {
    return await html2canvas(div);
}

function textFormatted(text) {
    const node = document.createElement('p');
    node.textContent = text;
    node.style.textAlign = 'center';
    node.classList.add('textWell');
    return node;
}

const incrp = (i) => {
    const col = board[i];
    let maxL = ((col.classList[0] === 'a') ? 1 : (col.classList[0] === 'b' ? 2 : 3));
    let val = parseInt(col.dataset.value);
    noOf.incr(col.dataset.backgroundColor, -val); // noOf[col.dataset.backgroundColor] -= val;
    val++;
    col.dataset.value = val;
    appendXSpheres(val, col, color);

    col.dataset.backgroundColor = color;
    noOf.incr(col.dataset.backgroundColor, val); // noOf[col.dataset.backgroundColor] += val;

    if (val > maxL) return true;
    return false;
}

const t = (i) => {
    let temp = i - gridSize;
    if (temp < 0) return null;
    if (!incrp(temp)) return null;
    return temp;
}
const d = (i) => {
    let temp = i + gridSize;
    if (temp > 63) return null;
    if (!incrp(temp)) return null;
    return temp;
}
const l = (i) => {
    let temp = i - 1;
    if (temp < 0 || (temp + 1) % 8 == 0) return null;
    if (!incrp(temp)) return null;
    return temp;
}
const r = (i) => {
    let temp = i + 1;
    if (temp > 63 || temp % 8 == 0) return null;
    if (!incrp(temp)) return null;
    return temp;
}


const explode = (i) => {
    contain2.classList.add('nonClickable');

    q.clear();
    q.push(i);

    alterColor();
    intervalID = setInterval(() => { // BFS
        if (isFinished()) q.clear(); // check if all green or red are eliminated if so then clear the queue.
        if (q.isEmpty()) {
            clearInterval(intervalID);
            intervalID = null;
            gameOver();
            alterColor();
            contain2.classList.remove('nonClickable');
        }
        else {
            let temp = q.pop();
            let col = board[temp];
            let maxL = ((col.classList[0] === 'a') ? 1 : (col.classList[0] === 'b' ? 2 : 3));
            let val = parseInt(col.dataset.value);
            if (val > maxL) { // in case if a node is pushed multiple time
                let currVal = (val - maxL - 1);
                col.dataset.value = currVal;
                appendXSpheres(currVal, col, color);
                noOf.incr(col.dataset.backgroundColor, -(val - currVal)); // noOf[col.dataset.backgroundColor] -= (val - currVal);
                if (currVal === 0) {
                    col.dataset.backgroundColor = "";
                }
                const tt = t(temp), dt = d(temp), lt = l(temp), rt = r(temp);
                if (tt !== null) q.push(tt);
                if (dt !== null) q.push(dt);
                if (lt !== null) q.push(lt);
                if (rt !== null) q.push(rt);
            }
        }
    }, 200);
}

// const explode = (i) => {
//     const q = new Queue(); // for BFS
//     q.push(i);

//     while (!q.isEmpty()) {

//         let temp = q.pop();

//         let col = board[temp];
//         let maxL = ((col.classList[0] === 'a') ? 1 : (col.classList[0] === 'b' ? 2 : 3));
//         let val = parseInt(col.dataset.value);
//         if (val <= maxL) continue; // in case if a node is pushed multiple time
//         let currVal = (val - maxL - 1);
//         col.dataset.value = currVal;
//         appendXSpheres(currVal, col, color);
//         if (currVal === 0) col.dataset.backgroundColor = "";

//         const tt = t(temp), dt = d(temp), lt = l(temp), rt = r(temp);
//         if (tt) q.push(tt);
//         if (dt) q.push(dt);
//         if (lt) q.push(lt);
//         if (rt) q.push(rt);
//     }
// }

// const isFinished = () => {
//     let red = false, green = false;

//     board.forEach(col => {
//         if (col.dataset.backgroundColor === 'red') red = true;
//         if (col.dataset.backgroundColor === 'green') green = true;
//     })

//     if (red && green) return false;
//     return true;
// }

// const isFinished = () => {
//     let set = new Set();
//     board.forEach(col => {
//         if (col.dataset.backgroundColor.length !== 0)
//             set.add(col.dataset.backgroundColor)
//     })
//     return (set.size === 1);
// }

const isFinished = () => (totalClicks > 1 && (noOf['green'] === 0 || noOf['red'] === 0));

const gameOver = () => {
    if (!isFinished()) return;

    alterColor();
    setTimeout(async () => {
        contain2.classList.add('nonClickable');
        // alert(`Winner is ${color}`);

        const ss = await takeSS(contain2);
        const win1 = document.createElement('div');
        win1.textContent = `Winner`;
        const win2 = document.createElement('div');
        win2.textContent = `is`;
        const win3 = document.createElement('div');
        win3.textContent = `-- ${color} --`;
        finalResult.replaceChildren(win1, win2, win3);
        contain2.replaceChildren(ss);
    }, 100);
}

board.forEach(col => {
    col.addEventListener('click', () => {
        totalClicks++;

        if (col.dataset.backgroundColor.length !== 0 && col.dataset.backgroundColor !== color) {
            return;
        }

        col.dataset.backgroundColor = color;

        let maxL = ((col.classList[0] === 'a') ? 1 : (col.classList[0] === 'b' ? 2 : 3));
        let val = parseInt(col.dataset.value);
        val++;
        col.dataset.value = val;
        noOf.incr(col.dataset.backgroundColor, 1); // noOf[col.dataset.backgroundColor]++;

        if (val > maxL) {
            explode(parseInt(col.classList[1]));
        } else {
            appendXSpheres(val, col, color);
        }

        alterColor();
    })
});