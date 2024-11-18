const TOGGLE_ERASER_BTN_ID = "toggle-eraser-btn";
const TOGGLE_RAINBOW_BTN_ID = "toggle-rainbow-btn";
const TOGGLE_SHADING_BTN_ID = "toggle-shading-btn";
const TOGGLE_GRID_LINES_BTN = "toggle-grid-lines-btn";
const CHANGE_GRID_SIZE_BTN_ID = "change-grid-size-btn";
const CLEAR_GRID_BTN_ID = "clear-grid-btn";
const TOGGLE_DRAW_ON_MOUSE_PRESS_BTN = "toggle-draw-on-mouse-press-btn";

const COLOR_WHITE = "white";
const COLOR_BLACK = "black";
const COLOR_BLUE = "blue";
const COLOR_GREEN = "green";
const COLOR_RED = "red";
const COLOR_GOLD = "gold";

const STYLE_CLASS_HOVERED = "hovered";
const STYLE_CLASS_MOUSEDOWN = "mousedown";
const STYLE_CLASS_ENABLED = "enabled";
const STYLE_CLASS_SELECTED = "selected";


const STYLE_CLASS_GRAY_LEFT_BORDER = "show-left-border-gray";
const STYLE_CLASS_GRAY_RIGHT_BORDER = "show-right-border-gray";
const STYLE_CLASS_GRAY_TOP_BORDER = "show-top-border-gray";
const STYLE_CLASS_GRAY_BOTTOM_BORDER = "show-bottom-border-gray";
const STYLE_CLASS_SQUARE_CELL = "square-cell";
const STYLE_CLASS_GRID = "grid";

let initialDimension = 10; //Must take it from input later
let isEraser = false;
let isRainbow = false;
let isShading = false;
let penColor = COLOR_BLACK;
let drawOnPress = false;
let shouldDraw = true;


const grid = document.querySelector(`.${STYLE_CLASS_GRID}`);

window.addEventListener("mousedown", (e) => {
    shouldDraw = true;
    e.preventDefault(); //Prevent the default drag and drop.
});

window.addEventListener("mouseup", () => shouldDraw = false);

initGridCells(initialDimension);

grid.addEventListener("mouseover", (event) => {
    if (![...event.target.classList].includes(STYLE_CLASS_GRID)) {
        if (!drawOnPress || (drawOnPress && shouldDraw)) {
            if (isEraser) {
                event.target.style.backgroundColor = COLOR_WHITE;
            } else if (isRainbow) {
                const red = Math.random() * 100;
                const green = Math.random() * 100;
                const blue = Math.random() * 100;
                event.target.style.backgroundColor = `rgb(${red}%,${green}%,${blue}%)`;
                event.target.style.opacity = "";
            } else if (isShading) {
                let currentOpacity = event.target.style.opacity;
                currentOpacity = currentOpacity === '' ? 1 : +currentOpacity; //If no opacity is specified, it means the element has 100% opacity.
                let shouldApplyShading =
                    event.target.style.backgroundColor !== penColor || //The element is not colored yet
                    currentOpacity < 1; // and if it is colored, it has room to increase the opacity.

                if (shouldApplyShading) {
                    event.target.style.opacity = `${+event.target.style.opacity + 0.1}`;
                }
                event.target.style.backgroundColor = penColor;
            } else {
                event.target.style.backgroundColor = penColor;
                event.target.style.opacity = "";
            }
        }
    }
})


const colors = [
    COLOR_BLACK,
    COLOR_BLUE,
    COLOR_RED,
    COLOR_GREEN,
    COLOR_GOLD];

const colorItems = [...document.querySelectorAll(".color-item")];
initColorItems();

colorItems.forEach((colorItem) => {
    colorItem.addEventListener("mouseenter", () => {
        colorItem.classList.add(STYLE_CLASS_HOVERED);
    });
    colorItem.addEventListener("mouseleave", () => {
        colorItem.classList.remove(STYLE_CLASS_HOVERED);
    });
    colorItem.addEventListener("click", () => {
        selectColorItem(colorItem.style.backgroundColor);
    })
})

const buttons = [...document.querySelectorAll(".btn")];
buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
        btn.classList.toggle(STYLE_CLASS_HOVERED);
    })
    btn.addEventListener("mouseleave", () => {
        btn.classList.toggle(STYLE_CLASS_HOVERED);
        //Remove the mousedown effect if the user leaves the element
        //whilst pressing the mouse button.
        btn.classList.remove(STYLE_CLASS_MOUSEDOWN);
    })
    btn.addEventListener("mousedown", () => {
        btn.classList.add(STYLE_CLASS_MOUSEDOWN);
    })
})

buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        //Remove the mousedown effect after the mouse is released.
        event.target.classList.remove(STYLE_CLASS_MOUSEDOWN);
        switch (event.target.id) {
            case TOGGLE_ERASER_BTN_ID:
                toggleEraserButton();
                break;
            case TOGGLE_RAINBOW_BTN_ID:
                toggleRainbowButton();
                break;
            case TOGGLE_SHADING_BTN_ID:
                toggleShadingButton();
                break;
            case TOGGLE_GRID_LINES_BTN:
                toggleGridLinesButton();
                break;
            case CHANGE_GRID_SIZE_BTN_ID:
                handleGridSizeChangeBtn();
                break;
            case CLEAR_GRID_BTN_ID:
                clearGrid();
                break;
            case TOGGLE_DRAW_ON_MOUSE_PRESS_BTN:
                toggleDrawOnMousePressButton();
                break;
            default:
                break;
        }
    })
})

function changeGridSize(newDimension) {
    const oldCellClassList = grid.firstChild.classList; //Save any old state if there is any (like grid lines).
    let newCell = document.createElement("div");
    grid.innerHTML = ""; //Remove all old cells.
    newCell.classList = oldCellClassList;
    newCell.style.width = `calc(100%*(1/${newDimension}))`;
    for (let i = 0; i < newDimension * newDimension; i++) {
        grid.appendChild(newCell.cloneNode(false));
    }
}

function selectColorItem(color) {
    colorItems.forEach((colorItem) => {
        if (colorItem.style.backgroundColor === color) {
            colorItem.classList.add(STYLE_CLASS_SELECTED);
        } else {
            colorItem.classList.remove(STYLE_CLASS_SELECTED);
        }
    })
    penColor = color;
}

function initColorItems() {
    for (let i = 0; i < 5; i++) { //TODO: remove the hardcoded value 5.
        colorItems[i].style.backgroundColor = colors[i];
    }
    selectColorItem(COLOR_BLACK);
}

function initGridCells(initialDimension) {
    const cell = document.createElement("div");
    cell.classList.add(STYLE_CLASS_SQUARE_CELL);
    cell.style.width = `calc(100%*(1/${initialDimension}))`;

    for (let i = 0; i < initialDimension * initialDimension; i++) {
        grid.appendChild(cell.cloneNode(false));
    }
}

function clearGrid() {
    grid.childNodes.forEach((cell) => {
        cell.style.backgroundColor = COLOR_WHITE;
        cell.style.opacity = "";
    })
}

function toggleRainbowButton() {
    const rainbowBtn = document.querySelector(`#${TOGGLE_RAINBOW_BTN_ID}`);
    const eraserBtn = document.querySelector(`#${TOGGLE_ERASER_BTN_ID}`);
    const shadingBtn = document.querySelector(`#${TOGGLE_SHADING_BTN_ID}`);
    rainbowBtn.classList.toggle(STYLE_CLASS_ENABLED);
    isRainbow = !isRainbow;
    if (isRainbow) {
        isEraser = false;
        eraserBtn.classList.remove(STYLE_CLASS_ENABLED);
        isShading = false;
        shadingBtn.classList.remove(STYLE_CLASS_ENABLED);
    }
}

function toggleEraserButton() {
    const rainbowBtn = document.querySelector(`#${TOGGLE_RAINBOW_BTN_ID}`);
    const eraserBtn = document.querySelector(`#${TOGGLE_ERASER_BTN_ID}`);
    const shadingBtn = document.querySelector(`#${TOGGLE_SHADING_BTN_ID}`);
    eraserBtn.classList.toggle(STYLE_CLASS_ENABLED);
    isEraser = !isEraser;
    if (isEraser) {
        isRainbow = false;
        rainbowBtn.classList.remove(STYLE_CLASS_ENABLED);
        isShading = false;
        shadingBtn.classList.remove(STYLE_CLASS_ENABLED);
    }
}

function toggleShadingButton() {
    const rainbowBtn = document.querySelector(`#${TOGGLE_RAINBOW_BTN_ID}`);
    const eraserBtn = document.querySelector(`#${TOGGLE_ERASER_BTN_ID}`);
    const shadingBtn = document.querySelector(`#${TOGGLE_SHADING_BTN_ID}`);
    shadingBtn.classList.toggle(STYLE_CLASS_ENABLED);
    isShading = !isShading;
    if (isShading) {
        isEraser = false;
        eraserBtn.classList.remove(STYLE_CLASS_ENABLED);
        isRainbow = false;
        rainbowBtn.classList.remove(STYLE_CLASS_ENABLED);
    }
}

function toggleGridLinesButton() {
    const gridLinesBtn = document.querySelector(`#${TOGGLE_GRID_LINES_BTN}`);
    gridLinesBtn.classList.toggle(STYLE_CLASS_ENABLED);
    document.querySelectorAll(`.${STYLE_CLASS_SQUARE_CELL}`).forEach((cell) => {
        cell.classList.toggle(STYLE_CLASS_GRAY_RIGHT_BORDER);
        cell.classList.toggle(STYLE_CLASS_GRAY_TOP_BORDER);
    });
    grid.classList.toggle(STYLE_CLASS_GRAY_LEFT_BORDER);
    grid.classList.toggle(STYLE_CLASS_GRAY_BOTTOM_BORDER);
}


function handleGridSizeChangeBtn() {
    const newDimension = prompt("Please enter the new grids dimension:");
    if (newDimension !== null) {
        if (isNaN(+newDimension) || +newDimension <= 0) {
            alert("Stop being a clown and enter a positive integer")
        } else if (+newDimension > 100) {
            alert("Dude, the limit is 100, what were you gonna do with all those cells anyway?")
        } else {
            changeGridSize(newDimension);
        }
    }
}

function toggleDrawOnMousePressButton() {
    drawOnPress = !drawOnPress;
    const drawOnMouseBtn = document.querySelector(`#${TOGGLE_DRAW_ON_MOUSE_PRESS_BTN}`);
    drawOnMouseBtn.classList.toggle(STYLE_CLASS_ENABLED);
}