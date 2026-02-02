const bridge = document.getElementById('bridge');
const player = document.getElementById('player');
const pillarCurrent = document.getElementById('pillar-current');
const pillarNext = document.getElementById('pillar-next');
const msgOverlay = document.getElementById('message-overlay');
const levelName = document.getElementById('level-name');
const scoreDisplay = document.getElementById('score');
const quizOverlay = document.getElementById('quiz-overlay');

let currentLevelNum = 1; // Cấp độ từ 1-16
let bridgeLength = 0;
let isHolding = false;
let growInterval;
const initialWidth = 100; // Chiều rộng cột đầu tiên
let playerX = initialWidth / 2; // Vị trí X của người chơi ở giữa cột
let currentPillarX = 0; // Vị trí cột hiện tại
let isAnimating = false; // Ngăn spam click
let collegeFailAllowed = false; // Khi vào Đại học, không cho phép sai

// Biến di chuyển cột
let pillarMoving = false;
let pillarMoveInterval = null;
let pillarMoveDirection = 1; // 1: sang phải, -1: sang trái
let pillarMoveSpeed = 0;
let maxBridgeLength = 300; // Giới hạn chiều dài cầu
let bridgeGrowthDirection = 1; // 1: tăng, -1: giảm

// Quản lý các cột đã qua
let passedPillars = [];
const maxVisiblePassedPillars = 5; // Hiển thị tối đa 5 cột đã qua
// Lưu vị trí ban đầu của cột tiếp theo (trước khi di chuyển)
let initialNextPillarLeft = 0;

// Hệ thống độ khó tăng dần khi chết
let deathCount = 0; // Số lần chết ở màn hiện tại
let lastDeathLevel = 0; // Level cuối cùng chết

// Hệ thống mạng (lives)
let lives = 10; // Số mạng còn lại
const maxLives = 5; // Tối đa 5 mạng mỗi màn

// Cấu trúc chương học
const chapters = [
    { name: "Tiểu Học Cơ Sở", start: 1, end: 5 },
    { name: "Trung Học Cơ Sở", start: 6, end: 9 },
    { name: "Trung Học Phổ Thông", start: 10, end: 12 },
    { name: "Đại Học", start: 13, end: 16 }
];

// Cấu hình các cấp độ (Sự phát triển của Chất) - 16 cấp độ
const levels = [
    // Lớp 1-5: Tiểu Học Cơ Sở - Chất đơn giản
    { name: "Lớp 1", icon: "👶", pillarWidth: 100, gap: 100 },
    { name: "Lớp 2", icon: "👶", pillarWidth: 95, gap: 110 },
    { name: "Lớp 3", icon: "👶", pillarWidth: 90, gap: 120 },
    { name: "Lớp 4", icon: "👶", pillarWidth: 85, gap: 130 },
    { name: "Lớp 5", icon: "👶", pillarWidth: 80, gap: 140 },
    
    // Lớp 6-9: Trung Học Cơ Sở - Chất đang hình thành
    { name: "Lớp 6", icon: "👦", pillarWidth: 75, gap: 150 },
    { name: "Lớp 7", icon: "👦", pillarWidth: 70, gap: 160 },
    { name: "Lớp 8", icon: "👦", pillarWidth: 65, gap: 170 },
    { name: "Lớp 9", icon: "👦", pillarWidth: 60, gap: 180 },
    
    // Lớp 10-12: Trung Học Phổ Thông - Chất tiệm cận sự trưởng thành
    { name: "Lớp 10", icon: "🧑‍🎓", pillarWidth: 55, gap: 190 },
    { name: "Lớp 11", icon: "🧑‍🎓", pillarWidth: 50, gap: 200 },
    { name: "Lớp 12", icon: "🧑‍🎓", pillarWidth: 45, gap: 220 },
    
    // Đại Học (Hell Mode) - Chất cao cấp, yêu cầu sự tự giác tuyệt đối
    { name: "Năm 1", icon: "🎓", pillarWidth: 40, gap: 240 },
    { name: "Năm 2", icon: "🎓", pillarWidth: 35, gap: 260 },
    { name: "Năm 3", icon: "🎓", pillarWidth: 30, gap: 280 },
    { name: "Năm 4", icon: "🎓", pillarWidth: 25, gap: 300 }
];

let currentLevel = 0;
let currentChapter = 0;

// Ngân hàng câu hỏi (30 câu)
const questionBank = [
    // Nhóm dễ - Định nghĩa (10 câu)
    { q: "Vật chất là gì?", a: ["Thực tại khách quan tồn tại độc lập với ý thức", "Sản phẩm của ý thức con người", "Chỉ là ảo giác", "Thứ do con người tạo ra"], correct: 0, difficulty: "easy" },
    { q: "Ý thức là gì?", a: ["Sự phản ánh hiện thực khách quan vào đầu óc con người", "Một dạng vật chất", "Tồn tại độc lập với não bộ", "Không liên quan đến thực tiễn"], correct: 0, difficulty: "easy" },
    { q: "Độ là gì?", a: ["Giới hạn định lượng mà trong đó sự vật còn giữ được tính Chất", "Giới hạn tối đa của sự vật", "Giới hạn tối thiểu", "Không có giới hạn"], correct: 0, difficulty: "easy" },
    { q: "Điểm nút là gì?", a: ["Thời điểm chín muồi để thực hiện bước nhảy từ Chất cũ sang Chất mới", "Điểm kết thúc quá trình", "Điểm bắt đầu tích lũy", "Không có ý nghĩa gì"], correct: 0, difficulty: "easy" },
    { q: "Lượng là gì?", a: ["Quy định về mặt số lượng, quy mô, tốc độ phát triển", "Chỉ là con số", "Tính chất bên ngoài", "Không thay đổi được"], correct: 0, difficulty: "easy" },
    { q: "Chất là gì?", a: ["Tính quy định làm cho sự vật là nó chứ không phải cái khác", "Chỉ là hình thức bên ngoài", "Giống nhau ở mọi sự vật", "Không thể nhận biết được"], correct: 0, difficulty: "easy" },
    { q: "Bước nhảy là gì?", a: ["Sự chuyển biến từ Chất cũ sang Chất mới", "Sự thay đổi về lượng", "Sự lặp lại cũ", "Chỉ là thay đổi hình thức"], correct: 0, difficulty: "easy" },
    { q: "Quy luật chuyển hóa từ lượng sang chất nói về điều gì?", a: ["Sự tích lũy về lượng dẫn đến thay đổi về chất", "Chất không bao giờ thay đổi", "Lượng không quan trọng", "Chỉ có lượng là quan trọng"], correct: 0, difficulty: "easy" },
    { q: "Tả khuynh là gì?", a: ["Nôn nóng, chủ quan duy ý chí", "Thận trọng quá mức", "Hành động đúng đắn", "Không làm gì cả"], correct: 0, difficulty: "easy" },
    { q: "Hữu khuynh là gì?", a: ["Bảo thủ, trì trệ, bỏ lỡ thời cơ", "Hành động nhanh chóng", "Quyết đoán đúng lúc", "Thay đổi liên tục"], correct: 0, difficulty: "easy" },
    
    // Nhóm trung bình - Mối quan hệ (10 câu)
    { q: "Lượng đổi dẫn đến điều gì?", a: ["Chất đổi khi đạt đến Điểm nút", "Không có gì thay đổi", "Chỉ lượng tăng lên", "Mọi thứ bất biến"], correct: 0, difficulty: "medium" },
    { q: "Chất mới ra đời có nghĩa là gì?", a: ["Bước nhảy đã hoàn thành, sự vật có tính quy định mới", "Chỉ thay đổi hình thức", "Quay về trạng thái cũ", "Không có gì đặc biệt"], correct: 0, difficulty: "medium" },
    { q: "Tại sao phải tích lũy đủ lượng?", a: ["Vì chưa đủ lượng thì không thể thực hiện bước nhảy", "Để tốn thời gian", "Không cần thiết", "Chỉ cần ý chí"], correct: 0, difficulty: "medium" },
    { q: "Điều gì xảy ra nếu bỏ lỡ Điểm nút?", a: ["Thời cơ qua đi, khó thực hiện bước nhảy", "Không sao cả", "Dễ dàng thực hiện sau", "Luôn có cơ hội khác"], correct: 0, difficulty: "medium" },
    { q: "Quan hệ giữa Lượng và Chất như thế nào?", a: ["Thống nhất biện chứng, lượng đổi dẫn đến chất đổi", "Hoàn toàn độc lập", "Chỉ có lượng quan trọng", "Chỉ có chất quan trọng"], correct: 0, difficulty: "medium" },
    { q: "Tại sao Đại học không cho phép sai lầm?", a: ["Giai đoạn hình thành chất cao cấp, yêu cầu tự giác tuyệt đối", "Do quy định của nhà trường", "Vì quá dễ", "Không có lý do"], correct: 0, difficulty: "medium" },
    { q: "Phủ định của phủ định là gì?", a: ["Quay lại điểm xuất phát ở trình độ cao hơn", "Quay lại hoàn toàn như cũ", "Phá hủy mọi thứ", "Dừng lại không phát triển"], correct: 0, difficulty: "medium" },
    { q: "Tại sao cần nắm bắt Điểm nút?", a: ["Để thực hiện bước nhảy đúng lúc, thành công", "Không cần thiết", "Chỉ là lý thuyết", "Tùy hứng"], correct: 0, difficulty: "medium" },
    { q: "Thất bại ở Đại học có ý nghĩa gì?", a: ["Khủng hoảng bản sắc, cần xây dựng lại từ đầu", "Chỉ thử lại ngay", "Không ảnh hưởng gì", "Dễ dàng khắc phục"], correct: 0, difficulty: "medium" },
    { q: "Quá trình học vấn thể hiện quy luật gì?", a: ["Lượng đổi thành chất đổi qua các cấp học", "Không có quy luật", "Hoàn toàn ngẫu nhiên", "Chỉ phụ thuộc vận may"], correct: 0, difficulty: "medium" },
    
    // Nhóm khó - Vận dụng (10 câu)
    { q: "Doanh nghiệp tăng vốn nhưng không đổi mới công nghệ. Đây là sai lầm gì?", a: ["Hữu khuynh - Chỉ tăng lượng mà không tạo bước nhảy về chất", "Tả khuynh", "Hoàn toàn đúng", "Không có vấn đề"], correct: 0, difficulty: "hard" },
    { q: "Sinh viên tích lũy 140 tín chỉ nhưng không làm thủ tục tốt nghiệp vì sợ đi làm. Sai lầm gì?", a: ["Hữu khuynh - Trì trệ trước Điểm nút", "Tả khuynh", "Quyết định đúng đắn", "Cần thêm thời gian"], correct: 0, difficulty: "hard" },
    { q: "Khởi nghiệp khi chưa có kiến thức, kinh nghiệm là sai lầm gì?", a: ["Tả khuynh - Nôn nóng, chủ quan duy ý chí", "Hữu khuynh", "Dũng cảm đáng khích lệ", "Cách làm hay"], correct: 0, difficulty: "hard" },
    { q: "Học lớp 12 nhưng không thi Đại học vì sợ khó là sai lầm gì?", a: ["Hữu khuynh - Bỏ lỡ Điểm nút chuyển biến", "Tả khuynh", "Lựa chọn hợp lý", "Không sao"], correct: 0, difficulty: "hard" },
    { q: "Công ty mở rộng quá nhanh khi chưa vững về quản lý là sai lầm gì?", a: ["Tả khuynh - Lượng chưa đủ đã đòi bước nhảy", "Hữu khuynh", "Chiến lược tốt", "Tầm nhìn xa"], correct: 0, difficulty: "hard" },
    { q: "Nước ta đổi mới kinh tế 1986 sau nhiều năm bế tắc là ví dụ về điều gì?", a: ["Nắm bắt Điểm nút để thực hiện bước nhảy", "Tả khuynh", "Hữu khuynh", "Ngẫu nhiên may mắn"], correct: 0, difficulty: "hard" },
    { q: "Học sinh lớp 5 thi vào lớp 10 luôn là sai lầm gì?", a: ["Tả khuynh - Bỏ qua giai đoạn tích lũy cần thiết", "Hữu khuynh", "Thông minh vượt trội", "Cách học mới"], correct: 0, difficulty: "hard" },
    { q: "Doanh nghiệp có lợi nhuận tốt nhưng không mở rộng vì sợ rủi ro là gì?", a: ["Hữu khuynh - Bỏ lỡ cơ hội phát triển", "Tả khuynh", "Thận trọng đúng đắn", "An toàn tốt nhất"], correct: 0, difficulty: "hard" },
    { q: "Cách mạng công nghiệp 4.0 yêu cầu doanh nghiệp phải làm gì?", a: ["Chuyển đổi số - Thực hiện bước nhảy về chất", "Giữ nguyên như cũ", "Chỉ tăng vốn", "Đợi người khác làm trước"], correct: 0, difficulty: "hard" },
    { q: "Học đến đâu biết đến đó, không cần bằng cấp là quan điểm gì?", a: ["Hữu khuynh - Phủ nhận vai trò của bước nhảy về chất", "Tả khuynh", "Tiến bộ hiện đại", "Hoàn toàn đúng"], correct: 0, difficulty: "hard" }
];

// Biến quiz
let quizTimer = null;
let timeLeft = 0;
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let selectedAnswer = null;
let checkpointLevel = 0; // Checkpoint nào đang làm bài (5, 9, 12)

function getCurrentChapter() {
    for (let i = 0; i < chapters.length; i++) {
        if (currentLevelNum >= chapters[i].start && currentLevelNum <= chapters[i].end) {
            return i;
        }
    }
    return 0;
}

function isInCollege() {
    return currentLevelNum >= 13;
}

// Lấy tốc độ xây cầu theo cấp độ VÀ số lần chết
function getBridgeSpeed() {
    // Tốc độ tăng TUYẾN TÍNH từ level 1 (5) đến level 12 (15)
    // Level 1-5: 5 -> 7
    // Level 6-9: 7 -> 10
    // Level 10-12: 10 -> 15
    // Level 13-16 (Đại học): gấp đôi
    
    let baseSpeed;
    if (currentLevelNum <= 5) {
        // Tiểu học: 5 -> 7
        baseSpeed = 5 + (currentLevelNum - 1) * 0.5;
    } else if (currentLevelNum <= 9) {
        // THCS: 7 -> 10
        baseSpeed = 7 + (currentLevelNum - 6) * 0.75;
    } else if (currentLevelNum <= 12) {
        // THPT: 10 -> 15
        baseSpeed = 10 + (currentLevelNum - 10) * 1 //1.67;
    } else {
        // Đại học: 15 -> 20
        baseSpeed = 15 + (currentLevelNum - 13) * 1; //1.25;
    }
    
    // Tăng tốc độ mỗi lần chết (+2 mỗi lần thay vì +1.5)
    const deathPenalty = deathCount * 1; //2;
    
    // Nếu ở Đại học, khó GẤP ĐÔI
    const collegeMultiplier = isInCollege() ? 1 : 1; //1.5;
    
    return (baseSpeed + deathPenalty) * collegeMultiplier;
}

// Kiểm tra xem cột có nên di chuyển không
function shouldPillarMove() {
    return false; // TẮT tính năng di chuyển cột
}

// Lấy tốc độ di chuyển cột
function getPillarMoveSpeed() {
    if (currentLevelNum === 4 || currentLevelNum === 5) return 0.5; // Tiểu học: chậm
    if (currentLevelNum === 9) return 1; // THCS: trung bình
    if (currentLevelNum === 12) return 1.5; // THPT: nhanh
    if (currentLevelNum === 16) return 2; // Đại học năm 4: rất nhanh
    return 0;
}

// Bắt đầu di chuyển cột
function startPillarMovement() {
    if (!shouldPillarMove()) return;
    
    pillarMoving = true;
    pillarMoveSpeed = getPillarMoveSpeed();
    const centerPosition = initialNextPillarLeft; // Vị trí ban đầu của cột (đã ngẫu nhiên)
    let pillarPosition = centerPosition;
    const moveRange = 20; // Di chuyển ±20px xung quanh vị trí ban đầu
    
    pillarMoveInterval = setInterval(() => {
        pillarPosition += pillarMoveSpeed * pillarMoveDirection;
        
        // Đổi hướng khi chạm biên (xung quanh vị trí ban đầu)
        if (pillarPosition >= centerPosition + moveRange) {
            pillarMoveDirection = -1;
        } else if (pillarPosition <= centerPosition - moveRange) {
            pillarMoveDirection = 1;
        }
        
        pillarNext.style.left = pillarPosition + "px";
    }, 30);
}

// Dừng di chuyển cột
function stopPillarMovement() {
    if (pillarMoveInterval) {
        clearInterval(pillarMoveInterval);
        pillarMoveInterval = null;
        pillarMoving = false;
        pillarMoveDirection = 1;
    }
}

// Xử lý sự kiện nhấn chuột để Tích lũy Lượng
window.addEventListener('mousedown', () => {
    const gameContainer = document.getElementById('game-container');
    const leapOverlay = document.getElementById('leap-complete-overlay');
    // Ngăn click khi có bất kỳ overlay nào đang hiển thị
    if (gameContainer.classList.contains('hidden') || 
        !msgOverlay.classList.contains('hidden') || 
        !quizOverlay.classList.contains('hidden') ||
        leapOverlay ||
        isAnimating) return;
    isHolding = true;
    
    // Tốc độ xây cầu tăng theo cấp độ
    const bridgeSpeed = getBridgeSpeed();
    
    growInterval = setInterval(() => {
        if (bridgeGrowthDirection === 1) {
            // Tăng chiều dài cầu
            bridgeLength += bridgeSpeed;
            bridge.style.height = bridgeLength + "px";
            
            // Kiểm tra nếu đạt giới hạn thì đổi hướng
            if (bridgeLength >= maxBridgeLength) {
                bridgeGrowthDirection = -1;
            }
        } else {
            // Giảm chiều dài cầu
            bridgeLength -= bridgeSpeed;
            if (bridgeLength < 0) bridgeLength = 0;
            bridge.style.height = bridgeLength + "px";
            
            // Nếu về 0 thì đổi hướng lại
            if (bridgeLength <= 0) {
                bridgeGrowthDirection = 1;
            }
        }
    }, 30);
});

// Xử lý sự kiện thả chuột để thực hiện Bước nhảy (cầu rơi xuống)
window.addEventListener('mouseup', () => {
    const gameContainer = document.getElementById('game-container');
    const leapOverlay = document.getElementById('leap-complete-overlay');
    // Ngăn click khi có bất kỳ overlay nào đang hiển thị
    if (gameContainer.classList.contains('hidden') || 
        !quizOverlay.classList.contains('hidden') ||
        leapOverlay ||
        !isHolding || 
        isAnimating) return;
    isHolding = false;
    clearInterval(growInterval);
    dropBridge();
});

// Cầu rơi xuống (xoay 90 độ)
function dropBridge() {
    isAnimating = true;
    stopPillarMovement(); // Dừng di chuyển cột khi thả cầu
    
    // Dịch cầu sang trái khi xoay để nằm sát cột
    const currentLeft = parseInt(bridge.style.left) || 0;
    const adjustedLeft = currentLeft - 5; // Dịch sang trái 5px (bằng width của cầu)
    bridge.style.left = adjustedLeft + "px";
    bridge.style.transform = "rotate(90deg)";
    
    setTimeout(() => {
        checkLeap();
    }, 500);
}

function checkLeap() {
    const gap = levels[currentLevel].gap;
    const pWidth = levels[currentLevel].pillarWidth;
    
    // Điều chỉnh độ dài cầu vì cầu đã dịch sang trái 5px
    const bridgeOffset = 7; // Cầu đã lùi vào 7px
    const effectiveBridgeLength = bridgeLength - bridgeOffset;
    
    // Khoảng cách Điểm nút: từ gap đến (gap + pWidth)
    if (effectiveBridgeLength < gap) {
        showResult("SAI LẦM TẢ KHUYNH", "Bạn quá nôn nóng! Lượng chưa tích lũy đủ đến Điểm Nút đã đòi thực hiện bước nhảy.");
        isAnimating = false;
    } 
    else if (effectiveBridgeLength > (gap + pWidth)) {
        showResult("SAI LẦM HỮU KHUYNH", "Bạn quá bảo thủ! Lượng đã thừa nhưng bạn không nắm bắt Điểm Nút để thực hiện bước nhảy đúng lúc.");
        isAnimating = false;
    } 
    else {
        successLeap();
    }
}

function successLeap() {
    // Di chuyển người chơi qua cầu đến cột tiếp theo
    const nextPillarLeft = parseInt(pillarNext.style.left);
    const nextPillarWidth = levels[currentLevel].pillarWidth;
    const targetX = nextPillarLeft + (nextPillarWidth / 2);
    
    // Animation di chuyển người chơi sang cột tiếp theo
    player.style.transition = "left 0.8s ease";
    player.style.left = targetX + "px";
    
    console.log("Player moving to:", targetX + "px");
    
    // Ẩn cầu sau khi người chơi đi qua
    setTimeout(() => {
        bridge.style.transition = "opacity 0.3s";
        bridge.style.opacity = "0";
    }, 400);
    
    // Đợi animation player hoàn thành trước khi chuyển màn
    setTimeout(() => {
        currentLevelNum++;
        
        // Kiểm tra checkpoint (Lớp 5, 9, 12) - Kỳ thi chuyển cấp
        if (currentLevelNum == 6) {
            isAnimating = false;
            startCheckpointQuiz(5);
            return;
        }
        if (currentLevelNum == 10) {
            isAnimating = false;
            startCheckpointQuiz(9);
            return;
        }
        if (currentLevelNum == 13) {
            isAnimating = false;
            startCheckpointQuiz(12);
            return;
        }
        
        // ============ CHỈNH SỬA Ở ĐÂY ============
        // Kiểm tra thắng game (hoàn thành Đại học năm thứ 4)
        if (currentLevelNum > 16) {
            // Hiển thị màn hình kết thúc game trước
            showResult("🎓 TỐT NGHIỆP ĐẠI HỌC!", 
                "Chúc mừng! Bạn đã hoàn thành tất cả 16 cấp độ và tốt nghiệp Đại học!\n\nChuẩn bị chuyển sang phần tiếp theo...");
            
            // Sau 3 giây, chuyển sang file twist.html
            setTimeout(() => {
                // Lưu thông tin thành tích nếu cần
                const achievement = {
                    completed: true,
                    time: new Date().toISOString(),
                    attempts: deathCount
                };
                localStorage.setItem('dialectical_bridge_achievement', JSON.stringify(achievement));
                
                // Chuyển sang file twist.html
                window.location.href = 'twist.html';
            }, 3000);
            
            isAnimating = false;
            return;
        }
        // ============ KẾT THÚC CHỈNH SỬA ============
        
        scoreDisplay.innerText = currentLevelNum + " / 16";
        
        // Hiệu ứng visual cho Bước nhảy thành công
        document.body.classList.add('leap-success');
        setTimeout(() => document.body.classList.remove('leap-success'), 1000);

        // Cập nhật chương hiện tại
        const newChapter = getCurrentChapter();
        const isChapterChange = (newChapter !== currentChapter);
        if (isChapterChange) {
            currentChapter = newChapter;
            // Reset tốc độ tăng khi chuyển Giai đoạn (màn mới)
            deathCount = 0;
            lastDeathLevel = 0;
            // Reset mạng khi chuyển màn mới
            lives = maxLives;
            updateLivesDisplay();
            console.log("🎉 CHUYỂN GIAI ĐOẠN - Reset tốc độ tăng và mạng!");
        }
        
        // Tăng độ khó sau mỗi cấp
        if (currentLevelNum <= levels.length) {
            currentLevel = currentLevelNum - 1;
            updateQuality();
        }
        
        // RESET vị trí khi chuyển giai đoạn, KHÔNG reset khi chuyển màn thường
        if (isChapterChange) {
            resetPositionOnly();
        } else {
            // Chuyển cảnh bình thường: Cột tiếp theo trở thành cột hiện tại
            moveToNextPillar();
        }
    }, 900);
}

function moveToNextPillar() {
    // Lưu cột hiện tại vào danh sách cột đã qua
    const currentLeft = parseInt(pillarCurrent.style.left) || 0;
    const currentWidth = parseInt(pillarCurrent.style.width) || 100;
    
    passedPillars.push({
        left: currentLeft,
        width: currentWidth
    });
    
    // Giới hạn số cột hiển thị (giữ 10 cột)
    if (passedPillars.length > 10) {
        passedPillars.shift();
    }
    
    // Render các cột đã qua
    renderPassedPillars();
    
    // Dùng VỊ TRÍ BAN ĐẦU, KHÔNG PHẢI VỊ TRÍ SAU KHI DI CHUYỂN
    const nextLeft = initialNextPillarLeft;
    const nextWidth = parseInt(pillarNext.style.width);
    
    pillarCurrent.style.transition = "none";
    pillarCurrent.style.left = nextLeft + "px";
    pillarCurrent.style.width = nextWidth + "px";
    
    // Cầu xuất hiện tại vị trí bên phải cột current (nơi player đang đứng)
    const bridgeEl = document.getElementById('bridge');
    bridgeEl.style.transition = "none";
    bridgeEl.style.height = "0px";
    bridgeEl.style.transform = "rotate(0deg)";
    bridgeEl.style.left = (nextLeft + nextWidth - 5) + "px";
    bridgeEl.style.bottom = "200px";
    bridgeEl.style.opacity = "1";
    bridgeEl.style.visibility = "visible";
    
    console.log("Moved - Current pillar at:", nextLeft + "px", "Bridge at:", (nextLeft + nextWidth) + "px");
    
    // Bật lại transition
    setTimeout(() => {
        pillarCurrent.style.transition = "all 0.8s ease";
        pillarNext.style.transition = "all 0.8s ease";
        bridgeEl.style.transition = "transform 0.5s ease";
        
        // Gọi nextTurn để tạo cột mới
        nextTurn();
    }, 50);
}

// Render các cột đã qua
function renderPassedPillars() {
    const container = document.getElementById('passed-pillars');
    if (!container) {
        console.warn('passed-pillars container not found');
        return;
    }
    
    container.innerHTML = '';
    
    passedPillars.forEach((pillar, index) => {
        const pillarEl = document.createElement('div');
        pillarEl.className = 'passed-pillar';
        pillarEl.style.left = pillar.left + 'px';
        pillarEl.style.width = pillar.width + 'px';
        container.appendChild(pillarEl);
    });
}

function updateQuality() {
    currentChapter = getCurrentChapter();
    const chapterName = chapters[currentChapter].name;
    const levelNameText = levels[currentLevel].name;
    levelName.innerText = chapterName + " - " + levelNameText;
    player.innerText = levels[currentLevel].icon;
    
    // Cảnh báo nếu đang ở Đại học
    if (isInCollege()) {
        const deathInfo = deathCount > 0 ? ` | Chết: ${deathCount} lần` : "";
        document.getElementById('instruction').innerText = `⚠️ ĐẠI HỌC: KHÓ GẤP ĐÔI! Nhấn giữ chuột cẩn thận!${deathInfo}`;
        document.getElementById('instruction').style.color = "red";
        document.getElementById('instruction').style.fontWeight = "bold";
    } else if (deathCount > 0) {
        document.getElementById('instruction').innerText = `Nhấn giữ chuột để tích lũy LƯỢNG (Chết: ${deathCount} lần - Tốc độ +${deathCount * 2})`;
        document.getElementById('instruction').style.color = "orange";
        document.getElementById('instruction').style.fontWeight = "bold";
    } else {
        document.getElementById('instruction').innerText = "Nhấn giữ chuột để tích lũy LƯỢNG (độ dài cầu)";
        document.getElementById('instruction').style.color = "black";
        document.getElementById('instruction').style.fontWeight = "normal";
    }
}

// Cập nhật hiển thị mạng
function updateLivesDisplay() {
    const livesDisplay = document.getElementById('lives-display');
    if (!livesDisplay) return;
    
    const heart = '❤️';
    const emptyHeart = '🖤';
    livesDisplay.innerText = heart.repeat(lives) + emptyHeart.repeat(maxLives - lives);
}

function nextTurn() {
    // Reset biến cầu
    bridgeLength = 0;
    bridgeGrowthDirection = 1;
    
    // Ngẫu nhiên khoảng cách
    const baseGap = levels[currentLevel].gap;
    const randomVariation = Math.floor(Math.random() * 40) - 20;
    const newGap = baseGap + randomVariation;
    levels[currentLevel].gap = Math.max(80, newGap);
    
    // Đặt vị trí cột tiếp theo: cách theo gap của level
    const currentPillarLeft = parseInt(pillarCurrent.style.left) || 0;
    const currentWidth = parseInt(pillarCurrent.style.width) || 100;
    const nextPillarLeft = currentPillarLeft + currentWidth + levels[currentLevel].gap;
    
    // LƯU VỊ TRÍ BAN ĐẦU TRƯỚC KHI DI CHUYỂN
    initialNextPillarLeft = nextPillarLeft;
    
    pillarNext.style.left = nextPillarLeft + "px";
    pillarNext.style.width = levels[currentLevel].pillarWidth + "px";
    
    console.log("Next pillar INITIAL at:", nextPillarLeft + "px", "Current pillar at:", currentPillarLeft + "px", "Gap:", levels[currentLevel].gap);
    
    isAnimating = false;
    
    // Bắt đầu di chuyển cột nếu cần
    startPillarMovement();
}

function showResult(title, desc) {
    document.getElementById('msg-title').innerText = title;
    document.getElementById('msg-desc').innerText = desc;
    
    // Kiểm tra nếu đây là màn hình tốt nghiệp thì đổi nút
    if (title.includes("TỐT NGHIỆP ĐẠI HỌC")) {
        const button = msgOverlay.querySelector('button');
        button.innerText = "Chuyển sang phần tiếp theo";
        button.onclick = function() {
            // Lưu thông tin thành tích
            const achievement = {
                completed: true,
                time: new Date().toISOString(),
                attempts: deathCount
            };
            localStorage.setItem('dialectical_bridge_achievement', JSON.stringify(achievement));
            
            // Chuyển sang file twist.html
            window.location.href = 'twist.html';
        };
    } else {
        // RESET button về handleRetry() (phòng trường hợp bị override từ showTransitionScreen)
        const button = msgOverlay.querySelector('button');
        button.innerText = "Thử lại (Rút kinh nghiệm)";
        button.onclick = function() { handleRetry(); };
    }
    
    msgOverlay.classList.remove('hidden');
}

function showTransitionScreen(title, desc) {
    document.getElementById('msg-title').innerText = title;
    document.getElementById('msg-desc').innerText = desc;
    msgOverlay.classList.remove('hidden');
    
    // Thay nút "Thử lại" bằng "Tiếp tục"
    const button = msgOverlay.querySelector('button');
    button.innerText = "Tiếp tục vào Đại Học";
    button.onclick = function() {
        msgOverlay.classList.add('hidden');
        button.innerText = "Thử lại (Rút kinh nghiệm)";
        button.onclick = function() { resetGame(); };
        scoreDisplay.innerText = currentLevelNum + " / 16";
        
        // Cập nhật chương và level
        currentLevel = currentLevelNum - 1;
        currentChapter = getCurrentChapter();
        updateQuality();
        moveToNextPillar();
    };
}

// Xử lý khi người chơi thử lại sau khi thất bại
function handleRetry() {
    msgOverlay.classList.add('hidden');
    
    // Giảm 1 mạng
    lives--;
    updateLivesDisplay();
    
    console.log(`❤️ Còn ${lives} mạng`);
    
    // Kiểm tra hết mạng → THÔI HỌC
    if (lives <= 0) {
        showResult(
            "⛔ THÔI HỌC!", 
            "Bạn đã hết mạng! Phải bắt đầu lại từ đầu."
        );
        // Đặt flag để reset game khi click
        setTimeout(() => {
            resetGame();
        }, 100);
        return;
    }
    
    console.log(`DEBUG: currentLevelNum trước khi tính checkpoint: ${currentLevelNum}`);
    
    // Tìm checkpoint gần nhất (về đầu giai đoạn)
    let checkpointLevel;
    if (currentLevelNum <= 5) {
        checkpointLevel = 1; // Tiểu học → Lớp 1
    } else if (currentLevelNum <= 9) {
        checkpointLevel = 6; // THCS → Lớp 6
    } else if (currentLevelNum <= 12) {
        checkpointLevel = 10; // THPT → Lớp 10
    } else {
        checkpointLevel = 13; // Đại học → Năm 1
    }
    
    console.log(`DEBUG: Checkpoint được tính: ${checkpointLevel}`);
    
    // Nếu chết ở màn mới hoặc về checkpoint khác, reset deathCount
    if (lastDeathLevel !== checkpointLevel) {
        deathCount = 0;
        lastDeathLevel = checkpointLevel;
    }
    
    // Tăng số lần chết
    deathCount++;
    
    // Cập nhật level về checkpoint
    currentLevelNum = checkpointLevel;
    currentLevel = currentLevelNum - 1;
    
    // Hiển thị thông báo
    const difficultyMsg = deathCount === 1 ? "" : ` (Độ khó tăng: +${(deathCount - 1) * 2})`;
    console.log(`🔁 VỀ CHECKPOINT Lớp ${checkpointLevel} - Lần ${deathCount}${difficultyMsg}`);
    
    // Cập nhật score display
    scoreDisplay.innerText = currentLevelNum + " / 16";
    
    // Cập nhật UI và chơi lại màn hiện tại
    updateQuality();
    replayCurrentLevel();
}

// Chơi lại màn hiện tại (không reset level)
function replayCurrentLevel() {
    bridgeLength = 0;
    const currentWidth = levels[currentLevel].pillarWidth;
    isAnimating = false;
    
    // Xóa các cột đã qua khi chết
    passedPillars = [];
    renderPassedPillars();
    
    // Reset vị trí về đầu màn
    pillarCurrent.style.transition = "none";
    pillarNext.style.transition = "none";
    player.style.transition = "none";
    bridge.style.transition = "none";
    
    // Reset cột về vị trí đầu (50px)
    pillarCurrent.style.left = "50px";
    pillarCurrent.style.width = currentWidth + "px";
    
    // Reset vị trí player
    player.style.left = (50 + currentWidth / 2) + "px";
    
    // Reset cầu
    bridge.style.height = "0px";
    bridge.style.transform = "rotate(0deg)";
    bridge.style.left = (50 + currentWidth - 5) + "px";
    bridge.style.opacity = "1";
    
    console.log("🔁 CHƠI LẠI màn", currentLevelNum);
    
    // Bật lại transition
    setTimeout(() => {
        pillarCurrent.style.transition = "all 0.8s ease";
        pillarNext.style.transition = "all 0.8s ease";
        player.style.transition = "all 0.5s";
        bridge.style.transition = "transform 0.5s ease";
        
        nextTurn();
    }, 50);
}

function resetGame() {
    currentLevelNum = 1;
    currentLevel = 0;
    currentChapter = 0;
    bridgeLength = 0;
    const initialWidth = levels[0].pillarWidth;
    playerX = initialWidth / 2;
    currentPillarX = 0;
    isAnimating = false;
    scoreDisplay.innerText = "1 / 16";
    msgOverlay.classList.add('hidden');
    
    // Reset mạng về 5
    lives = maxLives;
    updateLivesDisplay();
    
    // Reset tốc độ tăng (death count)
    deathCount = 0;
    lastDeathLevel = 0;
    
    // Xóa các cột đã qua
    passedPillars = [];
    renderPassedPillars();
    
    // Reset tất cả về vị trí ban đầu khi chết
    pillarCurrent.style.transition = "none";
    pillarNext.style.transition = "none";
    player.style.transition = "none";
    bridge.style.transition = "none";
    
    // Reset cột về vị trí đầu
    pillarCurrent.style.left = "0px";
    pillarCurrent.style.width = initialWidth + "px";
    
    // Reset vị trí player
    player.style.left = (initialWidth / 2) + "px";
    
    // Reset cầu
    bridge.style.height = "0px";
    bridge.style.transform = "rotate(0deg)";
    bridge.style.left = (initialWidth - 5) + "px";
    bridge.style.opacity = "1";
    
    // Reset hướng dẫn
    document.getElementById('instruction').innerText = "Nhấn giữ chuột để tích lũy LƯỢNG (độ dài cầu)";
    document.getElementById('instruction').style.color = "black";
    document.getElementById('instruction').style.fontWeight = "normal";
    
    // Bật lại transition
    setTimeout(() => {
        pillarCurrent.style.transition = "all 0.8s ease";
        pillarNext.style.transition = "all 0.8s ease";
        player.style.transition = "all 0.5s";
        bridge.style.transition = "transform 0.5s ease";
        
        updateQuality();
        nextTurn();
    }, 50);
}

// Reset vị trí về đầu khi chuyển giai đoạn (GIỮ LEVEL HIỆN TẠI)
function resetPositionOnly() {
    bridgeLength = 0;
    const currentWidth = levels[currentLevel].pillarWidth;
    isAnimating = false;
    
    // Reset số lần chết khi chuyển giai đoạn
    deathCount = 0;
    lastDeathLevel = 0;
    
    // Xóa các cột đã qua
    passedPillars = [];
    renderPassedPillars();
    
    // Reset tất cả về vị trí ban đầu
    pillarCurrent.style.transition = "none";
    pillarNext.style.transition = "none";
    player.style.transition = "none";
    bridge.style.transition = "none";
    
    // Reset cột về vị trí đầu (50px)
    pillarCurrent.style.left = "50px";
    pillarCurrent.style.width = currentWidth + "px";
    
    // Reset vị trí player
    player.style.left = (50 + currentWidth / 2) + "px";
    
    // Reset cầu
    bridge.style.height = "0px";
    bridge.style.transform = "rotate(0deg)";
    bridge.style.left = (50 + currentWidth - 5) + "px";
    bridge.style.opacity = "1";
    
    console.log("🔄 RESET vị trí về đầu - Chuyển giai đoạn!");
    
    // Bật lại transition
    setTimeout(() => {
        pillarCurrent.style.transition = "all 0.8s ease";
        pillarNext.style.transition = "all 0.8s ease";
        player.style.transition = "all 0.5s";
        bridge.style.transition = "transform 0.5s ease";
        
        nextTurn();
    }, 50);
}

function returnToMenu() {
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    resetGame();
}

// Hàm bắt đầu game từ main menu
function startGame() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    initGame();
}

// Khởi tạo game
function initGame() {
    // Reset mạng về 5
    lives = maxLives;
    updateLivesDisplay();
    
    // Set vị trí ban đầu cho cầu (sát cột đầu tiên)
    const initialPillarWidth = levels[0].pillarWidth;
    bridge.style.left = (initialPillarWidth - 5) + "px";
    bridge.style.bottom = "200px";
    bridge.style.height = "0px";
    bridge.style.transform = "rotate(0deg)";
    bridge.style.opacity = "1";
    
    updateQuality();
    nextTurn();
}

// ===== HỆ THỐNG QUIZ =====

// Bắt đầu quiz checkpoint
function startCheckpointQuiz(level) {
    checkpointLevel = level;
    const config = {
        5: { questions: 2, time: 14, required: 1 },
        9: { questions: 4, time: 28, required: 2 },
        12: { questions: 6, time: 42, required: 3 }
    }[level];
    
    // Chọn câu hỏi ngẫu nhiên
    currentQuizQuestions = [];
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    currentQuizQuestions = shuffled.slice(0, config.questions);
    
    currentQuestionIndex = 0;
    correctAnswers = 0;
    timeLeft = config.time;
    
    document.getElementById('quiz-title').innerText = `Kỳ thi Chuyển cấp - Lớp ${level}`;
    document.getElementById('total-questions').innerText = config.questions;
    
    quizOverlay.classList.remove('hidden');
    showQuestion();
    startTimer();
}

// Hiển thị câu hỏi
function showQuestion() {
    const question = currentQuizQuestions[currentQuestionIndex];
    document.getElementById('current-question').innerText = currentQuestionIndex + 1;
    document.getElementById('question-text').innerText = question.q;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    selectedAnswer = null;
    document.getElementById('submit-answer').disabled = true;
    
    question.a.forEach((answer, index) => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.innerText = answer;
        div.onclick = () => selectAnswer(index);
        answersContainer.appendChild(div);
    });
}

// Chọn đáp án
function selectAnswer(index) {
    selectedAnswer = index;
    document.querySelectorAll('.answer-option').forEach((el, i) => {
        el.classList.toggle('selected', i === index);
    });
    document.getElementById('submit-answer').disabled = false;
}

// Submit đáp án
function submitAnswer() {
    if (selectedAnswer === null) return;
    
    const question = currentQuizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    // Hiển thị kết quả
    document.querySelectorAll('.answer-option').forEach((el, i) => {
        el.onclick = null;
        if (i === question.correct) {
            el.classList.add('correct');
        } else if (i === selectedAnswer && !isCorrect) {
            el.classList.add('wrong');
        }
    });
    
    if (isCorrect) correctAnswers++;
    
    // Chuyển câu tiếp theo
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuizQuestions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
}

// Đếm ngược thời gian
function startTimer() {
    document.getElementById('time-left').innerText = timeLeft;
    quizTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            finishQuiz();
        }
    }, 1000);
}

// Kết thúc quiz
function finishQuiz() {
    clearInterval(quizTimer);
    quizOverlay.classList.add('hidden');
    
    const config = {
        5: { required: 1, failTo: 1 },
        9: { required: 2, failTo: 5 },
        12: { required: 3, failTo: 9 }
    }[checkpointLevel];
    
    if (correctAnswers >= config.required) {
        // Đậu - Tiếp tục
        showLeapComplete();
    } else {
        // Trượt - Quay về checkpoint trước
        currentLevelNum = config.failTo;
        currentLevel = currentLevelNum - 1;
        deathCount = 0; // Reset số lần chết
        lastDeathLevel = 0;
        
        console.log(`❌ FAIL QUIZ Lớp ${checkpointLevel} → Quay về Lớp ${config.failTo}`);
        
        showResult(
            `RỚT KỲ THI LỚP ${checkpointLevel}!`,
            `Bạn chỉ trả lời đúng ${correctAnswers}/${currentQuizQuestions.length} câu. Chưa đủ lượng để thực hiện bước nhảy! Quay về Lớp ${config.failTo}.`
        );
        
        // Đợi người dùng click "Thử lại" thì sẽ reset vị trí trong handleRetry()
    }
}

// Hiệu ứng bước nhảy hoàn thành
function showLeapComplete() {
    const overlay = document.createElement('div');
    overlay.id = 'leap-complete-overlay';
    overlay.innerHTML = `
        <div class="leap-complete-content">
            <h1>🎉 BƯỚC NHẢY HOÀN THÀNH 🎉</h1>
            <h2>CHẤT MỚI RA ĐỜI</h2>
            <p>Chúc mừng! Bạn đã vượt qua Lớp ${checkpointLevel}</p>
            <div class="confetti">✨🎊🎉🎊✨</div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
        continueGame();
    }, 3000);
}

// Tiếp tục game sau quiz
function continueGame() {
    scoreDisplay.innerText = currentLevelNum + " / 16";
    currentLevel = currentLevelNum - 1;
    currentChapter = getCurrentChapter();
    
    // Reset số lần chết khi qua checkpoint (chuyển giai đoạn)
    deathCount = 0;
    lastDeathLevel = 0;
    
    updateQuality();
    
    // RESET vị trí về đầu sau khi qua checkpoint (chuyển giai đoạn)
    resetPositionOnly();
}

// Không tự động khởi tạo game khi load trang
