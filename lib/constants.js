export const CITIES = [
  "Mumbai",
  "Bangalore",
  "Gurgaon",
  "Delhi NCR",
  "Pune",
  "Hyderabad",
  "Noida",
  "Chennai",
  "Kolkata",
];

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment / Flat" },
  { value: "villa", label: "Independent Villa" },
  { value: "independent_house", label: "Independent House" },
  { value: "plot", label: "Residential Plot" },
  { value: "commercial", label: "Commercial Space" },
];

export const BHK_OPTIONS = [
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4+ BHK" },
];

export const BUDGET_RANGES = [
  { label: "Under ₹50 Lac", max: 5000000 },
  { label: "₹50 Lac - ₹1 Cr", min: 5000000, max: 10000000 },
  { label: "₹1 Cr - ₹2 Cr", min: 10000000, max: 20000000 },
  { label: "₹2 Cr - ₹5 Cr", min: 20000000, max: 50000000 },
  { label: "₹5 Cr+", min: 50000000 },
];
