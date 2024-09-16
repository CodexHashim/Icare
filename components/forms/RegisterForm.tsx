"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { FileUploader } from "../FileUploader";
import SubmitButton from "../SubmitButton";

// Mock data for countries, states, and cities
const countries = [
  "India",
  "Nepal",
  "Bhutan",
  "Bangladesh",
  "Sri Lanka",
  "Others",
];

const states = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
    "Ladakh",
    "Jammu and Kashmir",
  ],
  Nepal: ["Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"],
  Bhutan: ["Thimphu", "Paro", "Punakha"],
  Bangladesh: ["Dhaka", "Chittagong", "Khulna"],
  SriLanka: ["Western", "Central", "Southern"],
  Others: ["Others"],
};

const cities = {
  // Indian States
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Korba"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Haryana: ["Gurgaon", "Faridabad", "Panipat"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Karnataka: ["Bangalore", "Mysore", "Hubli"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Manipur: ["Imphal", "Thoubal", "Churachandpur"],
  Meghalaya: ["Shillong", "Tura", "Jowai"],
  Mizoram: ["Aizawl", "Lunglei", "Saiha"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Punjab: ["Chandigarh", "Amritsar", "Ludhiana"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur"],
  Sikkim: ["Gangtok", "Namchi", "Pelling"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital"],
  "West Bengal": ["Kolkata", "Darjeeling", "Siliguri"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  Delhi: ["New Delhi"],
  Lakshadweep: ["Kavaratti"],
  Puducherry: ["Puducherry", "Karaikal", "Yanam"],
  Ladakh: ["Leh", "Kargil"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag"],

  // Neighboring Countries
  Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur"],
  Gandaki: ["Pokhara", "Gorkha", "Bandipur"],
  Lumbini: ["Bhairahawa", "Lumbini", "Butwal"],
  Karnali: ["Surkhet", "Jumla", "Chisapani"],
  Sudurpashchim: ["Dhangadhi", "Mahendranagar", "Dadeldhura"],

  Thimphu: ["Thimphu", "Paro", "Punakha"],
  Dhaka: ["Dhaka", "Narayanganj", "Savar"],
  Chittagong: ["Chittagong", "Cox's Bazar", "Rangamati"],
  Khulna: ["Khulna", "Jessore", "Satkhira"],

  Western: ["Colombo", "Negombo", "Gampaha"],
  Central: ["Kandy", "Nuwara Eliya", "Matale"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Others: ["Others"],
};

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: "",
      state: "",
      city: "",
    },
  });

  useEffect(() => {
    form.setValue("state", "");
    form.setValue("city", "");
  }, [selectedCountry, form]);

  useEffect(() => {
    form.setValue("city", "");
  }, [selectedState, form]);

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        country: values.country,
        state: values.state,
        city: values.city,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };
      console.log("Patient data being sent:");
      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

          {/* NAME */}

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="Hashim Ahmed"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          {/* EMAIL & PHONE */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email address"
              placeholder="admin@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* BirthDate & Gender */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          {/* Address & Occupation */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street, New york, NY - 5101"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder=" Software Engineer"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="country"
              label="Country"
              renderSkeleton={(field) => (
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCountry(value);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              )}
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="state"
              label="State"
              renderSkeleton={(field) => (
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedState(value);
                    }}
                    defaultValue={field.value}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCountry &&
                        states[selectedCountry as keyof typeof states].map(
                          (state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </FormControl>
              )}
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="city"
              label="City"
              renderSkeleton={(field) => (
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedState &&
                        cities[selectedState as keyof typeof cities].map(
                          (city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/* Emergency Contact Name & Emergency Contact Number */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="(555) 123-4567"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>

          {/* PRIMARY CARE PHYSICIAN */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {/* INSURANCE & POLICY NUMBER */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>

          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medications"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>

          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Mother had brain cancer, Father has hypertension"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Form, FormControl } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Doctors,
//   GenderOptions,
//   IdentificationTypes,
//   PatientFormDefaultValues,
// } from "@/constants";
// import { registerPatient } from "@/lib/actions/patient.actions";
// import CustomFormField, { FormFieldType } from "../CustomFormField";
// import { FileUploader } from "../FileUploader";
// import SubmitButton from "../SubmitButton";

// import "react-datepicker/dist/react-datepicker.css";
// import "react-phone-number-input/style.css";

// // Define PatientFormValidation schema
// const PatientFormValidation = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(1, "Phone number is required"),
//   birthDate: z.date(),
//   gender: z.enum(["Male", "Female", "Other"]),
//   address: z.string().min(1, "Address is required"),
//   country: z.string().min(1, "Country is required"),
//   state: z.string().min(1, "State is required"),
//   city: z.string().min(1, "City is required"),
//   occupation: z.string().min(1, "Occupation is required"),
//   emergencyContactName: z.string().min(1, "Emergency contact name is required"),
//   emergencyContactNumber: z
//     .string()
//     .min(1, "Emergency contact number is required"),
//   primaryPhysician: z.string().min(1, "Primary physician is required"),
//   insuranceProvider: z.string().min(1, "Insurance provider is required"),
//   insurancePolicyNumber: z
//     .string()
//     .min(1, "Insurance policy number is required"),
//   allergies: z.string().optional(),
//   currentMedication: z.string().optional(),
//   familyMedicalHistory: z.string().optional(),
//   pastMedicalHistory: z.string().optional(),
//   identificationType: z.enum(IdentificationTypes),
//   identificationNumber: z.string().min(1, "Identification number is required"),
//   identificationDocument: z.any().optional(),
//   privacyConsent: z.boolean().refine((val) => val === true, {
//     message: "You must agree to the privacy policy",
//   }),
// });

// // Mock data for countries, states, and cities
// const countries = [
//   "India",
//   "Nepal",
//   "Bhutan",
//   "Bangladesh",
//   "Sri Lanka",
//   "Others",
// ];

// const states = {
//   India: [
//     "Andhra Pradesh",
//     "Arunachal Pradesh",
//     "Assam",
//     "Bihar",
//     "Chhattisgarh",
//     "Goa",
//     "Gujarat",
//     "Haryana",
//     "Himachal Pradesh",
//     "Jharkhand",
//     "Karnataka",
//     "Kerala",
//     "Madhya Pradesh",
//     "Maharashtra",
//     "Manipur",
//     "Meghalaya",
//     "Mizoram",
//     "Nagaland",
//     "Odisha",
//     "Punjab",
//     "Rajasthan",
//     "Sikkim",
//     "Tamil Nadu",
//     "Telangana",
//     "Tripura",
//     "Uttar Pradesh",
//     "Uttarakhand",
//     "West Bengal",
//     "Andaman and Nicobar Islands",
//     "Chandigarh",
//     "Dadra and Nagar Haveli and Daman and Diu",
//     "Delhi",
//     "Lakshadweep",
//     "Puducherry",
//     "Ladakh",
//     "Jammu and Kashmir",
//   ],
//   Nepal: ["Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"],
//   Bhutan: ["Thimphu", "Paro", "Punakha"],
//   Bangladesh: ["Dhaka", "Chittagong", "Khulna"],
//   SriLanka: ["Western", "Central", "Southern"],
//   Others: ["Others"],
// };

// const cities = {
//   // Indian States
//   "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
//   "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"],
//   Assam: ["Guwahati", "Dibrugarh", "Silchar"],
//   Bihar: ["Patna", "Gaya", "Bhagalpur"],
//   Chhattisgarh: ["Raipur", "Bilaspur", "Korba"],
//   Goa: ["Panaji", "Margao", "Vasco da Gama"],
//   Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
//   Haryana: ["Gurgaon", "Faridabad", "Panipat"],
//   "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
//   Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
//   Karnataka: ["Bangalore", "Mysore", "Hubli"],
//   Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
//   "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur"],
//   Maharashtra: ["Mumbai", "Pune", "Nagpur"],
//   Manipur: ["Imphal", "Thoubal", "Churachandpur"],
//   Meghalaya: ["Shillong", "Tura", "Jowai"],
//   Mizoram: ["Aizawl", "Lunglei", "Saiha"],
//   Nagaland: ["Kohima", "Dimapur", "Mokokchung"],
//   Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
//   Punjab: ["Chandigarh", "Amritsar", "Ludhiana"],
//   Rajasthan: ["Jaipur", "Jodhpur", "Udaipur"],
//   Sikkim: ["Gangtok", "Namchi", "Pelling"],
//   "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
//   Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
//   Tripura: ["Agartala", "Udaipur", "Dharmanagar"],
//   "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
//   Uttarakhand: ["Dehradun", "Haridwar", "Nainital"],
//   "West Bengal": ["Kolkata", "Darjeeling", "Siliguri"],
//   "Andaman and Nicobar Islands": ["Port Blair"],
//   Chandigarh: ["Chandigarh"],
//   "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
//   Delhi: ["New Delhi"],
//   Lakshadweep: ["Kavaratti"],
//   Puducherry: ["Puducherry", "Karaikal", "Yanam"],
//   Ladakh: ["Leh", "Kargil"],
//   "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag"],

//   // Neighboring Countries
//   Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur"],
//   Gandaki: ["Pokhara", "Gorkha", "Bandipur"],
//   Lumbini: ["Bhairahawa", "Lumbini", "Butwal"],
//   Karnali: ["Surkhet", "Jumla", "Chisapani"],
//   Sudurpashchim: ["Dhangadhi", "Mahendranagar", "Dadeldhura"],

//   Thimphu: ["Thimphu", "Paro", "Punakha"],
//   Dhaka: ["Dhaka", "Narayanganj", "Savar"],
//   Chittagong: ["Chittagong", "Cox's Bazar", "Rangamati"],
//   Khulna: ["Khulna", "Jessore", "Satkhira"],

//   Western: ["Colombo", "Negombo", "Gampaha"],
//   Central: ["Kandy", "Nuwara Eliya", "Matale"],
//   Southern: ["Galle", "Matara", "Hambantota"],
//   Others: ["Others"],
// };

// const RegisterForm = ({ user }: { user: User }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");

//   const form = useForm<z.infer<typeof PatientFormValidation>>({
//     resolver: zodResolver(PatientFormValidation),
//     defaultValues: {
//       ...PatientFormDefaultValues,
//       name: user?.name || "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//       country: "",
//       state: "",
//       city: "",
//     },
//   });

//   useEffect(() => {
//     form.setValue("state", "");
//     form.setValue("city", "");
//   }, [selectedCountry, form]);

//   useEffect(() => {
//     form.setValue("city", "");
//   }, [selectedState, form]);

//   const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
//     setIsLoading(true);

//     try {
//       // Store file info in form data
//       let formData;
//       if (
//         values.identificationDocument &&
//         values.identificationDocument.length > 0
//       ) {
//         const blobFile = new Blob([values.identificationDocument[0]], {
//           type: values.identificationDocument[0].type,
//         });

//         formData = new FormData();
//         formData.append("blobFile", blobFile);
//         formData.append("fileName", values.identificationDocument[0].name);
//       }

//       const patient = {
//         userId: user.$id,
//         name: values.name,
//         email: values.email,
//         phone: values.phone,
//         birthDate: new Date(values.birthDate),
//         gender: values.gender,
//         address: values.address,
//         country: values.country,
//         state: values.state,
//         city: values.city,
//         occupation: values.occupation,
//         emergencyContactName: values.emergencyContactName,
//         emergencyContactNumber: values.emergencyContactNumber,
//         primaryPhysician: values.primaryPhysician,
//         insuranceProvider: values.insuranceProvider,
//         insurancePolicyNumber: values.insurancePolicyNumber,
//         allergies: values.allergies,
//         currentMedication: values.currentMedication,
//         familyMedicalHistory: values.familyMedicalHistory,
//         pastMedicalHistory: values.pastMedicalHistory,
//         identificationType: values.identificationType,
//         identificationNumber: values.identificationNumber,
//         identificationDocument: formData,
//         privacyConsent: values.privacyConsent,
//       };

//       const newPatient = await registerPatient(patient);

//       if (newPatient) {
//         router.push(`/patients/${user.$id}/new-appointment`);
//       }
//     } catch (error) {
//       console.error(error);
//     }

//     setIsLoading(false);
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex-1 space-y-12"
//       >
//         <section className="space-y-4">
//           <h1 className="header">Welcome 👋</h1>
//           <p className="text-dark-700">Let us know more about yourself.</p>
//         </section>

//         <section className="space-y-6">
//           <div className="mb-9 space-y-1">
//             <h2 className="sub-header">Personal Information</h2>
//           </div>

//           <CustomFormField
//             fieldType={FormFieldType.INPUT}
//             control={form.control}
//             name="name"
//             placeholder="Hashim Ahmed"
//             iconSrc="/assets/icons/user.svg"
//             iconAlt="user"
//           />

//           <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//               fieldType={FormFieldType.INPUT}
//               control={form.control}
//               name="email"
//               label="Email address"
//               placeholder="admin@gmail.com"
//               iconSrc="/assets/icons/email.svg"
//               iconAlt="email"
//             />

//             <CustomFormField
//               fieldType={FormFieldType.PHONE_INPUT}
//               control={form.control}
//               name="phone"
//               label="Phone Number"
//               placeholder="(555) 123-4567"
//             />
//           </div>

//           <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//               fieldType={FormFieldType.DATE_PICKER}
//               control={form.control}
//               name="birthDate"
//               label="Date of birth"
//             />

//             <CustomFormField
//               fieldType={FormFieldType.SKELETON}
//               control={form.control}
//               name="gender"
//               label="Gender"
//               renderSkeleton={(field) => (
//                 <FormControl>
//                   <RadioGroup
//                     className="flex h-11 gap-6 xl:justify-between"
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     {GenderOptions.map((option, i) => (
//                       <div key={option + i} className="radio-group">
//                         <RadioGroupItem value={option} id={option} />
//                         <Label htmlFor={option} className="cursor-pointer">
//                           {option}
//                         </Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </FormControl>
//               )}
//             />
//           </div>

//           <div className="flex flex-col gap-6">
//             <CustomFormField
//               fieldType={FormFieldType.INPUT}
//               control={form.control}
//               name="address"
//               label="Address"
//               placeholder="14 street, New york, NY - 5101"
//             />

//             <div className="flex flex-col gap-6 xl:flex-row">
//               <CustomFormField
//                 fieldType={FormFieldType.SKELETON}
//                 control={form.control}
//                 name="country"
//                 label="Country"
//                 renderSkeleton={(field) => (
//                   <FormControl>
//                     <Select
//                       onValueChange={(value) => {
//                         field.onChange(value);
//                         setSelectedCountry(value);
//                       }}
//                       defaultValue={field.value}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {countries.map((country) => (
//                           <SelectItem key={country} value={country}>
//                             {country}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                 )}
//               />

//               <CustomFormField
//                 fieldType={FormFieldType.SKELETON}
//                 control={form.control}
//                 name="state"
//                 label="State"
//                 renderSkeleton={(field) => (
//                   <FormControl>
//                     <Select
//                       onValueChange={(value) => {
//                         field.onChange(value);
//                         setSelectedState(value);
//                       }}
//                       defaultValue={field.value}
//                       disabled={!selectedCountry}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a state" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {selectedCountry &&
//                           states[selectedCountry as keyof typeof states].map(
//                             (state) => (
//                               <SelectItem key={state} value={state}>
//                                 {state}
//                               </SelectItem>
//                             )
//                           )}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                 )}
//               />

//               <CustomFormField
//                 fieldType={FormFieldType.SKELETON}
//                 control={form.control}
//                 name="city"
//                 label="City"
//                 renderSkeleton={(field) => (
//                   <FormControl>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={!selectedState}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a city" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {selectedState &&
//                           cities[selectedState as keyof typeof cities].map(
//                             (city) => (
//                               <SelectItem key={city} value={city}>
//                                 {city}
//                               </SelectItem>
//                             )
//                           )}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                 )}
//               />
//             </div>

//             <CustomFormField
//               fieldType={FormFieldType.INPUT}
//               control={form.control}
//               name="occupation"
//               label="Occupation"
//               placeholder="Software Engineer"
//             />
//           </div>

//           <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//               fieldType={FormFieldType.INPUT}
//               control={form.control}
//               name="emergencyContactName"
//               label="Emergency contact name"
//               placeholder="Guardian's name"
//             />

//             <CustomFormField
//               fieldType={FormFieldType.PHONE_INPUT}
//               control={form.control}
//               name="emergencyContactNumber"
//               label="Emergency contact number"
//               placeholder="(555) 123-4567"
//             />
//           </div>
//         </section>

//         <section className="space-y-6">
//           <div className="mb-9 space-y-1">
//             <h2 className="sub-header">Medical Information</h2>
//           </div>

//           <CustomFormField
//             fieldType={FormFieldType.SELECT}
//             control={form.control}
//             name="primaryPhysician"
//             label="Primary care physician"
//             placeholder="Select a physician"
//           >
//             {Doctors.map((doctor, i) => (
//               <SelectItem key={doctor.name + i} value={doctor.name}>
//                 <div className="flex cursor-pointer items-center gap-2">
//                   <Image
//                     src={doctor.image}
//                     width={32}
//                     height={32}
//                     alt="doctor"
//                     className="rounded-full border border-dark-500"
//                   />
//                   <p>{doctor.name}</p>
//                 </div>
//               </SelectItem>
//             ))}
//           </CustomFormField>

//           <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//               fieldType={FormFieldType.INPUT}
//               control={form.control}
//               name="insuranceProvider"
//               label="Insurance provider"
//               placeholder="BlueCross BlueShield"
//             />

//             <CustomFormField
//               fieldType={FormFieldType.INPUT}
//               control={form.control}
//               name="insurancePolicyNumber"
//               label="Insurance policy number"
//               placeholder="ABC123456789"
//             />
//           </div>

//           <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//               fieldType={FormFieldType.TEXTAREA}
//               control={form.control}
//               name="allergies"
//               label="Allergies (if any)"
//               placeholder="Peanuts, Penicillin, Pollen"
//             />

//             <CustomFormField
//               fieldType={FormFieldType.TEXTAREA}
//               control={form.control}
//               name="currentMedication"
//               label="Current medications"
//               placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
//             />
//           </div>

//           <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//               fieldType={FormFieldType.TEXTAREA}
//               control={form.control}
//               name="familyMedicalHistory"
//               label="Family medical history (if relevant)"
//               placeholder="Mother had brain cancer, Father has hypertension"
//             />

//             <CustomFormField
//               fieldType={FormFieldType.TEXTAREA}
//               control={form.control}
//               name="pastMedicalHistory"
//               label="Past medical history"
//               placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
//             />
//           </div>
//         </section>

//         <section className="space-y-6">
//           <div className="mb-9 space-y-1">
//             <h2 className="sub-header">Identification and Verification</h2>
//           </div>

//           <CustomFormField
//             fieldType={FormFieldType.SELECT}
//             control={form.control}
//             name="identificationType"
//             label="Identification Type"
//             placeholder="Select identification type"
//           >
//             {IdentificationTypes.map((type, i) => (
//               <SelectItem key={type + i} value={type}>
//                 {type}
//               </SelectItem>
//             ))}
//           </CustomFormField>

//           <CustomFormField
//             fieldType={FormFieldType.INPUT}
//             control={form.control}
//             name="identificationNumber"
//             label="Identification Number"
//             placeholder="123456789"
//           />

//           <CustomFormField
//             fieldType={FormFieldType.SKELETON}
//             control={form.control}
//             name="identificationDocument"
//             label="Scanned Copy of Identification Document"
//             renderSkeleton={(field) => (
//               <FormControl>
//                 <FileUploader files={field.value} onChange={field.onChange} />
//               </FormControl>
//             )}
//           />
//         </section>

//         <section className="space-y-6">
//           <div className="mb-9 space-y-1">
//             <h2 className="sub-header">Consent and Privacy</h2>
//           </div>

//           <CustomFormField
//             fieldType={FormFieldType.CHECKBOX}
//             control={form.control}
//             name="privacyConsent"
//             label="I acknowledge that I have reviewed and agree to the privacy policy"
//           />
//         </section>

//         <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
//       </form>
//     </Form>
//   );
// };

// export default RegisterForm;
