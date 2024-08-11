function euclideanDistance(color1, color2) {
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;
    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
}

function calculateAverageColor(colors) {
    const sum = colors.reduce((acc, color) => {
        const [r, g, b] = color.split(',').map(Number);
        return [acc[0] + r, acc[1] + g, acc[2] + b];
    }, [0, 0, 0]);
    const avgR = Math.round(sum[0] / colors.length);
    const avgG = Math.round(sum[1] / colors.length);
    const avgB = Math.round(sum[2] / colors.length);
    return `${avgR},${avgG},${avgB}`;
}

function myFunc(rgbs, maxColors) {
    const uniqueColors = new Set(rgbs);
    const data = [...uniqueColors].map(color => color.split(',').map(Number));

    const clusters = [];

    while (clusters.length < maxColors && data.length > 0) {
        const nearestColor = data.shift();
        const nearestColorString = nearestColor.join(',');
        const similarColors = data.filter(color => euclideanDistance(color, nearestColor) < 30); // Adjust threshold as needed
        similarColors.forEach(color => {
            const index = data.indexOf(color);
            if (index !== -1) data.splice(index, 1);
        });
        clusters.push([nearestColorString, ...similarColors.map(color => color.join(','))]);
    }

    const averageColors = clusters.map(cluster => calculateAverageColor(cluster));
    const rgbsSubstituedByAverageColors = rgbs.map(rgb => {
        const index = clusters.findIndex(cluster => cluster.includes(rgb));
        return averageColors[index];
    });

    return { averageColors, rgbsSubstituedByAverageColors };
}