import { type Template, type Page, createId } from '@/types/design';

export const TEMPLATES: Template[] = [
  // ─── 기본 (세일즈톡) ───
  {
    id: 'basic-usp',
    category: 'basic',
    name: '특장점',
    description: '레퍼런스형 USP 4단 구성 (16:9)',
    thumbnail: '⭐',
    presetId: '16:9',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(41 43% 94%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 78 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 100%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 0, y: 77 }, size: { width: 1920, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 82%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },

          {
            id: createId(), type: 'text', position: { x: 34, y: 16 }, size: { width: 260, height: 30 },
            rotation: 0, locked: false, text: '사용된 컬러',
            textStyle: { fontSize: 18, fontWeight: 500, color: 'hsl(116 56% 39%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 28, y: 44 }, size: { width: 22, height: 22 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 58, y: 44 }, size: { width: 22, height: 22 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(41 43% 94%)', borderRadius: 999, borderWidth: 1, borderColor: 'hsl(0 0% 85%)', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 88, y: 42 }, size: { width: 220, height: 26 },
            rotation: 0, locked: false, text: '스포이드로 찍어 활용하세요~',
            textStyle: { fontSize: 16, fontWeight: 400, color: 'hsl(116 56% 39%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },

          {
            id: createId(), type: 'shape', position: { x: 876, y: 14 }, size: { width: 42, height: 58 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'transparent', borderRadius: 999, borderWidth: 2, borderColor: 'hsl(0 0% 35%)', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 889, y: 24 }, size: { width: 16, height: 24 },
            rotation: 0, locked: false, text: '2',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 20%)', textAlign: 'center', lineHeight: 1.1, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 891, y: 36 }, size: { width: 12, height: 24 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'transparent', borderRadius: 2, borderWidth: 2, borderColor: 'hsl(0 0% 20%)', opacity: 1 },
          },

          {
            id: createId(), type: 'text', position: { x: 1010, y: 20 }, size: { width: 170, height: 42 },
            rotation: 0, locked: false, text: '제품명',
            textStyle: { fontSize: 34, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'right', lineHeight: 1.2, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1192, y: 20 }, size: { width: 520, height: 42 },
            rotation: 0, locked: false, text: '신제품 특장점',
            textStyle: { fontSize: 34, fontWeight: 700, color: 'hsl(0 0% 8%)', textAlign: 'left', lineHeight: 1.2, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 1726, y: 0 }, size: { width: 194, height: 78 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 27%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 1752, y: 12 }, size: { width: 78, height: 32 },
            rotation: 0, locked: false, text: '기본',
            textStyle: { fontSize: 32, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'left', lineHeight: 1.1, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1830, y: 16 }, size: { width: 74, height: 24 },
            rotation: 0, locked: false, text: '24.01.23',
            textStyle: { fontSize: 12, fontWeight: 500, color: 'hsl(0 0% 100%)', textAlign: 'right', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 1738, y: 48 }, size: { width: 14, height: 14 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(39 100% 50%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 1760, y: 45 }, size: { width: 146, height: 22 },
            rotation: 0, locked: false, text: '세일즈커뮤니케이션팀',
            textStyle: { fontSize: 12, fontWeight: 500, color: 'hsl(0 0% 100%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },

          {
            id: createId(), type: 'text', position: { x: 110, y: 120 }, size: { width: 140, height: 24 },
            rotation: 0, locked: false, text: '정면 사진',
            textStyle: { fontSize: 16, fontWeight: 500, color: 'hsl(116 56% 39%)', textAlign: 'center', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 266, y: 116 }, size: { width: 184, height: 42 },
            rotation: 0, locked: false, text: '측면, 도어 오픈 등\n다른 각도의 사진',
            textStyle: { fontSize: 16, fontWeight: 500, color: 'hsl(116 56% 39%)', textAlign: 'center', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 92, y: 156 }, size: { width: 116, height: 372 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'transparent', borderRadius: 0, borderWidth: 2, borderColor: 'hsl(116 56% 39%)', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 244, y: 156 }, size: { width: 158, height: 372 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'transparent', borderRadius: 0, borderWidth: 2, borderColor: 'hsl(116 56% 39%)', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 106, y: 172 }, size: { width: 88, height: 336 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 36%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 120, y: 178 }, size: { width: 12, height: 320 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 15%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 258, y: 172 }, size: { width: 130, height: 336 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 84%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 268, y: 184 }, size: { width: 110, height: 118 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 45%)', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 318, y: 194 }, size: { width: 8, height: 84 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 100%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 240, y: 186 }, size: { width: 24, height: 24 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 246, y: 189 }, size: { width: 12, height: 16 },
            rotation: 0, locked: false, text: '1',
            textStyle: { fontSize: 13, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.2, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 333, y: 420 }, size: { width: 24, height: 24 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 339, y: 423 }, size: { width: 12, height: 16 },
            rotation: 0, locked: false, text: '2',
            textStyle: { fontSize: 13, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.2, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 56, y: 390 }, size: { width: 180, height: 90 },
            rotation: 0, locked: false, text: '#FD312E\n#F7F3EB',
            textStyle: { fontSize: 24, fontWeight: 500, color: 'hsl(0 0% 14%)', textAlign: 'left', lineHeight: 1.45, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 166, y: 540 }, size: { width: 186, height: 28 },
            rotation: 0, locked: false, text: '상세 이미지가 필요한 USP 부분 표시',
            textStyle: { fontSize: 14, fontWeight: 500, color: 'hsl(116 56% 39%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 290, y: 524 }, size: { width: 54, height: 2 },
            rotation: 325, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(116 56% 39%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },

          {
            id: createId(), type: 'shape', position: { x: 30, y: 618 }, size: { width: 406, height: 214 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'transparent', borderRadius: 0, borderWidth: 2, borderColor: 'hsl(116 56% 39%)', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 50, y: 638 }, size: { width: 162, height: 164 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 82%)', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 226, y: 638 }, size: { width: 162, height: 164 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 90%)', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 72, y: 662 }, size: { width: 118, height: 14 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 35%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 90, y: 676 }, size: { width: 8, height: 92 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 100%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 120, y: 676 }, size: { width: 8, height: 92 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 100%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 150, y: 676 }, size: { width: 8, height: 92 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 100%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 244, y: 652 }, size: { width: 126, height: 136 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(32 55% 89%)', borderRadius: 10, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 270, y: 662 }, size: { width: 72, height: 110 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(35 42% 80%)', borderRadius: 12, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 243, y: 796 }, size: { width: 24, height: 24 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 249, y: 799 }, size: { width: 12, height: 16 },
            rotation: 0, locked: false, text: '1',
            textStyle: { fontSize: 13, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.2, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 282, y: 796 }, size: { width: 24, height: 24 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 288, y: 799 }, size: { width: 12, height: 16 },
            rotation: 0, locked: false, text: '2',
            textStyle: { fontSize: 13, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.2, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 52, y: 838 }, size: { width: 160, height: 28 },
            rotation: 0, locked: false, text: '① 다이내믹 무빙행어',
            textStyle: { fontSize: 16, fontWeight: 500, color: 'hsl(0 0% 18%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 220, y: 838 }, size: { width: 170, height: 28 },
            rotation: 0, locked: false, text: '② 빌트인 고압 스티머',
            textStyle: { fontSize: 16, fontWeight: 500, color: 'hsl(0 0% 18%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 150, y: 874 }, size: { width: 166, height: 24 },
            rotation: 0, locked: false, text: 'USP 세부 이미지',
            textStyle: { fontSize: 18, fontWeight: 500, color: 'hsl(116 56% 39%)', textAlign: 'center', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 44, y: 906 }, size: { width: 382, height: 46 },
            rotation: 0, locked: false, text: '*새로운 특장점 중, 시각화하며 효과적인 USP를 이미지로 보여줌\n(신규 USP를 모두 넣을 필요는 없음. 이미지가 필수인 USP만)',
            textStyle: { fontSize: 14, fontWeight: 400, color: 'hsl(116 56% 39%)', textAlign: 'left', lineHeight: 1.35, fontFamily: 'LG EI Text' },
          },

          {
            id: createId(), type: 'shape', position: { x: 540, y: 148 }, size: { width: 130, height: 44 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 8, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 540, y: 155 }, size: { width: 130, height: 30 },
            rotation: 0, locked: false, text: '카테고리1',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 690, y: 148 }, size: { width: 700, height: 42 },
            rotation: 0, locked: false, text: '특징을 설명하고 베네핏을 담은 표현',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1388, y: 148 }, size: { width: 222, height: 42 },
            rotation: 0, locked: false, text: '‘USP명1’',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 206 }, size: { width: 1330, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 208 }, size: { width: 1330, height: 118 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(37 41% 92%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 548, y: 234 }, size: { width: 56, height: 22 },
            rotation: 0, locked: false, text: 'NEW',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'left', lineHeight: 1.1, fontFamily: 'Cafe24 Boldface' },
          },
          {
            id: createId(), type: 'text', position: { x: 612, y: 230 }, size: { width: 174, height: 32 },
            rotation: 0, locked: false, text: 'USP명 1',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 784, y: 226 }, size: { width: 980, height: 58 },
            rotation: 0, locked: false, text: '해당 기능을 설명할 수 있는 상세 설명을 담아주세요\n최대 3줄 폰트는 LG EI Text TTF Regular 12',
            textStyle: { fontSize: 18, fontWeight: 400, color: 'hsl(0 0% 28%)', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          {
            id: createId(), type: 'shape', position: { x: 540, y: 366 }, size: { width: 130, height: 44 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 8, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 540, y: 373 }, size: { width: 130, height: 30 },
            rotation: 0, locked: false, text: '탈취/살균',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 690, y: 366 }, size: { width: 720, height: 42 },
            rotation: 0, locked: false, text: '스팀 양을 조절해 섬세 의류도 손상 걱정 없이 산뜻하게',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1430, y: 366 }, size: { width: 372, height: 42 },
            rotation: 0, locked: false, text: '‘듀얼 히팅 트루스팀’',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 424 }, size: { width: 1330, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 426 }, size: { width: 1330, height: 118 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(37 41% 92%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 582, y: 450 }, size: { width: 150, height: 28 },
            rotation: 0, locked: false, text: '듀얼 히팅 트루스팀',
            textStyle: { fontSize: 17, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 784, y: 446 }, size: { width: 1010, height: 70 },
            rotation: 0, locked: false, text: '듀얼 히터가 만드는 진짜 듀얼 트루스팀이 의류에 맞게 스팀양을 조절해\n섬유 속 깊이 밴 생활 냄새까지 99% 제거하고, 유해세균부터 바이러스까지 케어',
            textStyle: { fontSize: 17, fontWeight: 400, color: 'hsl(0 0% 28%)', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          {
            id: createId(), type: 'shape', position: { x: 540, y: 580 }, size: { width: 130, height: 44 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 8, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 540, y: 587 }, size: { width: 130, height: 30 },
            rotation: 0, locked: false, text: '스타일링',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 690, y: 580 }, size: { width: 580, height: 42 },
            rotation: 0, locked: false, text: '외출 전 빠르고 단정하게',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1280, y: 580 }, size: { width: 404, height: 42 },
            rotation: 0, locked: false, text: '‘빌트인 고압 스티머’',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 638 }, size: { width: 1330, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 640 }, size: { width: 1330, height: 118 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(37 41% 92%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 548, y: 666 }, size: { width: 56, height: 22 },
            rotation: 0, locked: false, text: 'NEW',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'left', lineHeight: 1.1, fontFamily: 'Cafe24 Boldface' },
          },
          {
            id: createId(), type: 'text', position: { x: 612, y: 662 }, size: { width: 190, height: 30 },
            rotation: 0, locked: false, text: '빌트인 고압 스티머',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 804, y: 658 }, size: { width: 990, height: 72 },
            rotation: 0, locked: false, text: '외출 전 카라 끝, 소매도 빠르고 손쉽게 스타일링하고, 세탁소 고압 스티머 수준의 풍부한 스팀으로\n린넨 등 구김이 잘 펴지지 않는 소재도 깔끔하게 케어할 수 있음',
            textStyle: { fontSize: 17, fontWeight: 400, color: 'hsl(0 0% 28%)', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          {
            id: createId(), type: 'shape', position: { x: 540, y: 794 }, size: { width: 130, height: 44 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 8, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 540, y: 801 }, size: { width: 130, height: 30 },
            rotation: 0, locked: false, text: '편의',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 690, y: 794 }, size: { width: 610, height: 42 },
            rotation: 0, locked: false, text: '바로 꺼내지 않아도, 문을 열지 않아도 보송하게',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1320, y: 794 }, size: { width: 356, height: 42 },
            rotation: 0, locked: false, text: '‘자동 환기 시스템’',
            textStyle: { fontSize: 28, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 852 }, size: { width: 1330, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(3 98% 59%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 540, y: 854 }, size: { width: 1330, height: 118 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(37 41% 92%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 548, y: 880 }, size: { width: 56, height: 22 },
            rotation: 0, locked: false, text: 'NEW',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(3 98% 59%)', textAlign: 'left', lineHeight: 1.1, fontFamily: 'Cafe24 Boldface' },
          },
          {
            id: createId(), type: 'text', position: { x: 612, y: 876 }, size: { width: 174, height: 30 },
            rotation: 0, locked: false, text: '자동 환기 시스템',
            textStyle: { fontSize: 18, fontWeight: 700, color: 'hsl(0 0% 10%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 804, y: 872 }, size: { width: 990, height: 72 },
            rotation: 0, locked: false, text: '스타일러 안과 밖의 공기를 자동으로 순환해 문을 열지 않아도 알아서 케어하고\n코스가 끝난 후 바로 꺼내지 않아도 옷을 보송하게 보관할 수 있어 실내를 쾌적하게 유지',
            textStyle: { fontSize: 17, fontWeight: 400, color: 'hsl(0 0% 28%)', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          {
            id: createId(), type: 'text', position: { x: 24, y: 982 }, size: { width: 1868, height: 28 },
            rotation: 0, locked: false, text: '* 이미지, 문안, 날짜는 예시입니다. 실제 사용 시 제품 정보와 검수 완료 문안을 반영해주세요.',
            textStyle: { fontSize: 11, fontWeight: 400, color: 'hsl(0 0% 55%)', textAlign: 'left', lineHeight: 1.35, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 24, y: 1000 }, size: { width: 1868, height: 28 },
            rotation: 0, locked: false, text: '※ 상세 USP 설명은 2~3줄 이내로 운영하고, 이미지가 필요한 USP만 좌측 하단 상세 컷을 사용합니다.',
            textStyle: { fontSize: 11, fontWeight: 400, color: 'hsl(0 0% 55%)', textAlign: 'left', lineHeight: 1.35, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 0, y: 1032 }, size: { width: 1920, height: 48 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: 'hsl(0 0% 27%)', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 22, y: 1044 }, size: { width: 190, height: 22 },
            rotation: 0, locked: false, text: '사내교육용/대외비',
            textStyle: { fontSize: 14, fontWeight: 700, color: 'hsl(0 0% 100%)', textAlign: 'left', lineHeight: 1.2, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 254, y: 1043 }, size: { width: 1638, height: 22 },
            rotation: 0, locked: false, text: '본 자료는 내부 공유용으로만 사용하며 외부 배포를 금지합니다. 실제 배포 전 최종 검수를 진행해주세요.',
            textStyle: { fontSize: 12, fontWeight: 400, color: 'hsl(0 0% 92%)', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
        ],
        background: { type: 'solid', color: 'hsl(41 43% 94%)' },
      },
    ],
  },
  {
    id: 'basic-visual',
    category: 'basic',
    name: '비주얼톡',
    description: '키 비주얼 + Key Claim (16:9)',
    thumbnail: '🖼️',
    presetId: '16:9',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#F7F3EB', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 72 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#FFFFFF', borderRadius: 0, borderWidth: 0, borderColor: '#E9E9E9', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 48, y: 18 }, size: { width: 600, height: 36 },
            rotation: 0, locked: false, text: '비주얼톡',
            textStyle: { fontSize: 24, fontWeight: 700, color: '#595959', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 48, y: 112 }, size: { width: 1120, height: 920 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 12, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 48, y: 520 }, size: { width: 1120, height: 50 },
            rotation: 0, locked: false, text: '키 비주얼 이미지 영역',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#C8C8C8', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1220, y: 112 }, size: { width: 652, height: 60 },
            rotation: 0, locked: false, text: 'Key Claim',
            textStyle: { fontSize: 24, fontWeight: 700, color: '#FD312E', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 1220, y: 184 }, size: { width: 652, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 1220, y: 210 }, size: { width: 652, height: 200 },
            rotation: 0, locked: false, text: '핵심 메시지를 입력하세요.\n\n제품의 가장 강력한\n비주얼 포인트를 전달합니다.',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#595959', textAlign: 'left', lineHeight: 1.6, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1220, y: 440 }, size: { width: 652, height: 40 },
            rotation: 0, locked: false, text: '부가 설명 텍스트',
            textStyle: { fontSize: 12, fontWeight: 400, color: '#C8C8C8', textAlign: 'left', lineHeight: 1.6, fontFamily: 'LG EI Text' },
          },
        ],
        background: { type: 'solid', color: '#F7F3EB' },
      },
    ],
  },

  // ─── 이슈 (카드형) ───
  {
    id: 'issue-card-1',
    category: 'issueCard',
    name: '이슈 카드 1장',
    description: '이슈 포인트 + 데이터 + 결론',
    thumbnail: '🃏',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 100 }, size: { width: 920, height: 60 },
            rotation: 0, locked: false, text: 'ISSUE',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 170 }, size: { width: 920, height: 120 },
            rotation: 0, locked: false, text: '이슈 제목을\n입력하세요',
            textStyle: { fontSize: 56, fontWeight: 700, color: '#ffffff', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 320 }, size: { width: 920, height: 60 },
            rotation: 0, locked: false, text: '핵심 요약 1~2줄을 입력하세요',
            textStyle: { fontSize: 28, fontWeight: 400, color: '#94a3b8', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 420 }, size: { width: 920, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#ffffff', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 0.1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 460 }, size: { width: 920, height: 250 },
            rotation: 0, locked: false, text: '• 이슈 포인트\n• 데이터 / 수치\n• 한 줄 결론',
            textStyle: { fontSize: 32, fontWeight: 400, color: '#e2e8f0', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
    ],
  },
  {
    id: 'issue-card-3',
    category: 'issueCard',
    name: '이슈 카드 3장 세트',
    description: '포인트/영향/대응 3장 구성',
    thumbnail: '📇',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 50 },
            rotation: 0, locked: false, text: 'CARD 1 — 이슈 포인트',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 160 }, size: { width: 920, height: 300 },
            rotation: 0, locked: false, text: '• 이슈 포인트\n• 데이터 / 수치\n• 한 줄 결론',
            textStyle: { fontSize: 36, fontWeight: 400, color: '#ffffff', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 50 },
            rotation: 0, locked: false, text: 'CARD 2 — 영향도',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 160 }, size: { width: 920, height: 300 },
            rotation: 0, locked: false, text: '• 영향도 분석\n• 고객 Pain Point\n• 시나리오',
            textStyle: { fontSize: 36, fontWeight: 400, color: '#ffffff', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 50 },
            rotation: 0, locked: false, text: 'CARD 3 — 대응 요약',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 160 }, size: { width: 920, height: 300 },
            rotation: 0, locked: false, text: '• 대응 요약\n• 핵심 해결 키\n• 실행 계획',
            textStyle: { fontSize: 36, fontWeight: 400, color: '#ffffff', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
    ],
  },

  // ─── 이슈 (일반) ───
  {
    id: 'issue-default-overview',
    category: 'issueDefault',
    name: '이슈 개요',
    description: '배경/원인/영향 범위 정리',
    thumbnail: '📋',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 80 },
            rotation: 0, locked: false, text: '이슈 제목',
            textStyle: { fontSize: 52, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 180 }, size: { width: 120, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#e11d48', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 220 }, size: { width: 920, height: 700 },
            rotation: 0, locked: false, text: '■ 이슈 개요\n\n배경:\n\n원인:\n\n영향 범위:',
            textStyle: { fontSize: 32, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#ffffff' },
      },
    ],
  },
  {
    id: 'issue-default-analysis',
    category: 'issueDefault',
    name: '세부 분석 + 대응',
    description: '원인/고객/시장 분석 + 전략',
    thumbnail: '🔍',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 80 },
            rotation: 0, locked: false, text: '세부 분석',
            textStyle: { fontSize: 48, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 180 }, size: { width: 920, height: 500 },
            rotation: 0, locked: false, text: '1) 원인 분석\n2) 고객 영향\n3) 제품 영향\n4) 시장/경쟁 영향',
            textStyle: { fontSize: 32, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 720 }, size: { width: 920, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#e11d48', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 0.5 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 760 }, size: { width: 920, height: 400 },
            rotation: 0, locked: false, text: '■ 대응 전략\n• 단기 전략:\n• 중기 전략:\n• 장기 전략:\n\n■ 기대 효과\n• 개선 포인트:',
            textStyle: { fontSize: 30, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#ffffff' },
      },
    ],
  },

  // ─── 심화 ───
  {
    id: 'deep-cover',
    category: 'deep',
    name: '심화 표지',
    description: '문서 제목/버전/목차 표지',
    thumbnail: '📘',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#1e293b', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 8, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#3b82f6', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 300 }, size: { width: 920, height: 180 },
            rotation: 0, locked: false, text: '심화 콘텐츠\n문서 제목',
            textStyle: { fontSize: 64, fontWeight: 700, color: '#ffffff', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 510 }, size: { width: 200, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#3b82f6', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 550 }, size: { width: 920, height: 400 },
            rotation: 0, locked: false, text: '버전: v1.0\n작성일: 2025.01.01\n작성자:\n\n목차:\n1. 서론\n2. 본론\n3. 전략 제안\n4. 결론',
            textStyle: { fontSize: 28, fontWeight: 400, color: '#94a3b8', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#1e293b' },
      },
    ],
  },
  {
    id: 'deep-body',
    category: 'deep',
    name: '심화 본문',
    description: '서론/본론/전략/결론 구조',
    thumbnail: '📗',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 80 },
            rotation: 0, locked: false, text: '1. 서론',
            textStyle: { fontSize: 48, fontWeight: 700, color: '#1e293b', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 170 }, size: { width: 60, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#3b82f6', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 210 }, size: { width: 920, height: 900 },
            rotation: 0, locked: false, text: '배경:\n\n문제 정의:\n\n\n2. 본론\n\n2-1. 분석\n2-2. 데이터/도표/사례\n2-3. 핵심 인사이트\n\n\n3. 전략 제안\n• 전략 1:\n• 전략 2:\n• 전략 3:\n\n\n4. 결론\n• 전체 요약\n• 실행 시나리오\n• 기대효과',
            textStyle: { fontSize: 28, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#ffffff' },
      },
    ],
  },
];

export function getTemplatePages(templateId: string): Page[] {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return [];
  return JSON.parse(JSON.stringify(template.pages)).map((p: Page) => ({
    ...p,
    id: createId(),
    elements: p.elements.map((e: any) => ({ ...e, id: createId() })),
  }));
}

export function getTemplatePresetId(templateId: string): string | undefined {
  const template = TEMPLATES.find(t => t.id === templateId);
  return template?.presetId;
}
