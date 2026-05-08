"use client";

import { useState } from "react";
import {
  User,
  Car,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Edit2,
  LogOut,
  ChevronRight,
  Award,
} from "lucide-react";
import { theme } from "../../lib/theme";

interface Booking {
  id: string;
  spotName: string;
  location: string;
  date: string;
  startTime: string;
  duration: number;
  totalPrice: number;
  status: "completed" | "upcoming" | "cancelled";
}

// Mock user data
const mockUserData = {
  name: "Төмөр Баатар",
  email: "tomorbaatar@email.com",
  phoneNumber: "+976 9911 2345",
  carNumber: "УБ 123 АВ",
  carModel: "Toyota Camry",
  carColor: "Цагаан",
  memberSince: "2024 оны 1-р сарын 15",
  totalBookings: 24,
  totalSpent: 480000,
};

// Mock booking history
const mockBookingHistory: Booking[] = [
  {
    id: "1",
    spotName: "Стар Плаза",
    location: "Сухэ-Батора өргөн чөлөө 13",
    date: "2024-05-07",
    startTime: "14:30",
    duration: 2,
    totalPrice: 10000,
    status: "completed",
  },
  {
    id: "2",
    spotName: "Марджан төв",
    location: "Энхтайвны өргөн чөлөө 11",
    date: "2024-05-06",
    startTime: "09:00",
    duration: 3,
    totalPrice: 13500,
    status: "completed",
  },
  {
    id: "3",
    spotName: "Мегамол",
    location: "Чойн короо, Баруун хүрээ",
    date: "2024-05-10",
    startTime: "16:00",
    duration: 4,
    totalPrice: 22000,
    status: "upcoming",
  },
  {
    id: "4",
    spotName: "Стар Плаза",
    location: "Сухэ-Батора өргөн чөлөө 13",
    date: "2024-05-05",
    startTime: "11:00",
    duration: 1,
    totalPrice: 5000,
    status: "completed",
  },
  {
    id: "5",
    spotName: "Марджан төв",
    location: "Энхтайвны өргөн чөлөө 11",
    date: "2024-05-03",
    startTime: "13:00",
    duration: 2,
    totalPrice: 9000,
    status: "completed",
  },
];

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return { text: "Төгөлдөрсөн", color: theme.colors.accent };
    case "upcoming":
      return { text: "Удахгүй", color: "#3B82F6" };
    case "cancelled":
      return { text: "Цуцалсан", color: theme.colors.error };
    default:
      return { text: status, color: theme.colors.textMuted };
  }
};

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUserData.name,
    phoneNumber: mockUserData.phoneNumber,
    carNumber: mockUserData.carNumber,
    carModel: mockUserData.carModel,
    carColor: mockUserData.carColor,
  });

  const handleSave = () => {
    console.log("Шинэчилсэн өгөгдөл:", formData);
    setIsEditMode(false);
  };

  return (
    <div
      style={{
        padding: `${theme.spacing.md} ${theme.spacing.md}`,
        paddingBottom: `${theme.spacing.xl}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.lg,
        }}
      >
        <h1
          style={{
            fontSize: theme.fontSize.xxl,
            fontWeight: "bold",
            color: theme.colors.text,
          }}
        >
          Миний профайл
        </h1>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          style={{
            background: "none",
            border: "none",
            color: theme.colors.accent,
            cursor: "pointer",
            padding: theme.spacing.sm,
          }}
        >
          <Edit2 size={20} />
        </button>
      </div>

      {/* User Profile Card */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          border: `1px solid rgba(0, 230, 118, 0.2)`,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: theme.colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `3px solid ${theme.colors.accent}`,
            }}
          >
            <User size={40} color={theme.colors.accent} />
          </div>
        </div>

        {/* User Name */}
        {isEditMode ? (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: theme.spacing.md,
              backgroundColor: theme.colors.primary,
              border: `1px solid ${theme.colors.accent}`,
              borderRadius: theme.borderRadius.md,
              color: theme.colors.text,
              fontSize: theme.fontSize.lg,
              fontWeight: "bold",
              marginBottom: theme.spacing.sm,
              textAlign: "center",
            }}
          />
        ) : (
          <h2
            style={{
              fontSize: theme.fontSize.xl,
              fontWeight: "bold",
              color: theme.colors.text,
              textAlign: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            {formData.name}
          </h2>
        )}

        {/* Email & Phone */}
        <div
          style={{
            textAlign: "center",
            marginBottom: theme.spacing.md,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
          }}
        >
          <p>{mockUserData.email}</p>
          {isEditMode ? (
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              style={{
                width: "100%",
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.primary,
                border: `1px solid ${theme.colors.accent}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text,
                marginTop: theme.spacing.sm,
              }}
            />
          ) : (
            <p>{formData.phoneNumber}</p>
          )}
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: theme.spacing.md,
            paddingTop: theme.spacing.md,
            borderTop: `1px solid rgba(255,255,255,0.1)`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: theme.fontSize.xl,
                fontWeight: "bold",
                color: theme.colors.accent,
                marginBottom: theme.spacing.xs,
              }}
            >
              {mockUserData.totalBookings}
            </div>
            <div
              style={{
                fontSize: theme.fontSize.sm,
                color: theme.colors.textMuted,
              }}
            >
              Нийт захиалга
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: theme.fontSize.xl,
                fontWeight: "bold",
                color: theme.colors.accent,
                marginBottom: theme.spacing.xs,
              }}
            >
              ₮{(mockUserData.totalSpent / 1000).toFixed(0)}K
            </div>
            <div
              style={{
                fontSize: theme.fontSize.sm,
                color: theme.colors.textMuted,
              }}
            >
              Нийт төлсөн
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
            textAlign: "center",
            marginTop: theme.spacing.md,
            paddingTop: theme.spacing.md,
            borderTop: `1px solid rgba(255,255,255,0.1)`,
          }}
        >
          <Award
            size={16}
            style={{ display: "inline", marginRight: theme.spacing.xs }}
          />
          Гишүүнээс хойш: {mockUserData.memberSince}
        </div>
      </div>

      {/* Vehicle Information */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
        }}
      >
        <h3
          style={{
            fontSize: theme.fontSize.lg,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Car size={20} color={theme.colors.accent} />
          Машины мэдээлэл
        </h3>

        {/* Car Number */}
        <div style={{ marginBottom: theme.spacing.md }}>
          <label
            style={{
              display: "block",
              fontSize: theme.fontSize.sm,
              color: theme.colors.textMuted,
              marginBottom: theme.spacing.xs,
              fontWeight: "bold",
            }}
          >
            Машины дугаар
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={formData.carNumber}
              onChange={(e) =>
                setFormData({ ...formData, carNumber: e.target.value })
              }
              style={{
                width: "100%",
                padding: theme.spacing.md,
                backgroundColor: theme.colors.primary,
                border: `1px solid ${theme.colors.accent}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text,
                fontSize: theme.fontSize.md,
                fontWeight: "bold",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: theme.fontSize.lg,
                fontWeight: "bold",
                color: theme.colors.accent,
                backgroundColor: theme.colors.primary,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                textAlign: "center",
                letterSpacing: "2px",
              }}
            >
              {formData.carNumber}
            </div>
          )}
        </div>

        {/* Car Model */}
        <div style={{ marginBottom: theme.spacing.md }}>
          <label
            style={{
              display: "block",
              fontSize: theme.fontSize.sm,
              color: theme.colors.textMuted,
              marginBottom: theme.spacing.xs,
              fontWeight: "bold",
            }}
          >
            Машины төрөл
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={formData.carModel}
              onChange={(e) =>
                setFormData({ ...formData, carModel: e.target.value })
              }
              style={{
                width: "100%",
                padding: theme.spacing.md,
                backgroundColor: theme.colors.primary,
                border: `1px solid ${theme.colors.accent}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text,
              }}
            />
          ) : (
            <div
              style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text,
                fontSize: theme.fontSize.md,
              }}
            >
              {formData.carModel}
            </div>
          )}
        </div>

        {/* Car Color */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: theme.fontSize.sm,
              color: theme.colors.textMuted,
              marginBottom: theme.spacing.xs,
              fontWeight: "bold",
            }}
          >
            Машины өнгө
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={formData.carColor}
              onChange={(e) =>
                setFormData({ ...formData, carColor: e.target.value })
              }
              style={{
                width: "100%",
                padding: theme.spacing.md,
                backgroundColor: theme.colors.primary,
                border: `1px solid ${theme.colors.accent}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text,
              }}
            />
          ) : (
            <div
              style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text,
                fontSize: theme.fontSize.md,
              }}
            >
              {formData.carColor}
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditMode && (
          <button
            onClick={handleSave}
            style={{
              width: "100%",
              marginTop: theme.spacing.md,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.accent,
              color: theme.colors.primary,
              borderRadius: theme.borderRadius.md,
              border: "none",
              fontSize: theme.fontSize.md,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Хадгалах
          </button>
        )}
      </div>

      {/* Booking History */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <h3
          style={{
            fontSize: theme.fontSize.lg,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Calendar size={20} color={theme.colors.accent} />
          Захиалгын түүх
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.md,
          }}
        >
          {mockBookingHistory.map((booking) => {
            const statusLabel = getStatusLabel(booking.status);
            return (
              <div
                key={booking.id}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.accent;
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: theme.fontSize.md,
                        fontWeight: "bold",
                        color: theme.colors.text,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {booking.spotName}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                        color: theme.colors.textMuted,
                        fontSize: theme.fontSize.sm,
                      }}
                    >
                      <MapPin size={14} />
                      {booking.location}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: `${statusLabel.color}20`,
                      color: statusLabel.color,
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      borderRadius: theme.borderRadius.sm,
                      fontSize: theme.fontSize.sm,
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {statusLabel.text}
                  </div>
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing.sm,
                    paddingTop: theme.spacing.sm,
                    borderTop: `1px solid rgba(255,255,255,0.1)`,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {/* Date & Time */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.xs,
                      color: theme.colors.textMuted,
                      fontSize: theme.fontSize.sm,
                    }}
                  >
                    <Calendar size={14} />
                    {booking.date} {booking.startTime}
                  </div>

                  {/* Duration */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.xs,
                      color: theme.colors.textMuted,
                      fontSize: theme.fontSize.sm,
                    }}
                  >
                    <Clock size={14} />
                    {booking.duration} цаг
                  </div>
                </div>

                {/* Price & Action */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.xs,
                      color: theme.colors.accent,
                      fontSize: theme.fontSize.md,
                      fontWeight: "bold",
                    }}
                  >
                    <DollarSign size={16} />₮
                    {booking.totalPrice.toLocaleString()}
                  </div>
                  <ChevronRight size={16} color={theme.colors.textMuted} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <button
        style={{
          width: "100%",
          padding: theme.spacing.md,
          backgroundColor: `${theme.colors.error}20`,
          color: theme.colors.error,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.error}`,
          fontSize: theme.fontSize.md,
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.sm,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.error;
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${theme.colors.error}20`;
          e.currentTarget.style.color = theme.colors.error;
        }}
      >
        <LogOut size={20} />
        Гарах
      </button>
    </div>
  );
}
