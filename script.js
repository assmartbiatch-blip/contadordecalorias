// API Key para USDA Food Data Central
const apiKey = 'p1Ngu9cDjRhmhyOn2RFbySMtKbpcla5asFfc4MQH'; // Reemplaza con tu clave API

// Función para traducir texto usando LibreTranslate
async function translate(text, from = 'es', to = 'en') {
    try {
        const url = 'https://translate.argosopentech.com/translate';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: from,
                target: to
            })
        });
        const data = await response.json();
        let translated = data.translatedText || text;
        // Limpiar traducción: tomar solo la primera opción si hay coma
        translated = translated.split(',')[0].trim();
        return translated;
    } catch (error) {
        console.error('Error traduciendo:', error);
        return text; // Retornar texto original
    }
}

// Lista diaria
let listaDiaria = [];

// Mostrar/ocultar secciones
document.getElementById('btn-metabolismo').addEventListener('click', () => toggleSection('metabolismo'));
document.getElementById('btn-alimentos').addEventListener('click', () => toggleSection('alimentos'));
document.getElementById('btn-lista').addEventListener('click', () => toggleSection('lista-diaria'));

function toggleSection(sectionId) {
    console.log('Abriendo sección:', sectionId);
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    if (sectionId === 'alimentos') {
        mostrarAlimentos(); // Mostrar lista por defecto al abrir
    }
}

// Calcular metabolismo
document.getElementById('form-metabolismo').addEventListener('submit', function(e) {
    e.preventDefault();
    const genero = document.getElementById('genero').value;
    const edad = parseFloat(document.getElementById('edad').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const actividad = parseFloat(document.getElementById('actividad').value);

    // Harris-Benedict
    let bmrHarris;
    if (genero === 'hombre') {
        bmrHarris = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
        bmrHarris = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }
    const tdeeHarris = bmrHarris * actividad;

    // Mifflin-St Jeor
    let bmrMifflin;
    if (genero === 'hombre') {
        bmrMifflin = (10 * peso) + (6.25 * altura) - (5 * edad) + 5;
    } else {
        bmrMifflin = (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
    }
    const tdeeMifflin = bmrMifflin * actividad;

    document.getElementById('resultado-metabolismo').innerHTML = `
        <p><strong>Metabolismo Basal (BMR):</strong> Es la cantidad mínima de calorías que tu cuerpo necesita para mantener funciones vitales en reposo, como respirar y mantener la temperatura corporal.</p>
        <p><strong>Calorías Totales Diarias (TDEE):</strong> Incluye el BMR más las calorías quemadas por actividad física. Representa el total de calorías que consumes al día para mantener tu peso actual.</p>
        <p><strong>Relación:</strong> El TDEE se calcula multiplicando el BMR por un factor de actividad. Para perder o ganar peso, ajusta el TDEE: 500 calorías ≈ 0.5 kg por semana.</p>
        <div class="resultados">
            <div class="resultado">
                <h3>🔥 Harris-Benedict</h3>
                <p>Metabolismo Basal (BMR): <span class="caloria">${bmrHarris.toFixed(2)}</span> calorías/día</p>
                <p>Calorías Totales Diarias (TDEE): <span class="caloria">${tdeeHarris.toFixed(2)}</span> calorías/día</p>
                <p>Mantener peso: <span class="mantener">${tdeeHarris.toFixed(2)}</span> cal (-0%)</p>
                <p>Perder grasa moderada: <span class="perder-mod">${(tdeeHarris - 250).toFixed(2)}</span> cal (-10%, ≈0.25 kg/sem)</p>
                <p>Perder grasa: <span class="perder">${(tdeeHarris - 500).toFixed(2)}</span> cal (-20%, ≈0.5 kg/sem)</p>
                <p>Ganar masa muscular moderada: <span class="ganar-mod">${(tdeeHarris + 250).toFixed(2)}</span> cal (+10%, ≈0.25 kg/sem)</p>
                <p>Ganar masa muscular: <span class="ganar">${(tdeeHarris + 500).toFixed(2)}</span> cal (+20%, ≈0.5 kg/sem)</p>
            </div>
            <div class="resultado">
                <h3>⚡ Mifflin-St Jeor</h3>
                <p>Metabolismo Basal (BMR): <span class="caloria">${bmrMifflin.toFixed(2)}</span> calorías/día</p>
                <p>Calorías Totales Diarias (TDEE): <span class="caloria">${tdeeMifflin.toFixed(2)}</span> calorías/día</p>
                <p>Mantener peso: <span class="mantener">${tdeeMifflin.toFixed(2)}</span> cal (-0%)</p>
                <p>Perder grasa moderada: <span class="perder-mod">${(tdeeMifflin - 250).toFixed(2)}</span> cal (-10%, ≈0.25 kg/sem)</p>
                <p>Perder grasa: <span class="perder">${(tdeeMifflin - 500).toFixed(2)}</span> cal (-20%, ≈0.5 kg/sem)</p>
                <p>Ganar masa muscular moderada: <span class="ganar-mod">${(tdeeMifflin + 250).toFixed(2)}</span> cal (+10%, ≈0.25 kg/sem)</p>
                <p>Ganar masa muscular: <span class="ganar">${(tdeeMifflin + 500).toFixed(2)}</span> cal (+20%, ≈0.5 kg/sem)</p>
            </div>
        </div>
    `;
});

// Mostrar alimentos
async function mostrarAlimentos(filtro = '') {
    console.log('Mostrando alimentos con filtro:', filtro);
    const lista = document.getElementById('lista-alimentos');
    lista.innerHTML = '';
    let query = filtro.trim();
    if (!query) {
        query = 'comida'; // Búsqueda por defecto para mostrar alimentos comunes
    }

    try {
        const englishQuery = await translate(query);
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(englishQuery)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.foods && data.foods.length > 0) {
            // Traducir nombres y ordenar alfabéticamente
            const foodsWithNames = [];
            for (const food of data.foods.slice(0, 20)) { // Más resultados para ordenar
                const spanishName = await translate(food.description, 'en', 'es');
                foodsWithNames.push({ food, spanishName });
            }
            foodsWithNames.sort((a, b) => a.spanishName.localeCompare(b.spanishName));
            
            for (const { food, spanishName } of foodsWithNames.slice(0, 10)) {
                const nutrients = food.foodNutrients;
                const servingSize = food.servingSize || 100;
                
                // Normalizar a por 100g
                const normalize = (value) => servingSize ? (value * 100) / servingSize : value;
                
                const calories = nutrients.find(n => n.nutrientName === 'Energy')?.value || 0;
                const protein = nutrients.find(n => n.nutrientName === 'Protein')?.value || 0;
                const carbs = nutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0;
                const fat = nutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0;
                
                const caloriesPer100g = normalize(calories);
                const proteinPer100g = normalize(protein);
                const carbsPer100g = normalize(carbs);
                const fatPer100g = normalize(fat);
                
                const li = document.createElement('li');
                li.innerHTML = `<strong style="font-size: 1.1em;">${spanishName}</strong><br><small style="font-size: 0.9em; color: #666;">Nutrientes por 100g: Calorías: ${caloriesPer100g.toFixed(0)} cal, Proteínas: ${proteinPer100g.toFixed(1)}g, Carbohidratos: ${carbsPer100g.toFixed(1)}g, Grasas: ${fatPer100g.toFixed(1)}g</small>`;
                lista.appendChild(li);
            }
        } else {
            lista.innerHTML = '<li>No se encontraron alimentos.</li>';
        }
    } catch (error) {
        console.error('Error fetching foods:', error);
        lista.innerHTML = '<li>Error al cargar alimentos.</li>';
    }
}

document.getElementById('buscar-alimento').addEventListener('input', function() {
    mostrarAlimentos(this.value);
});

// Lista diaria
let selectedFood = null;

async function buscarAlimentosDiarios(filtro) {
    const lista = document.getElementById('resultados-busqueda');
    lista.innerHTML = '';
    if (!filtro.trim()) return;

    try {
        const englishQuery = await translate(filtro);
        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(englishQuery)}`);
        const data = await response.json();
        for (const food of data.foods.slice(0, 5)) {
            const spanishName = await translate(food.description, 'en', 'es');
            const servingSize = food.servingSize || 100;
            const normalize = (value) => servingSize ? (value * 100) / servingSize : value;
            const nutrients = food.foodNutrients.map(n => ({ ...n, value: normalize(n.value) })); // Normalizar todos los nutrients
            
            const li = document.createElement('li');
            li.innerHTML = `<strong>${spanishName}</strong>`;
            const btnSeleccionar = document.createElement('button');
            btnSeleccionar.textContent = 'Seleccionar';
            btnSeleccionar.addEventListener('click', () => {
                selectedFood = {
                    name: spanishName,
                    nutrients: nutrients, // Ya normalizados a 100g
                    fdcId: food.fdcId
                };
                lista.innerHTML = `<li><strong>Seleccionado: ${spanishName}</strong></li>`;
            });
            li.appendChild(btnSeleccionar);
            lista.appendChild(li);
        }
    } catch (error) {
        console.error('Error:', error);
        lista.innerHTML = '<li>Error al buscar.</li>';
    }
}

document.getElementById('buscar-alimento-diario').addEventListener('input', function() {
    buscarAlimentosDiarios(this.value);
});

document.getElementById('agregar-comida').addEventListener('click', function() {
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    if (selectedFood && cantidad > 0) {
        listaDiaria.push({ ...selectedFood, cantidad });
        actualizarListaDiaria();
        document.getElementById('cantidad').value = '';
        selectedFood = null;
        document.getElementById('resultados-busqueda').innerHTML = '';
    }
});

function actualizarListaDiaria() {
    const lista = document.getElementById('lista-comidas');
    lista.innerHTML = '';
    let totalCalorias = 0;
    listaDiaria.forEach((item, index) => {
        const nutrients = item.nutrients;
        const calories = nutrients.find(n => n.nutrientName === 'Energy')?.value || 0;
        const protein = nutrients.find(n => n.nutrientName === 'Protein')?.value || 0;
        const carbs = nutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0;
        const fat = nutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0;
        const sodium = nutrients.find(n => n.nutrientName === 'Sodium, Na')?.value || 0;
        
        const cal = (calories * item.cantidad) / 100;
        const prot = (protein * item.cantidad) / 100;
        const carb = (carbs * item.cantidad) / 100;
        const grasa = (fat * item.cantidad) / 100;
        const sod = (sodium * item.cantidad) / 100;
        
        totalCalorias += cal;
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.name}</strong>: ${item.cantidad}g<br>
        Calorías: ${cal.toFixed(0)} cal<br>
        Proteínas: ${prot.toFixed(1)}g, Carbohidratos: ${carb.toFixed(1)}g, Grasas: ${grasa.toFixed(1)}g<br>
        Sodio: ${sod.toFixed(0)}mg`;
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            listaDiaria.splice(index, 1);
            actualizarListaDiaria();
        });
        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });
    document.getElementById('total-calorias').textContent = `Total Calorías: ${totalCalorias.toFixed(2)}`;
}