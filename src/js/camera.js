import { state } from './state.js';

export function animateCamera(targetPos, targetLookAt, duration) {
    return new Promise(resolve => {
        const { camera, Globe } = state;

        const startPos = camera.position.clone();
        const coords = {
            x: startPos.x,
            y: startPos.y,
            z: startPos.z,
            rotX: Globe.rotation.x,
            rotY: Globe.rotation.y
        };

        let endRotX = coords.rotX;
        let endRotY = coords.rotY;

        if (targetLookAt) {
            endRotX = targetLookAt.lat * Math.PI / 180;
            endRotY = -targetLookAt.lng * Math.PI / 180;

            const TWO_PI = Math.PI * 2;
            while (endRotY - coords.rotY > Math.PI) endRotY -= TWO_PI;
            while (endRotY - coords.rotY < -Math.PI) endRotY += TWO_PI;
        }

        new TWEEN.Tween(coords)
            .to({
                x: targetPos?.x ?? coords.x,
                y: targetPos?.y ?? coords.y,
                z: targetPos?.z ?? coords.z,
                rotX: endRotX,
                rotY: endRotY
            }, duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                camera.position.set(coords.x, coords.y, coords.z);
                Globe.rotation.x = coords.rotX;
                Globe.rotation.y = coords.rotY;
            })
            .onComplete(resolve)
            .start();
    });
}
