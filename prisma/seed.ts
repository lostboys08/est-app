import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Wipe existing data in dependency order
  await prisma.rFQResponse.deleteMany();
  await prisma.rFQ.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // ── User ──────────────────────────────────────────────────────────────────
  const user = await prisma.user.create({
    data: { email: "default@estapp.local", name: "Default User" },
  });

  // ── Contacts ──────────────────────────────────────────────────────────────
  const contacts = await Promise.all([
    // Subcontractors
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Asphalt",                 name: "John Martinez",   company: "Pacific Asphalt Inc.",        email: "john@pacificasphalt.com",     phone: "951-555-0101", location: "Riverside, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Landscaping",             name: "Sarah Chen",      company: "GreenScape Landscaping",      email: "sarah@greenscape.com",        phone: "951-555-0102", location: "Corona, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Waterworks",              name: "Mike Thompson",   company: "Western Waterworks LLC",      email: "mike@westernwaterworks.com",  phone: "909-555-0103", location: "Ontario, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Electrical",              name: "Dan Rodriguez",   company: "Apex Electrical",             email: "dan@apexelectrical.com",      phone: "951-555-0104", location: "Riverside, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Painting",                name: "Lisa Wong",       company: "ProPaint Solutions",          email: "lisa@propaint.com",           phone: "714-555-0105", location: "Anaheim, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Railings",                name: "Carlos Ruiz",     company: "SteelGate Railings",          email: "carlos@steelgate.com",        phone: "951-555-0106", location: "Perris, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Shoring",                 name: "Bob Hayes",       company: "NorCal Shoring Inc.",         email: "bob@norcalshoring.com",       phone: "916-555-0107", location: "Sacramento, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Boring/Tunneling",        name: "Steve Park",      company: "Deep Bore Tunneling",         email: "steve@deepbore.com",          phone: "562-555-0108", location: "Long Beach, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Dewatering",              name: "Tom Nguyen",      company: "AllClear Dewatering",         email: "tom@allclear.com",            phone: "951-555-0109", location: "Temecula, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Sports Field Equipment",  name: "Amy Johnson",     company: "FieldPro Sports Equipment",   email: "amy@fieldprosports.com",      phone: "760-555-0110", location: "San Bernardino, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "Precast",                 name: "Greg Hoffman",    company: "Western Precast Products",    email: "greg@westernprecast.com",     phone: "951-555-0111", location: "Fontana, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUBCONTRACTOR", subCategory: "HVAC",                    name: "Diana Marsh",     company: "Climate Control Systems",     email: "diana@climatecontrol.com",    phone: "909-555-0112", location: "Rancho Cucamonga, CA" } }),

    // Suppliers
    prisma.contact.create({ data: { userId: user.id, type: "SUPPLIER", subCategory: "Concrete",    name: "Frank Miller",    company: "Pacific Coast Concrete",      email: "frank@pcconcrete.com",        phone: "951-555-0201", location: "Riverside, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUPPLIER", subCategory: "Rebar",       name: "James Kim",       company: "Bay Area Rebar Supply",       email: "james@barebar.com",           phone: "510-555-0202", location: "Oakland, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUPPLIER", subCategory: "Aggregates",  name: "Patricia Lee",    company: "Valley Aggregates Inc.",      email: "pat@valleyagg.com",           phone: "951-555-0203", location: "Hemet, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUPPLIER", subCategory: "Bolts",       name: "Richard Torres",  company: "Industrial Bolt & Fastener",  email: "richard@indubolt.com",        phone: "213-555-0204", location: "Los Angeles, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "SUPPLIER", subCategory: "Concrete",    name: "Nancy Adams",     company: "Northwest Ready Mix",         email: "nancy@nwreadymix.com",        phone: "951-555-0205", location: "Corona, CA" } }),

    // General Contractors
    prisma.contact.create({ data: { userId: user.id, type: "GENERAL_CONTRACTOR", name: "Bill Harrison",  company: "Coastal Construction Group",    email: "bill@coastalcg.com",          phone: "949-555-0301", location: "Newport Beach, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "GENERAL_CONTRACTOR", name: "Karen White",    company: "Summit Builders Inc.",          email: "karen@summitbuilders.com",    phone: "951-555-0302", location: "Riverside, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "GENERAL_CONTRACTOR", name: "Dave Chen",      company: "Pacific General Contracting",   email: "dave@pacificgc.com",          phone: "714-555-0303", location: "Fullerton, CA" } }),

    // Owners
    prisma.contact.create({ data: { userId: user.id, type: "OWNER", name: "Public Works Dept",  company: "City of Riverside",             email: "pwdept@cityofriverside.gov",  phone: "951-555-0401", location: "Riverside, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "OWNER", name: "Mark Rivera",        company: "Eastside Sports Authority",     email: "mark@eastsidesa.com",         phone: "951-555-0402", location: "Moreno Valley, CA" } }),

    // Architects
    prisma.contact.create({ data: { userId: user.id, type: "ARCHITECT", name: "Rachel Green",  company: "Design Build Associates",       email: "rachel@designbuild.com",      phone: "323-555-0501", location: "Pasadena, CA" } }),
    prisma.contact.create({ data: { userId: user.id, type: "ARCHITECT", name: "Paul Foster",   company: "Civil Design Group",            email: "paul@civildesign.com",        phone: "951-555-0502", location: "Riverside, CA" } }),
  ]);

  const [
    cAsphalt, cLandscape, cWaterworks, cElectrical, cPainting,
    cRailings, cShoring, cBoring, cDewater, cSports,
    cPrecast, cHVAC,
    cConcrete1, cRebar, cAggregates, cBolts, cConcrete2,
    cGC1, cGC2, cGC3,
    cOwner1, cOwner2,
    cArch1, cArch2,
  ] = contacts;

  // ── Projects ──────────────────────────────────────────────────────────────
  const [proj1, proj2, proj3, proj4, proj5] = await Promise.all([
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Cedar Creek Bridge Replacement",
        location: "Cedar Creek Rd, Riverside County",
        bidDueDate: new Date("2026-03-15"),
        fileUrl: "https://drive.example.com/cedar-creek-bridge",
        description:
          "Bridge deck replacement and structural rehabilitation on Cedar Creek Road. Includes removal of existing 60-year-old concrete deck and installation of new pre-stressed concrete beams.",
      },
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Riverside Sports Complex",
        location: "1200 Sports Drive, Riverside, CA",
        bidDueDate: new Date("2026-04-30"),
        fileUrl: "https://drive.example.com/riverside-sports",
        description:
          "New 15-acre sports complex with 4 soccer fields, 6 tennis/pickleball courts, and associated amenities including parking, restrooms, and concession stand.",
      },
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Industrial Pump Station #4",
        location: "800 Industrial Blvd, Commerce, CA",
        bidDueDate: new Date("2026-02-28"),
        fileUrl: "https://drive.example.com/pump-station-4",
        description:
          "New stormwater pump station with 3 submersible pumps, wet well, control building, and backup generator. Design capacity 50 CFS.",
      },
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Main Street Sidewalk Improvements",
        location: "Main St, 1st Ave to 10th Ave",
        bidDueDate: new Date("2026-03-31"),
        description:
          "ADA-compliant sidewalk reconstruction, curb ramps, and street lighting along 0.8 miles of Main Street.",
      },
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        name: "Downtown Parking Structure",
        location: "500 Commerce St, Downtown Riverside",
        bidDueDate: new Date("2025-12-15"),
        archived: true,
        description:
          "6-level, 850-space precast concrete parking structure with EV charging stations and ground-floor retail space.",
      },
    }),
  ]);

  // ── RFQs ──────────────────────────────────────────────────────────────────
  // Cedar Creek Bridge
  await prisma.rFQ.createMany({
    data: [
      { userId: user.id, projectId: proj1.id, contactId: cPrecast.id,    subject: `RFQ: ${proj1.name}`, status: "SENT"     },
      { userId: user.id, projectId: proj1.id, contactId: cRebar.id,      subject: `RFQ: ${proj1.name}`, status: "RECEIVED" },
      { userId: user.id, projectId: proj1.id, contactId: cConcrete1.id,  subject: `RFQ: ${proj1.name}`, status: "SENT"     },
      { userId: user.id, projectId: proj1.id, contactId: cAggregates.id, subject: `RFQ: ${proj1.name}`, status: "DRAFT"    },
      { userId: user.id, projectId: proj1.id, contactId: cAsphalt.id,    subject: `RFQ: ${proj1.name}`, status: "RECEIVED" },
      { userId: user.id, projectId: proj1.id, contactId: cPainting.id,   subject: `RFQ: ${proj1.name}`, status: "SENT"     },
      { userId: user.id, projectId: proj1.id, contactId: cRailings.id,   subject: `RFQ: ${proj1.name}`, status: "DRAFT"    },
    ],
  });

  // Riverside Sports Complex
  await prisma.rFQ.createMany({
    data: [
      { userId: user.id, projectId: proj2.id, contactId: cSports.id,     subject: `RFQ: ${proj2.name}`, status: "SENT"  },
      { userId: user.id, projectId: proj2.id, contactId: cLandscape.id,  subject: `RFQ: ${proj2.name}`, status: "DRAFT" },
      { userId: user.id, projectId: proj2.id, contactId: cElectrical.id, subject: `RFQ: ${proj2.name}`, status: "SENT"  },
      { userId: user.id, projectId: proj2.id, contactId: cConcrete2.id,  subject: `RFQ: ${proj2.name}`, status: "DRAFT" },
      { userId: user.id, projectId: proj2.id, contactId: cAsphalt.id,    subject: `RFQ: ${proj2.name}`, status: "DRAFT" },
    ],
  });

  // Industrial Pump Station
  await prisma.rFQ.createMany({
    data: [
      { userId: user.id, projectId: proj3.id, contactId: cDewater.id,    subject: `RFQ: ${proj3.name}`, status: "CLOSED"   },
      { userId: user.id, projectId: proj3.id, contactId: cShoring.id,    subject: `RFQ: ${proj3.name}`, status: "CLOSED"   },
      { userId: user.id, projectId: proj3.id, contactId: cElectrical.id, subject: `RFQ: ${proj3.name}`, status: "RECEIVED" },
      { userId: user.id, projectId: proj3.id, contactId: cPrecast.id,    subject: `RFQ: ${proj3.name}`, status: "RECEIVED" },
      { userId: user.id, projectId: proj3.id, contactId: cHVAC.id,       subject: `RFQ: ${proj3.name}`, status: "CLOSED"   },
      { userId: user.id, projectId: proj3.id, contactId: cConcrete1.id,  subject: `RFQ: ${proj3.name}`, status: "CLOSED"   },
    ],
  });

  // Main Street Sidewalk
  await prisma.rFQ.createMany({
    data: [
      { userId: user.id, projectId: proj4.id, contactId: cConcrete2.id,  subject: `RFQ: ${proj4.name}`, status: "DRAFT" },
      { userId: user.id, projectId: proj4.id, contactId: cAggregates.id, subject: `RFQ: ${proj4.name}`, status: "DRAFT" },
      { userId: user.id, projectId: proj4.id, contactId: cAsphalt.id,    subject: `RFQ: ${proj4.name}`, status: "SENT"  },
      { userId: user.id, projectId: proj4.id, contactId: cLandscape.id,  subject: `RFQ: ${proj4.name}`, status: "DRAFT" },
    ],
  });

  console.log("Done! Seeded:");
  console.log(`  1 user`);
  console.log(`  ${contacts.length} contacts`);
  console.log(`  5 projects (1 archived)`);
  console.log(`  ${7 + 5 + 6 + 4} RFQs across 4 projects`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
