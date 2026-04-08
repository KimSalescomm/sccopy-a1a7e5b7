import { useState, useCallback, useRef, useEffect } from 'react';
import type { Page, DesignElement, CanvasPreset } from '@/types/design';
import { createDefaultPage, createTextElement, createShapeElement, createImageElement, createId, DEFAULT_PRESET, CANVAS_PRESETS } from '@/types/design';
import { getTemplatePages, getTemplatePresetId } from '@/lib/templates';
import { Toolbar } from '@/components/design/Toolbar';
import { PageSidebar } from '@/components/design/PageSidebar';
import { Canvas } from '@/components/design/Canvas';
import { PropertiesPanel } from '@/components/design/PropertiesPanel';
import { toast } from '@/hooks/use-toast';
import { useAutoSave, hasSavedData, loadSavedData, clearSavedData } from '@/hooks/use-auto-save';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const [pages, setPages] = useState<Page[]>([createDefaultPage()]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [canvasPreset, setCanvasPreset] = useState<CanvasPreset>(DEFAULT_PRESET);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { status: saveStatus, saveNow } = useAutoSave(pages, canvasPreset.id);

  // Check for saved data on mount
  useEffect(() => {
    if (hasSavedData()) {
      setShowRestoreDialog(true);
    }
  }, []);

  const handleRestore = useCallback(() => {
    const data = loadSavedData();
    if (data) {
      setPages(data.pages);
      const preset = CANVAS_PRESETS.find(p => p.id === data.canvasPresetId);
      if (preset) setCanvasPreset(preset);
      setCurrentPageIndex(0);
      setSelectedId(null);
      setEditingId(null);
      toast({ title: '복원 완료', description: '이전 작업이 복원되었습니다.' });
    }
    setShowRestoreDialog(false);
  }, []);

  const handleDismissRestore = useCallback(() => {
    clearSavedData();
    setShowRestoreDialog(false);
  }, []);

  const handleManualSave = useCallback(() => {
    saveNow();
    toast({ title: '저장되었습니다', description: '현재 작업이 저장되었습니다.' });
  }, [saveNow]);

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

    // Auto-switch canvas preset if template specifies one
    const presetId = getTemplatePresetId(templateId);
    if (presetId) {
      const preset = CANVAS_PRESETS.find(p => p.id === presetId);
      if (preset) setCanvasPreset(preset);
    }

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
        saveStatus={saveStatus}
        onManualSave={handleManualSave}
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
          canvasPreset={canvasPreset}
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

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이전 작업 복원</AlertDialogTitle>
            <AlertDialogDescription>
              이전에 작업하던 내용이 있습니다. 복원하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismissRestore}>새로 시작</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>복원하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
