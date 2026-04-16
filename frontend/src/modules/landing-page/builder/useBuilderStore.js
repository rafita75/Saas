import { create } from 'zustand';

/**
 * useBuilderStore: El cerebro del constructor visual.
 * Maneja los datos de la página, la selección actual y el historial de cambios.
 */
const useBuilderStore = create((set) => ({
  pageData: { name: '', path: '', sections: [], theme: {}, templateId: 'modular', seo: { title: '', description: '' } },
  selectedSectionIndex: null,
  isSaving: false,
  
  // Acciones de la Página
  setPageData: (data) => set({ pageData: data }),
  
  // Selección de Sección
  setSelectedSectionIndex: (index) => set({ selectedSectionIndex: index }),
  
  // Acciones de Tema (Global)
  updateTheme: (field, value) => set((state) => ({
    pageData: { ...state.pageData, theme: { ...state.pageData.theme, [field]: value } }
  })),

  // Actualización de Contenido y Configuración (Local de sección)
  updateSectionContent: (field, value) => set((state) => {
    if (state.selectedSectionIndex === null) return state;
    const newSections = [...state.pageData.sections];
    newSections[state.selectedSectionIndex].content[field] = value;
    return { pageData: { ...state.pageData, sections: newSections } };
  }),

  // Reordenar Secciones (D&D)
  reorderSections: (newSections) => set((state) => ({
    pageData: { ...state.pageData, sections: newSections }
  })),

  // Añadir Nueva Sección
  addSection: (type) => set((state) => {
    const defaults = {
      hero: { title: 'Nuevo Título Impactante', description: 'Describe tu propuesta de valor aquí.', ctaText: 'Comenzar', layout: 'split' },
      features: { title: 'Características Principales', items: [{ title: 'Característica 1', description: 'Detalle...' }] },
      pricing: { title: 'Planes y Precios', items: [{ name: 'Básico', price: '29' }] },
      pitch: { text: 'Una frase que resuma tu éxito.', author: 'Nombre', role: 'Cargo' },
      contact: { title: 'Contáctanos', description: 'Estamos para ayudarte.' },
      info: { title: 'Más Información', description: 'Detalles adicionales del servicio.' }
    };
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      content: defaults[type] || { title: 'Nuevo Bloque' },
      order: state.pageData.sections.length
    };
    return { pageData: { ...state.pageData, sections: [...state.pageData.sections, newSection] } };
  }),

  // Actualización de Ítems (Listas como Precios/Features)
  updateListItem: (itemIdx, field, value) => set((state) => {
    if (state.selectedSectionIndex === null) return state;
    const newSections = [...state.pageData.sections];
    const section = newSections[state.selectedSectionIndex];
    if (section.content.items) {
      section.content.items[itemIdx][field] = value;
    }
    return { pageData: { ...state.pageData, sections: newSections } };
  }),

  // Reordenar Secciones
  moveSection: (index, dir) => set((state) => {
    const newSections = [...state.pageData.sections];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= newSections.length) return state;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    return { pageData: { ...state.pageData, sections: newSections }, selectedSectionIndex: newIndex };
  }),

  // Eliminar Sección
  deleteSection: (index) => set((state) => ({
    pageData: { ...state.pageData, sections: state.pageData.sections.filter((_, i) => i !== index) },
    selectedSectionIndex: null
  }))
}));

export default useBuilderStore;