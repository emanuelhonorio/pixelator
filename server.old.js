const express = require('express');
const { kmeans } = require('ml-kmeans');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint that returns the received body
app.post('/kmeanss', (req, res) => {
    const body = req.body;
    let maxPossibleColors = 3;
    const newMatrix = minimizeColors(body, maxPossibleColors);
    res.json(newMatrix);
});

function minimizeColors(matrix, maxPossibleColors) {
    const rgbToColorObj = (rgbString) => {
        const [r, g, b, a] = rgbString.split(',').map(Number);
        return { r, g, b, a };
    };

    const colorObjToRgb = ({ r, g, b, a }) => `${r},${g},${b},${a}`;

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
    const data = colorArray.map(c => [c.r, c.g, c.b, c.a]);
    console.log({data, maxPossibleColors})
    const clusters = kmeans(data, maxPossibleColors);

    const clusterCenters = clusters.centroids.map(centroid => {
        const [r, g, b, a] = centroid.centroid;
        return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: parseFloat(a.toFixed(2)) };
    });

    const colorMap = new Map();
    for (let i = 0; i < colorArray.length; i++) {
        colorMap.set(colorArray[i], clusterCenters[clusters.assignments[i]]);
    }

    // Passo 3: Substituir as cores na matriz original pelas cores agrupadas
    const newMatrix = matrix.map(row => row.map(color => {
        const colorObj = rgbToColorObj(color);
        const newColorObj = colorMap.get(colorObj);
        return colorObjToRgb(newColorObj);
    }));

    return newMatrix;
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});