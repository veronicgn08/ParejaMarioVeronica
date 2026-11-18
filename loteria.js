// Guardará los resultados del sorteo actual
let resultadosSorteo = null;

// Formatea un número (ej: 45 -> "00045")
function formatearNumero(num) {
  return num.toString().padStart(5, '0');
}

// Genera el sorteo completo (3 premios grandes + 1.794 pedreas de 100€)
function realizarSorteo() {
  // Crear bombo del 0 al 99999
  const bombo = Array.from({ length: 100000 }, (_, i) => i);
  
  // Mezclar el bombo (Algoritmo Fisher-Yates)
  for (let i = bombo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bombo[i], bombo[j]] = [bombo[j], bombo[i]];
  }

  // Extraer bolas sin repetición
  const gordo = formatearNumero(bombo[0]);
  const segundo = formatearNumero(bombo[1]);
  const tercero = formatearNumero(bombo[2]);
  
  // Las siguientes 1794 bolas son la pedrea (100€ al décimo)
  const pedrea = new Set(bombo.slice(3, 1797).map(formatearNumero));

  return { gordo, segundo, tercero, pedrea };
}

// Comprueba cuánto ha ganado un número
function comprobarNumero(numero) {
  if (!resultadosSorteo) return "Primero debes realizar el sorteo.";
  if (!/^\d{5}$/.test(numero)) return "⚠️ Introduce un número válido de 5 cifras.";

  const { gordo, segundo, tercero, pedrea } = resultadosSorteo;
  let premio = 0;
  let motivo = "";

  // 1. Premios principales
  if (numero === gordo) {
    premio = 400000;
    motivo = "¡EL GORDO!";
  } else if (numero === segundo) {
    premio = 125000;
    motivo = "¡Segundo Premio!";
  } else if (numero === tercero) {
    premio = 50000;
    motivo = "¡Tercer Premio!";
  } else if (pedrea.has(numero)) {
    premio = 100;
    motivo = "¡La Pedrea!";
  }

  // 2. Comprobar Reintegro (última cifra igual a la del Gordo)
  const reintegroGordo = gordo.slice(-1);
  if (numero.slice(-1) === reintegroGordo && numero !== gordo) {
    premio += 20;
    motivo += motivo ? " + Reintegro" : "Reintegro";
  }

  if (premio > 0) {
    return `🎉 ¡Enhorabuena! Has ganado ${premio.toLocaleString('es-ES')} € (${motivo})`;
  } else {
    return "❌ Lo sentimos, este décimo no tiene premio.";
  }
}

// --- EVENTOS DEL DOM ---
document.getElementById('btn-sortear').addEventListener('click', () => {
  resultadosSorteo = realizarSorteo();

  document.getElementById('premio-1').textContent = resultadosSorteo.gordo;
  document.getElementById('premio-2').textContent = resultadosSorteo.segundo;
  document.getElementById('premio-3').textContent = resultadosSorteo.tercero;

  document.getElementById('panel-resultados').classList.remove('oculto');
  document.getElementById('mensaje-resultado').textContent = "";
});

document.getElementById('btn-comprobar').addEventListener('click', () => {
  const input = document.getElementById('input-decimo').value.trim();
  const mensaje = comprobarNumero(input);
  document.getElementById('mensaje-resultado').textContent = mensaje;
});
