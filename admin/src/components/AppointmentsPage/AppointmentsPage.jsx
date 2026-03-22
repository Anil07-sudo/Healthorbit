
// import {useCallback, useEffect,useState,useRef} from 'react'
// import { doctorDetailStyles as s } from "../../dummyStyles";
// import{User,XCircle,EyeClosed ,Calendar,Plus,Trash2,CheckCircle} from 'lucide-react';

// // helper function 
// function timeStringToMinutes(t) {
//   if (!t) return 0;
//   const [hhmm, ampm] = t.split(" ");
//   let [h, m] = hhmm.split(":").map(Number);
//   if (ampm === "PM" && h !== 12) h += 12;
//   if (ampm === "AM" && h === 12) h = 0;
//   return h * 60 + m;
// }

// function formatDateISO(iso) {
//   if (!iso) return "";
//   const [y, m, d] = iso.split("-");
//   const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
//   const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "June",
//     "July",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const day = String(Number(d));
//   const month = monthNames[dateObj.getMonth()] || "";
//   return `${day} ${month} ${y}`;
// }


// const AddPage = () => {
  
//   const [doctorList, setDoctorList] = useState([]);
//   const fileInputRef = useRef(null);

//   const [form, setForm] = useState({
//     name: "",
//     specialization: "",
//     imageFile: null,
//     imagePreview: "",
//     experience: "",
//     qualifications: "",
//     location: "",
//     about: "",
//     fee: "",
//     success: "",
//     patients: "",
//     rating: "",
//     schedule: {},
//     availability: "Available",
//     email: "",
//     password: "",
//   });

//   const [slotDate, setSlotDate] = useState("");
//   const [slotHour, setSlotHour] = useState("");
//   const [slotMinute, setSlotMinute] = useState("00");
//   const [slotAmpm, setSlotAmpm] = useState("AM");

//   const [toast, setToast] = useState({
//     show: false,
//     type: "success",
//     message: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [today] = useState(() => {
//     const d = new Date();
//     const tzOffset = d.getTimezoneOffset();
//     const local = new Date(d.getTime() - tzOffset * 60000);
//     return local.toISOString().split("T")[0];
//   });

//   useEffect(() => {
//     if (!toast.show) return;
//     const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 3000);
//     return () => clearTimeout(t);
//   }, [toast.show]);

//   const showToast = (type, message) => setToast({ show: true, type, message });

//   function handleImage(e) {
//     const file = e.target.files && e.target.files[0];
//     if (!file) return;
//     if (form.imagePreview && form.imageFile) {
//       try {
//         URL.revokeObjectURL(form.imagePreview);
//       } catch (err) {}
//     }
//     setForm((p) => ({
//       ...p,
//       imageFile: file,
//       imagePreview: URL.createObjectURL(file),
//     }));
//   }

//   function removeImage() {
//     if (form.imagePreview && form.imageFile) {
//       try {
//         URL.revokeObjectURL(form.imagePreview);
//       } catch (err) {}
//     }
//     setForm((p) => ({ ...p, imageFile: null, imagePreview: "" }));
//     if (fileInputRef.current) {
//       try {
//         fileInputRef.current.value = "";
//       } catch (err) {}
//     }
//   }

//   function addSlotToForm() {
//     if (!slotDate || !slotHour) {
//       showToast("error", "Select date + time");
//       return;
//     }
//     if (slotDate < today) {
//       showToast("error", "Cannot add a slot in the past");
//       return;
//     }
//     const time = `${slotHour}:${slotMinute} ${slotAmpm}`;

//     if (slotDate === today) {
//       const now = new Date();
//       const nowMinutes = now.getHours() * 60 + now.getMinutes();
//       const slotMinutes = timeStringToMinutes(time);
//       if (slotMinutes <= nowMinutes) {
//         showToast("error", "Cannot add a time that has already passed today");
//         return;
//       }
//     }

//     setForm((f) => {
//       const sched = { ...f.schedule };
//       if (!sched[slotDate]) sched[slotDate] = [];
//       if (!sched[slotDate].includes(time)) sched[slotDate].push(time);

//       sched[slotDate] = sched[slotDate].sort(
//         (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b),
//       );
//       return { ...f, schedule: sched };
//     });

//     setSlotHour("");
//     setSlotMinute("00");
//   }

//   function removeSlot(date, time) {
//     setForm((f) => {
//       const sched = { ...f.schedule };
//       sched[date] = sched[date].filter((t) => t !== time);
//       if (!sched[date].length) delete sched[date];
//       return { ...f, schedule: sched };
//     });
//   }

//   function getFlatSlots(s) {
//     const arr = [];
//     Object.keys(s)
//       .sort()
//       .forEach((d) => {
//         s[d].forEach((t) => arr.push({ date: d, time: t }));
//       });
//     return arr;
//   }

//   function validate(f) {
//     const req = [
//       "name",
//       "specialization",
//       "experience",
//       "qualifications",
//       "location",
//       "about",
//       "fee",
//       "success",
//       "patients",
//       "rating",
//       "email",
//       "password",
//     ];

//     for (let k of req) if (!f[k]) return false;
//     if (!f.imageFile) return false;
//     if (!Object.keys(f.schedule).length) return false;
//     return true;
//   }

//   // async function handleAdd(e) {
//   //   e.preventDefault();
//   //   if (!validate(form)) {
//   //     showToast("error", "Fill all fields + upload image + add slot");
//   //     return;
//   //   }
//   //   const r = Number(form.rating);
//   //   if (Number.isNaN(r) || r < 1 || r > 5) {
//   //     showToast("error", "Rating must be a number between 1 and 5");
//   //     return;
//   //   }
//   //   setLoading(true);
    
//   // const [doctorList, setDoctorList] = useState([]);
//   // const fileInputRef = useRef(null);

//   // const [form, setForm] = useState({
//   //   name: "",
//   //   specialization: "",
//   //   imageFile: null,
//   //   imagePreview: "",
//   //   experience: "",
//   //   qualifications: "",
//   //   location: "",
//   //   about: "",
//   //   fee: "",
//   //   success: "",
//   //   patients: "",
//   //   rating: "",
//   //   schedule: {},
//   //   availability: "Available",
//   //   email: "",
//   //   password: "",
//   // });

//   // const [slotDate, setSlotDate] = useState("");
//   // const [slotHour, setSlotHour] = useState("");
//   // const [slotMinute, setSlotMinute] = useState("00");
//   // const [slotAmpm, setSlotAmpm] = useState("AM");

//   // const [toast, setToast] = useState({
//   //   show: false,
//   //   type: "success",
//   //   message: "",
//   // });
//   // const [showPassword, setShowPassword] = useState(false);
//   // const [loading, setLoading] = useState(false);

//   // const [today] = useState(() => {
//   //   const d = new Date();
//   //   const tzOffset = d.getTimezoneOffset();
//   //   const local = new Date(d.getTime() - tzOffset * 60000);
//   //   return local.toISOString().split("T")[0];
//   // });

//   // useEffect(() => {
//   //   if (!toast.show) return;
//   //   const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 3000);
//   //   return () => clearTimeout(t);
//   // }, [toast.show]);

//   // const showToast = (type, message) => setToast({ show: true, type, message });

//   // function handleImage(e) {
//   //   const file = e.target.files && e.target.files[0];
//   //   if (!file) return;
//   //   if (form.imagePreview && form.imageFile) {
//   //     try {
//   //       URL.revokeObjectURL(form.imagePreview);
//   //     } catch (err) {}
//   //   }
//   //   setForm((p) => ({
//   //     ...p,
//   //     imageFile: file,
//   //     imagePreview: URL.createObjectURL(file),
//   //   }));
//   // }

//   // function removeImage() {
//   //   if (form.imagePreview && form.imageFile) {
//   //     try {
//   //       URL.revokeObjectURL(form.imagePreview);
//   //     } catch (err) {}
//   //   }
//   //   setForm((p) => ({ ...p, imageFile: null, imagePreview: "" }));
//   //   if (fileInputRef.current) {
//   //     try {
//   //       fileInputRef.current.value = "";
//   //     } catch (err) {}
//   //   }
//   // }

//   // function addSlotToForm() {
//   //   if (!slotDate || !slotHour) {
//   //     showToast("error", "Select date + time");
//   //     return;
//   //   }
//   //   if (slotDate < today) {
//   //     showToast("error", "Cannot add a slot in the past");
//   //     return;
//   //   }
//   //   const time = `${slotHour}:${slotMinute} ${slotAmpm}`;

//   //   if (slotDate === today) {
//   //     const now = new Date();
//   //     const nowMinutes = now.getHours() * 60 + now.getMinutes();
//   //     const slotMinutes = timeStringToMinutes(time);
//   //     if (slotMinutes <= nowMinutes) {
//   //       showToast("error", "Cannot add a time that has already passed today");
//   //       return;
//   //     }
//   //   }

//   //   setForm((f) => {
//   //     const sched = { ...f.schedule };
//   //     if (!sched[slotDate]) sched[slotDate] = [];
//   //     if (!sched[slotDate].includes(time)) sched[slotDate].push(time);

//   //     sched[slotDate] = sched[slotDate].sort(
//   //       (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b),
//   //     );
//   //     return { ...f, schedule: sched };
//   //   });

//   //   setSlotHour("");
//   //   setSlotMinute("00");
//   // }

//   // function removeSlot(date, time) {
//   //   setForm((f) => {
//   //     const sched = { ...f.schedule };
//   //     sched[date] = sched[date].filter((t) => t !== time);
//   //     if (!sched[date].length) delete sched[date];
//   //     return { ...f, schedule: sched };
//   //   });
//   // }

//   // function getFlatSlots(s) {
//   //   const arr = [];
//   //   Object.keys(s)
//   //     .sort()
//   //     .forEach((d) => {
//   //       s[d].forEach((t) => arr.push({ date: d, time: t }));
//   //     });
//   //   return arr;
//   // }

//   // function validate(f) {
//   //   const req = [
//   //     "name",
//   //     "specialization",
//   //     "experience",
//   //     "qualifications",
//   //     "location",
//   //     "about",
//   //     "fee",
//   //     "success",
//   //     "patients",
//   //     "rating",
//   //     "email",
//   //     "password",
//   //   ];

//   //   for (let k of req) if (!f[k]) return false;
//   //   if (!f.imageFile) return false;
//   //   if (!Object.keys(f.schedule).length) return false;
//   //   return true;
//   // }

//   async function handleAdd(e) {
//     e.preventDefault();
//     if (!validate(form)) {
//       showToast("error", "Fill all fields + upload image + add slot");
//       return;
//     }
//     const r = Number(form.rating);
//     if (Number.isNaN(r) || r < 1 || r > 5) {
//       showToast("error", "Rating must be a number between 1 and 5");
//       return;
//     }
//     setLoading(true);

//     try {
//       const fd = new FormData();
//       fd.append("name", form.name);
//       fd.append("specialization", form.specialization || "");
//       fd.append("experience", form.experience || "");
//       fd.append("qualifications", form.qualifications || "");
//       fd.append("location", form.location || "");
//       fd.append("about", form.about || "");
//       fd.append("fee", form.fee === "" ? "0" : String(form.fee));
//       fd.append("success", form.success || "");
//       fd.append("patients", form.patients || "");
//       fd.append("rating", form.rating === "" ? "0" : String(form.rating));
//       fd.append("availability", form.availability || "Available");
//       fd.append("email", form.email);
//       fd.append("password", form.password);
//       fd.append("schedule", JSON.stringify(form.schedule || {}));

//       if (form.imageFile) fd.append("image", form.imageFile);

// const API_BASE = "https://healthorbit-backend.onrender.com/api";

// const res = await fetch(`${API_BASE}/doctors`, {
//   method: "POST",
//   body: fd,
// });

// const data = await res.json().catch(() => null);

// if (!res.ok) {
//   const msg = data?.message || `Server error (${res.status})`;
//   showToast("error", msg);
//   setLoading(false);
//   return;
// }

//       showToast("success", "Doctor Added Successfully!");

//       if (data?.token) {
//         try {
//           localStorage.setItem("token", data.token);
//         } catch (err) {}
//       }

//       const doctorFromServer = data?.data
//         ? data.data
//         : { id: Date.now(), ...form, imageUrl: form.imagePreview };

//       setDoctorList((old) => [doctorFromServer, ...old]);

//       // cleanup: revoke object URL if used
//       if (form.imagePreview && form.imageFile) {
//         try {
//           URL.revokeObjectURL(form.imagePreview);
//         } catch (err) {}
//       }

//       setForm({
//         name: "",
//         specialization: "",
//         imageFile: null,
//         imagePreview: "",
//         experience: "",
//         qualifications: "",
//         location: "",
//         about: "",
//         fee: "",
//         success: "",
//         patients: "",
//         rating: "",
//         schedule: {},
//         availability: "Available",
//         email: "",
//         password: "",
//       });

//       if (fileInputRef.current) {
//         try {
//           fileInputRef.current.value = "";
//         } catch (err) {}
//       }

//       setSlotDate("");
//       setSlotHour("");
//       setSlotMinute("00");
//       setShowPassword(false);
//     } catch (err) {
//       console.error("submit error:", err);
//       showToast("error", "Network or server error");
//     } finally {
//       setLoading(false);
//     }
//   }



// return(
//   <div>
//     <div className={s.pageContainer}>
//   <div className={s.maxWidthContainerLg + " " + s.headerContainer}>
//     <div className={s.headerFlexContainer}>
//       <div className={s.headerIconContainer}>
//         <User className="text-white" size={32} />
//       </div>
//       <h1 className={s.headerTitle}>Add New Doctor</h1>
//     </div>
//   </div>

//   {/* Form */}
// <div className={s.maxWidthContainer + " " + s.formContainer}>
//   <form onSubmit={handleAdd} className={s.formGrid}>
//     <div className="md:col-span-2">
//       <label className={s.label}>Upload Profile Image</label>
//       <div className="flex flex-wrap items-center gap-4">
//         <input type="file" ref={fileInputRef} accept="image/*"
//         onChange={handleImage} className={`${s.fileInput} cursor-pointer`}/>

//         {form.imagePreview && (
//   <div className="relative group">
//     <img
//       src={form.imagePreview}
//       alt="preview"
//       className={s.imagePreview}
//     />
//     <button
//   type="button"
//   onClick={removeImage}
//   className={s.removeImageButton + " " + s.cursorPointer}
// >
//   <XCircle size={14} />
// </button>
//   </div>
// )}

//       </div>
//     </div>
//     <input
//   className={s.inputBase}
//   placeholder="Full Name"
//   value={form.name}
//   onChange={(e) => setForm({ ...form, name: e.target.value })}
// />
// <input
//   className={s.inputBase}
//   placeholder="Specialization"
//   value={form.specialization}
//   onChange={(e) => setForm({ ...form, specialization: e.target.value })}
// />
// <input
//   className={s.inputBase}
//   placeholder="loaction"
//   value={form.location}
//   onChange={(e) => setForm({ ...form, location: e.target.value })}
// />
// <input
//   className={s.inputBase}
//   placeholder="Experience"
//   value={form.experience}
//   onChange={(e) => setForm({ ...form, experience: e.target.value })}
// />
// <input
//   className={s.inputBase}
//   placeholder="qualifications"
//   value={form.qualifications}
//   onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
// />
// <input
//   className={s.inputBase}
//   placeholder="Consultation Fee"
//   value={form.fee}
//   onChange={(e) => setForm({ ...form, fee: e.target.value })}
// />

//           <input
//             className={s.inputBase}
//             placeholder="Rating (1.0 - 5.0)"
//             type="number"
//             min={1}
//             max={5}
//             step={0.1}
//             value={form.rating}
//             onChange={(e) => {
//               const v = e.target.value;

//               // allow clearing
//               if (v === "") {
//                 setForm((p) => ({ ...p, rating: "" }));
//                 return;
//               }

//               const n = Number(v);
//               if (Number.isNaN(n)) return;

//               // clamp between 1 and 5
//               const clamped = Math.max(1, Math.min(5, n));

//               // keep only 1 decimal place
//               const fixed = Math.round(clamped * 10) / 10;

//               setForm((p) => ({ ...p, rating: fixed.toString() }));
//             }}
//             onBlur={() => {
//               // force 1 decimal place on blur
//               setForm((p) => {
//                 if (!p.rating) return p;
//                 const n = Number(p.rating);
//                 if (Number.isNaN(n)) return { ...p, rating: "" };

//                 const clamped = Math.max(1, Math.min(5, n));
//                 return { ...p, rating: clamped.toFixed(1) };
//               });
//             }}
//           />
//           <input
//   className={s.inputBase}
//   placeholder="Patients"
//   value={form.patients}
//   onChange={(e) => setForm({ ...form, patients: e.target.value })}
// />
// <input
//   className={s.inputBase}
//   placeholder="Success Rate"
//   value={form.success}
//   onChange={(e) => setForm({ ...form, success: e.target.value })}
// />
// <input
//   className={s.inputBase}
//   placeholder="Doctor Email"
//   value={form.email}
//   type="email"
//   onChange={(e) => setForm({ ...form, email: e.target.value })}
// />
// <div className="relative">
//   <input
//     className={s.inputBase + " " + s.inputWithIcon}
//     placeholder="Doctor Password"
//     type={showPassword ? "text" : "password"}
//     value={form.password}
//     onChange={(e) =>
//       setForm({
//         ...form,
//         password: e.target.value,
//       })
//     }
    
//   />
//   <button
//   type="button"
//   onClick={() => setShowPassword((s) => !s)}
//   className={s.passwordToggleButton + " " + s.cursorPointer}
// >
//   {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
// </button>
// </div>
// <select
//   className={s.inputBase}
//   value={form.availability}
//   onChange={(e) =>
//     setForm({
//       ...form,
//       availability: e.target.value,
//     })
//   }
// >
//   <option value="Available">Available</option>
//   <option value="Unavailable">Unavailable</option>
// </select>
// <textarea
//   className={s.textareaBase + " md:col-span-2"}
//   rows={3}
//   placeholder="About Doctor"
//   value={form.about}
//   onChange={(e) =>
//     setForm({
//       ...form,
//       about: e.target.value,
//     })
//   }
// >
  
// </textarea>

//           {/* SCHEDULE */}
//           <div className={s.scheduleContainer + " md:col-span-2"}>
//             <div className={s.scheduleHeader}>
//               <Calendar className="text-emerald-600" />
//               <p className={s.scheduleTitle}>Add Schedule Slots</p>
//             </div>

//             <div className={s.scheduleInputsContainer}>
//               <input
//                 type="date"
//                 value={slotDate}
//                 min={today}
//                 onChange={(e) => setSlotDate(e.target.value)}
//                 className={s.scheduleDateInput}
//               />

//               <select
//                 value={slotHour}
//                 onChange={(e) => setSlotHour(e.target.value)}
//                 className={s.scheduleTimeSelect}
//               >
//                 <option value="">Hour</option>
//                 {Array.from({ length: 12 }).map((_, i) => (
//                   <option key={i} value={String(i + 1)}>
//                     {i + 1}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={slotMinute}
//                 onChange={(e) => setSlotMinute(e.target.value)}
//                 className={s.scheduleTimeSelect}
//               >
//                 {Array.from({ length: 60 }).map((_, i) => (
//                   <option key={i} value={String(i).padStart(2, "0")}>
//                     {String(i).padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={slotAmpm}
//                 onChange={(e) => setSlotAmpm(e.target.value)}
//                 className={s.scheduleTimeSelect}
//               >
//                 <option>AM</option>
//                 <option>PM</option>
//               </select>

//               <button
//                 type="button"
//                 onClick={addSlotToForm}
//                 className={s.addSlotButton + " " + s.cursorPointer}
//               >
//                 <Plus size={18} /> Add Slot
//               </button>
//             </div>

//             <div className={s.slotsGrid}>
//               {getFlatSlots(form.schedule).map(({ date, time }) => (
//                 <div
//                   key={date + time}
//                   className={s.slotItem + " " + s.cursorPointer}
//                 >
//                   <span>
//                     {formatDateISO(date)} — {time}
//                   </span>
//                   <button
//                     onClick={() => removeSlot(date, time)}
//                     className="text-rose-500"
//                     aria-label={`Remove slot ${date} ${time}`}
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//       <div className={s.submitButtonContainer}>
//   <button
//     type="submit"
//     disabled={loading}
//     className={
//       s.submitButton +
//       " " +
//       s.cursorPointer +
//       " " +
//       (loading ? s.submitButtonDisabled : s.submitButtonEnabled)
//     }
//   >
//     {loading ? "Adding..." : "Add Doctor to Team"}
//   </button>
// </div>

//   </form>
// </div>

//     {/* TOAST */}
//       {toast.show && (
//         <div
//           className={s.toastContainer + " " + 
//             (toast.type === "success" ? s.toastSuccess : s.toastError)}
//         >
//           {toast.type === "success" ? (
//             <CheckCircle size={22} />
//           ) : (
//             <XCircle size={22} />
//           )}
//           <span>{toast.message}</span>
//         </div>
//       )}
//       {/* Simple overview of added doc */}
// <div className={s.doctorListContainer}>
//   {doctorList.length ? (
//     <div className={s.doctorListGrid}>
//       {doctorList.map((d) => (
//         <div key={d.id || d._id} className={s.doctorCard}>
//           <div className={s.doctorCardContent}>
//             <img
//               src={d.imageUrl || d.imagePreview}
//               alt={d.name}
//               className={s.doctorImage}
//             />

//             <div>
//               <div className={s.doctorName}>{d.name}</div>
//               <div className={s.doctorSpecialization}>
//                 {d.specialization}
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   ) :  (
//   <p className={s.emptyState}>No doctors added yet.</p>
// )}
// </div>
// </div>

//   </div>
  
// );

  
// };


// export default AddPage;

import { useState, useEffect, useMemo } from "react";
import { Search, Calendar, BadgeIndianRupee, X, SlidersHorizontal } from "lucide-react";
import {
  pageStyles,
  statusClasses,
  keyframesStyles,
} from "../../dummyStyles";

const API_BASE = "https://healthorbit-backend.onrender.com";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDateISO(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function dateTimeFromSlot(slot) {
  try {
    const [y, m, d] = slot.date.split("-");
    const base = new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0);
    const [time, ampm] = slot.time.split(" ");
    let [hh, mm] = time.split(":").map(Number);
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;
    base.setHours(hh, mm, 0, 0);
    return base;
  } catch {
    return new Date(slot.date + "T00:00:00");
  }
}

const AppointmentPage=()=>{
  const isAdmin = true;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("all");
  const [showAll, setShowAll] = useState(false);

useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const q = query.trim();
        const url = `${API_BASE}/api/appointments?limit=200${
          q ? `&search=${encodeURIComponent(q)}` : ""
        }`;
        const res = await fetch(url);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Failed to fetch (${res.status})`);
        }
        const data = await res.json();
        const items = (data?.appointments || []).map((a) => {
          const doctorName =
            (a.doctorId && a.doctorId.name) || a.doctorName || "";
          const speciality =
            (a.doctorId && a.doctorId.specialization) ||
            a.speciality ||
            a.specialization ||
            "General";
          const fee = typeof a.fees === "number" ? a.fees : a.fee || 0;
          return {
            id: a._id || a.id,
            patientName: a.patientName || "",
            age: a.age || "",
            gender: a.gender || "",
            mobile: a.mobile || "",
            doctorName,
            speciality,
            fee,
            slot: {
              date: a.date || (a.slot && a.slot.date) || "",
              time: a.time || (a.slot && a.slot.time) || "00:00 AM",
            },
            status: a.status || (a.payment && a.payment.status) || "Pending",
            raw: a, // keep original in case we need it
          };
        });
        setAppointments(items);
      } catch (err) {
        console.error("Load appointments error:", err);
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const specialities = useMemo(() => {
    const set = new Set(appointments.map((a) => a.speciality || "General"));
    return ["all", ...Array.from(set)];
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((a) => {
      if (
        filterSpeciality !== "all" &&
        (a.speciality || "").toLowerCase() !== filterSpeciality.toLowerCase()
      )
        return false;
      if (filterDate && a.slot?.date !== filterDate) return false;
      if (!q) return true;
      return (
        (a.doctorName || "").toLowerCase().includes(q) ||
        (a.speciality || "").toLowerCase().includes(q) ||
        (a.patientName || "").toLowerCase().includes(q) ||
        (a.mobile || "").toLowerCase().includes(q)
      );
    });
  }, [appointments, query, filterDate, filterSpeciality]);

  const sortedFiltered = useMemo(() => {
    return filtered.slice().sort((a, b) => {
      const da = dateTimeFromSlot(a.slot).getTime();
      const db = dateTimeFromSlot(b.slot).getTime();
      return db - da;
    });
  }, [filtered]);

  const displayed = useMemo(
    () => (showAll ? sortedFiltered : sortedFiltered.slice(0, 8)),
    [sortedFiltered, showAll]
  );


  async function adminCancelAppointment(id) {
    const appt = appointments.find((x) => x.id === id);
    if (!appt) return;

    const statusLower = (appt.status || "").toLowerCase();
    const isCancelled =
      statusLower === "canceled" || statusLower === "cancelled";
    const isCompleted = statusLower === "completed";

    if (isCancelled || isCompleted) return;

    const ok = window.confirm(
      `As admin, mark appointment for ${appt.patientName} with ${
        appt.doctorName
      } on ${formatDateISO(appt.slot.date)} at ${appt.slot.time} as CANCELLED?`
    );
    if (!ok) return;

    try {
      setAppointments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Canceled" } : p))
      );
      setShowAll(true);

      const res = await fetch(`${API_BASE}/api/appointments/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Cancel failed (${res.status})`);
      }
      const data = await res.json();
      const updated = data?.appointment || data?.appointments || null;
      if (updated) {
        setAppointments((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: updated.status || "Canceled",
                  slot: {
                    date: updated.date || p.slot.date,
                    time: updated.time || p.slot.time,
                  },
                  raw: updated,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Cancel error:", err);
      setError(err.message || "Failed to cancel appointment");
      try {
        const reload = await fetch(`${API_BASE}/api/appointments?limit=200`);
        if (reload.ok) {
          const body = await reload.json();
          const items = (body?.appointments || []).map((a) => ({
            id: a._id || a.id,
            patientName: a.patientName || "",
            age: a.age || "",
            gender: a.gender || "",
            mobile: a.mobile || "",
            doctorName: (a.doctorId && a.doctorId.name) || a.doctorName || "",
            speciality:
              (a.doctorId && a.doctorId.specialization) ||
              a.speciality ||
              a.specialization ||
              "General",
            fee: typeof a.fees === "number" ? a.fees : a.fee || 0,
            slot: {
              date: a.date || (a.slot && a.slot.date) || "",
              time: a.time || (a.slot && a.slot.time) || "00:00 AM",
            },
            status: a.status || (a.payment && a.payment.status) || "Pending",
            raw: a,
          }));
          setAppointments(items);
        }
      } catch (e) {
      }
    }
  }

  return (

  
            <div className={pageStyles.container}>
      <style>{keyframesStyles}</style>


        <div className={pageStyles.maxWidthContainer}>

          <header className={pageStyles.headerContainer}>
            <div className={pageStyles.headerTitleSection}>
              <h1 className={pageStyles.headerTitle}>Appointments</h1>
              <p className={pageStyles.headerSubtitle}>
                 Manage and search upcoming patients
              </p>
               </div>

            <div className={pageStyles.headerControlsSection}>
              <div className="flex flex-col md:flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            
                <div className={pageStyles.searchContainer}>
                  <Search size={16} className={pageStyles.searchIcon} />
                  <input

                  className={pageStyles.searchInput}
                
                    placeholder="Search patient, doctor, mobile"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                   /> 
                  </div>
                  <div className={pageStyles.filterContainer}>
  <div className={pageStyles.dateFilter}>
    <Calendar size={14} className={pageStyles.dateFilterIcon} />
    <input
      type="date"
      className={pageStyles.dateInput}
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
  </div>

  <select
  className={pageStyles.selectFilter}
  value={filterSpeciality}
  onChange={(e) => setFilterSpeciality(e.target.value)}
>
  {specialities.map((s) => (
    <option value={s} key={s}>
      {s === "all" ? "All Specialties" : s}
    </option>
  ))}
</select>

<button
  onClick={() => {
    setQuery("");
    setFilterDate("");
    setFilterSpeciality("all");
    setShowAll(false);
    setError(null);
  }} className={pageStyles.clearButton}
>
  Clear
</button>
</div>



                  </div>
                  </div>
    
          </header>

          {loading ? (
  <div className={pageStyles.loadingErrorContainer}>Loading...</div>
) : error ? (
  <div className={pageStyles.errorContainer}>{error}</div>
) : sortedFiltered.length === 0 ? (
  <div className={pageStyles.noResultsContainer}>
    No appointments found.
  </div>
) : (
  <main className={pageStyles.gridContainer}>

    {displayed.map((a, idx) => {
  const statusLower = (a.status || "").toLowerCase();
  const isCancelled =
    statusLower === "canceled" || statusLower === "cancelled";
  const isCompleted = statusLower === "completed";
  const isDisabled = isCancelled || isCompleted;

  return (

                <div
                  key={a.id}
                  style={{
                    animation: `fadeUp 420ms cubic-bezier(.2,.9,.2,1) forwards`,
                    animationDelay: `${idx * 70}ms`,
                    opacity: 0,
                  }}
                  className={pageStyles.card}
                >
                  <div className={pageStyles.cardHeader}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={pageStyles.cardTitle}>
                          {a.patientName}
                        </h3>

                        <div className={pageStyles.patientInfo}>
                          <span>{a.age ? `${a.age} yrs` : ""}</span>
                          <span> {a.age ? ":" : ""} </span>
                          <span>{a.gender}</span>
                          <span className="hidden md:inline"> : </span>
                          <span className=" max-w-30">{a.mobile}</span>
                        </div>
                      </div>

                      <div className={pageStyles.doctorInfo}>
                        {a.doctorName} :{" "}
                        <span className={pageStyles.doctorSpeciality}>
                          {a.speciality}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={pageStyles.feeLabel}>
                        Fees
                      </div>
                      <div className={pageStyles.feeAmount}>
                        <BadgeIndianRupee size={16} />
                        <span>{a.fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className={pageStyles.slotContainer}>
                      <Calendar size={14} className={pageStyles.slotIcon} />
                      <span>
                        {formatDateISO(a.slot.date)} — {a.slot.time}
                      </span>
                    </div>

                    <div
                      className={`${pageStyles.statusBadge} ${statusClasses(a.status)}`}
                    >
                      {a.status ? a.status.toUpperCase() : "PENDING"}
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          onClick={() => adminCancelAppointment(a.id)}
                          title={
                            isDisabled
                              ? isCompleted
                                ? "Cannot cancel a completed appointment"
                                : "Already cancelled"
                              : "Admin Cancel (mark as cancelled)"
                          }
                          disabled={isDisabled}
                          aria-disabled={isDisabled}
                          className={pageStyles.cancelButton(isDisabled, isCompleted)}
                        >
                          {isDisabled
                            ? isCompleted
                              ? "Completed"
                              : "Admin Cancelled"
                            : "Admin Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

  )

})}

  </main>
)}

{sortedFiltered.length > 8 && (
  <div className=" flex justify-center mt-4">
    <button
      onClick={() => setShowAll((s) => !s)}
      className={pageStyles.showMoreButton}
    >
      {showAll
        ? "Show Less"
        : `Show more (${sortedFiltered.length - 8})`}
    </button>
  </div>
)}




          </div>
          </div>
  );
}



export default AppointmentPage