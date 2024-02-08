import MimeMatcher from 'mime-matcher';

export function generateMediaThumbnail(file: File, maxWidth = 427, maxHeight = 240) {
    return new Promise<string>((resolve) => {
        const isVideo = new MimeMatcher('video/*').match(file.type);
        const isImage = new MimeMatcher('image/*').match(file.type);
        console.log(file.type);

        if (isImage) {
            // Generate image

            const img = new Image();

            const blob = URL.createObjectURL(file);
            img.src = blob;

            img.addEventListener(
                'load',
                () => {
                    const canvas = document.createElement('canvas');

                    // Calculate size that fits
                    const newSize = calculateAspectRatioFit(
                        img.naturalWidth,
                        img.naturalHeight,
                        maxWidth,
                        maxHeight
                    );

                    canvas.width = newSize.width;
                    canvas.height = newSize.height;

                    const ctx = canvas.getContext('2d');

                    if (!ctx) return;

                    ctx.drawImage(img, 0, 0, newSize.width, newSize.height);

                    const previewImage = canvas.toDataURL('image/png', 60);

                    resolve(previewImage);

                    img.remove();
                    canvas.remove();
                },
                { once: true }
            );
        }

        if (isVideo) {
            // Generate video frame

            const video = document.createElement('video');
            document.body.appendChild(video);

            const blob = URL.createObjectURL(file);
            video.src = blob;
            video.muted = true;

            video.onloadeddata = () => {
                video.currentTime = Math.min(video.duration, 10) * Math.random();

                const canvas = document.createElement('canvas');

                // Calculate size that fits
                const newSize = calculateAspectRatioFit(
                    video.videoWidth,
                    video.videoHeight,
                    maxWidth,
                    maxHeight
                );

                canvas.width = newSize.width;
                canvas.height = newSize.height;

                const ctx = canvas.getContext('2d');

                if (!ctx) return;

                video.play();

                video.addEventListener(
                    'playing',
                    () => {
                        video.pause();

                        ctx.drawImage(video, 0, 0, newSize.width, newSize.height);

                        const previewImage = canvas.toDataURL('image/png', 60);

                        video.remove();
                        canvas.remove();

                        URL.revokeObjectURL(blob);
                        resolve(previewImage);
                    },
                    { once: true }
                );
            };
        }
    });
}
/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 *
 * @see https://stackoverflow.com/a/14731922
 */
function calculateAspectRatioFit(
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number
) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
}
