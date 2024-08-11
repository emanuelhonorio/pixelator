
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pixelSizeSlider = document.getElementById('pixelSizeSlider');
const pixelSizeValue = document.getElementById('pixelSizeValue');
const img = new Image();
const imagePath = 'fire2.jpg'; // Replace with your image path

img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    pixelateImage(pixelSizeSlider.value);
};

img.src = imagePath;



pixelSizeSlider.oninput = () => {
    pixelSizeValue.textContent = pixelSizeSlider.value;
    pixelateImage(pixelSizeSlider.value);
};

function showDominantColors(data) {
    const div = document.getElementById("dominantColorsDiv")
    div.innerHTML = "";
    for (let d of data) {
        div.innerHTML+= `<div class="kolor" style="background-color: rgb(${d})"></div>`
    }
}

function showUniqueColors(matrix) {
    let set = new Set()
    for (const row of matrix) {
        for (const color of row) {
            set.add(color);
        }
    }

    console.log(set)
}

function handleMatrix(matrix) {

    let arr = []
    let chunksOf = matrix.length
    for (const row of matrix) {
        for (const color of row) {
            arr.push(color);
        }
    }

    const output = myFunc(arr, 4)
    return {...output, chunksOf};

}

        function drawMatrix(matrix) {
            
            //const output = handleMatrix(matrix)
           // showDominantColors(output.averageColors)
            showUniqueColors(matrix)
            //const teste = _.chunk(output.rgbsSubstituedByAverageColors, output.chunksOf)
            //console.log({teste})

            
            draww(matrix, document.getElementById("quadro"))
           // draww(teste, document.getElementById("quadro2"))

        }

        function draww(matrixToDraw, quadroDiv) {
            quadroDiv.innerHTML = ""
            
            let len= matrixToDraw.length

            for (let x = 0; x < len; x++) {
                let output = ""
                output += `<div class="row">`
                for (let y = 0; y < len; y++) {
                    output += `<div class="box" style="background-color: rgba(${matrixToDraw[x][y]}); width:${+pixelSizeSlider.value}px; height:${+pixelSizeSlider.value}px;"></div>`
                }
                output += "</div>"
                quadroDiv.innerHTML += output

            }
        }

        function pixelateImage(pixelSize) {
            // Clear the canvas before redrawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            pixelSize = parseInt(pixelSize, 10);
            let matrix = []

            for (let y = 0; y < img.height; y += pixelSize) {
                let arr = []
                for (let x = 0; x < img.width; x += pixelSize) {
                    let red = 0, green = 0, blue = 0, alpha = 0;
                    const pxIndex = (x + y * img.width) * 4;
                    red = data[pxIndex];
                    green = data[pxIndex + 1];
                    blue = data[pxIndex + 2];
                    alpha = data[pxIndex + 3];

                    if (alpha > 0) {
                        arr.push(`${red},${green},${blue}`)
                    } else {
                        arr.push("255,255,255") // TODO: return to 0, a invalid string
                    }
                }
                matrix.push(arr)
            }

        

            drawMatrix(matrix)
            //ctx.putImageData(imageData, 0, 0);
        }
        
        function convertToRGB(colorString) {
            // Divide a string pelo caractere de vírgula
            let parts = colorString.split(',');

            // Converte cada parte em um número e separa-as em variáveis
            let red = parseInt(parts[0]);
            let green = parseInt(parts[1]);
            let blue = parseInt(parts[2]);
            let alpha = parseFloat(parts[3]);

            // Calcula a nova cor RGB ajustada pelo alpha
            let newRed = Math.round(red * alpha + 255 * (1 - alpha));
            let newGreen = Math.round(green * alpha + 255 * (1 - alpha));
            let newBlue = Math.round(blue * alpha + 255 * (1 - alpha));

            // Retorna a string no formato 'rgb(red, green, blue)'
            return `${newRed},${newGreen},${newBlue},${1}`;
        }