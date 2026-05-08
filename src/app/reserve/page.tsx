"use client";

import { useState } from "react";
import { MapPin, Clock, Car, ChevronRight, AlertCircle } from "lucide-react";
import { theme } from "../../lib/theme";

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
  distance: number;
  rating: number;
}

// Mock data - будуу Firebase-ээс авна
const mockParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "Стар Плаза",
    address: "Сухэ-Батора өргөн чөлөө 13",
    totalSpots: 150,
    availableSpots: 45,
    pricePerHour: 5000,
    distance: 0.8,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Марджан төв",
    address: "Энхтайвны өргөн чөлөө 11",
    totalSpots: 200,
    availableSpots: 120,
    pricePerHour: 4500,
    distance: 1.2,
    rating: 4.2,
  },
  {
    id: "3",
    name: "Мегамол",
    address: "Чойн короо, Баруун хүрээ",
    totalSpots: 300,
    availableSpots: 85,
    pricePerHour: 5500,
    distance: 2.1,
    rating: 4.8,
  },
];

export default function ReservePage() {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const currentSpot = mockParkingSpots.find((spot) => spot.id === selectedSpot);
  const totalPrice = currentSpot ? currentSpot.pricePerHour * selectedHours : 0;

  const handleReserve = () => {
    if (selectedSpot) {
      console.log("Захиалга үүсгэх:", {
        spotId: selectedSpot,
        hours: selectedHours,
        totalPrice,
      });
      // Firebase-д илгээх
      alert(`Захиалга үүссэн: ${currentSpot?.name} - ${selectedHours} цаг`);
    }
  };

  return (
    <div
      style={{
        padding: `${theme.spacing.md} ${theme.spacing.md}`,
        paddingBottom: `${theme.spacing.xl}`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <h1
          style={{
            fontSize: theme.fontSize.xxl,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
          }}
        >
          Зогсоол сонгоно уу
        </h1>
        <p
          style={{
            fontSize: theme.fontSize.md,
            color: theme.colors.textMuted,
          }}
        >
          Ойр дахь зогсоолуудын жагсаалт
        </p>
      </div>

      {/* Parking Spots List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.lg,
        }}
      >
        {mockParkingSpots.map((spot) => (
          <div
            key={spot.id}
            onClick={() => {
              setSelectedSpot(spot.id);
              setShowBookingForm(true);
            }}
            style={{
              backgroundColor:
                selectedSpot === spot.id
                  ? theme.colors.primary
                  : theme.colors.surface,
              border: `2px solid ${selectedSpot === spot.id ? theme.colors.accent : "transparent"}`,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (selectedSpot !== spot.id) {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSpot !== spot.id) {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            {/* Availability Badge */}
            {spot.availableSpots === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: theme.spacing.sm,
                  right: theme.spacing.sm,
                  backgroundColor: theme.colors.error,
                  color: "white",
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  borderRadius: theme.borderRadius.sm,
                  fontSize: theme.fontSize.sm,
                  fontWeight: "bold",
                }}
              >
                Дүүрсэн
              </div>
            )}

            {/* Spot Name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: theme.spacing.sm,
              }}
            >
              <h3
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: "bold",
                  color: theme.colors.text,
                }}
              >
                {spot.name}
              </h3>
              <ChevronRight size={20} color={theme.colors.accent} />
            </div>

            {/* Address */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
                color: theme.colors.textMuted,
                fontSize: theme.fontSize.sm,
              }}
            >
              <MapPin size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
              <span>{spot.address}</span>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.md,
                padding: `${theme.spacing.sm} 0`,
                borderTop: `1px solid rgba(255,255,255,0.1)`,
                borderBottom: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              {/* Available Spots */}
              <div>
                <div
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.textMuted,
                    marginBottom: "2px",
                  }}
                >
                  Боогт байна
                </div>
                <div
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: "bold",
                    color:
                      spot.availableSpots > 50
                        ? theme.colors.accent
                        : theme.colors.text,
                  }}
                >
                  {spot.availableSpots}/{spot.totalSpots}
                </div>
              </div>

              {/* Distance */}
              <div>
                <div
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.textMuted,
                    marginBottom: "2px",
                  }}
                >
                  Зай
                </div>
                <div
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: "bold",
                    color: theme.colors.text,
                  }}
                >
                  {spot.distance} км
                </div>
              </div>

              {/* Rating */}
              <div>
                <div
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.textMuted,
                    marginBottom: "2px",
                  }}
                >
                  Үнэлгээ
                </div>
                <div
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: "bold",
                    color: theme.colors.accent,
                  }}
                >
                  ⭐ {spot.rating}
                </div>
              </div>
            </div>

            {/* Price */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: theme.fontSize.md,
                  color: theme.colors.textMuted,
                }}
              >
                Цаг тутамд
              </span>
              <span
                style={{
                  fontSize: theme.fontSize.xl,
                  fontWeight: "bold",
                  color: theme.colors.accent,
                }}
              >
                ₮{spot.pricePerHour.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && currentSpot && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 100,
          }}
          onClick={() => setShowBookingForm(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "390px",
              margin: "0 auto",
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.borderRadius.lg,
              borderTopRightRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              maxHeight: "70vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div
              style={{
                textAlign: "right",
                marginBottom: theme.spacing.md,
              }}
            >
              <button
                onClick={() => setShowBookingForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSize.xl,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Selected Spot Info */}
            <div
              style={{
                marginBottom: theme.spacing.lg,
                backgroundColor: theme.colors.primary,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
              }}
            >
              <h2
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: "bold",
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {currentSpot.name}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSize.sm,
                }}
              >
                <MapPin size={16} />
                {currentSpot.address}
              </div>
            </div>

            {/* Duration Selection */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label
                style={{
                  display: "block",
                  fontSize: theme.fontSize.md,
                  fontWeight: "bold",
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                }}
              >
                <Clock
                  size={16}
                  style={{ marginRight: theme.spacing.xs, display: "inline" }}
                />
                Цагийн урт сонгоно уу
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: theme.spacing.sm,
                }}
              >
                {[1, 2, 3, 4, 6, 8].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setSelectedHours(hours)}
                    style={{
                      padding: theme.spacing.md,
                      borderRadius: theme.borderRadius.md,
                      border: `2px solid ${selectedHours === hours ? theme.colors.accent : "transparent"}`,
                      backgroundColor:
                        selectedHours === hours
                          ? theme.colors.primary
                          : theme.colors.surface,
                      color:
                        selectedHours === hours
                          ? theme.colors.accent
                          : theme.colors.text,
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {hours}ц
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div
              style={{
                backgroundColor: theme.colors.primary,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                marginBottom: theme.spacing.lg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: theme.spacing.sm,
                  fontSize: theme.fontSize.md,
                }}
              >
                <span style={{ color: theme.colors.textMuted }}>Үнэ (цаг)</span>
                <span style={{ color: theme.colors.text }}>
                  ₮{currentSpot.pricePerHour.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: theme.spacing.sm,
                  fontSize: theme.fontSize.md,
                }}
              >
                <span style={{ color: theme.colors.textMuted }}>
                  Цагийн тоо
                </span>
                <span style={{ color: theme.colors.text }}>
                  {selectedHours}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: theme.spacing.sm,
                  borderTop: `1px solid rgba(255,255,255,0.1)`,
                  fontSize: theme.fontSize.lg,
                  fontWeight: "bold",
                }}
              >
                <span style={{ color: theme.colors.textMuted }}>Нийт</span>
                <span style={{ color: theme.colors.accent }}>
                  ₮{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Warning if no spots available */}
            {currentSpot.availableSpots === 0 && (
              <div
                style={{
                  display: "flex",
                  gap: theme.spacing.sm,
                  backgroundColor: `${theme.colors.error}20`,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.lg,
                  marginBottom: theme.spacing.lg,
                  alignItems: "flex-start",
                }}
              >
                <AlertCircle
                  size={20}
                  color={theme.colors.error}
                  style={{ marginTop: "2px", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.error,
                  }}
                >
                  Энэ зогсоолд боогт зай байхгүй
                </span>
              </div>
            )}

            {/* Reserve Button */}
            <button
              onClick={handleReserve}
              disabled={currentSpot.availableSpots === 0}
              style={{
                width: "100%",
                padding: theme.spacing.md,
                backgroundColor:
                  currentSpot.availableSpots === 0
                    ? theme.colors.textMuted
                    : theme.colors.accent,
                color:
                  currentSpot.availableSpots === 0
                    ? theme.colors.surface
                    : theme.colors.primary,
                borderRadius: theme.borderRadius.md,
                border: "none",
                fontSize: theme.fontSize.lg,
                fontWeight: "bold",
                cursor:
                  currentSpot.availableSpots === 0 ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentSpot.availableSpots > 0) {
                  e.currentTarget.style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <Car
                size={20}
                style={{ marginRight: theme.spacing.sm, display: "inline" }}
              />
              Захиалга үүсгэх
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
