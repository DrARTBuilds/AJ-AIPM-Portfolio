const fs = require('fs');
const path = require('path');

// Paths to files
const CONFIG_PATH = path.join(__dirname, 'portfolio-config.json');
const JS_PATH = path.join(__dirname, 'assets', 'index-D_hQMIQo.js');
const JS_BAK_PATH = JS_PATH + '.bak';
const HTML_PATH = path.join(__dirname, 'index.html');
const HTML_BAK_PATH = HTML_PATH + '.bak';

console.log('🚀 Voyage 3D Portfolio Customization Utility (Weather & Bioluminescence Engine)');
console.log('=============================================================================');

// 1. Read Configuration
if (!fs.existsSync(CONFIG_PATH)) {
  console.error('❌ Error: portfolio-config.json not found!');
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  console.log('✅ Configuration successfully loaded.');
} catch (e) {
  console.error('❌ Error parsing portfolio-config.json:', e.message);
  process.exit(1);
}

// 2. Create backups if not already existing
function ensureBackup(originalPath, backupPath) {
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(originalPath, backupPath);
    console.log(`💾 Created backup: ${path.basename(backupPath)}`);
  } else {
    console.log(`ℹ️ Backup already exists: ${path.basename(backupPath)}`);
  }
}

try {
  ensureBackup(JS_PATH, JS_BAK_PATH);
  ensureBackup(HTML_PATH, HTML_BAK_PATH);
} catch (e) {
  console.error('❌ Error creating backups:', e.message);
  process.exit(1);
}

// 3. Read original/backup JS code
const jsCode = fs.readFileSync(JS_BAK_PATH, 'utf8');
let modifiedJs = jsCode;

console.log('\n⚙️ Customizing Javascript assets...');

// Replace Nav Name
const originalNavName = 'className:"text-xl font-light text-white tracking-widest",children:"Sunil"';
const targetNavName = `className:"text-xl font-light text-white tracking-widest",children:"${config.name}"`;
if (modifiedJs.includes(originalNavName)) {
  modifiedJs = modifiedJs.replace(originalNavName, targetNavName);
  console.log('✅ Customized navigation header name.');
} else {
  console.log('⚠️ Could not find exact navbar name match. It might already be customized.');
}

// Replace Email Links (General replace for mailto)
const originalEmail = 'sunilnathyogi008@gmail.com';
if (modifiedJs.includes(originalEmail)) {
  modifiedJs = modifiedJs.split(originalEmail).join(config.email);
  console.log('✅ Customized email links across the application.');
}

// Replace Landing Image
const originalLandingImage = 'image:"/images/main2.webp"';
const targetLandingImage = 'image:"/images/Main1.png"';
if (modifiedJs.includes(originalLandingImage)) {
  modifiedJs = modifiedJs.split(originalLandingImage).join(targetLandingImage);
  console.log('✅ Customized landing screen image to Main1.png.');
} else {
  console.log('⚠️ Could not find landing screen image reference in Javascript.');
}

// 3. Replace About Section Component (lJ) with highly interactive glowing video modal trigger
console.log('\n⚙️ Upgrading About Me monolith component to highly interactive video trigger...');
const startMatch = 'const lJ=({cameraProgress:r,triggerAt:e=.45,triggerRange:t=.02})=>';
const endMatch = 'function uJ(r){const';

const startIdx = modifiedJs.indexOf(startMatch);
const endIdx = modifiedJs.indexOf(endMatch);

if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
  const originalAboutComponent = modifiedJs.substring(startIdx, endIdx);
  const targetAboutComponent = 'const JapaneseStoneLantern = () => { ' +
    'const { scene } = br("/models/japanese_stone_lantern.glb"); ' +
    'const lightRef = xe.useRef(); ' +
    'const isDayRef = xe.useRef(localStorage.getItem("voyage-is-day") !== "false"); ' +
    'xe.useEffect(() => { ' +
      'const handleWeather = (evt) => { isDayRef.current = evt.detail.isDay; }; ' +
      'window.addEventListener("weather-update", handleWeather); ' +
      'return () => window.removeEventListener("weather-update", handleWeather); ' +
    '}, []); ' +
    'const clonedScene = xe.useMemo(() => { ' +
      'if (!scene) return null; ' +
      'const clone = scene.clone(); ' +
      'clone.traverse((child) => { ' +
        'if (child.isMesh) { ' +
          'if (child.name === "Cube.026_paper_0") { ' +
            'child.castShadow = false; ' +
            'child.receiveShadow = false; ' +
            'if (child.material) { ' +
              'child.material = child.material.clone(); ' +
              'if (child.material.emissive) { ' +
                'child.material.emissive.set("#ffaa33"); ' +
              '} ' +
              'child.material.emissiveIntensity = 1.0; ' +
              'if (child.material.color) { ' +
                'child.material.color.set("#ffeecc"); ' +
              '} ' +
            '} ' +
          '} else { ' +
            'child.castShadow = true; ' +
            'child.receiveShadow = true; ' +
          '} ' +
        '} ' +
      '}); ' +
      'return clone; ' +
    '}, [scene]); ' +
    'Rl((state) => { ' +
      'if (!clonedScene) return; ' +
      'const paperMesh = clonedScene.getObjectByName("Cube.026_paper_0"); ' +
      'const time = state.clock.getElapsedTime(); ' +
      'const flicker = 0.85 + Math.sin(time * 18) * 0.10 + Math.sin(time * 32) * 0.04 + Math.sin(time * 6) * 0.03 + (Math.random() - 0.5) * 0.02; ' +
      'const isNight = !isDayRef.current; ' +
      'const baseIntensity = isNight ? 12.0 : 1.5; ' +
      'const paperBaseGlow = isNight ? 3.5 : 0.6; ' +
      'if (lightRef.current) { ' +
        'lightRef.current.intensity = baseIntensity * flicker; ' +
      '} ' +
      'if (paperMesh && paperMesh.material) { ' +
        'paperMesh.material.emissiveIntensity = paperBaseGlow * flicker; ' +
        'paperMesh.material.toneMapped = !isNight; ' +
      '} ' +
    '}); ' +
    'if (!clonedScene) return null; ' +
    'return q.jsxs("group", { ' +
      'position: [-10, 1.2, 22], ' +
      'rotation: [0, Math.PI / 4, 0], ' +
      'scale: 2.2, ' +
      'children: [ ' +
        'q.jsx("primitive", { object: clonedScene }), ' +
        'q.jsx("pointLight", { ' +
          'ref: lightRef, ' +
          'position: [-0.56, 1.19, 1.76], ' +
          'color: "#ffaa33", ' +
          'distance: 18, ' +
          'decay: 1.5, ' +
          'castShadow: true, ' +
          '"shadow-mapSize": [512, 512], ' +
          '"shadow-bias": -0.005 ' +
        '}) ' +
      '] ' +
    '}); ' +
  '}; ' +
  'br.preload("/models/japanese_stone_lantern.glb"); ' +
  'const lJ=({cameraProgress:r,triggerAt:e=.45,triggerRange:t=.02})=>{const n=xe.useRef(),i=xe.useRef(!1),videoAutoPlayed=xe.useRef(!1),s=-45,a=-10.5,o=()=>{i.current||!n.current||(i.current=!0,No.to(n.current.position,{y:a,duration:1.2,ease:"power2.out"}))};Rl(()=>{if(!n.current)return;const u=r?.current??0,c=Math.max(0,t/2),d=Math.max(0,e-c*9),g=Math.min(1,e+c);!i.current&&u>=d&&u<=g&&o();if(!videoAutoPlayed.current&&u>=e+0.09&&u<=e+0.13){videoAutoPlayed.current=!0;if(typeof window!=="undefined"){window.dispatchEvent(new CustomEvent("open-about-video"));}}});const [hoveredHeader, setHoveredHeader] = xe.useState(!1);const [hoveredBody, setHoveredBody] = xe.useState(!1);const handleOpenVideo = (e) => { e.stopPropagation(); videoAutoPlayed.current=!0; if (typeof window !== "undefined") { window.dispatchEvent(new CustomEvent("open-about-video")); } };const handlePointerOver = (setter) => (e) => { e.stopPropagation(); setter(!0); if (typeof document !== "undefined") { document.body.style.cursor = "pointer"; } };const handlePointerOut = (setter) => () => { setter(!1); if (typeof document !== "undefined") { document.body.style.cursor = "auto"; } };return q.jsxs("group",{ref:n,position:[-5,s,-100],rotation:[0,6,0],children:[q.jsx(Wq,{}),q.jsx(JapaneseStoneLantern,{}),q.jsxs("group",{rotation:[0,Math.PI/6,0],children:[q.jsx(pl,{position:[0,25,2],fontSize:3.2,font:ml,color:hoveredHeader ? "#fbbf24" : "#ffffff",anchorX:\"center\",anchorY:\"bottom\",\"material-toneMapped\":!1,onPointerOver: handlePointerOver(setHoveredHeader),onPointerOut: handlePointerOut(setHoveredHeader),onClick: handleOpenVideo,children:\"' + config.about_header + ' 🎥\"}),q.jsx(pl,{position:[0,23,1],font:ml,fontSize:hoveredBody ? 2.05 : 2.0,maxWidth:20,lineHeight:1,anchorX:\"center\",anchorY:\"top\",color:hoveredBody ? \"#fef08a\" : \"#ffffff\",\"material-toneMapped\":!1,onPointerOver: handlePointerOver(setHoveredBody),onPointerOut: handlePointerOut(setHoveredBody),onClick: handleOpenVideo,children:`' + config.about_text.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`})]})]})};';
  modifiedJs = modifiedJs.replace(originalAboutComponent, targetAboutComponent);
  console.log('✅ Replaced entire monolith rock component with upgraded interactive video trigger!');
} else {
  console.error('❌ Failed to locate monolith rock component via index boundary!');
  process.exit(1);
}

// Replace LinkedIn URL
const originalLinkedIn = 'https://www.linkedin.com/in/sunil-aimbot-81340839a/';
if (modifiedJs.includes(originalLinkedIn)) {
  modifiedJs = modifiedJs.split(originalLinkedIn).join(config.linkedin);
  console.log('✅ Customized LinkedIn contact link.');
}

// 3.5. CUSTOMIZE BIOLUMINESCENCE SPLINE PARTICLES FOR GLOWING GOLDEN CIRCLES
console.log('\n⚙️ Customizing spline particles to glowing golden circles...');

// Change default color in _W component definition signature
const originalSplineColor = 'color:o="#9DDCE9"';
const targetSplineColor = 'color:o="#fbbf24"';
if (modifiedJs.includes(originalSplineColor)) {
  modifiedJs = modifiedJs.split(originalSplineColor).join(targetSplineColor);
  console.log('   ✅ Updated spline particles default color to golden.');
} else {
  console.log('   ⚠️ Could not find exact default spline color parameter.');
}

// Upgrade pointsMaterial with smooth radial-gradient texture (circles instead of squares)
const originalPointsMaterial = 'q.jsx("pointsMaterial",{size:u,color:new Lt(o),transparent:!0,opacity:.95,depthWrite:!1,blending:ZS,sizeAttenuation:!0})';
const targetPointsMaterial = 'q.jsx("pointsMaterial",{size:u * 1.6,color:new Lt(o),transparent:!0,opacity:.95,depthWrite:!1,blending:ZS,sizeAttenuation:!0,map:typeof sG !== "undefined" && typeof document !== "undefined" ? (window.voyageGlowTex || (window.voyageGlowTex = (() => { const canvas = document.createElement("canvas"); canvas.width = 32; canvas.height = 32; const ctx = canvas.getContext("2d"); const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16); grad.addColorStop(0, "rgba(255, 255, 255, 1)"); grad.addColorStop(0.3, "rgba(251, 191, 36, 0.95)"); grad.addColorStop(1, "rgba(251, 191, 36, 0)"); ctx.fillStyle = grad; ctx.fillRect(0, 0, 32, 32); const tex = new sG(canvas); return tex; })())) : null})';

if (modifiedJs.includes(originalPointsMaterial)) {
  modifiedJs = modifiedJs.replace(originalPointsMaterial, targetPointsMaterial);
  console.log('   ✅ Upgraded points material to use a glowing circular golden texture.');
} else {
  console.log('   ❌ Failed to locate points material in Javascript file!');
}

// 3.55. UPGRADE MAGENTA LOTUS FLOWER (cJ) TO SUPPORT BLOSSOM AND GLOW AT NIGHT
console.log('\n⚙️ Upgrading magenta lotus flower to supports dynamic scroll-blossoming and night neon glowing...');

// Pass cameraProgress parameter to the flower component inside the skills container (fJ)
const originalFlowerCall = 'q.jsx(cJ,{position:[0,3,0],scale:8.5,rotation:[0,Math.PI/4,0]})';
const targetFlowerCall = 'q.jsx(cJ,{position:[0,3,0],scale:8.5,rotation:[0,Math.PI/4,0],cameraProgress:r})';

if (modifiedJs.includes(originalFlowerCall)) {
  modifiedJs = modifiedJs.replace(originalFlowerCall, targetFlowerCall);
  console.log('   ✅ Linked scroll progress reference (cameraProgress) to Lotus component.');
} else {
  console.log('   ⚠️ Could not find exact flower element call in skills component.');
}

// Find cJ component definition and replace with dynamic scroll-blossom and neon-glow variant
const flowerStart = 'function cJ(r){const{nodes:e,materials:t}=br("/models/flower.gltf");';
const flowerEnd = 'br.preload("/models/flower.gltf");';

const fStartIdx = modifiedJs.indexOf(flowerStart);
const fEndIdx = modifiedJs.indexOf(flowerEnd);

if (fStartIdx !== -1 && fEndIdx !== -1 && fStartIdx < fEndIdx) {
  const originalFlowerComponent = modifiedJs.substring(fStartIdx, fEndIdx);
  const targetFlowerComponent = 'function cJ({cameraProgress,...r}){const{nodes:e,materials:t}=br("/models/flower.gltf");const groupRef=xe.useRef();const isDayRef=xe.useRef(localStorage.getItem("voyage-is-day")!=="false");xe.useEffect(()=>{const h=evt=>{isDayRef.current=evt.detail.isDay};window.addEventListener("weather-update",h);return ()=>window.removeEventListener("weather-update",h)},[]);Rl(state=>{if(!groupRef.current)return;const time=state.clock.getElapsedTime();const scrollVal=(cameraProgress&&cameraProgress.current)||0;const blossom=Math.max(0,Math.min(1,(scrollVal-0.36)/0.16));groupRef.current.traverse(child=>{if(child.isMesh&&child.name&&child.name.includes("Part_")){if(!child.userData.originalRotation){child.userData.originalRotation=child.rotation.clone();child.userData.originalPosition=child.position.clone()}const origRot=child.userData.originalRotation;const origPos=child.userData.originalPosition;child.position.x=origPos.x*(0.15+blossom*0.85);child.position.z=origPos.z*(0.15+blossom*0.85);child.position.y=origPos.y*(0.6+blossom*0.4);child.rotation.x=origRot.x*blossom;child.rotation.y=origRot.y*blossom;child.rotation.z=origRot.z*blossom}});if(t.Flower_Color){if(!t.Flower_Color.userData.originalColor){t.Flower_Color.userData.originalColor=t.Flower_Color.color.clone()}if(t.Flower_Color.userData.currentGlow===undefined){t.Flower_Color.userData.currentGlow=isDayRef.current?0:1}const targetGlow=isDayRef.current?0:1;t.Flower_Color.userData.currentGlow+=(targetGlow-t.Flower_Color.userData.currentGlow)*0.05;const glow=t.Flower_Color.userData.currentGlow;if(glow>0.001){const pulse=(0.65+Math.sin(time*2.5)*0.45)*glow;const neonEmissive=window.voyageNeonEmissive||(window.voyageNeonEmissive=new Lt("#ff007f"));const neonColor=window.voyageNeonColor||(window.voyageNeonColor=new Lt("#ff00aa"));t.Flower_Color.emissive.copy(neonEmissive).multiplyScalar(glow);t.Flower_Color.emissiveIntensity=pulse;t.Flower_Color.color.copy(t.Flower_Color.userData.originalColor).lerp(neonColor,glow);t.Flower_Color.toneMapped=glow<0.5}else{t.Flower_Color.color.copy(t.Flower_Color.userData.originalColor);t.Flower_Color.emissive.set("#000000");t.Flower_Color.emissiveIntensity=0;t.Flower_Color.toneMapped=!0}}});return q.jsx("group",{...r,dispose:null,children:q.jsx("group",{ref:groupRef,rotation:[-1.571,0,-.013],children:q.jsxs("group",{rotation:[Math.PI/2,0,0],scale:.01,children:[q.jsxs("group",{position:[0,28,0],rotation:[-Math.PI/2,0,0],scale:100,children:[q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Candle_Material_0.geometry,material:t.Material,scale:1,position:[0,0,0]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Candle_Candle_0.geometry,material:t.Candle,scale:1,position:[0,0,0]})]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1_Flower_Color_0.geometry,material:t.Flower_Color,position:[15.611,15.571,15.966],rotation:[-2.172,-.539,2.201],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1001_Flower_Color_0.geometry,material:t.Flower_Color,position:[22.187,15.629,.07],rotation:[-Math.PI/2,-.785,-Math.PI],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1002_Flower_Color_0.geometry,material:t.Flower_Color,position:[15.511,15.686,-15.674],rotation:[-.969,-.539,-2.201],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1003_Flower_Color_0.geometry,material:t.Flower_Color,position:[-.382,15.763,-21.863],rotation:[-.786,-.048,-1.591],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1004_Flower_Color_0.geometry,material:t.Flower_Color,position:[-15.611,15.571,-15.966],rotation:[-.969,.539,-.94],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1005_Flower_Color_0.geometry,material:t.Flower_Color,position:[-22.187,15.629,-.07],rotation:[-Math.PI/2,.785,0],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1006_Flower_Color_0.geometry,material:t.Flower_Color,position:[-15.511,15.686,15.674],rotation:[-2.172,.539,.94],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1007_Flower_Color_0.geometry,material:t.Flower_Color,position:[.382,15.763,21.863],rotation:[-2.355,.048,1.551],scale:[131.399,125,131.399]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2_Flower_Color_0.geometry,material:t.Flower_Color,position:[25.7,16.736,-10.64],rotation:[-Math.PI/2,0,-2.749],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2001_Flower_Color_0.geometry,material:t.Flower_Color,position:[10.649,16.736,-25.696],rotation:[-Math.PI/2,0,-1.963],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2002_Flower_Color_0.geometry,material:t.Flower_Color,position:[-10.64,16.736,-25.7],rotation:[-Math.PI/2,0,-1.178],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2003_Flower_Color_0.geometry,material:t.Flower_Color,position:[-25.696,16.736,-10.649],rotation:[-Math.PI/2,0,-Math.PI/8],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2004_Flower_Color_0.geometry,material:t.Flower_Color,position:[-25.7,16.736,10.64],rotation:[-Math.PI/2,0,Math.PI/8],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2005_Flower_Color_0.geometry,material:t.Flower_Color,position:[-10.649,16.736,25.696],rotation:[-Math.PI/2,0,1.178],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2006_Flower_Color_0.geometry,material:t.Flower_Color,position:[10.64,16.736,25.7],rotation:[-Math.PI/2,0,1.963],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_2007_Flower_Color_0.geometry,material:t.Flower_Color,position:[25.696,16.736,10.649],rotation:[-Math.PI/2,0,2.749],scale:[100,100,110]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1008_Flower_Color_0.geometry,material:t.Flower_Color,position:[12.305,13.242,29.209],rotation:[-2.335,-.201,1.815],scale:[154.691,168.75,154.691]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1009_Flower_Color_0.geometry,material:t.Flower_Color,position:[30.268,12.923,-11.722],rotation:[-1.197,-.706,-2.609],scale:[154.691,168.75,154.691]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1010_Flower_Color_0.geometry,material:t.Flower_Color,position:[-12.305,13.242,-29.209],rotation:[-.807,.201,-1.327],scale:[154.691,168.75,154.691]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1011_Flower_Color_0.geometry,material:t.Flower_Color,position:[-30.268,12.923,11.722],rotation:[-1.944,.706,.533],scale:[154.691,168.75,154.691]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1012_Flower_Color_0.geometry,material:t.Flower_Color,position:[25.348,13.37,24.8],rotation:[-2.21,-.49,2.158],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1013_Flower_Color_0.geometry,material:t.Flower_Color,position:[35.869,13.2,.105],rotation:[-Math.PI/2,-.784,Math.PI],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1014_Flower_Color_0.geometry,material:t.Flower_Color,position:[26.074,13.023,-25.257],rotation:[-.931,-.49,-2.158],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1015_Flower_Color_0.geometry,material:t.Flower_Color,position:[1.211,12.759,-36.931],rotation:[-.789,.096,-1.531],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1016_Flower_Color_0.geometry,material:t.Flower_Color,position:[-25.348,13.37,-24.8],rotation:[-.931,.49,-.983],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1017_Flower_Color_0.geometry,material:t.Flower_Color,position:[-35.869,13.2,-.105],rotation:[-Math.PI/2,.784,0],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1018_Flower_Color_0.geometry,material:t.Flower_Color,position:[-26.074,13.023,25.257],rotation:[-2.21,.49,.983],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1019_Flower_Color_0.geometry,material:t.Flower_Color,position:[-1.211,12.759,36.931],rotation:[-2.352,-.096,1.611],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1020_Flower_Color_0.geometry,material:t.Flower_Color,position:[-13.839,6.887,36.041],rotation:[-2.086,.107,1.286],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1021_Flower_Color_0.geometry,material:t.Flower_Color,position:[16.278,7.878,33.908],rotation:[-2.075,-.155,1.933],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1022_Flower_Color_0.geometry,material:t.Flower_Color,position:[35.654,7.549,12.967],rotation:[-1.783,-.481,2.73],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1023_Flower_Color_0.geometry,material:t.Flower_Color,position:[-35.668,7.549,-12.931],rotation:[-1.359,.481,-.41],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1024_Flower_Color_0.geometry,material:t.Flower_Color,position:[-16.347,7.877,-33.876],rotation:[-1.067,.156,-1.206],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1025_Flower_Color_0.geometry,material:t.Flower_Color,position:[-34.775,7.254,15.894],rotation:[-1.83,.459,.509],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1026_Flower_Color_0.geometry,material:t.Flower_Color,position:[34.807,7.254,-15.822],rotation:[-1.312,-.46,-2.635],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Part_1027_Flower_Color_0.geometry,material:t.Flower_Color,position:[13.802,6.886,-36.055],rotation:[-1.055,-.107,-1.855],scale:[171.879,187.5,171.879]}),q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Plate_Gold_0.geometry,material:t.Gold,position:[0,1.75,0],rotation:[-Math.PI/2,0,0],scale:90})]})})})}';

  modifiedJs = modifiedJs.replace(originalFlowerComponent, targetFlowerComponent);
  console.log('   ✅ Replaced Lotus (cJ) component definition with dynamic blossom and glowing variants.');
} else {
  console.log('   ❌ Failed to locate cJ flower component index boundaries in Javascript file!');
}

// 3.6. CUSTOMIZE LANTERN TEXTS (SKILLS SECTION)
console.log('\n⚙️ Customizing skills lantern text labels...');

// Left lantern: "Frontend" / "Engineering" -> "Product" / "Manager"
const originalLeftLantern = 'q.jsxs("group",{position:[-15.5,8,-1],rotation:[0,.3,0],children:[q.jsx(bT,{scale:[20,14,10]}),q.jsx(pl,{position:[.2,4.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Frontend"}),q.jsx(pl,{position:[.2,3.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Engineering"})]})';
const targetLeftLantern = 'q.jsxs("group",{position:[-15.5,8,-1],rotation:[0,.3,0],children:[q.jsx(bT,{scale:[20,14,10]}),q.jsx(pl,{position:[.2,4.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Product"}),q.jsx(pl,{position:[.2,3.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Manager"})]})';

if (modifiedJs.includes(originalLeftLantern)) {
  modifiedJs = modifiedJs.replace(originalLeftLantern, targetLeftLantern);
  console.log('   ✅ Customized Left Lantern (Product Manager).');
} else {
  console.log('   ⚠️ Could not find Left Lantern matching block.');
}

// Middle lantern: "3D" / "Experiences" -> "Product" / "Ops"
const originalMiddleLantern = 'q.jsxs("group",{position:[-4,8,-13],rotation:[0,0,0],children:[q.jsx(bT,{scale:[20,14,10]}),q.jsx(pl,{position:[.2,4.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"3D"}),q.jsx(pl,{position:[.2,3.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Experiences"})]})';
const targetMiddleLantern = 'q.jsxs("group",{position:[-4,8,-13],rotation:[0,0,0],children:[q.jsx(bT,{scale:[20,14,10]}),q.jsx(pl,{position:[.2,4.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Product"}),q.jsx(pl,{position:[.2,3.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Ops"})]})';

if (modifiedJs.includes(originalMiddleLantern)) {
  modifiedJs = modifiedJs.replace(originalMiddleLantern, targetMiddleLantern);
  console.log('   ✅ Customized Middle Lantern (Product Ops).');
} else {
  console.log('   ⚠️ Could not find Middle Lantern matching block.');
}

// Right lantern: "Motion &" / "Interaction" -> "Growth" / "Systems"
const originalRightLantern = 'q.jsxs("group",{position:[11,8,-8],rotation:[0,-.2,0],children:[q.jsx(bT,{scale:[20,14,10]}),q.jsx(pl,{position:[.2,4.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Motion &"}),q.jsx(pl,{position:[.2,3.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Interaction"})]})';
const targetRightLantern = 'q.jsxs("group",{position:[11,8,-8],rotation:[0,-.2,0],children:[q.jsx(bT,{scale:[20,14,10]}),q.jsx(pl,{position:[.2,4.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Growth"}),q.jsx(pl,{position:[.2,3.5,1.6],rotation:[0,0,0],font:ml,fontSize:1,letterSpacing:.01,color:"white",anchorX:"center",anchorY:"middle",curveRadius:-6,"material-toneMapped":!1,children:"Systems"})]})';

if (modifiedJs.includes(originalRightLantern)) {
  modifiedJs = modifiedJs.replace(originalRightLantern, targetRightLantern);
  console.log('   ✅ Customized Right Lantern (Growth Systems).');
} else {
  console.log('   ⚠️ Could not find Right Lantern matching block.');
}

// Replace Projects Array
const projectsStartTag = 'const NC=[';
const projectsEndTag = '];function dJ(r)';

const startIndex = modifiedJs.indexOf(projectsStartTag);
const endIndex = modifiedJs.indexOf(projectsEndTag);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const originalProjectsBlock = modifiedJs.substring(startIndex, endIndex + projectsEndTag.length);
  const targetProjectsBlock = `const NC=${JSON.stringify(config.projects)};function dJ(r)`;
  modifiedJs = modifiedJs.replace(originalProjectsBlock, targetProjectsBlock);
  console.log(`✅ Customized all ${config.projects.length} projects in the 3D showcase.`);
} else {
  console.log('⚠️ Could not find exact projects array boundaries. Attempting dynamic replacement...');
  const projectsRegex = /const NC=\[.*?\];function dJ\(r\)/;
  if (projectsRegex.test(modifiedJs)) {
    modifiedJs = modifiedJs.replace(projectsRegex, `const NC=${JSON.stringify(config.projects)};function dJ(r)`);
    console.log(`✅ Customized all ${config.projects.length} projects dynamically.`);
  } else {
    console.error('❌ Failed to replace projects array! Source code matching failed.');
  }
}

// 3.7. UPGRADE SAKURA TREE (dJ) TO ADD FALLING CHERRY BLOSSOM LEAVES ANIMATION
console.log('\n⚙️ Upgrading Sakura Tree to support dynamic falling cherry blossom leaves/petals...');

const sakuraStart = 'function dJ(r){const{nodes:e,materials:t}=br("/models/sakura_tree_01_-_low_poly_model.glb");';
const sakuraEnd = 'br.preload("/models/sakura_tree_01_-_low_poly_model.glb");';

const sStartIdx = modifiedJs.indexOf(sakuraStart);
const sEndIdx = modifiedJs.indexOf(sakuraEnd);

if (sStartIdx !== -1 && sEndIdx !== -1 && sStartIdx < sEndIdx) {
  const originalSakuraComponent = modifiedJs.substring(sStartIdx, sEndIdx + sakuraEnd.length);
  const targetSakuraComponent = `function Petal({p}){
  const ref=xe.useRef();
  const pos=xe.useRef({x:p.x,y:p.y,z:p.z});
  const isDayRef=xe.useRef(localStorage.getItem("voyage-is-day")!=="false");
  xe.useEffect(()=>{
    const h=evt=>{isDayRef.current=evt.detail.isDay};
    window.addEventListener("weather-update",h);
    return ()=>window.removeEventListener("weather-update",h)
  },[]);
  Rl(state=>{
    if(!ref.current)return;
    const time=state.clock.getElapsedTime();
    const lastTime=ref.current.userData.lastTime||time;
    const delta=Math.min(0.1,time-lastTime);
    ref.current.userData.lastTime=time;
    
    const windGush=1.4+Math.sin(time*0.7)*1.2;
    const liftFactor=Math.min(0.9,windGush*0.45);
    const fallSpeed=p.speedY*(1.0-liftFactor)*22.0;
    const horizontalWind=windGush*4.5+p.windDrift*2.0;
    
    pos.current.x+=horizontalWind*delta;
    pos.current.y-=fallSpeed*delta;
    pos.current.z+=Math.sin(time*0.5)*0.8*delta;
    
    if(pos.current.x>38||pos.current.y<-12){
      pos.current.x=-20+(Math.random()-0.5)*15;
      pos.current.y=18+Math.random()*8;
      pos.current.z=(Math.random()-0.5)*25;
    }
    
    const flutterX=Math.sin(time*p.swaySpeed+p.phase)*p.swayRange*1.5;
    const flutterY=Math.sin(time*p.swaySpeed*2.0+p.phase)*0.3*(1.0+windGush*0.5);
    const flutterZ=Math.cos(time*p.swaySpeed*0.7+p.phase)*p.swayRange*1.2;
    
    ref.current.position.set(pos.current.x+flutterX,pos.current.y+flutterY,pos.current.z+flutterZ);
    
    const spin=1.0+windGush*1.5;
    ref.current.rotation.set(time*p.rotSpeedX*spin+p.phase,time*p.rotSpeedY*spin,time*p.rotSpeedZ*spin+p.phase);
    
    if(ref.current.material){
      const mat=ref.current.material;
      if(!mat.userData.originalColor){mat.userData.originalColor=mat.color.clone()}
      if(mat.userData.currentGlow===undefined){mat.userData.currentGlow=isDayRef.current?0:1}
      const targetGlow=isDayRef.current?0:1;
      mat.userData.currentGlow+=(targetGlow-mat.userData.currentGlow)*0.05;
      const glow=mat.userData.currentGlow;
      mat.toneMapped=glow<0.5;
      if(glow>0.001){
        const pulse=(0.2+Math.sin(time*1.5)*0.08)*glow;
        const glowColor=window.voyageCherryGlow||(window.voyageCherryGlow=new Lt("#ffb7d5"));
        const warmCherryColor=window.voyageWarmCherryColor||(window.voyageWarmCherryColor=new Lt("#fda4af"));
        mat.emissive.copy(glowColor).multiplyScalar(glow);
        mat.emissiveIntensity=pulse*1.2;
        mat.color.copy(mat.userData.originalColor).lerp(warmCherryColor,glow*0.35);
      }else{
        mat.emissive.set("#000000");
        mat.emissiveIntensity=0;
        mat.color.copy(mat.userData.originalColor);
      }
    }
  });
  return q.jsx("mesh",{ref:ref,position:[p.x,p.y,p.z],scale:[p.scale*1.3,p.scale*0.8,p.scale*0.1],castShadow:!0,children:[q.jsx("circleGeometry",{args:[0.6,6]}),q.jsx("meshStandardMaterial",{color:"#fbcfe8",roughness:0.6,metalness:0.0,side:2})]})
};

function SakuraLeaves(){
  const count=140;
  const petals=xe.useMemo(()=>{
    const arr=[];
    for(let i=0;i<count;i++){
      arr.push({
        x:-20+(Math.random()-0.5)*15,
        y:18+Math.random()*8,
        z:(Math.random()-0.5)*25,
        speedY:0.04+Math.random()*0.06,
        swaySpeed:0.8+Math.random()*1.2,
        swayRange:0.3+Math.random()*0.5,
        windDrift:0.15+Math.random()*0.15,
        rotSpeedX:0.5+Math.random()*1.0,
        rotSpeedY:0.8+Math.random()*1.2,
        rotSpeedZ:0.3+Math.random()*0.7,
        phase:Math.random()*Math.PI*2,
        scale:0.15+Math.random()*0.18
      })
    }
    return arr
  },[]);
  return q.jsx("group",{children:petals.map((p,i)=>q.jsx(Petal,{p:p},i))})
};

function BreezeStreak({p}){
  const ref=xe.useRef();
  const pos=xe.useRef({x:p.x,y:p.y,z:p.z,speed:p.speed,scaleX:p.scaleX});
  Rl(state=>{
    if(!ref.current)return;
    const time=state.clock.getElapsedTime();
    const lastTime=ref.current.userData.lastTime||time;
    const delta=Math.min(0.1,time-lastTime);
    ref.current.userData.lastTime=time;
    
    const windGush=1.4+Math.sin(time*0.7)*1.2;
    pos.current.x+=pos.current.speed*(0.4+windGush*0.8)*22.0*delta;
    if(pos.current.x>35){
      pos.current.x=-35-Math.random()*10;
      pos.current.y=p.y+(Math.random()-0.5)*5;
      pos.current.z=p.z+(Math.random()-0.5)*10;
    }
    const waveY=Math.sin(time*p.waveFreq+p.phase)*0.4*windGush;
    const waveZ=Math.cos(time*p.waveFreq*0.8+p.phase)*0.3*windGush;
    ref.current.position.set(pos.current.x,pos.current.y+waveY,pos.current.z+waveZ);
    ref.current.rotation.z=Math.cos(time*p.waveFreq+p.phase)*0.04;
    const currentScaleX=pos.current.scaleX*(0.8+windGush*0.5);
    ref.current.scale.set(currentScaleX,0.02*(0.8+windGush*0.4),1);
    const borderFade=Math.sin(Math.min(1,Math.max(0,(pos.current.x+35)/10))*Math.PI/2)*Math.sin(Math.min(1,Math.max(0,(35-pos.current.x)/10))*Math.PI/2);
    if(ref.current.material){
      ref.current.material.opacity=borderFade*0.06*(0.1+windGush*0.9);
    }
  });
  return q.jsxs("mesh",{
    ref:ref,
    position:[p.x,p.y,p.z],
    children:[
      q.jsx("planeGeometry",{args:[12,1]}),
      q.jsx("meshBasicMaterial",{
        color:"#ffe4e6",
        map:typeof sG !== "undefined" && typeof document !== "undefined" ? (window.voyageBreezeTex || (window.voyageBreezeTex = (() => {
          const canvas = document.createElement("canvas");
          canvas.width = 128;
          canvas.height = 32;
          const ctx = canvas.getContext("2d");
          const grad = ctx.createRadialGradient(64, 16, 0, 64, 16, 64);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
          grad.addColorStop(0.3, "rgba(255, 228, 230, 0.12)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 128, 32);
          const tex = new sG(canvas);
          return tex;
        })())) : null,
        transparent:!0,
        opacity:0.05,
        depthWrite:!1,
        side:2,
        blending:2
      })
    ]
  })
};

function BreezeStreaks(){
  const streaks=xe.useMemo(()=>{
    const arr=[];
    for(let i=0;i<8;i++){
      arr.push({
        x:-35+Math.random()*70,
        y:2+Math.random()*18,
        z:-25+Math.random()*50,
        speed:0.3+Math.random()*0.25,
        scaleX:1.0+Math.random()*0.8,
        waveFreq:1.5+Math.random()*1.5,
        phase:Math.random()*Math.PI*2
      })
    }
    return arr
  },[]);
  return q.jsx("group",{children:streaks.map((p,i)=>q.jsx(BreezeStreak,{p:p},i))})
};

function dJ(r){
  const{nodes:e,materials:t}=br("/models/sakura_tree_01_-_low_poly_model.glb");
  const barkRef=xe.useRef();
  const leavesRef=xe.useRef();
  const isDayRef=xe.useRef(localStorage.getItem("voyage-is-day")!=="false");
  
  xe.useEffect(()=>{
    const h=evt=>{isDayRef.current=evt.detail.isDay};
    window.addEventListener("weather-update",h);
    return ()=>window.removeEventListener("weather-update",h)
  },[]);
  
  xe.useEffect(()=>{
    if(t.Sakura_Mat){
      t.Sakura_Mat.onBeforeCompile=(shader)=>{
        shader.uniforms.uTime={value:0};
        shader.uniforms.uWindGush={value:1.4};
        t.Sakura_Mat.userData.shader=shader;
        shader.vertexShader=shader.vertexShader.replace(
          '#include <common>',
          '#include <common>\\nuniform float uTime;\\nuniform float uWindGush;'
        );
        shader.vertexShader=shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\\nfloat heightFactor = max(0.0, position.y + 2.0) * 0.04;\\nfloat branchFactor = length(position.xz) * 0.08;\\nfloat leavesSwayFactor = heightFactor * (1.2 + branchFactor);\\nfloat windWave = sin(uTime * 2.8 + position.y * 0.4 + position.x * 0.2) * 0.06 * uWindGush;\\nfloat leafShiverX = sin(uTime * 7.5 + position.z * 1.5) * 0.025 * uWindGush;\\nfloat leafShiverZ = cos(uTime * 8.0 + position.y * 1.5) * 0.025 * uWindGush;\\ntransformed.x += (windWave + leafShiverX) * leavesSwayFactor;\\ntransformed.y += sin(uTime * 2.0 + position.x * 0.5) * 0.02 * uWindGush * leavesSwayFactor;\\ntransformed.z += (windWave * 0.7 + leafShiverZ) * leavesSwayFactor;'
        );
      };
    }
    if(t.Bark001_2K_JPG_Mat){
      t.Bark001_2K_JPG_Mat.onBeforeCompile=(shader)=>{
        shader.uniforms.uTime={value:0};
        shader.uniforms.uWindGush={value:1.4};
        t.Bark001_2K_JPG_Mat.userData.shader=shader;
        shader.vertexShader=shader.vertexShader.replace(
          '#include <common>',
          '#include <common>\\nuniform float uTime;\\nuniform float uWindGush;'
        );
        shader.vertexShader=shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\\nfloat heightFactor = max(0.0, position.y - 4.0) * 0.035;\\nfloat branchDistance = length(position.xz);\\nfloat branchFactor = max(0.0, branchDistance - 1.0) * 0.07;\\nfloat barkSwayFactor = heightFactor * branchFactor;\\nfloat branchSway = sin(uTime * 1.8 + position.y * 0.25) * 0.05 * uWindGush;\\ntransformed.x += branchSway * barkSwayFactor;\\ntransformed.z += branchSway * 0.6 * barkSwayFactor;'
        );
      };
    }
  },[t]);

  Rl(state=>{
    const time=state.clock.getElapsedTime();
    const windGush=1.4+Math.sin(time*0.7)*1.2;
    
    if(t.Sakura_Mat&&t.Sakura_Mat.userData.shader){
      t.Sakura_Mat.userData.shader.uniforms.uTime.value=time;
      t.Sakura_Mat.userData.shader.uniforms.uWindGush.value=windGush;
    }
    if(t.Bark001_2K_JPG_Mat&&t.Bark001_2K_JPG_Mat.userData.shader){
      t.Bark001_2K_JPG_Mat.userData.shader.uniforms.uTime.value=time;
      t.Bark001_2K_JPG_Mat.userData.shader.uniforms.uWindGush.value=windGush;
    }
    
    if(leavesRef.current){
      const swayX=Math.sin(time*1.4)*0.012*windGush;
      const swayZ=Math.cos(time*1.1)*0.012*windGush;
      leavesRef.current.rotation.x=swayX;
      leavesRef.current.rotation.z=swayZ;
    }
    if(barkRef.current){
      barkRef.current.rotation.x=Math.sin(time*1.4)*0.001*windGush;
      barkRef.current.rotation.z=Math.cos(time*1.1)*0.001*windGush;
    }
    
    if(t.Sakura_Mat){
      if(!t.Sakura_Mat.userData.originalColor){t.Sakura_Mat.userData.originalColor=t.Sakura_Mat.color.clone()}
      if(t.Sakura_Mat.userData.currentGlow===undefined){t.Sakura_Mat.userData.currentGlow=isDayRef.current?0:1}
      const targetGlow=isDayRef.current?0:1;
      t.Sakura_Mat.userData.currentGlow+=(targetGlow-t.Sakura_Mat.userData.currentGlow)*0.05;
      const glow=t.Sakura_Mat.userData.currentGlow;
      t.Sakura_Mat.toneMapped=glow<0.5;
      if(glow>0.001){
        const pulse=(0.18+Math.sin(time*1.5)*0.06)*glow;
        const cherryGlow=window.voyageCherryGlow||(window.voyageCherryGlow=new Lt("#ffb7d5"));
        const warmCherryColor=window.voyageWarmCherryColor||(window.voyageWarmCherryColor=new Lt("#fda4af"));
        t.Sakura_Mat.emissive.copy(cherryGlow).multiplyScalar(glow);
        t.Sakura_Mat.emissiveIntensity=pulse;
        t.Sakura_Mat.color.copy(t.Sakura_Mat.userData.originalColor).lerp(warmCherryColor,glow*0.35)
      }else{
        t.Sakura_Mat.emissive.set("#000000");
        t.Sakura_Mat.emissiveIntensity=0;
        t.Sakura_Mat.color.copy(t.Sakura_Mat.userData.originalColor)
      }
    }
  });

  return q.jsxs("group",{...r,dispose:null,children:[
    q.jsx("group",{scale:1,children:q.jsxs("group",{rotation:[-Math.PI/2,0,0],children:[
      q.jsx("mesh",{ref:barkRef,castShadow:!0,receiveShadow:!0,geometry:e.Sakura_Bark001_2K_JPG_Mat_0.geometry,material:t.Bark001_2K_JPG_Mat,scale:[1,1,1]}),
      q.jsx("mesh",{ref:leavesRef,castShadow:!0,receiveShadow:!0,geometry:e.Sakura_Sakura_Mat_0.geometry,material:t.Sakura_Mat,scale:[1,1,1]})
    ]})}),
    q.jsx(SakuraLeaves,{}),
    q.jsx(BreezeStreaks,{})
  ]})
}`;
  modifiedJs = modifiedJs.replace(originalSakuraComponent, targetSakuraComponent);
  console.log('   ✅ Successfully upgraded Sakura Tree (dJ) with falling cherry blossom leaves/petals and night-mode glow transitions.');
} else {
  console.log('   ❌ Failed to locate dJ sakura component index boundaries in Javascript file!');
}

// 3.9. UPGRADE FLOATING RAFT TO AN INTERACTIVE LINKEDIN REDIRECT TRIGGER
console.log('\n⚙️ Upgrading floating wooden raft to interactive LinkedIn redirect trigger...');
const originalRaft = 'function mJ(r){const{nodes:e,materials:t}=br("/models/dea75aa855004fc48a3cddbb33bce248.glb");return q.jsx("group",{...r,dispose:null,children:q.jsx("group",{scale:.01,children:q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Raft_Raft_0.geometry,material:t.Raft,rotation:[-Math.PI/2,0,0],scale:100})})})}br.preload("/models/dea75aa855004fc48a3cddbb33bce248.glb");';
const targetRaft = 'function mJ(r){const{nodes:e,materials:t}=br("/models/dea75aa855004fc48a3cddbb33bce248.glb");const handleClick=(evt)=>{evt.stopPropagation();if(typeof window!=="undefined"){window.open("https://www.linkedin.com/in/dr-ajay-reddy-tummeti/","_blank")}};const handleOver=(evt)=>{evt.stopPropagation();if(typeof document!=="undefined"){document.body.style.cursor="pointer"}};const handleOut=(evt)=>{evt.stopPropagation();if(typeof document!=="undefined"){document.body.style.cursor="auto"}};return q.jsx("group",{...r,dispose:null,onClick:handleClick,onPointerOver:handleOver,onPointerOut:handleOut,children:q.jsx("group",{scale:.01,children:q.jsx("mesh",{castShadow:!0,receiveShadow:!0,geometry:e.Raft_Raft_0.geometry,material:t.Raft,rotation:[-Math.PI/2,0,0],scale:100})})})}br.preload("/models/dea75aa855004fc48a3cddbb33bce248.glb");';

if (modifiedJs.includes(originalRaft)) {
  modifiedJs = modifiedJs.replace(originalRaft, targetRaft);
  console.log('✅ Successfully upgraded floating wooden raft with LinkedIn tap-to-redirect and cursor highlighting!');
} else {
  console.log('❌ Failed to locate floating wooden raft component in Javascript file!');
}

// 3.95. UPGRADE 3D SHOWCASE CARDS WITH DOUBLE-TAP/CLICK DIRECT REDIRECTS
console.log('\n⚙️ Upgrading 3D showcase cards with double-tap/click direct redirects...');
const originalCardClick = 'onClick:()=>n&&n(N.key),style:{cursor:"pointer"}';
const targetCardClick = 'onClick:()=>n&&n(N.key),onDoubleClick:e=>{e.stopPropagation();const l=NC[N.key]?.link;l&&l!=="#"&&window.open(l,"_blank")},style:{cursor:"pointer"}';

if (modifiedJs.includes(originalCardClick)) {
  modifiedJs = modifiedJs.replace(originalCardClick, targetCardClick);
  console.log('✅ Successfully upgraded 3D rotating cards with double-tap/click direct redirects!');
} else {
  console.log('❌ Failed to locate 3D rotating cards click handler in Javascript file!');
}

// 4. INJECT WEATHER SYSTEM INTO R3F CANVAS
console.log('\n⚙️ Injecting dynamic Weather and Bioluminescence Engine...');

// Target original elements inside GJ:
// We look for aW (Skybox), gW (Water), and _W (Particles Spline)
const skyboxStart = 'q.jsx(aW,{background:!0,resolution:512,frames:1,children:';
const particlesEnd = 'color:"#9DDCE9",size:.15}),';

const sceneStartIndex = modifiedJs.indexOf(skyboxStart);
const sceneEndIndex = modifiedJs.indexOf(particlesEnd);

if (sceneStartIndex !== -1 && sceneEndIndex !== -1 && sceneStartIndex < sceneEndIndex) {
  const originalSceneElements = modifiedJs.substring(sceneStartIndex, sceneEndIndex + particlesEnd.length);
  const targetSceneElements = `q.jsx(CustomWeatherScene,{isDarkMode:n,originalSkyRotation:o.rotation,originalSkyScale:o.scale,dayEnvMap:u,nightEnvMap:c}),`;
  modifiedJs = modifiedJs.replace(originalSceneElements, targetSceneElements);
  console.log('✅ Hooked CustomWeatherScene into Three.js canvas hierarchy.');
} else {
  console.error('❌ Failed to hook CustomWeatherScene! The Three.js code elements could not be found.');
  process.exit(1);
}

// 5. APPEND CUSTOM REACT COMPONENTS & DOM UI AT THE END OF THE JS BUNDLE
const weatherEngineSourceCode = `

// =======================================================================
// CUSTOM DYNAMIC WEATHER, STARS, CLOUDS, AND BIOLUMINESCENCE COMPONENTS
// =======================================================================

const StarrySky = ({ count = 2500 }) => {
  const pointsRef = xe.useRef();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const actualCount = isMobile ? Math.floor(count * 1.5) : count;

  const [positions, colors] = xe.useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const cols = new Float32Array(actualCount * 3);
    
    // Aesthetic, cosmic color palette (Soft White, Ice Blue, Soft Warm Gold, Pale Purple)
    const starColors = [
      [1.0, 1.0, 1.0],     // White
      [0.85, 0.95, 1.0],   // Ice Blue
      [1.0, 0.95, 0.78],   // Warm Gold
      [0.95, 0.88, 1.0]    // Pale Purple
    ];

    for (let i = 0; i < actualCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 260 + Math.random() * 140;
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 15;
      pos[i * 3 + 2] = r * Math.cos(phi);

      const col = starColors[Math.floor(Math.random() * starColors.length)];
      cols[i * 3 + 0] = col[0];
      cols[i * 3 + 1] = col[1];
      cols[i * 3 + 2] = col[2];
    }
    return [pos, cols];
  }, [actualCount]);

  Rl((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.material.opacity = 0.65 + Math.sin(time * 1.3) * 0.25;
  });

  return q.jsx("points", {
    ref: pointsRef,
    children: q.jsxs("bufferGeometry", {
      children: [
        q.jsx("bufferAttribute", { attach: "attributes-position", count: actualCount, array: positions, itemSize: 3 }),
        q.jsx("bufferAttribute", { attach: "attributes-color", count: actualCount, array: colors, itemSize: 3 })
      ]
    }),
    material: q.jsx("pointsMaterial", {
      size: isMobile ? 1.45 : 0.95,
      vertexColors: !0,
      transparent: !0,
      opacity: 0.9,
      sizeAttenuation: !0,
      depthWrite: !1,
      blending: zr
    })
  });
};

const ShootingStars = () => {
  const ref = xe.useRef();
  const stars = xe.useMemo(() => {
    return Array.from({ length: 4 }, () => ({
      active: false,
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      age: 0,
      life: 0
    }));
  }, []);

  Rl((state, delta) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array;
    const colors = ref.current.geometry.attributes.color.array;
    
    stars.forEach((star, idx) => {
      if (!star.active) {
        // Spawn a shooting star occasionally (approx 0.3% chance per frame)
        if (Math.random() < 0.003) {
          star.active = true;
          star.x = -250 + Math.random() * 100;
          star.y = 80 + Math.random() * 40;
          star.z = -180 - Math.random() * 150;
          star.vx = 220 + Math.random() * 120;
          star.vy = -60 - Math.random() * 40;
          star.vz = 50 + Math.random() * 50;
          star.age = 0;
          star.life = 0.5 + Math.random() * 0.6;
        } else {
          // Hide inactive stars deep below the water plane
          positions[idx * 3 + 0] = 0;
          positions[idx * 3 + 1] = -999;
          positions[idx * 3 + 2] = 0;
          return;
        }
      }

      // Update active shooting star coordinates
      star.x += star.vx * delta;
      star.y += star.vy * delta;
      star.z += star.vz * delta;
      star.age += delta;

      if (star.age >= star.life) {
        star.active = false;
        positions[idx * 3 + 0] = 0;
        positions[idx * 3 + 1] = -999;
        positions[idx * 3 + 2] = 0;
      } else {
        positions[idx * 3 + 0] = star.x;
        positions[idx * 3 + 1] = star.y;
        positions[idx * 3 + 2] = star.z;

        // Brightness fade in and out curve
        const progress = star.age / star.life;
        const brightness = Math.sin(progress * Math.PI);
        colors[idx * 3 + 0] = brightness;
        colors[idx * 3 + 1] = brightness * 0.95;
        colors[idx * 3 + 2] = brightness * 0.85;
      }
    });

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.geometry.attributes.color.needsUpdate = true;
  });

  const initialPositions = xe.useMemo(() => new Float32Array(12), []);
  const initialColors = xe.useMemo(() => new Float32Array(12), []);

  return q.jsx("points", {
    ref: ref,
    children: q.jsxs("bufferGeometry", {
      children: [
        q.jsx("bufferAttribute", { attach: "attributes-position", count: 4, array: initialPositions, itemSize: 3 }),
        q.jsx("bufferAttribute", { attach: "attributes-color", count: 4, array: initialColors, itemSize: 3 })
      ]
    }),
    material: q.jsx("pointsMaterial", {
      size: 2.2,
      vertexColors: !0,
      transparent: !0,
      opacity: 0.95,
      sizeAttenuation: !0,
      depthWrite: !1,
      blending: zr
    })
  });
};

const Fireflies = ({ count = 35 }) => {
  const ref = xe.useRef();
  const [positions, offsets] = xe.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offs = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Position fireflies gently around the raft and rock monoliths
      pos[i * 3 + 0] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = -8 + Math.random() * 18;
      pos[i * 3 + 2] = -40 + (Math.random() - 0.5) * 70;

      // Random phase offsets for organic wandering animations
      offs[i * 3 + 0] = Math.random() * 100;
      offs[i * 3 + 1] = Math.random() * 100;
      offs[i * 3 + 2] = Math.random() * 100;
    }
    return [pos, offs];
  }, [count]);

  Rl((state, delta) => {
    if (!ref.current) return;
    const positionsArray = ref.current.geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Organic sine wave wandering velocities
      positionsArray[idx + 0] += Math.sin(time * 0.5 + offsets[idx + 0]) * 0.035;
      positionsArray[idx + 1] += Math.cos(time * 0.7 + offsets[idx + 1]) * 0.025;
      positionsArray[idx + 2] += Math.sin(time * 0.4 + offsets[idx + 2]) * 0.035;

      // Keep fireflies bounded within scene play area
      if (positionsArray[idx + 0] > 30) positionsArray[idx + 0] = -30;
      if (positionsArray[idx + 0] < -30) positionsArray[idx + 0] = 30;
      if (positionsArray[idx + 1] > 18) positionsArray[idx + 1] = -8;
      if (positionsArray[idx + 1] < -9) positionsArray[idx + 1] = 15;
      if (positionsArray[idx + 2] > 20) positionsArray[idx + 2] = -90;
      if (positionsArray[idx + 2] < -90) positionsArray[idx + 2] = 20;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    
    // Firefly flashing luminescence animation
    ref.current.material.opacity = 0.55 + Math.sin(time * 2.5) * 0.4;
  });

  return q.jsx("points", {
    ref: ref,
    children: q.jsx("bufferGeometry", {
      children: q.jsx("bufferAttribute", { attach: "attributes-position", count: count, array: positions, itemSize: 3 })
    }),
    material: q.jsx("pointsMaterial", {
      size: 0.85,
      color: "#a3e635", // Luminescent Yellow-Green / Lime
      transparent: !0,
      opacity: 0.8,
      sizeAttenuation: !0,
      depthWrite: !1,
      blending: zr
    })
  });
};

const CloudySky = ({ count = 22 }) => {
  const groupRef = xe.useRef();
  const clouds = xe.useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 450,
        32 + Math.random() * 18,
        (Math.random() - 0.5) * 450
      ],
      scale: [
        18 + Math.random() * 22,
        8 + Math.random() * 9,
        18 + Math.random() * 22
      ],
      speed: 0.015 + Math.random() * 0.035,
      rotation: Math.random() * Math.PI
    }));
  }, [count]);

  Rl((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      if (clouds[i]) {
        child.position.x += clouds[i].speed * delta * 20;
        if (child.position.x > 250) child.position.x = -250;
      }
    });
  });

  return q.jsx("group", {
    ref: groupRef,
    children: clouds.map((cloud, i) => 
      q.jsx("mesh", {
        position: cloud.position,
        scale: cloud.scale,
        rotation: [0, cloud.rotation, 0],
        children: q.jsxs("group", {
          children: [
            q.jsx("sphereGeometry", { args: [1, 7, 7] }),
            q.jsx("meshBasicMaterial", {
              color: "#e2e8f0",
              transparent: !0,
              opacity: 0.28,
              depthWrite: !0,
              toneMapped: !1
            })
          ]
        })
      }, i)
    )
  });
};

const Precipitation = ({ type = "rain", count = 1800 }) => {
  const pointsRef = xe.useRef();
  const positions = xe.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 220;
      arr[i * 3 + 1] = Math.random() * 110 - 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    return arr;
  }, [count]);

  const speeds = xe.useMemo(() => {
    return Float32Array.from({ length: count }, () => 
      type === "rain" ? 38 + Math.random() * 22 : 3.5 + Math.random() * 3.5
    );
  }, [count, type]);

  Rl((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i] * delta;
      if (type === "snow") {
        pos[i * 3 + 0] += Math.sin(state.clock.getElapsedTime() * 0.9 + i) * delta * 1.5;
      }
      if (pos[i * 3 + 1] < -12) {
        pos[i * 3 + 0] = (Math.random() - 0.5) * 220;
        pos[i * 3 + 1] = 95;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 220;
      }
    }
    geo.attributes.position.needsUpdate = !0;
  });

  return q.jsx("points", {
    ref: pointsRef,
    children: q.jsx("bufferGeometry", {
      children: q.jsx("bufferAttribute", { attach: "attributes-position", count: count, array: positions, itemSize: 3 })
    }),
    material: q.jsx("pointsMaterial", {
      size: type === "rain" ? 0.32 : 0.65,
      color: type === "rain" ? "#93c5fd" : "#ffffff",
      transparent: !0,
      opacity: type === "rain" ? 0.42 : 0.8,
      depthWrite: !1,
      blending: zr
    })
  });
};

const LightningEffect = ({ active = !1 }) => {
  const [lightIntensity, setLightIntensity] = xe.useState(0);
  xe.useEffect(() => {
    if (!active) {
      setLightIntensity(0);
      return;
    }
    let timeout;
    const flash = () => {
      const delay = 3500 + Math.random() * 7500;
      timeout = setTimeout(() => {
        setLightIntensity(2.0 + Math.random() * 2);
        setTimeout(() => setLightIntensity(0), 80);
        setTimeout(() => {
          setLightIntensity(1.3 + Math.random());
          setTimeout(() => setLightIntensity(0), 60);
        }, 130);
        flash();
      }, delay);
    };
    flash();
    return () => clearTimeout(timeout);
  }, [active]);

  if (!active || lightIntensity === 0) return null;
  return q.jsx("directionalLight", {
    intensity: lightIntensity,
    color: "#f1f5f9",
    position: [20, 85, 20]
  });
};

function CustomWeatherScene({ isDarkMode, originalSkyRotation, originalSkyScale, dayEnvMap, nightEnvMap }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const points = [
    [1,-9.6,5], [1,-9.6,-20], [1,-4.6,-60], [25,-9.6,-100], 
    [15,-4.6,-160], [15,-9.6,-220], [20,-4.6,-300], 
    [-25,-9.6,-330], [-25,-4.6,-380], [-15,-4.6,-400], 
    [-20,-9.6,-460], [-20,-9.6,-480]
  ];

  const initialWeather = localStorage.getItem('voyage-weather') || 'clear';
  const initialIsDay = localStorage.getItem('voyage-is-day') !== 'false';

  const [weather, setWeather] = xe.useState(initialWeather);
  const [isDay, setIsDay] = xe.useState(initialIsDay);

  xe.useEffect(() => {
    const handleWeatherUpdate = (e) => {
      setWeather(e.detail.weather);
      setIsDay(e.detail.isDay);
    };
    window.addEventListener('weather-update', handleWeatherUpdate);
    return () => window.removeEventListener('weather-update', handleWeatherUpdate);
  }, []);

  xe.useEffect(() => {
    setIsDay(!isDarkMode);
    const currentW = localStorage.getItem('voyage-weather') || 'clear';
    window.dispatchEvent(new CustomEvent('weather-update', { detail: { weather: currentW, isDay: !isDarkMode } }));
    window.dispatchEvent(new CustomEvent('theme-updated-manually', { detail: { isDay: !isDarkMode } }));
  }, [isDarkMode]);

  const computedSkyMap = isDay ? dayEnvMap : nightEnvMap;
  
  // Custom Dynamic Lighting variables
  let ambientIntensity = 0.5;
  let ambientColor = "#ffffff";
  let dirIntensity = 1.0;
  let dirColor = "#fffbeb";
  let fogColor = "#ffffff";
  let fogNear = 10;
  let fogFar = 1000;

  // Bioluminescent and normal Water configuration
  let waterMixColor = "#3f3f3f";
  let waterColorValue = 0;
  let waterAlpha = 0.9;
  let particleColor = "#facc15"; // Glowing yellow / gold color
  let particleSize = 0.15;
  let particleCount = 4200;

  if (isDay) {
    if (weather === 'clear') {
      ambientIntensity = 0.65;
      ambientColor = "#fef08a";
      dirIntensity = 1.6;
      dirColor = "#fffbeb";
      fogColor = "#bae6fd";
      fogFar = 950;
      particleColor = "#facc15";
    } else if (weather === 'cloudy') {
      ambientIntensity = 0.45;
      ambientColor = "#e2e8f0";
      dirIntensity = 0.45;
      dirColor = "#cbd5e1";
      fogColor = "#cbd5e1";
      fogFar = 420;
      waterMixColor = "#4b5563";
      particleColor = "#eab308";
    } else if (weather === 'rainy' || weather === 'stormy') {
      ambientIntensity = 0.28;
      ambientColor = "#94a3b8";
      dirIntensity = 0.18;
      dirColor = "#64748b";
      fogColor = "#475569";
      fogNear = 2;
      fogFar = 220;
      waterMixColor = "#1e293b";
      particleColor = "#d97706";
    } else if (weather === 'snowy') {
      ambientIntensity = 0.72;
      ambientColor = "#ffffff";
      dirIntensity = 0.35;
      dirColor = "#f1f5f9";
      fogColor = "#f1f5f9";
      fogNear = 4;
      fogFar = 310;
      waterMixColor = "#52525b";
      particleColor = "#facc15";
    }
  } else {
    // NIGHT MODE (Highly atmospheric golden bioluminescent aesthetics!)
    ambientIntensity = isMobile ? 0.12 : 0.04;
    ambientColor = isMobile ? "#040614" : "#020308"; // Deep midnight-indigo cold tone, slightly brighter on mobile
    dirIntensity = isMobile ? 0.16 : 0.08;
    dirColor = "#cbd5e1"; // Cool silver moonlight
    
    if (weather === 'clear') {
      fogColor = isMobile ? "#02030a" : "#000104";
      fogFar = 720;
      // BIOLUMINESCENCE ACTIVATED (Glowing Gold!)
      waterMixColor = "#03040c"; // Dark midnight indigo water
      particleColor = "#fbbf24"; // Bright glowing gold/yellow
      particleSize = 0.26; // High glow size
      particleCount = 5800; // Extra glow density
    } else if (weather === 'cloudy') {
      fogColor = isMobile ? "#020308" : "#000102";
      fogFar = 360;
      waterMixColor = "#010206";
      particleColor = "#f59e0b"; // Warm amber gold
      particleSize = 0.20;
      particleCount = 4500;
    } else if (weather === 'rainy' || weather === 'stormy') {
      fogColor = isMobile ? "#020208" : "#000002";
      fogNear = 2;
      fogFar = 190;
      waterMixColor = "#000001";
      particleColor = "#d97706"; // Deep amber gold
      particleSize = 0.22;
      particleCount = 4600;
    } else if (weather === 'snowy') {
      fogColor = isMobile ? "#02030a" : "#000105";
      fogNear = 3;
      fogFar = 270;
      waterMixColor = "#020408";
      particleColor = "#fbbf24"; // Glowing gold
      particleSize = 0.20;
      particleCount = 4200;
    }
  }

  return q.jsxs("group", {
    key: isDay + '-' + weather,
    children: [
      q.jsx("fog", { attach: "fog", args: [fogColor, fogNear, fogFar] }),
      q.jsx("ambientLight", { intensity: ambientIntensity, color: ambientColor }),
      q.jsx("directionalLight", { intensity: dirIntensity, color: dirColor, position: [35, 95, 35] }),

      // Environment Skybox (Tinted royal midnight blue in night mode)
      q.jsx(aW, {
        background: !0,
        resolution: 512,
        frames: 1,
        children: q.jsx("group", {
          rotation: originalSkyRotation,
          children: q.jsxs("mesh", {
            scale: originalSkyScale,
            children: [
              q.jsx("sphereGeometry", { args: [1, 64, 64] }),
              q.jsx("meshBasicMaterial", { side: Vr, toneMapped: !1, map: computedSkyMap, color: isDay ? "#ffffff" : (isMobile ? "#141830" : "#0c0f20") })
            ]
          })
        })
      }),

      // Twinkling Star Field (Increased density and multicolored particles)
      (!isDay || weather === 'stormy') && q.jsx(StarrySky, { count: isDay ? 1200 : 4800 }),

      // Shooting Stars (Active in clear night skies)
      (!isDay && weather === 'clear') && q.jsx(ShootingStars, {}),

      // Fireflies (Gentle glowing drifting lights in all night climates)
      (!isDay) && q.jsx(Fireflies, { count: weather === 'clear' ? 45 : 25 }),

      // Volumetric Drifting Clouds
      (weather !== 'clear') && q.jsx(CloudySky, { count: weather === 'cloudy' ? 38 : 18 }),

      // Precipitations
      (weather === 'rainy' || weather === 'stormy') && q.jsx(Precipitation, { type: "rain" }),
      (weather === 'snowy') && q.jsx(Precipitation, { type: "snow" }),

      // Lightning
      (weather === 'stormy') && q.jsx(LightningEffect, { active: !0 }),

      // Dynamic glowing water
      q.jsx(gW, {
        position: [0, -10, -300],
        width: 800,
        length: 800,
        dimensions: 2048,
        distortionScale: weather === 'stormy' ? 6.5 : 3,
        timeScale: weather === 'stormy' ? 0.9 : 0.5,
        fxDistortionFactor: 1,
        fxDisplayColorAlpha: waterAlpha,
        fxMixColor: waterMixColor
      }),

      // Bioluminescent Spline particles
      q.jsx(_W, {
        points: points,
        count: particleCount,
        width: 5,
        speed: weather === 'stormy' ? 0.05 : 0.03,
        swirl: 2.2,
        wobble: 0.8,
        yWobble: 0.18,
        color: particleColor,
        size: particleSize
      })
    ]
  });
}

// Dynamically Inject the Celestial Sun/Moon Toggle & Auto-Weather Sync UI
if (typeof document !== 'undefined') {
  const injectWeatherUI = () => {
    if (document.getElementById('voyage-weather-widget')) return;

    // Create the main celestial widget container
    const widget = document.createElement('div');
    widget.id = 'voyage-weather-widget';
    widget.className = 'celestial-widget day-theme';
    
    // HTML structure for Sun (day) and Moon (night) shapes inside a volumetric button
    widget.innerHTML = '<button id="celestial-button" aria-label="Toggle Day/Night Theme" title="Toggle Day/Night Theme">' +
        '<!-- Day Mode: Volumetric Sun with realistic rotating core and 8 glowing rays -->' +
        '<div class="sun-shape">' +
          '<div class="sun-body"></div>' +
          '<div class="sun-corona"></div>' +
          '<div class="sun-ray ray-1"></div>' +
          '<div class="sun-ray ray-2"></div>' +
          '<div class="sun-ray ray-3"></div>' +
          '<div class="sun-ray ray-4"></div>' +
          '<div class="sun-ray ray-5"></div>' +
          '<div class="sun-ray ray-6"></div>' +
          '<div class="sun-ray ray-7"></div>' +
          '<div class="sun-ray ray-8"></div>' +
        '</div>' +
        '<!-- Night Mode: Shaded Crescent Moon with twinkling background sparkles -->' +
        '<div class="moon-shape">' +
          '<div class="moon-body"></div>' +
          '<div class="star-sparkle sparkle-1">✦</div>' +
          '<div class="star-sparkle sparkle-2">✦</div>' +
        '</div>' +
      '</button>' +
      '<!-- Sleek floating geocoded location status label -->' +
      '<div id="weather-caption" class="weather-caption-text">📍 Auto-detecting location...</div>';

    // Premium styling including custom 3D shadows, transitions, HSL gradients, and keyframe animations
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = '.celestial-widget {' +
        'position: fixed;' +
        'top: 90px;' +
        'right: 24px;' +
        'z-index: 1000;' +
        'display: flex;' +
        'flex-direction: column;' +
        'align-items: center;' +
        'gap: 8px;' +
        'pointer-events: none;' +
        'transition: all 0.3s ease;' +
      '}' +
      '#celestial-button {' +
        'pointer-events: auto;' +
        'position: relative;' +
        'width: 64px;' +
        'height: 64px;' +
        'border-radius: 50%;' +
        'border: 1px solid rgba(255, 255, 255, 0.25);' +
        'background: rgba(15, 23, 42, 0.35);' +
        'backdrop-filter: blur(12px);' +
        '-webkit-backdrop-filter: blur(12px);' +
        'cursor: pointer;' +
        'outline: none;' +
        'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.22);' +
        'display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        'overflow: visible;' +
        'transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);' +
        'touch-action: manipulation;' +
      '}' +
      '#celestial-button:hover {' +
        'transform: scale(1.1) rotate(15deg);' +
        'background: rgba(15, 23, 42, 0.45);' +
        'box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.45), 0 0 15px rgba(255, 255, 255, 0.15);' +
        'border-color: rgba(255, 255, 255, 0.45);' +
      '}' +
      '#celestial-button:active {' +
        'transform: scale(0.95);' +
      '}' +
      '.sun-shape {' +
        'position: absolute;' +
        'width: 100%;' +
        'height: 100%;' +
        'display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        'transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);' +
        'opacity: 1;' +
        'transform: rotate(0deg) scale(1);' +
      '}' +
      '.sun-body {' +
        'width: 28px;' +
        'height: 28px;' +
        'border-radius: 50%;' +
        'background: radial-gradient(circle at 35% 35%, #ffffff 0%, #fffdc4 15%, #facc15 50%, #ea580c 85%, #9a3412 100%);' +
        'box-shadow: 0 0 25px rgba(251, 191, 36, 0.95), 0 0 45px rgba(234, 88, 12, 0.5), inset -3px -3px 6px rgba(0, 0, 0, 0.15), inset 3px 3px 6px rgba(255, 255, 255, 0.85);' +
        'animation: pulse-solar 3s infinite alternate ease-in-out, spin-solar-core 20s linear infinite;' +
      '}' +
      '.sun-corona {' +
        'position: absolute;' +
        'width: 34px;' +
        'height: 34px;' +
        'border-radius: 50%;' +
        'background: transparent;' +
        'border: 2px dashed rgba(251, 191, 36, 0.4);' +
        'box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);' +
        'animation: spin-solar-core 12s linear infinite;' +
        'pointer-events: none;' +
      '}' +
      '.sun-ray {' +
        'position: absolute;' +
        'width: 4px;' +
        'height: 10px;' +
        'background: linear-gradient(to top, rgba(251, 191, 36, 0.1) 0%, #fbbf24 60%, #fffbeb 100%);' +
        'border-radius: 4px;' +
        'box-shadow: 0 0 8px rgba(251, 191, 36, 0.85);' +
        'opacity: 0.8;' +
        'animation: pulse-ray 4s ease-in-out infinite alternate;' +
      '}' +
      '.ray-1 { transform: rotate(0deg) translateY(-20px); animation-delay: 0s; }' +
      '.ray-2 { transform: rotate(45deg) translateY(-20px); animation-delay: 0.5s; }' +
      '.ray-3 { transform: rotate(90deg) translateY(-20px); animation-delay: 1s; }' +
      '.ray-4 { transform: rotate(135deg) translateY(-20px); animation-delay: 1.5s; }' +
      '.ray-5 { transform: rotate(180deg) translateY(-20px); animation-delay: 2s; }' +
      '.ray-6 { transform: rotate(225deg) translateY(-20px); animation-delay: 2.5s; }' +
      '.ray-7 { transform: rotate(270deg) translateY(-20px); animation-delay: 3s; }' +
      '.ray-8 { transform: rotate(315deg) translateY(-20px); animation-delay: 3.5s; }' +
      '.moon-shape {' +
        'position: absolute;' +
        'width: 100%;' +
        'height: 100%;' +
        'display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        'transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);' +
        'opacity: 0;' +
        'transform: rotate(-90deg) scale(0.5);' +
      '}' +
      '.moon-body {' +
        'width: 26px;' +
        'height: 26px;' +
        'border-radius: 50%;' +
        'background: transparent;' +
        'box-shadow: inset -7px -4px 0 0 #e2e8f0;' +
        'filter: drop-shadow(0 0 10px rgba(226, 232, 240, 0.95)) drop-shadow(0 0 18px rgba(139, 92, 246, 0.45));' +
        'position: relative; overflow: visible;' +
        'left: 3px;' +
      '}' +
      '.star-sparkle {' +
        'position: absolute;' +
        'color: #fffbeb;' +
        'font-size: 8px;' +
        'opacity: 0.9;' +
        'filter: drop-shadow(0 0 3px #fffbeb);' +
        'pointer-events: none;' +
      '}' +
      '.sparkle-1 {' +
        'top: 14px;' +
        'left: 14px;' +
        'animation: twinkle-sparkle 2s infinite alternate ease-in-out;' +
      '}' +
      '.sparkle-2 {' +
        'bottom: 14px;' +
        'right: 14px;' +
        'animation: twinkle-sparkle 2.5s infinite alternate ease-in-out 0.5s;' +
      '}' +
      '@keyframes pulse-solar {' +
        '0% { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.75); }' +
        '100% { transform: scale(1.08); box-shadow: 0 0 25px rgba(251, 191, 36, 0.95), 0 0 40px rgba(234, 88, 12, 0.45); }' +
      '}' +
      '@keyframes spin-solar-core {' +
        '0% { transform: rotate(0deg); }' +
        '100% { transform: rotate(360deg); }' +
      '}' +
      '@keyframes pulse-ray {' +
        '0% { opacity: 0.4; height: 8px; }' +
        '100% { opacity: 0.95; height: 14px; }' +
      '}' +
      '@keyframes twinkle-sparkle {' +
        '0% { opacity: 0.2; transform: scale(0.8); }' +
        '100% { opacity: 1; transform: scale(1.2); }' +
      '}' +
      '.weather-caption-text {' +
        'pointer-events: none;' +
        'font-size: 10px;' +
        'font-weight: 500;' +
        'letter-spacing: 0.03em;' +
        'color: rgba(255, 255, 255, 0.85);' +
        'background: rgba(15, 23, 42, 0.6);' +
        'backdrop-filter: blur(8px);' +
        '-webkit-backdrop-filter: blur(8px);' +
        'border: 1px solid rgba(255, 255, 255, 0.08);' +
        'border-radius: 20px;' +
        'padding: 4px 12px;' +
        'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);' +
        'opacity: 0;' +
        'transform: translateY(5px);' +
        'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);' +
        'white-space: nowrap;' +
      '}' +
      '.celestial-widget:hover .weather-caption-text {' +
        'opacity: 1;' +
        'transform: translateY(0);' +
      '}' +
      '.celestial-widget.day-theme .sun-shape {' +
        'opacity: 1;' +
        'transform: rotate(0deg) scale(1);' +
      '}' +
      '.celestial-widget.day-theme .moon-shape {' +
        'opacity: 0;' +
        'transform: rotate(-90deg) scale(0.5);' +
      '}' +
      '.celestial-widget.night-theme .sun-shape {' +
        'opacity: 0;' +
        'transform: rotate(90deg) scale(0.5);' +
      '}' +
      '.celestial-widget.night-theme .moon-shape {' +
        'opacity: 1;' +
        'transform: rotate(0deg) scale(1);' +
      '}';
    
    document.head.appendChild(styleSheet);
    document.body.appendChild(widget);

    // Initial state loading and automatic time-of-day checks
    let currentLocalWeather = localStorage.getItem('voyage-weather') || 'clear';
    let isDayLocal = localStorage.getItem('voyage-is-day') !== 'false';

    const syncThemeWithTime = (isDayVal) => {
      const navThemeBtn = document.querySelector('nav button[title*="Switch to"]');
      if (!navThemeBtn) return;
      const titleAttr = navThemeBtn.getAttribute('title') || '';
      const isCurrentlyDark = titleAttr.includes('Light');
      const targetDark = !isDayVal;
      if (isCurrentlyDark !== targetDark) {
        navThemeBtn.click();
      }
    };

    const updateWidgetThemeClass = (isDayVal) => {
      const widgetEl = document.getElementById('voyage-weather-widget');
      if (widgetEl) {
        if (isDayVal) {
          widgetEl.classList.remove('night-theme');
          widgetEl.classList.add('day-theme');
        } else {
          widgetEl.classList.remove('day-theme');
          widgetEl.classList.add('night-theme');
        }
      }
    };

    const mapWeatherCode = (code) => {
      if (code === 0) return 'clear';
      if ([1, 2, 3, 45, 48].includes(code)) return 'cloudy';
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy';
      if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy';
      if ([95, 96, 99].includes(code)) return 'stormy';
      return 'clear';
    };

    // System-Time Fallback Logic (if Geolocation is denied/fails)
    const fallbackToTimeOfDay = (reasonText) => {
      const hours = new Date().getHours();
      const isDayTime = hours >= 6 && hours < 18;
      
      // If we don't have location cache, automatically sync based on system clock
      if (localStorage.getItem('voyage-is-day') === null) {
        isDayLocal = isDayTime;
        localStorage.setItem('voyage-is-day', isDayLocal);
      }
      
      updateWidgetThemeClass(isDayLocal);
      syncThemeWithTime(isDayLocal);
      
      const captionEl = document.getElementById('weather-caption');
      if (captionEl) {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        captionEl.innerText = "📍 Auto-Time: " + timeString + " " + reasonText;
      }
      window.dispatchEvent(new CustomEvent('weather-update', { detail: { weather: currentLocalWeather, isDay: isDayLocal } }));
    };

    // Geolocation and Open-Meteo background API weather detection
    const autoSyncLocationAndWeather = () => {
      if (!navigator.geolocation) {
        fallbackToTimeOfDay('(No Geo Support)');
        return;
      }
      
      const captionEl = document.getElementById('weather-caption');
      if (captionEl) captionEl.innerText = '📍 Syncing location...';

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=weather_code,is_day&timezone=auto";
            const weatherRes = await fetch(weatherUrl);
            const weatherData = await weatherRes.json();
            
            const geoUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + lon + "&localityLanguage=en";
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();
            const locationName = geoData.city || geoData.locality || "Your Location";

            const apiWeather = mapWeatherCode(weatherData.current.weather_code);
            const apiIsDay = weatherData.current.is_day === 1;

            currentLocalWeather = apiWeather;
            // On load, update isDay according to API data if not overridden by user
            if (localStorage.getItem('voyage-is-day') === null) {
              isDayLocal = apiIsDay;
              localStorage.setItem('voyage-is-day', isDayLocal);
            }

            localStorage.setItem('voyage-weather', currentLocalWeather);
            updateWidgetThemeClass(isDayLocal);

            if (captionEl) {
              captionEl.innerText = "📍 " + locationName + ": " + currentLocalWeather.charAt(0).toUpperCase() + currentLocalWeather.slice(1);
            }

            syncThemeWithTime(isDayLocal);
            window.dispatchEvent(new CustomEvent('weather-update', { detail: { weather: currentLocalWeather, isDay: isDayLocal } }));
          } catch (err) {
            console.error("Auto weather sync failed:", err);
            fallbackToTimeOfDay('(API Offline)');
          }
        },
        (error) => {
          console.log("Geolocation access denied or timed out. Falling back to system clock.");
          fallbackToTimeOfDay('(Clock Sync)');
        },
        { timeout: 6000 }
      );
    };

    // Initial load setup
    updateWidgetThemeClass(isDayLocal);
    
    // Automatically trigger Geolocation/Time detection in background on page mount
    setTimeout(() => {
      autoSyncLocationAndWeather();
    }, 800);

    // Bind event dispatches to track global theme modifications from the navbar button directly
    window.addEventListener('theme-updated-manually', (e) => {
      isDayLocal = e.detail.isDay;
      localStorage.setItem('voyage-is-day', isDayLocal);
      updateWidgetThemeClass(isDayLocal);
      
      const captionEl = document.getElementById('weather-caption');
      if (captionEl) {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        captionEl.innerText = isDayLocal ? "☀️ Day Mode • " + timeString : "🌙 Night Mode • " + timeString;
      }
      window.dispatchEvent(new CustomEvent('weather-update', { detail: { weather: currentLocalWeather, isDay: isDayLocal } }));
    });

    // Toggle button interactive click/tap animation and state synchronization
    document.getElementById('celestial-button').addEventListener('click', (e) => {
      e.stopPropagation();
      isDayLocal = !isDayLocal;
      localStorage.setItem('voyage-is-day', isDayLocal);
      
      updateWidgetThemeClass(isDayLocal);
      
      const captionEl = document.getElementById('weather-caption');
      if (captionEl) {
        captionEl.innerText = isDayLocal ? "☀️ Morning rises..." : "🌙 Midnight falls...";
        setTimeout(() => {
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          captionEl.innerText = isDayLocal ? "☀️ Day (Manual) • " + timeString : "🌙 Night (Manual) • " + timeString;
        }, 1200);
      }

      syncThemeWithTime(isDayLocal);
      window.dispatchEvent(new CustomEvent('weather-update', { detail: { weather: currentLocalWeather, isDay: isDayLocal } }));
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWeatherUI);
  } else {
    injectWeatherUI();
  }
}
`;

modifiedJs += weatherEngineSourceCode;
console.log('🎉 Weather and Bioluminescence Engine appended successfully!');

// 4.5. APPEND PORTFOLIO VIDEO MODAL UI AT THE END OF THE JS BUNDLE
console.log('\n⚙️ Appending portfolio Video Modal overlay DOM code...');
const videoModalSourceCode = `

// =======================================================================
// PORTFOLIO BIO VIDEO MODAL COMPONENT (FROSTED GLASS GOLDEN DESIGN)
// =======================================================================
window.voyageAboutVideoUrl = "${config.about_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-keyboard-of-a-computer-with-rgb-lights-40096-large.mp4'}";
window.voyageAboutVideoBlobUrl = null;

// Eagerly preload the video in the background as a Blob URL to bypass loading lag and moov-atom seek latency
if (typeof window !== 'undefined' && !window.voyageAboutVideoUrl.includes('youtube.com') && !window.voyageAboutVideoUrl.includes('youtu.be')) {
  console.log('🚀 Preloading video in the background for lag-free playback...');
  fetch(window.voyageAboutVideoUrl)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load video file');
      return response.blob();
    })
    .then(blob => {
      window.voyageAboutVideoBlobUrl = URL.createObjectURL(blob);
      console.log('✅ About Me video preloaded successfully into browser memory blob:', window.voyageAboutVideoBlobUrl);
    })
    .catch(err => {
      console.warn('⚠️ Background video preloading failed (will use direct stream):', err);
    });
}

if (typeof document !== 'undefined') {
  const injectVideoModal = () => {
    if (document.getElementById('voyage-video-modal')) return;

    let wasBgMusicPlaying = false; // State tracker for background music

    const modal = document.createElement('div');
    modal.id = 'voyage-video-modal';
    modal.style.cssText = \`
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      background: rgba(10, 15, 30, 0.55);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    \`;

    modal.innerHTML = \`
      <div id="video-modal-content" style="
        position: relative;
        width: 90%;
        max-width: 860px;
        aspect-ratio: 16/9;
        background: rgba(15, 23, 42, 0.88);
        border: 2px solid rgba(251, 191, 36, 0.45);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.65), 0 0 45px rgba(251, 191, 36, 0.22);
        overflow: hidden;
        transform: scale(0.9);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        <button id="btn-close-video" style="
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        ">✕</button>

        <div id="video-player-container" style="width: 100%; height: 100%;"></div>
      </div>
    \`;

    document.body.appendChild(modal);

    const closeBtn = document.getElementById('btn-close-video');
    const closeModal = () => {
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      document.getElementById('video-modal-content').style.transform = 'scale(0.9)';
      setTimeout(() => {
        document.getElementById('video-player-container').innerHTML = '';
      }, 400);

      // Auto-resume background music if it was playing before
      if (wasBgMusicPlaying) {
        const bgMusicBtn = document.querySelector('button[title="Play"]');
        if (bgMusicBtn) {
          console.log('▶️ Resuming background music via UI click...');
          bgMusicBtn.click();
        } else {
          // Fallback direct audio element play
          const bgAudio = document.querySelector('audio[src*="background.mp3"]') || document.querySelector('audio');
          if (bgAudio) {
            bgAudio.play().catch(e => console.warn('Failed to play background audio directly:', e));
          }
        }
        wasBgMusicPlaying = false;
      }
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(251, 191, 36, 0.95)';
      closeBtn.style.color = '#0f172a';
      closeBtn.style.transform = 'scale(1.1)';
      closeBtn.style.boxShadow = '0 0 12px rgba(251, 191, 36, 0.6)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(15, 23, 42, 0.85)';
      closeBtn.style.color = '#ffffff';
      closeBtn.style.transform = 'scale(1)';
      closeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
    });

    window.addEventListener('open-about-video', () => {
      // Auto-pause background music if it is currently playing
      wasBgMusicPlaying = false;
      const bgMusicBtn = document.querySelector('button[title="Pause"]');
      if (bgMusicBtn) {
        wasBgMusicPlaying = true;
        console.log('⏸️ Pausing background music via UI click...');
        bgMusicBtn.click();
      } else {
        // Fallback: check raw audio element
        const bgAudio = document.querySelector('audio[src*="background.mp3"]') || document.querySelector('audio');
        if (bgAudio && !bgAudio.paused) {
          wasBgMusicPlaying = true;
          bgAudio.pause();
        }
      }

      // Use preloaded Blob URL if available, else direct stream
      const videoUrl = window.voyageAboutVideoBlobUrl || window.voyageAboutVideoUrl;
      const container = document.getElementById('video-player-container');
      
      let playerHtml = '';
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        let ytId = '';
        if (videoUrl.includes('youtu.be/')) {
          ytId = videoUrl.split('youtu.be/')[1].split('?')[0];
        } else if (videoUrl.includes('v=')) {
          ytId = videoUrl.split('v=')[1].split('&')[0];
        } else if (videoUrl.includes('embed/')) {
          ytId = videoUrl.split('embed/')[1].split('?')[0];
        }
        playerHtml = \`<iframe src="https://www.youtube.com/embed/\${ytId}?autoplay=1&rel=0" style="width:100%; height:100%; border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\`;
      } else {
        // High-performance video player tag
        playerHtml = \`<video src="\${videoUrl}" autoplay controls preload="auto" playsinline webkit-playsinline style="width:100%; height:100%; object-fit:contain; background:#000;"></video>\`;
      }
      
      container.innerHTML = playerHtml;
      
      // Auto-trigger video play if it is a video element
      const videoEl = container.querySelector('video');
      if (videoEl) {
        videoEl.addEventListener('ended', closeModal);
        videoEl.play().catch(e => console.warn('Autoplay play() promise caught:', e));
      }
      
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      document.getElementById('video-modal-content').style.transform = 'scale(1)';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectVideoModal);
  } else {
    injectVideoModal();
  }
}
`;

modifiedJs += videoModalSourceCode;
console.log('🎉 Portfolio Video Modal overlay appended successfully!');

// Write the modified JS
try {
  fs.writeFileSync(JS_PATH, modifiedJs, 'utf8');
  console.log('🎉 Javascript asset updated successfully!');
} catch (e) {
  console.error('❌ Error writing index JS file:', e.message);
  process.exit(1);
}

// 6. Read original/backup HTML file
console.log('\n⚙️ Customizing HTML file...');
const htmlCode = fs.readFileSync(HTML_BAK_PATH, 'utf8');
let modifiedHtml = htmlCode;

// Inject high-performance video preload tag to start downloading the video assets immediately
const videoUrl = config.about_video_url || '/music/about_me.mp4';
if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
  const preloadTag = `\n    <link rel="preload" as="video" type="video/mp4" href="${videoUrl}">`;
  modifiedHtml = modifiedHtml.replace('</head>', `${preloadTag}\n  </head>`);
  console.log('✅ Injected HTML high-performance video preload link.');
}

// Replace title
const originalTitle = '<title>Voyage</title>';
const targetTitle = `<title>${config.name} | PM Portfolio</title>`;
if (modifiedHtml.includes(originalTitle)) {
  modifiedHtml = modifiedHtml.replace(originalTitle, targetTitle);
  console.log('✅ Customized HTML page title.');
}

// Disable/Remove Awwwards floating badge
const awwwardsDiv = '<div id="awwwards"';
if (modifiedHtml.includes(awwwardsDiv)) {
  modifiedHtml = modifiedHtml.replace(
    /<div id="awwwards"[\s\S]*?<\/div>/,
    '<!-- Removed Awwwards floating badge -->'
  );
  console.log('✅ Removed the floating third-party Awwwards badge.');
}

// Add Cache Buster
const originalScript = 'src="/assets/index-D_hQMIQo.js?v=3"';
const targetScript = `src="/assets/index-D_hQMIQo.js?v=${Date.now()}"`;
if (modifiedHtml.includes(originalScript)) {
  modifiedHtml = modifiedHtml.replace(originalScript, targetScript);
  console.log('✅ Injected unique cache buster for Javascript.');
}
const originalCss = 'href="/assets/index-CNr_ZrEO.css?v=3"';
const targetCss = `href="/assets/index-CNr_ZrEO.css?v=${Date.now()}"`;
if (modifiedHtml.includes(originalCss)) {
  modifiedHtml = modifiedHtml.replace(originalCss, targetCss);
  console.log('✅ Injected unique cache buster for CSS.');
}

// Write the modified HTML
try {
  fs.writeFileSync(HTML_PATH, modifiedHtml, 'utf8');
  console.log('🎉 index.html updated successfully!');
} catch (e) {
  console.error('❌ Error writing HTML file:', e.message);
  process.exit(1);
}

console.log('\n=============================================================================');
console.log('✨ All customizations completed successfully!');
console.log('💻 To see your changes live, run:');
console.log('   npx http-server ./ -p 8081');
console.log('   Then open: http://localhost:8081');
