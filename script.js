// ==================== BASE DE DATOS LOCAL ====================
// Alimentos venezolanos con nutrientes por 100g
const alimentosDB = [
    {
        id: 1,
        nombre: "Caraotas negras",
        categoria: "granos",
        calorias: 120,
        proteinas: 8.0,
        carbohidratos: 21.0,
        grasas: 0.5,
        fibra: 8.0,
        azucar: 0.2,
        sodio: 1,
        nota: "Cocidas, sin aceite añadido"
    },
    {
        id: 2,
        nombre: "Arroz blanco",
        categoria: "granos",
        calorias: 130,
        proteinas: 2.7,
        carbohidratos: 28.0,
        grasas: 0.3,
        fibra: 0.4,
        azucar: 0.1,
        sodio: 1,
        nota: "Cocido"
    },
    {
        id: 3,
        nombre: "Pollo asado (pechuga)",
        categoria: "proteinas",
        calorias: 165,
        proteinas: 31.0,
        carbohidratos: 0.0,
        grasas: 3.6,
        fibra: 0.0,
        azucar: 0.0,
        sodio: 74,
        nota: "Sin piel"
    },
    {
        id: 4,
        nombre: "Cambur",
        categoria: "frutas",
        calorias: 89,
        proteinas: 1.1,
        carbohidratos: 23.0,
        grasas: 0.3,
        fibra: 2.6,
        azucar: 12.0,
        sodio: 1,
        nota: "Mediano (aprox 100g)"
    },
    {
        id: 5,
        nombre: "Arepa de harina de maíz",
        categoria: "panes",
        calorias: 220,
        proteinas: 4.5,
        carbohidratos: 47.0,
        grasas: 1.5,
        fibra: 2.0,
        azucar: 0.5,
        sodio: 200,
        nota: "Arepa estándar sin relleno"
    },
    {
        id: 6,
        nombre: "Queso llanero",
        categoria: "lacteos",
        calorias: 320,
        proteinas: 22.0,
        carbohidratos: 2.0,
        grasas: 25.0,
        fibra: 0.0,
        azucar: 1.0,
        sodio: 650,
        nota: "Porción de 100g"
    },
    {
        id: 7,
        nombre: "Aguacate",
        categoria: "frutas",
        calorias: 160,
        proteinas: 2.0,
        carbohidratos: 9.0,
        grasas: 15.0,
        fibra: 7.0,
        azucar: 0.7,
        sodio: 7,
        nota: "Mediano, sin semilla"
    },
    {
        id: 8,
        nombre: "Huevo de gallina",
        categoria: "proteinas",
        calorias: 155,
        proteinas: 13.0,
        carbohidratos: 1.1,
        grasas: 11.0,
        fibra: 0.0,
        azucar: 0.0,
        sodio: 124,
        nota: "Huevo entero grande"
    },
    {
        id: 9,
        nombre: "Plátano maduro frito",
        categoria: "verduras",
        calorias: 250,
        proteinas: 1.5,
        carbohidratos: 35.0,
        grasas: 12.0,
        fibra: 2.0,
        azucar: 15.0,
        sodio: 2,
        nota: "Tajadas fritas"
    },
    {
        id: 10,
        nombre: "Lechosa (papaya)",
        categoria: "frutas",
        calorias: 43,
        proteinas: 0.5,
        carbohidratos: 11.0,
        grasas: 0.3,
        fibra: 1.8,
        azucar: 8.0,
        sodio: 3,
        nota: "Porción de 100g"
    }
];

// ==================== VARIABLES GLOBALES ====================
let listaDiaria = [];
let selectedFood = null;

// ==================== MOSTRAR/OCULTAR SECCIONES ====================
document.getElementById('btn-metabolismo').addEventListener('click', () => toggleSection('metabolismo'));
document.getElementById('btn-alimentos').addEventListener('click', () => toggleSection('alimentos'));
document.getElementById('btn-lista').addEventListener('click', () => toggleSection('lista-diaria'));

function toggleSection(sectionId) {
    console.log('Abriendo sección:', sectionId);
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    if (sectionId === 'alimentos') {
        mostrarAlimentos(''); // Mostrar lista completa al abrir
    }
}

// ==================== METABOLISMO BASAL (TÚ CÓDIGO ORIGINAL) ====================
// Calcular metabolismo - ESTE ES TU CÓDIGO ORIGINAL
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

// ==================== BUSCAR Y MOSTRAR ALIMENTOS ====================
function buscarAlimentosDB(filtro = '') {
    const busqueda = filtro.toLowerCase().trim();
    
    if (!busqueda) {
        return alimentosDB.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    
    return alimentosDB.filter(alimento => 
        alimento.nombre.toLowerCase().includes(busqueda) ||
        alimento.categoria.toLowerCase().includes(busqueda)
    ).sort((a, b) => a.nombre.localeCompare(b.nombre));
}

function mostrarAlimentos(filtro = '') {
    console.log('Buscando alimentos con filtro:', filtro);
    const lista = document.getElementById('lista-alimentos');
    lista.innerHTML = '';
    
    const resultados = buscarAlimentosDB(filtro);
    
    if (resultados.length > 0) {
        resultados.forEach(alimento => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="alimento-item">
                    <strong style="font-size: 1.1em; color: #2c3e50;">${alimento.nombre}</strong>
                    <span class="categoria-badge">${alimento.categoria}</span>
                    <br>
                    <small style="font-size: 0.9em; color: #666;">
                        <strong>Nutrientes por 100g:</strong><br>
                        🔥 Calorías: ${alimento.calorias} cal | 🥚 Proteínas: ${alimento.proteinas}g<br>
                        🍞 Carbohidratos: ${alimento.carbohidratos}g | 🥑 Grasas: ${alimento.grasas}g<br>
                        🌾 Fibra: ${alimento.fibra}g | 🍬 Azúcar: ${alimento.azucar}g | 🧂 Sodio: ${alimento.sodio}mg
                    </small>
                    ${alimento.nota ? `<br><em style="font-size: 0.85em; color: #7f8c8d;">Nota: ${alimento.nota}</em>` : ''}
                </div>
            `;
            lista.appendChild(li);
        });
        
        const contador = document.createElement('p');
        contador.style.fontSize = '0.9em';
        contador.style.color = '#7f8c8d';
        contador.style.marginTop = '10px';
        contador.textContent = `Mostrando ${resultados.length} alimento(s)`;
        lista.appendChild(contador);
    } else {
        lista.innerHTML = '<li style="color: #e74c3c;">No se encontraron alimentos. Prueba con otro nombre.</li>';
    }
}

document.getElementById('buscar-alimento').addEventListener('input', function() {
    mostrarAlimentos(this.value);
});

// ==================== LISTA DIARIA DE COMIDAS ====================
function buscarAlimentosDiarios(filtro) {
    const lista = document.getElementById('resultados-busqueda');
    lista.innerHTML = '';
    
    if (!filtro.trim()) return;
    
    const resultados = buscarAlimentosDB(filtro).slice(0, 5);
    
    if (resultados.length > 0) {
        resultados.forEach(alimento => {
            const li = document.createElement('li');
            li.className = 'resultado-busqueda';
            
            li.innerHTML = `
                <div>
                    <strong>${alimento.nombre}</strong><br>
                    <small>${alimento.calorias} cal/100g | P:${alimento.proteinas}g C:${alimento.carbohidratos}g G:${alimento.grasas}g</small>
                </div>
            `;
            
            const btnSeleccionar = document.createElement('button');
            btnSeleccionar.textContent = 'Seleccionar';
            btnSeleccionar.className = 'btn-seleccionar';
            btnSeleccionar.addEventListener('click', () => {
                selectedFood = {
                    id: alimento.id,
                    name: alimento.nombre,
                    calorias: alimento.calorias,
                    proteinas: alimento.proteinas,
                    carbohidratos: alimento.carbohidratos,
                    grasas: alimento.grasas,
                    fibra: alimento.fibra,
                    sodio: alimento.sodio
                };
                lista.innerHTML = `<li class="seleccionado"><strong>✅ Seleccionado: ${alimento.nombre}</strong></li>`;
            });
            
            li.appendChild(btnSeleccionar);
            lista.appendChild(li);
        });
    } else {
        lista.innerHTML = '<li style="color: #e74c3c;">No se encontró el alimento. Agréguelo manualmente.</li>';
    }
}

document.getElementById('buscar-alimento-diario').addEventListener('input', function() {
    buscarAlimentosDiarios(this.value);
});

document.getElementById('agregar-comida').addEventListener('click', function() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseFloat(cantidadInput.value);
    
    if (selectedFood && cantidad > 0) {
        const factor = cantidad / 100;
        
        const comidaAgregada = {
            ...selectedFood,
            cantidad: cantidad,
            caloriasTotales: (selectedFood.calorias * factor).toFixed(1),
            proteinasTotales: (selectedFood.proteinas * factor).toFixed(1),
            carbohidratosTotales: (selectedFood.carbohidratos * factor).toFixed(1),
            grasasTotales: (selectedFood.grasas * factor).toFixed(1),
            fibraTotal: (selectedFood.fibra * factor).toFixed(1),
            sodioTotal: (selectedFood.sodio * factor).toFixed(0)
        };
        
        listaDiaria.push(comidaAgregada);
        actualizarListaDiaria();
        
        cantidadInput.value = '';
        selectedFood = null;
        document.getElementById('resultados-busqueda').innerHTML = '';
        document.getElementById('buscar-alimento-diario').value = '';
    } else {
        alert('Por favor selecciona un alimento y escribe una cantidad en gramos.');
    }
});

function actualizarListaDiaria() {
    const lista = document.getElementById('lista-comidas');
    lista.innerHTML = '';
    
    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalCarbohidratos = 0;
    let totalGrasas = 0;
    
    listaDiaria.forEach((item, index) => {
        const cal = parseFloat(item.caloriasTotales);
        const prot = parseFloat(item.proteinasTotales);
        const carb = parseFloat(item.carbohidratosTotales);
        const grasa = parseFloat(item.grasasTotales);
        
        totalCalorias += cal;
        totalProteinas += prot;
        totalCarbohidratos += carb;
        totalGrasas += grasa;
        
        const li = document.createElement('li');
        li.className = 'comida-item';
        li.innerHTML = `
            <div class="comida-header">
                <strong>${item.name}</strong>
                <span class="comida-cantidad">${item.cantidad}g</span>
            </div>
            <div class="comida-nutrientes">
                🔥 ${cal.toFixed(0)} cal | 🥚 ${prot.toFixed(1)}g P | 🍞 ${carb.toFixed(1)}g C | 🥑 ${grasa.toFixed(1)}g G
            </div>
            ${item.fibraTotal > 0 ? `<small>🌾 Fibra: ${item.fibraTotal}g</small>` : ''}
            ${item.sodioTotal > 0 ? `<small>🧂 Sodio: ${item.sodioTotal}mg</small>` : ''}
        `;
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '✕ Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.addEventListener('click', () => {
            listaDiaria.splice(index, 1);
            actualizarListaDiaria();
        });
        
        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });
    
    document.getElementById('total-calorias').innerHTML = `
        <div class="total-header">
            <h3>📊 Resumen del Día</h3>
        </div>
        <div class="total-stats">
            <div class="stat">
                <span class="stat-label">🔥 Calorías:</span>
                <span class="stat-value">${totalCalorias.toFixed(0)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">🥚 Proteínas:</span>
                <span class="stat-value">${totalProteinas.toFixed(1)}g</span>
            </div>
            <div class="stat">
                <span class="stat-label">🍞 Carbohidratos:</span>
                <span class="stat-value">${totalCarbohidratos.toFixed(1)}g</span>
            </div>
            <div class="stat">
                <span class="stat-label">🥑 Grasas:</span>
                <span class="stat-value">${totalGrasas.toFixed(1)}g</span>
            </div>
        </div>
    `;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Base de datos cargada con', alimentosDB.length, 'alimentos venezolanos');
});