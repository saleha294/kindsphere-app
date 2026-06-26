// lib/session.ts
export const setHandle = (handle: string) => {
    localStorage.setItem('kind_sphere_handle', handle);
};

export const getHandle = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('kind_sphere_handle') : null;
};