"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  FileText,
  ImagePlus,
  LogOut,
  MapPin,
  Pencil,
  Phone,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { updateProfile } from "@/services/authService";

type ProfileVariant = "customer" | "vendor";

interface ProfilePageProps {
  variant: ProfileVariant;
}

interface FormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  lga: string;
  country: string;
  dateOfBirth: string;
  businessName: string;
  contact: string;
  businessAddress: string;
  openingHours: string;
  ninCac: string;
  areas: string;
}

const initialValues: FormValues = {
  firstName: "Daniel",
  middleName: "John",
  lastName: "Udofo",
  email: "udofodaniel@gmail.com",
  phone: "705089365",
  address: "Udofo Daniel Close, Ikorodu, Lagos, Nigeria.",
  lga: "Ikorodu",
  country: "Nigeria",
  dateOfBirth: "20 / 06 / 2006",
  businessName: "",
  contact: "",
  businessAddress: "",
  openingHours: "",
  ninCac: "",
  areas: "",
};

const cylinderOptions = ["3 kg", "6 kg", "12 kg", "12.5 kg", "25 kg", "50 kg"];

export default function ProfilePage({ variant }: ProfilePageProps) {
  const isVendor = variant === "vendor";
  const [values, setValues] = useState(initialValues);
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedCylinders, setSelectedCylinders] = useState<string[]>(["12.5 kg"]);
  const [deliveryMode, setDeliveryMode] = useState("Multiple Choice");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const initials = useMemo(
    () => `${values.firstName[0] ?? "U"}${values.lastName[0] ?? "D"}`.toUpperCase(),
    [values.firstName, values.lastName],
  );

  const updateValue = (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setSaved(false);
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError("");

    try {
      await updateProfile(
        isVendor
          ? {
              businessName: values.businessName,
              phone: values.contact || values.phone,
              address: values.businessAddress,
              isVendor: true,
            }
          : {
              phone: values.phone,
              address: values.address,
              isVendor: false,
            },
      );
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full overflow-y-auto bg-white px-5 py-6 text-[#252943] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1060px]">
        <div className="mb-9 flex items-center gap-3 text-xs text-[#777b8b]">
          <span>Settings</span>
          <ChevronRight size={14} />
          <span className="font-medium text-[#252943]">Profile</span>
        </div>

        <section className="mx-auto mb-11 w-full max-w-[430px] rounded-xl border border-[#e2e3e7] bg-white px-6 py-6 text-center shadow-[0_2px_8px_rgba(35,39,64,0.06)]">
          <div className="relative mx-auto mb-4 h-[78px] w-[78px]">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Profile" className="h-full w-full rounded-full border-4 border-[#50c878] object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#50c878] bg-[#22547d] text-2xl tracking-wider text-white">
                {initials}
              </div>
            )}
          </div>
          <h1 className="text-[22px] font-bold leading-7">
            {values.firstName} {values.lastName}
          </h1>
          <p className="mt-1 text-sm text-[#252943]">{values.email}</p>
          <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full bg-[#2676aa] px-5 py-2.5 text-sm font-medium text-white">
            <UserRound size={16} />
            {isVendor ? "Vendor" : "Customer"}
          </div>
          <label className="mx-auto mt-7 flex w-fit cursor-pointer items-center gap-2 rounded-md border border-[#dedfe4] px-5 py-2 text-xs text-[#55596a] hover:bg-slate-50">
            <Pencil size={13} />
            Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </section>

        <div className="grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="text-xs">
            <p className="mb-3 font-medium text-[#4d5161]">Personal</p>
            <div className="overflow-hidden rounded-lg border border-[#e0e2e7]">
              <div className="flex items-center justify-between bg-[#225b84] px-3 py-3 text-white">
                <span className="flex items-center gap-2"><UserRound size={14} /> Personal Information</span>
                <ChevronRight size={14} />
              </div>
              {isVendor && <SettingsItem icon={<BriefcaseBusiness size={14} />} label="Business Information" />}
              {isVendor && <SettingsItem icon={<FileText size={14} />} label="My Documents" />}
            </div>

            <p className="mb-3 mt-8 font-medium text-[#4d5161]">Legal &amp; Compliance</p>
            <div className="space-y-1">
              <SettingsItem label="Terms Of Service" />
              <SettingsItem label="Privacy Policy" />
              <SettingsItem label="About Us" />
            </div>

            <p className="mb-3 mt-8 font-medium text-[#4d5161]">Account Centre</p>
            <div className="space-y-1">
              <SettingsItem icon={<CircleHelp size={14} />} label="Contact Us" />
              <SettingsItem icon={<CircleHelp size={14} />} label="FAQ" />
              {!isVendor && <SettingsItem icon={<Star size={14} />} label="Reviews & Ratings" />}
              <SettingsItem danger icon={<LogOut size={14} />} label="Log Out" />
              <SettingsItem danger icon={<Trash2 size={14} />} label="Delete Account" />
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="min-w-0">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4e8] text-[#252943]">
              <UserRound size={18} />
            </div>
            {isVendor ? (
              <VendorFields
                values={values}
                updateValue={updateValue}
                selectedCylinders={selectedCylinders}
                setSelectedCylinders={setSelectedCylinders}
                deliveryMode={deliveryMode}
                setDeliveryMode={setDeliveryMode}
              />
            ) : (
              <CustomerFields values={values} updateValue={updateValue} />
            )}
            <div className="mt-10 flex items-center justify-end gap-4">
              {saved && <span className="text-xs text-emerald-600">Profile updated</span>}
              {saveError && <span className="text-xs text-red-600">{saveError}</span>}
              <button type="submit" disabled={saving} className="rounded-md bg-[#225b84] px-12 py-3 text-xs font-medium text-white transition hover:bg-[#174867] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SettingsItem({
  label,
  icon,
  danger = false,
}: {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Link href="#" className={`flex items-center justify-between rounded-md px-2 py-2.5 ${danger ? "text-[#d95464]" : "text-[#626677]"} hover:bg-slate-50`}>
      <span className="flex items-center gap-2">{icon}{label}</span>
      <ChevronRight size={13} />
    </Link>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] text-[#303447]">{label}</span>
      <span className="relative block">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c8190]">{icon}</span>}
        <input value={value} onChange={onChange} placeholder={placeholder} className={`h-10 w-full rounded-md border border-[#e4e5e9] bg-white px-3 text-xs text-[#303447] outline-none transition focus:border-[#2676aa] ${icon ? "pl-8" : ""}`} />
      </span>
    </label>
  );
}

function CustomerFields({ values, updateValue }: { values: FormValues; updateValue: (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="First Name:" value={values.firstName} onChange={updateValue("firstName")} />
      <Field label="Middle Name:" value={values.middleName} onChange={updateValue("middleName")} />
      <Field label="Last Name:" value={values.lastName} onChange={updateValue("lastName")} />
      <Field label="Email" value={values.email} onChange={updateValue("email")} />
      <Field label="Phone Number" value={values.phone} onChange={updateValue("phone")} icon={<Phone size={13} />} />
      <Field label="Primary Address" value={values.address} onChange={updateValue("address")} icon={<MapPin size={13} />} />
      <Field label="LGA" value={values.lga} onChange={updateValue("lga")} icon={<MapPin size={13} />} />
      <Field label="Country" value={values.country} onChange={updateValue("country")} icon={<MapPin size={13} />} />
      <Field label="Date Of Birth" value={values.dateOfBirth} onChange={updateValue("dateOfBirth")} />
    </div>
  );
}

function VendorFields({
  values,
  updateValue,
  selectedCylinders,
  setSelectedCylinders,
  deliveryMode,
  setDeliveryMode,
}: {
  values: FormValues;
  updateValue: (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => void;
  selectedCylinders: string[];
  setSelectedCylinders: (values: string[]) => void;
  deliveryMode: string;
  setDeliveryMode: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Business Name:" value={values.businessName} onChange={updateValue("businessName")} placeholder="Enter Your Business Name" />
      <Field label="Mode Of Contact" value={values.contact} onChange={updateValue("contact")} placeholder="Phone Number/Email" />
      <Field label="Business Address:" value={values.businessAddress} onChange={updateValue("businessAddress")} placeholder="Enter Your Business Address" />
      <Field label="LGA" value={values.lga} onChange={updateValue("lga")} />
      <Field label="Opening Hours" value={values.openingHours} onChange={updateValue("openingHours")} placeholder="PM / AM" />
      <Field label="NIN / CAC Number" value={values.ninCac} onChange={updateValue("ninCac")} placeholder="ID Number" />
      <div>
        <span className="mb-2 block text-[11px] text-[#303447]">Available Cylinder</span>
        <div className="flex flex-wrap gap-2 rounded-md border border-[#e4e5e9] p-2">
          {cylinderOptions.map((cylinder) => {
            const selected = selectedCylinders.includes(cylinder);
            return (
              <button type="button" key={cylinder} onClick={() => setSelectedCylinders(selected ? selectedCylinders.filter((item) => item !== cylinder) : [...selectedCylinders, cylinder])} className={`rounded-md px-3 py-2 text-xs ${selected ? "bg-[#225b84] text-white" : "bg-slate-50 text-[#626677]"}`}>
                {cylinder}
              </button>
            );
          })}
        </div>
      </div>
      <label className="block">
        <span className="mb-2 block text-[11px] text-[#303447]">Mode Of Delivery</span>
        <select value={deliveryMode} onChange={(event) => setDeliveryMode(event.target.value)} className="h-10 w-full rounded-md border border-[#e4e5e9] bg-white px-3 text-xs text-[#626677] outline-none focus:border-[#2676aa]">
          <option>Multiple Choice</option>
          <option>Home Delivery</option>
          <option>Pickup</option>
        </select>
      </label>
      <Field label="Areas You Can Serve (within LGA)" value={values.areas} onChange={updateValue("areas")} placeholder="Enter locations" />
      <div className="rounded-lg border border-[#e4e5e9] p-4">
        <p className="text-xs font-medium text-[#303447]">Documents Upload</p>
        <p className="mt-2 text-[11px] text-[#777b8b]">Upload a valid document to verify your business (CAC / NIN).</p>
        <label className="mt-4 flex h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#d9dbe1] text-[#9ca0ad]">
          <ImagePlus size={20} />
          <span className="mt-1 text-[10px]">JPEG (10 mb)</span>
          <input type="file" accept="image/jpeg,image/png,application/pdf" className="hidden" />
        </label>
      </div>
    </div>
  );
}