export const NEIGHBORHOOD_PROBLEMS: { slug: string; name: string; problem: string }[] = [
  { slug: "/service-areas/diamond-oaks/", name: "Diamond Oaks", problem: "Tree roots in sewer lines" },
  { slug: "/service-areas/browning-heights/", name: "Browning Heights", problem: "Original pipes behind remodels" },
  { slug: "/service-areas/browning-park/", name: "Browning Park", problem: "Water heater leaks in converted garages" },
  { slug: "/service-areas/fossil-ridge/", name: "Fossil Ridge", problem: "Storm runoff and creek water" },
  { slug: "/service-areas/fossil-village/", name: "Fossil Village", problem: "Water pooling at the foundation" },
  { slug: "/service-areas/haltom-acres/", name: "Haltom Acres", problem: "Frozen and burst pipes" },
  { slug: "/service-areas/meadow-oaks/", name: "Meadow Oaks", problem: "Slab leaks from shifting clay" },
  { slug: "/service-areas/stokes-heights/", name: "Stokes Heights", problem: "Attic AC drain overflows" },
  { slug: "/service-areas/eastridge/", name: "Eastridge", problem: "Hail and roof leaks" },
  { slug: "/service-areas/golden-gardens/", name: "Golden Gardens", problem: "Failing cast iron drains" },
  { slug: "/service-areas/jordan-park/", name: "Jordan Park", problem: "Toilet and shower leaks" },
  { slug: "/service-areas/garden-of-eden/", name: "Garden of Eden", problem: "Lingering moisture and mold" },
  { slug: "/service-areas/heritage-village/", name: "Heritage Village", problem: "Fitting leaks in newer homes" },
  { slug: "/service-areas/white-creek-estates/", name: "White Creek Estates", problem: "Kitchen and cabinet leaks" },
];

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/service-areas/", label: "Service Areas" },
  { href: "/insurance-claims-help/", label: "Insurance Help" },
  { href: "/faq/", label: "FAQ" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact-us/", label: "Contact" },
] as const;
