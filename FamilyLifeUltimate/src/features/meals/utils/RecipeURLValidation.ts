export function isValidRecipeURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}