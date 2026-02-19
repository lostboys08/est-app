export const contactTypes = [
  { value: "SUBCONTRACTOR", label: "Subcontractor" },
  { value: "SUPPLIER", label: "Supplier" },
  { value: "GENERAL_CONTRACTOR", label: "General Contractor" },
  { value: "OWNER", label: "Owner" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "OTHER", label: "Other" },
];

export const SUBCATEGORIES: Record<string, string[]> = {
  SUPPLIER: ["Concrete", "Rebar", "Aggregates", "Bolts"],
  SUBCONTRACTOR: [
    "Asphalt",
    "Landscaping",
    "Waterworks",
    "Precast",
    "Electrical",
    "Painting",
    "Doors",
    "Railings",
    "Rough Carpentry",
    "Overhead Cranes",
    "HVAC",
    "Shoring",
    "Telemetry",
    "Dewatering",
    "Boring/Tunneling",
    "Pumps&Controls",
    "Sports Field Equipment",
    "Tennis/Pickleball Courts",
    "Artificial Turf",
  ],
};
