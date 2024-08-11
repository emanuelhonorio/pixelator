const express = require('express');
const { kmeans } = require('ml-kmeans');
const cors = require("cors")

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(cors())
app.use(express.json());

// POST endpoint that returns the received body
app.post('/kmeans', (req, res) => {
    const body = req.body;
    let maxPossibleColors = req.query.max ?? 3;
    const newMatrix = minimizeColors(body, +maxPossibleColors);
    res.json(newMatrix);
});

function minimizeColors(matrix, maxPossibleColors) {
    const rgbToColorObj = (rgbString) => {
        const [r, g, b] = rgbString.split(',').map(Number);
        return { r, g, b };
    };

    const colorObjToRgb = ({ r, g, b}) => `${r},${g},${b}`;

    // Passo 1: Extrair cores únicas da matriz
    const uniqueColors = new Set();
    for (const row of matrix) {
        for (const color of row) {
            uniqueColors.add(color);
        }
    }

    const colorArray = Array.from(uniqueColors).map(rgbToColorObj);

    // Se o número de cores distintas for menor ou igual ao maxPossibleColors, retorne a matriz original
    if (colorArray.length <= maxPossibleColors) {
        return matrix;
    }

    // Passo 2: Aplicar o algoritmo K-means para reduzir o número de cores
    const data = colorArray.map(c => [c.r, c.g, c.b]);
    let start = Math.floor(data.length/2 - maxPossibleColors/2)
    console.log({start, len: data.length, maxPossibleColors})
    let centers = data.slice(start, start+maxPossibleColors);

    const clusters = kmeans(data, maxPossibleColors, { initialization: centers });

    const clusterCenters = clusters.centroids.map(centroid => {
        const [r, g, b] = centroid;
        return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
    });


    // Passo 3: Substituir as cores na matriz original pelas cores agrupadas
   const dominantColors = clusterCenters.map(center => colorObjToRgb(center))

    return dominantColors;
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});