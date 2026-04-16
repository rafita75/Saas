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
  
  // Actualización de Contenido (Edición Inline / Sidebar)
  updateSectionContent: (field, value) => set((state) => {
    if (state.selectedSectionIndex === null) return state;
    const newSections = [...state.pageData.sections];
    newSections[state.selectedSectionIndex].content[field] = value;
    return { pageData: { ...state.pageData, sections: newSections } };
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