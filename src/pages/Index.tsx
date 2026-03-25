import { useState, useCallback, useRef } from 'react';
import type { Page, DesignElement, CanvasPreset } from '@/types/design';
import { createDefaultPage, createTextElement, createShapeElement, createImageElement, createId, DEFAULT_PRESET } from '@/types/design';
import { getTemplatePages } from '@/lib/templates';
import { Toolbar } from '@/components/design/Toolbar';
import { PageSidebar } from '@/components/design/PageSidebar';
import { Canvas } from '@/components/design/Canvas';
import { PropertiesPanel } from '@/components/design/PropertiesPanel';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [pages, setPages] = useState<Page[]>([createDefaultPage()]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [canvasPreset, setCanvasPreset] = useState<CanvasPreset>(DEFAULT_PRESET);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentPage = pages[currentPageIndex];
  const selectedElement = currentPage?.elements.find(e => e.id === selectedId) ?? null;

  const updatePage = useCallback((index: number, updater: (page: Page) => Page) => {
    setPages(prev => prev.map((p, i) => i === index ? updater(p) : p));
  }, []);

  const handleUpdateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: page.elements.map(e => e.id === id ? { ...e, ...updates } as DesignElement : e),
    }));
  }, [currentPageIndex, updatePage]);

  const handleDeleteElement = useCallback((id: string) => {
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: page.elements.filter(e => e.id !== id),
    }));
    setSelectedId(null);
  }, [currentPageIndex, updatePage]);

  const handleAddText = useCallback(() => {
    const el = createTextElement();
    updatePage(currentPageIndex, page => ({ ...page, elements: [...page.elements, el] }));
    setSelectedId(el.id);
  }, [currentPageIndex, updatePage]);

  const handleAddShape = useCallback((shape: 'rectangle' | 'circle') => {
    const el = createShapeElement({
      shapeType: shape,
      shapeStyle: {
        fill: '#e0e0e0',
        borderRadius: shape === 'circle' ? 9999 : 16,
        borderWidth: 0,
        borderColor: '#ccc',
        opacity: 1,
      },
    });
    updatePage(currentPageIndex, page => ({ ...page, elements: [...page.elements, el] }));
    setSelectedId(el.id);
  }, [currentPageIndex, updatePage]);

  const handleAddImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const el = createImageElement(url);
    updatePage(currentPageIndex, page => ({ ...page, elements: [...page.elements, el] }));
    setSelectedId(el.id);
    e.target.value = '';
  }, [currentPageIndex, updatePage]);

  const handleApplyTemplate = useCallback((templateId: string) => {
    const templatePages = getTemplatePages(templateId);
    if (templatePages.length === 0) return;

    // Replace current page with template's first page
    updatePage(currentPageIndex, () => templatePages[0]);

    // Add additional template pages
    if (templatePages.length > 1) {
      setPages(prev => {
        const newPages = [...prev];
        for (let i = 1; i < templatePages.length; i++) {
          newPages.splice(currentPageIndex + i, 0, templatePages[i]);
        }
        return newPages;
      });
    }

    setSelectedId(null);
    setEditingId(null);
    toast({ title: '템플릿 적용 완료', description: '텍스트를 더블클릭하여 편집하세요.' });
  }, [currentPageIndex, updatePage]);

  const handleAddPage = useCallback(() => {
    setPages(prev => [...prev, createDefaultPage()]);
    setCurrentPageIndex(pages.length);
    setSelectedId(null);
  }, [pages.length]);

  const handleDeletePage = useCallback((index: number) => {
    if (pages.length <= 1) return;
    setPages(prev => prev.filter((_, i) => i !== index));
    setCurrentPageIndex(prev => Math.min(prev, pages.length - 2));
    setSelectedId(null);
  }, [pages.length]);

  const handleDoubleClick = useCallback((id: string) => {
    const el = currentPage?.elements.find(e => e.id === id);
    if (el?.type === 'text') {
      setEditingId(id);
    }
  }, [currentPage]);

  const handleTextChange = useCallback((id: string, text: string) => {
    handleUpdateElement(id, { text });
  }, [handleUpdateElement]);

  const handleFinishEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleBgChange = useCallback((updates: any) => {
    updatePage(currentPageIndex, page => ({
      ...page,
      background: { ...page.background, ...updates },
    }));
  }, [currentPageIndex, updatePage]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (editingId) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
      handleDeleteElement(selectedId);
    }
  }, [editingId, selectedId, handleDeleteElement]);

  return (
    <div className="h-screen flex flex-col bg-background" onKeyDown={handleKeyDown} tabIndex={0}>
      <Toolbar
        onAddText={handleAddText}
        onAddShape={handleAddShape}
        onAddImage={handleAddImage}
        onApplyTemplate={handleApplyTemplate}
        currentPreset={canvasPreset}
        onChangePreset={setCanvasPreset}
      />
      <div className="flex-1 flex overflow-hidden">
        <PageSidebar
          pages={pages}
          currentIndex={currentPageIndex}
          onSelectPage={i => { setCurrentPageIndex(i); setSelectedId(null); setEditingId(null); }}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
        />
        <Canvas
          page={currentPage}
          selectedId={selectedId}
          editingId={editingId}
          onSelectElement={setSelectedId}
          onUpdateElement={handleUpdateElement}
          onDoubleClickElement={handleDoubleClick}
          onTextChange={handleTextChange}
          onFinishEditing={handleFinishEditing}
        />
        <PropertiesPanel
          element={selectedElement}
          onUpdate={handleUpdateElement}
          onDelete={handleDeleteElement}
          bgColor={currentPage.background.color}
          bgType={currentPage.background.type}
          bgGradientFrom={currentPage.background.gradientFrom}
          bgGradientTo={currentPage.background.gradientTo}
          bgGradientDir={currentPage.background.gradientDirection}
          onBgChange={handleBgChange}
        />
      </div>
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
};

export default Index;
