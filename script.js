// API Key para USDA Food Data Central
const apiKey = 'p1Ngu9cDjRhmhyOn2RFbySMtKbpcla5asFfc4MQH'; // Reemplaza con tu clave API

// Función para traducir texto
async function translate(text, from = 'es', to = 'en') {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0][0][0];
}

// Lista diaria
let listaDiaria = [];

// Mostrar/ocultar secciones
document.getElementById('btn-metabolismo').addEventListener('click', () => toggleSection('metabolismo'));
document.getElementById('btn-alimentos').addEventListener('click', () => toggleSection('alimentos'));
document.getElementById('btn-lista').addEventListener('click', () => toggleSection('lista-diaria'));

function toggleSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
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
        <div class="resultados">
            <div class="resultado">
                <h3>Harris-Benedict</h3>
                <p>Metabolismo Basal (BMR): <span class="caloria">${bmrHarris.toFixed(2)}</span> calorías/día</p>
                <p>Calorías Totales Diarias (TDEE): <span class="caloria">${tdeeHarris.toFixed(2)}</span> calorías/día</p>
                <p>Para perder grasa: <span class="perder">${(tdeeHarris - 500).toFixed(2)}</span> calorías/día</p>
                <p>Para ganar masa muscular: <span class="ganar">${(tdeeHarris + 500).toFixed(2)}</span> calorías/día</p>
            </div>
            <div class="resultado">
                <h3>Mifflin-St Jeor</h3>
                <p>Metabolismo Basal (BMR): <span class="caloria">${bmrMifflin.toFixed(2)}</span> calorías/día</p>
                <p>Calorías Totales Diarias (TDEE): <span class="caloria">${tdeeMifflin.toFixed(2)}</span> calorías/día</p>
                <p>Para perder grasa: <span class="perder">${(tdeeMifflin - 500).toFixed(2)}</span> calorías/día</p>
                <p>Para ganar masa muscular: <span class="ganar">${(tdeeMifflin + 500).toFixed(2)}</span> calorías/día</p>
            </div>
        </div>
    `;
});

// Mostrar alimentos
async function mostrarAlimentos(filtro = '') {
    const lista = document.getElementById('lista-alimentos');
    lista.innerHTML = '';
    if (!filtro.trim()) return;

    try {
        const englishQuery = await translate(filtro);
        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(englishQuery)}`);
        const data = await response.json();
        for (const food of data.foods.slice(0, 10)) {
            const spanishName = await translate(food.description, 'en', 'es');
            const nutrients = food.foodNutrients;
            const calories = nutrients.find(n => n.nutrientName === 'Energy')?.value || 0;
            const protein = nutrients.find(n => n.nutrientName === 'Protein')?.value || 0;
            const carbs = nutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0;
            const fat = nutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0;
            const li = document.createElement('li');
            li.textContent = `${spanishName}: ${calories} cal, Proteínas: ${protein}g, Carbohidratos: ${carbs}g, Grasas: ${fat}g`;
            lista.appendChild(li);
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
            const li = document.createElement('li');
            li.textContent = spanishName;
            const btnSeleccionar = document.createElement('button');
            btnSeleccionar.textContent = 'Seleccionar';
            btnSeleccionar.addEventListener('click', () => {
                selectedFood = {
                    name: spanishName,
                    nutrients: food.foodNutrients,
                    fdcId: food.fdcId
                };
                lista.innerHTML = `<li>Seleccionado: ${spanishName}</li>`;
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
        const cal = (calories * item.cantidad) / 100;
        totalCalorias += cal;
        const li = document.createElement('li');
        li.textContent = `${item.name}: ${item.cantidad}g - ${cal.toFixed(2)} cal`;
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