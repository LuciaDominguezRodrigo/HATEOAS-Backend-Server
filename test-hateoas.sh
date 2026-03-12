#!/bin/bash

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="https://iberia-hateoas-104eead00b55.herokuapp.com/reservations"

echo -e "${PURPLE}🚀 INICIANDO TEST DEL FLUJO IBERIA HATEOAS${NC}"
echo "---------------------------------------------------"

# 1. CREAR RESERVA
echo -e "${BLUE}Step 1: Creando reserva...${NC}"
RESPONSE=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d '{"flightTime": "20:00", "passengers": 3}')
ID=$(echo $RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✅ Reserva creada con ID: $ID${NC}"
echo "JSON inicial (Estado BOOKED):"
echo $RESPONSE | python3 -m json.tool

# 2. AÑADIR EQUIPAJE
echo -e "\n${BLUE}Step 2: Añadiendo equipaje...${NC}"
curl -s -X POST "$API_URL/$ID/add-baggage" -H "Content-Type: application/json" -d '{"count": 2}' | python3 -m json.tool
echo -e "${GREEN}✅ Equipaje actualizado.${NC}"

# 3. CHECK-IN
echo -e "\n${YELLOW}Step 3: Realizando Check-in (¡Cambio de estado!)${NC}"
RESPONSE_CHECKIN=$(curl -s -X POST "$API_URL/$ID/check-in")
echo -e "${CYAN}⚠️  Observa como desaparecen los links de 'cancel' y 'change-time' en el JSON:${NC}"
echo $RESPONSE_CHECKIN | python3 -m json.tool

# 4. UPGRADE
echo -e "\n${BLUE}Step 4: Solicitando Upgrade a Business...${NC}"
curl -s -X PUT "$API_URL/$ID/upgrade-class" -H "Content-Type: application/json" -d '{"newClass": "Business"}' | python3 -m json.tool
echo -e "${GREEN}✅ Clase Business confirmada.${NC}"

# 5. CANCELAR (Estado Terminal)
echo -e "\n${PURPLE}Step 5: Cancelando reserva (Estado final)${NC}"
curl -s -X POST "$API_URL/$ID/cancel" | python3 -m json.tool

echo -e "\n${GREEN}🏁 FLUJO COMPLETADO CON ÉXITO${NC}"