import { useState, useCallback, useRef, useEffect } from 'react';
import type { Page, DesignElement, CanvasPreset, Position, Size } from '@/types/design';
import { createDefaultPage, createTextElement, createShapeElement, createImageElement, createId, DEFAULT_PRESET, CANVAS_PRESETS } from '@/types/design';
import { getTemplatePages, getTemplatePresetId } from '@/lib/templates';
import { Toolbar, StatusBar } from '@/components/design/Toolbar';
import { PageSidebar } from '@/components/design/PageSidebar';
import { Canvas, type CanvasHandle } from '@/components/design/Canvas';
import { exportAsPng, exportAsPdf } from '@/lib/export-canvas';
import { PropertiesPanel } from '@/components/design/PropertiesPanel';
import { toast } from '@/hooks/use-toast';
import { useAutoSave, hasSavedData, loadSavedData, clearSavedData } from '@/hooks/use-auto-save';
import { alignElements, type AlignAction } from '@/components/design/AlignmentGuides';

// When a text element's height changes, adjust sibling elements in the same card
function syncLayoutAfterResize(
  elements: DesignElement[],
  changedId: string,
  oldHeight: number,
  newHeight: number
): DesignElement[] {
  const delta = newHeight - oldHeight;
  if (Math.abs(delta) < 1) return elements;

  const changed = elements.find(e => e.id === changedId);
  if (!changed) return elements;

  const parentCard = elements.find(e =>
    e.type === 'shape' &&
    e.id !== changedId &&
    (e.shapeStyle?.borderRadius ?? 0) > 0 &&
    e.position.x <= changed.position.x &&
    e.position.y <= changed.position.y &&
    e.position.x + e.size.width >= changed.position.x + changed.size.width &&
    e.position.y + e.size.height >= changed.position.y + oldHeight
  );

  if (!parentCard) return elements;

  const changedOldBottom = changed.position.y + oldHeight;
  const cardOriginalBottom = parentCard.position.y + parentCard.size.height;

  return elements.map(e => {
    if (e.id === changedId) return e;
    if (e.id === parentCard.id) {
      return { ...e, size: { ...e.size, height: e.size.height + delta } };
    }
    const isInsideCard =
      e.position.x >= parentCard.position.x &&
      e.position.x < parentCard.position.x + parentCard.size.width &&
      e.position.y >= changedOldBottom &&
      e.position.y < cardOriginalBottom;
    if (isInsideCard) {
      return { ...e, position: { ...e.position, y: e.position.y + delta } };
    }
    if (e.position.y >= cardOriginalBottom) {
      return { ...e, position: { ...e.position, y: e.position.y + delta } };
    }
    if (
      e.type === 'image' &&
      e.position.x < parentCard.position.x &&
      e.position.y < cardOriginalBottom &&
      e.position.y + e.size.height >= cardOriginalBottom - 10
    ) {
      return { ...e, size: { ...e.size, height: e.size.height + delta } };
    }
    return e;
  });
}

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

const MAX_HISTORY = 50;

function waitForExportRender() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

const Index = () => {
  const [pages, setPages] = useState<Page[]>(() => {
    const tplPages = getTemplatePages('basic-usp');
    return tplPages.length > 0 ? tplPages : [createDefaultPage()];
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [canvasPreset, setCanvasPreset] = useState<CanvasPreset>(DEFAULT_PRESET);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [scale, setScale] = useState(0.5);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<CanvasHandle>(null);
  const activeEditRef = useRef<HTMLElement | null>(null);

  // Undo/Redo history
  const historyRef = useRef<Page[][]>([]);
  const pointerRef = useRef(-1);
  const skipPush = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = useCallback((newPages: Page[]) => {
    if (skipPush.current) {
      skipPush.current = false;
      return;
    }
    const h = historyRef.current;
    historyRef.current = h.slice(0, pointerRef.current + 1);
    historyRef.current.push(JSON.parse(JSON.stringify(newPages)));
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
    pointerRef.current = historyRef.current.length - 1;
    setCanUndo(pointerRef.current > 0);
    setCanRedo(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (pointerRef.current <= 0) return;
    pointerRef.current--;
    skipPush.current = true;
    const restored = JSON.parse(JSON.stringify(historyRef.current[pointerRef.current]));
    setPages(restored);
    setCanUndo(pointerRef.current > 0);
    setCanRedo(true);
  }, []);

  const handleRedo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    pointerRef.current++;
    skipPush.current = true;
    const restored = JSON.parse(JSON.stringify(historyRef.current[pointerRef.current]));
    setPages(restored);
    setCanUndo(true);
    setCanRedo(pointerRef.current < historyRef.current.length - 1);
  }, []);

  useEffect(() => {
    pushHistory(pages);
  }, [pages, pushHistory]);

  const { status: saveStatus, saveNow } = useAutoSave(pages, canvasPreset.id);

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
      setSelectedIds([]);
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
  const selectedElement = selectedIds.length === 1
    ? (currentPage?.elements.find(e => e.id === selectedIds[0]) ?? null)
    : null;

  const updatePage = useCallback((index: number, updater: (page: Page) => Page) => {
    setPages(prev => prev.map((p, i) => i === index ? updater(p) : p));
  }, []);

  const handleUpdateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    updatePage(currentPageIndex, page => {
      const oldEl = page.elements.find(e => e.id === id);
      let newElements = page.elements.map(e => e.id === id ? { ...e, ...updates } as DesignElement : e);

      if (
        oldEl?.type === 'text' &&
        updates.size &&
        updates.size.height !== oldEl.size.height
      ) {
        newElements = syncLayoutAfterResize(
          newElements, id, oldEl.size.height, updates.size.height
        );
      }

      return { ...page, elements: newElements };
    });
  }, [currentPageIndex, updatePage]);

  const handleMoveSelected = useCallback((dx: number, dy: number) => {
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: page.elements.map(e => {
        if (!selectedIds.includes(e.id) || e.locked || e.pinToBottom) return e;
        const newY = Math.round(e.position.y + dy);
        const clampedY = Math.min(newY, canvasPreset.height - e.size.height);
        return {
          ...e,
          position: {
            x: Math.round(e.position.x + dx),
            y: Math.max(0, clampedY),
          },
        };
      }),
    }));
  }, [currentPageIndex, selectedIds, updatePage, canvasPreset.height]);

  const handleDeleteElement = useCallback((id: string) => {
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: page.elements.filter(e => e.id !== id),
    }));
    setSelectedIds(prev => prev.filter(sid => sid !== id));
  }, [currentPageIndex, updatePage]);

  // handleSelectElement is defined below with group awareness

  const handleAddText = useCallback(() => {
    const el = createTextElement();
    updatePage(currentPageIndex, page => ({ ...page, elements: [...page.elements, el] }));
    setSelectedIds([el.id]);
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
    setSelectedIds([el.id]);
  }, [currentPageIndex, updatePage]);

  const handleAddImage = useCallback(() => {
    // 이미지 요소를 추가하면 캔버스에 클립보드 붙여넣기 존이 나타남
    const el = createImageElement('');
    updatePage(currentPageIndex, page => ({ ...page, elements: [...page.elements, el] }));
    setSelectedIds([el.id]);
  }, [currentPageIndex, updatePage]);

  const handleApplyTemplate = useCallback((templateId: string) => {
    const templatePages = getTemplatePages(templateId);
    if (templatePages.length === 0) return;

    const presetId = getTemplatePresetId(templateId);
    if (presetId) {
      const preset = CANVAS_PRESETS.find(p => p.id === presetId);
      if (preset) setCanvasPreset(preset);
    }

    updatePage(currentPageIndex, () => templatePages[0]);

    if (templatePages.length > 1) {
      setPages(prev => {
        const newPages = [...prev];
        for (let i = 1; i < templatePages.length; i++) {
          newPages.splice(currentPageIndex + i, 0, templatePages[i]);
        }
        return newPages;
      });
    }

    setSelectedIds([]);
    setEditingId(null);
    toast({ title: '템플릿 적용 완료', description: '텍스트를 더블클릭하여 편집하세요.' });
  }, [currentPageIndex, updatePage]);

  const handleAddPage = useCallback(() => {
    setPages(prev => [...prev, createDefaultPage()]);
    setCurrentPageIndex(pages.length);
    setSelectedIds([]);
  }, [pages.length]);

  const handleDeletePage = useCallback((index: number) => {
    if (pages.length <= 1) return;
    setPages(prev => prev.filter((_, i) => i !== index));
    setCurrentPageIndex(prev => Math.min(prev, pages.length - 2));
    setSelectedIds([]);
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

  const handleAlign = useCallback((action: AlignAction) => {
    if (selectedIds.length < 2) return;
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: alignElements(page.elements, selectedIds, action),
    }));
  }, [selectedIds, currentPageIndex, updatePage]);

  const runExport = useCallback(async (format: 'png' | 'pdf') => {
    const el = canvasRef.current?.getCanvasElement();
    if (!el || isExporting) return;

    activeEditRef.current?.blur();
    handleFinishEditing();
    setIsExporting(true);
    await waitForExportRender();

    try {
      toast({
        title: '내보내기 중...',
        description: format === 'png' ? 'PNG 파일을 생성하고 있습니다.' : 'PDF 파일을 생성하고 있습니다.',
      });

      if (format === 'png') {
        await exportAsPng(el, canvasPreset.width, canvasPreset.height);
      } else {
        await exportAsPdf(el, canvasPreset.width, canvasPreset.height);
      }
    } catch (error) {
      toast({
        title: '내보내기 중단',
        description: error instanceof Error ? error.message : '내보내기에 실패했습니다.',
      });
    } finally {
      setIsExporting(false);
    }
  }, [canvasPreset.height, canvasPreset.width, handleFinishEditing, isExporting]);

  const handleExportPng = useCallback(async () => {
    await runExport('png');
  }, [runExport]);

  const handleExportPdf = useCallback(async () => {
    await runExport('pdf');
  }, [runExport]);

  // Clipboard for copy/paste
  const clipboardRef = useRef<DesignElement[]>([]);

  const handleCopy = useCallback(() => {
    if (selectedIds.length === 0 || editingId) return;
    const els = currentPage.elements.filter(e => selectedIds.includes(e.id));
    clipboardRef.current = JSON.parse(JSON.stringify(els));
  }, [selectedIds, editingId, currentPage]);

  const handlePaste = useCallback(() => {
    if (clipboardRef.current.length === 0) return;
    const newEls = clipboardRef.current.map(el => ({
      ...JSON.parse(JSON.stringify(el)),
      id: createId(),
      position: { x: el.position.x + 20, y: el.position.y + 20 },
    }));
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: [...page.elements, ...newEls],
    }));
    setSelectedIds(newEls.map(e => e.id));
  }, [currentPageIndex, updatePage]);

  const handleDuplicate = useCallback(() => {
    if (selectedIds.length === 0 || editingId) return;
    const els = currentPage.elements.filter(e => selectedIds.includes(e.id));
    const newEls = els.map(el => ({
      ...JSON.parse(JSON.stringify(el)),
      id: createId(),
      position: { x: el.position.x + 20, y: el.position.y + 20 },
    }));
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: [...page.elements, ...newEls],
    }));
    setSelectedIds(newEls.map(e => e.id));
  }, [selectedIds, editingId, currentPage, currentPageIndex, updatePage]);

  // Group / Ungroup
  const handleGroup = useCallback(() => {
    if (selectedIds.length < 2) return;
    const gid = createId();
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: page.elements.map(e =>
        selectedIds.includes(e.id) ? { ...e, groupId: gid } : e
      ),
    }));
    toast({ title: '그룹화 완료', description: `${selectedIds.length}개 요소가 그룹화되었습니다.` });
  }, [selectedIds, currentPageIndex, updatePage]);

  const handleUngroup = useCallback(() => {
    if (selectedIds.length === 0) return;
    const groupIds = new Set(
      currentPage.elements
        .filter(e => selectedIds.includes(e.id) && e.groupId)
        .map(e => e.groupId!)
    );
    if (groupIds.size === 0) return;
    updatePage(currentPageIndex, page => ({
      ...page,
      elements: page.elements.map(e =>
        e.groupId && groupIds.has(e.groupId) ? { ...e, groupId: undefined } : e
      ),
    }));
    toast({ title: '그룹 해제 완료' });
  }, [selectedIds, currentPage, currentPageIndex, updatePage]);

  // Marquee select handler
  const handleMarqueeSelect = useCallback((ids: string[], additive: boolean) => {
    if (additive) {
      setSelectedIds(prev => {
        const set = new Set(prev);
        ids.forEach(id => set.add(id));
        return Array.from(set);
      });
    } else {
      setSelectedIds(ids);
    }
  }, []);

  // Select element with group awareness
  const handleSelectElement = useCallback((id: string | null, additive?: boolean) => {
    if (!id) {
      setSelectedIds([]);
      return;
    }
    // If element is in a group and not additive, select whole group
    const el = currentPage?.elements.find(e => e.id === id);
    if (el?.groupId && !additive) {
      const groupMembers = currentPage.elements
        .filter(e => e.groupId === el.groupId)
        .map(e => e.id);
      setSelectedIds(groupMembers);
      return;
    }
    if (additive) {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  }, [currentPage]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Undo: Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }
    // Redo: Ctrl+Shift+Z or Ctrl+Y
    if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || e.key === 'y') && (e.shiftKey || e.key === 'y')) {
      e.preventDefault();
      handleRedo();
      return;
    }
    // Copy: Ctrl+C
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !editingId) {
      e.preventDefault();
      handleCopy();
      return;
    }
    // Paste: Ctrl+V
    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !editingId) {
      e.preventDefault();
      handlePaste();
      return;
    }
    // Duplicate: Ctrl+D
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      handleDuplicate();
      return;
    }
    // Group: Ctrl+G
    if ((e.ctrlKey || e.metaKey) && e.key === 'g' && !e.shiftKey) {
      e.preventDefault();
      handleGroup();
      return;
    }
    // Ungroup: Ctrl+Shift+G
    if ((e.ctrlKey || e.metaKey) && e.key === 'G' && e.shiftKey) {
      e.preventDefault();
      handleUngroup();
      return;
    }
    if (editingId) return;

    // Delete selected
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
      selectedIds.forEach(id => handleDeleteElement(id));
      return;
    }

    // Arrow keys: move selected elements
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedIds.length > 0) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp') dy = -step;
      if (e.key === 'ArrowDown') dy = step;
      if (e.key === 'ArrowLeft') dx = -step;
      if (e.key === 'ArrowRight') dx = step;
      handleMoveSelected(dx, dy);
    }
  }, [editingId, selectedIds, handleDeleteElement, handleUndo, handleRedo, handleMoveSelected, handleCopy, handlePaste, handleDuplicate, handleGroup, handleUngroup]);

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
        scale={scale}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        multiSelectCount={selectedIds.length}
        onAlign={handleAlign}
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        hasGroupInSelection={selectedIds.some(id => currentPage.elements.find(e => e.id === id)?.groupId)}
      />
      <div className="flex-1 flex overflow-hidden">
        <PageSidebar
          pages={pages}
          currentIndex={currentPageIndex}
          onSelectPage={i => { setCurrentPageIndex(i); setSelectedIds([]); setEditingId(null); }}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
        />
        <Canvas
          ref={canvasRef}
          page={currentPage}
          selectedIds={selectedIds}
          editingId={editingId}
          canvasPreset={canvasPreset}
          isExporting={isExporting}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          onMoveSelected={handleMoveSelected}
          onDoubleClickElement={handleDoubleClick}
          onTextChange={handleTextChange}
          onFinishEditing={handleFinishEditing}
          onScaleChange={setScale}
          onMarqueeSelect={handleMarqueeSelect}
          activeEditRef={activeEditRef}
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
          activeEditRef={activeEditRef}
        />
      </div>
      {/* PPT 스타일 하단 상태바 — 줌 컨트롤 오른쪽 하단 배치 */}
      <StatusBar
        scale={scale}
        onZoomIn={() => canvasRef.current?.zoomIn()}
        onZoomOut={() => canvasRef.current?.zoomOut()}
        onFitToScreen={() => canvasRef.current?.fitToScreen()}
      />
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
