// Datos de alimentos (ejemplos)
const alimentos = {
    "manzana": { calorias: 52, proteinas: 0.2, carbohidratos: 14, grasas: 0.2 },
    "banana": { calorias: 89, proteinas: 1.1, carbohidratos: 23, grasas: 0.3 },
    "pollo": { calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6 },
    "arroz": { calorias: 130, proteinas: 2.7, carbohidratos: 28, grasas: 0.3 },
    "leche": { calorias: 61, proteinas: 3.2, carbohidratos: 4.8, grasas: 3.3 },
    "huevo": { calorias: 155, proteinas: 13, carbohidratos: 1.1, grasas: 11 },
    "pan": { calorias: 265, proteinas: 9, carbohidratos: 49, grasas: 3.2 },
    "queso": { calorias: 402, proteinas: 7, carbohidratos: 3.4, grasas: 33 },
    "tomate": { calorias: 18, proteinas: 0.9, carbohidratos: 3.9, grasas: 0.2 },
    "espinaca": { calorias: 23, proteinas: 2.9, carbohidratos: 3.6, grasas: 0.4 }
};

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
function mostrarAlimentos(filtro = '') {
    const lista = document.getElementById('lista-alimentos');
    lista.innerHTML = '';
    Object.keys(alimentos).filter(alimento => alimento.includes(filtro.toLowerCase())).forEach(alimento => {
        const li = document.createElement('li');
        li.textContent = `${alimento.charAt(0).toUpperCase() + alimento.slice(1)}: ${alimentos[alimento].calorias} cal, Proteínas: ${alimentos[alimento].proteinas}g, Carbohidratos: ${alimentos[alimento].carbohidratos}g, Grasas: ${alimentos[alimento].grasas}g`;
        lista.appendChild(li);
    });
}

document.getElementById('buscar-alimento').addEventListener('input', function() {
    mostrarAlimentos(this.value);
});

mostrarAlimentos();

// Lista diaria
function actualizarSelectAlimentos() {
    const select = document.getElementById('select-alimento');
    select.innerHTML = '<option value="">Seleccionar alimento</option>';
    Object.keys(alimentos).forEach(alimento => {
        const option = document.createElement('option');
        option.value = alimento;
        option.textContent = alimento.charAt(0).toUpperCase() + alimento.slice(1);
        select.appendChild(option);
    });
}

actualizarSelectAlimentos();

document.getElementById('agregar-comida').addEventListener('click', function() {
    const alimento = document.getElementById('select-alimento').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    if (alimento && cantidad > 0) {
        listaDiaria.push({ alimento, cantidad });
        actualizarListaDiaria();
        document.getElementById('cantidad').value = '';
    }
});

function actualizarListaDiaria() {
    const lista = document.getElementById('lista-comidas');
    lista.innerHTML = '';
    let totalCalorias = 0;
    listaDiaria.forEach((item, index) => {
        const cal = (alimentos[item.alimento].calorias * item.cantidad) / 100;
        totalCalorias += cal;
        const li = document.createElement('li');
        li.textContent = `${item.alimento.charAt(0).toUpperCase() + item.alimento.slice(1)}: ${item.cantidad}g - ${cal.toFixed(2)} cal`;
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