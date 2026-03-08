import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  FileText,
  IndianRupee,
  Send,
  Phone,
  ChevronsRight,
  MousePointer2Off,
  
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { serviceDetailStyles, iconSize,serviceCardStyles,servicePageStyles, } from "../../dummyStyles";

const placeholderImg = "/placeholder-service.jpg";
const PlaceholderImg = "/placeholder-service.jpg";

const ServiceCard = ({ service }) => {
  const hasSrcSet =
    !!service.imageSrcSet ||
    (!!service.imageSmall && !!service.imageMedium && !!service.imageLarge);

  const src = service.imageUrl || service.image || service.imageSmall || "";
  const srcSet =
    service.imageSrcSet ||
    (service.imageSmall || service.image
      ? `${service.imageSmall || src} 480w, ${
          service.imageMedium || src
        } 768w, ${service.imageLarge || src} 1200w`
      : null);

  const name = service.name || "Service";
  const shortDescription = service.shortDescription || service.about || "";

  return (
    <div className={serviceCardStyles.card}>
      <div className={serviceCardStyles.imageContainer} aria-hidden="true">
        {hasSrcSet ? (
          <picture className={serviceCardStyles.picture}>
            {service.imageWebp && (
              <source srcSet={service.imageWebp} type="image/webp" />
            )}
            {service.imageSrcSet ? (
              <img
                src={src || PlaceholderImg}
                srcSet={service.imageSrcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                alt={name}
                loading="lazy"
                decoding="async"
                className={serviceCardStyles.responsiveImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            ) : (
              <img
                src={src || PlaceholderImg}
                srcSet={srcSet || undefined}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                alt={name}
                loading="lazy"
                decoding="async"
                className={serviceCardStyles.responsiveImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            )}
          </picture>
        ) : (
          <img
            src={src || PlaceholderImg}
            alt={name}
            loading="lazy"
            decoding="async"
            className={serviceCardStyles.fallbackImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceholderImg;
            }}
          />
        )}
      </div>

      <div className={serviceCardStyles.content}>
        <h3 className={serviceCardStyles.serviceName}>{name}</h3>

        <div className={serviceCardStyles.buttonContainer}>
          {service.available ? (
            <Link
              to={`/services/${service.id}`}
              state={{ service: service.raw || service }}
              className={serviceCardStyles.buttonAvailable}
              aria-label={`Book ${name}`}
            >
              <ChevronsRight className="w-5 h-5" aria-hidden="true" />
              Book Now
            </Link>
          ) : (
            <button
              disabled
              className={serviceCardStyles.buttonUnavailable}
              aria-label={`${name} not available`}
            >
              <MousePointer2Off className="w-5 h-5" aria-hidden="true" />
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
const ServiceDetailPage =()=> {
  
  const API_BASE = "https://healthorbit-backend.onrender.com";
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const previewCount = 6;

  async function loadServices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (json && json.message) || `Failed to load services (${res.status})`;
        setError(msg);
        setServices([]);
        setLoading(false);
        return;
      }

      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((s) => {
        const id = s._id || s.id;
        const image = s.imageUrl || s.image || s.imageSmall || "";
        const available =
          typeof s.available === "boolean"
            ? s.available
            : typeof s.availability === "string"
              ? s.availability.toLowerCase() === "available"
              : s.availability === "Available" || s.available === true;

        return {
          id,
          name: s.name || "Service",
          shortDescription: s.shortDescription || s.about || "",
          image,
          imageSmall: s.imageSmall || null,
          imageMedium: s.imageMedium || null,
          imageLarge: s.imageLarge || null,
          imageSrcSet: s.imageSrcSet || null,
          imageWebp: s.imageWebp || null,
          price: s.price ?? s.fee ?? 0,
          available,
          raw: s,
        };
      });

      setServices(normalized);
    } catch (err) {
      console.error("load services error:", err);
      setError("Network error while loading services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, [API_BASE]);

  const shown = services.slice(0, previewCount);
  return (
    <div className={servicePageStyles.pageContainer}>
      <div className={servicePageStyles.maxWidthContainer}>
        
        <header className={servicePageStyles.header}>
          <h1 className={servicePageStyles.title}>Our Diagnostic Services</h1>
          <p className={servicePageStyles.subtitle}>
            Safe, accurate & reliable testing.
          </p>
        </header>

        {/* Error Handling Section (From your screenshot) */}
        {error && (
          <div className={servicePageStyles.errorContainer}>
            <div className={servicePageStyles.errorText}>{error}</div>
            <button 
              onClick={loadServices} 
              className={servicePageStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
  <section className={servicePageStyles.skeletonGrid}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className={servicePageStyles.skeletonCard}>
        <div className={servicePageStyles.skeletonImage}></div>
        <div className={servicePageStyles.skeletonText1}></div>
        <div className={servicePageStyles.skeletonText2}></div>
        <div className={servicePageStyles.skeletonButton}></div>
      </div>
    ))}
  </section>
) : (
  <section className={servicePageStyles.servicesGrid}>
   {shown.length > 0 ? (
  shown.map((s) => (
    <ServiceCard
      key={s.id || s.name}
      service={s}
    />
  ))
) : (
  <div className={servicePageStyles.emptyState}>
    No services available
  </div>
)}
  </section>
)}


    

      </div>
    </div>
  );

  
}
export default ServiceDetailPage;


// const DEFAULT_HOST = "http://localhost:4000".replace(/\/$/, "");

// export default function ServiceDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { isSignedIn, userId, getToken } = useAuth();

//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");

//   const [email, setEmail] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Online");

//   const [service, setService] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);

//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const isValidMobile = (m) => /^\d{10}$/.test(m);

//   const isValidAge = (a) => {
//     if (a === "" || a === null || a === undefined) return false;
//     const n = Number(a);
//     return Number.isInteger(n) && n > 0 && n < 150;
//   };

//   function getClientMissingFields() {
//     const missing = [];
//     if (!customerName || !customerName.trim()) missing.push("patientName");
//     if (!mobile || !isValidMobile(mobile)) missing.push("mobile (10 digits)");
//     if (!selectedDate) missing.push("date");
//     if (!selectedTime) missing.push("time");

//     if (!isValidAge(age)) missing.push("age (positive integer)");
//     if (!gender || !String(gender).trim()) missing.push("gender");
//     return missing;
//   }

//   const isFormValid = () => getClientMissingFields().length === 0;

//   useEffect(() => {
//     let mounted = true;
//     const controller = new AbortController();

//     const endpoints = [
//       `${DEFAULT_HOST}/api/services/${encodeURIComponent(id)}`,
//     ];

//     async function tryFetch() {
//       setLoading(true);
//       setFetchError(null);

//       let lastError = null;
//       for (const url of endpoints) {
//         try {
//           const res = await fetch(url, {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//             signal: controller.signal,
//           });

//           if (res.status === 404) {
//             lastError = new Error(`404 ${url}`);
//             continue;
//           }

//           const contentType = res.headers.get("content-type") || "";
//           if (!res.ok || !contentType.includes("application/json")) {
//             const txt = await res.text().catch(() => "");
//             lastError = new Error(
//               `Bad response ${res.status} at ${url}: ${String(txt).slice(
//                 0,
//                 200,
//               )}`,
//             );
//             continue;
//           }

//           const json = await res.json().catch(() => null);
//           const doc = json?.data ?? json?.service ?? json;

//           if (!doc) {
//             lastError = new Error(`No service data at ${url}`);
//             continue;
//           }

//           const transformed = transformServiceShape(doc);

//           if (!mounted) return;
//           setService(transformed);
//           if (transformed.dates && transformed.dates.length > 0) {
//             setSelectedDate(transformed.dates[0]);
//             setSelectedTime("");
//           }
//           setLoading(false);
//           return;
//         } catch (err) {
//           if (err.name === "AbortError") return;
//           lastError = err;
//           continue;
//         }
//       }

//       if (!mounted) return;
//       console.warn(
//         "All endpoints failed, falling back to local servicesData. Last error:",
//         lastError,
//       );
//       const local =
//         servicesData && servicesData.find((s) => String(s.id) === String(id));
//       if (local) {
//         const cloned = JSON.parse(JSON.stringify(local));
//         if (
//           !cloned.slots ||
//           (Array.isArray(cloned.slots) &&
//             cloned.dates &&
//             cloned.dates.length > 0)
//         ) {
//           const arrSlots = Array.isArray(cloned.slots) ? cloned.slots : [];
//           const slotsMap = {};
//           if (cloned.dates && cloned.dates.length > 0) {
//             cloned.dates.forEach((d) => (slotsMap[d] = arrSlots.slice()));
//           } else {
//             const today = new Date().toISOString().split("T")[0];
//             slotsMap[today] = arrSlots.slice();
//             cloned.dates = [today];
//           }
//           cloned.slots = slotsMap;
//         }
//         setService(cloned);
//         if (cloned.dates && cloned.dates.length > 0)
//           setSelectedDate(cloned.dates[0]);
//         setLoading(false);
//         return;
//       }

//       setFetchError("Unable to fetch service details from server.");
//       setLoading(false);
//     }

//     tryFetch();

//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, [id]);

//   function normalizeToDateString(d) {
//     // Convert anything date-like into YYYY-MM-DD string, or return null if invalid
//     const dt = new Date(d);
//     if (isNaN(dt)) return null;
//     return dt.toISOString().split("T")[0];
//   }

//   function sortServiceDates(datesArr) {
//     // Accepts array of mixed date strings / Date objects, returns array of unique YYYY-MM-DD strings
//     if (!Array.isArray(datesArr)) return [];

//     const uniq = Array.from(
//       new Set(datesArr.map(normalizeToDateString).filter(Boolean)),
//     );

//     const parsed = uniq.map((ds) => ({ ds, date: new Date(ds) }));

//     const dateVal = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

//     const today = new Date();
//     const todayVal = dateVal(today);

//     const past = parsed
//       .filter((p) => dateVal(p.date) < todayVal)
//       .sort((a, b) => dateVal(b.date) - dateVal(a.date)); // nearest past first

//     const future = parsed
//       .filter((p) => dateVal(p.date) >= todayVal)
//       .sort((a, b) => dateVal(a.date) - dateVal(b.date)); // earliest future first (includes today)

//     return [...past, ...future].map((p) => p.ds);
//   }

//   // Replace your transformServiceShape with this updated version:
//   function transformServiceShape(doc) {
//     const out = {};
//     out.id =
//       doc._id ??
//       doc.id ??
//       doc.slug ??
//       String(doc.name).replace(/\s+/g, "-").toLowerCase();
//     out.name = doc.name ?? doc.title ?? "Service";
//     out.image =
//       doc.image || doc.imageUrl || doc.imageURL || doc.image_path || null;
//     out.price =
//       typeof doc.price === "number" ? doc.price : Number(doc.price) || 0;
//     out.about = doc.about ?? doc.description ?? doc.shortDescription ?? "";
//     out.instructions = Array.isArray(doc.instructions) ? doc.instructions : [];

//     let dates = Array.isArray(doc.dates) ? doc.dates.slice() : [];
//     let slotsMap = {};
//     if (
//       doc.slots &&
//       !Array.isArray(doc.slots) &&
//       typeof doc.slots === "object"
//     ) {
//       slotsMap = { ...doc.slots };
//       if (dates.length === 0) dates = Object.keys(slotsMap);
//     } else if (Array.isArray(doc.slots)) {
//       const arr = doc.slots.slice();
//       if (dates.length > 0) {
//         dates.forEach((d) => (slotsMap[d] = arr.slice()));
//       } else {
//         const today = new Date().toISOString().split("T")[0];
//         slotsMap[today] = arr.slice();
//         dates = [today];
//       }
//     } else {
//       if (dates.length > 0) {
//         dates.forEach((d) => (slotsMap[d] = []));
//       } else {
//         const today = new Date().toISOString().split("T")[0];
//         dates = [today];
//         slotsMap[today] = [];
//       }
//     }

//     // Ensure dates normalized and ordered: past-first (nearest → older), then today+future (earliest → latest)
//     out.dates = sortServiceDates(dates);
//     out.slots = slotsMap;
//     out.imageAlt = doc.imageAlt ?? doc.alt ?? out.name;
//     out.raw = doc;
//     return out;
//   }

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     setSubmitError(null);
//     setSuccessMessage(null);

//     const missing = getClientMissingFields();
//     if (missing.length > 0) {
//       setSubmitError(
//         `${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} required`,
//       );
//       return;
//     }

//     if (!service) {
//       setSubmitError("Service details not loaded");
//       return;
//     }

//     if (!isSignedIn) {
//       toast.error("Please sign in to create a booking.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // get Clerk token (frontend)
//       const token = await getToken().catch(() => null);

//       // payload (replace the existing payload in ServiceDetail.jsx)
//       const payload = {
//         serviceId:
//           (service?.raw && (service.raw._id || service.raw.id)) || service?.id,
//         serviceName: service?.name || "",
//         // NEW: service image snapshot hints (backend will prefer DB but accepts these)
//         serviceImageUrl:
//           (service?.raw &&
//             (service.raw.imageUrl ||
//               service.raw.image ||
//               service.raw.imageURL ||
//               "")) ||
//           service?.image ||
//           "" ||
//           "",
//         serviceImagePublicId:
//           (service?.raw &&
//             (service.raw.imagePublicId ||
//               (service.raw.image && service.raw.image.publicId) ||
//               "")) ||
//           "",
//         patientName: customerName.trim(),
//         mobile: mobile.trim(),
//         age: age ? Number(age) : undefined,
//         gender: gender || "",
//         date: selectedDate,
//         time: selectedTime,
//         fee: service?.price ?? 0,
//         fees: service?.price ?? 0,
//         paymentMethod: paymentMethod === "Cash" ? "Cash" : "Online",
//         email: email || undefined,
//         meta: {
//           client: "frontend",
//           serviceName: service?.name,
//         },
//       };

//       const headers = {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       };

//       if (token) {
//         headers.Authorization = `Bearer ${token}`;
//       } else {
//         toast.error(
//           "Authentication token not available. Please sign in again.",
//         );
//         setSubmitting(false);
//         return;
//       }

//       const res = await fetch(`${DEFAULT_HOST}/api/service-appointments`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(payload),
//       });

//       const text = await res.text();
//       let json = null;
//       try {
//         json = JSON.parse(text);
//       } catch {
//         json = { rawText: text };
//       }

//       if (!res.ok) {
//         const msg =
//           (json && (json.message || json.error || json.rawText)) ||
//           `Server returned ${res.status}`;
//         if (json && json.errors && typeof json.errors === "object") {
//           const ve = Array.isArray(json.errors)
//             ? json.errors.join(", ")
//             : JSON.stringify(json.errors);
//           setSubmitError(`${msg} — ${ve}`);
//         } else {
//           setSubmitError(String(msg));
//         }
//         setSubmitting(false);
//         return;
//       }

//       const { appointment, checkoutUrl } = json || {};

//       if (checkoutUrl) {
//         window.location.href = checkoutUrl;
//         return;
//       }

//       toast.success(
//         "Booking created successfully. Redirecting to appointments...",
//       );
//       setTimeout(() => {
//         navigate("/appointments?payment_status=Paid", { replace: true });
//       }, 700);

//       setCustomerName("");
//       setMobile("");
//       setAge("");
//       setGender("");
//       setSelectedDate("");
//       setSelectedTime("");
//       setEmail("");
//     } catch (err) {
//       console.error("Booking submit error:", err);
//       setSubmitError("Network error while creating booking.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className={serviceDetailStyles.loadingContainer}>
//         <div className={serviceDetailStyles.loadingCard}>
//           <h2 className={serviceDetailStyles.loadingTitle}>
//             Loading service...
//           </h2>
//           <p className={serviceDetailStyles.loadingText}>
//             Fetching details from server
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!service) {
//     return (
//       <div className={serviceDetailStyles.loadingContainer}>
//         <div className={serviceDetailStyles.loadingCard}>
//           <h2 className={serviceDetailStyles.loadingTitle}>
//             Service not found
//           </h2>
//           <p className={serviceDetailStyles.loadingText}>
//             Please go back and select a valid service.
//           </p>
//           <Link to="/services" className={serviceDetailStyles.backToServices}>
//             Back to Services
//           </Link>
//         </div>
//       </div>
//     );
//   }
