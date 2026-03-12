import { v4 as uuid } from "uuid";

const reservations = new Map();

export const createReservation = ({ flightTime, passengers }) => {
  const id = uuid();
  const reservation = {
    id,
    status: "BOOKED",
    flightTime,
    passengers,
    checkedIn: false,
    seatClass: "Economy",
    baggage: 0
  };
  reservations.set(id, reservation);
  return reservation;
};

export const getReservation = (id) => reservations.get(id);

export const cancelReservation = (id) => {
  const reservation = reservations.get(id);
  if (!reservation) return null;
  reservation.status = "CANCELLED";
  return reservation;
};

export const changeFlightTime = (id, newTime) => {
  const reservation = reservations.get(id);
  if (!reservation) return null;
  reservation.flightTime = newTime;
  return reservation;
};

export const changePassengers = (id, newCount) => {
  const reservation = reservations.get(id);
  if (!reservation) return null;
  reservation.passengers = newCount;
  return reservation;
};

export const checkIn = (id) => {
  const reservation = reservations.get(id);
  if (!reservation) return null;
  reservation.checkedIn = true;
  return reservation;
};

export const upgradeClass = (id, newClass) => {
  const reservation = reservations.get(id);
  if (!reservation) return null;
  reservation.seatClass = newClass;
  return reservation;
};

export const addBaggage = (id, count) => {
  const reservation = reservations.get(id);
  if (!reservation) return { error: "NOT_FOUND" };
  if (reservation.status === "CANCELLED") return { error: "CANCELLED" };
  if (typeof count !== "number" || count <= 0) return { error: "INVALID_BAGGAGE" };
  reservation.baggage += count;
  return reservation;
};