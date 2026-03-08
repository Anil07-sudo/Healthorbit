import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE = "https://healthorbit-backend.onrender.com"; // change if needed

const VerifyPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search || "");
        const sessionId = params.get("session_id");

        // If user cancelled payment
        if (location.pathname === "/appointment/cancel") {
          if (!cancelled) {
            toast.error("Payment Cancelled");
            navigate("/appointments?payment_status=Cancelled", {
              replace: true,
            });
          }
          return;
        }

        // If no session id
        if (!sessionId) {
          if (!cancelled) {
            toast.error("Payment Failed");
            navigate("/appointments?payment_status=Failed", {
              replace: true,
            });
          }
          return;
        }

        // Call backend confirm API
        const res = await axios.get(
          `${API_BASE}/api/appointments/confirm`,
          {
            params: { session_id: sessionId },
            timeout: 15000,
          }
        );

        if (cancelled) return;

        if (res?.data?.success) {
          toast.success("Payment Successful 🎉");
          navigate("/appointments?payment_status=Paid", {
            replace: true,
          });
        } else {
          toast.error("Payment Verification Failed");
          navigate("/appointments?payment_status=Failed", {
            replace: true,
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Payment verification error:", error);
          toast.error("Something went wrong");
          navigate("/appointments?payment_status=Failed", {
            replace: true,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return null;
  
};

export default VerifyPaymentPage;