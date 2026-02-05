import { state } from './state.js';
import { LOCATIONS } from './config.js';
import { createPinTexture } from './three-utils.js';
import { startSequence } from './sequence.js';
import { hideLoadingIndicator } from './ui.js';

export function initThreeJS() {
    const mountPoint = document.getElementById('three-mount');

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    scene.fog = new THREE.FogExp2(0x000005, 0.0000001);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    
    // Adjust initial distance based on device width to ensure globe is fully visible
    const isMobile = window.innerWidth < 768;
    camera.position.z = isMobile ? 550 : 350;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.opacity = '0';
    renderer.domElement.style.transition = 'opacity 3s ease-in-out';
    mountPoint.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x4040bb, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(100, 100, 100);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4455ff, 1.0);
    rimLight.position.set(-50, 0, -50);
    scene.add(rimLight);

    // 5. Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const posArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 4000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    // 6. ThreeGlobe Setup
    const Globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animateIn: true
    })
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .showAtmosphere(true)
        .atmosphereColor('#3a75c4')
        .atmosphereAltitude(0.15)
        .polygonCapColor(() => 'rgba(0,0,0,0)')
        .polygonSideColor(() => 'rgba(0,0,0,0)')
        .polygonStrokeColor(() => 'rgba(255,255,255,0.15)')
        .polygonAltitude(0.005);

    // 7. Load Data
    // Step 1: Load World Data
    fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson')
        .then(r => r.json())
        .then(worldData => {
            Globe.polygonsData(worldData.features)
                .polygonCapColor(() => 'rgba(0,0,0,0)')
                .polygonSideColor(() => 'rgba(0,0,0,0)')
                .polygonStrokeColor(() => 'rgba(255,255,255,0.15)')
                .polygonAltitude(0.005);

            // Labels
            const importantCountries = [
                "United States of America", "China", "Russia", "Brazil",
                "Australia", "Canada", "United Kingdom", "France", "Germany",
                "Japan", "South Africa", "Saudi Arabia"
            ];

            const FALLBACK_COORDS = {
                "China": { lat: 35.8617, lng: 104.1954 },
                "United States of America": { lat: 37.0902, lng: -95.7129 },
                "Russia": { lat: 61.5240, lng: 105.3188 },
                "Brazil": { lat: -14.2350, lng: -51.9253 },
                "Australia": { lat: -25.2744, lng: 133.7751 }
            };

            const countryLabels = worldData.features
                .filter(d => importantCountries.includes(d.properties.name || d.properties.NAME || d.properties.admin))
                .map(d => {
                    const name = d.properties.name || d.properties.NAME || d.properties.admin;
                    let lat = d.properties.label_y || d.properties.LABEL_Y || 0;
                    let lng = d.properties.label_x || d.properties.LABEL_X || 0;

                    if ((!lat && !lng) && FALLBACK_COORDS[name]) {
                        lat = FALLBACK_COORDS[name].lat;
                        lng = FALLBACK_COORDS[name].lng;
                    }
                    return { lat, lng, name, type: "country" };
                })
                .filter(d => d.lat !== 0 && d.lng !== 0);

            // Render Labels
            const renderLabels = (extraLabels = []) => {
                const villageLabel = {
                    ...LOCATIONS.village,
                    name: "Kareempur",
                    lng: LOCATIONS.village.lng + 0.1
                };

                const allLabels = [...countryLabels, villageLabel, ...extraLabels];
                Globe.labelsData(allLabels)
                    .labelLat(d => d.lat)
                    .labelLng(d => d.lng)
                    .labelText(d => d.name)
                    .labelSize(d => {
                        if (d.type === 'village') return 0.5;
                        if (d.type === 'city') return 0.6;
                        if (d.type === 'state') return 0.8;
                        return 0.9;
                    })
                    .labelDotRadius(d => {
                        if (d.type === 'village') return 0;
                        if (d.type === 'city') return 0.3;
                        return 0;
                    })
                    .labelColor(d => {
                        if (d.type === 'village') return 'white';
                        if (d.type === 'city') return '#ffffaa';
                        if (d.type === 'state') return '#cccccc';
                        return 'rgba(255,255,255,0.7)';
                    })
                    .labelResolution(3)
                    .labelAltitude(d => d.type === 'village' ? 0.02 : 0.01)
                    .labelIncludeDot(d => d.type === 'city');
            };
            renderLabels();

            // Pin Marker
            const pinData = [LOCATIONS.village];
            const pinTexture = createPinTexture();
            const pinMaterial = new THREE.SpriteMaterial({
                map: pinTexture,
                color: 0xffffff,
                sizeAttenuation: false,
                depthTest: true,
                depthWrite: false
            });

            Globe.objectsData(pinData)
                .objectLat(d => d.lat)
                .objectLng(d => d.lng)
                .objectAltitude(0.02)
                .objectThreeObject(d => {
                    const pinSprite = new THREE.Sprite(pinMaterial);
                    pinSprite.scale.set(0.04, 0.04, 1);
                    pinSprite.center.set(0.5, 0);
                    pinSprite.renderOrder = 999;
                    return pinSprite;
                });

            // Step 2: Load India Data
            fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson')
                .then(r => r.json())
                .then(indiaData => {
                    if (!indiaData || !indiaData.features) return;

                    const telanganaFeature = indiaData.features.find(f => {
                        const name = f.properties.NAME_1 || f.properties.NAME || "";
                        return name.includes("Telangana") || name.includes("Telengana");
                    });

                    const combinedFeatures = [...worldData.features];
                    if (telanganaFeature) {
                        combinedFeatures.push(telanganaFeature);
                    }

                    Globe.polygonsData(combinedFeatures)
                        .polygonCapColor(() => 'rgba(0,0,0,0)')
                        .polygonSideColor(() => 'rgba(0,0,0,0)')
                        .polygonStrokeColor(d => {
                            const name = d.properties.NAME_1 || d.properties.NAME || "";
                            if (name.includes("Telangana") || name.includes("Telengana")) {
                                return 'rgba(255, 200, 100, 0.8)';
                            }
                            return 'rgba(255,255,255,0.15)';
                        })
                        .polygonAltitude(d => {
                            const name = d.properties.NAME_1 || d.properties.NAME || "";
                            if (name.includes("Telangana") || name.includes("Telengana")) {
                                return 0.01;
                            }
                            return 0.005;
                        });
                })
                .catch(e => console.warn("India States fetch failed", e));

        }).catch(err => console.error("Error loading Globe data:", err));

    // Wait for Globe
    Globe.onGlobeReady(() => {
        hideLoadingIndicator();
        requestAnimationFrame(() => {
            startSequence();
        });
    });

    scene.add(Globe);

    // Save to State
    state.scene = scene;
    state.camera = camera;
    state.renderer = renderer;
    state.Globe = Globe;
    state.stars = starsMesh;

    // Animation Loop
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
        if (state.stars) state.stars.rotation.y += 0.00005;
        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
