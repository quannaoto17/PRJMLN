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
    { name: "Năm 2", icon: "🎓", pillarWidth: 35, gap: 250 },
    { name: "Năm 3", icon: "🎓", pillarWidth: 30, gap: 260 },
    { name: "Năm 4", icon: "🎓", pillarWidth: 25, gap: 270 }
];

let currentLevel = 0;
let currentChapter = 0;

// Ngân hàng câu hỏi (30 câu)
const questionBank = [
    // Nhóm dễ - Định nghĩa (10 câu)
    {
    q: "Việc học từng phần kiến thức nhỏ mỗi ngày phản ánh nội dung nào của quy luật lượng – chất?",
    a: [
      "Sự phát triển của con người chủ yếu do ý chí chủ quan quyết định, không phụ thuộc vào quá trình tích luỹ lâu dài",
      "Quá trình thay đổi liên tục về nhận thức mà không cần đến những bước chuyển biến căn bản",
      "Sự tích luỹ dần dần về lượng tạo tiền đề cho sự thay đổi về chất",
      "Sự thay đổi về chất diễn ra đồng thời với mọi thay đổi nhỏ về lượng",
    ],
    correct: 2,
    difficulty: "easy",
  },
  {
    q: "Khi lượng thay đổi nhưng chất của sự vật chưa thay đổi, sự vật đang ở trạng thái nào?",
    a: [
      "Giai đoạn chuyển hoá căn bản làm xuất hiện chất mới",
      "Thời điểm xảy ra bước nhảy trong quá trình phát triển",
      "Giai đoạn phủ định hoàn toàn chất cũ",
      "Độ",
    ],
    correct: 3,
    difficulty: "easy",
  },
  {
    q: "Bước nhảy trong quy luật lượng – chất được hiểu là gì?",
    a: [
      "Quá trình tích luỹ liên tục và kéo dài về lượng",
      "Sự chuyển hoá về chất khi lượng đạt tới điểm nút",
      "Sự biến đổi chậm rãi của chất trong toàn bộ quá trình phát triển",
      "Sự thay đổi do tác động ngẫu nhiên từ bên ngoài",
    ],
    correct: 1,
    difficulty: "easy",
  },
  {
    q: "Điểm nút là gì?",
    a: [
      "Khoảng thời gian tích luỹ lượng của sự vật",
      "Giới hạn mà tại đó sự thay đổi về lượng làm xuất hiện sự thay đổi về chất",
      "Mức độ biến đổi dần dần của lượng",
      "Quá trình vận động liên tục không gián đoạn",
    ],
    correct: 1,
    difficulty: "easy",
  },
  {
    q: "Phát biểu nào đúng với giáo trình Triết học Mác – Lênin?",
    a: [
      "Chất quyết định hoàn toàn lượng trong mọi trường hợp",
      "Lượng và chất tồn tại tách rời nhau trong quá trình phát triển",
      "Lượng là điều kiện của sự thay đổi về chất",
      "Chất có thể thay đổi mà không cần tích luỹ lượng",
    ],
    correct: 2,
    difficulty: "easy",
  },
  {
    q: "Khi chất mới xuất hiện, nó có vai trò gì?",
    a: [
      "Quy định sự vận động tiếp theo của lượng",
      "Phủ nhận hoàn toàn vai trò của lượng",
      "Không tác động trở lại quá trình phát triển",
      "Chỉ tồn tại trong thời gian ngắn",
    ],
    correct: 0,
    difficulty: "easy",
  },
  {
    q: "Phát triển theo quy luật lượng – chất có đặc điểm nào?",
    a: [
      "Chỉ diễn ra liên tục, không có gián đoạn",
      "Chỉ diễn ra thông qua các bước nhảy",
      "Vừa tích luỹ dần dần vừa có bước chuyển biến",
      "Diễn ra hoàn toàn ngẫu nhiên",
    ],
    correct: 2,
    difficulty: "easy",
  },
  {
    q: "Nếu lượng chưa đạt tới điểm nút thì điều gì xảy ra?",
    a: [
      "Chất thay đổi ngay lập tức",
      "Chất chưa thay đổi căn bản",
      "Chất bị phủ định hoàn toàn",
      "Sự vật ngừng phát triển",
    ],
    correct: 1,
    difficulty: "easy",
  },
  {
    q: "Quan hệ giữa lượng và chất là quan hệ nào?",
    a: [
      "Quan hệ một chiều",
      "Quan hệ ngẫu nhiên",
      "Quan hệ biện chứng",
      "Quan hệ tách rời",
    ],
    correct: 2,
    difficulty: "easy",
  },
  {
    q: "Phát biểu nào sau đây là sai?",
    a: [
      "Lượng thay đổi có thể dẫn đến thay đổi chất",
      "Chất mới xuất hiện khi lượng đạt điểm nút",
      "Chất mới tác động trở lại lượng",
      "Mọi thay đổi về lượng đều làm thay đổi chất",
    ],
    correct: 3,
    difficulty: "easy",
  },

  // Nhóm trung bình - Mối quan hệ (10 câu)
  {
    q: "Một người làm việc nhiều năm nhưng năng lực không thay đổi đáng kể phản ánh điều gì?",
    a: [
      "Người đó chưa làm việc đủ lâu",
      "Chưa xuất hiện bước nhảy về chất",
      "Lượng kinh nghiệm tích luỹ chưa đúng loại",
      "Tất cả các phương án trên",
    ],
    correct: 3,
    difficulty: "medium",
  },
  {
    q: "Doanh nghiệp tăng số lượng nhân viên nhưng hiệu quả không tăng chủ yếu vì:",
    a: [
      "Thiếu vốn đầu tư dài hạn",
      "Chưa thay đổi chất lượng quản lý",
      "Thị trường chưa ổn định",
      "Công nghệ chưa hiện đại",
    ],
    correct: 1,
    difficulty: "medium",
  },
  {
    q: "Học nhiều nhưng không sử dụng được ngoại ngữ cho thấy:",
    a: [
      "Lượng kiến thức tích luỹ còn ít",
      "Kiến thức chưa đủ để thay đổi nhận thức",
      "Chưa xuất hiện bước nhảy về kỹ năng",
      "Cả B và C đều đúng",
    ],
    correct: 3,
    difficulty: "medium",
  },
  {
    q: "Cải cách giáo dục không thể tiến hành trong thời gian ngắn vì:",
    a: [
      "Giáo dục thay đổi rất chậm",
      "Cần tích luỹ đủ điều kiện để thay đổi về chất",
      "Giáo dục phụ thuộc hoàn toàn vào kinh tế",
      "Giáo dục do nhà nước quản lý",
    ],
    correct: 1,
    difficulty: "medium",
  },
  {
    q: "Chuyển đổi số thành công trong doanh nghiệp thể hiện:",
    a: [
      "Sự thay đổi hình thức làm việc",
      "Sự thay đổi môi trường lao động",
      "Bước nhảy trong phương thức quản lý và sản xuất",
      "Sự thay đổi văn hoá doanh nghiệp",
    ],
    correct: 2,
    difficulty: "medium",
  },
  {
    q: "Việc tăng dần vốn đầu tư giúp doanh nghiệp:",
    a: [
      "Thay đổi cơ cấu khách hàng",
      "Tạo điều kiện mở rộng quy mô hoạt động",
      "Thay đổi hình thức sở hữu",
      "Thay đổi thị trường",
    ],
    correct: 1,
    difficulty: "medium",
  },
  {
    q: "Phát triển hạ tầng giao thông làm thay đổi kinh tế vùng vì:",
    a: [
      "Hạ tầng làm thay đổi xã hội",
      "Hạ tầng làm thay đổi văn hoá",
      "Tích luỹ điều kiện vật chất tạo thay đổi về chất",
      "Hạ tầng làm thay đổi tự nhiên",
    ],
    correct: 2,
    difficulty: "medium",
  },
  {
    q: "Vì sao đổi mới cần đúng thời điểm?",
    a: [
      "Đổi mới sớm luôn mang lại lợi ích",
      "Đổi mới muộn sẽ an toàn hơn",
      "Đổi mới phải phù hợp với điểm nút",
      "Đổi mới phụ thuộc ý chí con người",
    ],
    correct: 2,
    difficulty: "medium",
  },
  {
    q: "Phát triển kinh tế bền vững đòi hỏi:",
    a: [
      "Kết hợp tích luỹ và đổi mới",
      "Chỉ đổi mới liên tục",
      "Chỉ tích luỹ lâu dài",
      "Phát triển tự phát",
    ],
    correct: 0,
    difficulty: "medium",
  },
  {
    q: "Nhận định nào phản ánh đúng quy luật lượng – chất?",
    a: [
      "Muốn phát triển nhanh phải thay đổi liên tục",
      "Tích luỹ đủ điều kiện sẽ dẫn đến chuyển biến",
      "Ý chí quyết định sự phát triển",
      "Phát triển phụ thuộc hoàn toàn môi trường",
    ],
    correct: 1,
    difficulty: "medium",
  },

  // Nhóm khó - Vận dụng (10 câu)
  {
    q: "Mở rộng sản xuất khi chưa đủ vốn và nhân lực là biểu hiện của:",
    a: [
      "Phát triển bền vững theo nhu cầu thị trường",
      "Khuynh hướng bảo thủ trong quản lý",
      "Tả khuynh – nóng vội khi điều kiện chưa chín muồi",
      "Phát triển tự nhiên",
    ],
    correct: 2,
    difficulty: "hard",
  },
  {
    q: "Không đổi mới khi điều kiện đã chín muồi là biểu hiện của:",
    a: [
      "Hữu khuynh – bảo thủ, trì trệ",
      "Thận trọng cần thiết",
      "Phát triển ổn định",
      "Phát triển đúng quy luật",
    ],
    correct: 0,
    difficulty: "hard",
  },
  {
    q: "Sai lầm chung của tả khuynh và hữu khuynh là:",
    a: [
      "Phát triển quá nhanh",
      "Xa rời quy luật khách quan",
      "Phát triển quá chậm",
      "Thiếu nguồn lực",
    ],
    correct: 1,
    difficulty: "hard",
  },
  {
    q: "Áp dụng công nghệ mới khi nhân lực chưa sẵn sàng là:",
    a: [
      "Biểu hiện của tả khuynh",
      "Biểu hiện của hữu khuynh",
      "Đổi mới sáng tạo",
      "Phát triển nhanh",
    ],
    correct: 0,
    difficulty: "hard",
  },
  {
    q: "Trì hoãn cải cách khi thị trường đã thay đổi sẽ dẫn đến:",
    a: [
      "Ổn định kinh tế lâu dài",
      "Mất cơ hội phát triển",
      "Mất cơ hội tăng trưởng",
      "Tăng trưởng nhanh",
    ],
    correct: 1,
    difficulty: "hard",
  },
  {
    q: "Nhận định nào đúng theo triết học Mác – Lênin?",
    a: [
      "Tránh tả khuynh bằng cách không đổi mới",
      "Tránh hữu khuynh bằng cách đổi mới liên tục",
      "Tôn trọng quy luật lượng – chất",
      "Phát triển theo ý chí chủ quan",
    ],
    correct: 2,
    difficulty: "hard",
  },
  {
    q: "Phát triển nóng khi chưa đủ điều kiện sẽ dẫn đến:",
    a: [
      "Thành công nhanh",
      "Phát triển ổn định",
      "Thất bại hoặc khủng hoảng",
      "Thất bại hoặc phá sản",
    ],
    correct: 2,
    difficulty: "hard",
  },
  {
    q: "Doanh nghiệp có lợi nhuận tốt nhưng không mở rộng vì sợ rủi ro là gì?",
    a: [
      "Hữu khuynh - Bỏ lỡ cơ hội phát triển",
      "Tả khuynh",
      "Thận trọng đúng đắn",
      "An toàn tốt nhất",
    ],
    correct: 0,
    difficulty: "hard",
  },
  {
    q: "Cách mạng công nghiệp 4.0 yêu cầu doanh nghiệp phải làm gì?",
    a: [
      "Đợi người khác làm trước",
      "Giữ nguyên như cũ",
      "Chỉ tăng vốn",
      "Chuyển đổi số - Thực hiện bước nhảy về chất",
    ],
    correct: 3,
    difficulty: "hard",
  },
  {
    q: "Học đến đâu biết đến đó, không cần bằng cấp là quan điểm gì?",
    a: [
      "Hoàn toàn đúng",
      "Tả khuynh",
      "Tiến bộ hiện đại",
      "Hữu khuynh - Phủ nhận vai trò của bước nhảy về chất",
    ],
    correct: 3,
    difficulty: "hard",
  },
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
        baseSpeed = 10 + (currentLevelNum - 10) * 1.67 //;
    } else {
        // Đại học: 15 -> 20
        baseSpeed = 15 + (currentLevelNum - 13) * 1.25; //;
    }
    
    // Tăng tốc độ mỗi lần chết (+2 mỗi lần thay vì +1.5)
    const deathPenalty = deathCount * 2;
    
    // Nếu ở Đại học, khó GẤP ĐÔI
    const collegeMultiplier = isInCollege() ? 1.25 : 1;
    
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
        // THOẠI: Thất bại Tả Khuynh
        const failureDialogue = getFailureDialogue(currentLevelNum, false);
        showResult("SAI LẦM TẢ KHUYNH", failureDialogue);
        isAnimating = false;
    } 
    else if (effectiveBridgeLength > (gap + pWidth)) {
        // THOẠI: Thất bại Hữu Khuynh
        const failureDialogue = getFailureDialogue(currentLevelNum, false);
        showResult("SAI LẦM HỮU KHUYNH", failureDialogue);
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
            // Hiện tutorial TRƯỚC, sau đó mới thi
            pendingQuizGrade = 5; // Đánh dấu có quiz đang chờ
            setTimeout(() => {
                startTutorial('level6');
            }, 1000);
            return;
        }
        if (currentLevelNum == 10) {
            startCheckpointWithCountdown(9);
            return;
        }
        if (currentLevelNum == 13) {
            startCheckpointWithCountdown(12);
            return;
        }
        
        // ============ CHỈNH SỬA Ở ĐÂY ============
        // Kiểm tra thắng game (hoàn thành Đại học năm thứ 4)
        if (currentLevelNum > 16) {
            // THOẠI: Tốt nghiệp Đại học
            const graduationDialogue = getSuccessDialogue(16, true);
            // Hiển thị màn hình kết thúc game trước
            showResult("🎓 TỐT NGHIỆP ĐẠI HỌC!", graduationDialogue);
            
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
        
        // THOẠI: Vượt cột mốc thành công (BỎ QUA nếu là level 6 - đang có tutorial)
        if (currentLevelNum !== 6) {
            const successDialogue = getSuccessDialogue(currentLevelNum - 1, false);
            showDialogueNotification(successDialogue);
        }
        
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
        
        // Unlock click cho trường hợp chuyển màn thường (không có countdown)
        isAnimating = false;
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
    
    // KHÔNG unlock isAnimating ở đây - để các hàm gọi tự quản lý
    // isAnimating = false; (đã bỏ để tránh unlock sớm khi đang countdown)
    
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
        // Lưu thông tin để hiển thị trên màn hình game over
        const gameOverData = {
            level: currentLevelNum,
            attempts: deathCount,
            timestamp: new Date().toISOString()
        };
        
        // Chuyển sang màn hình game over với thông tin
        window.location.href = `game-over.html?level=${currentLevelNum}&attempts=${deathCount}`;
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
        
        // Unlock click cho replay level (không có countdown)
        isAnimating = false;
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
        
        // Unlock click cho reset game (không có countdown)
        isAnimating = false;
    }, 50);
}

// Reset vị trí về đầu khi chuyển giai đoạn (GIỮ LEVEL HIỆN TẠI)
function resetPositionOnly() {
    bridgeLength = 0;
    const currentWidth = levels[currentLevel].pillarWidth;
    isAnimating = true; // Khóa click khi chuyển cảnh
    
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
        
        // Hiển thị đếm ngược 5s
        const countdownDisplay = document.getElementById('countdown-display');
        if (countdownDisplay) {
            let countdown = 5;
            countdownDisplay.innerText = countdown;
            countdownDisplay.style.display = 'block';
            
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    countdownDisplay.innerText = countdown;
                } else {
                    clearInterval(countdownInterval);
                    countdownDisplay.style.display = 'none';
                    isAnimating = false;
                    console.log("✅ Có thể click tiếp!");
                }
            }, 1000);
        } else {
            // Fallback nếu không có countdown display
            setTimeout(() => {
                isAnimating = false;
                console.log("✅ Có thể click tiếp!");
            }, 5000);
        }
    }, 50);
}

function returnToMenu() {
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    resetGame();
}

// Hàm hiển thị thoại notification
function showDialogueNotification(text) {
    // Nếu đang tutorial thì không hiển thị thoại thường
    if (isTutorialActive) return;
    
    const notification = document.getElementById('dialogue-notification');
    const textEl = document.getElementById('dialogue-text');
    if (!notification || !textEl) return;
    
    textEl.innerText = text;
    notification.style.display = 'block';
    notification.style.position = 'fixed';
    notification.style.top = '130px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    
    // Ẩn nút skip cho thoại thường
    const skipBtn = document.getElementById('dialogue-skip');
    if (skipBtn) skipBtn.style.display = 'none';
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
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
    
    // Hiển thị tutorial level 1 khi vào từ intro
    const fromIntro = sessionStorage.getItem('from_intro');
    if (fromIntro === 'true') {
        sessionStorage.removeItem('from_intro');
        setTimeout(() => {
            startTutorial('level1');
        }, 1000);
    }
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
    
    // NGĂN SPAM: Disable nút submit ngay lập tức
    const submitButton = document.getElementById('submit-answer');
    if (submitButton.disabled) return; // Đã submit rồi, bỏ qua
    submitButton.disabled = true;
    
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
        
        // THOẠI: Trượt kỳ thi checkpoint
        const failDialogue = getFailureDialogue(checkpointLevel, true);
        
        showResult(
            `RỚT KỲ THI LỚP ${checkpointLevel}!`,
            failDialogue
        );
        
        // Đợi người dùng click "Thử lại" thì sẽ reset vị trí trong handleRetry()
    }
}

// Hiệu ứng bước nhảy hoàn thành
function showLeapComplete() {
    // THOẠI: Vượt checkpoint thành công
    const checkpointDialogue = getSuccessDialogue(checkpointLevel, true);
    
    const overlay = document.createElement('div');
    overlay.id = 'leap-complete-overlay';
    overlay.innerHTML = `
        <div class="leap-complete-content">
            <h1>🎉 BƯỚC NHẢY HOÀN THÀNH 🎉</h1>
            <h2>CHẤT MỚI RA ĐỜI</h2>
            <p>${checkpointDialogue}</p>
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

// ===== HỆ THỐNG TUTORIAL =====

// Hàm helper: Hiển countdown trước khi bắt đầu thi
function startCheckpointWithCountdown(grade) {
    const countdownDisplay = document.getElementById('countdown-display');
    if (!countdownDisplay) {
        isAnimating = false;
        startCheckpointQuiz(grade);
        return;
    }
    
    let countdown = 3;
    countdownDisplay.innerText = `Bắt đầu thi trong ${countdown}s...`;
    countdownDisplay.style.display = 'block';
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.innerText = `Bắt đầu thi trong ${countdown}s...`;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            isAnimating = false;
            startCheckpointQuiz(grade); // Bắt đầu thi!
        }
    }, 1000);
}

const tutorialData = {
    level1: [
        "🎯 Chào mừng đến với Con Đường Học Vấn!\n\nTrò chơi này về Quy luật: LƯỢNG ⟹ CHẤT",
        "📚 LƯỢNG là sự tích lũy dần dần\n(Nhấn giữ chuột = độ dài cây cầu)\n\n✨ CHẤT là bước nhảy vượt bậc\n(Sang cột tiếp theo = thành công)",
        "⚖️ ĐIỂM NÚT: Khoảng cách vừa đủ để cầu chạm cột\n\n⚠️ TẢ KHUYNH: Cầu quá ngắn (nôn nóng!)\n❌ HỮU KHUYNH: Cầu quá dài (trì trệ!)\n✅ CHÍNH XÁC: Vừa đủ lượng, đúng lúc!"
    ],
    level6: [
        "📝 Sắp đến Kỳ thi Chuyển cấp!\n\nBạn sẽ trả lời các câu hỏi biện chứng\ncủa môn Triết học 1 (MLN111)",
        "🎯 Quy tắc thi:\n• Trả lời đúng ≥ 50% số câu hỏi (Đạt đủ lượng)\n• Trong thời gian quy định\n• Đậu = Tiếp tục THCS\n• Trượt = Về đầu Tiểu học",
        "💡 Nội dung thi:\nCác khái niệm biện chứng cơ bản:\n• QUY LUẬT LƯỢNG - CHẤT\n• ĐIỂM NÚT chuyển hóa\n• TẢ KHUYNH và HỮU KHUYNH\n\nĐọc kỹ câu hỏi trước khi chọn!"
    ]
};

let currentTutorialMessages = [];
let currentTutorialIndex = 0;
let typingInterval = null;
let isTutorialActive = false;
let pendingQuizGrade = null; // Lưu grade của quiz đang chờ sau tutorial

function startTutorial(levelKey) {
    if (!tutorialData[levelKey]) return;
    
    currentTutorialMessages = tutorialData[levelKey];
    currentTutorialIndex = 0;
    isTutorialActive = true;
    isAnimating = true; // Khóa game
    
    showTutorialMessage();
}

function showTutorialMessage() {
    if (currentTutorialIndex >= currentTutorialMessages.length) {
        endTutorial();
        return;
    }
    
    const message = currentTutorialMessages[currentTutorialIndex];
    const notification = document.getElementById('dialogue-notification');
    const textEl = document.getElementById('dialogue-text');
    const skipBtn = document.getElementById('dialogue-skip');
    
    if (!notification || !textEl) return;
    
    // Hiển thị notification
    notification.style.display = 'block';
    notification.style.position = 'fixed';
    notification.style.top = '130px';
    textEl.innerText = '';
    
    // Hiển thị nút Skip
    if (skipBtn) {
        skipBtn.style.display = 'inline-block';
        skipBtn.onclick = skipToNextTutorialMessage;
    }
    
    // Typing animation
    let charIndex = 0;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        if (charIndex < message.length) {
            textEl.innerText += message.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            // Tự động chuyển sau 4 giây
            setTimeout(() => {
                if (isTutorialActive) {
                    nextTutorialMessage();
                }
            }, 4000);
        }
    }, 50);
}

function skipToNextTutorialMessage() {
    clearInterval(typingInterval);
    const message = currentTutorialMessages[currentTutorialIndex];
    const textEl = document.getElementById('dialogue-text');
    if (textEl) {
        textEl.innerText = message; // Hiển thị toàn bộ
    }
    // Chuyển ngay
    setTimeout(nextTutorialMessage, 500);
}

function nextTutorialMessage() {
    currentTutorialIndex++;
    showTutorialMessage();
}

function endTutorial() {
    clearInterval(typingInterval);
    isTutorialActive = false;
    
    const notification = document.getElementById('dialogue-notification');
    const skipBtn = document.getElementById('dialogue-skip');
    
    // Ẩn nút skip
    if (skipBtn) skipBtn.style.display = 'none';
    
    // Ẩn notification
    if (notification) {
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }
    
    // Kiểm tra nếu có quiz đang chờ
    if (pendingQuizGrade !== null) {
        const grade = pendingQuizGrade;
        pendingQuizGrade = null; // Reset
        startCheckpointWithCountdown(grade);
        return;
    }
    
    // Hiển thị countdown 5s trước khi cho phép chơi (tutorial bình thường)
    const countdownDisplay = document.getElementById('countdown-display');
    if (countdownDisplay) {
        let countdown = 5;
        countdownDisplay.innerText = countdown;
        countdownDisplay.style.display = 'block';
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownDisplay.innerText = countdown;
            } else {
                clearInterval(countdownInterval);
                countdownDisplay.style.display = 'none';
                isAnimating = false; // Mở khóa game
                console.log("✅ Tutorial hoàn thành! Có thể chơi!");
            }
        }, 1000);
    } else {
        isAnimating = false;
    }
}

// Không tự động khởi tạo game khi load trang
