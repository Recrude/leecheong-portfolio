$(function() {
    // 서브 메뉴 동작
    $('.submenu-btn').on('click', function() {
        var target = $(this).data('target');
        // 버튼 active 처리
        $('.submenu-btn').removeClass('active');
        $(this).addClass('active');
        // 섹션 표시/숨김
        $('.submenu-content').hide();
        $('#' + target).show();
    });

    // 페이지 진입 시 PHOTOS가 먼저 보이도록 강제
    $('.submenu-btn[data-target="photos-section"]').addClass('active');
    $('.submenu-btn[data-target="books-section"]').removeClass('active');
    $('#photos-section').show();
    $('#books-section').hide();
});

document.addEventListener('DOMContentLoaded', () => {
    // 모든 프로젝트를 위한 이미지 폴더 매핑
    const projectFolders = {
        'glass-eye': 'glass-eye',
        'the-faceless': 'the-faceless',
        'shade-of-blue': 'shade-of-blue',
        'imperfect-jeonju': 'imperfect-jeonju',
        'glass-eye-book': 'glass-eye',
        'shade-of-blue-book': 'shade-of-blue'
    };

    // 이미지 형식 매핑
    const imageFormat = {
        'glass-eye': 'webp',
        'the-faceless': 'webp',
        'shade-of-blue': 'webp',
        'imperfect-jeonju': 'webp',
        'glass-eye-book': 'jpg',
        'shade-of-blue-book': 'jpg'
    };

    // 이미지 기본 경로 매핑
    const imagePath = {
        'glass-eye': '/src/images/webp/',
        'the-faceless': '/src/images/webp/',
        'shade-of-blue': '/src/images/webp/',
        'imperfect-jeonju': '/src/images/webp/',
        'glass-eye-book': '/src/images/jpg/books/',
        'shade-of-blue-book': '/src/images/jpg/books/'
    };

    // 각 프로젝트별 이미지 목록을 저장할 객체
    const projectImages = {};
    
    // 각 프로젝트별 현재 인덱스와 로드된 이미지 수 추적
    const projectState = {};
    
    // 각 프로젝트 슬라이더 초기화
    Object.keys(projectFolders).forEach(project => {
        // 초기에는 빈 배열로 설정
        projectImages[project] = [];
        projectState[project] = {
            currentIndex: 0,
            loadedImages: 0,
            validImageIndices: [] // 유효한 이미지 인덱스를 저장할 배열
        };
        
        // 이미지 목록 구성 및 슬라이더 초기화
        loadImagesForProject(project);
    });

    // 프로젝트별 이미지 로드 함수
    function loadImagesForProject(projectId) {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${projectId}"]`);
        if (!galleryCol) return;
        
        const sliderContainer = galleryCol.querySelector('.slider-container');
        const prevBtn = galleryCol.querySelector('.prev-btn');
        const nextBtn = galleryCol.querySelector('.next-btn');
        
        if (!sliderContainer || !prevBtn || !nextBtn) return;
        
        // 이미지 배열
        let imagePaths = [];
        
        // 비연속적인 이미지 파일 번호 처리를 위한 설정
        const imageNumbers = {
            'glass-eye': [1, 3, 6, 8, 9, 10, 11, 12, 15, 17, 18, 21, 22, 27, 28, 29, 31, 32, 33, 34, 37, 39, 41, 43, 44, 49, 53, 54, 55, 56, 58, 59, 60, 63, 65, 66, 70, 75, 76, 77, 80, 81, 82, 85, 86, 87, 91, 92, 96, 97, 100, 102, 103, 105, 106, 107, 109, 110, 113, 117, 120, 123, 124, 127, 130, 131, 133, 134, 135, 137, 138, 141, 145, 148, 151, 152, 155, 158, 161, 162, 163, 165, 166, 168, 169, 173, 176, 179, 183, 186, 189, 190, 191, 193, 194, 196, 197, 199, 201, 202],
            'the-faceless': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
            'shade-of-blue': Array.from({length: 30}, (_, i) => i + 1),
            'imperfect-jeonju': Array.from({length: 20}, (_, i) => i + 1),
            'glass-eye-book': Array.from({length: 8}, (_, i) => i + 1),
            'shade-of-blue-book': Array.from({length: 6}, (_, i) => i + 1)
        };
        
        // 이미지 경로 생성
        if (projectId.includes('book')) {
            // books 섹션은 jpg 파일 사용, 파일명 형식이 다름
            imageNumbers[projectId].forEach(num => {
                imagePaths.push(`${imagePath[projectId]}${projectFolders[projectId]}/${projectFolders[projectId]}-${num.toString().padStart(2, '0')}-min.${imageFormat[projectId]}`);
            });
        } else {
            // photos 섹션은 webp 파일 사용
            imageNumbers[projectId].forEach(num => {
                imagePaths.push(`${imagePath[projectId]}${projectFolders[projectId]}/${projectFolders[projectId]}_${num}-min.${imageFormat[projectId]}`);
            });
        }
        
        // photos 섹션만 이미지 배열 섞기
        if (!projectId.includes('book')) {
            imagePaths = shuffleArray(imagePaths);
        }
        // books 섹션은 순서대로 표시
        
        // 프로젝트 이미지 목록에 저장
        projectImages[projectId] = imagePaths;
        
        // 이미지 로드 - books는 모두 로드, photos는 최초 8개만 로드
        const initialLoadCount = projectId.includes('book') ? imagePaths.length : 8;
        loadMoreImages(projectId, initialLoadCount);
        
        // 이전 이미지 버튼 클릭 이벤트
        prevBtn.addEventListener('click', function() {
            navigateTo(projectId, 'prev');
        });

        // 다음 이미지 버튼 클릭 이벤트
        nextBtn.addEventListener('click', function() {
            navigateTo(projectId, 'next');
        });
    }
    
    // 이미지 네비게이션 함수
    function navigateTo(projectId, direction) {
        const validIndices = projectState[projectId].validImageIndices;
        if (validIndices.length === 0) return;
        
        const currentIndex = projectState[projectId].currentIndex;
        const currentValidIndex = validIndices.indexOf(currentIndex);
        
        if (currentValidIndex === -1) {
            // 유효한 인덱스 목록에 현재 인덱스가 없는 경우, 첫 번째 이미지로 이동
            projectState[projectId].currentIndex = validIndices[0];
        } else if (direction === 'next' && currentValidIndex < validIndices.length - 1) {
            // 다음 유효한 이미지로 이동
            projectState[projectId].currentIndex = validIndices[currentValidIndex + 1];
            
            // 끝에 가까워지면 더 많은 이미지 로드 (books 섹션은 이미 모두 로드됨)
            if (!projectId.includes('book') && currentValidIndex >= validIndices.length - 3) {
                loadMoreImages(projectId, 5);
            }
        } else if (direction === 'prev' && currentValidIndex > 0) {
            // 이전 유효한 이미지로 이동
            projectState[projectId].currentIndex = validIndices[currentValidIndex - 1];
        }
        
        updateSlider(projectId);
    }
    
    // 이미지 로드 함수
    function loadMoreImages(projectId, count) {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${projectId}"]`);
        if (!galleryCol) return;
        
        const sliderContainer = galleryCol.querySelector('.slider-container');
        if (!sliderContainer) return;
        
        const currentLoadedCount = sliderContainer.children.length;
        const projectImageList = projectImages[projectId];
        let imagesAdded = 0;
        let successfullyLoaded = 0;
        
        // 이미지 로드 상태 추적을 위한 프로미스 배열
        const loadPromises = [];
        
        // 아직 로드되지 않은 이미지 중에서 count만큼 로드
        for (let i = 0; i < count; i++) {
            const index = currentLoadedCount + i;
            if (index < projectImageList.length) {
                const img = document.createElement('img');
                img.alt = `${projectId} image ${index + 1}`;
                img.loading = 'lazy'; // 지연 로딩 적용
                img.dataset.index = index; // 이미지 인덱스 저장
                
                // 모든 이미지 초기에 숨김
                img.style.display = 'none';
                
                // 이미지 로드 상태 추적을 위한 프로미스
                const loadPromise = new Promise((resolve, reject) => {
                    img.onload = function() {
                        // 이미지 로드 성공
                        successfullyLoaded++;
                        // 유효한 이미지 인덱스 배열에 추가
                        projectState[projectId].validImageIndices.push(index);
                        projectState[projectId].validImageIndices.sort((a, b) => a - b);
                        resolve(img);
                    };
                    
                    img.onerror = function() {
                        // 이미지 로드 실패 - 이 이미지는 사용하지 않음
                        console.error(`Failed to load image: ${projectImageList[index]}`);
                        reject(new Error(`Failed to load image: ${projectImageList[index]}`));
                    };
                });
                
                // 이미지 로딩 시작
                img.src = projectImageList[index];
                
                // 슬라이더에 이미지 추가
                sliderContainer.appendChild(img);
                imagesAdded++;
                
                // 프로미스 배열에 추가
                loadPromises.push(loadPromise.catch(() => {
                    // 오류 발생 시 DOM에서 이미지 제거
                    if (img.parentNode) {
                        img.parentNode.removeChild(img);
                        imagesAdded--;
                    }
                    return null; // 이 프로미스는 실패해도 Promise.all이 실패하지 않도록 null 반환
                }));
            }
        }
        
        // 모든 이미지 로드 완료 후 처리
        Promise.all(loadPromises).then(() => {
            // 로드된 이미지 수 업데이트
            projectState[projectId].loadedImages = currentLoadedCount + imagesAdded;
            
            // 유효한 이미지가 있고 아직 표시된 이미지가 없는 경우 첫 번째 이미지 표시
            if (projectState[projectId].validImageIndices.length > 0 && 
                (currentLoadedCount === 0 || projectState[projectId].currentIndex === 0)) {
                projectState[projectId].currentIndex = projectState[projectId].validImageIndices[0];
                updateSlider(projectId);
            }
            
            console.log(`${projectId}: ${successfullyLoaded}/${count} images loaded successfully`);
        });
    }
    
    // 슬라이더 업데이트 함수
    function updateSlider(projectId) {
        const galleryCol = document.querySelector(`.project-gallery-col[data-project="${projectId}"]`);
        if (!galleryCol) return;
        
        const sliderContainer = galleryCol.querySelector('.slider-container');
        if (!sliderContainer) return;
        
        const images = sliderContainer.querySelectorAll('img');
        const currentIndex = projectState[projectId].currentIndex;
        
        // 현재 활성화된 이미지 인덱스 표시 업데이트
        const prevBtn = galleryCol.querySelector('.prev-btn');
        const nextBtn = galleryCol.querySelector('.next-btn');
        const validIndices = projectState[projectId].validImageIndices;
        const currentValidIndex = validIndices.indexOf(currentIndex);
        
        // 버튼 활성화/비활성화 상태 업데이트
        if (prevBtn) {
            prevBtn.disabled = currentValidIndex <= 0;
            prevBtn.style.opacity = currentValidIndex <= 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentValidIndex >= validIndices.length - 1;
            nextBtn.style.opacity = currentValidIndex >= validIndices.length - 1 ? '0.5' : '1';
        }
        
        // 모든 이미지 숨기기
        images.forEach(img => {
            img.style.display = 'none';
        });
        
        // 현재 인덱스 이미지 표시
        const currentImg = Array.from(images).find(img => parseInt(img.dataset.index) === currentIndex);
        if (currentImg) {
            currentImg.style.display = 'block';
        }
    }
    
    // 배열을 무작위로 섞는 함수
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}); 