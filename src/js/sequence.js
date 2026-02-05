import { state } from './state.js';
import { LOCATIONS } from './config.js';
import { updateStageUI, completeIntro } from './welcome.js';
import { animateCamera } from './camera.js';

export async function startSequence() {
    if (!state.Globe) return;
    const { Globe, renderer } = state;

    // Stage 1: Fade In & Initial Spin
    updateStageUI(1);

    // Ensure renderer is visible
    setTimeout(() => {
        renderer.domElement.style.opacity = '1';
    }, 100);

    // Wait for 1 second (Idle)
    const startRotY = Globe.rotation.y;
    new TWEEN.Tween(Globe.rotation)
        .to({ y: startRotY + 0.2 }, 2000)
        .easing(TWEEN.Easing.Linear.None)
        .start();

    await new Promise(r => setTimeout(r, 2000));

    // Stage 2 & 3: Continuous Zoom to Village
    updateStageUI(3); // Show "Salendri Village" target immediately

    // Single long smooth zoom from Space -> Village
    await animateCamera(
        { x: 0, y: 0, z: 135 }, // Final Close-up
        LOCATIONS.village,
        5000
    );

    // Stage 5: Welcome Screen
    completeIntro();
}
