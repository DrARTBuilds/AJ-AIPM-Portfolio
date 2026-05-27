# 🌊 Voyage: Advanced 3D Interactive PM & Growth Portfolio

A highly immersive, gamified 3D interactive portfolio tailored for **Ajay Tummeti** (Product Manager & 0→1 Builder). Landing on an interactive digital wooden raft floating in a realistic oceanic environment, visitors can pan the camera, tap a volumetric celestial controller, trigger high-performance media modals, and glide dynamically through a showcase of Product Strategy, AI Builders, and Growth systems milestones rotating around a glowing Sakura tree.

This repository is a heavily upgraded and customized fork of the beautiful [voyage](https://github.com/Sunil56224972/voyage) template created by **Sunil Nath Yogi**.

---

## 🛠️ The Tech Stack

The application is built on a modern, high-performance web graphics stack:
*   **Core Framework**: [React 18](https://reactjs.org/) & [Vite](https://vitejs.dev/)
*   **3D Render Pipeline**: [Three.js](https://threejs.org/) via [React Three Fiber (R3F)](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
*   **Physics & Kinematics**: Custom delta-time integration engines.
*   **Shader Modifications**: Dynamic vertex sways via custom WebGL/Three.js `onBeforeCompile` shader injections.
*   **Client Web APIs**: HTML5 Geolocation API, BigDataCloud reverse geocoding API, and Open-Meteo Current Weather & Time zone API.
*   **Styling**: Premium custom HSL CSS stylesheets, glassmorphic frosted panes, and hardware-accelerated animations.

---

## ✨ All Customizations & Upgrades (Over Inspired Repository)

We have transformed the original codebase into an advanced climate-dynamic and highly interactive portfolio featuring numerous visual and architectural upgrades:

### 1. 🌦️ 3D Celestial Controller & Auto-Weather Sync
*   **Background Geolocation Sync**: Automatically triggers location geocoding in the background on load. It coordinates with the *BigDataCloud API* to resolve the user's city name and queries the *Open-Meteo API* to determine real-time weather and day/night status.
*   **Clock Fallback Engine**: If geolocation permission is denied or APIs are offline, it silently falls back to your local system clock (`new Date().getHours()`) to automatically toggle day/night modes.
*   **Hover-Activated Frosted Location Badge**: Moving the mouse over the controller floats up a beautiful geocoded frosted glass badge showing yourSynced location and active local time.
*   **Volumetric 3D Celestial Button**:
    *   *Day Mode (Sun)*: Displays a realistic golden Sun core with deep radial gradients, slow fluid surface flare sways, a dashed solar corona outer ring, and 8 radial rays pulsing out-of-phase in height and opacity.
    *   *Night Mode (Moon)*: Spins 360-degrees and morphs into a silver glowing Crescent Moon with realistic crater shadow maps and twinkling background sparkles.
    *   *Theme Sync*: Tapping the button switches the global React theme (Navbar button), adjusts the 3D scene (fog, light, environment maps), and dispatches events to activate all canvas bioluminescent glows.

### 2. 🎥 Volumetric Preloaded Monolith video Modal
*   **Frosted Glass Modal Overlay**: Tapping the "About me" Monolith opens a dark frosted-glass modal overlay with a gold-glowing border (`box-shadow`) and smooth pop-in animations.
*   **Zero-Latency Caching Engine**: Resolves media loading lag for the local video file:
    *   *HTML Preloading*: Injected `<link rel="preload" as="video">` in `index.html` to initiate network streaming early.
    *   *Memory Blob Buffering*: Fetches the mp4 file as a binary Blob in the background on mount, compiling it to a memory-cached Object URL (`URL.createObjectURL(blob)`), enabling instant playback and latency-free seeking.
*   **Audio & Music Sync Coordinator**:
    *   *Auto-Pause*: Pauses the ambient portfolio background track and halts visualizer bars when the video starts.
    *   *Auto-End & Auto-Close*: Automatically closes the video modal when playback ends naturally, requiring zero manual clicks.
    *   *Auto-Resume*: Resumes the background audio track and visualizer immediately upon modal closure.

### 3. 🌸 3D Magenta Lotus Scroll-Blossom & Bioluminescent Glow
*   **Scroll-Time Bud-to-Bloom Interpolation**: The Lotus (`cJ`) begins as a closed, vertical bud. As you scroll down (camera progress `0.36` to `0.52`), its petals organically spiral outward and bend downwards into full bloom.
*   **Bioluminescent Night Glow**: At night, the lotus base color shifts to a vibrant neon magenta (`#ff00aa`) and breathes slowly with an out-of-phase emissive glow (`#ff007f`). Its tone mapping is dynamically disabled (`toneMapped = false`) to allow the emissive glow to bloom intensely.

### 4. 🍃 Wind Shader Sway & Shedding Leaf Physics (Sakura Upgrades)
*   **Branches-Only Elastic Sway (Vertex Shaders)**: Injected custom formulas into bark/branch materials (`t.Bark001_2K_JPG_Mat`) via `onBeforeCompile`. Vertex displacement is scaled by height and distance from the center, keeping the lower trunk rock-solid while outer branches bend realistically.
*   ** twig Rustling & Canopy Shiver**: Foliage material (`t.Sakura_Mat`) incorporates high-frequency shivering waves simulating rustling leaves.
*   **Wavy Breeze Wisps (`BreezeStreaks`)**: Trailing ribbons glide horizontally with a custom radial cigar-shaped texture, smooth edge fades, and wavy pitch rotations.
*   **Aerodynamic Leaf Physics**: Falling petals (increased to a rich **140 active particles**) spawn inside a localized cloud near the canopy. They incorporate wind lift (up to 90% gravity reduction), out-of-phase multi-axial fluttering sways, and dynamic speed-spins, wrapping around screen boundaries.
*   **Unclamped Petal Glow**: At night, canopy leaves and falling petals copy and lerp to a warm cherry rose color (`#fda4af`), disabling tone mapping (`toneMapped = false`) to bloom beautifully as bright glowing embers.

### 5. 🧑 PM & Growth Disciplines & Mockups
*   **Product Signposts**: Upgraded the floating lanterns to represent professional disciplines:
    *   Left: **Product Manager**
    *   Middle: **AI Product Builder**
    *   Right: **Growth Strategist**
*   **Optimized Mockup Show Slider**: Rotated 8 enterprise-grade project cards revolving around the Sakura tree across **5 custom premium mockups** (`jdosiq_command_center.webp`, `patient_registry.webp`, `adanalyzer_dashboard.webp`, `carenheal.webp`, `solarscout.webp`) for maximum variety.

---

## 🚀 Installation & Setup

To serve this portfolio locally:

```bash
# 1. Clone the repository
git clone https://github.com/Sunil56224972/voyage.git

# 2. Navigate into the directory
cd voyage

# 3. Serve the static build
# If you have Node.js installed:
npx http-server ./ -p 8081

# 4. Visit in your browser:
http://localhost:8081
```

---

## ⚙️ Customization & Source Architecture

This repository distributes assets as a compiled production bundle for maximum client loading performance. The raw source configurations are maintained in a structured format:

1.  **Modify Variables & Text**:
    Edit the configurations inside `portfolio-config.json`. This controls your name, email, socials, runestone texts, and the titles, descriptions, links, and tags of all 8 projects in the 3D slider.
2.  **Add/Update Images**:
    Place webp/png assets inside the `/images` folder, ensuring filenames match the image attributes in `portfolio-config.json`.
3.  **Compile & Apply Customizations**:
    After updating `portfolio-config.json` or editing R3F shaders in `customize.js`, execute the compiler in your terminal:
    ```bash
    node customize.js
    ```
    This script will automatically parse your variables, modify shader programs, compile HTML elements, inject cache-busters, and write the finalized changes directly to the active build files (`index.html` and `/assets/index-D_hQMIQo.js`).

---

## 🔒 Personal Information Note & Empty Templates

> [!IMPORTANT]
> This specific repository represents **Ajay Tummeti's professional portfolio** and contains proprietary, copyrighted project mockups, private introductory video blobbings, geolocated personal links, and proprietary texts.
>
> **Upon request, an empty portfolio template can be provided.**
> To set up your own clean, empty copy of this weather-dynamic 3D portfolio:
> 1. Contact Ajay Tummeti for a sanitized branch containing empty mockups and template placeholder variables.
> 2. Clone the clean branch and populate `portfolio-config.json` with your custom data.
> 3. Place your own custom assets in the `/images`, `/models`, and `/music` folders.
> 4. Run `node customize.js` to compile your fresh, personalized 3D digital raft!

---

## 👏 Credits & Attributions

*   **Inspired By**: Original [Voyage 3D Portfolio](https://github.com/Sunil56224972/voyage) by **Sunil Nath Yogi** – A huge thank you to Sunil for the incredible 3D creative design, camera path controllers, and digital raft setup!
*   **Personalization & Climate Engines**: Engineered for Ajay Tummeti by **Antigravity AI** (Advanced Agentic Coding at Google DeepMind).
