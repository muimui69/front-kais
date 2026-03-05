/**
 * Convierte un objeto de filtros en un Record de strings limpio,
 * eliminando valores null o undefined.
 */
export const cleanHttpParams = (query: Record<string, any>): Record<string, string> => {
    return Object.entries(query).reduce((acc, [key, value]) => {
        // Verificamos que el valor no sea nulo, indefinido ni un string vacío
        if (value !== null && value !== undefined && value !== '') {
            acc[key] = String(value);
        }
        return acc;
    }, {} as Record<string, string>);
};