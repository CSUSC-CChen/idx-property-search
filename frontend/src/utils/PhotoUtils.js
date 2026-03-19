// src/utils/PhotoUtils.js
export function safeParsePhotos(rawPhotos) {
    if (!rawPhotos || typeof rawPhotos !== 'string') {
        return [];
    }
    try {
        const parsed = JSON.parse(rawPhotos);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}