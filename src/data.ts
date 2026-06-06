/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RingSizeData, WebPresetScreen } from './types';

// Standard Credit Card Dimensions in Inches / Millimeters
// ISO/IEC 7810 ID-1 standard: 85.60 mm × 53.98 mm (3.370 inches × 2.125 inches)
export const CARD_WIDTH_INCH = 3.370079; 
export const CARD_WIDTH_MM = 85.60;
export const CARD_HEIGHT_INCH = 2.125197;
export const CARD_HEIGHT_MM = 53.98;

// Standard US Quarter Coin Diameter: 24.26 mm (0.955 inches)
// Standard 2 Euro Coin Diameter: 25.75 mm (1.01 inches)
export const COIN_PRESETS = [
  { name: 'US Quarter (24.26 mm)', diameterMm: 24.26 },
  { name: 'US Dime (17.91 mm)', diameterMm: 17.91 },
  { name: 'US Nickel (21.21 mm)', diameterMm: 21.21 },
  { name: 'US Penny (19.05 mm)', diameterMm: 19.05 },
  { name: 'Euro 2-Cent (18.75 mm)', diameterMm: 18.75 },
  { name: 'Euro 10-Cent (19.75 mm)', diameterMm: 19.75 },
  { name: 'Euro 1-Euro (23.25 mm)', diameterMm: 23.25 },
  { name: 'Euro 2-Euro (25.75 mm)', diameterMm: 25.75 },
  { name: 'Euro 50-Cent (24.25 mm)', diameterMm: 24.25 },
  { name: 'UK 1 Pound (23.43 mm)', diameterMm: 23.43 },
  { name: 'UK 2 Pence (25.9 mm)', diameterMm: 25.9 },
  { name: 'Canada Quarter (23.88 mm)', diameterMm: 23.88 },
];

export const DEVICE_PRESETS: WebPresetScreen[] = [
  { name: 'MacBook Air 13.3" (M1/M2)', ppi: 227, diagonal: '13.3"', deviceType: 'laptop' },
  { name: 'MacBook Pro 14.2" (M1/M2/M3)', ppi: 254, diagonal: '14.2"', deviceType: 'laptop' },
  { name: 'MacBook Pro 16.2" (M1/M2/M3)', ppi: 254, diagonal: '16.2"', deviceType: 'laptop' },
  { name: 'Generic Laptop 15.6" (FHD 1080p)', ppi: 141, diagonal: '15.6"', deviceType: 'laptop' },
  { name: 'Generic Desktop 24" (1080p Monitor)', ppi: 92, diagonal: '24"', deviceType: 'monitor' },
  { name: 'Generic Desktop 27" (2K 1440p Monitor)', ppi: 109, diagonal: '27"', deviceType: 'monitor' },
  { name: 'Generic Desktop 27" (4K UHD Monitor)', ppi: 163, diagonal: '27"', deviceType: 'monitor' },
  { name: 'iPad Base 10.2"', ppi: 264, diagonal: '10.2"', deviceType: 'tablet' },
  { name: 'iPad Pro 11"', ppi: 264, diagonal: '11.0"', deviceType: 'tablet' },
  { name: 'iPad Pro 12.9"', ppi: 264, diagonal: '12.9"', deviceType: 'tablet' },
  { name: 'Samsung Galaxy Tab S9', ppi: 274, diagonal: '11.0"', deviceType: 'tablet' },
  { name: 'iPhone 15 / 15 Pro', ppi: 460, diagonal: '6.1"', deviceType: 'phone' },
  { name: 'iPhone 15 Pro Max', ppi: 460, diagonal: '6.7"', deviceType: 'phone' },
  { name: 'Samsung Galaxy S24 Ultra', ppi: 505, diagonal: '6.8"', deviceType: 'phone' },
  { name: 'Google Pixel 8 Pro', ppi: 489, diagonal: '6.7"', deviceType: 'phone' },
];

export const RING_SIZES: RingSizeData[] = [
  { usa: '3', uk: 'F', europe: '44', japan: '4', diameterMm: 14.1 },
  { usa: '3.5', uk: 'G', europe: '45.5', japan: '5', diameterMm: 14.5 },
  { usa: '4', uk: 'H', europe: '46.5', japan: '7', diameterMm: 14.9 },
  { usa: '4.5', uk: 'I', europe: '48', japan: '8', diameterMm: 15.3 },
  { usa: '5', uk: 'J 1/2', europe: '49', japan: '9', diameterMm: 15.7 },
  { usa: '5.5', uk: 'K 1/2', europe: '50.5', japan: '10', diameterMm: 16.1 },
  { usa: '6', uk: 'L 1/2', europe: '51.5', japan: '11', diameterMm: 16.5 },
  { usa: '6.5', uk: 'M 1/2', europe: '53', japan: '13', diameterMm: 16.9 },
  { usa: '7', uk: 'N 1/2', europe: '54', japan: '14', diameterMm: 17.3 },
  { usa: '7.5', uk: 'O 1/2', europe: '55.5', japan: '15', diameterMm: 17.7 },
  { usa: '8', uk: 'P 1/2', europe: '56.5', japan: '16', diameterMm: 18.1 },
  { usa: '8.5', uk: 'Q 1/2', europe: '58', japan: '17', diameterMm: 18.5 },
  { usa: '9', uk: 'R 1/2', europe: '59', japan: '18', diameterMm: 19.0 },
  { usa: '9.5', uk: 'S 1/2', europe: '60.5', japan: '19', diameterMm: 19.4 },
  { usa: '10', uk: 'T 1/2', europe: '61.5', japan: '20', diameterMm: 19.8 },
  { usa: '10.5', uk: 'U 1/2', europe: '62.8', japan: '21', diameterMm: 20.2 },
  { usa: '11', uk: 'V 1/2', europe: '64', japan: '22', diameterMm: 20.6 },
  { usa: '11.5', uk: 'W 1/2', europe: '65.3', japan: '23', diameterMm: 21.0 },
  { usa: '12', uk: 'Y', europe: '66.5', japan: '24', diameterMm: 21.4 },
  { usa: '12.5', uk: 'Z', europe: '67.8', japan: '25', diameterMm: 21.8 },
  { usa: '13', uk: 'Z+1', europe: '69', japan: '26', diameterMm: 22.2 },
];

export interface RulerTickGuide {
  position: number; // 0 to 1
  label: string;
  height: string;
}

export const INCH_TICKS_16THS: RulerTickGuide[] = [
  { position: 0, label: '0', height: '100%' },
  { position: 1/16, label: '1/16', height: '30%' },
  { position: 2/16, label: '1/8', height: '45%' },
  { position: 3/16, label: '3/16', height: '30%' },
  { position: 4/16, label: '1/4', height: '60%' },
  { position: 5/16, label: '5/16', height: '30%' },
  { position: 6/16, label: '3/8', height: '45%' },
  { position: 7/16, label: '7/16', height: '30%' },
  { position: 8/16, label: '1/2', height: '75%' },
  { position: 9/16, label: '9/16', height: '30%' },
  { position: 10/16, label: '5/8', height: '45%' },
  { position: 11/16, label: '11/16', height: '30%' },
  { position: 12/16, label: '3/4', height: '60%' },
  { position: 13/16, label: '13/16', height: '30%' },
  { position: 14/16, label: '7/8', height: '45%' },
  { position: 15/16, label: '15/16', height: '30%' },
  { position: 1, label: '1', height: '100%' }
];

export interface EditorialGuide {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  targetKeywords: string[];
  contentMarkdown: string;
}

export const EDITORIAL_GUIDES: EditorialGuide[] = [
  {
    id: 'how-to-calibrate-online-ruler',
    title: 'How to Calibrate Your On-Screen Ruler for 100% Extreme Accuracy',
    subtitle: 'Learn the simple mathematical secrets behind virtual ruler calibration using everyday items.',
    readTime: '3 min read',
    targetKeywords: ['how to calibrate online ruler to my screen', 'ruler calibration online', 'pixels to cm converter', 'ppi ruler tool'],
    contentMarkdown: `### Why Accurate Online Ruler Calibration is Necessary

When you load a virtual ruler on a browser, the website translates measurements into "CSS pixels". By default, web specifications define **1 inch as 96 CSS pixels**. However, display technology has advanced dramatically. Laptops, smartphones, and 4K monitors package thousands of physical light-emitting pixels into incredibly dense grids. 

If a website simply renders 96 CSS pixels on a MacBook Pro or a dense mobile screen, the physical rendering might only measure half an inch. To ensure that **one inch on your screen is exactly one physical inch**, we must adjust the scale to your display's real physical DPI (dots per inch) — a parameter the browser cannot query automatically because of user-agent privacy protections.

---

### Step-by-Step Calibration Using a Standard Credit Card

A credit card or standard ID card is the single best tool for instant physical calibration. **Why?** Because all credit cards, bank cards, driver's licenses, and transit cards globally follow the exact international **ISO/IEC 7810 ID-1 standard**:

*   **Standard Physical Width:** Exactly \`85.60 mm\` (\`8.56 cm\` / \`3.370 inches\`)
*   **Standard Physical Height:** Exactly \`53.98 mm\` (\`5.40 cm\` / \`2.125 inches\`)

#### Calibration Procedure:
1.  **Retrieve a physical credit card**, debit card, or membership ID card.
2.  **Hold your card** up directly against your device's screen.
3.  Use the **interactive calibration widget** in our ruler utility. Drag the scale slider or adjustment handles until the virtual credit card border matches the exact edges of your physical card.
4.  Once matched, click **Save Calibration**. Our engine automatically calculates your screen's precise **PPI (Pixels Per Inch)**:
    $$\\text{PPI} = \\frac{\\text{Virtual Card Width in CSS Pixels}}{3.37}$$
5.  This calibrated value is safely saved in local storage. Every screen-based tool, from centimeter meters to ring sizing charts, is now 100% mathematically accurate.

---

### Alternative Calibration Option: Coins

If a credit card isn't handy, any standard national coin works. For instance, a **US Quarter** is precisely **24.26 mm** ($0.955\\text{ inches}$) in diameter, while a **2-Euro coin** is precisely **25.75 mm** ($1.01\\text{ inches}$) in diameter.
Our widget supports coin measurement adjustments. Place the coin on screen, align the concentric circle diameter slider to cover the coin's perimeter, and confirm the match.

---

### Manual Input or Preset Device Selection
If you know your screen's manufacturer specifications, you can select standard presets in our calibration library. Popular options include:
*   **MacBook Air 13.3" (M1/M2):** 227 PPI
*   **MacBook Pro 14.1":** 254 PPI
*   **iPad Base (10.2"):** 264 PPI
*   **Standard 24-inch 1080p Desktop Monitor:** 92 PPI
*   **Standard 27-inch 1440p (2K) Desktop Monitor:** 109 PPI
`
  },
  {
    id: 'how-to-read-a-ruler',
    title: 'How to Read a Ruler: Centimeters, Millimeters, and Fractional Inches',
    subtitle: 'The comprehensive guide to understanding ruler tick marks without getting confused.',
    readTime: '4 min read',
    targetKeywords: ['how to use an online ruler on screen', 'how to read a ruler', 'online ruler actual size inches and cm', 'ruler for kids online'],
    contentMarkdown: `### The Metric Scale: Easy Decimals (Centimeters and Millimeters)

The metric side of a ruler is incredibly straightforward because it operates in **base-10 units**:

*   **Centimeter (cm):** The major lines marked with large numbers are centimeters. Standard classroom and office rulers go from $0$ to $30\\text{ cm}$.
*   **Millimeter (mm):** Look at the small tick marks between the centimeters. There are exactly **10 subdivisions** per centimeter. Each single subdivision represents $1\\text{ mm}$ ($0.1\\text{ cm}$).
*   **The Half-Centimeter Mark:** The mid-sized tick mark exactly halfway between numbers represents $5\\text{ mm}$ ($0.5\\text{ cm}$).

#### Reading Metric Math:
1.  Find the nearest numbered centimeter line before your object's end point. Let's say it is $8\\text{ cm}$.
2.  Count the individual millimeter ticks after that $8$ mark. If there are $6$ ticks, your measurement is:
    $$8\\text{ cm} + 6\\text{ mm} = 8.6\\text{ cm} = 86\\text{ mm}$$

---

### The Imperial Scale: Fractions of an Inch

The imperial side is where many people encounter confusion. Rather than using decimals (tenth elements), inches are traditionally divided into **halves, quarters, eighths, and sixteenths**:

*   **1 inch (1"):** The largest numbered markers.
*   **1/2 inch:** The highest tick mark directly in the center of the inch. It splits the inch into two equal sections.
*   **1/4 inch:** The next tallest tick marks. They divide the inch into four parts. (Found at $1/4"$, $1/2"$, and $3/4"$).
*   **1/8 inch:** The medium-short ticks dividing the inch into eight sections.
*   **1/16 inch:** The shortest ticks. They provide the finest level of precision on standard home rulers. There are 16 spaces within each single inch.

#### The "Tallness Rule" to Decode Inches:
To quickly identify an imperial division, notice the height of the line (tick length):
1.  **Tallest lines:** Whole inches.
2.  **Second tallest line:** $1/2$ inch marks.
3.  **Third tallest lines:** $1/4$ and $3/4$ inch marks.
4.  **Fourth tallest lines:** $1/8$, $3/8$, $5/8$, $7/8$ inch marks.
5.  **Shortest lines:** Odd-numbered sixteenths ($1/16$, $3/16$, $5/16$, $7/16$, $9/16$, $11/16$, $13/16$, $15/16$).
`
  },
  {
    id: 'measure-ring-size-online',
    title: 'How to Measure Your Ring Size at Home Accoutred with Zero Tools',
    subtitle: 'Determine your perfect ring diameter using our calibrated international on-screen overlays.',
    readTime: '3 min read',
    targetKeywords: ['measure ring size online ruler cm', 'measure ring size online with ruler cm', 'ring size chart actual size'],
    contentMarkdown: `### How Our Virtual Ring Sizer Works

Choosing a ring size online can feel risky. Sizing charts that claim to print to scale are notorious for scaling errors. Our tool solves this problem by utilizing your **calibrated on-screen ruler matrix**. 

By adjusting our digital display scale using the credit card calibration on this site, the circles displayed below are rendering at the **exact actual biological millimeter diameter** of international standard rings!

---

### Step-by-Step Instructions:

#### Option A: Using an Existing Fit-Well Ring (Referred Ring Method)
1.  Find a ring that currently fits your target finger comfortably.
2.  Place the ring **flat on your computer screen** or tablet surface over the animated circle.
3.  Drag our size slider to expand or contract the virtual circles until the circumference of our colored on-screen ring exactly aligns with the **inside metal boundary** of your physical ring.
4.  Read the associated sizes! The widget instantly shows USA, United Kingdom, European, and Japanese equivalent ring sizes.

#### Option B: The Paper Strip & Calibrated Ruler Method
1.  If you don't own a fitting ring, cut a narrow, straight strip of non-stretchy paper (roughly 10 cm in length).
2.  Wrap this strip **snugly around the knuckle or base** of the finger you want to measure.
3.  Mark the exact point where the paper overlaps with a pencil or pen.
4.  Unroll the paper strip and align the marked segment starting from the \`0\` line of our **screen ruler (cm/mm scale)**.
5.  Compare your measurement value (circumference in millimeters) with our reference diameter chart below:

| Circumference | Diameter | US Size | UK Size | JP Size | EU Size |
|---|---|---|---|---|---|
| **44.3 mm** | **14.1 mm** | **3** | F | 4 | 44 |
| **46.8 mm** | **14.9 mm** | **4** | H | 7 | 46.5 |
| **49.3 mm** | **15.7 mm** | **5** | J 1/2 | 9 | 49 |
| **51.8 mm** | **16.5 mm** | **6** | L 1/2 | 11 | 51.5 |
| **54.4 mm** | **17.3 mm** | **7** | N 1/2 | 14 | 54 |
| **56.9 mm** | **18.1 mm** | **8** | P 1/2 | 16 | 56.5 |
| **59.5 mm** | **19.0 mm** | **9** | R 1/2 | 18 | 59 |
| **62.1 mm** | **19.8 mm** | **10** | T 1/2 | 20 | 61.5 |
`
  },
  {
    id: 'pixels-to-cm-converter',
    title: 'Understanding Pixels to Centimeters mapping in Displays and CSS',
    subtitle: 'Uncover the math web developers and graphics designers use to convert screen data into real physical sizes.',
    readTime: '4 min read',
    targetKeywords: ['pixels to cm converter', 'measure screen pixels', 'screen size measurement tool', 'pixel ruler online'],
    contentMarkdown: `### The Core Riddle of Pixels vs. Centimeters

Web designers often wonder: **How many pixels are in a centimeter?**
The engineering answer is: **It depends entirely on your display's resolution and physical screen density.**

In digital layout design, we distinguish between two types of pixels:
1.  **Logical CSS Pixels (\`px\`):** This is a unit of length used by stylesheets. The official W3C web standard defines **96 logical pixels as exactly equal to 1 inch**, which mathematically maps to:
    $$\\text{CSS Density} = 37.795\\text{ pixels per centimeter (px/cm)}$$
    By this standard, $1\\text{ cm} \\approx 37.8\\text{ logical pixels}$.
2.  **Physical Device Pixels:** These are the actual mineral sub-pixels printed on your hardware screen. A 5-inch smartphone viewport can look beautiful because it contains $400+$ physical pixels per inch (PPI), representing around $157\\text{ physical pixels per cm}$!

---

### The Conversion Formulas

To perform accurate conversions between screen pixels ($N$) and real-world centimeters ($D$), you must discover the **true hardware screen density (PPI)** of your screen (which you can calibrate for free on our homepage):

#### Converting Pixels to Centimeters:
$$D_{\\text{cm}} = \\frac{N_{\\text{pixels}}}{\\text{PPI}} \\times 2.54$$

#### Converting Centimeters to Pixels:
$$N_{\\text{pixels}} = \\frac{D_{\\text{cm}}}{2.54} \\times \\text{PPI}$$

#### For Example:
If you have a laptop screen with a real calibrated density of **141 PPI** (like a 15.6" Full HD display), and you render a button that is **282 pixels double-wide**:
$$D = \\frac{282}{141} \\times 2.54 = 2 \\times 2.54 = 5.08\\text{ cm}$$
"The button will measure exactly 5.08 cm wide on your physical screen."
`
  },
  {
    id: 'how-to-measure-without-a-ruler',
    title: 'How to Measure Physical Objects Without a Ruler (10 Clever Lifesavers)',
    subtitle: 'Left your measuring tape behind? Use these common pocket objects to estimate exact dimensions.',
    readTime: '3 min read',
    targetKeywords: ['how to measure without a ruler', 'online tape measure', 'online measuring tool', 'virtual centimeter ruler for crafts'],
    contentMarkdown: `### 10 Universal Objects in Your Pocket for Easy Estimating

We have all been caught needing a size evaluation without standard measuring instruments. When you lack a calibrated ruler, these standard global items serve as fantastic physical benchmarks:

#### 1. Paper Currency (Bills)
Globally, government paper bills are printed in extremely rigid, exact sizes to prevent counterfeiting:
*   **United States Dollar Bills ($1, $5, $10, $20, etc.):** Extremely handy. Banknotes are exactly **6.14 inches (15.6 cm) wide** and **2.61 inches (6.63 cm) tall**. Folded in perfect halves, they represent approximately **3.07 inches**.
*   **Canadian Banknotes:** Exactly **15.24 cm (6.0 inches)** wide by **6.99 cm** tall.
*   **Euro Banknotes:** The **5 Euro note** is precisely **12.0 cm × 6.2 cm**. The **10 Euro note** is precisely **12.7 cm × 6.7 cm**.

#### 2. Standard Letter Paper
If you are at an office, school desk, or copy station:
*   **US Letter Paper:** Exactly **8.5 inches by 11.0 inches** ($21.59\\text{ cm} \\times 27.94\\text{ cm}$).
*   **A4 Sheet-Paper:** The international standard sheet is exactly **21.0 cm by 29.7 cm** ($8.27\\text{ in} \\times 11.69\\text{ in}$).

#### 3. Standard Credit Card / Transit Card
Every credit, debit, or gift card is manufactured to ID-1 standards, measuring exactly **3.37 inches (85.6 mm) wide** and **2.125 inches (54.0 mm) tall**.

#### 4. US Coins & Euro Coins
*   **US Quarter:** Exactly **0.955 inches (24.26 mm)** in diameter. Four quarters placed touching side-by-side represent almost exactly **3.8 inches**.
*   **1 US Dollar Bill height:** Exactly matches the width of **three US quarters** placed side by side.
*   **Two-Euro Coin:** Exactly **25.75 mm (1.01")** in diameter.

#### 5. Your Hand and Fingers (Anthropometrics)
Because your body travels with you, your fingers are excellent permanent metrics. Keep these hand sizes memorized:
*   **The Thumbnail Rule:** On average, a standard adult thumbnail measures precisely **2.0 cm** wide (or about **0.75 inches**).
*   **The Index Finger Phalanx:** The distance from your top knuckle crease to the very tip of your index finger is approximately **1 inch (2.54 cm)**.
*   **The Hand Span:** Spread your pinky and thumb out wide as far as possible. In adult men, this span measures around **9 inches (23 cm)**; in adult women, it measures around **8 inches (20 cm)**.

#### 6. Soda Cans
A standard aluminum pop/soda can (12 oz) is **4.83 inches (12.3 cm)** tall and **2.60 inches (6.60 cm)** wide.

#### 7. Flooring Ceramic Tiles
Standard kitchen or bathroom ceramic tiles are nearly always cut in neat square sizes: **4-inch**, **6-inch**, or **12-inch** squares. 

#### 8. Standard USB-A Connector
The metallic terminal plug at the end of standard charging cords measures exactly **12 mm wide** and **4.5 mm high**.

#### 9. iPhone / Large Smartphones
If you carry an iPhone 15, the chassis measures **5.81 inches (14.76 cm)** long. iPhone 15 Pro Max measures **6.29 inches (15.99 cm)** long. Use these dimensions as handy comparative rods.

#### 10. This Online Calibrated Web App!
Remember, if you have any device connected to the internet, you have a physical benchmark! Simply calibrating our app for 5 seconds using your credit card gives you an active centimeter, millimeter, and inch measuring station instantly.
`
  }
];
