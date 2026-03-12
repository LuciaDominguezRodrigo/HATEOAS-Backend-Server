const BASE_URL = process.env.API_URL || "http://localhost:3000/reservations";

export const buildReservationResponse = (reservation) => {
  const links = [
    { rel: "self", method: "GET", href: `${BASE_URL}/${reservation.id}` }
  ];

  // Si la reserva está CANCELADA, es un estado terminal (solo lectura)
  if (reservation.status === "CANCELLED") {
    return { ...reservation, _links: links };
  }

  // Links disponibles solo si NO se ha hecho Check-in
  if (!reservation.checkedIn) {
    links.push({ rel: "cancel", method: "POST", href: `${BASE_URL}/${reservation.id}/cancel` });
    links.push({ rel: "change-time", method: "PUT", href: `${BASE_URL}/${reservation.id}/change-time` });
    links.push({ rel: "change-passengers", method: "PUT", href: `${BASE_URL}/${reservation.id}/change-passengers` });
    links.push({ rel: "check-in", method: "POST", href: `${BASE_URL}/${reservation.id}/check-in` });
  }

  // Add-baggage suele permitirse mientras la reserva esté activa
  links.push({ rel: "add-baggage", method: "POST", href: `${BASE_URL}/${reservation.id}/add-baggage` });

  // Upgrade de clase: Solo si el pasajero está en Economy
  if (reservation.seatClass === "Economy") {
    links.push({ rel: "upgrade-class", method: "PUT", href: `${BASE_URL}/${reservation.id}/upgrade-class` });
  }

  return {
    ...reservation,
    _links: links
  };
};