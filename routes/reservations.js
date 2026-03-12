import express from "express";
import {
  createReservation, getReservation, cancelReservation,
  changeFlightTime, changePassengers, checkIn,
  upgradeClass, addBaggage
} from "../services/reservationService.js";
import { buildReservationResponse } from "../utils/hateoas.js";

const router = express.Router();

router.post("/", (req, res) => {
  const reservation = createReservation(req.body);
  res.status(201).json(buildReservationResponse(reservation));
});

router.get("/:id", (req, res) => {
  const reservation = getReservation(req.params.id);
  if (!reservation) return res.sendStatus(404);
  res.json(buildReservationResponse(reservation));
});

router.post("/:id/cancel", (req, res) => {
  const reservation = cancelReservation(req.params.id);
  if (!reservation) return res.sendStatus(404);
  res.json(buildReservationResponse(reservation));
});

router.put("/:id/change-time", (req, res) => {
  const reservation = changeFlightTime(req.params.id, req.body.newTime);
  if (!reservation) return res.sendStatus(404);
  res.json(buildReservationResponse(reservation));
});

router.put("/:id/change-passengers", (req, res) => {
  const reservation = changePassengers(req.params.id, req.body.newCount);
  if (!reservation) return res.sendStatus(404);
  res.json(buildReservationResponse(reservation));
});

router.post("/:id/check-in", (req, res) => {
  const reservation = checkIn(req.params.id);
  if (!reservation) return res.sendStatus(404);
  res.json(buildReservationResponse(reservation));
});

router.put("/:id/upgrade-class", (req, res) => {
  const reservation = upgradeClass(req.params.id, req.body.newClass);
  if (!reservation) return res.sendStatus(404);
  res.json(buildReservationResponse(reservation));
});

router.post("/:id/add-baggage", (req, res) => {
  const result = addBaggage(req.params.id, req.body.count);
  if (result?.error === "NOT_FOUND") return res.status(404).json({ error: "Reservation not found" });
  if (result?.error === "CANCELLED") return res.status(400).json({ error: "Reservation is cancelled" });
  if (result?.error === "INVALID_BAGGAGE") return res.status(400).json({ error: "Invalid baggage count" });
  res.json(buildReservationResponse(result));
});

export default router;