/**
 * components/Navigation/navData.ts
 * Declarative navigation structure mirroring Brilliant Earth's information
 * architecture. Menus are consumed by Header.tsx to render mega-menus.
 */

import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Engagement Rings",
    groups: [
      {
        heading: "Design Your Own",
        items: [
          { label: "Start with a Setting", href: "/configure?entry=START_WITH_SETTING" },
          { label: "Start with a Diamond", href: "/configure?entry=START_WITH_DIAMOND" },
          { label: "Start with a Lab Diamond", href: "/configure?entry=START_WITH_LAB_DIAMOND" },
          { label: "Start with a Gemstone", href: "/configure?entry=START_WITH_GEMSTONE" },
          { label: "Start with a Bridal Set", href: "/configure?entry=START_WITH_BRIDAL_SET" },
        ],
      },
      {
        heading: "Shop by Shape",
        items: [
          { label: "Oval", href: "/engagement-rings?shape=OVAL" },
          { label: "Round", href: "/engagement-rings?shape=ROUND" },
          { label: "Emerald", href: "/engagement-rings?shape=EMERALD" },
          { label: "Radiant", href: "/engagement-rings?shape=RADIANT" },
          { label: "Marquise", href: "/engagement-rings?shape=MARQUISE" },
          { label: "Cushion", href: "/engagement-rings?shape=CUSHION" },
          { label: "Pear", href: "/engagement-rings?shape=PEAR" },
          { label: "Princess", href: "/engagement-rings?shape=PRINCESS" },
          { label: "Asscher", href: "/engagement-rings?shape=ASSCHER" },
          { label: "Heart", href: "/engagement-rings?shape=HEART" },
        ],
      },
      {
        heading: "Shop by Style",
        items: [
          { label: "Solitaire", href: "/engagement-rings?style=SOLITAIRE" },
          { label: "Antique & Vintage", href: "/engagement-rings?style=VINTAGE" },
          { label: "Three Stone", href: "/engagement-rings?style=THREE_STONE" },
          { label: "Nature-Inspired", href: "/engagement-rings?style=NATURE_INSPIRED" },
          { label: "Hidden Halo", href: "/engagement-rings?style=HIDDEN_HALO" },
          { label: "Halo", href: "/engagement-rings?style=HALO" },
          { label: "Bezel", href: "/engagement-rings?style=BEZEL" },
        ],
      },
      {
        heading: "Featured",
        items: [
          { label: "Ready to Ship", href: "/engagement-rings?collection=ready-to-ship", badge: "Fast" },
          { label: "Top 20 Rings", href: "/engagement-rings?collection=top-20" },
          { label: "Custom Rings", href: "/engagement-rings/custom" },
          { label: "Signature Collections", href: "/collections/signature" },
          { label: "Men's Engagement", href: "/engagement-rings?gender=mens" },
        ],
      },
    ],
    featured: [
      { label: "Buying Guide", href: "/education/engagement-ring-guide", description: "Everything you need to know" },
      { label: "Ring Sizing", href: "/education/ring-sizing", description: "Find your perfect fit" },
      { label: "2026 Trends", href: "/blog/engagement-ring-trends-2026", description: "This season's top styles" },
    ],
  },

  {
    label: "Wedding Rings",
    groups: [
      {
        heading: "Women's Wedding Rings",
        items: [
          { label: "All Women's Bands", href: "/wedding-rings/womens" },
          { label: "Platinum", href: "/wedding-rings/womens?metal=PLATINUM" },
          { label: "Yellow Gold", href: "/wedding-rings/womens?metal=EIGHTEEN_K_YELLOW_GOLD" },
          { label: "White Gold", href: "/wedding-rings/womens?metal=EIGHTEEN_K_WHITE_GOLD" },
          { label: "Rose Gold", href: "/wedding-rings/womens?metal=ROSE_GOLD" },
          { label: "Curved & Contour", href: "/wedding-rings/womens?style=curved" },
          { label: "Diamond Bands", href: "/wedding-rings/womens?style=diamond" },
          { label: "Eternity Bands", href: "/wedding-rings/womens?style=eternity" },
        ],
      },
      {
        heading: "Men's Wedding Bands",
        items: [
          { label: "All Men's Bands", href: "/wedding-rings/mens" },
          { label: "Platinum", href: "/wedding-rings/mens?metal=PLATINUM" },
          { label: "Tungsten", href: "/wedding-rings/mens?metal=TUNGSTEN" },
          { label: "Meteorite", href: "/wedding-rings/mens?metal=METEORITE", isNew: true },
          { label: "Yellow Gold", href: "/wedding-rings/mens?metal=EIGHTEEN_K_YELLOW_GOLD" },
          { label: "White Gold", href: "/wedding-rings/mens?metal=EIGHTEEN_K_WHITE_GOLD" },
          { label: "Tantalum", href: "/wedding-rings/mens?metal=TANTALUM" },
          { label: "Matte & Hammered", href: "/wedding-rings/mens?style=matte" },
        ],
      },
      {
        heading: "Collections",
        items: [
          { label: "Couple Rings", href: "/wedding-rings?collection=couples" },
          { label: "Gender Neutral", href: "/wedding-rings?gender=neutral" },
          { label: "Matching Sets", href: "/wedding-rings?collection=matching" },
          { label: "Custom Bands", href: "/wedding-rings/custom" },
        ],
      },
    ],
  },

  {
    label: "Diamonds",
    groups: [
      {
        heading: "Shop Diamonds",
        items: [
          { label: "Natural Diamonds", href: "/diamonds?origin=NATURAL" },
          { label: "Lab Grown Diamonds", href: "/diamonds?origin=LAB_GROWN" },
          { label: "Colored Diamonds", href: "/diamonds?origin=COLORED" },
        ],
      },
      {
        heading: "Shop by Shape",
        items: [
          { label: "Round", href: "/diamonds?shape=ROUND" },
          { label: "Oval", href: "/diamonds?shape=OVAL" },
          { label: "Emerald", href: "/diamonds?shape=EMERALD" },
          { label: "Cushion", href: "/diamonds?shape=CUSHION" },
          { label: "Radiant", href: "/diamonds?shape=RADIANT" },
          { label: "Pear", href: "/diamonds?shape=PEAR" },
          { label: "Princess", href: "/diamonds?shape=PRINCESS" },
          { label: "Asscher", href: "/diamonds?shape=ASSCHER" },
        ],
      },
      {
        heading: "Ethical Collections",
        items: [
          { label: "100% Renewable Energy", href: "/diamonds?renewableEnergy=true", badge: "Eco" },
          { label: "Carbon Capture", href: "/diamonds?carbonCapture=true", badge: "Eco" },
          { label: "Blockchain Certified", href: "/diamonds?blockchainEnabled=true" },
          { label: "Flawless Diamonds", href: "/diamonds?clarity=FL,IF" },
        ],
      },
      {
        heading: "Diamond Jewelry",
        items: [
          { label: "Diamond Earrings", href: "/jewelry/earrings?type=diamond" },
          { label: "Diamond Necklaces", href: "/jewelry/necklaces?type=diamond" },
          { label: "Tennis Bracelets", href: "/jewelry/bracelets?type=tennis" },
        ],
      },
    ],
  },

  {
    label: "Gemstones",
    groups: [
      {
        heading: "Design Your Own",
        items: [{ label: "Gemstone Ring Builder", href: "/configure?entry=START_WITH_GEMSTONE" }],
      },
      {
        heading: "Shop by Gemstone",
        items: [
          { label: "Sapphire", href: "/gemstones?type=sapphire" },
          { label: "Emerald", href: "/gemstones?type=emerald" },
          { label: "Moissanite", href: "/gemstones?type=moissanite" },
          { label: "Ruby", href: "/gemstones?type=ruby" },
          { label: "Aquamarine", href: "/gemstones?type=aquamarine" },
          { label: "Alexandrite", href: "/gemstones?type=alexandrite" },
          { label: "Morganite", href: "/gemstones?type=morganite" },
        ],
      },
      {
        heading: "Shop by Color",
        items: [
          { label: "Blue", href: "/gemstones?color=blue" },
          { label: "Green", href: "/gemstones?color=green" },
          { label: "Pink & Peach", href: "/gemstones?color=pink" },
          { label: "Purple", href: "/gemstones?color=purple" },
          { label: "Teal", href: "/gemstones?color=teal" },
        ],
      },
      {
        heading: "Specialized Collections",
        items: [
          { label: "Montana Sapphires", href: "/collections/montana-sapphires", isNew: true },
          { label: "Moyo Gem", href: "/collections/moyo-gem" },
          { label: "VirtuGem", href: "/collections/virtugem" },
          { label: "Rare Gemstones", href: "/gemstones?collection=rare" },
        ],
      },
    ],
  },

  {
    label: "Jewelry",
    groups: [
      {
        heading: "Earrings",
        items: [
          { label: "All Earrings", href: "/jewelry/earrings" },
          { label: "Diamond Studs", href: "/jewelry/earrings?style=studs" },
          { label: "Gemstone Earrings", href: "/jewelry/earrings?type=gemstone" },
          { label: "Hoops", href: "/jewelry/earrings?style=hoops" },
          { label: "Best Sellers", href: "/jewelry/earrings?collection=best-sellers" },
        ],
      },
      {
        heading: "Necklaces",
        items: [
          { label: "All Necklaces", href: "/jewelry/necklaces" },
          { label: "Tennis Necklaces", href: "/jewelry/necklaces?style=tennis" },
          { label: "Pendant Necklaces", href: "/jewelry/necklaces?style=pendant" },
          { label: "Gemstone Necklaces", href: "/jewelry/necklaces?type=gemstone" },
          { label: "Design Your Own", href: "/configure?category=necklace" },
        ],
      },
      {
        heading: "Rings",
        items: [
          { label: "Cocktail Rings", href: "/jewelry/rings?style=cocktail" },
          { label: "Stackable Rings", href: "/jewelry/rings?style=stackable" },
          { label: "Promise Rings", href: "/jewelry/rings?style=promise" },
          { label: "Anniversary Rings", href: "/jewelry/rings?style=anniversary" },
          { label: "Eternity Bands", href: "/jewelry/rings?style=eternity" },
        ],
      },
      {
        heading: "Collections",
        items: [
          { label: "Jane Goodall Collection", href: "/collections/jane-goodall" },
          { label: "Zodiac Collection", href: "/collections/zodiac" },
          { label: "Pacific Green", href: "/collections/pacific-green", badge: "New" },
          { label: "Love Decoded", href: "/collections/love-decoded" },
          { label: "Best Sellers", href: "/jewelry?collection=best-sellers" },
          { label: "New Arrivals", href: "/jewelry?collection=new-arrivals", isNew: true },
        ],
      },
    ],
  },

  {
    label: "Gifts",
    groups: [
      {
        heading: "Shop by Price",
        items: [
          { label: "Under $250", href: "/gifts?maxPrice=250" },
          { label: "Under $500", href: "/gifts?maxPrice=500" },
          { label: "Under $1,000", href: "/gifts?maxPrice=1000" },
        ],
      },
      {
        heading: "Shop by Recipient",
        items: [
          { label: "For Her", href: "/gifts?for=her" },
          { label: "For Him", href: "/gifts?for=him" },
          { label: "For the Couple", href: "/gifts?for=couple" },
        ],
      },
      {
        heading: "Shop by Occasion",
        items: [
          { label: "Graduation", href: "/gifts?occasion=graduation" },
          { label: "Anniversary", href: "/gifts?occasion=anniversary" },
          { label: "Birthday", href: "/gifts?occasion=birthday" },
          { label: "Wedding Party", href: "/gifts?occasion=wedding-party" },
          { label: "Milestone", href: "/gifts?occasion=milestone" },
        ],
      },
      {
        heading: "Shop by Meaning",
        items: [
          { label: "Birthstones", href: "/gifts/birthstones" },
          { label: "Engravable", href: "/gifts?style=engravable" },
          { label: "Symbolic & Religious", href: "/gifts?style=symbolic" },
          { label: "FairMined Gold", href: "/gifts?collection=fairmined" },
        ],
      },
    ],
  },
];
