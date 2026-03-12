import fetch from "node-fetch";

const BASE_URL = process.env.API_URL || "http://localhost:3000";

async function runFlow() {
  console.log("--- PASO 1: Creando reserva inicial (Estado: BOOKED) ---");
  let res = await fetch(`${BASE_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flightTime: "10:00", passengers: 2 })
  });
  let data = await res.json();
  console.log(JSON.stringify(data, null, 2), "\n");

  const id = data.id;

  console.log("--- PASO 1.1: Añadiendo equipaje ---");
  res = await fetch(`${BASE_URL}/reservations/${id}/add-baggage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count: 2 })
  });
  data = await res.json();
  console.log(JSON.stringify(data, null, 2), "\n");

  console.log("--- PASO 2: Realizando Check-in (Se eliminan links de modificación) ---");
  res = await fetch(`${BASE_URL}/reservations/${id}/check-in`, { method: "POST" });
  data = await res.json();
  console.log(JSON.stringify(data, null, 2), "\n");

  console.log("--- PASO 3: Upgrade a Business Class (Se elimina link de upgrade) ---");
  res = await fetch(`${BASE_URL}/reservations/${id}/upgrade-class`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newClass: "Business" })
  });
  data = await res.json();
  console.log(JSON.stringify(data, null, 2), "\n");

  console.log("--- PASO 4: Cancelación (Estado terminal: Solo queda link 'self') ---");
  res = await fetch(`${BASE_URL}/reservations/${id}/cancel`, { method: "POST" });
  data = await res.json();
  console.log(JSON.stringify(data, null, 2), "\n");
}

runFlow();