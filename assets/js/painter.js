// Initiating the canvas
const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        backgroundColor : "#ffffff",
        width: 800,
        height: 400,
        selection: false,
    });
}

const toggleMode = (mode) => {
    if (mode === modes.pan) {
        //For button styling
        const pan = document.getElementById("pan");
        document.getElementById("pen").removeAttribute("style");
        pan.style.backgroundColor = "#3f5185"
        pan.style.color = '#dfe4ea'
         

        //Selecting mode
        currentMode = ''
        canvas.isDrawingMode = false
        canvas.requestRenderAll();

        
    } else {
        //For button styling
        const pen = document.getElementById("pen");
        pen.style.backgroundColor = "#3f5185"
        pen.style.color = '#dfe4ea'
        document.getElementById("pan").removeAttribute("style"); 
        
        //Selecting mode
        currentMode = modes.drawing
       
        canvas.freeDrawingBrush.color = color
        canvas.isDrawingMode = true
        
        canvas.requestAll()
       
    }
   
    
}

// Toggle events
const setPanEvents = (canvas) => {
    canvas.on('mouse:move', (event) => {
        // console.log(e);
         if (mousePressed && currentMode === modes.pan) {
             canvas.setCursor('grab')
             canvas.requestRenderAll()
             const mEvent = event.e;
             const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
             canvas.relativePan(delta)
         } else if (mousePressed && currentMode === modes.drawing) {
             canvas.isDrawingMode = true
             canvas.requestRenderAll()
         }
     })
     canvas.on('mouse:up', (event) => {
         mousePressed = false;
     
         canvas.setCursor('grab')
         canvas.requestRenderAll()
     })
     canvas.on('mouse:down', (event) => {
         mousePressed = true;
         if (currentMode === modes.pan) {
             canvas.setCursor('default')
             canvas.requestRenderAll()
         }
         
     })
}

// Setting the color of brush
const setColorPicker = () => {
    const picker = document.getElementById("colorPicker");
    picker.addEventListener('change', (event) => {
        // console.log(event.target.value);
        color = event.target.value
        canvas.freeDrawingBrush.color = color
        canvas.requestRenderAll()
    })
}
// Setting canvas color
const setCanvasColor = () => {
    const picker = document.getElementById("canvasColor");
    picker.addEventListener('change', (event) => {
        // console.log(event.target.value);
        canvascolor = event.target.value
        // initCanvas("canvas", canvascolor);
        canvas.backgroundColor = canvascolor
        canvas.requestRenderAll()
    })
}
//Setting brush size
const setBrushSize = (event) => {
    const size = document.getElementById("pen-size");
    size.addEventListener('change', (event) => {
        // console.log(event.target.value);
        canvas.freeDrawingBrush.width = event.target.value
        
    })
}
// adding Text to the canvas
const setText = () => {
    var text= new fabric.Textbox('Enter your text',{
        width: 450
    });
    canvas.add(text);
    toggleMode(modes.pan)
}

// Objects creating functions(Circle, Rectangle)
const createCircle = () => {
    const canvasCenter = canvas.getCenter()
    const circle = new fabric.Circle({
        radius:50,
        fill: color,
        left: canvasCenter.left,
        top: canvasCenter.top,
        originX: 'center',
        originY:'center'
    })
    canvas.add(circle)
    canvas.requestRenderAll()
    circle.animate('top', canvas.height - 50, {
        onChange: canvas.renderAll.bind(canvas),
        onComplete : () => {
            circle.animate('top', canvasCenter.top, {
                onChange:canvas.renderAll.bind(canvas)
            })
        }
    })
    
    toggleMode(modes.pan)
}
const createRectangle = () => {
    const canvasCenter = canvas.getCenter()
    const rectangle = new fabric.Rect({
        width: 100,
        height: 100,
        fill: color,
        left: canvasCenter.left,
        top: -50,
        originX: 'center',
        originY:'center'
    })
    canvas.add(rectangle);
    canvas.requestRenderAll();
    rectangle.animate('top', canvasCenter.top, {
        onChange:canvas.renderAll.bind(canvas)
    })
    toggleMode(modes.pan)
}

const createTriangle = () => {
    const canvasCenter= canvas.getCenter()
    const triangle = new fabric.Triangle({
        width:100,
        height:100,
        fill: color,
        left: canvasCenter.left,
        top: -50,
        originX: 'center',
        originY:'center'
    })
    canvas.add(triangle);
    canvas.requestRenderAll();
    triangle.animate('top', canvasCenter.top, {
        onChange:canvas.renderAll.bind(canvas)
    })
    toggleMode(modes.pan)
}

// Grouping the Objects
const groupObjects = (canvas,group,shouldGroup) => {
    if (shouldGroup) {
        const objects = canvas.getObjects()
        group.val = new fabric.Group(objects)
        clearCanvas(canvas,svgState)
        canvas.add(group.val)
        canvas.requestRenderAll()
    } else {
        group.val.destroy()
        const oldGroup = group.val.getObjects()
        clearCanvas(canvas,svgState)
        canvas.add(...oldGroup)
        group.val = null
        canvas.requestRenderAll()
    }
    toggleMode(modes.pan)
}

// To clear the canvas
const clearCanvas = (canvas, state) => {
    state.val = canvas.toSVG()
    canvas.getObjects().forEach((o) => {
        if (o !== canvas.backgroundImage) {
            canvas.remove(o);
        }
    })
}


// To upload image to canvas
const imgAdded = (e) => {
    const inputElem = document.getElementById("imageFile")
    const file = inputElem.files[0];
    reader.readAsDataURL(file)
    toggleMode(modes.pan)
}


// Defined variables and constant
let mousePressed = false;
let color = '#000000';
const svgState = {};
let group = {}

const canvas = initCanvas("canvas");

// Background image URL
let currentMode = 'drawing';
const modes = {
    pan: 'pan',
    drawing:'drawing'
}

// Setting the toggle options
setPanEvents(canvas)

// Seting the color picker
setColorPicker()

//Setting brush size
setBrushSize()

// Setting canvas color
setCanvasColor()

// For uploading the image
const reader = new FileReader()
const inputFile = document.getElementById("imageFile");
inputFile.addEventListener('change', imgAdded)
reader.addEventListener('load', () => {
    fabric.Image.fromURL(reader.result, img => {
        canvas.add(img)
        canvas.requestRenderAll()
    });
})


 